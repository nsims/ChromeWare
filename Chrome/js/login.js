var Logger = function(params){
	var params = params || {};
	this.pingUrl = "https://software.enablon.com/Software/?u=ver&pm=6&aformat=1";
	this.swUrl = 'https://software.enablon.com/enablon/?OStId=Software';
	this.Crypt = params.Crypt || new LazyCrypt();
}

Logger.prototype.getConnectToSW = function(){
	var self = this;
	return function () {
		var swLogin = $("input[name='loginInput']").val();
		var swPwd = $("input[name='passwordInput']").val();
		if(!(swLogin && swPwd)){
			displayAlert("Login and Password must contain a value");
		}
		else{
			self.connectToSW(swLogin, swPwd);
			if($("input[name='rememberPWD']").is(':checked')){
				self.saveSWCred(swLogin, swPwd);
			}
			self.hideLogin();
		}
	}
}

Logger.prototype.hideLogin = function(){
	$(":button").show();
	$(".myLogin").hide();
	$("#loginWindow").hide();
	$("#" + localStorage.getItem('CF-lastwindow')).show();
}

Logger.prototype.showLogin = function(inMainTab){
	if(!(inMainTab == false)){
		switchWindow("btn-cancel")();
	}
		//$(":button").hide();
	//$("#btn-create").prop("disabled",false);
	$(".window").hide();
	$("#loginWindow").show();
	$(".myLogin").show();
}


Logger.prototype.logoutFromSW = function(){
	$.post("https://software.enablon.com/Software/?u=logoff")
	$("#btn-logout").addClass("hide");
	$("#btn-login").removeClass("hide");
}


Logger.prototype.saveSWCred = function(swLogin, swPwd){
	if(!(swLogin && swPwd)){
		localStorage.removeItem("swLogin");
		this.Crypt.clearStorage();
	}
	else {
		localStorage["swLogin"] = swLogin;
		this.Crypt.encrypt({pass:swPwd});
	}
}

Logger.prototype.loginToSW = function()
{
	//get credential
	var loginPwdArray = this.getSWCred();
	var swLogin = loginPwdArray[0];
	var swPwd = loginPwdArray[1];
	if(!(swLogin == null || swPwd == null)){
		this.connectToSW(swLogin, swPwd);
	}
	else {
		console.log('loginToSW');
		if(localStorage.getItem('CF-lastwindow') == ("main" || null))
		{
			this.showLogin();
		}
		
	}
}

Logger.prototype.getSWCred = function()
{
	// to refactor to merge with the code in option.js
	var swLogin = localStorage["swLogin"];
	var swPwd = this.Crypt.decrypt();
	return [swLogin, swPwd];
}

Logger.prototype.connectToSW = function(swLogin, swPwd)
{
	var self = this;
	var data= {uid:swLogin, sid:'enablon', Var_BuilderKeyAutoLogin: '', pwd:swPwd, LogIn:'OK', LogIn:'Log In'};
	$.ajax({
		type: 'POST',
		url: self.swUrl,
		data: data,
		async: true,
		timeout: 6000,
		success:function(data) {
			nConnected = data.indexOf('<TITLE>Dashboards</TITLE>');
			if(!(nConnected > 0))
			{
				console.log('connectToSW');
				if(localStorage.getItem('CF-lastwindow') == ("main" || null))
				{
					self.showLogin();
				}
				else {
					displayAlert("You are not logged to software", 'alert-warning');
					$("#btn-create").prop("disabled",true);
				}
			}
			else{
				console.log('connectToSW we are connected');
				$("#btn-login").addClass("hide");
				$("#btn-logout").removeClass("hide");
			}
		},
		error:function(){
				displayAlert("failed to connect to SW");
				if(localStorage.getItem('CF-lastwindow') == ("main" || null))
				{
					self.showLogin();
				}
		}
	});
}


Logger.prototype.initialize = function()
{
	console.log("initialize");
	var self = this;
	var loginPwdArray = this.getSWCred();
	var swLogin = loginPwdArray[0];
	var swPwd = loginPwdArray[1];
	if(swLogin == null || swPwd == null){
		console.log("no saved log pwd");
		var checkSWConnection = this.checkSWConnection();
		if(localStorage.getItem('CF-lastwindow') == ("main" || null))
		{
			console.log("sur la main sans histo");
			checkSWConnection.then(
				function(response, statusText, xhrObj){
					var nError = response.indexOf("error");
					console.log("nError: " + nError);
					if(nError == -1){
						//console.log("not connected so let's try 1");
						self.hideLogin();
						$("#btn-logout").removeClass("hide");
						$("#btn-login").addClass("hide");
					}
					else{
						self.showLogin();
						$("#btn-login").removeClass("hide");
						$("#btn-logout").addClass("hide");
					}
				}
			)
		}
		else
		{
			//var checkSWConnection = this.checkSWConnection();
			checkSWConnection.then(
			function(response, statusText, xhrObj) {
				console.log("done done done" + response + '_' +statusText);
				var nError = response.indexOf("error");
				if(nError > 0){
					//console.log("not connected so let's try 1");
					displayAlert("You are not logged to software", 'alert-warning');
					$("#btn-create").prop("disabled",true);
				}
				else{
					console.log('you are connected');
					$("#btn-logout").removeClass("hide");
					$("#btn-login").addClass("hide");
				}
			},
				function(xhrObj, textStatus, err) {
				
					displayAlert("You are not logged to software", 'alert-warning');
					console.log("l 149");
			}
			);
		}
	}
	else
	{
		var checkSWConnection = this.checkSWConnection();
		checkSWConnection.then(
			function(response, statusText, xhrObj) {
				console.log("done done done:)" + response + '_' +statusText);
				$( ".waitingForSW").hide();
				var nError = response.indexOf("error");
				if(nError > 0){
					console.log("not connected so let's try");
					self.loginToSW();
				}
				else{
					$("#btn-LoginToSW").hide();
					self.hideLogin();
					console.log('we are logged and return should  be true');
					//self.connectToSW();
					$("#btn-logout").removeClass("hide");
					$("#btn-login").addClass("hide");
					console.log('connected we should be logged')
				}
			},
			function(xhrObj, textStatus, err) {
				console.log('Error occured in checkSWConnection: ' + textStatus + "_" + err);
				displayAlert("Cannot connect to software: " + err);
				$("#alertMsg").text("Can't connect to software");
				self.showLogin();
			}
		);
	}
}

Logger.prototype.checkSWConnection = function()
{
	console.log("in checkSWConnection");
	var self = this;
	var data;
	return Promise.resolve($.ajax({
            url: this.pingUrl,
			type: 'GET',
			timeout: 5000,
			cache: false
			})
	);
}

