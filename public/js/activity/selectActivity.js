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
    await selectActivity();
    //   await selectCompanyWarehouse();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titleModal").innerHTML = content["activity"];
        document.getElementById("titlePage").innerHTML = content["activity"];
        document.getElementById("codeActivityThead").innerHTML = content["activity_code"]
        document.getElementById("descriptionThead").innerHTML = content["description"]
        document.getElementById("codeActivityTypeThead").innerHTML = content["activity_type"]
        document.getElementById("uomThead").innerHTML = content["uom"]
        document.getElementById("COAThead").innerHTML = content["coa_code"]
        document.getElementById("premiThead").innerHTML = content["incentive"]
        document.getElementById("statusThead").innerHTML = content["status"]
        document.getElementById("actionsThead").innerHTML = content["actions"]
        document.getElementById("codeActivitiTypeLabel").innerHTML = content["activity_type_code"] + "<span class='text-danger'>*</span>"
        document.getElementById("uomLabel").innerHTML = content["uom"] + "<span class='text-danger'>*</span>"
        document.getElementById("coaLabel").innerHTML = content["coa_code"] + "<span class='text-danger'>*</span>"
        document.getElementById("premiLabel").innerHTML = content["incentive"] + "<span class='text-danger'>*</span>"
        document.getElementById("statusLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>"
    }
}
async function selectActivity() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activity";
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
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_activity"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["adm_activity_translations"][0]["translation"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["code_activity_type"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["uom"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["code_coa"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + (responseData[i]["premi"] == 1 ? kapital(active) : kapital(nonactive)) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + (responseData[i]["status"] == 1 ? kapital(active) : kapital(nonactive)) + "</td>\
                    <td class='fw-light text-center'><div class='btn-group'><button type='button'  title='" + edit + "' id ='" + responseData[i]["code_activity"] + "' onclick='showModalUpdateActivity(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
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
async function selectUOM(uomCode) {
    const language = await JSON.parse(getCookie("language"));
    const dataUOM = "file/uom.json";
    fetch(dataUOM)
        .then((response) => response.json())
        .then((dataUOM) => dataContent(dataUOM));
    function dataContent(dataUOM) {
        var responseData = dataUOM
        const filteredDataOUM = Object.entries(responseData.uom)
            .filter(([key, value]) => value[language]) // Memfilter berdasarkan bahasa
            .map(([key, value]) => ({ key, name: value[language] }));
        var filterSubData = filteredDataOUM.filter((filterSubData) => filterSubData.key == uomCode);
        var filternotSubData = filteredDataOUM.filter((filternotSubData) => filternotSubData.key != uomCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["key"] +
                "'>" +
                kapital(filternotSubData[i]["name"]) + " (" + filternotSubData[i]["key"] + ") </option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["key"] + ">" + kapital(filterSubData[0]["name"]) + " (" + filterSubData[0]["key"] + ")</option>";
        }
        document.getElementById("selectUOM").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectActivityType(code) {
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activitytype"
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
                filterSubData = responseData.filter((filterSubData) => filterSubData.code_activity_type == code);
                filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_activity_type != code);
                var mainOptionItem = "";
                var subOptionItem = "";
                for (var i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_activity_type"] + "'>" + filternotSubData[i]["code_activity_type"] + " - " + kapital(filternotSubData[i]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    for (var j = 0; j < filterSubData.length; j++) {
                        mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[j]["code_activity_type"] + "' selected>" + filterSubData[j]["code_activity_type"] + " - " + kapital(filterSubData[j]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                    }
                }
                document.getElementById('codeActivitiType').innerHTML = mainOptionItem + subOptionItem;
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
async function selectCOA(codeType, code) {
    let language = JSON.parse(getCookie("language"));
    var codeActivitiTypeTemp = document.getElementById("codeActivitiType").value;
    let codeActivitiType = ""
    if (codeActivitiTypeTemp === "") {
        codeActivitiType = codeType
    } else {
        codeActivitiType = codeActivitiTypeTemp
    }
    let token = JSON.parse(getCookie("dataToken"));
    if (!token) {
        await getAccessToken();
        token = JSON.parse(getCookie("dataToken"));
    }
    const url = mainUrl + "activitytype/activity";
    const bodyData = {
        language_POST: language,
        code_activity_type_POST: codeActivitiType
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(bodyData)
        });
        if (!response.ok) {
            if (response.status === 404) {
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            } else if (response.status === 401) {
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            } else if (response.status === 500) {
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            } else {
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: overload });
            }
            setTimeout(() => window.location.href = "/", 3000);
            return;
        }
        const data = await response.json();
        if (data.access === "success") {
            const responseData = data.data || [];
            const selectedOptions = responseData.filter(item => item.code_coa === code);
            const otherOptions = responseData.filter(item => item.code_coa !== code);
            let optionsHTML = "";
            if (selectedOptions.length === 0) {
                optionsHTML += `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
            } else {
                selectedOptions.forEach(item => {
                    optionsHTML += `<option class='fw-light text-uppercase' value='${item.code_coa}' selected>${item.code_coa} - ${kapital(item.fat_coa_translations[0].translation)}</option>`;
                });
            }

            otherOptions.forEach(item => {
                optionsHTML += `<option class='fw-light text-uppercase' value='${item.code_coa}'>${item.code_coa} - ${kapital(item.fat_coa_translations[0].translation)}</option>`;
            });

            document.getElementById('codeCOA').innerHTML = optionsHTML;

        } else if (data.access === "failed") {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: data.message });
            setTimeout(() => window.location.href = "/activity", 3000);
        }

    } catch (error) {
        console.error(error);
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: overload });
        setTimeout(() => window.location.href = "/", 3000);
    }
}
