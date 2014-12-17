// ChromWare Team - Enablon NA
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var sGoAsp = "go.asp";
var sGoAspU = "go.asp?u=";
var sGoAspx = "go.aspx";
var sGoAspxU = "go.aspx?u=";

var softwareURL = "https://software.enablon.com/Software/";

var createRequestURL = "/Referent/Prods/RqProd&tm=1";
var newRequestURL = "/Referent/Rqtes&pm=0&tm=1";
var fireFixRequestURL = "/Referent/FFRq&Process=nGetAllElements";

var reqUrl = softwareURL + sGoAspU + createRequestURL;								//URL for prefilled requests
var ffUrl = softwareURL + sGoAspU + fireFixRequestURL;								//URL for firefix's software page to retreive id's
var newReqUrl = softwareURL + sGoAspU + newRequestURL;								//URL for new request creation (outside of version folder)

var index = 1;																		//index for screenshot count






/*
	newTab
	@desc: 		Callback function to open tabs from the value field on a button
	@param 	string id - 	id of the element
	@author: Parth Narielwala
*/
function newTab(id) {
	return function () {
		createTab(id);
	}
}



/*
	openTab
	@desc: 		Opens a new tab in the Chome's tab action
	@param 	string url - 	url of the page user wants to open
	@author: Parth Narielwala
*/
function openTab(url) {

	chrome.tabs.create({ url: url });
}



/*
	createTab
	@desc: 		Grabs the url from the element and then calls a function to open tab
	@param 	string id - 	id of the element
	@author: Parth Narielwala
*/
function createTab(id) {
	var url = $('#' + id).attr("value");
	$('#' + id).click(openTab(url));
}



/*
	injectJavaScript
	@desc: 		Injects scripts into the software creation page to fill values from the form
	@author: Parth Narielwala
*/
function injectJavaScript() {

	chrome.tabs.onCreated.addListener(function(tab) {
		
		var input = "";

		if(localStorage.getItem("CW-urlParams") == "no"){
			//This handles the conversion for the dropdown inputs
			switch (localStorage.getItem("CW-type")){
							case "Bug": var type = "0"; break;
							case "Enhancement": var type = "1"; break;
							case "Product Opening": var type = "2"; break;
							case "Question": var type = "3"; break;
							default: var type = "0"};
			switch (localStorage.getItem("CW-severity")){
							case "Severe": var severity = "0"; break;
							case "Major": var severity = "1"; break;
							case "Minor": var severity = "2"; break;
							default: var severity = "2"};
			switch (localStorage.getItem("CW-priority")){
							case "Immediate": var priority = "0"; break;
							case "At the earliest": var priority = "1"; break;
							case "Normal": var priority = "2"; break;
							case "Later": var priority = "3"; break;
							default: var priority = "2"};
			
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

			//Create a string of javascript that will be injected into the software page
			input = 'var type = "' + type + '";' +
					' var severity = "' + severity + '";' +
					' var priority = "' + priority + '";' +
					' var title = "' + title + '";' +
					' var behavior = "' + behavior.replace(/\n/g, "&sect;") + '";' +
					' var stepstoreproduce = "' + stepstoreproduce.replace(/\n/g, "&sect;") + '";' +
					' var url = "' + url + '";' +
					' var loginpwd = "' + loginpwd + '";';
						
		}
		
		//We clear the request form			
		clearRequestAfterCreation();

		//Testing
		/*console.log("from chromeware");
		chrome.tabs.executeScript(null, {code: "alert('Hello World')"} );
		localStorage.setItem("ErrorMsg", tab.id);
		input = input + ' console.log("come onn")';*/
		
		//Inject the scripts
		chrome.tabs.executeScript(tab.id, {code: input} );
		chrome.tabs.executeScript(tab.id, {file: 'js/fillRequest.js'});
	});
}



