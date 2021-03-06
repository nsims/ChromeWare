// ChromWare Team - Enablon NA
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function initializeButtonClicks()
{
	var logger = new Logger();
	logger.initialize();// check and log if needed


	//Set up button actions
	$("#btn-documentation").click(newTab("btn-documentation"));						//Opens a tab for the documentation
	$("#btn-createRequest").click(switchWindow("btn-createRequest"));				//Switches to the request creation form
	$("#btn-cancel").click(resetSection());											//Resets the collapsible sections
	$("#btn-cancel").click(switchWindow("btn-cancel"));								//Switches back to the main view of the popup
	$("#btn-cancel").click(function(){$("#btn-create").prop("disabled",false);});	//
	$("#btn-cancelLogin").click(function(){logger.hideLogin()});					//Hides login page, and see main view
	$("#btn-login").click(function(){logger.showLogin(false)});						//Shows login page
	$(".close").click(function(){$(".alert").alert('close')});						//close alerts with (x)
	$("#btn-loginToSW").click(logger.getConnectToSW());								//Logs into Software from login page
	$("#btn-logout").click(function(){logger.logoutFromSW()});						//Logs out of software
	$("#btn-screenshot").click(function(){clickHandler()});							//Takes a screenshot
	$("#btn-cancel").click(clearFields());											//Clears input fields when user cancels the form
	$("#btn-create").click(createRequest());										//Submits form to actual software page when you hit "Create"

	$("#btn-createRequest").click(function(){ getVersionInfo()});
}

function initializeChromeWare(){
	changeWindow("main");
	localStorage.setItem("CW-urlParams", "yes");
	//reset section
		$('#collapseOne').addClass('in');
		$('#collapseOne').css({height: 'auto'});
		$('#collapseTwo').removeClass('in');
		$('#collapseTwo').css({height: '0px'});
		$('#collapseThree').removeClass('in');
		$('#collapseThree').css({height: '0px'});
		localStorage.setItem("CF-lastsection", 'collapseOne');
}





function main()
{

	//Initialization
	initWindows();
	initializeVersions();
	
	
	//First time initialization
	if(localStorage.length == 0){
		console.log(localStorage.length);
		initializeChromeWare();
	}
	else{
		console.log("else " + localStorage.length);
		trackSection();							//Tracks what collapsable section was open last
		loadLastSection();						//Loads the last collapsable section
	}
	//Hide all views
	$('.windows').hide();

	//Creates callback function to inject javascript into software request creation page
	injectJavaScript();

	//Load last open view/window
	loadLastWindow();




	//Initializes all the buttons and their callbacks
	initializeButtonClicks();

	checkPlatformSession();
	
	
	dynamicPopover();						//Enables the popover for each field in the request form
	fillFields();							//Fills the fields with remembered values (if user leaves popup in the middle of creation)
	rememberFields();						//Remembers the fields user has inputted
	getVersionInfo();						//Retrieves the version info of the page

}

/*
	displayAlert
	@desc: 		Displays a message to the user through a hovering alert
	@param 	string message - 	the message to display
			type string - 		the type of message to display (warning, error, success, etc)
	@author: Raphael Bourgeois
*/
function displayAlert(message, type) 
{
	var type = type || 'alert-danger';
	$('#alert_placeholder').html('<div class="alert '+
									type +
									' fade in" style="position:absolute; margin-left:35px; margin-right:35px; margin-top:10px;' +
									' padding-top:0px !important; padding-bottom:0px !important; width:80%;">' +
									'<a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
}



// Run scripts as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () 
{
	main();
});

chrome.browserAction.setBadgeText({text: "Beta"});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//sendResponse({file: localStorage.getItem("image")})
	var inRequest = sender.tab.url;
	if(inRequest.indexOf("chromeware=1") > -1)
		sendResponse({farewell: sender.tab.url});
	else
		sendResponse({farewell: "goodbye"});
});
	
	
	
	
	
	
	
	
	
	
	
	