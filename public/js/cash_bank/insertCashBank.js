async function insertCashBank() {
    const company = document.getElementById("companyHeader").value
    const worksite = document.getElementById("worksiteHeader").value
    const codecoa = document.getElementById("codecoaHeader").value
    const sourceOfFunds = document.getElementById("sourceOfFundsHeader").value
    const createDate = document.getElementById("createDateHeader").value
    const type = document.getElementById("typeHeader").value
    const paidTo = document.getElementById("paidToHeader").value
    const currency = document.getElementById("currencyHeader").value
    const currencyRate = document.getElementById("currencyRateHeader").value
    const payment = document.getElementById("paymentHeader").value
    const invoiceAmount = document.getElementById("invoiceAmountHeader").value
    const note = document.getElementById("noteHeader").value
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeader").validate({
                        ignore: [],
                        rules: {
                            "companyHeader": { required: !0 },
                            "worksiteHeader": { required: !0 },
                            "codecoaHeader": { required: !0 },
                            "createDateHeader": { required: !0 },
                            "typeHeader": { required: !0 },
                            "paidToHeader": { required: !0 },
                            "currencyHeader": { required: !0 },
                            "paymentHeader": { required: !0 },
                            "invoiceAmountHeader": { required: !0 },
                            "noteHeader": { required: !0 },
                            "createDateHeader": { required: !0 },
                        },
                        messages: {
                            "companyHeader": required,
                            "worksiteHeader": required,
                            "codecoaHeader": required,
                            "createDateHeader": required,
                            "typeHeader": required,
                            "paidToHeader": required,
                            "currencyHeader": required,
                            "paymentHeader": required,
                            "invoiceAmountHeader": required,
                            "noteHeader": required,
                            "createDateHeader": required,
                        }
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
    const form = jQuery("#formHeader");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    var dataCashBank = [];
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
        var cellnotransaction = rows[i].cells[1].innerText;
        var cellnote = rows[i].cells[5].innerText;
        var cellinvoiceAmount = unformatRupiah(rows[i].cells[6].innerText);
        var cellcodepartner = rows[i].cells[7].innerText;
        var cellcodeEmployee = rows[i].cells[8].innerText;
        var cellcodecoa = rows[i].cells[9].innerText;
        if (!cellnotransaction || !cellnote || !cellcodecoa || isNaN(cellinvoiceAmount) || cellinvoiceAmount <= 0) {
            Dashmix.helpers("jq-notify", {
                z_index: 2000,
                type: "danger",
                 message: no_fields.replace("{{fields}}", `${coa_code,note_Header}`),
            });
            rows[i].style.backgroundColor = "#ffe6e6";
            return false;
        }
        detail.push({
            no_transaction_POST: cellnotransaction,
            note_POST: cellnote,
            invoice_amount_POST: cellinvoiceAmount,
            code_partner_POST: cellcodepartner || null,
            code_employee_POST: cellcodeEmployee || null,
            code_coa_POST: cellcodecoa,
        });
    }
    const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
    const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
    const employeeID_Header = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
    const companyCode_Header = JSON.parse('{"company_code_POST":"' + company + '"}')
    const worksite_Header = JSON.parse('{"worksite_POST":"' + worksite + '"}')
    const codecoa_Header = JSON.parse('{"code_coa_POST":"' + codecoa + '"}')
    const sourceOfFunds_Header = JSON.parse('{"source_of_funds_POST":"' + sourceOfFunds + '"}')
    const createDate_Header = JSON.parse('{"create_date_POST":"' + yyyymmdd(createDate) + '"}')
    const type_Header = JSON.parse('{"type_POST":"' + type + '"}')
    const paidTo_Header = JSON.parse('{"paid_to_POST":"' + paidTo + '"}')
    const currency_Header = JSON.parse('{"currency_POST":"' + currency + '"}')
    const currencyRate_Header = JSON.parse('{"currency_rate_POST":"' + currencyRate + '"}')
    const payment_Header = JSON.parse('{"payment_method_POST":"' + payment + '"}')
    const invoiceAmount_Header = JSON.parse('{"invoice_amount_POST":"' + unformatRupiah(invoiceAmount) + '"}')
    const note_Header = JSON.parse('{"note_POST":"' + note + '"}')
    $.extend(language_Header, employeeID_Header, usernname_Header, companyCode_Header, worksite_Header, codecoa_Header, sourceOfFunds_Header, createDate_Header, note_Header, currency_Header, type_Header, paidTo_Header, currencyRate_Header, payment_Header, invoiceAmount_Header, { detail });
    dataCashBank.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "cashbank/insert";
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
    var data = JSON.stringify(dataCashBank);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
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