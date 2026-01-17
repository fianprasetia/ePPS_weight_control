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

        document.getElementById("PRDelegetionPage").innerHTML = filterLanguage[0]["content"]["purchase_request_delegation"]
        document.getElementById("titlePRDelegetion").innerHTML = filterLanguage[0]["content"]["purchase_request_delegation"]
        document.getElementById("noPRListData").innerHTML = filterLanguage[0]["content"]["noPR"]
        document.getElementById("localtionData").innerHTML = filterLanguage[0]["content"]["location"]
        document.getElementById("dateCreateListData").innerHTML = filterLanguage[0]["content"]["date_create"]
        document.getElementById("dateRequestListData").innerHTML = filterLanguage[0]["content"]["date_request"]
        document.getElementById("noteListData").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("requesterData").innerHTML = filterLanguage[0]["content"]["requester"]
        document.getElementById("purchasingData").innerHTML = filterLanguage[0]["content"]["purchasing"]
        document.getElementById("purchasingLabel").innerHTML = filterLanguage[0]["content"]["purchasing"]
        document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("descriptionItemMaster").innerHTML = filterLanguage[0]["content"]["description"]
        document.getElementById("qtyRequestItemMaster").innerHTML = filterLanguage[0]["content"]["requested_quantity"]
        document.getElementById("qtyRealisasiMaster").innerHTML = filterLanguage[0]["content"]["actual_quantity"]
        document.getElementById("uomItemMaster").innerHTML = filterLanguage[0]["content"]["uom"]
        document.getElementById("noteItemMaster").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("actionsMaster").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("itemLabel").innerHTML = filterLanguage[0]["content"]["item_detail"]
        document.getElementById("nameData").innerHTML = filterLanguage[0]["content"]["name"]
        document.getElementById("noteData").innerHTML = filterLanguage[0]["content"]["note"]
    }
    selectPruchaseRequestApproval()
}
async function selectPruchaseRequestApproval() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/delegation"
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
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                var no = 1
                for (i = 0; i < responseData.length; i++) {
                    purchasing = responseData[i]["employeePurchasing"]
                    if (purchasing == null) {
                        purchasing = ""
                    } else {
                        purchasing = responseData[i]["employeePurchasing"]["fullname"]
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["code_purchase_request"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["adm_company"]["name"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        ddmmyyyy(responseData[i]["date"]) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        ddmmyyyy(responseData[i]["date_request"]) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["note"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_employee"]["fullname"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        purchasing +
                        "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button title='Info' type='button' id ='" + responseData[i]["code_purchase_request"] + "' onclick='showModalUpdatePurchaseRequestDelegation(id)' class='btn btn-primary'><i class='fa-solid fa-circle-info'></i></button></div></td>\
                        </tr>";
                    no++
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(function () {
                //     window.location.href = "/purchase_request_approval";
                // }, 3000);
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
async function selectEmployee(employeeID) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/pur"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == employeeID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != employeeID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"]) + "</option>";
                }

                document.getElementById("selectPurchasing").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
selectContent() 