async function InsertPurchaseRequestQuatation() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"]
  const dataEmployee = await JSON.parse(getCookie("dataEmployee"));
  const employeeID = dataLogin["idEmployee"]
  const companyCode = dataEmployee["code_company"]
  const worksiteCode = document.getElementById("location").value
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
  // const today = new Date();
  // const year = today.getFullYear(); // Mendapatkan tahun
  // const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan (0-11) + 1, tambahkan leading zero
  // const day = String(today.getDate()).padStart(2, '0'); // Tanggal, tambahkan leading zero
  // const formattedToday = `${year}-${month}-${day}`;
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
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
      const note = row.querySelector('input[name="noteDataBody[]"]').value;
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
  const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
  const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
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
  $.extend(language_Header, employeeID_Header, usernname_Header, companyCode_Header, worksiteCode_Header, partners_Header, orderDate_Header, deliveryDate_Header, note_Header, currency_Header, exchangeRate_Header, purchaseRequest_Header, termOfPayment_Header, receivingLocations_Header, subtotal_Header, diskonNominal_Header, shipping_Header, ppnNominal_Header, grandTotal_Header, { detail });
  dataPurchaseRequesQuotation.push(language_Header)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequestquotation/insert";
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