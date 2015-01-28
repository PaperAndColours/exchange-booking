$(function() {
//---------Calendar Functions-----------
	function sendCreate(event) {
			payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event._resources}
			$.ajax({
			url: 'calendar/booking/',
			type: 'POST',
			data: JSON.stringify(payload),
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
			payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event.resources}
			$.ajax({
			url: 'calendar/booking/'+event.id,
			type: 'PUT',
			data: JSON.stringify(payload),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(msg) {
				alert(msg);
				}
			});
	}
//------------Calendar---------------
    $(document).ready(function () {
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
        resources: 'calendar/rooms',
        resourceFilter: function (resource) {
          var active = $("input").map(function(){
            return this.checked ? this.name : null;
          }).get();
          return $.inArray(resource.id, active) > -1;
        },
        events: 'calendar/booking',
        // the 'ev' parameter is the mouse event rather than the resource 'event'
        // the ev.data is the resource column clicked upon
        selectable: true,
        selectHelper: true,
		select: function(start, end, ev) { //start, end, resources
				eventData = {"start": start, "end": end, "resources": ev.data.id};
				createDialog(eventData);
			},
        eventClick: function (event) {
		 createDialog(event);
        },
        eventDrop: function (event, delta, revertFunc) {
		  sendUpdate(event);
        },
	    eventResize: function (event, delta, revertFunc) {
		  sendUpdate(event);
		}
      });
    });

    $(document).ready(function() {
      $('input:checkbox').change(function(){
        $('#calendar').fullCalendar('render');
      });
    });

//----------Modal Form----------------------
	var dialog, form,
		title = $("#title"),
		client = $("#client"),
		resources = $("#resources"),
		allDay = $("#allDay"),
		startdate = $("#startdate"),
		enddate = $("#enddate"),
		starttime = $("#starttime"),
		endtime = $("#endtime"),
		allFields = $([]).add(title).add(client).add(resources).add(allDay).add(startdate).add(enddate).add(starttime).add(endtime),
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
	});

	startdate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});
	enddate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});
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


//-----Form submission & validation


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
	function addBooking() {
		if (validateBookingForm()) {
		var allDayChecked = $("#allDay").prop('checked');
		if (!allDayChecked){
			start = moment(startdate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(starttime.timepicker("getTime")).format("hh:mm a");
			end = moment(enddate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(endtime.timepicker("getTime")).format("hh:mm a");
		}
		else {
			start = moment(startdate.datepicker("getDate")).format("DD/MM/YYYY");
			end = moment(enddate.datepicker("getDate")).format("DD/MM/YYYY");
		}
			console.log(start);
			start = moment(start, "DD/MM/YYYY hh:mm a").toDate();
			end = moment(end, "DD/MM/YYYY hh:mm a").toDate();
			payload = {"title": title.val(), "start": start, "end": end, "allDay": allDayChecked, "client": client.val(), "_resources" : resources.val()}
			console.log(payload);
			sendCreate(payload);
			
			dialog.dialog("close");
			return true;
		}
		else return false;
	
	}

//--------Form Creation-------------
	function createDialog(data) {
		console.log(data);
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

			if (data.title != undefined)
				title.val(data.title);
			if (data.allDay != undefined)
				allDay.prop("checked", data.allDay);
			if (data.client != undefined)
				client.val(data.client);
			if (data.resources != undefined)
				resources.val(data.resources);
		}
	}

	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 500,
		width: 350,
		modal: true,
		buttons: {
			"Save Booking": addBooking,
			"Update Booking": addBooking,
			Cancel: function() {
				dialog.dialog("close");
			}
		},
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
		createDialog();
	});

	$(document).ready(function () {
		createDialog();
	})
});
