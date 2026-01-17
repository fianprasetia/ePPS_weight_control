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
    await selectHarvestIncentive();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titleModal").innerHTML = content["harvest_incentive"];
        document.getElementById("titlePage").innerHTML = content["harvest_incentive"];
        document.getElementById("companyHeaderLabel").innerHTML = content["company"] + "<span class='text-danger'>*</span>"
        document.getElementById("harvestDayHeaderLabel").innerHTML = content["harvest_day"] + "<span class='text-danger'>*</span>"
        document.getElementById("BJRHeaderLabel").innerHTML = content["abw"] + "<span class='text-danger'>*</span>"
        document.getElementById("harvestBasisLabel").innerHTML = content["harvest_basis"] + "<span class='text-danger'>*</span>"
        document.getElementById("harvestBasisILabel").innerHTML = content["harvest_basis_i"] + "<span class='text-danger'>*</span>"
        document.getElementById("harvestBasisIILabel").innerHTML = content["harvest_basis_ii"] + "<span class='text-danger'>*</span>"
        document.getElementById("basisBonusLabel").innerHTML = content["basis_bonus"] + "<span class='text-danger'>*</span>"
        document.getElementById("extraBasisBonusLabel").innerHTML = content["extra_basis_bonus"] + "<span class='text-danger'>*</span>"
        document.getElementById("extraBasisBonusILabel").innerHTML = content["extra_basis_bonus_i"] + "<span class='text-danger'>*</span>"
        document.getElementById("extraBasisBonusIILabel").innerHTML = content["extra_basis_bonus_ii"] + "<span class='text-danger'>*</span>"
        document.getElementById("looseFruitBonusLabel").innerHTML = content["loose_fruit_bonus"] + "<span class='text-danger'>*</span>"
        document.getElementById("companyThead").innerHTML = content["company"]
        document.getElementById("harvestDayThead").innerHTML = content["harvest_day"]
        document.getElementById("BJRThead").innerHTML = content["abw"]
        document.getElementById("harvestBasisThead").innerHTML = content["harvest_basis"]
        document.getElementById("basisBonusThead").innerHTML = content["basis_bonus"]
        document.getElementById("extraBasisBonusThead").innerHTML = content["extra_basis_bonus"]
        // document.getElementById("extraBasisBonusExtraThead").innerHTML = content["extra_basis_bonus"]
        // document.getElementById("harvestBasisExtraThead").innerHTML = content["extra_basis_panen"]
        document.getElementById("looseFruitBonusThead").innerHTML = content["loose_fruit_bonus"]
        document.getElementById("createbyThead").innerHTML = content["create_by"]
        document.getElementById("actionsThead").innerHTML = content["actions"]
    }
}
async function selectHarvestIncentive() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestincentive";
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
                    let havertsDay = await selectHarvestDay(responseData[i]["harvest_day"]);
                    tableItem +=
                        "<tr>\
                    <td class='fw-light text-center'>" + no + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + havertsDay + "</td>\
                    <td class='fw-light text-center text-uppercase'  style='width: 100px'>" + responseData[i]["start_bjr"] + " - " + responseData[i]["end_bjr"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["basis_bonus"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["harvest_basis_ffb"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["harvest_basis_i_ffb"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["harvest_basis_ii_ffb"] + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["extra_basis_bonus"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["extra_basis_bonus_i"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["extra_basis_bonus_ii"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + formatRupiah(responseData[i]["loose_fruit_bonus"]) + "</td>\
                    <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                    <td class='fw-light text-center'><div class='btn-group'><button type='button' id ='" + responseData[i]["id"] + "' onclick='showModalUpdateHarvestIncentive(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
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
async function selectCompany(code) {
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/type"
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
        companyType_POST: companyTypeCode,
        companyParent_POST: companyParent,
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
                document.getElementById("companyHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectHarvestDay(selectedValue) {
    const responseValue = [0, 1];
    const responseData = [working_day, holiday]; // asumsikan ini variabel string dari terjemahan atau kapitalisasi

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";
    let selectedLabel = null;
    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        if (value === selectedValue) {
            selectedLabel = label; // simpan label yang dipilih
        }
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("harvestDayHeader").innerHTML = mainOptionItem + subOptionItem;
    return selectedLabel
}
async function harvestBasisIncentive() {
    const harvestBasis = document.getElementById("harvestBasis").value
    document.getElementById("harvestBasisI").value = parseFloat(harvestBasis) * (150 / 100);
    document.getElementById("harvestBasisII").value = parseFloat(harvestBasis) * (200 / 100);
}
async function harvestBasisIncentiveRp() {
    const harvestBasisRp = document.getElementById("extraBasisBonus").value
    document.getElementById("extraBasisBonusI").value = parseFloat(unformatRupiah(harvestBasisRp)) * (150 / 100);
    document.getElementById("extraBasisBonusII").value = parseFloat(unformatRupiah(harvestBasisRp)) * (200 / 100);
}