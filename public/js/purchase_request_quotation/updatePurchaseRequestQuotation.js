async function showUpdatePurchaseRequestByCode(id) {
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation/code"
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
    code_purchase_request_quotation_POST: id,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        const codePR = responseData[0]["code_purchase_request"]
        const codePartners = responseData[0]["code_partners"]
        const codeCurrency = responseData[0]["currency"]
        const codeTOP = responseData[0]["code_term_of_payment"]
        const codeRL = responseData[0]["id_receiving_locations"]
        const subtotal = responseData[0]["subtotal"]
        const discount = responseData[0]["discount"]
        const shipping_cost = responseData[0]["shipping_cost"]
        const vat = responseData[0]["vat"]
        const persen = (parseFloat(vat) / (parseFloat(subtotal) - parseFloat(discount) + parseFloat(shipping_cost))) * 100
        await showLayoutUpdateData(codePR)
        // await SelectPurchaseRequest(codePR);
        await SelectPartners(codePartners);
        await selectCurrency(codeCurrency);
        await SelectTermOfPayment(codeTOP);
        await SelectReceivingLocation(codeRL);
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='cancelTransaction()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updatePurchaseRequestQuotation()' class='btn  btn-primary'>" + kapital(done) + "</a>"
        document.getElementById("code").value = responseData[0]["code_purchase_request_quotation"]
        document.getElementById("purchaseRequest").disabled = true
        document.getElementById("dataTableItem").innerHTML = ""
        document.getElementById("orderDate").value = ddmmyyyy(responseData[0]["date_request"])
        document.getElementById("deliveryDate").value = ddmmyyyy(responseData[0]["date_delivery"])
        document.getElementById("note").value = responseData[0]["note"]
        document.getElementById("exchangeRate").value = responseData[0]["exchange_rate"]
        document.getElementById("subtotal").value = formatRupiah(responseData[0]["subtotal"])
        document.getElementById("diskonNominal").value = formatRupiah(responseData[0]["discount"])
        document.getElementById("shipping").value = responseData[0]["shipping_cost"]
        document.getElementById("ppnNominal").value = formatRupiah(responseData[0]["vat"])
        document.getElementById("ppnPersen").value = persen + "%"
        document.getElementById("grandTotal").value = formatRupiah(responseData[0]["grand_total"])
        dataDetail = responseData[0]["details"]
        dataDetail.forEach((data, index) => {
          const total = parseFloat(data.qty) * parseFloat(data.price)
          addRow(
            data.code_purchase_request_quotation_detail,
            data.code_item,
            data.log_item_master.name,
            data.log_item_master.uom,
            data.note,
            data.qty,
            data.price,
            total
          );
        });
        // const createTab = document.querySelector('a[data-bs-target="#purchase-request-quotation"]');

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
async function addRow(idRow, code_item, name, uom, note, qty, price, total) {
  const table = document.getElementById("dataTableItemMasterOrder").getElementsByTagName("tbody")[0];
  var rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.id = "row" + idRow;


  const cell1 = row.insertCell(0);
  cell1.innerHTML = code_item;
  cell1.className = "text-center fw-light";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = name;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = note;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = uom
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = "<input type='number' onkeyup='countTotalPrice()' value='" + qty + "' class='form-control' id='qtyDataBody' name='qtyDataBody[]' style='width: 150px;'>";
  cell5.className = "text-center fw-light text-uppercase";

  const cell6 = row.insertCell(5);
  cell6.innerHTML = "<input type='text' onkeyup='countTotalPrice()' class='form-control text-end' id='hargaDataBody' value='" + formatRupiah(price) + "' name='hargaDataBody[]'  style='width: 150px;'>";
  cell6.className = "text-center fw-light text-uppercase";

  const cell7 = row.insertCell(6);
  cell7.innerHTML = "<input type='text' class='form-control text-end' id='totalDataBody' value='" + formatRupiah(total) + "' name='totalDataBody[]'  style='width: 150px;' disabled></td>";
  cell7.className = "text-center fw-light text-uppercase";

  const cell8 = row.insertCell(7);
  cell8.innerHTML = "<input type='checkbox' onchange='countSubTotalPrice(this)' class='form-check-input' value='' id='actions' name='actions[]' style='width:30px; height: 30px;' checked>"
  cell8.className = "text-center";
  // document.getElementById("formadditemmaster").reset()
}
async function updatePurchaseRequestQuotation() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const dataEmployee = await JSON.parse(getCookie("dataEmployee"));
  const employeeID = dataLogin["idEmployee"]
  const companyCode = dataEmployee["code_company"]
  const worksiteCode = dataLogin["codeCompany"]
  const username = dataLogin["username"];
  const partnersHeader = document.getElementById("partners").value
  const orderDateHeader = document.getElementById("orderDate").value
  const deliveryDateHeader = document.getElementById("deliveryDate").value
  const noteHeader = document.getElementById("note").value
  const currencyHeader = document.getElementById("currency").value
  const exchangeRateHeader = document.getElementById("exchangeRate").value
  const purchaseRequestHeader = document.getElementById("purchaseRequest").value
  const termOfPaymentHeader = document.getElementById("termOfPayment").value
  const receivingLocationsHeader = document.getElementById("receivingLocations").value
  const subtotalHeader = document.getElementById("subtotal").value
  const diskonNominalHeader = document.getElementById("diskonNominal").value
  const shippingHeader = document.getElementById("shipping").value
  const ppnNominalHeader = document.getElementById("ppnNominal").value
  const grandTotalHeader = document.getElementById("grandTotal").value
  const codeHeader = document.getElementById("code").value
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
              "partners": { required: !0 },
              "orderDate": { required: !0 },
              "deliveryDate": { required: !0 },
              "currency": { required: !0 },
              "exchangeRate": { required: !0 },
              "purchaseRequest": { required: !0 },
              "termOfPayment": { required: !0 },
              "receivingLocations": { required: !0 },
            },
            messages: {
              "partners": required,
              "orderDate": required,
              "deliveryDate": required,
              "currency": required,
              "exchangeRate": required,
              "purchaseRequest": required,
              "termOfPayment": required,
              "receivingLocations": required,
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
  const rows = document.querySelectorAll('tr');
  const detail = [];
  const dataPurchaseRequesQuotation = [];
  rows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const codeItem = row.querySelector('td:nth-child(1)').innerText.trim();
      const note = row.querySelector('td:nth-child(3)').innerText;
      const qty = row.querySelector('input[name="qtyDataBody[]"]').value;
      const price = row.querySelector('input[name="hargaDataBody[]"]').value;
      const total = row.querySelector('input[name="totalDataBody[]"]').value;

      detail.push({
        code_item_POST: codeItem,
        note_POST: note,
        qty_POST: qty,
        price_POST: unformatRupiah(price),
        total_POST: unformatRupiah(total)
      });
    }
  });
  const code_Header = JSON.parse('{"code_POST":"' + codeHeader + '"}')
  const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
  const username_Header = JSON.parse('{"username_POST":"' + username + '"}')
  const employeeID_Header = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const companyCode_Header = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
  const worksiteCode_Header = JSON.parse('{"worksite_code_POST":"' + worksiteCode + '"}')
  const partners_Header = JSON.parse('{"partners_POST":"' + partnersHeader + '"}')
  const orderDate_Header = JSON.parse('{"order_date_POST":"' + yyyymmdd(orderDateHeader) + '"}')
  const deliveryDate_Header = JSON.parse('{"delivery_date_POST":"' + yyyymmdd(deliveryDateHeader) + '"}')
  const note_Header = JSON.parse('{"note_POST":"' + noteHeader + '"}')
  const currency_Header = JSON.parse('{"currency_POST":"' + currencyHeader + '"}')
  const exchangeRate_Header = JSON.parse('{"exchange_rate_POST":"' + exchangeRateHeader + '"}')
  const purchaseRequest_Header = JSON.parse('{"purchase_request_POST":"' + purchaseRequestHeader + '"}')
  const termOfPayment_Header = JSON.parse('{"term_of_payment_POST":"' + termOfPaymentHeader + '"}')
  const receivingLocations_Header = JSON.parse('{"receiving_locations_POST":"' + receivingLocationsHeader + '"}')
  const subtotal_Header = JSON.parse('{"subtotal_POST":"' + unformatRupiah(subtotalHeader) + '"}')
  const diskonNominal_Header = JSON.parse('{"nominal_diskon_POST":"' + unformatRupiah(diskonNominalHeader) + '"}')
  const shipping_Header = JSON.parse('{"shipping_POST":"' + unformatRupiah(shippingHeader) + '"}')
  const ppnNominal_Header = JSON.parse('{"ppn_nominal_POST":"' + unformatRupiah(ppnNominalHeader) + '"}')
  const grandTotal_Header = JSON.parse('{"grand_total_POST":"' + unformatRupiah(grandTotalHeader) + '"}')
  $.extend(language_Header, username_Header, code_Header, employeeID_Header, companyCode_Header, worksiteCode_Header, partners_Header, orderDate_Header, deliveryDate_Header, note_Header, currency_Header, exchangeRate_Header, purchaseRequest_Header, termOfPayment_Header, receivingLocations_Header, subtotal_Header, diskonNominal_Header, shipping_Header, ppnNominal_Header, grandTotal_Header, { detail });
  dataPurchaseRequesQuotation.push(language_Header)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation/update";
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

  var data = JSON.stringify(dataPurchaseRequesQuotation);
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
          window.location.href = "/purchase_request_quotation";
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
  return false;
}
async function showModalupdatePostingPurchaseRequestByCode(param) {
  var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
  myModal.toggle();
  document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updatePostingPurchaseRequestQuotation(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
  document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function updatePostingPurchaseRequestQuotation(id) {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation/posting"
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
    code_purchase_request_qoutation_POST: id,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
async function showModalDonePurchaseRequest(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updateDonePurchaseRequest(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_done + "</p>"
}
async function updateDonePurchaseRequest(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/done"
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
            message:overload,
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
                    window.location.href = "/purchase_request_quotation";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/purchase_request_capex";
                // }, 3000);
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