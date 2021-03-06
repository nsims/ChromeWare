// ChromeWare Team - Enablon NA
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var softwareURL = "https://software.enablon.com/Software/go.aspx?u=/Referent/";

var createRequestURL = "Prods/RqProd&tm=1";
var newRequestURL = "Rqtes&pm=0&tm=1";
var fireFixRequestURL = "FFRq&Process=nGetAllElements";

var reqUrl = softwareURL + createRequestURL;	//URL for prefilled requests
var ffUrl = softwareURL + fireFixRequestURL;	//URL for firefix's software page to retrieve id's
var newReqUrl = softwareURL + newRequestURL;	//URL for new request creation (outside of version folder)

var index = 1;	//index for screenshot count



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
	@desc: 		Opens a new tab in the Chrome's tab action
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
		var url = tab.url;
		if(url.indexOf("enablon") > 0){
			//We clear the request form
			clearRequestAfterCreation();
		}
	});
	
}



/*
	clearRequestAfterCreation
	@desc: 		Clears the request form after prefilling the software request
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
		localStorage.removeItem("CW-impactLayer");
		
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
		
		clearScreenshots();
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

			//Make the ajax call to firefix software page
			$.ajax({
				url: urlAppId,
				type: 'GET',
				timeout: 5000,
				cache: false,
				success: function(data, textStatus, jqXHR){ //If call is successful
					localStorage.setItem("Please work", "It Does!");
					var objProducts = JSON.parse(localStorage.getItem("objProducts"));
					//Grab the id's from the page
					var productId = $('#nGetProduct', data).text();
					var productBuildId = $('#nGetProductBuild', data).text();
					var socleBuildId = $('#nGetSocleBuild', data).text();
					
					//If we can get the product id, we go into the folder
					if(productId.trim() != ""){
						var newURL = 	getURLPath("newRequestParams", 
										reqUrl + 
										"&fid=" + productId + 
										"&Fld__xml_BuildProduct=" + productBuildId + 
										"&Fld__xml_BuildSocle=" + socleBuildId);

					}
					//Otherwise we create the request outside the folder
					else{

						//Save the build numbers so that we can print them in a text area field
						localStorage.setItem("CW-appBuild", $("#build").text());
						localStorage.setItem("CW-asBuild", $("#asbuild").text());

						//Retrive the id from the JSON object stored in localStorage
                        var nAppId = objProducts[sAppId];
						
						if(nAppId == null){

							//If we still don't have an id, just create a regular request and and save the application info
							var newURL = getURLPath("newRequestParams", newURL);
							localStorage.setItem("CW-appVersion", sAppId);
						}
						else{
							var newURL = getURLPath("newRequestParams", reqUrl + "&fid=" + nAppId);
						};
					}
					
					downloadScreenshots();
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






