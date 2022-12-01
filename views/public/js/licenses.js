let requestURL = '/licenses.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
 
request.onload = function () {
  let data = request.response;
  data = JSON.parse(JSON.stringify(data));
  render_html(data);
}
  
function render_html(data) {
  let array = document.querySelector('#list');
  console.log(data);
  
  for(var n in data) {
    let name = data[n].name;
    let version = data[n].version;
    let licenses = data[n].licenses;
    let repository = data[n].repository;
    let licenseText = data[n].licenseText;

    // ダブルクオーテーションを削除
    name = name.replace(/\"/g,"Q");
    version = version.replace(/\"/g,"Q");
    licenses = licenses.replace(/\"/g,"Q");
    repository = repository.replace(/\"/g,"Q");
    licenseText = licenseText.replace(/\"/g,"Q");

    let code = '<div class="box">' +
    '<span class="box-titel">' + name + '</span>' +
    '<ul>' +
    '<li> Version: ' + version + '</li>' +
    '<li> license: ' + licenses + '</li>' +
    '<li> <a href="' + repository + '"> repository </a></li>' + 
    '<p class="license_text"> License Text: </p> <br>' + 
    '<span class="license_text">' + licenseText + '</span>' + 
    '</ul>' +
    '</div>';

    array.insertAdjacentHTML('beforeend', code);
  }
}