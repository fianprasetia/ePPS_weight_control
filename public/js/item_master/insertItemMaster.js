async function showModalItemMaster() {
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
  // document.getElementById("selectFullname").disabled = false
  // document.getElementById("passwordhide").hidden = false
  // await selectEmployee()
  // await selectCompany()
  await selectUOM()
  await selectItemCategory()
  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>  <a id='doneBtn' type='submit' onclick='insertItemMaster()' class='btn  btn-primary'>" + kapital(done) + "</a>"
  document.getElementById("selectStatus").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='0'>" + kapital(active) + "</option><option value='1'>" + kapital(nonactive) + "</option>"
}
async function insertItemMaster() {
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
  const selectCategory = document.getElementById("selectCategory").value
  const selectDescription = document.getElementById("selectDescription").value
  const selectUOM = document.getElementById("selectUOM").value
  const selectStatus = document.getElementById("selectStatus").value
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "itemmaster/insert";
  xhr.onloadstart = function () {
    document.getElementById("load").innerHTML =
      "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
          <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
          "+ loading + "...\n\
        </button>";
  };
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000, type: "danger", message: overload,
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
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "success",
          icon: "fa fa-check me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/item_master";
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
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}