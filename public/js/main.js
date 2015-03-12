$(function() {
//---------Calendar Functions-----------
	function sendCreate(event) {
	/**
	* Save booking on server
	*/
			//payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event._resources, "description": event.description};
			$.ajax({
			url: 'booking/',
			type: 'POST',
			data: JSON.stringify(event),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(msg) {
				$('#calendar').fullCalendar('refetchEvents');
				$('#calendar').fullCalendar('unselect');
				}
			});
	}
	
	function sendUpdate(event) {
	/**
	* Update booking on server
	*/
			//payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event.resources, "description": event.description};

			payload = clone(event);
			if (typeof payload._resources === "object") 		//It gets this if drag n drop
				payload._resources = payload.resources[0];
			delete payload["_id"];
			$.ajax({
			url: 'booking/'+event.id,
			type: 'PUT',
			data: JSON.stringify(payload),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(msg) {
				//alert(msg._resources);
				}
			});
	}
	function sendDelete(event) {
	/**
	* Update booking on server
	*/
			$.ajax({
			url: 'booking/'+event.id,
			type: 'DELETE',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(msg) {
				//alert(msg._resources);
				}
			});
	}
//------------Calendar---------------
    $(document).ready(function () {
	/*
	* Set up fullcalendar using fullcalendar functionality
	* See http://fullcalendar.io for info
	*/
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,resourceDay'
        },
        defaultView: 'resourceDay',
        editable: true,
        droppable: true,
        resources: 'rooms',
        resourceFilter: function (resource) {
          var active = $("input").map(function(){
            return this.checked ? this.name : null;
          }).get();
          return $.inArray(resource.id, active) > -1;
        },
        events: 'booking',
        // the 'ev' parameter is the mouse event rather than the resource 'event'
        // the ev.data is the resource column clicked upon
        selectable: true,
        selectHelper: true,
		select: function(start, end, ev) { //start, end, resources
				eventData = {"start": start, "end": end, "resources": ev.data.id};
				createSaveDialog(eventData);
			},
        eventClick: function (event) {
		 createUpdateDialog(event);
        },
        eventDrop: function (event, delta, revertFunc) {
		  sendUpdate(event);
		  $('#calendar').fullCalendar('refetchEvents');
        },
	    eventResize: function (event, delta, revertFunc) {
		  sendUpdate(event);
		}
      });

	  //Activate calendar into div
      $('input:checkbox').change(function(){
        $('#calendar').fullCalendar('render');
      });
    });

//----------Form creation and initialization----------------------
	var dialog, form,
		client = $("#client"),
		resources = $("#resources"),
		allDay = $("#allDay"),
		provisional = $("#provisional"),
		startdate = $("#startdate"),
		enddate = $("#enddate"),
		starttime = $("#starttime"),
		endtime = $("#endtime"),
		eventID = $("#eventID"),
		description = $("#description"),
		allFields = $([]).add(client).add(resources).add(allDay).add(provisional).add(startdate).add(enddate).add(starttime).add(endtime).add(description),
		tips = $(".validateTips"),

		allDayChecked,
		tempStart,
		tempEnd;

	function createStartTime() {
     starttime.timepicker({
		minTime:"7:00am",
		maxTime:"9:00pm"
		});
	}
	function createEndTime() {
     endtime.timepicker({
		minTime:"7:00am",
		maxTime:"9:00pm"
		});
	}
	function removeEndRange() {
			endtime.timepicker('option', 'minTime', "7:00am");
			endtime.timepicker('option', 'showDuration', false);
	}

	function updateEndRange(beginValue) {
		if (beginValue !== undefined && datesEqual()){
			bookingTime = moment(beginValue, "hh:mma")
			minStep = moment.duration(30, "minutes")
			earliestEnd = moment(bookingTime).add(minStep).format("hh:mma")
			endtime.timepicker('option', 'durationTime', bookingTime.format("hh:mma"));
			endtime.timepicker('option', 'minTime', earliestEnd);
			endtime.timepicker('option', 'showDuration', true);
		}
		else removeEndRange();
	}
	function datesEqual() {
		if (!startdate.datepicker('getDate') || !enddate.datepicker('getDate')) return false;
		return startdate.datepicker('getDate').toString() == enddate.datepicker('getDate').toString();
	}

	allDay.on('click', function() {
		prepareAllDay();
	})
	function prepareAllDay() {
	 	allDayChecked = allDay.prop('checked');
		if (allDayChecked) {
			 tempStart = starttime.timepicker('getTime');
			 starttime.timepicker('remove');
			 starttime.val("All Day")
			 starttime.prop('disabled', true);

			 tempEnd = endtime.timepicker('getTime');
			 endtime.timepicker('remove');
			 endtime.val("All Day")
			 endtime.prop('disabled', true);
		}
		else {
			 starttime.prop('disabled', false);
			 createStartTime();
			 starttime.timepicker('setTime', tempStart);

			 endtime.prop('disabled', false);
			 createEndTime();
			 endtime.timepicker('setTime', tempEnd);
			 updateEndRange(starttime.val())
		}
	};

	startdate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});
	enddate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});

	//TODO:Wrap this stuff into a function, or on document load
	startdate.datepicker("setDate", Date.now());
	enddate.datepicker("setDate", Date.now());

	createStartTime();
	createEndTime();

	 starttime.on('change', function() {
		updateEndRange($(this).val());
	 });
	startdate.on('change', function() {
	    if (!allDayChecked) {
			if (datesEqual()) updateEndRange(starttime.val())
			else removeEndRange()
		}
	});
	enddate.on('change', function() {
	    if (!allDayChecked) {
			if (datesEqual()) updateEndRange(starttime.val())
			else removeEndRange()
		}
	});


