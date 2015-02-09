// Saves options to localStorage.
function save_options() {
 //############
	console.log("it works");
	var swLoginInput = $('#SWLogin');
	var swPwdInput = $('#SWPwd');
	if(!(swPwdInput.val()=="GoodTry ;)")){
		var logger = new Logger();
		logger.saveSWCred(swLoginInput.val(), swPwdInput.val());
	}
	else
	{
		console.log('dummy pwd');
	}
	var reqParamOption = $('#reqParam').val();
	localStorage.setItem("CW-urlParams", reqParamOption);
	
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
	var products = localStorage.getItem("Products").split("&&");
	var count;
	for(count in products){
		var version = products[count];
		var id = localStorage.getItem("" + version);
		$("#productForm").append(
				  "<div style='margin-bottom: 5px;' title='product'>" +
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
				  "</div>");
	}
}

function removeVersion(){
	//also need to remove
	$(this).parent().hide();
}

function addVersion(){
	$("#productForm").append(
				  "<div style='margin-bottom: 5px;' title='product'>" +
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
				  "</div>");
	$('.remove').click(removeVersion);
	$('.input').change(addChangeAttr);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);

}

function addChangeAttr(){
	$(this).attr("changed", true);
}

function saveProductList(){
	
	//Delete hidden products from localstorage
	var updatedProduct = [];
	$("div[title='product']").each(function(){
			//if visible update localstorage
			
			var versionElement = $(this).find("input[id='versionName']");
			var idElement = $(this).find("input[id='versionId']"); // might need to pass in jQuery element
			if($(this).is(":visible")){
				//if its NOT a newly added product
				if($(versionElement).attr("origValue") != null){
					if($(versionElement).attr("changed") == true){
						localStorage.removeItem("" + $(versionElement).attr("origValue"));
					}
					console.log("Item set: " + $(versionElement).val());
					localStorage.setItem("" + $(versionElement).val(), $(idElement).val());
					updatedProduct.push("" + $(versionElement).val());
				}
				else{
					if(localStorage.getItem("" + $(versionElement).val()) == null){
						console.log("Item set: " + $(versionElement).val());
						localStorage.setItem("" + $(versionElement).val(), $(idElement).val());
						updatedProduct.push("" + $(versionElement).val());
						console.log("new product");
					}
					console.log("blah: " + localStorage.getItem("" + $(versionElement).val()));
				}
			}
			else{
				if(localStorage.getItem("" + $(versionElement).val()) != null){
					localStorage.removeItem("" + $(versionElement).attr("origValue"));
				}
			}
		}
	);
	localStorage.setItem("Products", updatedProduct.join("&&"));
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
	restore_options();
	initializedProductList();
	$('#save').click(save_options);
	$('.remove').click(removeVersion);
	$('#addNewProduct').click(addVersion);
	$('.input').change(addChangeAttr);
});





