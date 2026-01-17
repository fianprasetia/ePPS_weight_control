function login() {
  (function () {
    "use strict";
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "click",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
          return false;
        },
        false
      );
    });
  })();
  var language = document.getElementById("selectLanguage").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username == "" || password == "") {
    return false;
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "login";
  xhr.onloadstart = function () {
    document.getElementById("loadlogin").innerHTML =
      "<button class='btn w-100 btn-hero btn-primary shadow' type='button' disabled>\n\
        <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
        Loading...\n\
      </button>";
  };
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: "overload",
    });
    setTimeout(function () {
      window.location.href = "/login";
    }, 3000);
  };

  var data = JSON.stringify({
    username_POST: username,
    password_POST: password,
    language_POST: language,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var responseLogin = await JSON.parse(xhr.response);
      if (responseLogin["access"] == "success") {
        responseLogin = JSON.parse(xhr.response);
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", {
          type: "success",
          icon: "fa fa-check me-1",
          message: message,
        });
        session(responseLogin, language);
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      } else if (responseLogin["access"] == "failed") {
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/login";
        }, 3000);
      } else if (responseLogin["access"] == "change") {
        username = responseLogin["data"];
        modalResetPassword(username);
      }
    } if (this.status == 404) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
      setTimeout(function () {
        window.location.href = "/login";
      }, 3000);
    }
  };
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(data);
  return false;
}

async function validatePassword() {
  var language = document.getElementById("selectLanguage").value;
  const data = await fetch("file/language.json"); // fetch data secara langsung
  const jsonData = await data.json(); // parsing JSON

  var filterLanguage = jsonData.filter((filtercontent) => filtercontent.language == language);
  let password_not_match = filterLanguage[0]["content"]["password_not_match"];

  // Ambil nilai password
  let pass1 = document.getElementById("password1").value;
  let pass2 = document.getElementById("password2").value;

  // Validasi password
  if (pass1 != pass2) {
    document.getElementById("salah").innerHTML = password_not_match;
  } else {
    document.getElementById("salah").innerHTML = "";
  }
}
function viewPassword(passwordId, eyeIconId) {
  var passwordInput = document.getElementById(passwordId);
  var eyeIcon = document.getElementById(eyeIconId);

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  }
}
function modalResetPassword(usernamereset) {
  var myModal = new bootstrap.Modal(
    document.getElementById("modal-block-vcenter"), { keyboard: false }
  );
  myModal.toggle();
  document.getElementById("usernamereset").value = usernamereset;
}
async function resetPassword() {
  var language = document.getElementById("selectLanguage").value;
  const datalang = await fetch("file/language.json"); // fetch data secara langsung
  const jsonData = await datalang.json(); // parsing JSON

  var filterLanguage = jsonData.filter((filtercontent) => filtercontent.language == language);
      required = filterLanguage[0]["content"]["required"]
      overload = filterLanguage[0]["content"]["overload"]
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "password1": { required: !0 },
              "password2": { required: !0 },
           
            },
            messages: {
              "password1": required,
              "password2": required,
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
  var username = document.getElementById("usernamereset").value;
  var newpassword = document.getElementById("password1").value;
  var repassword = document.getElementById("password2").value;
  if (username == "" || newpassword == "" || repassword == "") {
    return false;
  }
  if (repassword != newpassword) {
    return true;
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "login/update/password";
  xhr.onloadstart = function () {
    document.getElementById("loadResetLogin").innerHTML =
      "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
        <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
        Loading...\n\
      </button>";
  };
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(function () {
      window.location.href = "/login";
    }, 3000);
  };

  var data = JSON.stringify({
    language_POST: language,
    username_POST: username,
    password_POST: newpassword,
  });
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
          window.location.href = "/login";
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
          window.location.href = "/login";
        }, 3000);
      }
    } if (this.status == 404) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
      setTimeout(function () {
        window.location.href = "/login";
      }, 3000);
    }
  };
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(data);
  return false;
}
function language(id) {
  languageSelect = document.getElementById(id).innerHTML;
  document.getElementById("selectLanguage").innerHTML = languageSelect;
  document.getElementById("selectLanguage").value = id;
  if (id == "id") {
    document.getElementById("password").placeholder = "Kata Sandi";
    document.getElementById("username").placeholder = "Nama Pengguna";
    document.getElementById("tagLine").innerHTML = "Solusi Strategis untuk Transformasi Digital Perkebunan...!!!";
    // document.getElementById("loginHeader").innerHTML = "Log In";
    document.getElementById("loginButton").innerHTML = "Log In";
    document.getElementById("titleCreatePassword").innerHTML = "Buat Kata Sandi";
    document.getElementById("passwordLabel1").innerHTML = "Kata Sandi";
    document.getElementById("repasswordLabel2").innerHTML = "Ketik Ulang Kata Sandi";
    document.getElementById("doneBtn").innerHTML = "Selesai";
    document.getElementById("cancelBtn").innerHTML = "Batal";
  } else if (id == "en") {
    document.getElementById("password").placeholder = "Password";
    document.getElementById("password").placeholder = "Password";
    document.getElementById("username").placeholder = "Username";
    document.getElementById("tagLine").innerHTML = "Strategic Solutions for Plantation Digital Transformation...!!!";
    // document.getElementById("loginHeader").innerHTML = "Log In";
    document.getElementById("loginButton").innerHTML = "Log In";
    document.getElementById("titleCreatePassword").innerHTML = "Create Password";
    document.getElementById("passwordLabel1").innerHTML = "Password";
    document.getElementById("repasswordLabel2").innerHTML = "Retype Password";
    document.getElementById("doneBtn").innerHTML = "Done";
    document.getElementById("cancelBtn").innerHTML = "Cancel";
  } else if (id == "zh") {
    document.getElementById("password").placeholder = "密码";
    document.getElementById("username").placeholder = "用户名";
    document.getElementById("tagLine").innerHTML = "种植园数字化转型的战略解决方案...!!!";
    // document.getElementById("loginHeader").innerHTML = "登录";
    document.getElementById("loginButton").innerHTML = "登录";
    document.getElementById("titleCreatePassword").innerHTML = "创建密码";
    document.getElementById("passwordLabel1").innerHTML = "密码";
    document.getElementById("repasswordLabel2").innerHTML = "重新输入密码";
    document.getElementById("doneBtn").innerHTML = "完成";
    document.getElementById("cancelBtn").innerHTML = "取消";

  }
}
function closeModal() {
  $('.modal').modal('hide');
  // document.getElementById("form2").reset()
}
