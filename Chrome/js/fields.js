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

		//If the field is not the field name, save it
		if(fieldId != 'filename'){
			var fieldValue = $(this).val();
			localStorage.setItem("CW-" + fieldId, fieldValue);
		};
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
		if(fieldValue != null)
		{
			$(this).val(fieldValue);
		}
	});

	//Fills in the site info from local storage
	$('#release').html(localStorage.getItem("CW-release"));
	$('#build').html(localStorage.getItem("CW-build"));
	$('#application').html(localStorage.getItem("CW-application"));
	$('#asbuild').html(localStorage.getItem("CW-asBuild"));
	$('#asversion').html(localStorage.getItem("CW-asRelease"));
	
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
			$(this).val("");
			localStorage.removeItem("CW-" + fieldId);
		});

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