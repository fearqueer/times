const inputIn = document.getElementById("clockIn");
const inputOut = document.getElementById("clockOut");
inputIn.onkeyup = replaceWithColon;
inputOut.onkeyup = replaceWithColon;

function replaceWithColon(e) {
    // fix for chrome mobile / unidentified keys
    if(e.key == "Unidentified") {
        if (inputIn.value.includes('.')) {
            inputIn.value = inputIn.value.replace('.', ':');
        }
        if (inputOut.value.includes('.')) {
            inputOut.value = inputOut.value.replace('.', ':');
        }
    }
    
    if (e.key == ".") {
        var str = e.target.value;
        var newstr = str.replace(".", ":");
        e.target.value = newstr;
    } else if (e.key == ",") {
        var str = e.target.value;
        var newstr = str.replace(",", ":");
        e.target.value = newstr;
    }
}

// hide overlays
var overlays = document.getElementsByClassName("overlay-info");
window.onclick = function(event) {
    for (i = 0; i < overlays.length; i++) {
        if (event.target == overlays[i]) {
            overlays[i].classList.add("hidden");
        }
    }
}

window.onkeyup = function(event) {
	for (i = 0; i < overlays.length; i++) {
		if (event.keyCode === 27 || event.key == "Escape") {
			overlays[i].classList.add("hidden");
		}
	}
}