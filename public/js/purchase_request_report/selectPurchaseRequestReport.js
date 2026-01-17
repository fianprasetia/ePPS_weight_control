selectContent()
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["purchase_request_report"]
        document.getElementById("noPRListData").innerHTML = filterLanguage[0]["content"]["noPR"]
        document.getElementById("worksiteListData").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("dateCreateListData").innerHTML = filterLanguage[0]["content"]["date_create"]
        document.getElementById("requestbyListData").innerHTML = filterLanguage[0]["content"]["requester"]
        document.getElementById("purchasingListData").innerHTML = filterLanguage[0]["content"]["purchasing"]
        document.getElementById("statusListData").innerHTML = filterLanguage[0]["content"]["status"]
        // document.getElementById("checkOutTable").innerHTML = filterLanguage[0]["content"]["checkout"]
        // document.getElementById("lateTable").innerHTML = filterLanguage[0]["content"]["late_tolerance"]
        // document.getElementById("EarlyTable").innerHTML = filterLanguage[0]["content"]["leave_early_time"]
        // document.getElementById("overTable").innerHTML = filterLanguage[0]["content"]["over_time"]
        await selectWorksite()
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
async function selectPurchaseRequest() {
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
    await resetDataTables()
    document.getElementById("dataTable").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    const companyCode = document.getElementById("worksite").value
    const startDate = yyyymmdd(document.getElementById("startDate").value)
    const endDate = yyyymmdd(document.getElementById("endDate").value)
   if (!token) {
        token = await getAccessToken(); 
    }

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequestreport";
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
        company_code_POST: companyCode,
        start_date_POST: startDate,
        end_date_POST: endDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var tableItem = "";
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = await response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    statusTemp = responseData[i]["status"];
                    let status;
                    if (statusTemp == 0) {
                        status = request;
                    } else if (statusTemp == 1) {
                        status = waiting_approval;
                    } else if (statusTemp == 2) {
                        status = approve;
                    } else if (statusTemp == 3) {
                        status = finding_suppliers;
                    } else if (statusTemp == 4) {
                        status = done;
                    } else if (statusTemp == 5) {
                        status = reject;
                    } else if (statusTemp == 6) {
                        status = reject;
                    }
                    tableItem +=
                        "<tr>\
                        <td class='fw-light text-center text-uppercase'>" + no + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_purchase_request"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                        <td class='fw-light text-center'>"+ ddmmyyyy(responseData[i]["date"]) + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employee_purchasing"] === null ? "" : responseData[i]["employeePurchasing"]["fullname"]) + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + status + "</td>\
                    </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectPurchaseRequest()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
                await table();
            } else if (response["access"] == "failed") {
                const message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/purchase_request_report";
                }, 3000);
            }
        }

        if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 500) {
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
