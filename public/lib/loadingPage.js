let loadingModalInstance;

function showSpinner() {
  if (!loadingModalInstance) {
    const modalEl = document.getElementById("loadingModal");
    loadingModalInstance = new bootstrap.Modal(modalEl, {
      keyboard: false,
      backdrop: 'static'
    });
  }
  loadingModalInstance.show();
}

function hideSpinner() {
  if (loadingModalInstance) {
    loadingModalInstance.hide();
  }
}
showSpinner()