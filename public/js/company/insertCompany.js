async function showModalInsertCompany(el) {
  const id = el.id;
  const level = el.getAttribute('leveladd');
  const length = el.getAttribute('length');
  document.getElementById("code").setAttribute("maxlength", length);
  // const endDate = el.getAttribute('endDate');
  // const worksite = el.getAttribute('worksite');
  // const company = el.getAttribute('company');
  // const element = document.getElementById(id);
  // const level = element.getAttribute("leveladd");
  await selectCompanyType()
  await selectProvince()
  await selectCity()
  var myModal = new bootstrap.Modal(document.getElementById("modalCompany"), { keyboard: false });
  myModal.toggle();
  document.getElementById("code").disabled = false
  document.getElementById("level").value = level
  document.getElementById("parent").value = id
  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='insertCompany()' class='btn  btn-primary'>" + kapital(done) + "</button>"
}
async function insertCompany() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "code": { required: !0 },
              "name": { required: !0 },
              "type": { required: !0 },
            },
            messages: {
              "code": required,
              "name": required,
              "type": required,
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
  const code = document.getElementById("code").value
  const level = document.getElementById("level").value
  const type = document.getElementById("type").value
  const parent = document.getElementById("parent").value
  const name = document.getElementById("name").value
  const city = document.getElementById("city").value
  const province = document.getElementById("province").value
  const address = document.getElementById("address").value
  const phone_number = document.getElementById("phone_number").value
  const email = document.getElementById("email").value
  const zip_code = document.getElementById("zip_code").value
  const tax = document.getElementById("tax").value
  const capacity = document.getElementById("capacity").value
  if (code == "" && name == "" && type == "") {
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "company/insert";
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
      await keluar();
    }, 3000);
  };

  var data = JSON.stringify(
    {
      language_POST: language,
      code_POST: code,
      level_POST: level,
      type_POST: type,
      parent_POST: parent,
      name_POST: name,
      city_POST: city,
      province_POST: province,
      address_POST: address,
      phone_number_POST: phone_number,
      email_POST: email,
      zip_code_POST: zip_code,
      tax_POST: tax,
      capacity_POST: capacity,
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
          window.location.href = "/company";
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
          window.location.href = "/company";
        }, 3000);
      }
    } if (this.status == 404) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    } if (this.status == 401) {
      message = "data failed to load";
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