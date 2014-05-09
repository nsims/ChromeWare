chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	  
    var matchE = tab.title.search('AB -Edition[A-z ]*of Page');
	var matchM = tab.title.search('AB -Modification of Table Field');
	var matchF = tab.title.search('AB -Modification of Function');
	var title = tab.title.match(/["][A-z ]*["]/);
	if(matchE != -1){		
		chrome.tabs.executeScript(tab.id, {code:"document.title='" +  title + "Page'"});
	};
	if(matchM != -1){
		chrome.tabs.executeScript(tab.id, {code:"document.title='" +  title + "Field'"});
	};
	if(matchF != -1){
		chrome.tabs.executeScript(tab.id, {code:"document.title='" +  title + "Function'"});
	};
	
});