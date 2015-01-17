$(function() {
	function sendCreate(event) {
			console.log(event);
			payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event.resources}
			console.log(payload);
			$.ajax({
			url: 'booking/',
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
			console.log(event)
			payload = {"title": event.title, "start": event.start, "end": event.end, "allDay": event.allDay, "client": event.client, "_resources" : event.resources}
			console.log(payload)
			$.ajax({
			url: 'booking/'+event.id,
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
				console.log(ev);
				dialog.dialog("open");
				var title = prompt('Event Title:');
				var eventData;
				var allDay = !start.hasTime();
				if (title) {
					eventData = {
						title: title,
						start: start,
						allDay: allDay,
						end: end,
						resources: ev.data.id,
						client: "bob"
					};
				sendCreate(eventData);
				};
			},
        eventClick: function (event) {
		  //console.log("event clicked");
          console.log(event);
  		  event.title = "CLICKED!";
        },
        eventDrop: function (event, delta, revertFunc) {
		  //console.log("event dropped");
          //console.log(event);
		  sendUpdate(event);
        },
	    eventResize: function (event, delta, revertFunc) {
		  //console.log("event resized");
		  //console.log(event);
		  sendUpdate(event);
		}
      });
    });

    $(document).ready(function() {
      $('input:checkbox').change(function(){
        $('#calendar').fullCalendar('render');
      });
    });

	var starttime = $("#starttime");
	var endtime = $("#endtime");
	var allDay = $("#allDay");
	var startdate = $("#startdate");
	var enddate = $("#enddate");

	var allDayChecked;
	var tempStart;
	var tempEnd;

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
			console.log(earliestEnd)
			endtime.timepicker('option', 'durationTime', bookingTime.format("hh:mma"));
			endtime.timepicker('option', 'minTime', earliestEnd);
			endtime.timepicker('option', 'showDuration', true);
		}
		else removeEndRange();
	}
	function datesEqual() {
		if (!startdate.datepicker('getDate') || !enddate.datepicker('getDate')) return false;
		console.log(startdate.datepicker('getDate'));;
		console.log(enddate.datepicker('getDate'));
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
		tips = $(".validateTips");

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

	function addBooking() {
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
		if (valid) {
			start = startdate.val()+ " " + starttime.val()
			end = enddate.val()+ " " + endtime.val()
			console.log(start)
			console.log(end)
			payload = {"title": title.val(), "start": start, "end": end, "allDay": allDay.val(), "client": client.val(), "_resources" : resources.val()}
			//sendCreate(payload);
			
			dialog.dialog("close");
		}
		console.log(valid);
		return valid;
	}

	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 900,
		width: 950,
		modal: true,
		buttons: {
			"Save Booking": addBooking,
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
		dialog.dialog("open");
	});

	$(document).ready(function () {
			dialog.dialog("open");
	})
});
