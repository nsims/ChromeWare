// Adapted by Nathan Sims 
// from RetrieveAppInfo.js by the FireFix team

function applicationMapping(sAppId) {
	switch(sAppId){
		case "AQS 6.0":
			var ret = 343;
			break;
		case "AQS 7.0":
			var ret = 282;
			break;
		case "Waste 6.0":
			var ret = 351;
			break;
		case "Waste 7.0":
			var ret = 388;
			break;
		case "RCM 6.0":
			var ret = 344;
			break;
		case "RCM 7.0":
			var ret = 375;
			break;
		case "ACS 6.0":
			var ret = 383;
			break;
		case "ACS 7.0":
			var ret = 414;
			break;
		case "CMS 6.0":
			var ret = 350;
			break;
		case "CMS 7.0":
			var ret = 415;
			break;
		default:
			var ret = null;
			break;
	};
	return ret;

}


function getVersionInfo() {

	/* General Variables */
	var sAppId,
		sAppVersion,
		sAppBuild;
		
	var sVersioningMode,
		nVersioningLength;
		
	var asElementList = new Array();


	/* Determine the Versionning Mode */
	nVersioningLength = $('.VPACK b').length;
	if(nVersioningLength >= 1) { sVersioningMode = '.VPACK b'; }
	else {
		nVersioningLength = $('.VMOD b').length;
		if($('.VMOD b').length >= 1) { sVersioningMode = '.VMOD b'; }
		else {
			nVersioningLength = $('.VAPP b').length;
			if($('.VAPP b').length >= 1) { sVersioningMode = '.VAPP b'; }
			else { sVersioningMode = '.ERROR b'; }
		}
	}


	/* Retrieve the Application Id, Version & Build */
	/* In the same time, Establish the List of Elements of the Mode in the Solution */
	if(sVersioningMode != '.ERROR b') {
		var sUrl = $(location).attr('href');
		var asUrl = sUrl.split("/", 7);
		
		/*localhost behaviour */
		var nMax = 6;
		if(asUrl[2] == "localhost")
			nMax = 5;
			
		/* Get the ID of the application */
		var sAppIdOnURL = asUrl[nMax];
		for(var i = 0; i < nVersioningLength; i++) {
			/* Parse the Retrieved Text */
			var sAppVer = $(sVersioningMode).eq(i).text();
			
			var sTempAppVer = sAppVer.slice(1, sAppVer.length -1);
			var asTemp = sTempAppVer.split(" ", 2);
			var sTempAppId = asTemp[0];
			
			var sTemp = asTemp[1];
			asTemp = sTemp.split(".", 3);
			var sTempAppVersion = asTemp[0] + "." + asTemp[1];
			var sTempAppBuild = asTemp[2];
			
			/* Set the Variables that will Fill the Result Object */
			asElementList[i] = sAppVer + "¤" + sTempAppId + "¤" + sTempAppVersion + "¤" + sTempAppBuild;
			if(sAppIdOnURL.toLowerCase() == sTempAppId.toLowerCase() || nVersioningLength == 1) {
				sAppId = sTempAppId;
				sAppVersion = sTempAppVersion;
				sAppBuild = sTempAppBuild;
			}
		}
	} else {
		sAppId = 'ERROR';
	}

	// Display the results in the extension
	$('p #application').html(sAppId);
	$('p #release').html(sAppVersion);
	$('p #build').html(sAppBuild);
	// $('p #asversion').html();
	// $('p #asbuild').html();


	/* Send the Result */
	// var oResult = new Object();
		// oResult.nNbElements = nVersioningLength;
		// oResult.sMode = sVersioningMode.slice(1, sVersioningMode.length -2);
		
		// oResult.sAppId = sAppId;
		// oResult.sAppVersion = sAppVersion;
		// oResult.sAppBuild = sAppBuild;
		
		// oResult.asElementsList = asElementList;

	// self.postMessage(oResult);
}