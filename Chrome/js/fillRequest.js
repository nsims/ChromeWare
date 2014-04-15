
$(document).ready(function() {
	//alert("hello");
	$('#fld_XType_' + type).attr('checked', true);
	$('#fld_Sev_' + severity).attr('checked', true);
	$('#fld_XPriorit_' + priority).attr('checked', true);
	$("input[name='fld_XTitre']").val(title);
	var behaviorNew = behavior.replace(/&sect;/g, "\n");
	$("textarea[name='fld_XDescrip']").val(behaviorNew);
	var stepstoreproduceNew = stepstoreproduce.replace(/&sect;/g, "\n");
	$("textarea[name='fld_XStepsto']").val(stepstoreproduceNew);
	$("input[name='fld_XURL']").val(url);
	$("input[name='fld_XLoginPa']").val(loginpwd);
});