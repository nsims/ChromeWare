// Written by Nathan Sims 
// inspired by RetrieveAppInfo.js by the FireFix team

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
					//TODO: figure out this condition for real
					if(shortClassName === mapAppIdToModuleName(appId)) {
						$('#application').html(shortClassName);
						var releaseAndBuild = appElementPieces[1];
						var appBuildPieces = releaseAndBuild.split(".");
						release = appBuildPieces[0] + "." + appBuildPieces[1];
						buildNo = appBuildPieces[2];
					}
				};
				
				$('#release').html(release);
				$('#build').html(buildNo);
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
				
				var asBuild = data.substring(buildIndex + 6, data.length);
				$('#asbuild').html(asBuild);
			}
		}
	);
}

function getVersionInfo() {

	var thisURL = null;
	
	chrome.tabs.query({active: true, currentWindow: true}, 
		function(tabs){ 
		
			// Get URL of current page
			thisURL = tabs[0].url;
			
			var urlPieces = thisURL.split("/");
			var domain = urlPieces[2];
			var serverVer = urlPieces[3];
			var siteId = urlPieces[4];
			var appId = urlPieces[6];
			var pageId = urlPieces[7];
			
			// Check to make sure this is an enablon site before ajax calls
			if(domain.indexOf("enablon") == -1) {
				return
			}
			
			// Determine URLs of version pages for this site
			var basicSiteUrlPieces = urlPieces.slice(0, 6);
			var verPageUrlStub = basicSiteUrlPieces.join("/");
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
	); //end chrome.tabs.query function
}