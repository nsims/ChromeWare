//Created by Parth Narielwala

var windows = [];
function initWindows(){
	console.log('$(.window).length: ' + $('.window').length);
	for(var i=0; i<$('.window').length;i++){
		windows.push($('.window')[i].id);
	}
}

function switchWindow(id)
{
	return function () {
		changeWindow(id);
	}
}

function changeWindow(id)
{
 var windowId = $("#" + id).attr("value");
 changeWindowFromId(windowId);
}

function changeWindowFromId(windowId) {
	for(var i=0; i<windows.length;i++)
	{
		if(windows[i] == windowId)
		{
			$('#' + windowId).show();
			localStorage.setItem("CF-lastwindow", windowId);
		}
		else
		{
			$('#' + windows[i]).hide();
		}
	}
}

function loadLastWindow()
{
	var windowId = localStorage.getItem("CF-lastwindow");
	if(windowId != null)
	{
		for(var i=0; i<windows.length;i++)
		{
			if(windows[i] == windowId)
			{
				$('#' + windowId).show();
				localStorage.setItem("CF-lastwindow", windowId);
			}
			else
			{
				$('#' + windows[i]).hide();
			}
		}
	}
	else{
		$('#main').show();
		$('#loading').hide();
		localStorage.setItem("CF-lastwindow", "main");
	}
}