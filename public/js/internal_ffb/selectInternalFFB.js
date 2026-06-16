selectContent()
async function selectContent() {
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    await selectEstate()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("sourceLabel").innerHTML = filterLanguage[0]["content"]["internal_ffb"]
        document.getElementById("indicatorLabel").innerHTML = filterLanguage[0]["content"]["indicator"]
        document.getElementById("stable").innerHTML = " <i class='fa fa-circle-check'></i>" + filterLanguage[0]["content"]["stable"]
        document.getElementById("titleInfo").innerHTML = filterLanguage[0]["content"]["input_information"]
        document.getElementById("ticketLabel").innerHTML = filterLanguage[0]["content"]["ticket"]
        document.getElementById("estateLabel").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("divisionLabel").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("blockLabel").innerHTML = filterLanguage[0]["content"]["block"]
        document.getElementById("driverLabel").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("noVehicleLabel").innerHTML = filterLanguage[0]["content"]["vehicle_number"] + "<span class='text-danger'>*</span>"
        document.getElementById("deliveryLabel").innerHTML = filterLanguage[0]["content"]["delivery_note"] + "<span class='text-danger'>*</span>"
        document.getElementById("totalBunchesLabel").innerHTML = filterLanguage[0]["content"]["total_bunches"]
        document.getElementById("looseFruitLabel").innerHTML = filterLanguage[0]["content"]["brondolan"]
        document.getElementById("plantingYearLabel").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("noteLabel").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("emptyBunchLabel").innerHTML = filterLanguage[0]["content"]["empty_bunch"]
        document.getElementById("overripeLabel").innerHTML = filterLanguage[0]["content"]["overripe"]
        document.getElementById("unripeLabel").innerHTML = filterLanguage[0]["content"]["unripe"]
        document.getElementById("longStalkLabel").innerHTML = filterLanguage[0]["content"]["long_stalk"]
        document.getElementById("mandatoryDeductionLabel").innerHTML = filterLanguage[0]["content"]["mandatory_deduction"]
        document.getElementById("incomingWeighing").innerHTML = filterLanguage[0]["content"]["incoming_weighing"]
        document.getElementById("dateInLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightInLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightIn").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("outgoingWeighing").innerHTML = filterLanguage[0]["content"]["outgoing_weighing"]
        document.getElementById("dateOutLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightOutLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightOut").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("total").innerHTML = filterLanguage[0]["content"]["total"]
        document.getElementById("grossWeightLabel").innerHTML = filterLanguage[0]["content"]["gross_weight"]
        document.getElementById("deductionLabel").innerHTML = filterLanguage[0]["content"]["deduction"]
        document.getElementById("netWeightLabel").innerHTML = filterLanguage[0]["content"]["net_weight"]
        document.getElementById("save").innerHTML = filterLanguage[0]["content"]["save_&_print"]
        document.getElementById("weighbridgeData").innerHTML = filterLanguage[0]["content"]["weighbridge_data"]
        document.getElementById("noVehicleThead").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("driverThead").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("estateThead").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("divisionThead").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("plantingYearThead").innerHTML = filterLanguage[0]["content"]["planting_year"]
    }
}
async function selectEstate(estateID) {
    const language = await JSON.parse(getCookie("language"));
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
            if (response["success"] == true) {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == estateID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != estateID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_company"] +
                        "'>" +
                        kapital(filternotSubData[i]["name"]) +
                        "</option>";
                }
                if (estateID == "" || estateID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }

                document.getElementById("estate").innerHTML = mainOptionItem + "" + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
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
    xhr.send(data);
    return false;
}
async function selectDivision(estateID, divisionID) {
    const language = await JSON.parse(getCookie("language"));
    const estate = estateID || document.getElementById("estate").value
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/division"
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
        estate_POST: estate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == divisionID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != divisionID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (estateID == "" || estateID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }

                document.getElementById("division").innerHTML = mainOptionItem + "" + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
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
    xhr.send(data);
    return false;
}
async function selectBlock(divisionID, blockID) {
    let language = await JSON.parse(getCookie("language"));
    const division = divisionID || document.getElementById("division").value
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/block"
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
        division_POST: division,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 201 || this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                let filterSubData = [];
                let filternotSubData = [];

                if (blockID && blockID !== "") {
                    filterSubData = responseData.filter((item) => blockID.includes(item.code_company));
                    // Konversi ke array (anggap kode berupa angka, jadi pakai map(Number))
                    // let codeArray = codeCOA.split(',').map(Number);
                    // filterSubData = responseData.filter((item) => codeArray.includes(item.code_coa));
                    filternotSubData = responseData.filter((item) => !blockID.includes(item.code_company));
                } else {
                    filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == blockID);
                    filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != blockID);
                }
                var mainOptionItem = "";
                var subOptionItem = "";
                for (var i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {

                } else {
                    for (var j = 0; j < filterSubData.length; j++) {
                        mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[j]["code_company"] + "' selected>" + kapital(filterSubData[j]["name"]) + "</option>";
                    }
                }
                document.getElementById('block').innerHTML = mainOptionItem + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
                }, 3000);
            }
        } else {
            handleErrorResponse(this.status, this.response);
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
    return false;
}