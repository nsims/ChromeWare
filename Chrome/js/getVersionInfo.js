// Written by Nathan Sims 
// inspired by RetrieveAppInfo.js by the FireFix team

function initializeVersions(){
	var products = [];
	//AQS
	localStorage.setItem("AQS 6.0", 343);
	products.push("AQS 6.0");
	localStorage.setItem("AQS 7.0", 282);
	products.push("AQS 7.0");
	localStorage.setItem("AQS 7.2", 539);
	products.push("AQS 7.2");
	localStorage.setItem("AQS 7.5", 603);
	products.push("AQS 7.5");
	
	//WMS
	localStorage.setItem("Waste 6.0", 351);
	products.push("Waste 6.0");
	localStorage.setItem("Waste 7.0", 388);
	products.push("Waste 7.0");
	localStorage.setItem("Waste 7.2", 565);
	products.push("Waste 7.2");
	localStorage.setItem("Waste 7.5", 566);
	products.push("Waste 7.5");
	
	//RCM
	localStorage.setItem("RCM 6.0", 344);
	products.push("RCM 6.0");
	localStorage.setItem("RCM 7.0", 375);
	products.push("RCM 7.0");
	localStorage.setItem("RCM 7.2", 535);
	products.push("RCM 7.2");
	localStorage.setItem("RCM 7.5", 560);
	products.push("RCM 7.5");
	
	//ACS
	localStorage.setItem("ACS 6.0", 383);
	products.push("ACS 6.0");
	localStorage.setItem("ACS 7.0", 414);
	products.push("ACS 7.0");
	localStorage.setItem("ACS 7.2", 554);
	products.push("ACS 7.2");
	localStorage.setItem("ACS 7.5", 561);
	products.push("ACS 7.5");
	
	//CMS
	localStorage.setItem("CMS 6.0", 350);
	products.push("CMS 6.0");
	localStorage.setItem("CMS 7.0", 415);
	products.push("CMS 7.0");
	
	//HO
	localStorage.setItem("HO 7.0", 347);
	products.push("HO 7.0");
	localStorage.setItem("HO 7.2", 524);
	products.push("HO 7.2");

	//AutoDeliver 7.2
	localStorage.setItem("AutoDeliver 7.2", 645);
	products.push("AutoDeliver 7.2");
	
	localStorage.setItem("Products", products.join("§"));
}

function applicationMapping(sAppId) {
	switch(sAppId){
		case "AQS 6.0":
			var ret = 343;
			break;
		case "AQS 7.0":
			var ret = 282;
			break;
		case "AQS 7.2":
			var ret = 539;
			break;
		case "AQS 7.5":
			var ret = 603;
			break;
		case "Waste 6.0":
			var ret = 351;
			break;
		case "Waste 7.0":
			var ret = 388;
			break;
		case "Waste 7.2":
			var ret = 565;
			break;
		case "Waste 7.5":
			var ret = 566;
			break;
		case "RCM 6.0":
			var ret = 344;
			break;
		case "RCM 7.0":
			var ret = 375;
			break;
		case "RCM 7.2":
			var ret = 535;
			break;
		case "RCM 7.5":
			var ret = 560;
			break;
		case "ACS 6.0":
			var ret = 383;
			break;
		case "ACS 7.0":
			var ret = 414;
			break;
		case "ACS 7.2":
			var ret = 554;
			break;
		case "ACS 7.5":
			var ret = 561;
			break;
		case "CMS 6.0":
			var ret = 350;
			break;
		case "CMS 7.0":
			var ret = 415;
			break;
		case "HO 7.0":
			var ret = 347;
			break;
		case "HO 7.2":
			var ret = 524;
			break;
		case "AutoDeliver 7.2":
			var ret = 645;
			break;
		case "WizFrame 6.0":
			var ret = 428;
			break;
		default:
			var ret = null;
			break;
	};
	return ret;

}

function mapAppIdToModuleName(appId) {
	// Hardcoded for now, since the VPACK elements of the version 
	// page are simply bold text with no mapping tools available
	switch(appId) {
		case "rc":
			return "RCM";
			break;
		case "ho":
			return "HO";
			break;
		case "PY":
			return "PYPKG";
			break;
		case "ra":
			return "RM";
			break;
		case "ch":
			return "CMS";
			break;
		case "AE":
			return "AQS";
			break;
		case "WA":
			return "Waste";
			break;
		case "ims":
			return "EMS";
			break;
		case "sd":
			return "SD";
			break;
		case "CR":
			return "CSR";
			break;
		case "MC":
			return "MoC";
			break;
		case "tp":
			return "Prof";
			break;
		case "acs":
			return "ACS";
			break;
		case "ic":
			return "IC";
			break;
		case "ca":
			return "CA";
			break;
		case "AP":
			return "AP_Pkg";
			break;
		case "IA":
			return "IA";
			break;
		case "bc":
			return "BCM";
			break;
		case "fw":
			return "WizFrame";
			break;
		case "dl":
			return "AutoDeliver";
			break;
		case "dl":
			return "AutoDeliver";
			break;
		default:
			return ""
	}
}

