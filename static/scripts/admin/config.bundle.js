var FormIds = ['configId', 'configKey', 'configValue', 'configIdTxt', 'btnDelete']
var Loading = '<img src="/assets/loading.gif" style="width: 20%;">';

function LoadAllConfig() {
  $.get('/scripts/admin/configtable.hbs', function (tpl) {
    if (tpl !== undefined) {
      let template = Handlebars.compile(tpl);
      $.get('/api/config/all', function (result) {
        if (result !== undefined) {
          let generated = template(result);
          $('#configEdit').html(generated);
        }
      })
    }
  })
  BindModalConfirm();
}

function SetLoading() {
  $('#configEdit').html(Loading);
}

function SaveCreateConfig() {
  if (IsFormValid()) {
    SetLoading();
    let newConfig = {
      configkey: $('#configKey').val(),
      configvalue: $('#configValue').val(),
    }
    let postUrl = '/api/config/';
    if ($('#configId').val() !== "") {
      postUrl += $('#configId').val();
    }

    $.post(postUrl, newConfig)
      .done(function (data) {
        ClearEdit();
        LoadAllConfig();
        SetMessage(data.message, data.messageType);
      })
  } else {
    SetMessage('Set Config Key', 'warning');
  }
}

function ClearEdit() {
  let cfg = {
    id: null,
    configkey: null,
    configvalue: null,
  }
  FillEdit(cfg);
}

function FillEdit(cfg) {
  $('#configId').val(cfg.id);
  $('#configKey').val(cfg.configkey);
  $('#configValue').val(cfg.configvalue);
  $('#configIdTxt').html(cfg.id == null ? 'new' : cfg.id);
  $('#configSaveBtnTxt').html(cfg.id == null ? 'Create' : 'Save');
}

function EditConfig(cfgid) {
  $.get('/api/config/' + cfgid, function (result) {
    if (result !== undefined) {
      FillEdit(result.config);
      SetMessage(result.message, result.messageType);
    }
  })
}

function BindModalConfirm() {
  // Bind click to OK button within popup
  $('#confirm-delete').on('click', '.btn-ok', function (e) {

    var $modalDiv = $(e.delegateTarget);
    var id = $(this).data('configId');

    $.ajax('/api/config/' + id,
      {
        type: 'DELETE',
        success: function (result) {
          SetMessage(result.message, result.messageType);
          LoadAllConfig();
          $modalDiv.modal('hide');
        }
      });
  });
}

function IsFormValid() {
  if ($('#configKey').val() !== "") {
    return true;
  }

  return false;
}

$(document).ready(function () {
  LoadAllConfig();
  // Bind to modal opening to set necessary data properties to be used to make request
  $('#confirm-delete').on('show.bs.modal', function (e) {
    var data = $(e.relatedTarget).data();
    console.log(data)
    $('.title', this).text(data.configTitle);
    $('.btn-ok', this).data('configId', data.configId);
  });
});