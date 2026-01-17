async function showModalUpdateSignature(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalSignature"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalSignature"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("avatarInput").required = false
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateSignature()' class='btn btn-primary'>" + kapital(done) + "</a>"
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "signature/code"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        employeeID_POST: id,
        // language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                const employee_code = responseData[0]["employee_id"]
                const photo = responseData[0]["photo"]
                const status = responseData[0]["status"]
                const urlPhoto = "/sign/" + photo;
                document.getElementById("avatarPreview").src = urlPhoto;
                loadImageToCanvas(urlPhoto);
                await selectEmployee(employee_code)
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(active) : kapital(nonactive)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(active) : kapital(nonactive)) + "</option>";
                document.getElementById("status").innerHTML =
                    "" + mainOptionStatus + "" + optionStatus + "";
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/signature";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
function loadImageToCanvas(imageUrl) {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();
  
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  };
  
  image.src = imageUrl;
}
async function updateSignature() {
    const language = await JSON.parse(getCookie("language"));
    !(function () {
      class e {
        static initValidation() {
          Dashmix.helpers("jq-validation"),
            jQuery(".js-validation").validate({
              ignore: [],
              rules: {
                "employee": { required: !0 },
                "status": { required: !0 },
              },
              messages: {
                "employee": required,
                "status": required,
              },
            }),
            jQuery(".js-select2").on("change", (e) => {
              jQuery(e.currentTarget).valid();
            });
          jQuery(".js-flatpickr").on("change", (e) => {
            jQuery(e.currentTarget).valid();
          });
        }
        static init() {
          this.initValidation();
        }
      }
      Dashmix.onLoad(() => e.init());
    })();
    const form = jQuery(".js-validation");
    const isValid = form.valid();
    if (!isValid) {
      return false;
    }
    const employee = document.getElementById("employee").value
    const photoInput = document.getElementById("avatarInput");
  
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "signature/update";
    xhr.onloadstart = function () {
      document.getElementById("load").innerHTML =
        "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            "+ loading + "...\n\
          </button>";
    };
    xhr.onerror = function () {
      Dashmix.helpers("jq-notify", {
        z_index: 2000,
        type: "danger",
        icon: "fa fa-exclamation me-1",
        message: overload,
      });
      setTimeout(async function () {
        await keluar()
      }, 3000);
    };
  
    const jsonData =
    {
      language_POST: language,
      employeeID_POST: employee,
  
    }
  
    const formData = new FormData();
    formData.append('photo', photoInput.files[0]);
    formData.append('data', JSON.stringify(jsonData));
    xhr.onloadend = function () {
      if (this.readyState == 4 && this.status == 200) {
        var responseLogin = JSON.parse(xhr.response);
        if (responseLogin["access"] == "success") {
          updateSignatureData()
  
        } else if (responseLogin["access"] == "failed") {
          message = responseLogin["message"];
          Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            icon: "fa fa-times me-1",
            message: message,
          });
          setTimeout(function () {
            window.location.href = "/signature";
          }, 3000);
        }
      } if (this.status == 404) {
        message = "data failed to load";
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } if (this.status == 401) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } if (this.status == 500) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      }
    };
    xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(formData);
    return false;
  }
  async function updateSignatureData() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
      await getAccessToken()
    }
    const employee = document.getElementById("employee").value
    const status = document.getElementById("status").value
    const photoInput = document.getElementById("avatarInput");
  
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "signature/update";
    xhr.onerror = function () {
      Dashmix.helpers("jq-notify", {
        z_index: 2000,
        type: "danger",
        icon: "fa fa-exclamation me-1",
        message: overload,
      });
      setTimeout(async function () {
        await keluar()
      }, 3000);
    };
  
    var data = JSON.stringify(
      {
        language_POST: language,
        employeeID_POST: employee,
        status_POST: status,
        username_POST: username
      }
    );
  
    xhr.onloadend = function () {
      if (this.readyState == 4 && this.status == 200) {
        var responseLogin = JSON.parse(xhr.response);
        if (responseLogin["access"] == "success") {
          message = responseLogin["message"];
          Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "success",
            icon: "fa fa-check me-1",
            message: message,
          });
          setTimeout(function () {
            window.location.href = "/signature";
          }, 3000);
        } else if (responseLogin["access"] == "failed") {
          message = responseLogin["message"];
          Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            icon: "fa fa-times me-1",
            message: message,
          });
          setTimeout(function () {
            window.location.href = "/signature";
          }, 3000);
        }
      } if (this.status == 404) {
        message = "data failed to load";
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } if (this.status == 401) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } if (this.status == 500) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
  }