var LazyCrypt = function(params){
	var params = params || {};
	var size;
	
	this.hashFn = params.hashFn || CryptoJS.MD5;
	this.encryptFn = params.encryptionFn || CryptoJS.AES.encrypt;
	this.decryptFn = params.decryptionFn || CryptoJS.AES.decrypt;
	this.opts = params.opts || { format: CryptoJS.JsonFormatter };
	this.enc = params.encoding || CryptoJS.enc.Utf8;
	this.storedKey = params.fieldName || "encryptedPassPart";
	this.storedHash = params.hashName || "hashPass";
	this.storedKeys = [this.storedKey];
	size = params.size || 30;
	
	//Init the hash
	var storedHash = localStorage[this.storedHash];
	if(typeof storedHash === 'undefined'){
		this.initHash(size);
	}
};

LazyCrypt.prototype.makeRandStr = function(size){
	var buf = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]";
	var possibleLen = possible.length;
	var i, pos;
	
	for(i = 0; i < size; i++){
		pos = Math.floor(Math.random() * possibleLen);
		buf.push(possible.charAt(pos));
	}
	return buf.join('');
};

LazyCrypt.prototype.initHash = function(size){
	var size = size || 30;
	var hash = this.hashFn(this.makeRandStr(size));
	hashPass = hash.toString();
	localStorage[this.storedHash] = hashPass;
};

LazyCrypt.prototype.addKey = function(key){
	if(this.storedKeys.indexOf(key) != -1){
		this.storedKeys.push(key);
	}
};

LazyCrypt.prototype.encrypt = function(opts){
	var opts = opts || {};
	var encryptedPassPart;
	var respText;
	var suc = false;
	var hash = localStorage[this.storedHash];
	
	var pass = opts.pass || '';
	var callback = opts.callback;
	var key = opts.field || this.storedKey;
	this.addKey(key);
	if(pass.length > 0){
		encryptedPassPart = this.encryptFn(pass, hash, this.opts);
		localStorage[key] = encryptedPassPart;
		respText = 'Password Set';
		suc = true;
	}
	else{
		respText = 'You must enter a password that has a length greater than 0';
	}
	var response = { text: respText,  success: suc};
	if(typeof callback === 'function'){
		callback(response);
	}
};

LazyCrypt.prototype.decrypt = function(opts){
	var opts = opts || {};
	var key = opts.key || this.storedKey;
	
	var encryptedPassPart = localStorage[key];
	var secret = localStorage[this.storedHash];
	var ret;
	
	if(typeof encryptedPassPart !== 'undefined' && typeof secret !== 'undefined'){
		ret = this.decryptFn(encryptedPassPart, secret, this.opts).toString(this.enc);
	}
	return ret;
};

LazyCrypt.prototype.clearStorage = function(){
	var fieldsToClear = this.storedKeys.concat(this.storedHash);
	var i, len;
	for(i = 0, len = fieldsToClear.length; i < len; i++){
		localStorage.removeItem(fieldsToClear[i]);
	}
};