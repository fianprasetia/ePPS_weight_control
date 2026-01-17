selectContent()
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();

    await dataContent(jsonData);
    await showLayoutListData()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["average_bunch_weight"] + " (" + filterLanguage[0]["content"]["abw"] + ")"
        document.getElementById("divisionThead").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("periodThead").innerHTML = filterLanguage[0]["content"]["period"]
        document.getElementById("actionThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("BlockThead").innerHTML = filterLanguage[0]["content"]["block"]
        // document.getElementById("estateHeaderLabel").innerHTML = filterLanguage[0]["content"]["estate"] + "<span class='text-danger'>*</span>"
        // document.getElementById("treeClassHeaderLabel").innerHTML = filterLanguage[0]["content"]["tree_class"] + "<span class='text-danger'>*</span>"
        // document.getElementById("plantedAreaHeaderLabel").innerHTML = filterLanguage[0]["content"]["planted_area"] + "<span class='text-danger'>*</span>"
        // document.getElementById("unplantedAreaHeaderLabel").innerHTML = filterLanguage[0]["content"]["unplanted_area"] + "<span class='text-danger'>*</span>"
        // document.getElementById("numberOfTreesHeaderLabel").innerHTML = filterLanguage[0]["content"]["number_of_palms"] + "<span class='text-danger'>*</span>"
        // document.getElementById("blockStatusHeaderLabel").innerHTML = filterLanguage[0]["content"]["block_status"] + "<span class='text-danger'>*</span>"
        // document.getElementById("startHarvestHeaderLabel").innerHTML = filterLanguage[0]["content"]["harvest_start"] + "<span class='text-danger'>*</span>"
        // document.getElementById("soilCodeHeaderLabel").innerHTML = filterLanguage[0]["content"]["soil_code"] + "<span class='text-danger'>*</span>"
        // document.getElementById("soilClassificationHeaderLabel").innerHTML = filterLanguage[0]["content"]["soil_classification"] + "<span class='text-danger'>*</span>"
        // document.getElementById("topographyHeaderLabel").innerHTML = filterLanguage[0]["content"]["topography"] + "<span class='text-danger'>*</span>"
        // document.getElementById("nucleusPlasmaHeaderLabel").innerHTML = filterLanguage[0]["content"]["nucleus_plasma"] + "<span class='text-danger'>*</span>"
        // document.getElementById("seedTypeHeaderLabel").innerHTML = filterLanguage[0]["content"]["seed_type"] + "<span class='text-danger'>*</span>"
        // document.getElementById("blockData").innerHTML = filterLanguage[0]["content"]["block"]
        // document.getElementById("plantingYearData").innerHTML = filterLanguage[0]["content"]["planting_year"]
        // document.getElementById("plantedAreaData").innerHTML = filterLanguage[0]["content"]["planted_area"]
        // document.getElementById("unplantedAreaData").innerHTML = filterLanguage[0]["content"]["unplanted_area"]
        // document.getElementById("numberOfTreesData").innerHTML = filterLanguage[0]["content"]["number_of_palms"]
        // document.getElementById("blockStatusData").innerHTML = filterLanguage[0]["content"]["block_status"]
        // document.getElementById("nucleusPlasmaData").innerHTML = filterLanguage[0]["content"]["nucleus_plasma"]
        // document.getElementById("createByData").innerHTML = filterLanguage[0]["content"]["create_by"]
        // document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"]
    }
}
async function showLayoutUpdateData(id) {
    document.getElementById('estateHeader').disabled = true;
    document.getElementById('divisiHeader').disabled = true;
    document.getElementById('periodDateHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = true
    document.getElementById("formHeaderAverageBunchRate").reset()
     document.getElementById("averageBunchRateItemData").innerHTML = "";
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateAverageBunchRate(id)
    await Promise.all([
        // selectCOA(),
        // selectDepartment(),
        // selectAsset()
    ]);

    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData(id) {
    document.getElementById('estateHeader').disabled = false;
    document.getElementById('divisiHeader').disabled = false;
    document.getElementById('periodDateHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = false
    document.getElementById("formHeaderAverageBunchRate").reset()
    document.getElementById("averageBunchRateItemData").innerHTML = "";
    document.getElementById("load").innerHTML = ""
    document.getElementById("divisiHeader").innerHTML = "";
    await Promise.all([
        selectEstate(),
        // selectTreeClass(),
        // selectActivityType(),
        // selectSoilCode(),
        // selectSoilClassification(),
        // selectTopologi(),
        // selectNucleusPlasma(),
        // selectSeedType()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;

}
async function showLayoutListData() {
    await selectAverageBunchRate();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function selectAverageBunchRate() {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "averagebunchrate";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
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
            await resetDataTables()
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    const division = responseData[i]["division"];
                    const period = responseData[i]["period"];
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["adm_company.name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + yyyymm(responseData[i]["period"]) + "</td>\
                            <td class='fw-light text-center'><button title='posting' type='button' id='" + no + "' period ='" + period + "' division ='" + division + "' onclick='showLayoutUpdateData(this)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button></td>\
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
                    message: message,
                });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                document.getElementById("dataTable").innerHTML = ""
                await table();
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
                document.getElementById("estateHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/average_bunch_weight";
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
async function selectDivision(estateCode, code) {
    const estate = estateCode || document.getElementById("estateHeader").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
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
        division_POST: estate,
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
                document.getElementById("divisiHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/average_bunch_weight";
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
async function selectAverageBunchWeightProduction() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeaderAverageBunchRate").validate({
                        ignore: [],
                        rules: {
                            "estateHeader": { required: !0 },
                            "divisiHeader": { required: !0 },
                            "periodDateHeader": { required: !0 },
                        },
                        messages: {
                            "estateHeader": required,
                            "divisiHeader": required,
                            "periodDateHeader": required,
                        },
                    }),
                    jQuery(".js-select2").on("change", (e) => {
                        jQuery(e.currentTarget).valid();
                    });
                jQuery(".js-flatpickr").on("change", (e) => {
                    jQuery(e.currentTarget).valid();
                });
            }
            static init() {
                this.initValidation();
            }
        }
        Dashmix.onLoad(() => e.init());
    })();
    const form = jQuery("#formHeaderAverageBunchRate");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    await resetDataTables()
    document.getElementById("averageBunchRateItemData").innerHTML = "";
    document.getElementById("dataTable").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    const estate = document.getElementById("estateHeader").value
    const divisi = document.getElementById("divisiHeader").value
    const periodDate = yyyymm(document.getElementById("periodDateHeader").value)
    const targetDate = new Date(`${periodDate}-01`);
    targetDate.setMonth(targetDate.getMonth() - 1);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const targetMonth = `${year}-${month}`
   if (!token) {
        token = await getAccessToken(); 
    }

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "averagebunchrate/byproduction";
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
            "<div  class=''>\
              <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
             </span>\
                <div>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };

    var data = JSON.stringify({
        language_POST: language,
        estate_POST: estate,
        divisi_POST: divisi,
        period_date_POST: periodDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = await response["data"];
                responseData.finalResultActivity.forEach((activity, index) => {
                    const avg = responseData.finalResultAverage.find(
                        a => a.block === activity.code_company
                    );
                    addRow(
                        index + 1,
                        activity.code_company,
                        avg.average_bunch_rate,
                        activity.bjr,
                    );
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectAverageBunchWeightProduction()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-list'></i>\
                </span>"
                document.getElementById("BJRBefore").innerHTML = `${abw} (${mmyyyy(targetMonth)})`;
                document.getElementById("BJRNow").innerHTML = `${abw} (${mmyyyy(periodDate)})`;
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertAverageBunchRate()' class='btn  btn-primary'>" + kapital(process) + "</a>";
                await table();
            } else if (response["access"] == "failed") {
                const message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/average_bunch_weight";
                }, 3000);
            }
        }

        if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 500) {
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
async function addRow(index, company, average_bunch_rate, bjr) {
    const table = document
        .getElementById("averageBunchRate")
        .getElementsByTagName("tbody")[0];
    var rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.id = "row" + index;

    // Kolom No
    const noRow = row.insertCell(0);
    noRow.innerHTML = rowCount;
    noRow.className = "text-center fw-light text-uppercase";
    noRow.style.width = "5%";

    // Kolom Company
    const companyRow = row.insertCell(1);
    companyRow.innerHTML = company;
    companyRow.className = "text-center fw-light text-uppercase";
    companyRow.style.width = "25%";

    // Kolom Period
    const averageRow = row.insertCell(2);
    averageRow.innerHTML = average_bunch_rate;
    averageRow.className = "text-center fw-light text-uppercase";
    averageRow.style.width = "20%";

    // Kolom BJR
    const bjrRow = row.insertCell(3);
    bjrRow.innerHTML = `<input type="text" class="form-control text-center fw-light text-uppercase" id="bjr${index}" value="${bjr}" name="bjr[]" oninput="validateDouble(this)" style="width:100%; text-align:right;">`;
    bjrRow.className = "text-center fw-light text-uppercase";
    bjrRow.style.width = "20%";
}
