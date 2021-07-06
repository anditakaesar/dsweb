var FormIds = ['username', 'password', 'passwordConfirm', 'btnSaveCreate', 'btnDelete']
var Loading = '<img src="/assets/loading.gif" style="width: 20%;">'

function TogglePassword() {
  let elem = $('#showpassword')
  let field = $('#password')
  if (elem.prop('checked')) {
    field.prop('type', 'text')
  } else {
    field.prop('type', 'password')
  }
}

function CheckEqual() {
  let p = $('#password')
  let c = $('#passwordConfirm')
  let w = $('#passwordConfirmWarn')

  if (p.val() != c.val()) {
    w.show()
  } else {
    w.hide()
  }
}

function FillEdit(user) {
  $('#userid').val(user.id);
  $('#username').val(user.username);
}

function ClearEdit() {
  let user = {
    userid: null,
    username: null,
  }
  FillEdit(user);
  $('#password').val(null);
  $('#passwordConfirm').val(null);
}

function EditUser(userid) {
  $.get('/api/user/' + userid, function (result) {
    if (result !== undefined) {
      EnableForm();
      FillEdit(result.user);
      $('#editusermodal').modal('show');
    }
  })
}

function SaveUser() {
  if (IsFormValid()) {
    SetLoading();
    DisableForm();
    let updatedUser = {
      id: $('#userid').val(),
      username: $('#username').val(),
      password: $('#password').val(),
      passwordConfirm: $('#passwordConfirm').val(),
    }
    $.post('/api/user/' + updatedUser.id, updatedUser, updatedUser)
      .done(function (data) {
        ClearEdit();
        LoadAllUser();
        SetMessage('User Edited');
      });
  } else {
    SetMessage('Please fill all the field!', 'warning');
  }
  
}

function DisableForm() {
  FormIds.forEach(function(v, i) {
    $(`#${v}`).prop('disabled', true);
  })
}

function EnableForm() {
  FormIds.forEach(function(v, i) {
    $(`#${v}`).prop('disabled', false);
  })
}

function ShowMessage(msg) {
  $('#alertMessage').text(msg);
  $('#alertModal').prop('hidden', false);
}

function SetLoading() {
  $('#userEdit').html(Loading);
}

function CancelEdit() {
  ClearEdit();
  DisableForm();
}

function SetMessage(msg, type='primary') {
  let tpl = '<div class="alert alert-{{type}} alert-primary fade show mt-3" role="alert">{{msg}}</div>';
  let template = Handlebars.compile(tpl);
  let fullHtml = template({ msg: msg, type: type});
  $('#alertCol').html(fullHtml);
}

function IsFormValid() {
  let p = $('#password').val()
  let c = $('#passwordConfirm').val()
  let w = $('#passwordConfirmWarn').val()

  if (p === "" || c === "" || w === "") {
    return false;
  } else {
    if (p != w) {
      return false;
    }
    return true;
  }
}

function LoadAllUser() {
  $.get('/scripts/admin/usertable.hbs', function (tpl) {
    if (tpl !== undefined) {
      let template = Handlebars.compile(tpl);
      $.get('/api/user/all', function (result) {
        if (result !== undefined) {
          let generated = template(result);
          $('#userEdit').html(generated);
        }
      })
    }
  })
}

$(document).ready(function() {
  DisableForm();
  LoadAllUser();
});