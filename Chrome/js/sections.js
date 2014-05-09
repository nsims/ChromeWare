// ChromWare Team - Enablon NA
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
	trackSection
	@desc: 		Callback function that tracks and stores what collapsable section is open
	@author: Parth Narielwala
*/
function trackSection()
{
	$(document).ready(function() {
		//This gets all the input fields

		var section = ".panel-collapse";
		$(section).on('shown.bs.collapse', function () {
		  var sectionId = $(this).attr("id");
		  console.log("sectionId: " + sectionId);
		  localStorage.setItem("CF-lastsection", sectionId);
		});
	});
}




/*
	loadLastSection
	@desc: 		Loads the last section that was open when popup is regenerated
	@author: Parth Narielwala
*/		
function loadLastSection()
{
	var sectionId = localStorage.getItem("CF-lastsection");
	console.log("sectionId: " + sectionId);
	if(sectionId != null)
	{
		$('#'+ sectionId).collapse({parent: "#accordion"})
	}
	else{
		resetSectionCallback();
	}
}



/*
	resetSection
	@desc: 		Resets the collapsable section when you exit the request form
	@author: Parth Narielwala
*/	
function resetSection()
{
	return function () {
		$('#collapseOne').addClass('in');
		$('#collapseOne').css({height: 'auto'});
		$('#collapseTwo').removeClass('in');
		$('#collapseTwo').css({height: '0px'});
		$('#collapseThree').removeClass('in');
		$('#collapseThree').css({height: '0px'});
		localStorage.setItem("CF-lastsection", 'collapseOne');
	}
}