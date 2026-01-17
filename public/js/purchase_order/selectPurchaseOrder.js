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
  let lastDate = new Date();
  const getToday = new Date();
  lastDate.setDate(getToday.getDate() - 30);
  startDate = lastDate.getFullYear() + "-" + (lastDate.getMonth() + 1).toString().padStart(2, "0") + "-" + lastDate.getDate().toString().padStart(2, "0");
  endDate = getToday.getFullYear() + "-" + (getToday.getMonth() + 1).toString().padStart(2, "0") + "-" + getToday.getDate().toString().padStart(2, "0");
  await SelectPurchaseOrder(startDate, endDate);
  async function dataContent(data) {
    var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
    const content = filterLanguage[0]["content"];
    receivingLocations = content["receiving_locations"]
    document.getElementById("cancelBtn").innerHTML = content["close"];
    document.getElementById("POPage").innerHTML = content["purchase_order"];
    document.getElementById("titleContent").innerHTML = content["purchase_order"];
    document.getElementById("titlePO").innerHTML = content["purchase_order"];
    document.getElementById("viewPO").innerHTML = content["purchase_order"];
    document.getElementById("subtotalFoot").innerHTML = content["subtotal"];
    document.getElementById("discountFoot").innerHTML = content["discount"];
    document.getElementById("shippingFoot").innerHTML = content["shipping_cost"];
    document.getElementById("taxFoot").innerHTML = content["vat"];
    document.getElementById("grandTotalFoot").innerHTML = content["grand_total"];
    document.getElementById("termCondition").innerHTML = content["terms_and_conditions"];
    document.getElementById("pRHeader").innerHTML = content["purchase_request"];
    document.getElementById("pOHeader").innerHTML = content["purchase_order"];
    document.getElementById("worksiteHeader").innerHTML = content["worksite"];
    document.getElementById("purchasingHeader").innerHTML = content["purchasing"];
    document.getElementById("statusHeader").innerHTML = content["status"];
    document.getElementById("actionsHeader").innerHTML = content["actions"];
    // document.getElementById("dateLabel").innerHTML = content["date"];
  }
}
async function SelectPurchaseOrder(startDate, endDate) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"]
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  const language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaseorder";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language,
    start_date_POST: startDate,
    end_date_POST: endDate,
    employeeID_POST: employeeID
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        await resetDataTables()
        var responseData = response["data"];
        var tableItem = "";
        var no = 1;
        jmlPosting = responseData["dataPosting"]
        var hide = ""
        if (jmlPosting === 0) {
          hide = "hidden"
        } else {
          hide = ""
        }
        for (i = 0; i < responseData["dataPurchaseOrder"].length; i++) {
          const statusTemp = responseData["dataPurchaseOrder"][i]["status"];
          const noPO = responseData["dataPurchaseOrder"][i]["code_purchase_order"];
          var statusPO = "";
          if (statusTemp == 0) {
            statusPO = request;
            postingPO = "<button " + hide + " title='" + posting + "' type='button' id='" + noPO + "' onclick='showModalUpdatePostingPurchaseOrderByCode(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
            deletePO = "<button " + hide + " title='" + trash + "' type='button' id='" + noPO + "' onclick='showModalDeletePostingPurchaseOrderByCode(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
            returnPO = "<button " + hide + " title='" + returnd + "' type='button' id='" + noPO + "' onclick='showModalReturnPurchaseOrderByCode(id)' class='btn btn-warning'><i class='fa-solid fa-rotate-left'></i></button>";
            viewPO = "<button title='view' type='button' id='" + noPO + "' onclick='showModalPurchaseOrder(id)' class='btn btn-primary'><i class='fa-solid fa-circle-info'></i></button>";
            pdfPO = "";
          } else if (statusTemp == 1) {
            statusPO = release;
            postingPO = "";
            deletePO = "";
            returnPO = "";
            viewPO = ""
            pdfPO = "<button title='pdf' type='button' code ='" + noPO + "' id='btn-" + no + "' onclick='selectPurchaseOrderByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
          } else if (statusTemp == 2) {
            statusPO = goods_received;
            postingPO = "";
            deletePO = "";
            returnPO = "";
            viewPO = ""
            pdfPO = "<button title='pdf' type='button' code ='" + noPO + "' id='btn-" + no + "' onclick='selectPurchaseOrderByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
          } else if (statusTemp == 3) {
            statusPO = pending_payment;
            postingPO = "";
            deletePO = "";
            returnPO = "";
            viewPO = ""
            pdfPO = "<button title='pdf' type='button' code ='" + noPO + "' id='btn-" + no + "' onclick='selectPurchaseOrderByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
          } else if (statusTemp == 4) {
            statusPO = paid;
            postingPO = "";
            deletePO = ""
            returnPO = ""
            viewPO = ""
            pdfPO = "<button title='pdf' type='button' code ='" + noPO + "' id='btn-" + no + "' onclick='selectPurchaseOrderByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
          } else if (statusTemp == 5) {
            statusPO = cancel;
            postingPO = "";
            deletePO = "";
            returnPO = "";
            viewPO = ""
            pdfPO = "<button title='pdf' type='button' code ='" + noPO + "' id='btn-" + no + "' onclick='selectPurchaseOrderByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
          }

          tableItem +=
            "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["code_purchase_request"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["code_purchase_order"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["worksiteCompany"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["employeePurchasing"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + statusPO + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ viewPO + returnPO + pdfPO + postingPO + deletePO + "</div></td>\
                          </tr>";
          no++;
        }
        document.getElementById("dataTable").innerHTML = tableItem;
        document.getElementById("startDate").value = ddmmyyyy(startDate);
        document.getElementById("endDate").value = ddmmyyyy(endDate);
        await table();
        setTimeout(() => {
          hideSpinner();
        }, 1000);
        document.getElementById("loadsearch").innerHTML = "  \
  <span onclick='SelectPurchaseOrderByDate()' class='input-group-text fw-semibold btn btn-primary'>\
  <i class='fa-solid fa-magnifying-glass'></i>\
  </span>"
      } else if (response["access"] == "failed") {
        document.getElementById("startDate").value = ddmmyyyy(startDate);
        document.getElementById("endDate").value = ddmmyyyy(endDate);
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(() => {
          hideSpinner();
        }, 1000);
        document.getElementById("loadsearch").innerHTML = "  \
  <span onclick='SelectPurchaseOrderByDate()' class='input-group-text fw-semibold btn btn-primary'>\
  <i class='fa-solid fa-magnifying-glass'></i>\
  </span>"
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_404,
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
        message: status_401,
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
        message: status_500,
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
async function SelectPurchaseOrderByDate() {
  const startDate = yyyymmdd(document.getElementById("startDate").value)
  const endDate = yyyymmdd(document.getElementById("endDate").value)
  document.getElementById("loadsearch").disabled = true
  document.getElementById("loadsearch").innerHTML =
    "<div>\
            <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
            </span>\
          <div>";
  await SelectPurchaseOrder(startDate, endDate)
}
async function selectPurchaseOrderByCode(button) {
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
  var url = mainUrl + "purchaseorder/code";
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
    code_purchase_order_POST: codeValue,
    employeeID_POST: employeeID
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
          window.location.href = "/purchase_order";
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
  const dataResponsePurchaseOrder = JSON.stringify(responseData["dataPO"][0]);
  const dataResponsesignature = JSON.stringify(responseData["dataSignature"][0]);
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = secondUrl + "purchaseorder";
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
  const dataPurchaseOrderPdf = [];
  const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
  const dataPurchaseOrder = JSON.parse(`{"purchase_order_POST": ${dataResponsePurchaseOrder}}`);
  const dataSignature = JSON.parse(`{"signature_POST": ${dataResponsesignature}}`);
  $.extend(languageMenu, dataPurchaseOrder, dataSignature);
  dataPurchaseOrderPdf.push(languageMenu)
  var data = JSON.stringify(
    {
      dataPurchaseOrderPdf
    }
  );
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        setTimeout(async function () {
          const fileUrl = `file/order/${responseData}`;
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
          window.location.href = "/purchase_request_quotation";
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
async function showModalPurchaseOrder(id) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalPO"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalPO"), { keyboard: false });
    myModal.toggle();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaseorder/code";
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
    code_purchase_order_POST: id,
    employeeID_POST: employeeID
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        document.getElementById("codePO").innerHTML = responseData["dataPO"][0]["code_purchase_order"]
        document.getElementById("namePartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["name"]
        document.getElementById("addressPartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["address"]
        document.getElementById("cityPartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["city"]
        document.getElementById("contactPersonPartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["contact_person"]
        document.getElementById("phonePartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["phone"]
        document.getElementById("emailPartnersPO").innerHTML = responseData["dataPO"][0]["log_partner"]["email"]
        document.getElementById("subTotalOrder").innerHTML = formatRupiah(responseData["dataPO"][0]["subtotal"])
        document.getElementById("discountOrder").innerHTML = formatRupiah(responseData["dataPO"][0]["discount"])
        document.getElementById("shippingOrder").innerHTML = formatRupiah(responseData["dataPO"][0]["shipping_cost"])
        document.getElementById("taxOrder").innerHTML = formatRupiah(responseData["dataPO"][0]["vat"])
        document.getElementById("noPR").innerHTML = responseData["dataPO"][0]["code_purchase_request"]
        document.getElementById("grandTotalOrder").innerHTML = formatRupiah(responseData["dataPO"][0]["grand_total"])
        document.getElementById("dateCreatePO").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + datepo + ":</a> " + (responseData["dataPO"][0]["date_release"] == null ? ddmmyyyy("0000-00-00") : ddmmyyyy(responseData["dataPO"][0]["date_release"])) + "</span>"
        document.getElementById("dateDeliveryPO").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + deliveryDate + ":</a> " + ddmmyyyy(responseData["dataPO"][0]["date_delivery"]) + "</span>"
        document.getElementById("currencyPO").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + currency + ":</a> " + responseData["dataPO"][0]["currency"] + "</span>"
        document.getElementById("top").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + termofpayment + ":</a> " + responseData["dataPO"][0]["log_term_of_payment"]["log_term_of_payment_translation"]["translation"] + "</span>"
        document.getElementById("receivingLocations").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + receivingLocations + ":</a> " + responseData["dataPO"][0]["log_receiving_location"]["name"] + "</span>"
        document.getElementById("notePO").innerHTML = "<li></li><span class='text-uppercase'><a class='fw-bold text-dark'>" + note + ":</a> " + responseData["dataPO"][0]["note"] + "</span>"
        const persen = (responseData["dataPO"][0]["vat"] / (responseData["dataPO"][0]["subtotal"] - responseData["dataPO"][0]["discount"] + responseData["dataPO"][0]["shipping_cost"])) * 100
        document.getElementById("persen").innerHTML = persen
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData["dataPO"][0]["details"].length; i++) {
          tableItem +=
            "<tr>\
              <td class='fw-light text-center'>" + no + "</td>\
              <td class='fw-light text-center'>" + responseData["dataPO"][0]["details"][i]["log_item_master"]["name"] + "</td>\
              <td class='fw-light text-center text-uppercase'>" + responseData["dataPO"][0]["details"][i]["qty"] + "</td>\
              <td class='fw-light text-end text-uppercase'>" + formatRupiah(responseData["dataPO"][0]["details"][i]["price"]) + "</td>\
              <td class='fw-light text-end text-uppercase'>" + formatRupiah(responseData["dataPO"][0]["details"][i]["qty"] * responseData["dataPO"][0]["details"][i]["price"]) + "</td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTableItemMasterOrderDetail").innerHTML = tableItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        // setTimeout(function () {
        //   window.location.href = "/purchase_request_quotation";
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
}