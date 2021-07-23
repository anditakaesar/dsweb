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
  let delBtn = `<button type="button" class="btn btn-outline-danger" onclick="DeleteEntry(${data});"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>`
  let EditBtn = ` <button type="button" class="btn btn-outline-secondary" onclick="EditEntry(${data});">Edit</button>`
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