async function showModalUpdateReceivingLocations(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken();
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(
      document.getElementById("modalReceivingLocations")
    );
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(
      document.getElementById("modalReceivingLocations")
    );
    myModal.toggle();
  }
  let language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  const element = document.getElementById(id);
  const level = element.getAttribute("levelUpdate");
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "receivinglocations/code";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };
  var data = JSON.stringify({
    code_POST: id,
    language_POST: language,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        status = responseData[0]["status"];
        document.getElementById("code").value =
          responseData[0]["id_receiving_locations"];
        document.getElementById("name_locations").value =
          responseData[0]["name"];
        document.getElementById("address").value = responseData[0]["address"];
        document.getElementById("contact_person").value =
          responseData[0]["contact_person"];
        document.getElementById("phone").value =
          responseData[0]["contact_phone"];
        mainOptionStatus =
          "<option  class='fw-light text-uppercase' value=" +
          status +
          ">" +
          (status == 0 ? kapital(active) : kapital(nonactive)) +
          "</option>";
        optionStatus =
          "<option  class='fw-light text-uppercase' value=" +
          (status != 0 ? 0 : 1) +
          ">" +
          (status != 0 ? kapital(active) : kapital(nonactive)) +
          "</option>";
        document.getElementById("status").innerHTML =
          "" + mainOptionStatus + "" + optionStatus + "";
        document.getElementById("load").innerHTML =
          "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
          cancel +
          "</a> <a id='doneBtn' type='submit' onclick='updateReceivingLocations()' class='btn  btn-primary'>" +
          done +
          "</a>";
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/receiving_locations";
        }, 3000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_404
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_500
      });
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
async function updateReceivingLocations() {
  const language = await JSON.parse(getCookie("language"));
  const code = document.getElementById("code").value;
  const nameLocations = document.getElementById("name_locations").value;
  const Address = document.getElementById("address").value;
  const contactPerson = document.getElementById("contact_person").value;
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status").value;
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"), jQuery(".js-validation").validate({
          ignore: [],
          rules: {
            name_locations: { required: !0 },
            address: { required: !0 },
            contact_person: { required: !0 },
            phone: { required: !0, number: !0 },
            status: { required: !0 }
          },
          messages: {
            name_locations: required,
            address: required,
            contact_person: required,
            phone: { required, number },
            status: required
          }
        }), jQuery(".js-select2").on("change", e => {
          jQuery(e.currentTarget).valid();
        });
        jQuery(".js-flatpickr").on("change", e => {
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
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "receivinglocations/update";
  xhr.onloadstart = function () {
    document.getElementById("load").innerHTML =
      "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
              " +
      loading +
      "...\n\
            </button>";
  };
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: overload
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };

  var data = JSON.stringify({
    language_POST: language,
    code_POST: code,
    name_locations_POST: nameLocations,
    address_POST: Address,
    contact_person_POST: contactPerson,
    contact_phone_POST: phone,
    status_POST: status
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
          message: message
        });
        setTimeout(function () {
          window.location.href = "/receiving_locations";
        }, 3000);
      } else if (responseLogin["access"] == "failed") {
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/receiving_locations";
        }, 3000);
      }
    }
    if (this.status == 404) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_404
      });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_500
      });
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
