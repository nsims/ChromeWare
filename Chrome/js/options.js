// Saves options to localStorage.
function save_options() {

	var swLoginInput = $('#SWLogin');
	var swPwdInput = $('#SWPwd');
	
	if(!(swPwdInput.val()=="")){
		var logger = new Logger();
		logger.saveSWCred(swLoginInput.val(), swPwdInput.val());
	};
	
	var reqParamOption = $('#reqParam').val();
	localStorage.setItem("CW-urlParams", reqParamOption);
	if($("#productsTab").hasClass("active"))
		saveProductList();
	// Update status to let user know options were saved.
	displayAlert("Options Saved", "alert-success")
	// var status = document.getElementById("status");
	// status.innerHTML = "Options Saved.";
	setTimeout(function() {
		$("#alert_placeholder").children().remove()
	}, 2000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	$('#reqParam').val(localStorage.getItem("CW-urlParams"));
	
	var swLogin = localStorage["swLogin"];
	if(!swLogin) {
		return;
	}
	var swLoginInput = $('#SWLogin');
	swLoginInput.val(swLogin);

	
	var swPwd = localStorage["encryptedPassPart"];
	if(!swPwd) {
		return;
	}
	var swPwdInput = $('#SWPwd');
	swPwdInput.val("GoodTry ;)");
	
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  // var select = document.getElementById("color");
  // for (var i = 0; i < select.children.length; i++) {
    // var child = select.children[i];
    // if (child.value == favorite) {
      // child.selected = "true";
      // break;
    // }
  // }
}


function initializedProductList(){
	var myProductsObj = JSON.parse(localStorage.getItem("objProducts"));
	var myProducts = Object.keys(myProductsObj);
	myProducts = myProducts.sort();
	var product;
	for(product in myProducts){
		console.log("version: " + product);
		$("#productForm").append(getInitProductHTML(myProducts[product], myProductsObj[myProducts[product]]));
	};
}

function removeVersion(){
	//also need to remove
	$(this).parent().hide();
}

function addVersion(){
	$("#productForm").append(getNewProductHTML());
	$('.remove').click(removeVersion);
	$('.input').change(addChangeAttr);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);

}

function addChangeAttr(){
	$(this).attr("changed", true);
}

function saveProductList(){
	
	//Delete hidden products from localstorage
	var objProducts = JSON.parse(localStorage.getItem("objProducts"));
	var updatedProduct = [];
	var tempProducts = {};
	$("div[title='product']").each(function(){
			//if visible update localstorage
			var versionElement = $(this).find("input[id='versionName']");
			var idElement = $(this).find("input[id='versionId']"); // might need to pass in jQuery element
			var version = $(versionElement).val();
			var id = $(idElement).val()
			
			if($(this).is(":visible")){
				if((version != "" || version != null) && (id != "" || id != null)){
					tempProducts[version] = id;
				}
			};
		}
	);
	localStorage.setItem("objProducts", JSON.stringify(tempProducts));
	$("html, body").animate({ scrollTop: 0 }, 500);
}


/*
	displayAlert
	@desc: 		Displays a message to the user through a hovering alert
	@param 	string message - 	the message to display
			type string - 		the type of message to display (warning, error, success, etc)
	@author: Raphael Bourgeois
*/
function displayAlert(message, type) 
{
	var type = type || 'alert-danger';
	$('#alert_placeholder').html('<div class="alert '+
									type +
									' fade in alert-dismissible" role="alert"> ' +
									'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+message+'</div>')
}


// Run scripts as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () 
{
	initializeVersions();
	restore_options();
	initializedProductList();
	$('#save').click(save_options);
	$('.remove').click(removeVersion);
	$('#addNewProduct').click(addVersion);
	$('.input').change(addChangeAttr);
});


// Helper functions

function getInitProductHTML(version, id){
	return  "<div style='margin-bottom: 5px;' title='product'>" +
			  "<button type='button' class='btn btn-danger btn-sm remove'>" +
				"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
			  "</button>" +
			  "<div class='form-group' style='margin: 1px;'>" +
				"<div class='col-sm-10'>" +
				  "<input type='text' class='form-control input' id='versionName' changed=false placeholder='Product' origvalue='" + version + "' value='" + version + "'>" +
				"</div>" +
			  "</div>" +
			  "<div class='form-group'>" +
				"<div class='col-sm-10'>" +
				  "<input type='number' class='form-control input' id='versionId' changed=false placeholder='Id' origvalue='" + id + "' value='" + id + "'>" +
				"</div>" +
			  "</div>" +
		  "</div>"
}

function getNewProductHTML(){
	return 	  "<div style='margin-bottom: 5px;' title='product'>" +
				  "<button type='button' class='btn btn-danger btn-sm remove'>" +
					"<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>" +
				  "</button>" +
				  "<div class='form-group' style='margin: 1px;'>" +
					"<div class='col-sm-10'>" +
					  "<input type='text' class='form-control input' id='versionName' placeholder='Product' changed=false>" +
					"</div>" +
				  "</div>" +
				  "<div class='form-group'>" +
					"<div class='col-sm-10'>" +
					  "<input type='number' class='form-control input' id='versionId' placeholder='Id' changed=false>" +
					"</div>" +
				  "</div>" +
			  "</div>"
}

