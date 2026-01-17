async function showUpdatePaymentVoucher(code) {
    document.getElementById("dataTableItem").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "paymentvoucher/bycode"
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
        code_payment_voucher_POST: code,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            await resetDataTables()
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                await Promise.all([
                    selectVoucherType(responseData[0]["code_payment_voucher_type"]),
                    selectVoucher(responseData[0]["code_payment_voucher_type"]),
                    selectCompany(responseData[0]["code_company"]),
                    selectLocation(responseData[0]["worksite"]),
                    SelectPartners(responseData[0]["code_partners"]),
                    selectCurrency(responseData[0]["currency"]),
                ]);
                document.getElementById("noTransactionHeader").value = responseData[0]["no_transaction"] || "";
                document.getElementById("noInvoiceHeader").value = responseData[0]["no_invoice"] || "";
                document.getElementById("receivedDateHeader").value = ddmmyyyy(responseData[0]["date_create"]) || "";
                document.getElementById("currencyRateHeader").value = responseData[0]["exchange_rate"] || "";
                document.getElementById("dueDateHeader").value = ddmmyyyy(responseData[0]["due_date"]) || "";
                document.getElementById("taxInvoiceNumberHeader").value = responseData[0]["tax_invoice_number"] || "";
                document.getElementById("taxInvoiceDateHeader").value = responseData[0]["tax_invoice_date"] ? ddmmyyyy(responseData[0]["tax_invoice_date"]) : "";
                document.getElementById("invoiceAmountHeader").value = formatRupiah(responseData[0]["invoice_amount"]) || "";
                document.getElementById("noteHeader").value = responseData[0]["note"] || "";
                dataDetail = responseData[0]["details"];
                dataDetail.forEach((data, idx) => {
                    let uniqueIndex = data.id * 111;
                    const coaTranslation = data.fat_coa?.fat_coa_translations?.[0]?.translation || data.fat_coa.descriptions_coa;
                    const deptTranslation = data.department?.hrd_department_translations?.[0]?.translation || data.department.description;
                    addRowItemTransaction(
                        uniqueIndex,
                        coaTranslation,
                        data.asset_code || "",
                        deptTranslation,
                        formatRupiah(data.amount),
                        data.code_coa,
                        data.asset_code || "",
                        data.department_code
                    );
                });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                await table();
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + code + "' onclick='updatePaymentVoucher(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
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
async function updatePaymentVoucher(id) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const code = id.getAttribute('code');
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
    const taxInvoiceDateValue = document.getElementById("taxInvoiceDateHeader").value
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
            message:no_item,
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
                 message: no_fields,
            });
            rows[i].style.backgroundColor = "#ffe6e6";
            return false;
        }
        detail.push({
            amount_POST: unformatRupiah(amount),
            code_coa_POST: codeCoa,
            code_asset_POST: codeAsset,
            department_POST: department,
        });
    }
    const codePaymentVoucher_Header = JSON.parse('{"code_payment_voucher_POST":"' + code + '"}')
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
    $.extend(language_Header, codePaymentVoucher_Header, employeeID_Header, usernname_Header, companyCode_Header, worksiteCode_Header, partners_Header, typeVoucher_Header, noTransaction_Header, note_Header, currency_Header, noInvoice_Header, receivedDate_Header, currencyRate_Header, dueDate_Header, taxInvoiceNumber_Header, taxInvoiceDate_Header, invoiceAmount_Header, { detail });
    dataPaymentVoucher.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "paymentvoucher/update";
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
            message:overload,
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
async function showModalPostingPaymentVoucherByCode(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id ='" + param + "' type='submit' onclick='postingPaymentVoucher(id)' class='btn  btn-primary'>" + kapital(done) + "</a>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function postingPaymentVoucher(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const employeeID = dataLogin["idEmployee"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "paymentvoucher/posting"
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
        code_payment_voucher_POST: id,
        username_POST: username,
        employeeID_POST: employeeID
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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