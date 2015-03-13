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
    var screenshotUrl = img;
	var viewTabUrl = chrome.extension.getURL('screenshot.html');
	var filename = $("#filename").val();
	
	if(filename != ""){
		var imgUrl = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');		
		var link = document.createElement("a");
		link.download = filename + ".jpg";
		//link.href = imgUrl;
		link.href = img;
		
		var imagesString = localStorage.getItem("images");
		if(imagesString != null){
			var i = 2;
			while(localStorage.getItem(filename) != null){
				filename = filename + i;
				i++
			};
			imagesString = imagesString + "&&" + filename;
		}
		else
			imagesString = filename;
		
		var imageArray = imagesString.split("&&");
		
		localStorage.setItem("images", imagesString);
		localStorage.setItem(filename, img);
		$("#details").append("<a class=\"screenshot\" target=\"_blank\" href=\"" + img + "\" name=" + filename + ">" + imageArray.length + ": " + filename + ".jpg</a><br class=\"screenshot\">");
		//link.click();
		index++;	
	}
  });
}

function downloadScreenshots(){
	var images = localStorage.getItem("images");
	if(images != null){
		var imagesArray = images.split("&&");
		for(var i=0;i < imagesArray.length; i++){
			var filename = imagesArray[i];
			var img = localStorage.getItem(filename);
			var link = document.createElement("a");
			link.download = filename + ".jpg";
			link.href = img;
			link.click();
		}
	}
}

function clearScreenshots(){
	var images = localStorage.getItem("images");
	if(images != null){
		var imagesArray = images.split("&&");
		for(var i=0;i < imagesArray.length; i++){
			var filename = imagesArray[i];
			localStorage.removeItem(filename)			
		};
		localStorage.removeItem("images");
	};
	$("#details .screenshot").remove()
}


/*
	clickHandler
	@desc: 		Click handler for the screenshot function
	@author: Yiwen Wang
*/
function clickHandler(e){	

	setTimeout(takeScreenshot, 1000);
}