function processAppBuildInfo(appVerPageUrl, appId) {
	// Process content from application version page
	$.get(appVerPageUrl,
		function (data, status) {
			if(status === 'success') {
				var appInfo = $(' .VPACK b', data);
				
				var shortClassName = '';
				var release = '';
				var buildNo = '';
				
				for(var i = 0; i < appInfo.length; i++) {
					var appElement = appInfo[i].innerHTML;
					var strippedAppElement = appElement.slice(1, appElement.indexOf(']'));
					var appElementPieces = strippedAppElement.split(" ");
					shortClassName = appElementPieces[0];
					
					if(shortClassName === mapAppIdToModuleName(appId)) {
						$('#application').html(shortClassName);
						localStorage.setItem("CW-application", shortClassName);
						var releaseAndBuild = appElementPieces[1];
						var appBuildPieces = releaseAndBuild.split(".");
						release = appBuildPieces[0] + "." + appBuildPieces[1];
						buildNo = appBuildPieces[2];
					}
				};
				console.log('release = ' + release);
				console.log('buildNo = ' + buildNo);
				$('#release').html(release);
				$('#build').html(buildNo);

				//Store values
				localStorage.setItem("CW-release", release);
				localStorage.setItem("CW-build", buildNo);
			}
		}
	);
}

function processASBuildInfo(ASVerPageUrl) {
	// Process content from as build version page
	$.get(ASVerPageUrl,
		function (data, status) {
			if(status === 'success') {
				var buildIndex = data.indexOf("build");
				var startIndex = 0;
				if(data.indexOf("v") == 0) {
					startIndex = 1; //because it starts with v, like v6.0-7
					// as opposed to being one of the named server versions
				};
				var asRelease = data.substring(startIndex, buildIndex - 1);
				$('#asversion').html(asRelease);
				
				var asBuild = data.substring(buildIndex + 6, data.indexOf("<div"));
				$('#asbuild').html(asBuild);

				//Store values
				localStorage.setItem("CW-asRelease", asRelease);
				localStorage.setItem("CW-asBuild", asBuild);
			}
		}
	);
}

function checkPlatformSession(){

$("#btn-createRequest").prop("disabled",true);
$("#btn-createASRequest").prop("disabled",true);
$("#btn-createFWRequest").prop("disabled",true);
chrome.tabs.query({active: true, currentWindow: true}, 
	function(tabs){
		// Get URL of current page
		thisURL = tabs[0].url;
		
		var urlPieces = thisURL.split("/");
		var domain = urlPieces[2];
		var serverVer = urlPieces[3];
		var siteId = urlPieces[4];
		var aspQueryStart = urlPieces[5];
		var appId = urlPieces[6];
		var pageId = urlPieces[7];
		
		console.log(urlPieces);
		// Check to make sure this is an enablon site before ajax calls
		if(domain.indexOf("enablon") == -1) {
			return
		}
		
		var domainPieces = domain.split(".");
		var enablonServer = domainPieces[0];
	
	
		
		if(["inno", "innous", "inno2"].indexOf(enablonServer) > -1) {	
			$.get(tabs[0].url,
				function (data, status) {
					if(status === 'success') {
						var form = data.indexOf("LoginForm");
						if(form == -1){ //So user is already logged into site
							$("#btn-createRequest").prop("disabled",false);
						}
						else{
							displayAlert("You are logged out of this site", 'alert-danger')
						}
					}
				});
		}
	});
}

function parseURLParams(queryStr, queryStrParams) {
	// Takes a string from a url and fills the queryStrParams object with "param" -> value pairs from it
	var parameters = queryStr.split("&");
	
	for(var i = 0; i < parameters.length; i++) {
		var param = parameters[i];
		var pair = param.split('=');
		var val = "";
		if(pair.length == 2) { 
			val = pair[1]; 
		};
		queryStrParams[pair[0]] = val;
	}
}


