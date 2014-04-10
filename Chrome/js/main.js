// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.




function main()
{
	//Initialization
	$('#create-request').hide();
	//$('#main').hide();
	$('#loginWindow').hide();
	
	injectJavaScript();
	loadLastWindow();
	var logger = new Logger();
	logger.initialize();// check and log if needed
	console.log("finished initializing logger");
	
	
	trackSection();
	loadLastSection();
	dynamicPopover();
	fillFields();
	rememberFields();
	
	//Set up button actions
	document.getElementById("btn-documentation").addEventListener('click', newTab("btn-documentation"));
	document.getElementById("btn-createRequest").addEventListener('click', switchWindow("btn-createRequest"));
	document.getElementById("btn-cancel").addEventListener('click', resetSection());
	document.getElementById("btn-cancel").addEventListener('click', switchWindow("btn-cancel"));
	
	$("#btn-cancel").click(function(){$("#btn-create").prop("disabled",false);});
	$("#btn-cancelLogin").click(function(){logger.hideLogin()});
	$("#btn-login").click(function(){logger.showLogin(false)});
	$(".close").click(function(){$(".alert").alert('close')});//close alerts
	$("#btn-loginToSW").click(logger.getConnectToSW());
	$("#btn-logout").click(function(){logger.logoutFromSW()});
	$("#btn-screenshot").click(function(){clickHandler()});
	
	
	document.getElementById("btn-cancel").addEventListener('click', clearFields());
	document.getElementById("btn-createRequest").addEventListener('click', fillDefaultValues());

	$("#btn-create").click(createRequest());

}

function displayAlert(message, type) //type = alert-danger,
{
	var type = type || 'alert-danger';
	$('#alert_placeholder').html('<div class="alert '+type+' fade in""><a class="close" data-dismiss="alert">x</a><span>'+message+'</span></div>')
}



// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () 
{
	main();
});