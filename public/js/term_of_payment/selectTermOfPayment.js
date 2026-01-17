selectContent()
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";

    // Fetch data dan tunggu hingga selesai
    const response = await fetch(data);
    const jsonData = await response.json();

    // Proses data
    await dataContent(jsonData);
    await SelectTOP()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["term_of_payment"]
        document.getElementById("titleModal").innerHTML = filterLanguage[0]["content"]["term_of_payment"]
        document.getElementById("typeThead").innerHTML = filterLanguage[0]["content"]["type"]
        document.getElementById("DescriptionThead").innerHTML = filterLanguage[0]["content"]["description"]
        document.getElementById("actionsThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("TOPTypeLabel").innerHTML = filterLanguage[0]["content"]["term_of_payment_type"] + "<span class='text-danger'>*</span>"
    }
}
async function SelectTOP() {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "termofpayment";
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
        language_POST: language
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["type"] === "CREDIT" ? credit : cash) + "</td>\
                            <td class='fw-light text-uppercase'>" + responseData[i]["log_term_of_payment_translation"]["translation"] + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button type='button' id ='" + responseData[i]["code_term_of_payment"] + "' onclick='showModalUpdateTOP(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                 setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message
                });
                 setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(function () {
                //     window.location.href = "/purchase_request_capex";
                // }, 3000);
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
    return false;
}