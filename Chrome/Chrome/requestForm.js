//Gets form data for request
function save_entries() {
	var title = document.getElementById("title");
	localStorage.setItem("request_title", title.value);
	
	var behavior = document.getElementById("behavior");
	localStorage.setItem("request_behavior", behavior.value);
	
	var stepstoreproduce = document.getElementById("stepstoreproduce");
	localStorage.setItem("request_steps", stepstoreproduce.value);
}

//Restore user's previous input to the form
function restore_entries() {
	var prev_title = localStorage.getItem("request_title");
	var prev_behavior = localStorage.getItem("request_behavior");
	var prev_steps = localStorage.getItem("request_steps");
	
	if(prev_title){
		document.getElementById("title").value = prev_title;
	}
	if(prev_behavior){
		document.getElementById("behavior").value = prev_behavior;
	}
	if(prev_steps){
		document.getElementById("stepstoreproduce").value = prev_steps;
	}
}

document.addEventListener('DOMContentLoaded', restore_entries);