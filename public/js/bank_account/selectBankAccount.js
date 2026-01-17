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
    await selectBankAccount()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["bank_account"];
        document.getElementById("titleModal").innerHTML = content["bank_account"];
        document.getElementById("companyThead").innerHTML = content["company"];
        document.getElementById("accountNumberThead").innerHTML = content["bank_account_number"];
        document.getElementById("nameBankThead").innerHTML = content["bank_name"];
        document.getElementById("currenciesThead").innerHTML = content["currency"];
        document.getElementById("statusThead").innerHTML = content["status"];
        document.getElementById("actionsThead").innerHTML = content["actions"];
        document.getElementById("companyModalLabel").innerHTML = content["company"] + "<span class='text-danger'>*</span>";
        document.getElementById("codeCOAModalLabel").innerHTML = content["master_coa"] + "<span class='text-danger'>*</span>";
        document.getElementById("accountNumberModalLabel").innerHTML = content["bank_account_number"] + "<span class='text-danger'>*</span>";
        document.getElementById("nameBankModalLabel").innerHTML = content["bank_name"] + "<span class='text-danger'>*</span>";
        document.getElementById("currencyModalLabel").innerHTML = content["currency"] + "<span class='text-danger'>*</span>";
        document.getElementById("branchModalLabel").innerHTML = content["branch"];
        document.getElementById("statusModalLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>";
    }
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
    var url = mainUrl + "company/company"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
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
                document.getElementById("companyModal").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/bank_account";
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
async function selectCOA(codeCOA) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/bankaccount"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
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
                document.getElementById("codeCOAModal").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/bank_account";
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
        document.getElementById("currencyModal").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectBank(code) {
    const dataCurrency = "file/bank.json";
    fetch(dataCurrency)
        .then((response) => response.json())
        .then((dataCurrency) => dataContent(dataCurrency));
    function dataContent(dataCurrency) {
        var responseData = dataCurrency;
        var filterSubData = responseData.filter(
            (filterSubData) => filterSubData.name_bank == code
        );
        var filternotSubData = responseData.filter(
            (filternotSubData) => filternotSubData.name_bank != code
        );
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["name_bank"] + "'>" + kapital(filternotSubData[i]["name_bank"]) + "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem +=
                "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem +=
                "<option class='fw-light text-uppercase' value=" + filterSubData[0]["name_bank"] + ">" + kapital(filterSubData[0]["name_bank"]) + "</option>";
        }
        document.getElementById("nameBankModal").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectBankAccount() {
    const lastDate = new Date();
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "bankaccount";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    edit = "<button title='posting' type='button' id='" + responseData[i]["bank_account_number"] + "' onclick='showModalUpdateBankAccount(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["bank_account_number"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["bank"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["currencies"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["status"] == 1 ? active : nonactive) + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ edit + "</div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000)
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