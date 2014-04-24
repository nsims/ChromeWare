//Created by Parth Narielwala



var windows = ["create-request", "main", "loginWindow", "loading"]

function switchWindow(id)
{
	return function () {
		changeWindow(id);
	}
}

function changeWindow(id)
{
 console.log("" + id);
 var element = document.getElementById(id);
 var attribute = element.attributes[2];
 var windowId = attribute.value;
 for(var i=0; i<windows.length;i++)
 {
  if(windows[i] == windowId)
  {
   $('#' + windowId).show();
   //document.getElementById(windowId).className = "window";
   localStorage.setItem("CF-lastwindow", windowId);
  }
  else
  {
   $('#' + windows[i]).hide();
   //document.getElementById(windows[i]).className += " hide";
  }
 }
}

function changeWindowFromId(windowId) {
	for(var i=0; i<windows.length;i++)
	{
		if(windows[i] == windowId)
		{
			$('#' + windowId).show();
			//document.getElementById(windowId).className = "window";
			localStorage.setItem("CF-lastwindow", windowId);
		}
		else
		{
			$('#' + windows[i]).hide();
			//document.getElementById(windows[i]).className += " hide";
		}
	}
}

function loadLastWindow()
{
	console.log("loadLastWindow()");
	var windowId = localStorage.getItem("CF-lastwindow");
	if(windowId != null)
	{
		for(var i=0; i<windows.length;i++)
		{
			if(windows[i] == windowId)
			{
				$('#' + windowId).show();
				//document.getElementById(windowId).className = "window";
				localStorage.setItem("CF-lastwindow", windowId);
			}
			else
			{
				$('#' + windows[i]).hide();
				//document.getElementById(windows[i]).className += " hide";
			}
		}
	}
	else{
		$('#main').show();
		$('#loading').hide();
		localStorage.setItem("CF-lastwindow", "main");
	}
}