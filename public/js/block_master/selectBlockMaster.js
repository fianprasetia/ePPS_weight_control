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
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["block_master"]
        document.getElementById("estateHeaderLabel").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("divisiHeaderLabel").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("blockHeaderLabel").innerHTML = filterLanguage[0]["content"]["block"] + "<span class='text-danger'>*</span>"
        document.getElementById("plantingYearHeaderLabel").innerHTML = filterLanguage[0]["content"]["planting_year"] + "<span class='text-danger'>*</span>"
        document.getElementById("treeClassHeaderLabel").innerHTML = filterLanguage[0]["content"]["tree_class"] + "<span class='text-danger'>*</span>"
        document.getElementById("plantedAreaHeaderLabel").innerHTML = filterLanguage[0]["content"]["planted_area"] + "<span class='text-danger'>*</span>"
        document.getElementById("unplantedAreaHeaderLabel").innerHTML = filterLanguage[0]["content"]["unplanted_area"] + "<span class='text-danger'>*</span>"
        document.getElementById("numberOfTreesHeaderLabel").innerHTML = filterLanguage[0]["content"]["number_of_palms"] + "<span class='text-danger'>*</span>"
        document.getElementById("blockStatusHeaderLabel").innerHTML = filterLanguage[0]["content"]["block_status"] + "<span class='text-danger'>*</span>"
        document.getElementById("startHarvestHeaderLabel").innerHTML = filterLanguage[0]["content"]["harvest_start"] + "<span class='text-danger'>*</span>"
        document.getElementById("soilCodeHeaderLabel").innerHTML = filterLanguage[0]["content"]["soil_code"] + "<span class='text-danger'>*</span>"
        document.getElementById("soilClassificationHeaderLabel").innerHTML = filterLanguage[0]["content"]["soil_classification"] + "<span class='text-danger'>*</span>"
        document.getElementById("topographyHeaderLabel").innerHTML = filterLanguage[0]["content"]["topography"] + "<span class='text-danger'>*</span>"
        document.getElementById("nucleusPlasmaHeaderLabel").innerHTML = filterLanguage[0]["content"]["nucleus_plasma"] + "<span class='text-danger'>*</span>"
        document.getElementById("seedTypeHeaderLabel").innerHTML = filterLanguage[0]["content"]["seed_type"] + "<span class='text-danger'>*</span>"
        document.getElementById("blockData").innerHTML = filterLanguage[0]["content"]["block"]
        document.getElementById("plantingYearData").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("plantedAreaData").innerHTML = filterLanguage[0]["content"]["planted_area"]
        document.getElementById("unplantedAreaData").innerHTML = filterLanguage[0]["content"]["unplanted_area"]
        document.getElementById("numberOfTreesData").innerHTML = filterLanguage[0]["content"]["number_of_palms"]
        document.getElementById("blockStatusData").innerHTML = filterLanguage[0]["content"]["block_status"]
        document.getElementById("nucleusPlasmaData").innerHTML = filterLanguage[0]["content"]["nucleus_plasma"]
        document.getElementById("createByData").innerHTML = filterLanguage[0]["content"]["create_by"]
        document.getElementById("actionsListData").innerHTML = filterLanguage[0]["content"]["actions"]
    }
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertBlockMaster()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutUpdateData(id) {
    document.getElementById('estateHeader').disabled = true;
    document.getElementById('divisiHeader').disabled = true;
    document.getElementById('blockHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderBlockMaster").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateBlockMaster(id)
    // Fungsi-fungsi tetap dijalankan setelah penambahan atau duplikat
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
    document.getElementById('blockHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderBlockMaster").reset()
    await Promise.all([
        selectEstate(),
        selectTreeClass(),
        selectActivityType(),
        selectSoilCode(),
        selectSoilClassification(),
        selectTopologi(),
        selectNucleusPlasma(),
        selectSeedType()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;

}
async function showLayoutListData() {
    await selectBlockMaster();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function selectBlockMaster() {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "blockmaster";
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
                    const noBM = responseData[i]["code_company"];
                    editBM = "<button title='posting' type='button' id='" + noBM + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + responseData[i]["adm_company"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["planting_year"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["planted_area"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["unplanted_area"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["number_of_trees"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_activity_type"]["adm_activity_type_translations"][0]["translation"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["nucleus_plasma"] == 'nucleus' ? nucleus_estate : plasma_estate) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ editBM + "</div></td>\
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
async function selectEstate() {
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
                subOptionItem = "";
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + responseData[i]["code_company"] + "'>" + kapital(responseData[i]["name"]) + "</option>";
                }
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
async function selectDivision() {
    const estate = document.getElementById("estateHeader").value
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
            message:overload,
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
                subOptionItem = "";
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + responseData[i]["code_company"] + "'>" + kapital(responseData[i]["name"]) + "</option>";
                }
                document.getElementById("divisiHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectBlock(code) {
    const estate = document.getElementById("divisiHeader").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/block"
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
        worksite_POST: estate,
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
                document.getElementById("blockHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectTreeClass(selectedValue) {
    const responseValue = [`<= 1 ${meter}`, `> 1 ${meter} - <= 3 ${meter}`, `> 3 ${meter} - <= 5 ${meter}`, `> 5 ${meter} - <= 8 ${meter}`, `> 8 ${meter} - <= 13 ${meter}`, `>13 ${meter}`];
    const responseData = [`<= 1 ${meter}`, `> 1 ${meter} - <= 3 ${meter}`, `> 3 ${meter} - <= 5 ${meter}`, `> 5 ${meter} - <= 8 ${meter}`, `> 8 ${meter} - <= 13 ${meter}`, `>13 ${meter}`];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("treeClassHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectActivityType(code) {
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_activity_type == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_activity_type != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_activity_type"] + "'>" + kapital(filternotSubData[i]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_activity_type"] + "'>" + kapital(filterSubData[0]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("blockStatusHeader").innerHTML = mainOptionItem + "" + subOptionItem;

            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/block_master";
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
async function selectSoilCode(selectedValue) {
    const responseValue = ["entisol", "histosol", "inceptisol", "ultisol"];
    const responseData = [`${entisol}`, `${histosol}`, `${inceptisol}`, `${ultisol}`];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("soilCodeHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectSoilClassification(selectedValue) {
    const responseValue = ["s1", "s2", "s3", "s4"];
    const responseData = [`S1 (${mineral})`, `S2 (${mineral})`, `S3 (${mineral})`, `S4 (${mud})`];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("soilClassificationHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectTopologi(selectedValue) {
    const responseValue = ["undulating", "hill", "flat"];
    const responseData = [`${undulating}`, `${hill}`, `${flat}`];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("topographyHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectNucleusPlasma(selectedValue) {
    const responseValue = ["nucleus", "plasma"];
    const responseData = [`${nucleus_estate}`, `${plasma_estate}`];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("nucleusPlasmaHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectSeedType(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "seedtype"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.seed_type == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.seed_type != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["seed_type"] + "'>" + kapital(filternotSubData[i]["seed_type"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["seed_type"] + "'>" + kapital(filterSubData[0]["seed_type"]) + "</option>";
                }
                document.getElementById("seedTypeHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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