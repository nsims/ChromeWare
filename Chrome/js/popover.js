//Created by Parth Narielwala


//This function will create a popover on the input fields
//if there is any value in the field. This is because the
//user can't tell what the field is after there is values
//because you can no longer see the placeholder text

function dynamicPopover(){
	$(document).ready(function() {
		//This gets all the input fields
		var formField = ".form-control";
		$(formField).hover(function() {
			//Retrieve the value of the field for comparison
			var popupValue = $(this).val();
			if(popupValue !== ""){
				//If the field is not empty, then it will apply
				//the popover
				var popupName = $(this).prev().text();
				console.log(popupName);
				$(this)
					.popover({content: popupName, placement:"top", container: 'body', trigger: 'focus'});
			}
			else{
				//Else, if the field is empty then the field
				//destroys the popover
				$(this).popover('destroy');
			};
		});
	});
}