//-----Form validation-----------------------
	function updateTips(t) {
		tips
			.text(t)
			.addClass("ui-state-highlight");
		setTimeout(function() {
			tips.removeClass("ui-state-highlight", 1500);
		}, 500);
	}

	function checkLength(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass("ui-state-error");
			updateTips("Length of " + n + " must be between " +
				min + " and " + max + ".");
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp(o, regexp, n) {
		if (!(regexp.test(o.val()))) {
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}

	function checkDate(o, n) {
		if (!moment(o.datepicker("getDate")).isValid()) {
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
	function checkTime(o, n) {
		if (!moment(o.timepicker("getTime")).isValid()){
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}

	function timesChronological(o1, o2, n) {
		timeA = moment(o1.timepicker("getTime"));
		timeB = moment(o2.timepicker("getTime"));
		if (!timeB.isAfter(timeA))	{
			o1.addClass("ui-state-error");
			o2.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
function datesChronological(o1, o2, n) {
		dateA = moment(o1.datepicker("getDate"));
		dateB = moment(o2.datepicker("getDate"));
		if (!dateB.isAfter(dateA) && !dateB.isSame(dateA))	{
			o1.addClass("ui-state-error");
			o2.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
	function validateBookingForm() {
		var valid = true;
		allFields.removeClass("ui-state-error");
		valid = valid && checkLength(client, "client", 2, 30);
		valid = valid && checkRegexp(client, /^[a-z]([0-9a-z_\s])+$/i, "Client Name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
		valid = valid && checkDate(startdate, "Must be a valid date");
		valid = valid && checkDate(enddate, "Must be a valid date");

		valid = valid && datesChronological(startdate, enddate, "End date must be after or same as Start date");
		if (!$("#allDay").prop('checked')){
			valid = valid && checkTime(starttime, "Must be a valid time");
			valid = valid && checkTime(endtime, "Must be a valid time");
			if(datesEqual()){
				valid = valid && timesChronological(starttime, endtime, "End time must be after start time!")
			}
		}
	return valid;
	}

//-----Form Submission-----------------
function createBookingDates() {
		//TODO: Make sure all variables for each form property only have 1 definition, not multiple ones
		var allDayChecked = $("#allDay").prop('checked');
		if (!allDayChecked){
		//TODO: Check date format, make sure there is a consistent protocol
		//Even develop a couple of functions for them
			start = moment(startdate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(starttime.timepicker("getTime")).format("hh:mm a");
			end = moment(enddate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(endtime.timepicker("getTime")).format("hh:mm a");
		}
		else {
			start = moment(startdate.datepicker("getDate")).format("DD/MM/YYYY");
			end = moment(enddate.datepicker("getDate")).format("DD/MM/YYYY");
		}
			start = moment(start, "DD/MM/YYYY hh:mm a").toDate();
			end = moment(end, "DD/MM/YYYY hh:mm a").toDate();

	console.log(start);
	console.log(end);
	returnObj = [];
	returnObj.start = start;
	returnObj.end = end;
	returnObj.allDayChecked = allDayChecked;
	return returnObj;
}

	function addCustomEventInfo(event) {
		bookingInfo = createBookingDates();
		event.start = bookingInfo.start;
		event.end = bookingInfo.end;
		event.allDay = bookingInfo.allDayChecked;
		event.client = client.val();
		event.provisional = provisional.prop("checked");
		event._resources = resources.val();
		event.description = description.val();
	}

	function updateBooking() {
		if (validateBookingForm()) {
			event = $("#calendar").fullCalendar('clientEvents', eventID.val())[0];
			addCustomEventInfo(event);
			sendUpdate(event);
			$("#calendar").fullCalendar('updateEvent', event)
			$('#calendar').fullCalendar('refetchEvents');
			dialog.dialog("close");
			return true;
		}
		else return false;
	}

	function addBooking() {
		if (validateBookingForm()) {
			event = {};
			addCustomEventInfo(event);
			sendCreate(event);
			
			dialog.dialog("close");
			return true;
		}
		else return false;
	}

	function deleteBooking() {
		event = $("#calendar").fullCalendar('clientEvents', eventID.val())[0]
		sendDelete(event);
		$('#calendar').fullCalendar('refetchEvents');
		dialog.dialog("close");
	} 

//--------Form Creation-------------
	function createUpdateDialog(data) {
		dialog.dialog("option", "buttons", 
			[dialogButtons[1], dialogButtons[2], dialogButtons[3]]);
		createDialog(data)
		if (data.id !== undefined){
			eventID.val(data.id);
		}
	}
	function createSaveDialog(data) {
		dialog.dialog("option", "buttons", 
			[dialogButtons[0], dialogButtons[3]]);
		createDialog(data)
	}
	function createDialog(data) {
		dialog.dialog("open");
		if (data !== undefined) {
			if (data.start != undefined) {
				starttime.timepicker("setTime", moment(data.start).format("hh:mm a"));
				startdate.datepicker("setDate", moment(data.start).format("DD MMMM YYYY"));
			}
			if (data.end != undefined) {
				endtime.timepicker("setTime", moment(data.end).format("hh:mm a"));
				enddate.datepicker("setDate", moment(data.end).format("DD MMMM YYYY"));
			}

			if (data.allDay != undefined)
				allDay.prop("checked", data.allDay);
			if (data.client != undefined)
				client.val(data.client);
			if (data.resources != undefined)
				resources.val(data.resources);
			if (data.description != undefined)
				description.val(data.description);
			if (data.provisional != undefined)
				provisional.prop("checked", data.provisional);
			else
				description.val("");
		}
	}

	dialogButtons = [
		{
			text: "Save Booking",
			click: addBooking
		},
		{
			text: "Update Booking",
			click: updateBooking
		},
		{
			text: "Delete Booking",
			click: deleteBooking
		},
		{
			text: "Cancel",
			click: function() {
				dialog.dialog("close");
			}
		}
	];

	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 500,
		width: 350,
		modal: true,
		buttons: dialogButtons,
		close: function() {
			form[0].reset();
			allFields.removeClass("ui-state-error");
		}
	});
	form = dialog.find("form").on("submit", function(event) {
		event.preventDefault();
		addBooking();
	});

	$("#create-booking").button().on("click", function() {
		createSaveDialog();
	});
});
//---------Aux Methods-----------------
function clone(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = {} // changed

    for(var key in obj) {
		temp[key] = obj[key];
    }
    return temp;
}

//---------Charge Table----------------
$(document).ready(function() {

function makeInputBox(name, value){
	rtnStr = "<input id='"+name+"' name='"+name+"' type = 'text' value='"+value+"'>";
	return rtnStr;
}

function makeHiddenBox(name, value){
	rtnStr = "<input id='"+name+"' name='"+name+"' type = 'hidden' value='"+value+"'>";
	return rtnStr;
}

function makeSelectBox(name, values, def) {
	rtnStr = "<select id='"+name+"' name='"+name+"'>";
	for (value in values) {
		option = values[value];
		selected = (option === def ? "selected = 'selected'" : "");
		optionString = "<option value='"+option+"' "+selected+"> "+option +"</option>";
		rtnStr += optionString;
	}
	rtnStr += "</select>"
	return rtnStr;
}
function makeChargeRow(amount, selection, other, id) {
	chargeRow = [
			makeInputBox("amount-"+String(chargeRowCounter), amount),
			makeSelectBox("type-"+String(chargeRowCounter), ["booking", "catering", "other"], selection),
			makeInputBox("other-"+String(chargeRowCounter), other),
			makeHiddenBox("id-"+String(chargeRowCounter), id)
	];
	chargeRowCounter += 1;
	return chargeRow;
}
	var chargeRowCounter = 0;

	var t = $('#charges').DataTable({
		autowidth: false,
		searching: false,
		paging: false,
		columnDefs:[
			{
				targets: [3],
				visible: false
			}
		]
	});

	$('#addCharge').on('click', function(event) {
		event.preventDefault();
		t.row.add(makeChargeRow(200, "catering", "", "132if")).draw();
	});
});
