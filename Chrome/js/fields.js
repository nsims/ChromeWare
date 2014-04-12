

function rememberFields()
{
	var formField = ".form-control";
	$(formField).focusout(function() {
		var fieldId = $(this).attr('id');
		var fieldValue = $(this).val();
		localStorage.setItem("CW-" + fieldId, fieldValue);
	});
}

function fillFields()
{
	$(document).ready(function() {
		var formField = ".form-control";
		$(formField).each(function() {
			var fieldId = $(this).attr('id');
			var fieldValue = localStorage.getItem("CW-" + fieldId);
			if(fieldValue != null)
			{
				$(this).val(fieldValue);
			}
		});
	});
}

function clearFields()
{
	return function () {
		var formField = ".form-control";
		$(formField).each(function() {
			var fieldId = $(this).attr('id');
			$(this).val("");
			localStorage.removeItem("CW-" + fieldId);
		});
		removeValidation();
	}
}

function fillDefaultValues()
{
	return function () {
		var formField = ".form-control";
		
		$("#type").val("Bug");
		$("#severity").val("Minor");
		$("#priority").val("Normal");
		$("#status").val("Open");		
	}
}

function checkRequiredFields()
{
	var formField = ".form-control";
	var passed = true;
	var fields = "";
	$(formField).each(function() {
		var fieldId = $(this).attr('id');
		var requiredBool = $('#' + fieldId).attr('required');
		if(requiredBool){
			if($('#' + fieldId).val() == "" || $('#' + fieldId).val() == null){
				passed = false;
				$(this).parent().addClass('has-error has-feedback');
				$(this).parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" style="top:0px !important;"></span>');
				if(fields=="")
					fields = $('#' + fieldId).siblings().text();
				else
					fields = fields + ", " + $('#' + fieldId).siblings().text();
			}
			else
				$(this).parent().removeClass('has-error');
		}
	});
	if(!passed){
		if(!$('#sectionerror').length){
			$('a[href="#collapseTwo"]').append('<span id="sectionerror" class="glyphicon glyphicon-remove form-control-feedback" style="top:2px !important; color: #a94442;"></span>');
		}
		alert("Following fields must be filled: " + fields);
	};
	return passed;
}

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