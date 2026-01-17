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
    await selectActivityType();
    //   await selectCompanyWarehouse();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titleModal").innerHTML = content["activity_type"];
        document.getElementById("titlePage").innerHTML = content["activity_type"];
        document.getElementById("codeActivityTypeThead").innerHTML = content["activity_type_code"]
        document.getElementById("descriptionThead").innerHTML = content["description"]
        document.getElementById("codeCOAThead").innerHTML = content["coa_group"]
        document.getElementById("actionsThead").innerHTML = content["actions"]
        document.getElementById("codeActivitiTypeLabel").innerHTML = content["activity_type_code"] + "<span class='text-danger'>*</span>"
        document.getElementById("codeCOALabel").innerHTML = content["coa_group"] + "<span class='text-danger'>*</span>"
    }
}
async function selectActivityType() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activitytype";
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
        language_POST: language,
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
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_activity_type"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_activity_type_translations"][0]["translation"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_coa"] + "</td>\
                    <td class='fw-light text-center'><div class='btn-group'><button type='button'  title='" + edit + "' id ='" + responseData[i]["code_activity_type"] + "' onclick='showModalUpdateActivityType(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
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
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_asset";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000, message: status_404
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000, message: status_401
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000, message: status_500
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
}
async function selectCOA(codeCOA) {
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/activitytype"
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
                let filterSubData = [];
                let filternotSubData = [];

                if (codeCOA && codeCOA !== "") {
                    filterSubData = responseData.filter((item) => codeCOA.includes(item.code_coa));
                    // Konversi ke array (anggap kode berupa angka, jadi pakai map(Number))
                    // let codeArray = codeCOA.split(',').map(Number);
                    // filterSubData = responseData.filter((item) => codeArray.includes(item.code_coa));
                    filternotSubData = responseData.filter((item) => !codeCOA.includes(item.code_coa));
                } else {
                    filterSubData = responseData.filter((filterSubData) => filterSubData.code_coa == codeCOA);
                    filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_coa != codeCOA);
                }
                var mainOptionItem = "";
                var subOptionItem = "";
                for (var i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_coa"] + "'>" + filternotSubData[i]["code_coa"] + " - " + kapital(filternotSubData[i]["fat_coa_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {

                } else {
                    for (var j = 0; j < filterSubData.length; j++) {
                        mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[j]["code_coa"] + "' selected>" + filterSubData[j]["code_coa"] + " - " + kapital(filterSubData[j]["fat_coa_translations"][0]["translation"]) + "</option>";
                    }
                }
                document.getElementById('codeCOA').innerHTML = mainOptionItem + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/activity_type";
                }, 3000);
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