function getVersionInfo() {

	var thisURL = null;

	if(localStorage.getItem("CF-lastwindow") == "create-request"){
		chrome.tabs.query({active: true, currentWindow: true}, 
			function(tabs){ 
	                                
				// Get URL of current page
				thisURL = tabs[0].url;
				
				var urlPieces = thisURL.split("/");
				var urlPiecesCount = urlPieces.length;
				
				var domain = urlPieces[2];
				var serverVer = urlPieces[3];
				var siteId = urlPieces[4];
				var aspQueryStart = urlPieces[5];
				
				var appId;
				var queryStrParams = {};
				
				if(urlPiecesCount > 6){
					appId = urlPieces[6];
					if(appId.toLowerCase() == "adm" && urlPiecesCount > 7) {
						parseURLParams(urlPieces[7], queryStrParams);
						appId = queryStrParams["bs"];
					}
				}
				
				console.log(urlPieces);
				// Check to make sure this is an enablon site before ajax calls

				$('#url').val(thisURL);
				localStorage.setItem("CW-url", thisURL);
				
				if(domain.indexOf("enablon") == -1) {
					return
				}
				
				var domainPieces = domain.split(".");
				var enablonServer = domainPieces[0];
			
			
				
				if(["inno", "innous", "inno2"].indexOf(enablonServer) > -1) {	
					// Determine URLs of version pages for this site
					var basicSiteUrlPieces = urlPieces.slice(0, 5);
					var verPageUrlStub = basicSiteUrlPieces.join("/") + '/?u=';
					
					var appVerPageUrl = verPageUrlStub + '/ver';
					var ASVerPageUrl = verPageUrlStub + 'ver';
					
					processAppBuildInfo(appVerPageUrl, appId);
					processASBuildInfo(ASVerPageUrl);
					
					// if(nVersioningLength >= 1) { sVersioningMode = '.VPACK b'; }
					// else {
						// nVersioningLength = $('.VMOD b').length;
						// if($('.VMOD b').length >= 1) { sVersioningMode = '.VMOD b'; }
						// else {
							// nVersioningLength = $('.VAPP b').length;
							// if($('.VAPP b').length >= 1) { sVersioningMode = '.VAPP b'; }
							// else { sVersioningMode = '.ERROR b'; }
						// }
					// }
				}
				
			}
		); //end chrome.tabs.query function
	}
	else{
		$('#release').html(localStorage.getItem("CW-release"));
		$('#build').html(localStorage.getItem("CW-build"));
		$('#application').html(localStorage.getItem("CW-application"));

		$('#asbuild').html(localStorage.getItem("CW-asBuild"));
		$('#asversion').html(localStorage.getItem("CW-asRelease"));
	}
}

function getURLPath(mode, baseUrl){

	switch(mode){
		case "newRequestParams":
			switch (localStorage.getItem("CW-type")){
							case "Bug": var type = "BG"; break;
							case "Enhancement": var type = "EV"; break;
							case "Product Opening": var type = "OR"; break;
							case "Question": var type = "QU"; break;
							default: var type = "BG"};
			switch (localStorage.getItem("CW-severity")){
							case "Severe": var severity = "1"; break;
							case "Major": var severity = "2"; break;
							case "Minor": var severity = "3"; break;
							default: var severity = "3"};
			switch (localStorage.getItem("CW-priority")){
							case "Immediate": var priority = "1"; break;
							case "At the earliest": var priority = "2"; break;
							case "Normal": var priority = "3"; break;
							case "Later": var priority = "4"; break;
							default: var priority = "3"};
			//Retrieves the values of the text fields from localStorage
			var behavior = localStorage.getItem("CW-behavior");
			var appBuild = localStorage.getItem("CW-appBuild");
			var asBuild = localStorage.getItem("CW-asBuild");
			var asVersion = localStorage.getItem("CW-appVersion");
			var stepstoreproduce = localStorage.getItem("CW-stepstoreproduce");
			var title = localStorage.getItem("CW-title");
			var url = localStorage.getItem("CW-url");
			var loginpwd = localStorage.getItem("CW-loginpwd");


			//If we cannot get the build of the application and AS, we prepend what we know to the behavior
			if(appBuild != null && asBuild != null){
				behavior = behavior + "\n\n\n\n--------------------\n\n";
				if(asVersion != null){
					behavior = behavior + "Product: " + asVersion + "\n";
				};
				behavior = behavior + "Product Build: " + appBuild + "\nAS Build: " + asBuild;
			};
			
			returnURL = 	baseUrl + 
							"&Fld__xml_Type=" + type +
							"&Fld__xml_Severity=" + severity +
							"&Fld__xml_Priority=" + priority +
							"&Fld__xml_Title=" + encodeURIComponent(title) +
							"&Fld__xml_StepsToReproduce=" + encodeURIComponent(stepstoreproduce) +
							"&Fld__xml_Description=" + encodeURIComponent(behavior) +
							"&Fld__xml_URL=" + encodeURIComponent(url) +
							"&Fld__xml_LoginPassword=" + encodeURIComponent(loginpwd) +
							"&ext=1";
			break;
		default: 
			returnURL = baseUrl;
	}


	return returnURL;
}
