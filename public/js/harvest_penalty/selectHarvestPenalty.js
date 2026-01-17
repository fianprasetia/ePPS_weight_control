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
    await selectHarvestPenalty();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titleModal").innerHTML = content["harvest_penalty"];
        document.getElementById("titlePage").innerHTML = content["harvest_penalty"];
        document.getElementById("codeThead").innerHTML = content["harvest_penalty_type"]
        document.getElementById("companyThead").innerHTML = content["estate"]
        document.getElementById("uomThead").innerHTML = content["uom"]
        document.getElementById("penaltyThead").innerHTML = content["nominal_penalty"]
        document.getElementById("noteThead").innerHTML = content["note"]
        document.getElementById("createbyThead").innerHTML = content["create_by"]
        document.getElementById("actionsThead").innerHTML = content["actions"]
        document.getElementById("estateHeaderLabel").innerHTML = content["estate"] + "<span class='text-danger'>*</span>"
        document.getElementById("harvestPenaltyTypeHeaderLabel").innerHTML = content["harvest_penalty_type"] + "<span class='text-danger'>*</span>"
        document.getElementById("uomHeaderLabel").innerHTML = content["uom"] + "<span class='text-danger'>*</span>"
        document.getElementById("nominalHeaderLabel").innerHTML = content["nominal_penalty"] + "<span class='text-danger'>*</span>"
        document.getElementById("noteHeaderLabel").innerHTML = content["note"]
    }
}
async function selectHarvestPenalty() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestpenalty";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
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
                    // let dictionaryNote = await dictionary(responseData[i]["note"])
                    let uoms = await selectUOM(responseData[i]["uom"]);
                    tableItem +=
                        "<tr>\
                    <td class='fw-light text-center'>" + no + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["plt_harvest_penalty_type"]["translations"][0]["translation"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["nominal"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + uoms + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["note"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                    <td class='fw-light text-center'><div class='btn-group'><button type='button' id ='" + responseData[i]["id"] + "' onclick='showModalUpdateHarvestPenalty(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
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
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
async function selectEstate(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/estate"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                // subOptionItem = "";
                // mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                // for (i = 0; i < responseData.length; i++) {
                //     subOptionItem += "<option class='fw-light text-uppercase' value='" + responseData[i]["code_company"] + "'>" + kapital(responseData[i]["name"]) + "</option>";
                // }
                document.getElementById("estateHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/block_master";
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
async function selectHarvestPenaltyType(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestpenaltytype"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_harvest_penalty == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_harvest_penalty != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_harvest_penalty"] + "'>" + kapital(filternotSubData[i]["translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_harvest_penalty"] + "'>" + kapital(filterSubData[0]["translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("harvestPenaltyTypeHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/block_master";
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
async function selectUOM(code) {
    const language = JSON.parse(getCookie("language"));
    const dataUOM = "file/uom.json";

    const response = await fetch(dataUOM);
    const uomData = await response.json();

    const filteredDataOUM = Object.entries(uomData.uom)
        .filter(([key, value]) => value[language]) // filter sesuai bahasa
        .map(([key, value]) => ({ key, name: value[language] }));

    const filterSubData = filteredDataOUM.filter((item) => item.key == code);
    const filternotSubData = filteredDataOUM.filter((item) => item.key != code);

    let mainOptionItem = "";
    let subOptionItem = "";

    for (let i = 0; i < filternotSubData.length; i++) {
        subOptionItem +=
            "<option class='fw-light text-uppercase' value='" +
            filternotSubData[i]["key"] +
            "'>" +
            kapital(filternotSubData[i]["name"]) +
            " (" +
            filternotSubData[i]["key"] +
            ") </option>";
    }

    if (filterSubData.length === 0) {
        mainOptionItem +=
            "<option class='fw-light text-uppercase' selected disabled value=''>" +
            kapital(select) +
            "</option>";
    } else {
        mainOptionItem +=
            "<option class='fw-light text-uppercase' value=" +
            filterSubData[0]["key"] +
            ">" +
            kapital(filterSubData[0]["name"]) +
            " (" +
            filterSubData[0]["key"] +
            ")</option>";
    }

    // render ke DOM
    document.getElementById("uomHeader").innerHTML = mainOptionItem + " " + subOptionItem;

    // ⬅️ return biar bisa ditangkap di luar
    return filterSubData.length > 0 ? filterSubData[0]["name"] : null;
}
