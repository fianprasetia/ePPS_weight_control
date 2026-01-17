async function showModalUpdateItemMaster(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalItemMaster"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalItemMaster"), { keyboard: false });
    myModal.toggle();
  }

  let language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "itemmaster/id"
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(async function () {
      await keluar()
    }, 3000);
  };
  var data = JSON.stringify({
    code_POST: id,
    language_POST: language,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        document.getElementById("selectCode").value = id
        document.getElementById("selectDescription").value = responseData[0]["name"]
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateItemMaster()' class='btn  btn-primary'>" + kapital(done) + "</a>"
        const codeCategory = responseData[0]["code_category"]
        const codeUOM = responseData[0]["uom"]
        const status = responseData[0]["status"]
        mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? active : nonactive) + "</option>";
        optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? active : nonactive) + "</option>";
        document.getElementById("selectStatus").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";

        await selectUOM(codeUOM)
        await selectItemCategory(codeCategory)
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/company";
        }, 3000);
      }
    } if (this.status == 404) {
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
async function updateItemMaster() {
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
              "selectCategory": { required: !0 },
              "selectDescription": { required: !0 },
              "selectUOM": { required: !0 },
              "selectStatus": { required: !0 },
            },
            messages: {
              "selectCategory": required,
              "selectDescription": required,
              "selectUOM": required,
              "selectStatus": required,
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
    return false
  }
  const id = document.getElementById("selectCode").value
  const selectCategory = document.getElementById("selectCategory").value
  const selectDescription = document.getElementById("selectDescription").value
  const selectUOM = document.getElementById("selectUOM").value
  const selectStatus = document.getElementById("selectStatus").value
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "itemmaster/update/" + id;
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
      category_POST: selectCategory,
      description_POST: kapital(selectDescription),
      uom_POST: selectUOM,
      status_POST: selectStatus,
      username_POST: username
    }
  );
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var responseLogin = JSON.parse(xhr.response);
      if (responseLogin["access"] == "success") {
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", { z_index: 2000, type: "success", message: message, });
        setTimeout(function () {
          window.location.href = "/item_master";
        }, 3000);
      } else if (responseLogin["access"] == "failed") {
        message = responseLogin["message"];
        Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", message: message, });
        setTimeout(function () {
          window.location.href = "/item_master";
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
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}