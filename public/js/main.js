	//TODO: Check date format, make sure there is a consistent protocol
	//Even develop a couple of functions for them
$(document).ready(function () {
//---------Calendar Functions-----------
	function sendCreate(event, onError, onSuccess) {
	/**
	* Save booking on server
	*/
			$.ajax({
			url: 'booking/',
			type: 'POST',
			data: JSON.stringify(event),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: onSuccess,
			error: onError});
	}
	
	function sendUpdate(event, onError, onSuccess) {
	/**
	* Update booking on server
	*/
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
			success: onSuccess,
			error: onError
			});
	}
	function sendDelete(event, onError, onSuccess) {
	/**
	* Update booking on server
	*/
			$.ajax({
			url: 'booking/'+event.id,
			type: 'DELETE',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: onSuccess,
			error: onError
			});
	}

	chargeTypes = undefined;
	function getChargeTypes(event) {
			$.ajax({
			url: 'chargeTypes',
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(msg) {
				chargeTypes = msg;
				}
			});
	}
//------------Calendar---------------
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
		height: $(window).height()*.9,
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
		  onFail = function(event) {
		  	revertFunc();
			event.resourceId = event.oldResourceId;
			alert("Could not connect to server - Update failed")
		 }
		  sendUpdate(event, onFail);
		  $('#calendar').fullCalendar('refetchEvents');
        },
	    eventResize: function (event, delta, revertFunc) {
		  onFail = function(event) {
		  	revertFunc();
			event.resourceId = event.oldResourceId;
			alert("Could not connect to server - Update failed");
		 }
		  sendUpdate(event, onFail);
		}
      });

	  //Activate calendar into div
      $('input:checkbox').change(function(){
        $('#calendar').fullCalendar('render');
      });


//----------Global initialization--------------------------------
	getChargeTypes();
	

//----------Form creation and initialization----------------------
	var dialog, form,
		client = $("#client"),
		resources = $("#resources"),
		provisional = $("#provisional"),
		startdate = $("#startdate"),
		enddate = $("#enddate"),
		starttime = $("#starttime"),
		endtime = $("#endtime"),
		eventID = $("#eventID"),
		description = $("#description"),
		allFields = $([]).add(client).add(resources).add(provisional).add(startdate).add(enddate).add(starttime).add(endtime).add(description),
		tips = $(".validateTips");

	startdate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});
	enddate.datepicker({
		dateFormat : "dd MM yy",
		setDate : Date.now()
	});

	//Make the time display work
	createStartTime();
	createEndTime();

	starttime.on('change', function() {
		updateEndRange();
	 });
	startdate.on('change', function() {
		if (datesEqual()) 
			updateEndRange()
		else 
			removeEndRange()
	});
	enddate.on('change', function() {
		if (datesEqual()) 
			updateEndRange()
		else 
			removeEndRange()
	});

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

	function updateEndRange() {
		beginValue = starttime.val();
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
		valid = valid && checkTime(starttime, "Must be a valid time");
		valid = valid && checkTime(endtime, "Must be a valid time");
		if(datesEqual())
			valid = valid && timesChronological(starttime, endtime, "End time must be after start time!")
	return valid;
	}

