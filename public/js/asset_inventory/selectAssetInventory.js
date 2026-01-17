selectContent()
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
    await SelectAsset();

    async function dataContent(data) {
        var filterLanguage = data.filter(
            filtercontent => filtercontent.language == language
        );
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["asset_inventory"]
        document.getElementById("titleModal").innerHTML = content["asset_inventory"];
        document.getElementById("worksiteHeader").innerHTML = content["worksite"];
        document.getElementById("ALocationHeader").innerHTML = content["asset_location"];
        document.getElementById("codeAssetHeader").innerHTML = content["asset_code"];
        document.getElementById("yearHeader").innerHTML = content["acquisition_year"];
        document.getElementById("descriptionHeader").innerHTML = content["description"];
        document.getElementById("noteHeader").innerHTML = content["note"];
        document.getElementById("monthHeader").innerHTML = content["depreciation_period_months"];
        document.getElementById("projectHeader").innerHTML = content["project"];
        document.getElementById("statusHeader").innerHTML = content["status"];
        document.getElementById("actionsHeader").innerHTML = content["actions"];


        document.getElementById("assetTypeLabel").innerHTML = content["asset_type"] + "<span class='text-danger'>*</span>";
        document.getElementById("assetSubTypeLabel").innerHTML = content["asset_subtype"] + "<span class='text-danger'>*</span>";
        document.getElementById("nameLabel").innerHTML = content["item_master"];
        document.getElementById("noteLabel").innerHTML = content["note"];
        document.getElementById("companyLabel").innerHTML = content["company"];
        document.getElementById("worksiteLabel").innerHTML = content["worksite"];
        document.getElementById("historicalCostLabel").innerHTML = content["historical_cost"];
        document.getElementById("valueMonthlyLabel").innerHTML = content["monthly_depreciation"];
        document.getElementById("acquisitionYearLabel").innerHTML = content["acquisition_year"];
        document.getElementById("depreciationStartMonthLabel").innerHTML = content["depreciation_start"];
        document.getElementById("periodMonthsLabel").innerHTML = content["depreciation_end"];
        document.getElementById("locationLabel").innerHTML = content["asset_location"] + "<span class='text-danger'>*</span>";
        document.getElementById("paymentRefLabel").innerHTML = content["payment_reference"];
        document.getElementById("procurementDocLabel").innerHTML = content["procurement_number"];
        document.getElementById("leasingLabel").innerHTML = content["leasing"] + "<span class='text-danger'>*</span>";
        document.getElementById("statusLabel").innerHTML = content["status"];
    }
}
async function SelectAsset() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"];
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset";
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
                    let status;
                    let postingData;
                    let editData;
                    let location;
                    let assetCode
                    let project
                    let note
                    statusTemp = responseData[i]["status"];
                    noAsset = responseData[i]["id"]
                    locationTemp = responseData[i]["asset_location"];
                    assetCodeTemp = responseData[i]["asset_code"];
                    projectTemp = responseData[i]["project"];
                    noteTemp = responseData[i]["note"];
                    location = locationTemp !== null ? locationTemp : "";
                    assetCode = assetCodeTemp !== null ? assetCodeTemp : "";
                    project = projectTemp !== null ? projectTemp : "";
                    note = noteTemp !== null ? noteTemp : "";
                    if (statusTemp == 0) {
                        status = nonactive
                        editData = "<button title='" + edit + "' type='button' id='" + noAsset + "' onclick='showModalUpdateAsset(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "<button title='" + posting + "' type='button' id='" + noAsset + "' onclick='showModalUpdatePostingAsset(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                    } else if (statusTemp == 1) {
                        status = active
                        editData = "<button title='" + edit + "' type='button' id='" + noAsset + "' onclick='showModalUpdateAssetStatus(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "";
                    } else if (statusTemp == 2) {
                        status = damaged
                        editData = "<button title='" + edit + "' type='button' id='" + noAsset + "' onclick='showModalUpdateAssetStatus(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "";
                    } else if (statusTemp == 3) {
                        status = retired_asset
                        editData = "<button title='" + edit + "' type='button' id='" + noAsset + "' onclick='showModalUpdateAssetStatus(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "";
                    } else if (statusTemp == 4) {
                        status = lost
                        editData = "<button title='" + edit + "' type='button' id='" + noAsset + "' onclick='showModalUpdateAssetStatus(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + assetCode + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["worksite"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + location + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["acquisition_year"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["log_item_master"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + note + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["depreciation_period_months"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + project + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + status + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editData + postingData + "</div></td>\
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
                //     window.location.href = "/asset_inventory";
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
async function selectAssetType(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "assettype"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_asset_type == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_asset_type != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_asset_type"] + "'>" + filternotSubData[i]["code_asset_type"] + " - " + kapital(filternotSubData[i]["fat_asset_type_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_asset_type"] + "'>" + filternotSubData[0]["code_asset_type"] + " - " + kapital(filterSubData[0]["fat_asset_type_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("assetType").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
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
async function selectAssetSubType(code, assetType) {

    document.getElementById("assetSubType").disabled = false
    assetTypeCode = document.getElementById("assetType").value || assetType
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "assetsubtype/byassettypecode"
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
        code_POST: assetTypeCode,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_asset_subtype == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_asset_subtype != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' month='" + filternotSubData[i]["useful_life"] + "' value='" + filternotSubData[i]["code_asset_subtype"] + "'>" + filternotSubData[i]["code_asset_subtype"] + " - " + kapital(filternotSubData[i]["fat_asset_subtype_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' month='" + filterSubData[0]["useful_life"] + "' value='" + filterSubData[0]["code_asset_subtype"] + "'>" + filterSubData[0]["code_asset_subtype"] + " - " + kapital(filterSubData[0]["fat_asset_subtype_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("assetSubType").innerHTML = mainOptionItem + "" + subOptionItem;;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/asset_inventory";
                // }, 3000);
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
async function selectWorksiteLocation(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/asset"
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
                document.getElementById("location").innerHTML = mainOptionItem + "" + subOptionItem;;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
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
async function countDepreciation() {
    let historicalCost = unformatRupiah(document.getElementById("historicalCost").value)
    let assetSubTypeSelect = document.getElementById("assetSubType");
    let selectedOption = assetSubTypeSelect.options[assetSubTypeSelect.selectedIndex];
    let monthValue = Number(selectedOption.getAttribute("month"));
    let StartMonth = document.getElementById("depreciationStartMonth").value
    const [tahun, bulan] = StartMonth.split('-').map(Number);
    let startDate = new Date(tahun, bulan - 1, 1);
    startDate.setMonth(startDate.getMonth() + monthValue);
    let year = startDate.getFullYear();
    let month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    let resultEndMonth = `${year}-${month}`;
    let costMonth = customRound(parseFloat(historicalCost) / parseFloat(monthValue))
    document.getElementById("valueMonthly").value = formatRupiah(costMonth)
    document.getElementById("periodMonths").value = resultEndMonth
}