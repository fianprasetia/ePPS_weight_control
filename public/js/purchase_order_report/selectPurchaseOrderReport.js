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
    let lastDate = new Date();
    const getToday = new Date();
    lastDate.setDate(getToday.getDate() - 30);
    startDate = lastDate.getFullYear() + "-" + (lastDate.getMonth() + 1).toString().padStart(2, "0") + "-" + lastDate.getDate().toString().padStart(2, "0");
    endDate = getToday.getFullYear() + "-" + (getToday.getMonth() + 1).toString().padStart(2, "0") + "-" + getToday.getDate().toString().padStart(2, "0");
    await selectWorksite()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        receivingLocations = content["receiving_locations"]
        document.getElementById("titlePage").innerHTML = content["purchase_order_report"];
        document.getElementById("pOHeader").innerHTML = content["purchase_order"];
        document.getElementById("dateHeader").innerHTML = content["date"];
        document.getElementById("worksiteHeader").innerHTML = content["worksite"];
        document.getElementById("purchasingHeader").innerHTML = content["purchasing"];
        document.getElementById("statusHeader").innerHTML = content["status"];
    }
}
async function selectWorksite(worksiteCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/level02"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == worksiteCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != worksiteCode);
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
                document.getElementById("worksite").innerHTML = mainOptionItem + "" + subOptionItem;
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
async function SelectPurchaseOrder() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "worksite": { required: !0 },
                            "startDate": { required: !0 },
                            // "endDate": { required: !0 },
                        },
                        messages: {
                            "worksite": required,
                            "startDate": required,
                            // "endDate": required,
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
    const form = jQuery("#form2");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    document.getElementById("dataTable").innerHTML = ""
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    let startDate = document.getElementById("startDate").value
    let endDate = document.getElementById("endDate").value
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaseorder";
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
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
            "<div  class=''>\
              <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
             </span>\
                <div>";
    };
    var data = JSON.stringify({
        language_POST: language,
        start_date_POST: yyyymmdd(startDate),
        end_date_POST: yyyymmdd(endDate),
        employeeID_POST: employeeID
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                await resetDataTables()
                var tableItem = "";
                var no = 1;
                jmlPosting = responseData["dataPosting"]
                var hide = ""
                if (jmlPosting === 0) {
                    hide = "hidden"
                } else {
                    hide = ""
                }
                for (i = 0; i < responseData["dataPurchaseOrder"].length; i++) {
                    const statusTemp = responseData["dataPurchaseOrder"][i]["status"];
                    const noPO = responseData["dataPurchaseOrder"][i]["code_purchase_order"];
                    var statusPO = "";
                    if (statusTemp == 0) {
                        statusPO = request;
                    } else if (statusTemp == 1) {
                        statusPO = release;
                    } else if (statusTemp == 2) {
                        statusPO = goods_received;
                    } else if (statusTemp == 3) {
                        statusPO = pending_payment;
                    } else if (statusTemp == 4) {
                        statusPO = paid;
                    } else if (statusTemp == 5) {
                        statusPO = cancel;
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData["dataPurchaseOrder"][i]["date_create"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["code_purchase_order"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["worksiteCompany"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataPurchaseOrder"][i]["employeePurchasing"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + statusPO + "</td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='SelectPurchaseOrder()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message,
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='SelectPurchaseOrder()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
                // setTimeout(function () {
                //     window.location.href = "/purchase_order";
                // }, 3000);
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