async function showModalInsertUsers(id) {
  const element = document.getElementById(id)
  var myModal = new bootstrap.Modal(document.getElementById("modalUsers"), { keyboard: false });
  myModal.toggle();
  document.getElementById("selectFullname").disabled = false
  document.getElementById("passwordhide").hidden = false
  await selectEmployee()
  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>  <button id='doneBtn' type='submit' onclick='insertUsers()' class='btn  btn-primary'>" + kapital(done) + "</button>"
  document.getElementById("selectStatusActive").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='1'>" + kapital(active) + "</option><option value='0'>" + kapital(nonactive) + "</option>"
}
async function insertUsers() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const fullname = document.getElementById("selectFullname").value
  const username = document.getElementById("selectUsername").value
  const password = document.getElementById("password").value
  const status = document.getElementById("selectStatusActive").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "selectUsername": { required: !0, minlength: 4 },
              "selectFullname": { required: !0 },
              "password": { required: !0 },
              "selectStatusActive": { required: !0 },
            },
            messages: {
              "selectUsername": {
                required: required,
                minlength: minlength,
              },
              "selectFullname": required,
              "password": required,
              "selectStatusActive": required,
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
  if (fullname == "" || username == "" || password == "" || password == "" || status == "") {
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/insert";
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

  var data = JSON.stringify({
    language_POST: language,
    username_POST: username,
    password_POST: password,
    employeeID_POST: fullname,
    status_POST: status
  });
  console.log(data)
  return false
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var responseLogin = JSON.parse(xhr.response);
      if (responseLogin["success"] == true) {
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "success",
          icon: "fa fa-check me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/users";
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
          window.location.href = "/users";
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
  xhr.send(data);
  return false;
}