//-----Form Submission-----------------
	function createBookingDates() {
		returnObj = [];
		start = moment(startdate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(starttime.timepicker("getTime")).format("hh:mm a");
		end = moment(enddate.datepicker("getDate")).format("DD/MM/YYYY")+ " " + moment(endtime.timepicker("getTime")).format("hh:mm a");
		returnObj.start = moment(start, "DD/MM/YYYY hh:mm a").toDate();
		returnObj.end = moment(end, "DD/MM/YYYY hh:mm a").toDate();

		return returnObj;
	}

	function addCustomEventInfo(event) {
		bookingInfo = createBookingDates();
		event.start = bookingInfo.start;
		event.end = bookingInfo.end;
		event.client = client.val();
		event.provisional = provisional.prop("checked");
		event._resources = resources.val();
		event.description = description.val();
		event.charges = getTableData();
	}

	function updateBooking() {
		if (validateBookingForm()) {
			event = $("#calendar").fullCalendar('clientEvents', eventID.val())[0];
			addCustomEventInfo(event);
			sendUpdate(event, function(){
				alert("Could not connect to server - Update failed")},
				function() {
					console.log(event)
					$("#calendar").fullCalendar('updateEvent', event);
					$('#calendar').fullCalendar('refetchEvents');
					dialog.dialog("close");
				}
			)
			return true;
		}
		else return false;
	}

	function addBooking() {
		if (validateBookingForm()) {
			event = {};
			addCustomEventInfo(event);
			sendCreate(event, 
				function() {
					alert("Could not connect to server - Update failed")
				},
				function() {
					$('#calendar').fullCalendar('refetchEvents');
					$('#calendar').fullCalendar('unselect');
					dialog.dialog("close");
				}
			);
			
			return true;
		}
		else return false;
	}

	function deleteBooking() {
		event = $("#calendar").fullCalendar('clientEvents', eventID.val())[0]
		sendDelete(event, function() {
			alert("Could not connect to server - Delete failed")},
		function() {
			$('#calendar').fullCalendar('refetchEvents');
			dialog.dialog("close");
		});
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
			updateEndRange(); //makes the end time selector show time if relevant
			if (data.client != undefined)
				client.val(data.client);
			if (data.resources != undefined)
				resources.val(data.resources);
			if (data.description != undefined)
				description.val(data.description);
			else
				description.val("");
			if (data.provisional != undefined)
				provisional.prop("checked", data.provisional);
			if (data.charges !== undefined) 
				loadTable(data.charges);
			else 
				clearTable();
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
		height: $(window).height()*.9,
		width: 450,
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

	function makeInputBox(name, value, type, cssClass){
		cssClass = cssClass !== undefined ? "class = '" + cssClass +"'" : "";
		rtnStr = "<input id='"+name+"' name='"+name+"' " + cssClass +" type = '"+type+"' value='"+value+"'>";
		return rtnStr;
	}

	function makeDeleteButton(){
		rtnStr = "<button class='chargeDelete'> Delete </button>"
		return rtnStr;
	}

	function makeSelectBox(name, values, def, cssClass) {
		cssClass = cssClass !== undefined ? "class = '" + cssClass +"'" : "";
		rtnStr = "<select id='"+name+"' name='"+name+"' " + cssClass + " >";
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
				makeInputBox("amount-"+String(chargeRowCounter), amount, "text", "chargeAmount"),
				makeSelectBox("type-"+String(chargeRowCounter), chargeTypes, selection, "chargeType"),
				makeInputBox("other-"+String(chargeRowCounter), other, "text", "chargeOtherType"),
				makeDeleteButton(),
				makeInputBox("id-"+String(chargeRowCounter), id, "hidden", "chargeID")
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
					//visible: false
					orderable: false
				}
			],
			"createdRow": function(row, data, dataIndex) {
				$(row).find('.chargeAmount').autoNumeric('init', {aSign: "£"});
				otherField = $(row).find('.chargeOtherType');
				if ($(row).find('.chargeType').val() === "other") 
					otherField.show();
				else 
					otherField.hide();

				$(row).find('.chargeType').on('change', function(event) {
					otherField = $(this).parent().parent().find('.chargeOtherType');
					if ($(this).val() === "other")
						otherField.show();
					else
						otherField.hide();
						
				});
				$(row).find('.chargeDelete').on('click', function(event) {
					event.preventDefault();
					$(row).find('.chargeAmount').autoNumeric('destroy');
					t.row(row).remove();
					t.draw();
				});
			}
		});

	function getTableData() {
		rowCount = t.rows().indexes().length;
		data = [];
		for (var i=0; i<rowCount; i++) {
			charge = {};
			charge.amount = t.row(i).nodes().to$().find('.chargeAmount').val();
			charge.chargeType = t.row(i).nodes().to$().find('.chargeType').val();
			charge.otherDesc = t.row(i).nodes().to$().find('.chargeOtherType').val();
			charge.id = t.row(i).nodes().to$().find('.chargeID').val();
			data.push(charge);
		}
		return data;
	}

	function loadTable(dataSets) {
		t.clear();
		for (idx in dataSets) {
			charge = dataSets[idx];
			chargeRow = makeChargeRow(charge.amount, charge.chargeType, charge.otherDesc, charge.id);
			t.row.add(chargeRow);
		}
		t.draw();
	}
	function clearTable() {
		t.clear();
		t.draw();
	}

	$('#addCharge').on('click', function(event) {
		event.preventDefault();
		chargeRow = makeChargeRow(0, "booking", "", "")
		t.row.add(chargeRow).draw();
	});

}); 
