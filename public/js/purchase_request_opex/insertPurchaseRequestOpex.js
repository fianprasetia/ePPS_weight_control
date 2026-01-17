async function InsertPurchaseRequest() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const companyCode = dataLogin["codeCompany"]
  const employeeID = dataLogin["idEmployee"]
  const username = dataLogin["username"];
  const today = new Date();
  const year = today.getFullYear(); // Mendapatkan tahun
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan (0-11) + 1, tambahkan leading zero
  const day = String(today.getDate()).padStart(2, '0'); // Tanggal, tambahkan leading zero

  const formattedToday = `${year}-${month}-${day}`;
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formHeaderPR").validate({
            ignore: [],
            rules: {
              "date_request": { required: !0 },
            },
            messages: {
              "date_request": required,
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
  const form = jQuery("#formHeaderPR");
  const isValid = form.valid();
  if (!isValid) {
    return false;
  }
  const notedHeader = document.getElementById("noteHeader").value
  const dateRequest = document.getElementById("date_request").value
  var table = document.getElementById("dataTableItemMasterOrder").getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
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
  var detail = [];
  var dataPurchaseRequestFix = [];
  for (var i = 0; i < rows.length; i++) {
    var codeItem = rows[i].cells[0].innerText;
    var qty = rows[i].cells[2].innerText;
    var noted = rows[i].cells[4].innerText;
    detail.push({
      code_POST: codeItem,
      qty_POST: qty,
      noted_POST: noted,
    });
  }
  const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
  const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}')
  const notedHeaderMenu = JSON.parse('{"node_header_POST":"' + notedHeader + '"}')
  const dateRequestMenu = JSON.parse('{"date_request_POST":"' + yyyymmdd(dateRequest) + '"}')
  const employeeMenu = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const companyCodeMenu = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
  const dateCreateMenu = JSON.parse('{"date_create_POST":"' + formattedToday + '"}')
  const typeMenu = JSON.parse('{"type_POST":"OPEX"}')
  $.extend(languageMenu, usernameMenu, notedHeaderMenu, dateRequestMenu, employeeMenu, companyCodeMenu, dateCreateMenu, typeMenu, { detail });
  dataPurchaseRequestFix.push(languageMenu)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/insert";
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

  var data = JSON.stringify(dataPurchaseRequestFix);
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
          window.location.href = "/purchase_request_opex";
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
          window.location.href = "/purchase_request_opex";
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