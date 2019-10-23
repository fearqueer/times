let thisWeek = [],
	timeHistory = []
	timeHistoryArr = [];

let hourlyPayRate = 0,
	percentWithheld = 0;

// need to change this when percentWithheld changed
let taxFromPay = 1 - (percentWithheld / 100);

function minutesToDecimal(time) {
	var splitTime = time.split(":");
	var hour = Number(splitTime[0]);
    if (hour == 12) {
        hour = 0;
    }
	var minute = Number(splitTime[1]) / 60;
	var timeValue = hour + minute;
	return timeValue;
};

function calcHours(clockIn, clockOut, week = thisWeek) {
	var start = minutesToDecimal(clockIn);
	var end = minutesToDecimal(clockOut);
    if (start < 6) {
        start = start + 12;
    }
    if (end <= 6) {
        end = end + 12;
    }
	var hoursTotal = end - start;
	week.push(hoursTotal);
	return hoursTotal;
};

function weekTotal(week) {
	var totalForWeek = 0;
	for (let val of week) {
		totalForWeek += val;
	}
    var returnTotal = Number(totalForWeek.toFixed(2));
	return returnTotal;
}

function paycheck(hourlyPay = hourlyPayRate, weekHours = weekTotal(thisWeek), taxRate = taxFromPay) {
	paycheckTotal = ((hourlyPay * weekHours) * taxRate).toFixed(2);
    return paycheckTotal;
}

function showWeekHours() {
	var weekTotalText = weekTotal(thisWeek).toString() + " (" + weekTotalToTime() + ")";
	document.getElementById("week-hours").innerHTML = weekTotalText;
}

function showWeekPay() {
	if (hourlyPayRate != 0) {
		var paycheckText = paycheck(hourlyPayRate, weekTotal(thisWeek));
		document.getElementById("paycheck").innerHTML = "$" + paycheckText;
	}
}

function popTimeHistory() {
	// show div; reset innerHTML
	document.getElementById("time-history").style.display = "block";
	document.getElementById("entered-times").innerHTML = "";

	// populate innerHTML with timeHistoryArr objects
	for (var period in timeHistoryArr) {	
		var toTimeHistory = "<p class='time-period' data-index='"+ period +"'>";
		for (var i in timeHistoryArr[period]) {
			toTimeHistory += i + " at " + timeHistoryArr[period][i];
			if (i == "in") {
				toTimeHistory += ", ";
			} else if (i == "out") {
				// toTimeHistory += "<br>";
			}
			toTimeHistory += "";
		}
		toTimeHistory += "</p>";
		document.getElementById("entered-times").innerHTML += toTimeHistory;
	}

	// create a "remove" button and append it to each list item
	var timeList = document.getElementsByClassName("time-period");
	var i;
	for (i = 0; i < timeList.length; i++) {
		var remove = document.createElement("span");
		var removeX = document.createTextNode("remove");
		remove.className = "remove";
		remove.appendChild(removeX);
		timeList[i].appendChild(remove);
	}

	// add "remove" functionality
	removeTimePeriod();
	
}

// add hours to array from inputs
function addHours(clockIn, clockOut) {

	if(validateTimeField() == true) {
		var clockInVal = document.getElementById("clockIn").value;
    	var clockOutVal = document.getElementById("clockOut").value;

    	// if clockInVal or clockOutVal is empty, do nothing
    	if (clockInVal == "" || clockOutVal == "") {
    		console.error("Error! Please enter both times.");
    		return false;
    	}

    	console.log(calcHours(clockInVal, clockOutVal));
    	showWeekHours();
    	showWeekPay();

    	// add times to timeHistoryArr
    	timeHistoryArr.push({in: clockInVal, out: clockOutVal});

    	// populate time history section and add remove functionality
    	popTimeHistory();
    	removeTimePeriod();

    	// reset input values
    	document.getElementById("clockIn").value = "";
    	document.getElementById("clockOut").value = "";
    	
    	// focus on clockIn
        window.setTimeout(function() {
            document.getElementById("clockOut").blur();
            document.getElementById("clockIn").focus();
        }, 0);

    	// prevent page refresh
    	return false;
	} else {
//         		console.error("validation failed");
	}

	return false;
}

