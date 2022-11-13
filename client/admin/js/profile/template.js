//Message Temp
function messagePopup(data) {
  return `<div id="popup-content">
    <div class="head alert">
        <h4>${data.message}</h4>
        <i onclick="closePopup(event)" class="icofont-close"></i>
    </div>
  </div>`;
}
