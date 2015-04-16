$(document).ready(function() {
	$(".bookingDate strong").each(function(){
		momDate = moment($(this).text());
		$(this).text(momDate.format("DD MMMM YY (hh:mm)"));
	});
	var t = $('#Bookings').DataTable({
		"ajax": {
			"url":"/calendar/booking",
			"dataSrc": function(json) {
				for (booking in json) {
					json[booking].start = moment(json[booking].start).format("DD/MM/YY hh:mm");
					json[booking].end = moment(json[booking].end).format("DD/MM/YY hh:mm");
					chargeList = [];
					chargeTotal = 0.0;
					for (charge in json[booking].charges) {
						charge = json[booking].charges[charge]
						amount = charge.amount;
						chargeTotal += parseFloat(amount);
						chargetype = charge.chargeType !== "other" ? charge.chargeType : charge.otherDesc;
						chargeList.push([amount, chargetype]);
					}
					json[booking].charges = chargeList;
					json[booking].chargeType = "<b> --- </b>";
					json[booking].amount = "<b>" + chargeTotal + "</b>"
					
				}
				return json;
			}
		},
		"columns": [
			{"data": "yearMonth"},
			{"data": "prettyYearMonth"},
			{"data": "client"},
			{"data": "start"},
			{"data": "end"},
			{"data": "_resources.name"},
			{"data": "description"},
			{"data": "charges"},
			{"data": "chargeType"},
			{"data": "amount"},
		],
		"columnDefs": [
			{"targets": [0, 1, 7],
			"visible": false
			},
			{"targets": [6],
			"width": "20%"
			},
			],
		"order": [[0, "asc"]],
		"drawCallback": function ( settings ) {
			var api = this.api();
			var rows = api.rows( {page:'current'} ).nodes();
			var last=null;
 
			api.column(0, {page:'current'} ).data().each(function(group, i ) {
				if ( last !== group ) {
					$(rows).eq( i ).before(
						'<tr class="group"><td colspan="5">'+ api.cell(i, 1).data()+ '</td></tr>'
					);
 
					last = group;
				}
			});
			api.column(7, {page:'current'} ).data().each(function(charges, i ) {
					for (charge in charges) {
					$(rows).eq( i ).after(
						'<tr><td colspan="5"></td>' +
						'<td>' + charges[charge][1] + '</td>' +
						'<td>' + charges[charge][0] + '</td>'+
						'</tr>'
					);
				}
			});
		}
	});
});