// change hourly pay
function changePay() {
	var newPay = prompt("what is your hourly pay rate?");
	if (newPay != null) {
		hourlyPayRate = parseFloat(newPay);
	}
}

// change settings
function showSettings() {
	// set placeholders to display the current variables
	document.getElementById("hourlyPayRate").value = hourlyPayRate;
	document.getElementById("percentWithheld").value = percentWithheld;

	// toggle visibility
	document.getElementById("settings").classList.toggle('hidden');
	document.getElementById("settings-icon").classList.toggle('settings-icon-filled');
	document.getElementById("times-form").classList.toggle('hidden');
}

function changeSettings() {
	// change hourlyPayRate
	var inputHourly = document.getElementsByName("hourlyPayRate")[0].value;
	if (inputHourly != null) {
		hourlyPayRate = inputHourly;
	}

	// change percentWithheld and taxFromPay
	inputPercent = document.getElementsByName("percentWithheld")[0].value;
	if (inputPercent != null) {
		percentWithheld = inputPercent;
	}

	taxFromPay = 1 - (percentWithheld / 100);

	// reset input values
	document.getElementById("clockIn").value = "";
	document.getElementById("clockOut").value = "";

	// toggle visibility
	showSettings();

	// repop hours and paycheck
	showWeekHours();
	showWeekPay();
	popTimeHistory();

	// prevent page refresh
	return false;
}

function removeTimePeriod() {
	// when .remove clicked
	var remove = document.getElementsByClassName("remove");

	for (i = 0; i < remove.length; i++) {
		remove[i].onclick = function() {

			var div = this.parentElement;
			var arrIndex = div.dataset.index;

			// hide other remove spans
			for (r = 0; r < remove.length; r++) {
				remove[r].classList.add('hidden');
			}

			// replace time period with "removing", "remove" with "undo"
			var undo = document.createElement("span");
			var undoX = document.createTextNode("Undo");
			undo.className = "undo";
			undo.appendChild(undoX);
			div.innerHTML = "Removing...";
			div.appendChild(undo);

			// set var for timeout func
			var undone = false;

			// if "undo" clicked, end function
			undo.onclick = function() {
				// put times back -- repop timeHistory
				popTimeHistory();
				undone = true;
			}

			// wait a few seconds before actually deleting
			setTimeout(function() {
				if (undone != true) {
					// delete the index from thisWeek and timeHistoryArr
					thisWeek.splice(arrIndex, 1);

					timeHistoryArr.splice(arrIndex, 1);
					// repop hours and paycheck
					showWeekHours();
					showWeekPay();
					popTimeHistory();
				}
			}, 2500);
		}
	}
}

function weekTotalToTime() {
	var hours = Math.floor(weekTotal(thisWeek));
	var mins = (weekTotal(thisWeek) - Math.floor(weekTotal(thisWeek))) * 60;

	if (mins < 10) {
		mins = "0" + Math.floor(mins).toString();
	} else {
		mins = Math.floor(mins).toString();
	}
	return hours + ":" + mins;
}

function showInfo(id) {
	document.getElementById(id).classList.toggle("hidden");
}

// validate time inputs
function validateTimeField() {

	var clockIn = document.getElementById("clockIn");
	var clockOut = document.getElementById("clockOut");
	var timeError = document.getElementById("time-error");

	var inIsValid = /^([0-1][0-2]|[1-9]):([0-5][0-9])$/.test(clockIn.value);
	var outIsValid = /^([0-1][0-2]|[1-9]):([0-5][0-9])$/.test(clockOut.value);

	if (inIsValid && outIsValid) {

		clockIn.classList.remove("invalid");
		clockOut.classList.remove("invalid");
		timeError.classList.add("hidden");
		return true;
	} else {
		if (!inIsValid) {
			clockIn.classList.add("invalid");
			console.error("clock-in time invalid!");
			timeError.classList.remove("hidden");
		} else {
			if (clockIn.classList.contains("invalid")) {
				clockIn.classList.remove("invalid");
			}
		}
		if (!outIsValid) {
			clockOut.classList.add("invalid");
			console.error("clock-out time invalid!");
			timeError.classList.remove("hidden");
		} else {
			if (clockOut.classList.contains("invalid")) {
				clockOut.classList.remove("invalid");
			}
		}
		return false;
	}

}