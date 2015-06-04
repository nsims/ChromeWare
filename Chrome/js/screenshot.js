// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setScreenshotUrl(url) {
  document.getElementById('target').src = url;
}

/*
	takeScreenshot
	@desc: 		Takes a screenshot of the current tab
	@author: Yiwen Wang
*/
function takeScreenshot() {
  chrome.tabs.captureVisibleTab(null, function(img) {
	var date = new Date();
    var screenshotUrl = img;
	var viewTabUrl = chrome.extension.getURL('screenshot.html');
	var filename = $("#filename").val();
	var objImages = JSON.parse(localStorage.getItem("Images"));
	
	if(objImages == null)
		objImages = {};
	if(filename != ""){
		var imgUrl = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');		
		var link = document.createElement("a");
		link.download = filename + ".jpg";
		//link.href = imgUrl;
		link.href = img;
		
		var imageVersion = 1;
		while(objImages[filename] != null){
			imageVersion++;
			filename = filename + imageVersion;
		};
		objImages[filename] = img;
		localStorage.setItem("Images", JSON.stringify(objImages));
		
		$("#details").append("<a class=\"screenshot\" target=\"_blank\" href=\"" + img + "\" name=" + filename + ">" + Object.keys(objImages).length + ": " + filename + ".jpg</a><br class=\"screenshot\">");
		//link.click();
		index++;	
	}
  });
}

function downloadScreenshots(){
	var objImages = JSON.parse(localStorage.getItem("Images"));
	var images = objImages != null ? Object.keys(objImages) : objImages;
	var inc;
	for(inc in images){
		var filename = images[inc];
		var img = objImages[filename];
		var link = document.createElement("a");
		link.download = filename + ".jpg";
		link.href = img;
		link.click();
	}
}

function clearScreenshots(){
	localStorage.removeItem("Images");
	console.log("removing images");
	$("#details").children().remove();
}


/*
	clickHandler
	@desc: 		Click handler for the screenshot function
	@author: Yiwen Wang
*/
function clickHandler(e){	

	setTimeout(takeScreenshot, 100);
}
