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
        document.getElementById("titlePageff").innerHTML = content["payment_voucher"]
        document.getElementById("titleContent").innerHTML = content["payment_voucher"]
        document.getElementById("titlePO").innerHTML = content["payment_voucher"]
        document.getElementById("typeVoucherHeaderLabel").innerHTML = content["voucher_type"] + "<span class='text-danger'>*</span>";
        document.getElementById("noInvoiceHeaderLabel").innerHTML = content["no_invoice"] + "<span class='text-danger'>*</span>";
        document.getElementById("companyHeaderLabel").innerHTML = content["company"] + "<span class='text-danger'>*</span>";
        document.getElementById("locationHeaderLabel").innerHTML = content["worksite"];
        document.getElementById("receivedDateHeaderLabel").innerHTML = content["received_date"] + "<span class='text-danger'>*</span>";
        document.getElementById("noteHeaderLabel").innerHTML = content["note"];
        document.getElementById("noTransactionHeaderLabel").innerHTML = content["transaction_number"];
        document.getElementById("partnerHeaderLabel").innerHTML = content["partners"] + "<span class='text-danger'>*</span>";
        document.getElementById("currencyHeaderLabel").innerHTML = content["currency"] + "<span class='text-danger'>*</span>";
        document.getElementById("currencyRateHeaderLabel").innerHTML = content["exchange_rate"] + "<span class='text-danger'>*</span>";
        document.getElementById("dueDateHeaderLabel").innerHTML = content["due_date"] + "<span class='text-danger'>*</span>";
        document.getElementById("taxInvoiceNumberHeaderLabel").innerHTML = content["tax_invoice_number"];
        document.getElementById("taxInvoiceDateHeaderLabel").innerHTML = content["tax_invoice_date"];
        document.getElementById("invoiceAmountHeaderLabel").innerHTML = content["invoice_amount"] + "<span class='text-danger'>*</span>";
        document.getElementById("assetCodeDetailLabel").innerHTML = content["asset_code"];
        document.getElementById("assetCodeDetailTable").innerHTML = content["asset_code"];
        document.getElementById("ccodecoaDetailLabel").innerHTML = content["coa_code"] + "<span class='text-danger'>*</span>";
        document.getElementById("codeCoaDetailTable").innerHTML = content["coa_code"]
        document.getElementById("amountDetailLabel").innerHTML = content["amount"] + "<span class='text-danger'>*</span>";
        document.getElementById("amountDetailTable").innerHTML = content["amount"]
        document.getElementById("ndepartmentDetailLabel").innerHTML = content["department"] + "<span class='text-danger'>*</span>";
        document.getElementById("departmentDetailTable").innerHTML = content["department"]
        document.getElementById("noPVListData").innerHTML = content["payment_voucher"];
        document.getElementById("noInvoiceListData").innerHTML = content["invoice"];
        document.getElementById("workiteListData").innerHTML = content["worksite"];
        document.getElementById("dateListData").innerHTML = content["date"];
        document.getElementById("partnertListData").innerHTML = content["partners"];
        document.getElementById("createByListData").innerHTML = content["request"];
        document.getElementById("updateByData").innerHTML = content["update_by"];
        document.getElementById("statusListData").innerHTML = content["status"];
        document.getElementById("actionsListData").innerHTML = content["actions"];
        document.getElementById("searchPOLabel").innerHTML = content["purchase_order"];
    }
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertPaymentVoucher()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutUpdateData(id) {
    showSpinner()
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderPaymentVoucher").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    // await updateCheckGoodsIssue(id)
    await showUpdatePaymentVoucher(id)
    // Fungsi-fungsi tetap dijalankan setelah penambahan atau duplikat
    await Promise.all([
        selectCOA(),
        selectDepartment(),
        selectAsset()
    ]);

    document.getElementById("formadditemmaster").reset();
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData(id) {
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderPaymentVoucher").reset()
    await Promise.all([
        selectCompany(),
        selectLocation(),
        SelectPartners(),
        selectCurrency(),
        selectVoucherType(),
        selectCOA(),
        selectDepartment(),
        selectAsset()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;

}
async function showLayoutListData() {
    await selectPaymentVoucher();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
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
                    window.location.href = "/payment_voucher";
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
async function selectVoucherType(codeVoucherType) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "paymentvouchertype"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_payment_voucher_type == codeVoucherType);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_payment_voucher_type != codeVoucherType);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_payment_voucher_type"] + "'>" + kapital(filternotSubData[i]["translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_payment_voucher_type"] + "'>" + kapital(filterSubData[0]["translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("typeVoucherHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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
async function selectLocation(Code) {
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
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_company"] +
                        "'>" +
                        kapital(filternotSubData[i]["name"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("locationHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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

                document.getElementById("partnerHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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
    var url = mainUrl + "coa/paymentvoucher"
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
                document.getElementById('codeCoaDetail').innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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
async function selectDepartment(rowIndex, departmentCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "department/bylanguage"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.department_code == departmentCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.department_code != departmentCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["department_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_department_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["department_code"] + "'>" + kapital(filterSubData[0]["hrd_department_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById('departmentDetail').innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
async function selectAsset(code) {
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/byworksite"
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.asset_code == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.asset_code != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["asset_code"] + "'>" + filternotSubData[i]["asset_code"] + " - " + kapital(filternotSubData[i]["log_item_master"]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["asset_code"] + "'>" + filterSubData[0]["asset_code"] + " - " + kapital(filterSubData[0]["log_item_master"]["name"]) + "</option>";
                }
                document.getElementById('assetCodeDetail').innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
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
// var noRow = 1
// async function addDetail() {
//     var newid = noRow++;
//     await selectCOA(newid)
//     await selectDepartment(newid)
//     await selectAsset(newid)
//     $('#dataTableItem').append(`
//         <tr id="row${newid}">
//             <td class="text-center"><button type="button" class="btn btn-danger" id='${newid}' onclick="deleteRow(id)"> <i class="fa-regular fa-trash-can"></i></button></td>
//             <td><select class="js-select2 form-select fw-light text-uppercase" name="assetCodeDetail[]" id="assetCodeDetail${newid}" style="width: 100%"></select></td>
//             <td><select class="js-select2 form-select fw-light text-uppercase" name="codeCoaDetail[]" id="codeCoaDetail${newid}" style="width: 100%;"></select></td>
//             <td><input type="text" class="form-control text-end text-uppercase" onkeyup="typeformatRupiah(this);" onfocus="removeZero(this)"  value="0" id="amountDetail${newid}" name="amountDetail[]" /></td>
//             <td><select class="js-select2 form-select fw-light text-uppercase" name="departmentDetail[]" id="departmentDetail${newid}" style="width: 100%"></select></td>
//         </tr>`);
//     $(`#vehicleCodeDetail${newid}, #assetCodeDetail${newid}, #codeCoaDetail${newid}, #departmentDetail${newid}`).select2();
// }
async function selectItemTransactions() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation");
                jQuery("#formadditemmaster").validate({
                    ignore: [],
                    rules: {
                        "codeCoaDetail": { required: !0 },
                        "amountDetail": { required: !0 },
                        "departmentDetail": { required: !0 }
                    },
                    messages: {
                        "codeCoaDetail": required,
                        "amountDetail": required,
                        "departmentDetail": required
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

    const form = jQuery("#formadditemmaster");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }

    const codecoa = document.getElementById("codeCoaDetail").value;
    var elementCoa = document.querySelector("#codeCoaDetail")
    const coa = (elementCoa.options[elementCoa.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementCoa.options[elementCoa.selectedIndex].innerHTML

    const codeAsset = document.getElementById("assetCodeDetail").value;
    var elementAsset = document.querySelector("#assetCodeDetail")
    const asset = (elementAsset.options[elementAsset.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementAsset.options[elementAsset.selectedIndex].innerHTML

    const codeDepartment = document.getElementById("departmentDetail").value;
    var elementDepartment = document.querySelector("#departmentDetail")
    const department = (elementDepartment.options[elementDepartment.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementDepartment.options[elementDepartment.selectedIndex].innerHTML

    const amount = document.getElementById("amountDetail").value;


    let isDuplicate = false;

    // Cek duplikat berdasarkan notransaction
    const existingRows = document.querySelectorAll("#dataTableItem tr");
    for (let row of existingRows) {
        const cell = row.cells[2]; // kolom notransaction
        if (cell && cell.textContent.trim() === coa) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: duplicate.replace("{{duplicate}}", `${coa_code}`) });
    } else {
        const index = existingRows.length;
        addRowItemTransaction(
            index,
            coa,
            asset,
            department,
            amount,
            codecoa,
            codeAsset,
            codeDepartment
        );
    }

    // Fungsi-fungsi tetap dijalankan setelah penambahan atau duplikat
    await Promise.all([
        selectCOA(),
        selectDepartment(),
        selectAsset()
    ]);

    document.getElementById("formadditemmaster").reset();
}
async function addRowItemTransaction(
    index,
    coa,
    asset,
    department,
    amount,
    codecoa,
    codeAsset,
    codeDepartment,
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

    const cellasset = row.insertCell(1);
    cellasset.innerHTML = asset;
    cellasset.className = "text-center fw-light text-uppercase";

    const cellcoa = row.insertCell(2);
    cellcoa.innerHTML = coa;
    cellcoa.className = "text-center fw-light text-uppercase";

    const cellamount = row.insertCell(3);
    cellamount.innerHTML = amount;
    cellamount.className = "text-center fw-light text-uppercase";

    const celldepartment = row.insertCell(4);
    celldepartment.innerHTML = department;
    celldepartment.className = "text-center fw-light text-uppercase";

    const cellcodecoa = row.insertCell(5);
    cellcodecoa.innerHTML = codecoa;
    cellcodecoa.hidden = true;

    const cellcodeAsset = row.insertCell(6);
    cellcodeAsset.innerHTML = codeAsset;
    cellcodeAsset.hidden = true;

    const cellcodeDepartment = row.insertCell(7);
    cellcodeDepartment.innerHTML = codeDepartment;
    cellcodeDepartment.hidden = true;
}
async function selectVoucher(code) {
    const voucherType = document.getElementById("typeVoucherHeader").value || code
    if (voucherType == "PO" || voucherType == "DP") {
        document.getElementById("noTransactionHeader").disabled = false
        document.getElementById("noTransactionHeaderLabel").innerHTML = purchase_order
    } else {
        document.getElementById("noTransactionHeader").disabled = true
        document.getElementById("noTransactionHeaderLabel").innerHTML = transaction_number
    }
}
async function showModalPurchaseOrder() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalPurchaseOrder"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalPurchaseOrder"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("dataTableItemPO").innerHTML = "";
    document.getElementById("loadPurchaseOrder").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>"
}
async function selectPurchaseOrder() {
    const voucherType = document.getElementById("typeVoucherHeader").value
    const actions = {
        PO: actionsPO,
        DP: actionsDP,
    };
    if (actions[voucherType]) {
        await actions[voucherType]();
    }
}
async function actionsPO() {
    await resetDataTables()
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"), jQuery("#formSearch").validate({
                    ignore: [],
                    rules: {
                        searchPO: { required: !0, minlength: 3 }
                    },
                    messages: {
                        searchPO: { required, minlengthchar }
                    }
                }), jQuery(".js-select2").on("change", e => {
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
    const form = jQuery("#formSearch");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    document.getElementById("dataTableItemPO").innerHTML = "";
    const code = document.getElementById("searchPO").value;
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaseorder/payment";
    xhr.onloadstart = function () {
        document.getElementById("loadsearchPO").disabled = true;
        document.getElementById("loadsearchPO").innerHTML =
            "<div  class=''>\
                <span class='input-group-text fw-semibold btn btn-primary'>\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
               </span>\
                  <div>";
    };
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
        code_POST: kapital(code)
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                let dataTable = `
                                <table class="js-table-checkable table table-hover table-vcenter">
                                    <thead>
                                        <tr>
                                            <th class="text-center text-uppercase">${purchase_order}</th>
                                            <th class="text-center text-uppercase">${amount}</th>
                                            <th class="text-center text-uppercase">${vat}</th>
                                            <th class="text-center text-uppercase">${total}</th>
                                            <th class="text-center text-uppercase">${down_payment}</th>
                                            <th class="text-center text-uppercase">${remaining}</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                for (let i = 0; i < responseData.length; i++) {
                    dataTable += `
                                        <tr id='${responseData[i]["code_purchase_order"]}' onclick=selectPurchaseOrderDetail(id)>
                                            <td class='fw-light text-center text-uppercase'>${responseData[i]["code_purchase_order"]}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["subtotal"])}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["vat"] || 0)}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["subtotal"] + responseData[i]["vat"])}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["DP"] || 0)}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["subtotal"] + responseData[i]["vat"] - responseData[i]["DP"] || 0)}</td>
                                        </tr>`;
                }
                dataTable += `
                                    </tbody>
                                </table>`;
                document.getElementById("dataTableItemPO").innerHTML = dataTable;
                document.getElementById("loadsearchPO").innerHTML = "  \
                <span onclick='selectPurchaseOrder()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    document.getElementById("loadsearchPO").innerHTML = "  \
                <span onclick='selectPurchaseOrder()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
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
async function actionsDP() {
    await resetDataTables()
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"), jQuery("#formSearch").validate({
                    ignore: [],
                    rules: {
                        searchPO: { required: !0, minlength: 3 }
                    },
                    messages: {
                        searchPO: { required, minlengthchar }
                    }
                }), jQuery(".js-select2").on("change", e => {
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
    const form = jQuery("#formSearch");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    document.getElementById("dataTableItemPO").innerHTML = "";
    const code = document.getElementById("searchPO").value;
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaseorder/downpayment";
    xhr.onloadstart = function () {
        document.getElementById("loadsearchPO").disabled = true;
        document.getElementById("loadsearchPO").innerHTML =
            "<div  class=''>\
                <span class='input-group-text fw-semibold btn btn-primary'>\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
               </span>\
                  <div>";
    };
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
        code_POST: kapital(code)
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                let dataTable = `
                                <table class="js-table-checkable table table-hover table-vcenter">
                                    <thead>
                                        <tr>
                                            <th class="text-center text-uppercase">${purchase_order}</th>
                                            <th class="text-center text-uppercase">${amount}</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                for (let i = 0; i < responseData.length; i++) {
                    dataTable += `
                                        <tr id='${responseData[i]["code_purchase_order"]}' onclick=selectPurchaseOrderDetail(id)>
                                            <td class='fw-light text-center text-uppercase'>${responseData[i]["code_purchase_order"]}</td>
                                            <td class='fw-light text-center text-uppercase'>${formatRupiah(responseData[i]["subtotal"])}</td>
                                        </tr>`;
                }
                dataTable += `
                                    </tbody>
                                </table>`;
                document.getElementById("dataTableItemPO").innerHTML = dataTable;
                document.getElementById("loadsearchPO").innerHTML = "  \
                <span onclick='selectPurchaseOrder()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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
async function selectPurchaseOrderDetail(id) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"];
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaseorder/code";
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
        code_purchase_order_POST: id,
        employeeID_POST: employeeID
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                document.getElementById("noTransactionHeader").value = responseData["dataPO"][0]["code_purchase_order"]
                document.getElementById("currencyRateHeader").value = responseData["dataPO"][0]["exchange_rate"]
                document.getElementById("invoiceAmountHeader").value = formatRupiah(responseData["dataPO"][0]["subtotal"] - responseData["dataPO"][0]["discount"])
                const codeCompany = responseData["dataPO"][0]["code_company"]
                const codeLocation = responseData["dataPO"][0]["worksite"]
                const codePartners = responseData["dataPO"][0]["code_partners"]
                const codeCurrency = responseData["dataPO"][0]["currency"]
                await selectCompany(codeCompany)
                await selectLocation(codeLocation)
                await SelectPartners(codePartners)
                await selectCurrency(codeCurrency)
                await closeModal()
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
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
async function checkDate() {
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const date = yyyymmdd(document.getElementById("receivedDateHeader").value)
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
                    document.getElementById("receivedDateHeader").value = ""
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/payment_voucher";
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
async function selectPaymentVoucher(startDateList, endDateList) {
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
    var url = mainUrl + "paymentvoucher";
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
                    const noPV = responseData[i]["code_payment_voucher"];
                    var statusPV = "";
                    if (statusTemp == 0) {
                        statusPV = request;
                        editPV = "<button title='posting' type='button' id='" + noPV + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingPV = "<button title='posting' type='button' id='" + noPV + "' onclick='showModalPostingPaymentVoucherByCode(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                        deletePV = "<button title='delete' type='button' id='" + noPV + "' onclick='showModalDeletePaymentVoucherByCode(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                        viewPO = ""
                    } else if (statusTemp == 1) {
                        statusPV = posting;
                        editPV = "";
                        postingPV = "";
                        deletePV = "";
                        viewPO = "<button title='view' type='button' code ='" + noPV + "' id='btn-" + no + "'  onclick='selectPaymentVoucherByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                    } else if (statusTemp == 2) {
                        statusPV = paid;
                        editPV = "";
                        postingPV = "";
                        deletePV = "";
                        viewPO = "<button title='view' type='button' code ='" + noPV + "' id='btn-" + no + "'  onclick='selectPaymentVoucherByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["code_payment_voucher"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["no_invoice"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["date_create"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_partner"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeCreate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeUpdate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + statusPV + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ editPV + viewPO + postingPV + deletePV + "</div></td>\
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
                        <span onclick='selectPaymentVoucherByDate()' class='input-group-text fw-semibold btn btn-primary'>\
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
                        <span onclick='selectPaymentVoucherByDate()' class='input-group-text fw-semibold btn btn-primary'>\
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
async function selectPaymentVoucherByDate() {
    const startDate = yyyymmdd(document.getElementById("startDate").value)
    const endDate = yyyymmdd(document.getElementById("endDate").value)
    document.getElementById("loadsearch").disabled = true
    document.getElementById("loadsearch").innerHTML =
        "<div>\
            <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
            </span>\
          <div>";
    await selectPaymentVoucher(startDate, endDate)
}
async function selectPaymentVoucherByCode(button) {
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
    var url = mainUrl + "paymentvoucher/bycode";
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
        code_payment_voucher_POST: codeValue,
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
async function pdf(responseData, button) {
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