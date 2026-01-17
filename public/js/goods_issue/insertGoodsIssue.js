async function insertGoodsIssue() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const dataEmployee = await JSON.parse(getCookie("dataEmployee"));
  const companyCode = dataEmployee["code_company"]
  const employeeID = dataLogin["idEmployee"]
  const username = dataLogin["username"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formHeaderGI").validate({
            ignore: [],
            rules: {
              "dateOrder": { required: !0 },
              "employee": { required: !0 },
            },
            messages: {
              "dateOrder": required,
              "employee": required,
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
  const form = jQuery("#formHeaderGI");
  const isValid = form.valid();
  if (!isValid) {
    return false;
  }
  const date = document.getElementById("dateOrder").value
  const employee = document.getElementById("employee").value
  const note = document.getElementById("note").value
  const codeWH = document.getElementById("codeWHform").value

  var dataGoodsIssueFix = [];
  var detail = [];
  var isValidTable = true;
  var rows = document.querySelectorAll('tr[id^="row"]');
  const jmlDetail = rows.length
  if (jmlDetail == 0) {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: no_item,
    });
    setTimeout(function () {
    }, 3000);
    return false
  }
  rows.forEach(row => {
    var rowId = row.id.replace('row', '');

    var codeItem = document.getElementById(`codeItemDetail${rowId}`).value.trim();
    var qty = document.getElementById(`qtyDetail${rowId}`).value.trim();
    var activityType = document.getElementById(`activityTypeDetail${rowId}`).value.trim();
    var activity = document.getElementById(`ActivityDetail${rowId}`).value.trim();
    var block = document.getElementById(`blokDetail${rowId}`).value.trim();
    var asset = document.getElementById(`assetDetail${rowId}`).value.trim();

    // Validasi
    if (codeItem === "" || activityType === "" || activity === "" || qty === "" || parseFloat(qty) === 0) {
      isValidTable = false;
      row.style.backgroundColor = "#ffe6e6"; // highlight error
    } else {
      row.style.backgroundColor = ""; // clear highlight
      detail.push({
        code_POST: codeItem,
        qty_POST: qty,
        activity_POST: activity,
        block_POST: block, 
        asset_POST: asset, 
      });
    }
  });

  if (!isValidTable) {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: no_fields,
    });
    setTimeout(function () {
    }, 3000);
    return false
  }
  const languageHeader = JSON.parse('{"language_POST":"' + language + '"}')
  const usernameHeader = JSON.parse('{"username_POST":"' + username + '"}')
  const requestHeader = JSON.parse('{"request_POST":"' + employee + '"}')
  const dateHeader = JSON.parse('{"date_POST":"' + yyyymmdd(date) + '"}')
  const employeeWarehouseHeader = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const codeWHHeader = JSON.parse('{"code_warehouse_POST":"' + codeWH + '"}')
  const codeCompanyHeader = JSON.parse('{"code_company_POST":"' + companyCode + '"}')
  const noteHeader = JSON.parse('{"note_POST":"' + note + '"}')
  $.extend(languageHeader, usernameHeader, requestHeader, dateHeader, employeeWarehouseHeader, codeWHHeader, codeCompanyHeader, noteHeader, { detail });
  dataGoodsIssueFix.push(languageHeader)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsissue/insert";
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
  var data = JSON.stringify(dataGoodsIssueFix);
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
          window.location.href = "/goods_issue";
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
          window.location.href = "/goods_issue";
        }, 3000);
      }
    } 
    // if (this.status == 404) {
    //   message = "data failed to load";
    //   Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
    //   setTimeout(function () {
    //     window.location.href = "/";
    //   }, 3000);
    // } if (this.status == 401) {
    //   Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
    //   setTimeout(function () {
    //     window.location.href = "/";
    //   }, 3000);
    // } if (this.status == 500) {
    //   Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
    //   setTimeout(function () {
    //     window.location.href = "/";
    //   }, 3000);
    // }
  };
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}