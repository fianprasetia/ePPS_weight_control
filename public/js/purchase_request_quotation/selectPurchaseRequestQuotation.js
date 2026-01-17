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
  await showLayoutListData();

  async function dataContent(data) {
    var filterLanguage = data.filter(
      (filtercontent) => filtercontent.language == language
    );

    const content = filterLanguage[0]["content"];

    document.getElementById("titlePage").innerHTML = content["purchase_request_quotation"];
    document.getElementById("titleContent").innerHTML = content["purchase_request_quotation"];
    document.getElementById("partnersLabel").innerHTML = content["partners"] + "<span class='text-danger'>*</span>";
    document.getElementById("orderDateLabel").innerHTML = content["order_date"] + "<span class='text-danger'>*</span>";
    document.getElementById("deliveryDateLabel").innerHTML = content["delivery_date"] + "<span class='text-danger'>*</span>";
    document.getElementById("noteLabel").innerHTML = content["note"];
    document.getElementById("currencyLabel").innerHTML = content["currency"] + "<span class='text-danger'>*</span>";
    document.getElementById("exchangeRateLabel").innerHTML = content["exchange_rate"] + "<span class='text-danger'>*</span>";
    document.getElementById("purchaseRequestLabel").innerHTML = content["purchase_request"] + "<span class='text-danger'>*</span>";
    document.getElementById("termOfPaymentLabel").innerHTML = content["term_of_payment"] + "<span class='text-danger'>*</span>";
    document.getElementById("receivingLocationsLabel").innerHTML = content["receiving_locations"] + "<span class='text-danger'>*</span>";
    document.getElementById("codeItemOrder").innerHTML = content["code_item"];
    document.getElementById("descriptionOrder").innerHTML = content["description"];
    document.getElementById("uomOrder").innerHTML = content["uom"];
    document.getElementById("qtyOrder").innerHTML = content["qty"];
    document.getElementById("noteOrder").innerHTML = content["note"];
    document.getElementById("unitPriceOrder").innerHTML = content["unit_price"];
    document.getElementById("totalOrder").innerHTML = content["total"];
    document.getElementById("subtotalFoot").innerHTML = content["subtotal"];
    document.getElementById("discountFoot").innerHTML = content["discount"];
    document.getElementById("shippingFoot").innerHTML = content["shipping_cost"];
    document.getElementById("taxFoot").innerHTML = content["vat"];
    document.getElementById("grandTotalFoot").innerHTML = content["grand_total"];
    document.getElementById("noPRListData").innerHTML = content["purchase_request"];
    document.getElementById("noPRQListData").innerHTML = content["purchase_request_quotation"];
    document.getElementById("comparisonData").innerHTML = content["comparison_sheet"];
    document.getElementById("PartnersListData").innerHTML = content["partners"];
    document.getElementById("actionsListData").innerHTML = content["actions"];
    document.getElementById("noPRData").innerHTML = content["purchase_request"];
    document.getElementById("worksiteData").innerHTML = content["worksite"];
    document.getElementById("dateCreateData").innerHTML = content["order_date"];
    document.getElementById("requestbyData").innerHTML = content["requester"];
    document.getElementById("actionData").innerHTML = content["actions"];
  }
  document.getElementById("load").innerHTML =
    "<a id='cancelBtn' onclick='cancelTransaction()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='InsertPurchaseRequestQuatation()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutUpdateData(id) {
  document.getElementById('createData').hidden = false;
  document.getElementById('listData').hidden = true;
  document.getElementById('purchaseRequestData').hidden = true;
  document.getElementById("formHeaderPR").reset()
  document.getElementById("formadditemmaster").reset()
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById('purchaseRequest').value = id;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;


}
async function showLayoutCreateData(id) {
  document.getElementById('createData').hidden = false;
  document.getElementById('listData').hidden = true;
  document.getElementById('purchaseRequestData').hidden = true;
  document.getElementById("formHeaderPR").reset()
  document.getElementById("formadditemmaster").reset()
  await SelectPartners();
  await selectCurrency();
  await SelectTermOfPayment();
  await SelectReceivingLocation();
  await PurchaseRequestDetail(id);
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById('purchaseRequest').value = id;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutPurchaseRequestData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;


}
async function showLayoutListData() {
  await SelectPurchaseRequestQuotation()
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById("listData").hidden = false;
  document.getElementById('createData').hidden = true;
  document.getElementById('purchaseRequestData').hidden = true;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutPurchaseRequestData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function showLayoutPurchaseRequestData() {
  await SelectPurchaseRequest();
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById("listData").hidden = true;
  document.getElementById('createData').hidden = true;
  document.getElementById('purchaseRequestData').hidden = false;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`
}
async function SelectPurchaseRequestQuotation() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }

  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation";

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
    employeeID_POST: employeeID,
    language_POST: language
  });

  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);

      if (response["access"] == "success") {
        // await resetDataTables();
        var responseData = response["data"];
        var tableItem = "";
        var no = 1;

        // Hitung berapa kali masing-masing code_purchase_request muncul
        const countPR = responseData.reduce((acc, item) => {
          const code = item.code_purchase_request;
          acc[code] = (acc[code] || 0) + 1;
          return acc;
        }, {});

        // Simpan code terakhir untuk kontrol rowspan
        let lastCodePR = "";

        for (let i = 0; i < responseData.length; i++) {
          const codePR = responseData[i]["code_purchase_request"];
          const totalPR = countPR[codePR];
          const noPRQ = responseData[i]["code_purchase_request_quotation"];

          const editData = "<button title='" + edit + "' type='button' id='" + noPRQ +
            "' onclick='showUpdatePurchaseRequestByCode(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";

          const pdfData = "<button title='pdf' type='button' id='" + noPRQ +
            "' onclick='selectPurchaseRequestByCode(id)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";

          const postingData = "<button title='" + posting + "' type='button' id='" + noPRQ +
            "' onclick='showModalupdatePostingPurchaseRequestByCode(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";

          const deleteData = "<button title='" + trash + "' type='button' id='" + noPRQ +
            "' onclick='showModalDeletePurchaseRequestByCode(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";

          tableItem += "<tr>";

          tableItem += "<td class='fw-light text-center'>" + no + "</td>";

          if (lastCodePR !== codePR) {
            tableItem += "<td rowspan='" + totalPR + "' class='fw-light text-center text-uppercase align-middle'>" + codePR + "</td>";
          }

          tableItem += "<td class='fw-light text-center text-uppercase'>" + noPRQ + "</td>";

          tableItem += "<td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["log_partner"]["name"]) + " (" + kapital(responseData[i]["log_partner"]["city"]) + ")</td>";

          // Kolom Comperison (delete tombol)
          if (lastCodePR !== codePR) {
            tableItem += "<td rowspan='" + totalPR + "' class='fw-light text-center text-uppercase align-middle'>" + "<button title='" + comparison_sheet + "' type='button' code ='" + codePR + "' id='btn-" + no + "'  onclick='showModalComparisonPurchaseRequestByCode(this)' class='btn btn-success'>" + "<i class='fa-solid fa-file-excel'></i></button></td >"
          }

          // Kolom Aksi
          tableItem += "<td class='fw-light text-center'><div class='btn-group'>" +
            pdfData + editData + postingData + deleteData + "</div></td>";

          tableItem += "</tr>";

          // Update code terakhir
          lastCodePR = codePR;
          no++;
        }

        document.getElementById("dataTable").innerHTML = tableItem;
        // await table();
        setTimeout(() => {
          hideSpinner();
        }, 1000);

      } else if (response["access"] === "failed") {
        message = response["message"];
        setTimeout(() => hideSpinner(), 1000);
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
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
      setTimeout(() => (window.location.href = "/"), 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(() => (window.location.href = "/"), 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_500
      });
      setTimeout(() => (window.location.href = "/"), 3000);
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
}
async function selectPurchaseRequestByCode(id) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation/code";
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
    code_purchase_request_quotation_POST: id
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        await pdf(responseData)
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
async function pdf(responseData) {
  const dataResponseQuotation = JSON.stringify(responseData);
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = secondUrl + "purchaserequestquotation";
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
  const dataPurchaseRequestQuotationPdf = [];
  const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
  const dataPurchaseRequestQuotation = JSON.parse(`{"purchase_request_quotation_POST": ${dataResponseQuotation}}`);
  $.extend(languageMenu, dataPurchaseRequestQuotation);
  dataPurchaseRequestQuotationPdf.push(languageMenu)
  var data = JSON.stringify(
    {
      dataPurchaseRequestQuotationPdf
    }
  );
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        const fileUrl = `file/quotation/${responseData}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = responseData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
async function SelectPurchaseRequest(code) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/quotation";
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
    employee_POST: employeeID,
    language_POST: language
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        await resetDataTables()
        var responseData = response["data"];
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData.length; i++) {
          noPR = responseData[i]["code_purchase_request"];
          deleteData = "<button title='" + trash + "' type='button' id='" + noPR + "' onclick='showModalDeletePostingPurchaseRequest(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
          createData = "<button title='" + process + "' type='button' id='" + noPR + "' onclick='showLayoutCreateData(id)' class='btn btn-primary'><i class='fa-solid fa-rotate'></i>";
          closeData = "<button title='" + done + "' type='button' id='" + noPR + "' onclick='showModalDonePurchaseRequest(id)' class='btn btn-success'><i class='fa-solid fa-circle-check'></i>";
          tableItem +=
            "<tr>\
                <td class='fw-light text-center text-uppercase'>" + no + "</td>\
                <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_purchase_request"] + "</td>\
                <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                <td class='fw-light text-center'>"+ ddmmyyyy(responseData[i]["date"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                <td class='fw-light text-center text-uppercase'><div class='btn-group'>" + createData + closeData + deleteData + "</div></td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTablePurchaseRequest").innerHTML = tableItem;
        await table();
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });



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
async function SelectPartners(code) {
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "partners/quotation";
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
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        var filterSubData = responseData.filter(
          (filterSubData) => filterSubData.code_partners == code
        );
        var filternotSubData = responseData.filter(
          (filternotSubData) => filternotSubData.code_partners != code
        );
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
          subOptionItem +=
            "<option class='fw-light text-uppercase' value='" +
            filternotSubData[i]["code_partners"] +
            "'>" +
            kapital(filternotSubData[i]["name"]) + " (" + kapital(filternotSubData[i]["city"]) + ")"
          "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' selected disabled value=''>" +
            kapital(select) +
            "</option>";
        } else {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' value=" +
            filterSubData[0]["code_partners"] +
            ">" +
            kapital(filterSubData[0]["name"]) + " (" + kapital(filterSubData[0]["city"]) + ")"
          "</option>";
        }

        document.getElementById("partners").innerHTML =
          mainOptionItem + "" + subOptionItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send();
}
async function selectCurrency(code) {
  const dataCurrency = "file/currency.json";
  fetch(dataCurrency)
    .then((response) => response.json())
    .then((dataCurrency) => dataContent(dataCurrency));
  function dataContent(dataCurrency) {
    var responseData = dataCurrency;
    var filterSubData = responseData.filter(
      (filterSubData) => filterSubData.currencies == code
    );
    var filternotSubData = responseData.filter(
      (filternotSubData) => filternotSubData.currencies != code
    );
    mainOptionItem = "";
    subOptionItem = "";
    for (i = 0; i < filternotSubData.length; i++) {
      subOptionItem +=
        "<option class='fw-light text-uppercase' value='" +
        filternotSubData[i]["currencies"] +
        "'>" +
        kapital(filternotSubData[i]["currencies"]) +
        "</option>";
    }
    if (filterSubData == "" || filterSubData == undefined) {
      mainOptionItem +=
        "<option class='fw-light text-uppercase' selected disabled value=''>" +
        kapital(select) +
        "</option>";
    } else {
      mainOptionItem +=
        "<option class='fw-light text-uppercase' value=" +
        filterSubData[0]["currencies"] +
        ">" +
        kapital(filterSubData[0]["currencies"]) +
        "</option>";
    }
    document.getElementById("currency").innerHTML =
      "" + mainOptionItem + " " + subOptionItem + "";
  }
}
async function SelectTermOfPayment(code) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "termofpayment";
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
    language_POST: language
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        var filterSubData = responseData.filter(
          (filterSubData) => filterSubData.code_term_of_payment == code
        );
        var filternotSubData = responseData.filter(
          (filternotSubData) => filternotSubData.code_term_of_payment != code
        );
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
          subOptionItem +=
            "<option class='fw-light text-uppercase' value='" +
            filternotSubData[i]["code_term_of_payment"] +
            "'>" +
            kapital(
              filternotSubData[i]["log_term_of_payment_translation"][
              "translation"
              ]
            ) +
            "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' selected disabled value=''>" +
            kapital(select) +
            "</option>";
        } else {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' value=" +
            filterSubData[0]["code_term_of_payment"] +
            ">" +
            kapital(
              filterSubData[0]["log_term_of_payment_translation"]["translation"]
            ) +
            "</option>";
        }

        document.getElementById("termOfPayment").innerHTML =
          mainOptionItem + "" + subOptionItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
