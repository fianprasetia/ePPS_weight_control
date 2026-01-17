async function showUpdateCashBank(code) {
    document.getElementById("dataTableItem").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "cashbank/bycode"
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
        code_cash_bank_POST: code,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            await resetDataTables()
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                await Promise.all([
                    selectCompany(responseData[0]["code_company"]),
                    selectCOAHeader(responseData[0]["code_coa"]),
                    selectPaymentMethod(responseData[0]["payment_method"]),
                    selectCurrency(responseData[0]["currency"]),
                    selectWorksite(responseData[0]["worksite"]),
                    selectBankAccount(responseData[0]["bank_account_number"], responseData[0]["code_company"], responseData[0]["code_coa"])
                ]);
                document.getElementById("createDateHeader").value = ddmmyyyy(responseData[0]["date_create"]) || "";
                document.getElementById("paidToHeader").value = kapital(responseData[0]["paid_to"]) || "";
                document.getElementById("currencyRateHeader").value = formatRupiah(responseData[0]["exchange_rate"]) || "";
                document.getElementById("invoiceAmountHeader").value = formatRupiah(responseData[0]["amount"]) || "";
                document.getElementById("noteHeader").value = kapital(responseData[0]["note"]) || "";
                const type = responseData[0]["type_transactions"] || "";
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + type + ">" + (type == "out" ? kapital(out) : kapital(inn)) + "</option>";
                optionStatus = "<option class='fw-light text-uppercase' value='" + (type === "out" ? "in" : "out") + "'>" + (type === "out" ? kapital(inn) : kapital(out)) + "</option>";
                document.getElementById("typeHeader").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";
                dataDetail = responseData[0]["details"];
                dataDetail.forEach((data, idx) => {
                    let uniqueIndex = data.id * 111;
                    const coaTranslation = data.fat_coa?.fat_coa_translations?.[0]?.translation || data.fat_coa.descriptions_coa;
                    const partnerTranslation = data.log_partner?.name || '';
                    const employeeTranslation = data.hrd_employee?.fullname || '';
                    addRowItemTransaction(
                        uniqueIndex,
                        data.code_transactions,
                        coaTranslation,
                        partnerTranslation,
                        employeeTranslation,
                        data.note || "",
                        formatRupiah(data.amount),
                        data.code_coa,
                        data.code_partners || "",
                        data.employee_id || ""
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
                    window.location.href = "/cash_bank";
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
    const code = id.getAttribute('code');
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
                 message: no_fields.replace("{{fields}}", `${coa_code, note_Header}`),
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
    const cashBankCode_Header = JSON.parse('{"code_cash_bank_POST":"' + code + '"}')
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
    $.extend(language_Header, employeeID_Header, usernname_Header, cashBankCode_Header, companyCode_Header, worksite_Header, codecoa_Header, sourceOfFunds_Header, createDate_Header, note_Header, currency_Header, type_Header, paidTo_Header, currencyRate_Header, payment_Header, invoiceAmount_Header, { detail });
    dataCashBank.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "cashbank/update";
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
async function showModalPostingCashBank(id) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    const code = id.getAttribute('code');
    const inout = id.getAttribute('inout');
    document.getElementById("loadNotice").innerHTML = "<a code='" + code + "' inout='" + inout + "' type='submit' onclick='postingCashBank(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function postingCashBank(id) {
    const code = id.getAttribute('code');
    const inout = id.getAttribute('inout');
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const employeeID = dataLogin["idEmployee"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var urlPosting = ""
    if (inout === "out") {
        urlPosting = mainUrl + "cashbank/postingout"
    } else {
        urlPosting = mainUrl + "cashbank/postingin"

    }
    var xhr = new XMLHttpRequest();
    var url = urlPosting
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
        code_cash_bank_POST: code,
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
                    window.location.href = "/cash_bank";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
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