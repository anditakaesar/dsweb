var dateFormat = 'dd-MM-yy'
var animValue = 'drop'
var fieldNames = [
  'numPrefix',
  'grantorName',
  'granteeName',
  'granteePosition',
  'travelDeparture',
  'travelDestination',
  'travelType',
  'travelArrival',
  'travelArrivalDate',
  'travelReason',
  'travelDate',
  'travelLength',
  'guarantorName',
  'otherInfo'
]
var secondFields = [
  'numMiddle',
  'numPostfix',
  'numYear'
]

var isTableExist = $('#tableEntry').length == 0 ? false : true;
var isFilterExist = $("#filterDateFrom").length == 0 ? false : true;
var tableEntry = null;

function SetNomorPostfix(input) {
  $('#numPostfix').val(input.substring(0, 2).toUpperCase());
}

function SetNomorYear() {
  $('#numYear').val('/' + new Date().getFullYear());
}

function ClearFields() {
  fieldNames.forEach(function (v, i) {
    let elem = $('#' + v);
    elem.val(null);
  });
}

function SaveEntry() {
  let entry = {};
  fieldNames.forEach(function (v, i) {
    let elem = $('#' + v);
    entry[v] = elem.val();
  });

  secondFields.forEach(function (v, i) {
    let elem = $('#' + v);
    entry[v] = elem.val();
  });

  let xDate = $('#travelArrivalDate').datepicker('getDate');
  entry['travelArrivalDate'] = FormatISODate(xDate);
  xDate = $('#travelDate').datepicker('getDate');
  entry['travelDate'] = FormatISODate(xDate);

  $.post('/api/entry/', entry)
    .done(function (data) {
      ClearFields();
      SetMessage(data.message, data.messageType);
      ReloadTable();
    });

}

function TableLoadButton(data, type, row, meta) {
  let delBtn = `<button type="button" class="btn btn-danger" onclick="DeleteEntry(${data});">Delete</button>`
  let EditBtn = ` <button type="button" class="btn btn-light" onclick="EditEntry(${data});">Edit</button>`
  return type === 'display' ?
    delBtn + EditBtn : data;
}

function DeleteEntry(id) {
  console.log('Entry to delete with id: ', id)
}

function EditEntry(id) {
  console.log('Entry to EDIT with id: ', id)
}

function LoadTable() {
  if (!isTableExist) {
    return;
  }

  tableEntry = $('#tableEntry').DataTable({
    processing: true,
    serverSide: true,
    responsive: true,
    searching: false,
    ajax: {
      url: '/api/entry/dt',
      type: 'POST'
    },
    columnDefs: [
      {
        orderable: false,
        className: 'select-checkbox',
        targets: 0
      }
    ],
    select: {
      style: 'multi',
      selector: 'td:first-child'
    },
    columns: [
      { data: "empty" },
      { data: "numPrefix" },
      { data: "granteeName" },
      { data: "travelDate" },
      {
        data: "id",
        render: TableLoadButton,
        orderable: false
      }
    ],
    order: [1, 'asc']
  });
}

function ReloadTable() {
  if (!isTableExist) {
    return;
  }

  tableEntry.ajax.reload();
}

function getDate(element) {
  var date;
  try {
    date = element.datepicker("getDate");
  } catch (error) {
    date = null;
  }

  return date;
}

function InitFilterDate() {
  if (!isFilterExist) {
    return;
  }
  var to = $("#filterDateTo")
    .datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on("change", function () {
      from.datepicker("option", "maxDate", getDate(to));
    });

  var from = $("#filterDateFrom")
    .datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on("change", function () {
      to.datepicker("option", "minDate", getDate(from));
    });
}

function ClearFilterFields() {
  console.log('Todo ClearFilterFields');
}

function SearchEntry() {
  console.log('Todo SearchEntry');
}

function SaveToPDF() {
  console.log('Todo SaveToPDF');
}

// initialize
$(document).ready(function () {
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

  InitFilterDate()

  $('#grantorName').on('change', function () {
    let input = $('#grantorName').val();
    if (input.length > 2) {
      SetNomorPostfix(input);
    }
  })

  SetNomorYear();

  LoadTable();
});