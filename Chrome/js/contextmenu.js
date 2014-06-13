// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function openRequest(info, tab) {
  var selection = JSON.stringify(info.selectionText);
  var number = selection.replace(/"/g, "");
  if(parseInt(number, 10) > 0){
    var url = "https://software.enablon.com/Software/go.asp?u=%2FReferent%2FRqtes&rid=" + number;
    chrome.tabs.create({ url: url });
  }
}

function openRequirement(info, tab) {
  var selection = JSON.stringify(info.selectionText);
  var number = selection.replace(/"/g, "");
  if(parseInt(number, 10) > 0){
    var url = "https://software.enablon.com/Software/go.asp?u=%2FReferent%2FProreq&rid=" + number;
    chrome.tabs.create({ url: url });
  }
}

// Create one test item for each context type.

var title = "Find Software Request";
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                     "onclick": openRequest});

var title = "Find Software Requirement";
var id = chrome.contextMenus.create({"title": title, "contexts":["selection"],
                                     "onclick": openRequirement});