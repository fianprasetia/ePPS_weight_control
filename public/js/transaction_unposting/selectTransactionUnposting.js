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
    await selectTypeUnposting();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        receivingLocations = content["receiving_locations"]
        // document.getElementById("cancelBtn").innerHTML = content["cancel"];
        // document.getElementById("POPage").innerHTML = content["purchase_order"];
        // document.getElementById("titleContent").innerHTML = content["purchase_order"];
        // document.getElementById("titlePO").innerHTML = content["purchase_order"];
        // document.getElementById("viewPO").innerHTML = content["purchase_order"];
        // document.getElementById("subtotalFoot").innerHTML = content["subtotal"];
        // document.getElementById("discountFoot").innerHTML = content["discount"];
        // document.getElementById("shippingFoot").innerHTML = content["shipping_cost"];
        // document.getElementById("taxFoot").innerHTML = content["vat"];
        // document.getElementById("grandTotalFoot").innerHTML = content["grand_total"];
        // document.getElementById("termCondition").innerHTML = content["terms_and_conditions"];
        // document.getElementById("pRHeader").innerHTML = content["purchase_request"];
        // document.getElementById("pOHeader").innerHTML = content["purchase_order"];
        // document.getElementById("worksiteHeader").innerHTML = content["worksite"];
        // document.getElementById("purchasingHeader").innerHTML = content["purchasing"];
        // document.getElementById("statusHeader").innerHTML = content["status"];
        // document.getElementById("actionsHeader").innerHTML = content["actions"];
        // document.getElementById("dateLabel").innerHTML = content["date"];
    }
}
async function selectTypeUnposting(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "transactionunposting"
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
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_transaction_unposting == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_transaction_unposting != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_transaction_unposting"] +
                        "'>" +
                        kapital(filternotSubData[i]["translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_transaction_unposting"] + "'>" + kapital(filterSubData[0]["translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("typeTransactionUnpostingHeader").innerHTML = mainOptionItem + "" + subOptionItem;
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // document.getElementById("akun").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(hide_account) + "</option> <option value='1'>" + kapital(show) + "</option><option value='0'>" + kapital(no_show) + "</option>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/transcation_unposting";
                // }, 3000);
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
async function SelectTransactionUposting() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeader").validate({
                        ignore: [],
                        rules: {
                            "typeTransactionUnpostingHeader": { required: !0 },
                            "noTransactionHeader": { required: !0 },
                        },
                        messages: {
                            "typeTransactionUnpostingHeader": required,
                            "noTransactionHeader": required,
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
    const form = jQuery("#formHeader");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const typeVoucher = document.getElementById("typeTransactionUnpostingHeader").value
    const noTransaction = document.getElementById("noTransactionHeader").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let linkUrl = "";
    if (typeVoucher === "PV") {
        linkUrl = `${mainUrl}transactionunposting/bypaymentvoucher`;
    }else if(typeVoucher === "CB"){
         linkUrl = `${mainUrl}transactionunposting/bycashbank`;
    }
    var xhr = new XMLHttpRequest();
    var url = linkUrl
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
            "<div>\
            <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
            </span>\
          <div>";
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
    var data = JSON.stringify(
        {
            language_POST: language,
            no_transaction_POST: noTransaction,
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                if (typeVoucher == "PV") {
                    selectShowPaymentVoucher(responseData)
                }else if(typeVoucher=="CB"){
                    selectShowCashBank(responseData)

                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='SelectTransactionUposting()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
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