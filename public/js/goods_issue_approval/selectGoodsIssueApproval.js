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
        document.getElementById("PRApprovalPage").innerHTML = filterLanguage[0]["content"]["goods_assue_approval"]
        document.getElementById("titlePRApproval").innerHTML = filterLanguage[0]["content"]["goods_assue_approval"]
        document.getElementById("noGiListData").innerHTML = filterLanguage[0]["content"]["goods_issue_number"];
        document.getElementById("dateListData").innerHTML = filterLanguage[0]["content"]["date"];
        document.getElementById("employeeWarehouseData").innerHTML = filterLanguage[0]["content"]["wh_staff"];
        document.getElementById("employeeRequestData").innerHTML = filterLanguage[0]["content"]["request_by"];
        document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"];
        document.getElementById("codeItemTable").innerHTML = filterLanguage[0]["content"]["item_master"]
        document.getElementById("uomTable").innerHTML = filterLanguage[0]["content"]["uom"];
        document.getElementById("qtyTable").innerHTML = filterLanguage[0]["content"]["qty"]
        document.getElementById("blockTable").innerHTML = filterLanguage[0]["content"]["block"];
        document.getElementById("assetTable").innerHTML = filterLanguage[0]["content"]["asset"];
        document.getElementById("activityTable").innerHTML = filterLanguage[0]["content"]["activity"]
    }
    selectGoodsIssueApproval()
}
async function selectGoodsIssueApproval() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsissueapproval"
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
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_goods_issue"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["log_goods_issue"]["date"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_issue"]["employeeWarehouse"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_issue"]["employeeRequest"]["fullname"] + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button title='Approve' type='button'  id ='" + responseData[i]["code_goods_issue"] + "' onclick='showModalUpdateGoodsIssue(id)' class='btn btn-primary'><i class='fa-solid fa-circle'></i></button></div></td>\
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
