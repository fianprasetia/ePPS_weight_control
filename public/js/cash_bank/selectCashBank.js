selectContent();
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    await showLayoutListData()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["cash_bank"]
        document.getElementById("titleModal").innerHTML = content["cash_bank"]
        document.getElementById("titleContent").innerHTML = content["cash_bank"]
        document.getElementById("companyHeaderLabel").innerHTML = content["company"] + "<span class='text-danger'>*</span>";
        document.getElementById("worksiteHeaderLabel").innerHTML = content["worksite"] + "<span class='text-danger'>*</span>";
        document.getElementById("codecoaHeaderLabel").innerHTML = content["coa_code"] + "<span class='text-danger'>*</span>";
        document.getElementById("sourceOfFundsLabel").innerHTML = content["source_of_funds"];
        document.getElementById("createDateHeaderLabel").innerHTML = content["date_create"] + "<span class='text-danger'>*</span>";
        document.getElementById("tipeHeaderLabel").innerHTML = content["transaction_type"] + "<span class='text-danger'>*</span>";
        document.getElementById("paidToHeaderLabel").innerHTML = content["paid_to"] + "<span class='text-danger'>*</span>";
        document.getElementById("currencyHeaderLabel").innerHTML = content["currency"] + "<span class='text-danger'>*</span>";
        document.getElementById("currencyRateHeaderLabel").innerHTML = content["exchange_rate"] + "<span class='text-danger'>*</span>";
        document.getElementById("paymentHeaderLabel").innerHTML = content["payment_method"] + "<span class='text-danger'>*</span>";
        document.getElementById("invoiceAmountHeaderLabel").innerHTML = content["invoice_amount"] + "<span class='text-danger'>*</span>";
        document.getElementById("noteHeaderLabel").innerHTML = content["note"] + "<span class='text-danger'>*</span>";
        document.getElementById("noTransactionDetailLabel").innerHTML = content["transaction_number"] + "<span class='text-danger'>*</span>";
        document.getElementById("codecoaDetailLabel").innerHTML = content["coa_code"] + "<span class='text-danger'>*</span>";
        document.getElementById("partnerDetailLabel").innerHTML = content["partners"] + "<span class='text-danger'>*</span>";
        document.getElementById("employeeDetailLabel").innerHTML = content["employee_id"] + "<span class='text-danger'>*</span>";
        document.getElementById("noteDetailLabel").innerHTML = content["note"] + "<span class='text-danger'>*</span>";
        document.getElementById("invoiceAmountDetailLabel").innerHTML = content["invoice_amount"] + "<span class='text-danger'>*</span>";
        document.getElementById("notransactionThead").innerHTML = content["transaction_number"];
        document.getElementById("codeCoaThead").innerHTML = content["coa_code"];
        document.getElementById("partnerThead").innerHTML = content["partners"];
        document.getElementById("employeeThead").innerHTML = content["employee_id"];
        document.getElementById("noteThead").innerHTML = content["note"];
        document.getElementById("nominalThead").innerHTML = content["invoice_amount"];
        document.getElementById("cashBankTable").innerHTML = content["cash_bank"];
        document.getElementById("worksiteTable").innerHTML = content["worksite"];
        document.getElementById("dateCreateTable").innerHTML = content["date_create"];
        document.getElementById("typeTable").innerHTML = content["type"];
        document.getElementById("nominalTable").innerHTML = content["invoice_amount"];
        document.getElementById("paymentMethodTable").innerHTML = content["payment_method"];
        document.getElementById("createByTable").innerHTML = content["create_by"];
        document.getElementById("updateByTable").innerHTML = content["updated_by"];
        document.getElementById("updateByTable").innerHTML = content["updated_by"];
        document.getElementById("statusTable").innerHTML = content["status"];
        document.getElementById("actionTable").innerHTML = content["actions"];
        document.getElementById("subtotalFoot").innerHTML = content["subtotal"];
    }
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertCashBank()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutCreateData() {
    showSpinner()
    await Promise.all([
        selectCompany(),
        selectCOAHeader(),
        selectPaymentMethod(),
        selectCurrency(),
        selectWorksite(),
        selectCOADetail(),
        selectPartnersDetail(),
        selectEmployeeDetail(),
        setTimeout(() => {
            hideSpinner();
        }, 1000)
    ]);
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeader").reset()
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
    document.getElementById("typeHeader").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='in'>" + kapital(inn) + "</option><option value='out'>" + kapital(out) + "</option>"

}
async function showLayoutListData() {
    await selectCashBank()
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function showLayoutUpdateData(id) {
    showSpinner()
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeader").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    // await updateCheckGoodsIssue(id)
    await showUpdateCashBank(id)
    // Fungsi-fungsi tetap dijalankan setelah penambahan atau duplikat
    await Promise.all([
        selectCOADetail(),
        selectPartnersDetail(),
        selectEmployeeDetail(),
    ]);

    document.getElementById("formDetail").reset();
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function selectCashBank(startDateList, endDateList) {
    document.getElementById("dataTable").innerHTML = ""
    const lastDate = new Date();
    const getToday = new Date();
    lastDate.setDate(getToday.getDate() - 30);
    startDate = startDateList || lastDate.getFullYear() + "-" + (lastDate.getMonth() + 1).toString().padStart(2, "0") + "-" + lastDate.getDate().toString().padStart(2, "0");
    endDate = endDateList || getToday.getFullYear() + "-" + (getToday.getMonth() + 1).toString().padStart(2, "0") + "-" + getToday.getDate().toString().padStart(2, "0");
    document.getElementById("startDate").value = ddmmyyyy(startDate);
    document.getElementById("endDate").value = ddmmyyyy(endDate);
    let dataLogin = await JSON.parse(getCookie("dataLogin"));
    let dataCompany = await JSON.parse(getCookie("dataCompany"));
    let employeeCode = dataLogin["idEmployee"]
    let companyType = dataCompany[0]["code_company_type"]
    let companyCode = dataCompany[0]["code_company"]
    let parentCode = dataCompany[0]["parent_code"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "cashbank";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        start_date_POST: startDate,
        end_date_POST: endDate,
        employee_code_POST: employeeCode,
        company_code_POST: companyCode,
        parent_code_POST: parentCode,
        company_type_POST: companyType
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
                    const statusTemp = responseData[i]["status"];
                    const noCB = responseData[i]["code_cash_bank"];
                    const typeCB = responseData[i]["type_transactions"];
                    var statusCB = "";
                    if (statusTemp == 0) {
                        statusCB = request;
                        editCB = "<button title='posting' type='button' id='" + noCB + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingCB = "<button title='posting' type='button'  inout='" + typeCB + "' code='" + noCB + "' id='btn-" + no + "' onclick='showModalPostingCashBank(this)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                        deleteCB = "<button title='delete' type='button' id='" + noCB + "'  onclick='showModalDeleteCashBankByCode(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                        viewCB = ""
                    } else if (statusTemp == 1) {
                        statusCB = paid;
                        editCB = "";
                        postingCB = "";
                        deleteCB = "";
                        viewCB = "<button title='view' type='button' code ='" + noCB + "' id='btn-" + no + "'  onclick='selectCashBankByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["code_cash_bank"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["WorksiteCompany"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["date_create"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["type_transactions"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["amount"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["payment_method"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeCreate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeUpdate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + statusCB + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ editCB + viewCB + postingCB + deleteCB + "</div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                document.getElementById("loadsearch").innerHTML = "  \
                    <div>\
                        <span onclick='selectCashBankByDate()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                        </span>\
                    <div>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message,
                });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                document.getElementById("dataTable").innerHTML = ""
                await table();
                document.getElementById("loadsearch").innerHTML = "  \
                    <div>\
                        <span onclick='selectCashBankByDate()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                        </span>\
                    </div>"
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
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
async function selectCompany(companyCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/type"
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
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == companyCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != companyCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("companyHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectWorksite(Code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    const companyCode = companyType[0]["code_company"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/neraca"
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
        companyParent_POST: companyParent,
        companyType_POST: companyTypeCode,
        companyCode_POST: companyCode,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == Code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != Code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("worksiteHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectCOAHeader(codeCOA) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/cashbankheader"
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
        worksite_code_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_coa == codeCOA);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_coa != codeCOA);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_coa"] + "'>" + filternotSubData[i]["code_coa"] + " - " + kapital(filternotSubData[i]["fat_coa_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_coa"] + "'>" + filterSubData[0]["code_coa"] + " - " + kapital(filterSubData[0]["fat_coa_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("codecoaHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectPaymentMethod(selectedValue) {
    const responseValue = ["transfer", "cash", "giro", "cheque"];
    const responseData = [transfer, cash, giro, cheque]; // asumsikan ini variabel string dari terjemahan atau kapitalisasi

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("paymentHeader").innerHTML = mainOptionItem + subOptionItem;
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
        document.getElementById("currencyHeader").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectBankAccount(code, company, coa) {
    const companyCode = document.getElementById("companyHeader").value || company
    const codeCoa = document.getElementById("codecoaHeader").value || coa
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "bankaccount/bycompany";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        company_code_POST: companyCode,
        code_coa_POST: codeCoa,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var filterSubData = responseData.filter((filterSubData) => filterSubData.bank_account_number == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.bank_account_number != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["bank_account_number"] + "'>" + filternotSubData[i]["bank_account_number"] + " - " + kapital(filternotSubData[i]["bank"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["bank_account_number"] + ">" + filterSubData[0]["bank_account_number"] + " - " + kapital(filterSubData[0]["bank"]) + "</option>";
                }

                document.getElementById("sourceOfFundsHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message
                });
                // setTimeout(function () {
                //     window.location.href = "/payment_voucher";
                // }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
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
async function checkDate() {
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const date = yyyymmdd(document.getElementById("createDateHeader").value)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "accountingperiods/bycode";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        worksite_POST: worksite,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                const period = responseData[0]["period"]
                const yearAndMonth = date.split("-").slice(0, 2).join("-");
                if (yearAndMonth < period) {
                    Dashmix.helpers("jq-notify", {
                        type: "danger", z_index: 2000, message: out_of_period
                    });
                    document.getElementById("createDateHeader").value = ""
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
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
async function showModalPaymentVoucher(id) {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation");
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
                });

                jQuery(".js-select2").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
                jQuery(".js-flatpickr").on("change", e => {
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
    const formElements = document.querySelectorAll('#formHeader input, #formHeader select, #formHeader textarea, #formHeader button');

    formElements.forEach(el => {
        // Kecualikan elemen dengan id 'noteHeader'
        if (el.id !== 'noteHeader') {
            el.disabled = true;
        }
    });
    const language = await JSON.parse(getCookie("language"));
    const pph = id.getAttribute('pph');
    const worksite = document.getElementById("worksiteHeader").value
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalCashBank"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalCashBank"), { keyboard: false });
        myModal.toggle();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "paymentvoucher/bycashbank"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: overload, });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        worksite_POST: worksite,
        pph_POST: pph
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] === "success") {
                const responseData = response["data"];
                let dataTable = `
                                <table id="paymentVoucherTable" class="js-table-checkable table table-hover table-vcenter" style="width:120%;">
                                    <thead>
                                        <tr>
                                            <th class="text-center text-uppercase">${transaction_number}</th>
                                            <th class="text-center text-uppercase">${coa_code}</th>
                                            <th class="text-center text-uppercase">${partners}</th>
                                            <th class="text-center text-uppercase">${amount}</th>
                                            <th class="text-center text-uppercase">${note}</th>
                                        </tr>
                                    </thead>
                                    <tbody id="dataTableItemData">`;
                responseData.forEach(item => {
                    const details = item.details;
                    const totalAmount = details.reduce((sum, d) => sum + d.amount, 0);
                    if (pph == 1) {
                        details.forEach(detail => {
                            dataTable += `
                                    <tr id='doneBtn' pph=${pph} onclick="selectPaymentVoucher(this)">
                                        <td class="fw-light text-center text-uppercase">${item.code_payment_voucher}</td>
                                        <td class="fw-light text-center text-uppercase">${detail.code_coa}</td>
                                        <td class="fw-light text-center text-uppercase">${item.log_partner.name}</td>
                                        <td class="fw-light text-center text-uppercase">${formatRupiah(detail.amount)}</td>
                                        <td class="fw-light text-center text-uppercase">pph ${item.note || ""}</td>
                                        <td hidden class="fw-light text-center text-uppercase">${item.log_partner.code_partners}</td>
                                    </tr>`;
                        });
                    } else if (pph == 0) {
                        const coa = item.log_partner.log_partners_type.code_coa;
                        dataTable += `
                                <tr id='doneBtn' pph=${pph} onclick="selectPaymentVoucher(this)">
                                    <td class="fw-light text-center text-uppercase">${item.code_payment_voucher}</td>
                                    <td class="fw-light text-center text-uppercase">${coa}</td>
                                    <td class="fw-light text-center text-uppercase">${item.log_partner.name}</td>
                                    <td class="fw-light text-center text-uppercase">${formatRupiah(totalAmount + item.invoice_amount)}</td>
                                    <td class="fw-light text-center text-uppercase">${item.note || ""}</td>
                                    <td hidden class="fw-light text-center text-uppercase">${item.log_partner.code_partners}</td>
                                </tr>`;
                    } else if (pph == 2) {
                        const coa = item.log_partner.log_partners_type.code_coa;
                        dataTable += `
                                <tr id='doneBtn' pph=${pph} onclick="selectPaymentVoucher(this)">
                                    <td class="fw-light text-center text-uppercase">${item.code_payment_voucher}</td>
                                    <td class="fw-light text-center text-uppercase">${coa}</td>
                                    <td class="fw-light text-center text-uppercase">${item.log_partner.name}</td>
                                    <td class="fw-light text-center text-uppercase">${formatRupiah(totalAmount)}</td>
                                    <td class="fw-light text-center text-uppercase">${item.note || ""}</td>
                                    <td hidden class="fw-light text-center text-uppercase">${item.log_partner.code_partners}</td>
                                </tr>`;
                    }
                });
                dataTable += `
            </tbody>
        </table>`;
                document.getElementById("dataTablePaymentVoucher").innerHTML = dataTable;
                document.getElementById("loadModalCashBank").innerHTML = `<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>${kapital(cancel)}</a>`;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                document.getElementById("loadModalCashBank").innerHTML = `<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>${kapital(cancel)}</a>`;
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function selectCOADetail(codeCOA) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/level5"
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
        worksite_code_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_coa == codeCOA);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_coa != codeCOA);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_coa"] + "'>" + filternotSubData[i]["code_coa"] + " - " + kapital(filternotSubData[i]["fat_coa_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_coa"] + "'>" + filterSubData[0]["code_coa"] + " - " + kapital(filterSubData[0]["fat_coa_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("codecoaDetail").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectPartnersDetail(code) {
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
            message:overload
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
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_partners"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_partners"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("partnerDetail").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message
                });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
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
async function selectEmployeeDetail(employeeID) {
    const language = await JSON.parse(getCookie("language"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyCode = companyType[0]["code_company"]
    const companyParent = companyType[0]["parent_code"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/worksite"
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
        companyType_POST: companyTypeCode,
        companyCode_POST: companyCode,
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == employeeID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != employeeID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' worksite=" + filternotSubData[i]["worksite"] + " value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"] + " (" + filternotSubData[i]["worksite"] + ")") +
                        "</option>";
                }
                if (employeeID == "" || employeeID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase'  worksite=" + filterSubData[0]["worksite"] + "  value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"] + " (" + filterSubData[0]["worksite"] + ")") + "</option>";
                }

                document.getElementById("employeeDetail").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
async function selectPaymentVoucher(id) {
    const pphValue = id.getAttribute('pph');

    const cells = id.querySelectorAll('td');
    const noTransaction = cells[0].textContent;
    const coa = cells[1].textContent;
    const amount = cells[3].textContent;
    const note = cells[4].textContent;
    const codepartner = cells[5].textContent;
    await selectPartnersDetail(codepartner)
    await selectCOADetail(coa)
    document.getElementById("invoiceAmountDetail").value = amount
    document.getElementById("noteDetail").value = note
    document.getElementById("noTransactionDetail").value = noTransaction
    document.getElementById("pphDetail").value = pphValue
    await closeModal()
}
async function selectItemTransactions() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation");
                jQuery("#formDetail").validate({
                    ignore: [],
                    rules: {
                        "noTransactionDetail": { required: !0 },
                        "codecoaDetail": { required: !0 },
                        "invoiceAmountDetail": { required: !0 },
                        "noteDetail": { required: !0 }
                    },
                    messages: {
                        "noTransactionDetail": required,
                        "codecoaDetail": required,
                        "invoiceAmountDetail": required,
                        "noteDetail": required
                    }
                });

                jQuery(".js-select2").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
                jQuery(".js-flatpickr").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
            }
            static init() {
                this.initValidation();
            }
        }
        Dashmix.onLoad(() => e.init());
    })();

    const form = jQuery("#formDetail");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }

    const pph = document.getElementById("pphDetail").value;
    const notransaction = document.getElementById("noTransactionDetail").value;
    const codecoa = document.getElementById("codecoaDetail").value;
    var elementcodecoa = document.querySelector("#codecoaDetail")
    const coa = (elementcodecoa.options[elementcodecoa.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementcodecoa.options[elementcodecoa.selectedIndex].innerHTML
    const codePartner = document.getElementById("partnerDetail").value;
    var elementPartner = document.querySelector("#partnerDetail")
    const partner = (elementPartner.options[elementPartner.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementPartner.options[elementPartner.selectedIndex].innerHTML
    var elementEmployee = document.querySelector("#employeeDetail")
    const employee = (elementEmployee.options[elementEmployee.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementEmployee.options[elementEmployee.selectedIndex].innerHTML;
    const codeEmployee = document.getElementById("employeeDetail").value;
    const note = document.getElementById("noteDetail").value;
    const invoiceAmount = document.getElementById("invoiceAmountDetail").value;


    let isDuplicate = false;

    // Cek duplikat berdasarkan notransaction
    const existingRows = document.querySelectorAll("#dataTableItem tr");
    for (let row of existingRows) {
        const cell = row.cells[1]; // kolom notransaction
        if (cell && cell.textContent.trim() === notransaction) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: duplicate.replace("{{duplicate}}", `${transaction_number}`) });
    } else {
        const index = existingRows.length;
        addRowItemTransaction(
            index,
            notransaction,
            coa,
            partner,
            employee,
            note,
            invoiceAmount,
            codecoa,
            codePartner,
            codeEmployee
        );
    }

    // Fungsi-fungsi tetap dijalankan setelah penambahan atau duplikat
    await updateSubTotal(pph);
    await selectCOADetail();
    await selectPartnersDetail();
    await selectEmployeeDetail();
    document.getElementById("formDetail").reset();
}
async function addRowItemTransaction(
    index,
    notransaction,
    coa,
    partner,
    employee,
    note,
    invoiceAmount,
    codecoa,
    codePartner,
    codeEmployee
) {
    const table = document.getElementById("dataTableItem")
    const row = table.insertRow();
    row.id = "row" + index;

    const cellremove = row.insertCell(0);
    cellremove.innerHTML = `
    <button type="button" class="btn btn-danger" id="${index}" onclick="deleteRow('${row.id}')">
      <i class="fa-regular fa-trash-can"></i>
    </button>`;
    cellremove.className = "text-center";

    const cellnotransaction = row.insertCell(1);
    cellnotransaction.innerHTML = notransaction;
    cellnotransaction.className = "text-center fw-light";

    const cellcoa = row.insertCell(2);
    cellcoa.innerHTML = coa;
    cellcoa.className = "text-center fw-light text-uppercase";

    const cellpartner = row.insertCell(3);
    cellpartner.innerHTML = partner;
    cellpartner.className = "text-center fw-light text-uppercase";

    const cellemployee = row.insertCell(4);
    cellemployee.innerHTML = employee;
    cellemployee.className = "text-center fw-light text-uppercase";

    const cellnote = row.insertCell(5);
    cellnote.innerHTML = note;
    cellnote.className = "text-center fw-light text-uppercase";

    const cellinvoiceAmount = row.insertCell(6);
    cellinvoiceAmount.innerHTML = invoiceAmount;
    cellinvoiceAmount.className = "text-end fw-light text-uppercase nominal-cell";

    const cellcodepartner = row.insertCell(7);
    cellcodepartner.innerHTML = codePartner;
    cellcodepartner.hidden = true;

    const cellcodeEmployee = row.insertCell(8);
    cellcodeEmployee.innerHTML = codeEmployee;
    cellcodeEmployee.hidden = true;

    const cellcodecoa = row.insertCell(9);
    cellcodecoa.innerHTML = codecoa;
    cellcodecoa.hidden = true;

    await updateSubTotal();
}
async function updateSubTotal(pph) {
    let total = 0;
    const nominalCells = document.querySelectorAll("#dataTableItem td.nominal-cell");

    nominalCells.forEach(cell => {
        const value = unformatRupiah(cell.textContent) || 0;
        total += value;
    });
    document.getElementById("subTotalFootSum").textContent = formatRupiah(total);
    document.getElementById("invoiceAmountHeader").value = formatRupiah(total);
}
async function selectCashBankByCode(button) {
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
    var url = mainUrl + "cashbank/bycode";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_cash_bank_POST: codeValue,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                if (responseData[0]["type_transactions"] === "out") {
                    await pdfOut(responseData, button)
                } else {
                    await pdfIn(responseData, button)
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
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
async function pdfOut(responseData, button) {
    //   jmlData = responseData["dataSignature"].length
    //   var dataSign = []
    //   for (var i = 0; i < jmlData; i++) {
    //     var sign = responseData["dataSignature"][i]["photo"]
    //     dataSign.push({ image: sign, });
    //   }
    const dataResponsePaymentVoucher = JSON.stringify(responseData[0]);
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "paymentvoucher";
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
    const dataPaymentVoucherPdf = [];
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const dataPaymentVouhcer = JSON.parse(`{"payment_voucher_POST": ${dataResponsePaymentVoucher}}`);
    $.extend(languageMenu, dataPaymentVouhcer);
    dataPaymentVoucherPdf.push(languageMenu)
    var data = JSON.stringify(
        {
            dataPaymentVoucherPdf
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                console.log(responseData)
                setTimeout(async function () {
                    const fileUrl = `file/payment_voucher/${responseData}`;
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
async function selectCashBankByDate() {
    const startDate = yyyymmdd(document.getElementById("startDate").value)
    const endDate = yyyymmdd(document.getElementById("endDate").value)
    document.getElementById("loadsearch").disabled = true
    document.getElementById("loadsearch").innerHTML =
        "<div>\
            <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
            </span>\
          <div>";
    await selectCashBank(startDate, endDate)
}