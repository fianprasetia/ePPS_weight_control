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
        document.getElementById("titlePage").innerHTML = content["closing_period"];
        document.getElementById("periodLabel").innerHTML = content["period"] + "<span class='text-danger'>*</span>"
        document.getElementById("worksiteLabel").innerHTML = content["worksite"] + "<span class='text-danger'>*</span>"
        document.getElementById("processBtn").innerHTML = content["process"];
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
    const companyName = dataCompany[0]["name"]
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
                document.getElementById("period").value = mmyyyy(responseData[0]["period"]);
                document.getElementById("worksite").value = companyName;
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