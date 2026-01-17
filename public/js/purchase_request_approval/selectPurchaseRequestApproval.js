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

        document.getElementById("PRApprovalPage").innerHTML = filterLanguage[0]["content"]["purchase_request_approval"]
        document.getElementById("titlePRApproval").innerHTML = filterLanguage[0]["content"]["purchase_request_approval"]
        document.getElementById("noPRListData").innerHTML = filterLanguage[0]["content"]["noPR"]
        document.getElementById("localtionData").innerHTML = filterLanguage[0]["content"]["location"]
        document.getElementById("dateCreateListData").innerHTML = filterLanguage[0]["content"]["date_create"]
        document.getElementById("dateRequestListData").innerHTML = filterLanguage[0]["content"]["date_request"]
        document.getElementById("noteListData").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("requesterData").innerHTML = filterLanguage[0]["content"]["requester"]
        document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("descriptionItemMaster").innerHTML = filterLanguage[0]["content"]["description"]
        document.getElementById("qtyItemMaster").innerHTML = filterLanguage[0]["content"]["qty"]
        document.getElementById("uomItemMaster").innerHTML = filterLanguage[0]["content"]["uom"]
        document.getElementById("noteItemMaster").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("noteLabel").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("itemLabel").innerHTML = filterLanguage[0]["content"]["item_detail"]
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
    var url = mainUrl + "purchaserequestapproval"
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
        employeeID_POST: employeeID,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                var no = 1
                for (i = 0; i < responseData.length; i++) {
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["code_purchase_request"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["log_purchase_request"]["adm_company"]["name"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        ddmmyyyy(responseData[i]["log_purchase_request"]["date"]) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        ddmmyyyy(responseData[i]["log_purchase_request"]["date_request"]) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["log_purchase_request"]["note"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["log_purchase_request"]["hrd_employee"]["fullname"] +
                        "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button title='Approve' type='button' id ='" + responseData[i]["code_purchase_request"] + "' onclick='showModalUpdatePurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-circle'></i></button></div></td>\
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

selectContent() 