async function SelectReceivingLocation(code) {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "receivinglocations";
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
    language_POST: language
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        var filterSubData = responseData.filter(
          (filterSubData) => filterSubData.id_receiving_locations == code
        );
        var filternotSubData = responseData.filter(
          (filternotSubData) => filternotSubData.id_receiving_locations != code
        );
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
          subOptionItem +=
            "<option class='fw-light text-uppercase' value='" +
            filternotSubData[i]["id_receiving_locations"] +
            "'>" +
            kapital(filternotSubData[i]["name"]) +
            "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' selected disabled value=''>" +
            kapital(select) +
            "</option>";
        } else {
          mainOptionItem +=
            "<option class='fw-light text-uppercase' value=" +
            filterSubData[0]["id_receiving_locations"] +
            ">" +
            kapital(filterSubData[0]["name"]) +
            "</option>";
        }

        document.getElementById("receivingLocations").innerHTML =
          mainOptionItem + "" + subOptionItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
async function PurchaseRequestDetail(id) {

  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/quotationcode";
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
    code_purchase_request_POST: id
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        document.getElementById("location").value = responseData[0]["code_company"];
        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData[0]["log_purchase_request_details"].length; i++) {
          totalQty = parseFloat(responseData[0]["log_purchase_request_details"][i]["qty_actual"]) - parseFloat(responseData[0]["log_purchase_request_details"][i]["qty_rfq"])
          tableItem +=
            "<tr>\
                <td class='fw-light text-center'>" + responseData[0]["log_purchase_request_details"][i]["code_item"] + "</td>\
                <td class='fw-light text-center'>" + responseData[0]["log_purchase_request_details"][i]["log_item_master"]["name"] + "</td>\
                <td class='fw-light text-center'><input type='text' class='form-control fw-light text-uppercase' id='noteDataBody' value='"+ responseData[0]["log_purchase_request_details"][i]["note"] + "' name='noteDataBody[]'></td>\
                <td class='fw-light text-center text-uppercase'>" + responseData[0]["log_purchase_request_details"][i]["log_item_master"]["uom"] + "</td>\
                <td class='fw-light text-center'><input type='number' onkeyup='countTotalPrice()' value='" + totalQty + "' class='form-control' id='qtyDataBody' name='qtyDataBody[]' style='width: 150px;'></td>\
                <td class='fw-light text-center'><input type='text' onfocus='removeZero(this)' onkeyup='typeformatRupiah(this); countTotalPrice()' class='form-control text-end' id='hargaDataBody' value='0' name='hargaDataBody[]' style='width: 150px;'></td>\
                <td class='fw-light text-center'><input type='text' class='form-control text-end' id='totalDataBody' value='0' name='totalDataBody[]'  style='width: 150px;' disabled></td>\
                <td class='fw-light text-center'><input type='checkbox' onchange='countSubTotalPrice(this)' class='form-check-input' value='' id='actions' name='actions[]' style='width:30px; height: 30px;'></td>\
            </tr>";
          no++;
        }
        document.getElementById("dataTableItem").innerHTML = tableItem;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_capex";
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
function countTotalPrice() {
  const rows = document.querySelectorAll("tr");
  let subtotal = 0;
  rows.forEach((row, index) => {
    const qtyInput = row.querySelector("input[name='qtyDataBody[]']");
    const hargaInput = row.querySelector("input[name='hargaDataBody[]']");
    const priceTotal = row.querySelector("input[name='totalDataBody[]']");
    const checkbox = row.querySelector("input[name='actions[]']");
    if (qtyInput && hargaInput) {
      const qty = parseFloat(qtyInput.value) || 0;
      const harga = parseFloat(unformatRupiah(hargaInput.value)) || 0;
      const total = qty * harga;
      priceTotal.value = formatRupiah(total);
      if (checkbox && checkbox.checked) {
        subtotal += total;
      }
    }
  });
  const subtotalInput = document.getElementById("subtotal");
  subtotalInput.value = subtotal
}
function countSubTotalPrice(checkbox) {

  const row = checkbox.closest("tr");


  const totalInput = row.querySelector("input[name='totalDataBody[]']");


  const subtotalInput = document.getElementById("subtotal");

  let subtotal = parseFloat(unformatRupiah(subtotalInput.value)) || 0;


  const total = parseFloat(unformatRupiah(totalInput.value)) || 0;

  if (checkbox.checked) {

    subtotal += total;
  } else {

    subtotal -= total;
  }


  subtotalInput.value = formatRupiah(subtotal);
}
async function countGrandTotalPrice(source = null) {
  const subtotal = document.getElementById("subtotal").value;
  if (subtotal == 0 || subtotal === "") return;
  const diskonPersen = document.getElementById("diskonPersen");
  const diskonNominal = document.getElementById("diskonNominal");
  const shipping = document.getElementById("shipping").value;
  const ppnPersen = document.getElementById("ppnPersen");
  const ppnNominal = document.getElementById("ppnNominal");
  const grandTotal = document.getElementById("grandTotal");
  const subtotalValue = parseFloat(unformatRupiah(subtotal)) || 0;
  const shippingValue = parseFloat(unformatRupiah(shipping)) || 0;
  let diskonNominalValue = parseFloat(unformatRupiah(diskonNominal.value)) || 0;
  let diskonPersenValue = parseFloat(diskonPersen.value.replace('%', '').trim()) || 0;

  if (source === 'persen') {
    diskonNominalValue = (subtotalValue * diskonPersenValue) / 100;
    diskonNominal.value = formatRupiah(roundToNearest(diskonNominalValue));
  } else if (source === 'nominal') {
    diskonPersenValue = (diskonNominalValue / subtotalValue) * 100;
    diskonPersen.value = diskonPersenValue.toFixed(2) + "%";
  } else {
    diskonNominalValue = (subtotalValue * diskonPersenValue) / 100;
    diskonNominal.value = formatRupiah(roundToNearest(diskonNominalValue));
  }

  const totalSetelahDiskon = subtotalValue - roundToNearest(diskonNominalValue);
  const ppnPersenValue = parseFloat(ppnPersen.value.replace('%', '').trim()) || 0;
  const totalPpn = ((totalSetelahDiskon + shippingValue) * ppnPersenValue) / 100;
  ppnNominal.value = formatRupiah(totalPpn);
  grandTotal.value = formatRupiah(totalSetelahDiskon + shippingValue + totalPpn);
}
document.getElementById("ppnPersen").addEventListener("input", function () {
  let value = this.value.replace(/[^0-9.]/g, "");
  if (value !== "") {
    this.value = value + "%";
  }
});
document.getElementById("diskonPersen").addEventListener("input", function () {
  let value = this.value.replace(/[^0-9.]/g, "");
  if (value !== "") {
    this.value = value + "%";
  }
});
async function showModalComparisonPurchaseRequestByCode(button) {
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
  var url = mainUrl + "purchaserequestquotation/purchaserequest";
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
    code_purchase_request_POST: codeValue
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        await excel(responseData, button)
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
async function excel(responseData, button) {
  const language = await JSON.parse(getCookie("language"));
  let token = await JSON.parse(getCookie("dataToken"));

  if (!token) {
    token = await getAccessToken();
  }
  const formData = new FormData();
  const loadData = {
    language_POST: language,
    purchase_comparison_POST: responseData
  };
  const jsonBlob = new Blob([JSON.stringify(loadData)], { type: 'application/json' });
  formData.append("data", jsonBlob); // Kirim sebagai 'data'

  const xhr = new XMLHttpRequest();
  const url = secondUrl + "comparison";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      message: overload,
    });
    setTimeout(async function () {
      await keluar()
    }, 3000);
  };

  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(xhr.response);
      if (response["access"] === "success") {
        const responseData = response["data"];
        setTimeout(() => {
          const fileUrl = `file/comparison/${responseData}`;
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = responseData;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          button.disabled = false;
          button.innerHTML = "<i class='fa-solid fa-file-excel'></i>";
        }, 3000);
      } else {
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          message: response["message"] || "Gagal memproses permintaan.",
        });
      }
    }

    if (this.status === 404) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(() => window.location.href = "/", 3000);
    } else if (this.status === 401) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(() => window.location.href = "/", 3000);
    } else if (this.status === 500) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
      setTimeout(() => window.location.href = "/", 3000);
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(formData);
}