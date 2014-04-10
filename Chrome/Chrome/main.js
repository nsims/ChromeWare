// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//Might put these tab actions into another .js file
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
	element.addEventListener('onclick', openTab(url.value));
}



function main()
{
	//Initialization
	
	
	//Set up button actions
	document.getElementById("btn-documentation").addEventListener('click', newTab("btn-documentation"));
	document.getElementById("btn-create-request").addEventListener('click', newTab("btn-create-request"));
	document.getElementById("btn-save-defaults").addEventListener('click', save_entries);
}


// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () 
{
	main();
});