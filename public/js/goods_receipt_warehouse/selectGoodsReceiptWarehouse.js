selectContent();
async function selectContent() {
 var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  let language = await JSON.parse(getCookie("language"));
  const data = "file/language.json";
  const response = await fetch(data);
  const jsonData = await response.json();
  await dataContent(jsonData);

  await new Promise(resolve => setTimeout(resolve, 0));
  await showLayoutListData()
  // await selectPurchaseOrder();
  async function dataContent(data) {
    var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
    const content = filterLanguage[0]["content"];
    document.getElementById("titleContent").innerHTML = content["goods_receipt_warehouse"];
    document.getElementById("titlePage").innerHTML = content["goods_receipt_warehouse"];
    document.getElementById("titleContent").innerHTML = content["goods_receipt_warehouse"];
    // document.getElementById("GRform").innerHTML = content["goods_receipt_warehouse"];
    // document.getElementById("listdata").innerHTML = content["list_data"];
    document.getElementById("purchaseOrderLabel").innerHTML = content["purchase_order"] + "<span class='text-danger'>*</span>"
    document.getElementById("dateLabel").innerHTML = content["date"] + "<span class='text-danger'>*</span>"
    document.getElementById("partnersLabel").innerHTML = content["partners"];
    document.getElementById("invoiceLabel").innerHTML = content["no_invoice"];
    document.getElementById("shippingDocLabel").innerHTML = content["no_shipping_document"];
    document.getElementById("codeItemOrder").innerHTML = content["code_item"];
    document.getElementById("descriptionOrder").innerHTML = content["description"];
    document.getElementById("uomOrder").innerHTML = content["uom"];
    document.getElementById("qtyOrder").innerHTML = content["qty"];
    document.getElementById("qtyReceivedOrder").innerHTML = content["qty_received"];
    document.getElementById("actionsOrder").innerHTML = content["actions"];
    document.getElementById("titlePeriod").innerHTML = content["period"];
    // document.getElementById("dateSearchLabel").innerHTML = content["date"];
    document.getElementById("noGRListData").innerHTML = content["goods_receipt"];
    document.getElementById("noPOListData").innerHTML = content["purchase_order"];
    document.getElementById("dateListData").innerHTML = content["date"];
    document.getElementById("partnersListData").innerHTML = content["partners"];
    document.getElementById("noInvoiceListData").innerHTML = content["no_invoice"];
    document.getElementById("noShippingListData").innerHTML = content["no_shipping_document"];
    document.getElementById("employeeData").innerHTML = content["wh_staff"];
    document.getElementById("statusListData").innerHTML = content["status"];
    document.getElementById("actionsListData").innerHTML = content["actions"];
    document.getElementById("nameApproval").innerHTML = content["name"];
    document.getElementById("levelApproval").innerHTML = content["level_approval"];
    document.getElementById("statusApproval").innerHTML = content["status"];
    document.getElementById("noteApproval").innerHTML = content["note"];
    document.getElementById("dateApproval").innerHTML = content["date_approval"];
  }
  document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='InsertGoodsreceipt()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutUpdateData(id) {
  document.getElementById('createData').hidden = false;
  document.getElementById('listData').hidden = true;
  document.getElementById('purchaseOrderData').hidden = true;
  // document.getElementById("formHeaderGR").reset()
  // document.getElementById("formadditemmaster").reset()
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById('purchaseOrder').value = id;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
  // document.getElementById("typeHeader").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='in'>" + kapital(inn) + "</option><option value='out'>" + kapital(out) + "</option>"

}
async function showLayoutCreateData(id) {
  document.getElementById('createData').hidden = false;
  document.getElementById('listData').hidden = true;
  document.getElementById('purchaseOrderData').hidden = true;
  document.getElementById("formHeaderGR").reset()
  document.getElementById("formadditemmaster").reset()
  await selectPurchaseOrderDetail(id);
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById('purchaseOrder').value = id;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutPurchaseOrderData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;

}
async function showLayoutListData() {
  await selectCompanyWarehouse();
  document.getElementById("formGoogReceipt").reset()
  document.getElementById("listData").hidden = false;
  document.getElementById('createData').hidden = true;
  document.getElementById('purchaseOrderData').hidden = true;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutPurchaseOrderData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function showLayoutPurchaseOrderData() {
  await selectPurchaseOrder();
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById("listData").hidden = true;
  document.getElementById('createData').hidden = true;
  document.getElementById('purchaseOrderData').hidden = false;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`
}
async function selectPurchaseOrder(code) {
  const language = await JSON.parse(getCookie("language"));
  var dataLogin = await JSON.parse(getCookie("dataLogin"));
  const worksite = dataLogin["codeCompany"];
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaseorder/goodreceipt";
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
    language_POST: language,
    worksite_POST: worksite,
    type_POST: "WH"
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      await resetDataTables()
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData.length; i++) {
          noPO = responseData[i]["code_purchase_order"];
          createData = "<button title='process' type='button' id='" + noPO + "' onclick='showLayoutCreateData(id)' class='btn btn-primary'><i class='fa-solid fa-user-check'></i>";
          tableItem +=
            "<tr>\
                <td class='fw-light text-center'>" + no + "</td>\
                <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["date_create"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["code_purchase_order"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["worksiteCompany"]["name"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["employeePurchasing"]["fullname"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + createData + "</td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTablePurchaseOrder").innerHTML = tableItem;
        await table();
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        // setTimeout(function () {
        //   window.location.href = "/goods_receipt_warehouse";
        // }, 3000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
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
async function selectPurchaseOrderDetail(id) {
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaseorder/codegoodreceipt";
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
    code_purchase_order_POST: id,
    type_POST: "WH"
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        document.getElementById("partners").value = responseData[0]["log_partner"]["name"];
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData[0]["details"].length; i++) {
          let qtyTotal = responseData[0]["details"][i]["qty"] - responseData[0]["details"][i]["qty_received"];
          tableItem +=
            "<tr>\
                <td class='fw-light text-center'>" + no + "</td>\
                <td class='fw-light text-center'>" + responseData[0]["details"][i]["code_item"] + "</td>\
                <td class='fw-light text-center'>" + responseData[0]["details"][i]["log_item_master"]["name"] + "</td>\
                <td class='fw-light text-center text-uppercase'>" + responseData[0]["details"][i]["log_item_master"]["uom"] + "</td>\
                <td class='fw-light text-center'><input type='text' value='" + qtyTotal + "' class='form-control text-end' id='qtyDataBody' name='qtyDataBody[]' style='width: 150px;' disabled></td>\
                <td class='fw-light text-center'><input type='number' onkeyup='compareQty()' class='form-control text-end' onfocus='removeZero(this)' id='qtyReceivedDataBody' value='0' name='qtyReceivedDataBody[]'  style='width: 150px;'></td>\
                <td class='fw-light text-center'><input type='checkbox' class='form-check-input' value='' id='actions' name='actions[]' style='width:30px; height: 30px;' disabled></td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTableItem").innerHTML = tableItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger", z_index: 2000, message: message
        });
        // setTimeout(function () {
        //   window.location.href = "/goods_receipt_warehouse";
        // }, 3000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_404
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_401
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_500
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
}
async function selectCompanyWarehouse() {
  const id = document.getElementById("purchaseOrder").value;
  const language = await JSON.parse(getCookie("language"));
  var dataLogin = await JSON.parse(getCookie("dataLogin"));
  const worksite = dataLogin["codeCompany"];
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "company/warehouse";
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
    worksite_POST: worksite,
    language_POST: language
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        const dataPeriod = responseData.dataPeriod[0];
        const dataWarehouse = responseData.dataWarehouse[0];
        codeWareHouse = dataWarehouse["code_company"];
        document.getElementById("startDateList").innerHTML = ddmmyyyy(dataPeriod.start_date);
        document.getElementById("endDateList").innerHTML = ddmmyyyy(dataPeriod.finish_date);
        document.getElementById("warehouseName").innerHTML = dataWarehouse.name;
        document.getElementById("codeWHform").value = codeWareHouse;
        startDateSearch = ddmmyyyy(dataPeriod.start_date);
        endDateSeacrh = ddmmyyyy(dataPeriod.finish_date);
        await SelectGoodsReceipt(startDateSearch, endDateSeacrh, codeWareHouse)

      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger", z_index: 2000, message: message
        });
        setTimeout(() => {
          hideSpinner();
        }, 1000);
        // setTimeout(function () {
        //   window.location.href = "/goods_receipt_warehouse";
        // }, 3000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_404
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_401
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger", z_index: 2000, message: status_500
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
}
async function SelectGoodsReceipt(startDateSearch, endDateSeacrh, codeWareHouse) {
  const codeWH = codeWareHouse
  const startDate = yyyymmdd(startDateSearch)
  const endDate = yyyymmdd(endDateSeacrh)
  document.getElementById("startDate").value = ddmmyyyy(startDate);
  document.getElementById("endDate").value = ddmmyyyy(endDate)
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const language = await JSON.parse(getCookie("language"));
  const employeeID = dataLogin["idEmployee"];
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsreceiptwarehouse";
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
    language_POST: language,
    code_warehouse_POST: codeWH,
    start_date_POST: startDate,
    end_date_POST: endDate,
    type_POST: "WH"
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      await resetDataTables()
      if (response["access"] == "success") {
        var responseData = response["data"];
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData.length; i++) {
          statusTemp = responseData[i]["status"];
          noGR = responseData[i]["code_goods_receipt"];
          let status;
          if (statusTemp == 0) {
            editData = "<button title='" + edit + "' type='button' id='" + noGR + "' onclick='updateCheckGoodsReceipt(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
            postingData = "<button title='posting' type='button' id='" + noGR + "' onclick='showModalupdatePostingGoodsReceipt(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
            deleteData = "<button title='delete' type='button' id='" + noGR + "' onclick='showModalDeleteGoodsReceipt(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
            approvalData = "";
            viewData = "";
            pdfGR = "";
            status = request;
          } else if (statusTemp == 1) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noGR + "'' onclick='showModalSelectApproval(id)' class='btn btn-primary'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noGR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            pdfGR = "";
            status = waiting_approval;
          } else if (statusTemp == 2) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "";
            viewData = "<button title='view' type='button' id='" + noGR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            pdfGR = "<button title='pdf' type='button' code ='" + noGR + "' id='btn-" + no + "' onclick='selectGoodsReceiptByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
            status = approve;
          } else if (statusTemp == 3) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "";
            viewData = "<button title='view' type='button' id='" + noGR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            pdfGR = "<button title='pdf' type='button' code ='" + noGR + "' id='btn-" + no + "' onclick='selectGoodsReceiptByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
            status = reject;
          } else if (statusTemp == 4) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "";
            viewData = "<button title='view' type='button' id='" + noGR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            pdfGR = "<button title='pdf' type='button' code ='" + noGR + "' id='btn-" + no + "' onclick='selectGoodsReceiptByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
            status = reject;
          }
          tableItem +=
            "<tr>\
                <td class='fw-light text-center'>" + no + "</td>\
                <td class='fw-light text-center'>" + kapital(responseData[i]["code_goods_receipt"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["code_purchase_order"]) + "</td>\
                <td class='fw-light text-center'>" + ddmmyyyy(responseData[i]["date"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["log_purchase_order"]["log_partner"]["name"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["invoice"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["shipping"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["employeeWarehouse"]["fullname"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + kapital(status) + "</td>\
                <td class='fw-light text-center'><div class='btn-group'>" + editData + pdfGR + approvalData + postingData + deleteData + "</div></td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTable").innerHTML = tableItem;
        await table();
        document.getElementById("loadsearch").innerHTML = "  \
          <span onclick='SelectGoodsReceiptByDate()' class='input-group-text fw-semibold btn btn-primary'>\
          <i class='fa-solid fa-magnifying-glass'></i>\
          </span>"
        setTimeout(() => {
          hideSpinner();
        }, 1000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        document.getElementById("dataTable").innerHTML = "";
        document.getElementById("loadsearch").innerHTML = "  \
          <span onclick='SelectGoodsReceiptByDate()' class='input-group-text fw-semibold btn btn-primary'>\
          <i class='fa-solid fa-magnifying-glass'></i>\
          </span>"
        await table();
        setTimeout(() => {
          hideSpinner();
        }, 1000);
        // setTimeout(function () {
        //   window.location.href = "/goods_receipt_warehouse";
        // }, 3000);
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
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(async function () {
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
function compareQty() {
  const rows = document.querySelectorAll("tr");
  rows.forEach(row => {
    const qtyInput = row.querySelector("input[name='qtyDataBody[]']");
    const qtyReceivedInput = row.querySelector("input[name='qtyReceivedDataBody[]']");
    const checkbox = row.querySelector("input[name='actions[]']");

    if (!qtyInput || !qtyReceivedInput) return;

    const qtyTotal = parseFloat(qtyInput.value) || 0;
    const qtyReceived = parseFloat(qtyReceivedInput.value) || 0;
    if (qtyReceived > qtyTotal) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: notif_qty_received
      });
      checkbox.disabled = true; // Menonaktifkan checkbox
      checkbox.checked = false;
    } else {
      checkbox.disabled = false; // Mengaktifkan kembali checkbox jika jumlah valid
    }
    if (qtyReceived == 0) {
      checkbox.disabled = true; // Menonaktifkan checkbox
      checkbox.checked = false;
    }
  });
}
function checkDate() {
  let inputDatePeriod = yyyymmdd(document.getElementById("dateOrder").value)
  let startDatePeriod = yyyymmdd(document.getElementById("startDateList").innerHTML)
  let endDatePeriod = yyyymmdd(document.getElementById("endDateList").innerHTML)
  let startDate = new Date(startDatePeriod); // Format: YYYY-MM-DD
  let endDate = new Date(endDatePeriod);
  let userDate = new Date(inputDatePeriod);

  if (userDate < startDate) {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-times me-1",
      message: out_of_period
    });
    document.getElementById("dateOrder").value = ""
  } else if (userDate > endDate) {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-times me-1",
      message: out_of_period
    });
    document.getElementById("dateOrder").value = ""
  }
}
async function showModalSelectApproval(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken();
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(
      document.getElementById("modalApprovalGoodsReceipt")
    );
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(
      document.getElementById("modalApprovalGoodsReceipt")
    );
    myModal.toggle();
  }
  document.getElementById("loadApproval").innerHTML =
    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
    cancel +
    "</a>";
  document.getElementById("dataTableApprovalDetail").innerHTML = "";
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsreceiptwarehouse/bycode";
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
    code_goods_receipt_POST: id
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        dataApproval = responseData["dataGR"][0]["log_goods_receipt_approvals"];
        dataApproval.forEach((data, index) => {
          let status;
          if (data.status == 0) {
            status = waiting_approval;
          } else if (data.status == 1) {
            status = waiting_approval;
          } else if (data.status == 2) {
            status = approve;
          } else if (data.status == 3) {
            status = reject;
          }
          var date;
          if (data.date == null) {
            date = "00-00-0000";
          } else {
            const dateApprove = new Date(data.date); // Mengonversi string ke objek Date
            const dd = String(dateApprove.getDate()).padStart(2, "0"); // Hari (2 digit)
            const mm = String(dateApprove.getMonth() + 1).padStart(2, "0"); // Bulan (2 digit)
            const yyyy = dateApprove.getFullYear(); // Tahun (4 digit)
            const HH = String(dateApprove.getHours()).padStart(2, "0"); // Jam (2 digit)
            const MM = String(dateApprove.getMinutes()).padStart(2, "0"); // Menit (2 digit)
            date = `${dd}-${mm}-${yyyy} ${HH}:${MM}`;
          }
          employeeName = data.hrd_employee?.fullname
          addRowApproval(
            index,
            data.hrd_employee.fullname,
            data.level_approval,
            status, // Gunakan nilai status yang sudah diolah
            data.note,
            date
          );
        });
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/goods_receipt_warehouse";
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
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(async function () {
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
async function addRowApproval(
  index,
  fullname,
  level_approval,
  status,
  note,
  date
) {
  const table = document
    .getElementById("dataTableApproval")
    .getElementsByTagName("tbody")[0];
  var rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.id = "row" + index;

  const cell1 = row.insertCell(0);
  cell1.innerHTML = fullname;
  cell1.className = "text-center fw-light text-uppercase";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = level_approval;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = status;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = note;
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = date;
  cell5.className = "text-center fw-light text-uppercase";
}
async function selectGoodsReceiptByCode(button) {
  const codeValue = button.getAttribute('code');
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  button.disabled = true;
  button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "goodsreceiptwarehouse/bycode";
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
    language_POST: language,
    code_goods_receipt_POST: codeValue,
    // employeeID_POST: employeeID
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        await pdf(responseData, button)
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/goods_receipt_warehouse";
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
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(async function () {
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
}
async function pdf(responseData, button) {
  jmlData = responseData["dataSignature"].length
  var dataSign = []
  for (var i = 0; i < jmlData; i++) {
    var sign = responseData["dataSignature"][i]["photo"]
    dataSign.push({ image: sign, });
  }
  const dataResponseGoodsreceipt = JSON.stringify(responseData["dataGR"][0]);
  const dataResponsesignature = JSON.stringify(dataSign);
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = secondUrl + "goodsreceipt";
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
  const dataGoodsReceiptPdf = [];
  const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
  const dataGoodsReceipt = JSON.parse(`{"goods_receipt_POST": ${dataResponseGoodsreceipt}}`);
  const dataSignature = JSON.parse(`{"signature_POST": ${dataResponsesignature}}`);
  $.extend(languageMenu, dataGoodsReceipt, dataSignature);
  dataGoodsReceiptPdf.push(languageMenu)
  var data = JSON.stringify(
    {
      dataGoodsReceiptPdf
    }
  );
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        setTimeout(async function () {
          const fileUrl = `file/receipt/${responseData}`;
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = responseData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // deleteFile(fileUrl)
          button.disabled = false;
          button.innerHTML = "<i class='fa-regular fa-file-pdf'></i>";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/goods_receipt_warehouse";
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
}
async function SelectGoodsReceiptByDate() {
  startDateList = document.getElementById("startDate").value
  endDateList = document.getElementById("endDate").value
  codeWHform = document.getElementById("codeWHform").value
  document.getElementById("loadsearch").disabled = true
  document.getElementById("loadsearch").innerHTML =
    "<span class='input-group-text fw-semibold btn btn-primary'>\
        <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
      </span>";
  await SelectGoodsReceipt(startDateList, endDateList, codeWHform)
}