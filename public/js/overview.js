$(document).ready(function() {
	$(".bookingDate strong").each(function(){
		momDate = moment($(this).text());
		$(this).text(momDate.format("DD MMMM YY (hh:mm)"));
	});
	console.log($('#Bookings'));
	var t = $('#Bookings').DataTable();

});