/*
	clearRequestAfterCreation
	@desc: 		Clears the request form after prefilling the softare request
	@author: Parth Narielwala
*/
function clearRequestAfterCreation(){

		//figure out how to call these in the different files
		localStorage.removeItem("CW-appBuild");
		localStorage.removeItem("CW-asBuild");
		localStorage.removeItem("CW-appVersion");
		//clear fields
		localStorage.removeItem("CW-type");		
		localStorage.removeItem("CW-severity");		
		localStorage.removeItem("CW-priority");		
		localStorage.removeItem("CW-behavior");		
		localStorage.removeItem("CW-title");		
		localStorage.removeItem("CW-stepstoreproduce");		
		localStorage.removeItem("CW-url");		
		localStorage.removeItem("CW-loginpwd");	
		//reset section
		$('#collapseOne').addClass('in');
		$('#collapseOne').css({height: 'auto'});
		$('#collapseTwo').removeClass('in');
		$('#collapseTwo').css({height: '0px'});
		$('#collapseThree').removeClass('in');
		$('#collapseThree').css({height: '0px'});
		localStorage.setItem("CF-lastsection", 'collapseOne');	
		//reset window
		localStorage.setItem("CF-lastwindow", "main");
}




/*
	createRequest
	@desc: 		Creates the request and applies the appropriate url parameters
	@author: Parth Narielwala
*/
function createRequest() {

	return function (){	

		//Call a function to check if the required fields are filled
		var requiredFilled = checkRequiredFields();

		//If the fields are filled...
		if(requiredFilled){

			//Builds a URL to make an ajax call to retrieve id's of the links
			var urlAppId = ffUrl +
						   "&sAppId=" + $("#application").text() + 
						   "&sAppVersion=" + $("#release").text() + 
						   "&sAppBuild=" + $("#build").text() +
						   "&sSocleVersion=" + encodeURIComponent($("#asversion").text()) +
						   "&sSocleBuild=" + $("#asbuild").text();
			
			//Save application and release info
			var sAppId = $("#application").text() + " " + $("#release").text();
			$('#loading').show();

			///Make the ajax call to firefix software page
			$.ajax({
				url: urlAppId,
				type: 'GET',
				timeout: 5000,
				cache: false,
				success: function(data, textStatus, jqXHR){ //If call is successful

					//Grab the id's from the page
					var productId = $('#nGetProduct', data).text();
					var productBuildId = $('#nGetProductBuild', data).text();
					var socleBuildId = $('#nGetSocleBuild', data).text();
					
					//If we can get the product id, we go into the folder
					if(productId.trim() != ""){
						var newURL = 	reqUrl + 
										"&fid=" + productId + 
										"&Fld__xml_BuildProduct=" + productBuildId + 
										"&Fld__xml_BuildSocle=" + socleBuildId;

						if(localStorage.getItem("CW-urlParams") == "yes"){
							console.log("Params test1");
							newURL = 	getURLPath("newRequestParams", newURL);
						}
						else{
							newURL = 	newURL + "&ext=1";
						}

					}
					//Otherwise we create the request outside the folder
					else{

						//Save the build numbers so that we can print them in a text area field
						localStorage.setItem("CW-appBuild", $("#build").text());
						localStorage.setItem("CW-asBuild", $("#asbuild").text());

						//Retrive the hardcoded id from getVersionInfo.js file
						//var nAppId = applicationMapping(sAppId);
                        var nAppId = localStorage.getItem(sAppId);
						if(nAppId == null){

							//If we still don't have an id, just create a regular request and and save the application info
							var newURL = newReqUrl;
							newURL = getURLPath("newRequestParams", newURL);
							if(sAppId != null){
								localStorage.setItem("CW-appVersion", sAppId);
							}
						}
						else{
							var newURL = reqUrl + "&fid=" + nAppId;
				            newURL = getURLPath("newRequestParams", newURL);
						};
					}
					
					//Open request tab
					openTab(newURL);
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert("Software is down");
				}
				});
		}
	}

}





/*
	takeScreenshot
	@desc: 		Takes a screenshot of the current tab
	@author: Yiwen Wang
*/
function takeScreenshot() {
  chrome.tabs.captureVisibleTab(null, function(img) {
    var screenshotUrl = img;
	var viewTabUrl = chrome.extension.getURL('screenshot.html');
	var filename = localStorage.getItem("CW-filename");	
	document.getElementById('details').innerHTML +=index + ": " + filename + '.jpg <br>';
	var imgUrl = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');		
	var link = document.createElement("a");	
	link.download = filename + ".jpg";
	//link.href = imgUrl;
	link.href = img;
	link.click();
    index++;	
  });
}




/*
	clickHandler
	@desc: 		Click handler for the screenshot function
	@author: Yiwen Wang
*/
function clickHandler(e){	

	setTimeout(takeScreenshot, 1000);
}
