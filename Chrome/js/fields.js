

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
		})
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
				$(this).parent().addClass('has-error');
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
		alert("Following fields must be filled: " + fields);
	};
	return passed;
}