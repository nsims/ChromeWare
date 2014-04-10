
$(document).ready(function() {
	//alert(type);
	$('#fld_XType_' + type).attr('checked', true);
	$('#fld_Sev_' + severity).attr('checked', true);
	$('#fld_XPriorit_' + priority).attr('checked', true);
	$("input[name='fld_XTitre']").val(title);
	$("textarea[name='fld_XDescrip']").val(behavior);
	$("textarea[name='fld_XStepsto']").val(stepstoreproduce);
	$("input[name='fld_XURL']").val(url);
	$("input[name='fld_XLoginPa']").val(loginpwd);
});