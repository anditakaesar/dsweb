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
    $.post('/api/user/' + updatedUser.id, updatedUser)
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

function SetLoading() {
  $('#userEdit').html(Loading);
}

function CancelEdit() {
  ClearEdit();
  DisableForm();
}

function IsFormValid() {
  let u = $('#username').val()
  let p = $('#password').val()
  let c = $('#passwordConfirm').val()

  if (u === "" || p === "" || c === "") {
    return false;
  } else {
    if (p != c) {
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