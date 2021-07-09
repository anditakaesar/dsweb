function SetMessage(msg, type = 'primary') {
  if ($('#alertCol') != undefined) {
    let tpl = '<div class="alert alert-{{type}} alert-primary fade show mt-3" role="alert">{{msg}}</div>';
    let template = Handlebars.compile(tpl);
    let fullHtml = template({ msg: msg, type: type });
    $('#alertCol').html(fullHtml);
  }
}