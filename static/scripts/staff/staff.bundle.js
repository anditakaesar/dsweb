var dateFormat = 'dd-MM-yy'
var animValue = 'drop'

$(document).ready(function() {
  $('#travelArrivalDate').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: dateFormat,
    showAnim: animValue,
    regional: 'id'
  });
  $('#travelDate').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: dateFormat,
    showAnim: animValue,
    regional: 'id'
  });
});