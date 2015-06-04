// ChromWare Team - Enablon NA
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/*
	rememberFields
	@desc: 		Callback function that tracks and stores what collapsable section is open
	@author: Parth Narielwala
*/
function rememberFields()
{
	//All input text fields have this class
	var formField = ".form-control";
	$(formField).focusout(function() {
		var fieldId = $(this).attr('id');
		var fieldValue = $(this).val();
		localStorage.setItem("CW-" + fieldId, fieldValue);
	});
	$("input:radio").click(function(){
		console.log("layer checked");
		localStorage.setItem("CW-impactLayer", $(this).val())
	});
}



/*
	fillFields
	@desc: 		Fills the remembered fields in the request form
	@author: Parth Narielwala
*/
function fillFields()
{

	var formField = ".form-control";
	$(formField).each(function() {
		var fieldId = $(this).attr('id');
		var fieldValue = localStorage.getItem("CW-" + fieldId);
		if(fieldValue != null && fieldId != "filename")
		{
			$(this).val(fieldValue);
		}
	});
	
	var productLayerId = localStorage.getItem("CW-impactLayer");
	if(productLayerId != null)
		$("#" + productLayerId).prop("checked", "checked");

	//Fills in the site info from local storage
	$('#release').html(localStorage.getItem("CW-release"));
	$('#build').html(localStorage.getItem("CW-build"));
	$('#application').html(localStorage.getItem("CW-application"));
	$('#asbuild').html(localStorage.getItem("CW-asBuild"));
	$('#asversion').html(localStorage.getItem("CW-asRelease"));
	
	fillImages();
	
}



/*
	clearFields
	@desc: 		Clears the field if user cancels request
	@author: Parth Narielwala
*/
function clearFields()
{
	return function () {
		var formField = ".form-control";
		$(formField).each(function() {
			var fieldId = $(this).attr('id');

			if(["type", "severity", "priority"].indexOf(fieldId) > -1){
				switch(fieldId){
					case "type": 
									$(this).val("Bug"); 
									break;
					case "severity": 
									$(this).val("Minor"); 
									break;
					case "priority": 
									$(this).val("Normal"); 
									break;
				};
				console.log("fieldId: " + fieldId);
			}
			else{
				$(this).val("");
			};
			localStorage.removeItem("CW-" + fieldId);
		});
		$("#productLayer").prop("checked", "checked");
		localStorage.removeItem("CW-impactLayer")
		
		//Removes any validations the user did not meet
		removeValidation();

		//Clears the site information
		$('#release').html("");
		$('#build').html("");
		$('#application').html("");
		$('#asbuild').html("");
		$('#asversion').html("");

		localStorage.removeItem("CW-release");
		localStorage.removeItem("CW-build");
		localStorage.removeItem("CW-application");
		localStorage.removeItem("CW-asBuild");
		localStorage.removeItem("CW-asRelease");
		
		clearScreenshots();
	};
}



/*
	checkRequiredFields
	@desc: 		This function checks to see if the required fields have been filled
	@author: Parth Narielwala
*/
function checkRequiredFields()
{
	var formField = ".form-control";
	var passed = true;
	var fields = "";
	$(formField).each(function() {
		var fieldId = $(this).attr('id');
		var requiredBool = $('#' + fieldId).attr('required');

		//If the field is required...
		if(requiredBool){
			if($('#' + fieldId).val() == "" || $('#' + fieldId).val() == null){

				//If the field is empty, then apply the red border and the glyphicon indicating an error
				passed = false;
				$(this).parent().addClass('has-error has-feedback');
				$(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" style="top:0px !important;"></span>');
				if(fields=="")
					fields = $('#' + fieldId).siblings().text();
				else
					fields = fields + ", " + $('#' + fieldId).siblings().text();
			}
			else

				//Else if the field is filled, remove the error
				$(this).parent().removeClass('has-error');
		}
	});
	if(!passed){

		//If there is an error (check has not passed) we get an alert and the section gets the error glyphicon
		if(!$('#sectionerror').length){
			$('a[href="#collapseTwo"]').append('<span id="sectionerror" class="glyphicon glyphicon-remove form-control-feedback" style="top:2px !important; color: #a94442;"></span>');
		}
		alert("Following fields must be filled: " + fields);
	};

	//Return whether the check has failed or passed
	return passed;
}


/*
	removeValidation
	@desc: 		This function removes the validation on the fields
	@author: Parth Narielwala
*/
function removeValidation()
{
	var formField = ".form-control";
	var passed = true;
	var fields = "";
	$(formField).each(function() {
		$(this).parent().removeClass('has-error');
	});
	$('#sectionerror').remove();
	
}

function fillImages(){
	var objImages = JSON.parse(localStorage.getItem("Images"));
	if(objImages != null){
		var images = Object.keys(objImages);
		var inc;
		for(inc in images){
			var filename = images[inc];
			var img = objImages[filename];
			$("#details").append("<a target=\"_blank\" href=\"" + img + "\" name=" + filename + ">" + (Number(inc) + 1) + ": " + filename + ".jpg</a><br>");
		}
	};





	var images = localStorage.getItem("images");
	if(images != null){
		var imagesArray = images.split("&&");
		for(var i=0;i < imagesArray.length; i++){
			var filename = imagesArray[i];
			var img = localStorage.getItem(filename);
			$("#details").append("<a target=\"_blank\" href=\"" + img + "\" name=" + filename + ">" + (i + 1) + ": " + filename + ".jpg</a><br>");
			//document.getElementById('details').innerHTML +=index + ": " + imagesArray[i] + '.jpg <br>';
		}
	}

}