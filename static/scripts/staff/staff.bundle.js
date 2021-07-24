/* VARS */

var dateFormat = 'dd-MM-yy'
var dateFormatFilter = 'yy-mm-dd'
var animValue = 'drop'
var fieldNames = [
  'entryId',
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

var filterFields = [
  'filterNomor',
  'filterName',
  'filterDateFrom',
  'filterDateTo'
]

var isTableExist = $('#tableEntry').length == 0 ? false : true;
var isFilterExist = $("#filterDateFrom").length == 0 ? false : true;
var tableEntry = null;
var cleanUrl = window.location.origin + window.location.pathname;

/* end VARS */

function SetNomorPostfix(input) {
  $('#numPostfix').val(input.substring(0, 2).toUpperCase());
}

function SetNomorYear() {
  $('#numYear').val('/' + new Date().getFullYear());
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
  let delBtn = `<button type="button" class="btn btn-outline-danger" data-bs-target="#confirm-delete" data-config-id="${data}" data-config-title="${row.numCombined}" data-bs-toggle="modal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></button>`
  let EditBtn = ` <button type="button" class="btn btn-outline-secondary" onclick="EditEntry(${data});">Edit</button>`
  return type === 'display' ?
    delBtn + EditBtn : data;
}

function DeleteEntry(id, $modalDiv, title) {
  $.ajax({
    url: '/api/entry/' + id,
    type: 'DELETE'
  })
    .done(function (data) {

      SetMessage(`Entry ${title} Deleted!`, data.messageType);
      ReloadTable();
      $modalDiv.modal('hide');
    });
}

function EditEntry(id) {
  $.ajax({
    url: '/api/entry/' + id,
    type: 'GET'
  })
    .done(function (data) {
      SetMessage(data.message, data.messageType);
      FillEditEntry(data.data)
    });
}

function FillEditEntry(data) {
  fieldNames.forEach(function (key, i) {
    if (key == 'entryId') {
      $('#' + key).val(data['id']);
    } else if (key == 'travelDate' || key == 'travelArrivalDate') {
      $('#' + key).datepicker('setDate', data[key]);
    } else {
      $('#' + key).val(data[key]);
    }

  });
  secondFields.forEach(function (key, i) {
    $('#' + key).val(data[key]);
  })
}

function SaveEditEntry() {
  let entry = {};
  let entryId = 0;
  fieldNames.forEach(function (v, i) {
    let elem = $('#' + v);
    entry[v] = elem.val();
    if (v == 'entryId') {
      entryId = elem.val();
    }
  });

  secondFields.forEach(function (v, i) {
    let elem = $('#' + v);
    entry[v] = elem.val();
  });

  let xDate = $('#travelArrivalDate').datepicker('getDate');
  entry['travelArrivalDate'] = FormatISODate(xDate);
  xDate = $('#travelDate').datepicker('getDate');
  entry['travelDate'] = FormatISODate(xDate);
  delete entry.entryId

  $.post('/api/entry/' + entryId, entry)
    .done(function (data) {
      ClearFields();
      SetMessage(data.message, data.messageType);
      ReloadTable();
    });
}

function ChangeUrl(newUrl) {
  window.location.href = newUrl;
}

function SaveToPDF() {
  console.log('Todo SaveToPDF');
}

function LoadTable() {
  if (!isTableExist) {
    return;
  }

  let apiUrl = '/api/entry/dt' + window.location.search;

  tableEntry = $('#tableEntry').DataTable({
    processing: true,
    serverSide: true,
    responsive: true,
    searching: false,
    ajax: {
      url: apiUrl,
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

  BindModalConfirm();
}

function ReloadTable() {
  if (!isTableExist) {
    return;
  }

  tableEntry.ajax.reload();
}

function ClearFilterFields() {
  let clearUrl = window.location.origin + window.location.pathname;
  ChangeUrl(clearUrl);
}

function LoadFilterValue() {
  let urlParams = new URLSearchParams(window.location.search);
  $('#filterNomor').val(urlParams.get('no'));
  $('#filterName').val(urlParams.get('name'));
  $('#filterDateFrom').val(urlParams.get('from'));
  $('#filterDateTo').val(urlParams.get('to'));
}

function SearchEntry() {
  let query = {
    no: $('#filterNomor').val(),
    name: $('#filterName').val(),
    from: $('#filterDateFrom').val(),
    to: $('#filterDateTo').val()
  }

  let newUrl = cleanUrl + '?';

  Object.keys(query).forEach(function (v, i) {
    if (query[v] != '') {
      newUrl += `&${v}=${query[v]}`;
    }
  })

  ChangeUrl(newUrl);
}

/* INIT */

function InitFilterDate() {
  if (!isFilterExist) {
    return;
  }
  var to = $("#filterDateTo")
    .datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1,
      dateFormat: dateFormatFilter
    })
    .on("change", function () {
      from.datepicker("option", "maxDate", getDate(to));
    });

  var from = $("#filterDateFrom")
    .datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1,
      dateFormat: dateFormatFilter
    })
    .on("change", function () {
      to.datepicker("option", "minDate", getDate(from));
    });
}

function BindModalConfirm() {
  // Bind click to OK button within popup
  $('#confirm-delete').on('click', '.btn-ok', function (e) {

    var $modalDiv = $(e.delegateTarget);
    var id = $(this).data('configId');
    var title = $(this).data('configTitle')

    DeleteEntry(id, $modalDiv, title)
  });
}

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

  $('#grantorName').on('change', function () {
    let input = $('#grantorName').val();
    if (input.length > 2) {
      SetNomorPostfix(input);
    }
  })

  $('#confirm-delete').on('show.bs.modal', function (e) {
    var data = $(e.relatedTarget).data();
    $('.title', this).text(data.configTitle);
    $('.btn-ok', this).data('configId', data.configId);
    $('.btn-ok', this).data('configTitle', data.configTitle);
  });

  InitFilterDate()
  SetNomorYear();
  LoadFilterValue()
  LoadTable();
});

/* INIT */