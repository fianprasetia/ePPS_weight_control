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
        document.getElementById("PRApprovalPage").innerHTML = filterLanguage[0]["content"]["goods_receipt_approval"]
        document.getElementById("titlePRApproval").innerHTML = filterLanguage[0]["content"]["goods_receipt_approval"]
        document.getElementById("noGRListData").innerHTML = filterLanguage[0]["content"]["goods_receipt_number"]
        document.getElementById("noPRListData").innerHTML = filterLanguage[0]["content"]["pr_number"]
        document.getElementById("localtionData").innerHTML = filterLanguage[0]["content"]["location"]
        document.getElementById("dateListData").innerHTML = filterLanguage[0]["content"]["date"]
        document.getElementById("invoiceListData").innerHTML = filterLanguage[0]["content"]["invoice"]
        document.getElementById("shippingListData").innerHTML = filterLanguage[0]["content"]["no_shipping_document"]
        document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("codeItemMaster").innerHTML = filterLanguage[0]["content"]["code_item"]
        document.getElementById("descriptionItemMaster").innerHTML = filterLanguage[0]["content"]["description"]
        document.getElementById("uomItemMaster").innerHTML = filterLanguage[0]["content"]["uom"]
        document.getElementById("qtyItemMaster").innerHTML = filterLanguage[0]["content"]["qty"]
        document.getElementById("qtyReceivedItemMaster").innerHTML = filterLanguage[0]["content"]["qty_received"]
    }
    selectGoodsReceiptApproval()
}
async function selectGoodsReceiptApproval() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsreceiptapproval"
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
                // console.log(responseData[0]["log_goods_receipt"]["type"])
                var tableItem = "";
                var no = 1
                for (i = 0; i < responseData.length; i++) {
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_goods_receipt"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_receipt"]["code_purchase_order"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_receipt"]["warehouse"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["log_goods_receipt"]["date"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_receipt"]["invoice"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_goods_receipt"]["shipping"] + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button title='Approve' type='button' typeGR='"+ responseData[0]["log_goods_receipt"]["type"] + "' id ='" + responseData[i]["code_goods_receipt"] + "' onclick='showModalUpdateGoodsReceipt(id)' class='btn btn-primary'><i class='fa-solid fa-circle'></i></button></div></td>\
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