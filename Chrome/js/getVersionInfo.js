// Written by Nathan Sims 
// inspired by RetrieveAppInfo.js by the FireFix team

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
		case "HO 7.0":
			var ret = 347;
			break;
		case "HO 7.2":
			var ret = 524;
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
			return "Wizframe";
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
									console.log("huh?")
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


function getVersionInfo() {

	var thisURL = null;

	console.log("debug");
	if(localStorage.getItem("CF-lastwindow") == "create-request"){
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

				$('#url').val(thisURL);
				localStorage.setItem("CW-url", thisURL);
				
				if(domain.indexOf("enablon") == -1) {
					return
				}
				
				var domainPieces = domain.split(".");
				var enablonServer = domainPieces[0];
			
			
				
				if(["inno", "innous", "inno2"].indexOf(enablonServer) > -1) {	
					// Determine URLs of version pages for this site
					var basicSiteUrlPieces = urlPieces.slice(0, 6);
					var verPageUrlStub = basicSiteUrlPieces.join("/");
					
					//Many pages when you first log in have no "go.asp" in the URL
					//but we need that, so we'll process it like it does have it.
					if(aspQueryStart == "" || aspQueryStart == null){
						switch (serverVer) {
							case "Bespin":
								aspQueryStart = "go.aspx?u=";
								break;
							case "Coruscant":
								aspQueryStart = "go.aspx?u=";
								break;
							
							default:
								aspQueryStart = "go.asp?u=";
						}
						verPageUrlStub = verPageUrlStub + aspQueryStart
					}
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
				behavior = behavior + "%0A%0A%0A%0A--------------------%0A%0A";
				if(asVersion != null){
					behavior = behavior + "Product: " + asVersion + "\n";
				};
				behavior = behavior + "Product Build: " + appBuild + "\nAS Build: " + asBuild;
			};
			console.log("Should be seen");
			returnURL = 	baseUrl + 
							"&Fld__xml_Type=" + type +
							"&Fld__xml_Severity=" + severity +
							"&Fld__xml_Priority=" + priority +
							"&Fld__xml_Title=" + title +
							"&Fld__xml_StepsToReproduce=" + stepstoreproduce.replace(/\n/g, "%0A") +
							"&Fld__xml_Description=" + behavior.replace(/\n/g, "%0A") +
							"&Fld__xml_URL=" + url +
							"&Fld__xml_LoginPassword=" + loginpwd +
							"&ext=1";
			break;
		default: 
			console.log("Should NOT be seen");
			returnURL = baseUrl;
	}


	return returnURL;
}
