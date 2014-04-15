// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var reqUrl = "https://software.enablon.com/Software/go.asp?u=/Referent/Prods/RqProd&tm=1";

function newTab(id)
{
	return function () {
		createTab(id);
	}
}

function openTab(url)
{
	chrome.tabs.create({ url: url });
}

function createTab(id)
{
	var element = document.getElementById(id);
	var url = element.attributes[2];
	document.getElementById(id).addEventListener('onclick', openTab(url.value));
}

function injectJavaScript() {
	chrome.tabs.onCreated.addListener(function(tab) {
		var empty = "";
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
		//var behavior = localStorage.getItem("CW-behavior")?localStorage.getItem("CW-behavior"):"";
		//var matches = test.replace(/\n/g, "§");
		var behavior = localStorage.getItem("CW-behavior");
		var stepstoreproduce = localStorage.getItem("CW-stepstoreproduce");
		var input = 'var type = "' + type + '";' +
					' var severity = "' + severity + '";' +
					' var priority = "' + priority + '";' +
					' var title = "' + localStorage.getItem("CW-title") + '";' +
					' var behavior = "' + behavior.replace(/\n/g, "&sect;") + '";' +
					' var stepstoreproduce = "' + stepstoreproduce.replace(/\n/g, "&sect;") + '";' +
					' var url = "' + localStorage.getItem("CW-url") + '";' +
					' var loginpwd = "' + localStorage.getItem("CW-loginpwd") + '";';
					
					
		//figure out how to call these in the different files
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
		
		chrome.tabs.executeScript(tab.id, {code: input} );
		chrome.tabs.executeScript(tab.id, {file: 'js/fillRequest.js'});
	});
}

function createRequest()
{
	return function (){	
		var requiredFilled = checkRequiredFields();
		if(requiredFilled){
			var urlAppId = "https://software.enablon.com/Software/go.asp?u=/Referent/FFRq&Process=nGetAllElements" +
						   "&sAppId=" + $("#application").text() + 
						   "&sAppVersion=" + $("#release").text() + 
						   "&sAppBuild=" + $("#build").text() +
						   "&sSocleVersion=" + $("#asversion").text() +
						   "&sSocleBuild=" + $("#asbuild").text();
			$('#loading').show();
			$.ajax({
				url: urlAppId,
				type: 'GET',
				timeout: 5000,
				cache: false,
				success: function(data, textStatus, jqXHR){
					var productId = $('#nGetProduct', data).text();
					var productBuildId = $('#nGetProductBuild', data).text();
					var socleBuildId = $('#nGetSocleBuild', data).text();
					console.log("productId: " + productId);
					var newURL = reqUrl + "&fid=" + productId + "&Fld__xml_BuildProduct=" + productBuildId + "&Fld__xml_BuildSocle=" + socleBuildId + "&ext=1";
					chrome.tabs.create({ url: newURL });
					},
				error: function(jqXHR, textStatus, errorThrown){
					alert("error");
				}
				});
		}
		//chrome.tabs.create({ url: reqUrl });
	}

}

function takeScreenshot() {
  chrome.tabs.captureVisibleTab(null, function(img) {
    var screenshotUrl = img;
	var viewTabUrl = chrome.extension.getURL('screenshot.html');
	var imgUrl = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
	var link = document.createElement("a");
	link.download = viewTabUrl + ".jpg";
	link.href = imgUrl;
	link.click();	
	
    chrome.tabs.create({url: viewTabUrl}, function(tab) {
      var targetId = tab.id;
      var addSnapshotImageToTab = function(tabId, changedProps) {
        if (tabId != targetId || changedProps.status != "complete")
          return;
		  
        chrome.tabs.onUpdated.removeListener(addSnapshotImageToTab);

        var views = chrome.extension.getViews();
        for (var i = 0; i < views.length; i++) {
          var view = views[i];
          if (view.location.href == viewTabUrl) {
            view.setScreenshotUrl(screenshotUrl);
            break;
          }
        }
      };
      chrome.tabs.onUpdated.addListener(addSnapshotImageToTab);
    });
  });
}

function clickHandler(e){	
	setTimeout(takeScreenshot, 1000);
}
