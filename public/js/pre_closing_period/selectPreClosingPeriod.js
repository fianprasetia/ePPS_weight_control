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
    await SelectPeriod()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["pre_closing_period"];
        document.getElementById("titlePeriod").innerHTML = content["period"];
        // document.getElementById("titleModal").innerHTML = content["warehouse_closeout"];
        // document.getElementById("codeAssetHeader").innerHTML = content["code_item"];
        // document.getElementById("descriptionHeader").innerHTML = content["description"];
        // document.getElementById("uomHeader").innerHTML = content["uom"];
        // document.getElementById("locationHeader").innerHTML = content["storage_location"];
        // document.getElementById("beginningHeader").innerHTML = content["opening_balance"];
        // document.getElementById("incomingHeader").innerHTML = content["in"];
        // document.getElementById("outingHeader").innerHTML = content["out"];
        // document.getElementById("endingHeader").innerHTML = content["end_balance"];
        // document.getElementById("WareHouseReconciliationLabel").innerHTML = content["note"];
    }
}
async function SelectPeriod() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const worksite = dataCompany[0]["code_company"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "accountingperiods/bycode";
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                subOptionItem = ""
                subOptionItem += "<option class='fw-light text-uppercase' value='depreciation'>" + kapital(depreciation) + "</option>";
                document.getElementById("transaction").innerHTML = mainOptionItem + "" + subOptionItem;
                document.getElementById("startDateList").innerHTML = mmyyyy(responseData[0]["period"]);
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
async function searchTransaction() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeader").validate({
                        ignore: [],
                        rules: {
                            "transaction": { required: !0 },
                        },
                        messages: {
                            "transaction": required,
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
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const worksite = dataCompany[0]["code_company"]
    let period = document.getElementById("startDateList").innerHTML
    let transaction = document.getElementById("transaction").value
    var urlPosting = ""
    if (transaction === "depreciation") {
        urlPosting = mainUrl + "asset/bydepreciation"
    } else {
        urlPosting = mainUrl + "cashbank/postingin"

    }
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = urlPosting
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        worksite_POST: worksite,
        transaction_POST: transaction,
        period_POST: yyyymm(period)
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                if (transaction === "depreciation") {
                    showDepreciation(responseData,period)
                } else {
                    urlPosting = mainUrl + "cashbank/postingin"

                }
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='searchTransaction()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message,
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='searchTransaction()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
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
async function showDepreciation(responseData,period) {
    let dataTable = `
                                <table id="tableDeprecation" class="js-table-checkable table table-hover table-vcenter">
                                    <thead>
                                        <tr>
                                            <th class="text-center text-uppercase">code Asset</th>
                                            <th class="text-center text-uppercase">${note}</th>
                                            <th class="text-center text-uppercase">period</th>
                                            <th class="text-center text-uppercase">nominal</th>
                                        </tr>
                                    </thead>
                                    <tbody id="dataTableItemData">`;
    responseData.forEach(item => {
        dataTable += `
                                    <tr>
                                        <td class="fw-light text-center text-uppercase">${item.code_asset_type}</td>
                                        <td class="fw-light text-center text-uppercase">${item.name}</td>
                                        <td class="fw-light text-center text-uppercase">${period}</td>
                                        <td class="fw-light text-end text-uppercase">${formatRupiah(item.depreciation_value_monthly)}</td>
                                    </tr>`;
    });
    dataTable += `
            </tbody>
        </table>`;
    document.getElementById("dataPreClosingPeriod").innerHTML = dataTable;
    document.getElementById("loadPreClosingPeriod").innerHTML = `<a id='cancelBtn' onclick='insertDeprecation()' class='btn btn-primary'>${kapital(process)}</a>`;
}