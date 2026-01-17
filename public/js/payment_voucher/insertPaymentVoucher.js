async function insertPaymentVoucher() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"]
  const employeeID = dataLogin["idEmployee"]
  const typeVoucher = document.getElementById("typeVoucherHeader").value
  const noTransaction = document.getElementById("noTransactionHeader").value
  const noInvoice = document.getElementById("noInvoiceHeader").value
  const company = document.getElementById("companyHeader").value
  const location = document.getElementById("locationHeader").value
  const receivedDate = document.getElementById("receivedDateHeader").value
  const partner = document.getElementById("partnerHeader").value
  const currency = document.getElementById("currencyHeader").value
  const currencyRate = document.getElementById("currencyRateHeader").value
  const dueDate = document.getElementById("dueDateHeader").value
  const taxInvoiceNumber = document.getElementById("taxInvoiceNumberHeader").value
  const taxInvoiceDateValue = document.getElementById("taxInvoiceDateHeader").value;
  const taxInvoiceDate = taxInvoiceDateValue ? yyyymmdd(taxInvoiceDateValue) : null;
  const invoiceAmount = document.getElementById("invoiceAmountHeader").value
  const note = document.getElementById("noteHeader").value
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formHeaderPaymentVoucher").validate({
            ignore: [],
            rules: {
              "typeVoucherHeader": { required: !0 },
              "noInvoiceHeader": { required: !0 },
              "companyHeader": { required: !0 },
              "partnerHeader": { required: !0 },
              "receivedDateHeader": { required: !0 },
              "currencyHeader": { required: !0 },
              "currencyRateHeader": { required: !0 },
              "dueDateHeader": { required: !0 },
              "invoiceAmountHeader": { required: !0 },
            },
            messages: {
              "typeVoucherHeader": required,
              "noInvoiceHeader": required,
              "companyHeader": required,
              "partnerHeader": required,
              "receivedDateHeader": required,
              "currencyHeader": required,
              "currencyRateHeader": required,
              "dueDateHeader": required,
              "invoiceAmountHeader": required,
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
  const form = jQuery("#formHeaderPaymentVoucher");
  const isValid = form.valid();
  if (!isValid) {
    return false;
  }
  var dataPaymentVoucher = [];
  var detail = [];
  var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
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
  for (var i = 0; i < rows.length; i++) {
    var amount = unformatRupiah(rows[i].cells[3].innerText);
    var codeCoa = rows[i].cells[5].innerText;
    var codeAsset = rows[i].cells[6].innerText;
    var department = rows[i].cells[7].innerText;
    if (!codeCoa || !department || isNaN(amount) || amount <= 0) {
      Dashmix.helpers("jq-notify", {
        z_index: 2000,
        type: "danger",
        icon: "fa fa-times me-1",
        message: no_fields,
      });
      rows[i].style.backgroundColor = "#ffe6e6";
      return false;
    }
    detail.push({
      amount_POST: amount,
      code_coa_POST: codeCoa,
      code_asset_POST: codeAsset,
      department_POST: department,
    });
  }
  const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
  const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
  const employeeID_Header = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
  const typeVoucher_Header = JSON.parse('{"type_voucher_POST":"' + typeVoucher + '"}')
  const noTransaction_Header = JSON.parse('{"no_transaction_POST":"' + noTransaction + '"}')
  const noInvoice_Header = JSON.parse('{"no_invoice_POST":"' + noInvoice + '"}')
  const companyCode_Header = JSON.parse('{"company_code_POST":"' + company + '"}')
  const worksiteCode_Header = JSON.parse('{"worksite_code_POST":"' + location + '"}')
  const receivedDate_Header = JSON.parse('{"receive_date_POST":"' + yyyymmdd(receivedDate) + '"}')
  const partners_Header = JSON.parse('{"partners_POST":"' + partner + '"}')
  const currency_Header = JSON.parse('{"currency_POST":"' + currency + '"}')
  const currencyRate_Header = JSON.parse('{"currency_rate_POST":"' + currencyRate + '"}')
  const dueDate_Header = JSON.parse('{"due_date_POST":"' + yyyymmdd(dueDate) + '"}')
  const taxInvoiceNumber_Header = JSON.parse('{"tax_invoice_number_POST":"' + taxInvoiceNumber + '"}')
  const taxInvoiceDate_Header = JSON.parse(`{"tax_invoice_date_POST":${JSON.stringify(taxInvoiceDate ?? null)}}`);
  const invoiceAmount_Header = JSON.parse('{"invoice_amount_POST":"' + unformatRupiah(invoiceAmount) + '"}')
  const note_Header = JSON.parse('{"note_POST":"' + note + '"}')
  $.extend(language_Header, employeeID_Header, usernname_Header, companyCode_Header, worksiteCode_Header, partners_Header, typeVoucher_Header, noTransaction_Header, note_Header, currency_Header, noInvoice_Header, receivedDate_Header, currencyRate_Header, dueDate_Header, taxInvoiceNumber_Header, taxInvoiceDate_Header, invoiceAmount_Header, { detail });
  dataPaymentVoucher.push(language_Header)
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "paymentvoucher/insert";
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
  var data = JSON.stringify(dataPaymentVoucher);
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
          window.location.href = "/payment_voucher";
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
          window.location.href = "/payment_voucher";
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