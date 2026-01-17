async function updateCheckPurchaseRequest(id) {
   await showLayoutCreateData()
  // const dataLogin = await JSON.parse(getCookie("dataLogin"));
  // const employeeID = dataLogin["idEmployee"]
  document.getElementById("formatItemInputSearch").hidden = false
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/bycodepurchaserequest"
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
    code_purchase_request_POST: id,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='cancelTransaction()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updatePurchaseRequest()' class='btn  btn-primary'>" + kapital(done) + "</a>"
        document.getElementById("code").value = responseData[0]["code_purchase_request"]
        document.getElementById("date_request").value = ddmmyyyy(responseData[0]["date_request"])
        document.getElementById("noteHeader").value = responseData[0]["note"]
        document.getElementById("dataTableItemMasterOrderDetail").innerHTML = ""
        dataDetail = responseData[0]["log_purchase_request_details"]

        // Simulasi responseData

        dataDetail.forEach((data, index) => {
          addRow(
            data.id,
            data.code_item,
            data.log_item_master.name,
            data.qty_request,
            data.log_item_master.uom,
            data.note
          );
        });
        // const createTab = document.querySelector('a[data-bs-target="#purchase-request-form"]');

        // // Aktifkan tab menggunakan Bootstrap Tab API
        // if (createTab) {
        //   const tabInstance = new bootstrap.Tab(createTab);
        //   tabInstance.show();
        // }
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_opex";
        }, 3000);
      }
    } if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    } if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(async function () {
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
async function addRow(idRow, code, description, qty, uom, note) {
  const table = document.getElementById("dataTableItemMasterOrder").getElementsByTagName("tbody")[0];
  var rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.id = "row" + idRow;


  const cell1 = row.insertCell(0);
  cell1.innerHTML = code;
  cell1.className = "text-center fw-light";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = description;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = qty;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = uom;
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = note;
  cell5.className = "text-center fw-light text-uppercase";

  const cell6 = row.insertCell(5);
  cell6.innerHTML = `
      <button type="button" class="btn btn-danger" id="${idRow}" onclick="deleteRow('${row.id}')">
        <i class="fa-regular fa-trash-can"></i>
      </button>`;
  cell6.className = "text-center";
  document.getElementById("formadditemmaster").reset()
}
async function showModalupdatePostingPurchaseRequest(param) {
  var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
  myModal.toggle();
  document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updatePostingPurchaseRequest(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
  document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function updatePostingPurchaseRequest(id) {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/posting"
  xhr.onloadstart = function () {
    document.getElementById("loadNotice").innerHTML =
      "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
                "+ loading + "...\n\
              </button>";
  };
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
    language_POST: language,
    code_purchase_request_POST: id,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_opex";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_opex";
        }, 3000);
      }
    } if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    } if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(async function () {
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
async function updatePurchaseRequest() {
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
  const code = document.getElementById("code").value
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
      message: "tidak ada data item",
    });
    setTimeout(function () {
    }, 3000);
    return false
  }
  var dataPurchaseRequestFix = [];
  var detail = [];
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
  const codeHeaderMenu = JSON.parse('{"code_header_POST":"' + code + '"}')
  const notedHeaderMenu = JSON.parse('{"node_header_POST":"' + kapital(notedHeader) + '"}')
  const dateRequestMenu = JSON.parse('{"date_request_POST":"' + yyyymmdd(dateRequest) + '"}')
  const employeeMenu = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const companyCodeMenu = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
  const dateCreateMenu = JSON.parse('{"date_create_POST":"' + formattedToday + '"}')
  const typeMenu = JSON.parse('{"type_POST":"OPEX"}')
  $.extend(languageMenu, usernameMenu, codeHeaderMenu, notedHeaderMenu, dateRequestMenu, employeeMenu, companyCodeMenu, dateCreateMenu, typeMenu, { detail });
  dataPurchaseRequestFix.push(languageMenu)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/update";
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