async function updateCheckGoodsIssue(id) {
  document.getElementById("dataTableItem").innerHTML = ""
  let language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsissue/bycode"
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
    code_goods_issue_POST: id,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
      
        dataDetail = responseData["dataGI"][0]["details"]
        for (i = 0; i < dataDetail.length; i++) {
          var newid = dataDetail[i]["code_goods_issue_detail"] * 111
          var qty = dataDetail[i]["qty"]
          $('#dataTableItem').append(`
                        <tr id="row${newid}">
                        <td class="text-center"><a type="button" class="btn btn-danger" id='${newid}' onclick="deleteRow(id)"> <i class="fa-regular fa-trash-can"></i></a></td>
                            <td><select class="js-select2 form-select fw-light text-uppercase" name="codeItemDetail[]" onchange="itemMaster(${newid})" id="codeItemDetail${newid}" style="width: 100%"></select></td>
                            <td><input type="text" class="form-control text-end text-uppercase" value="0" id="qtyStockDetail${newid}" name="qtyStockDetail[]" disabled/></td>
                            <td><input type="text" class="form-control text-center text-uppercase" id="uomDetail${newid}" name="uomDetail[]" style="width: 150px" disabled/></td>
                            <td><input type="text" class="form-control text-end text-uppercase" value="${qty}" onkeyup="compareQty()"  onfocus="removeZero(this)" id="qtyDetail${newid}" name="qtyDetail[]" /></td>
                            <td><select class="js-select2 form-select fw-light text-uppercase" name="blokDetail[]" id="blokDetail${newid}" style="width: 100%"></select></td>
                            <td><select class="js-select2 form-select fw-light text-uppercase" name="assetDetail[]" id="assetDetail${newid}" style="width: 100%"></select></td>
                            <td><select class="js-select2 form-select fw-light text-uppercase"  onchange="activity(${newid})" name="activityTypeDetail[]" id="activityTypeDetail${newid}" style="width: 100%"></select></td>
                            <td><select class="js-select2 form-select fw-light text-uppercase" name="ActivityDetail[]" id="ActivityDetail${newid}" style="width: 100%"></select></td>
                        </tr>
                    `);
          $(`#codeItemDetail${newid}, #activityTypeDetail${newid}, #blokDetail${newid}, #assetDetail${newid}, #ActivityDetail${newid}`).select2();

          var itemCode = dataDetail[i]["code_item"];
          var activityCode = dataDetail[i]["code_activity"];
          var activityTypeCode = dataDetail[i]["adm_activity"]["code_activity_type"];
          var worksiteCode = dataDetail[i]["worksite"];
          var assetCode = dataDetail[i]["asset_code"];
          // var warehouseCode = responseData["dataGI"][0]["warehouse"];
          var itemCode = dataDetail[i]["code_item"];
          await selectItemWarehouse(newid, itemCode)
          await selectActivityType(newid, activityTypeCode)
          await activity(newid, activityTypeCode, activityCode)
          await selectDivision(newid, worksiteCode)
          await selectAsset(newid, assetCode);
          await itemMaster(newid, itemCode)
        }
        document.getElementById("dateOrder").value = ddmmyyyy(responseData["dataGI"][0]["date"]);
        document.getElementById("note").value = responseData["dataGI"][0]["note"];
        codeEmployee = responseData["dataGI"][0]["request_by"];
        await selectEmployee(codeEmployee)
          document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + id + "' onclick='updateGoodsIssue(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_capex";
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
async function updateGoodsIssue(id) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const companyCode = dataLogin["codeCompany"]
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
  const code = id.getAttribute('code');
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
  const codeGIHeader = JSON.parse('{"goods_issue_POST":"' + code + '"}')
  const languageHeader = JSON.parse('{"language_POST":"' + language + '"}')
  const usernameHeader = JSON.parse('{"username_POST":"' + username + '"}')
  const requestHeader = JSON.parse('{"request_POST":"' + employee + '"}')
  const dateHeader = JSON.parse('{"date_POST":"' + yyyymmdd(date) + '"}')
  const employeeWarehouseHeader = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const codeWHHeader = JSON.parse('{"code_warehouse_POST":"' + codeWH + '"}')
  const codeCompanyHeader = JSON.parse('{"code_company_POST":"' + companyCode + '"}')
  const noteHeader = JSON.parse('{"note_POST":"' + note + '"}')
  $.extend(languageHeader, usernameHeader, codeGIHeader, requestHeader, dateHeader, employeeWarehouseHeader, codeWHHeader, codeCompanyHeader, noteHeader, { detail });
  dataGoodsIssueFix.push(languageHeader)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsissue/update";
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
async function showModalupdatePostingGoodsIssue(param) {
  var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
  myModal.toggle();
  document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updatePostingGoodsIssue(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
  document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function updatePostingGoodsIssue(id) {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsissue/posting"
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
    goods_issue_POST: id,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/goods_issue";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/goods_issue";
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