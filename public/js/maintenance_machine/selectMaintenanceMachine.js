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
    await showLayoutListData()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        // document.getElementById("titlePage").innerHTML = content["factory_operations"]
        // document.getElementById("titleContent").innerHTML = content["factory_operations"]
        // document.getElementById("millHeaderLabel").innerHTML = content["factory"] + "<span class='text-danger'>*</span>";
        // document.getElementById("dateHeaderLabel").innerHTML = content["date"] + "<span class='text-danger'>*</span>";
        // document.getElementById("shiftHeaderLabel").innerHTML = content["work_shift"] + "<span class='text-danger'>*</span>";
        // document.getElementById("timeHeaderLabel").innerHTML = content["on_duty"] + "<span class='text-danger'>*</span>";
        // document.getElementById("foremanHeaderLabel").innerHTML = content["foreman"] + "<span class='text-danger'>*</span>";
        // document.getElementById("assistantHeaderLabel").innerHTML = content["assistant"] + "<span class='text-danger'>*</span>";
        // document.getElementById("timeProcessHeaderLabel").innerHTML = content["total_working_hours"] + "<span class='text-danger'>*</span>";
        // document.getElementById("breakdownHeaderLabel").innerHTML = content["total_repair_time"] + "<span class='text-danger'>*</span>";
        // document.getElementById("NumberofCagesHeaderLabel").innerHTML = content["number_of_cages"] + "<span class='text-danger'>*</span>";
        // document.getElementById("processedFFBHeaderLabel").innerHTML = content["processed_ffb_kg"] + "<span class='text-danger'>*</span>";
        // document.getElementById("stationDetailLabel").innerHTML = content["station"] + "<span class='text-danger'>*</span>";
        // document.getElementById("machineDetailLabel").innerHTML = content["machine"] + "<span class='text-danger'>*</span>";
        // document.getElementById("timeRepairDetailLabel").innerHTML = content["repair_time"] + "<span class='text-danger'>*</span>";
        // document.getElementById("breakdownDetailLabel").innerHTML = content["total_repair_time"] + "<span class='text-danger'>*</span>";
        // document.getElementById("presureDetailLabel").innerHTML = content["presure"] + "<span class='text-danger'>*</span>";
        // document.getElementById("noteDetailLabel").innerHTML = content["note"] + "<span class='text-danger'>*</span>";
        // document.getElementById("statusDetailLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>";
        // document.getElementById("stationThead").innerHTML = content["station"]
        // document.getElementById("machineThead").innerHTML = content["machine"]
        // document.getElementById("timeRepairThead").innerHTML = content["repair_time"]
        // document.getElementById("downtimeThead").innerHTML = content["total_repair_time"]
        // document.getElementById("presuretime").innerHTML = content["presure"]
        // document.getElementById("noteThead").innerHTML = content["note"]
        // document.getElementById("statusThead").innerHTML = content["status"]
    }
}
async function showLayoutCreateData() {
    await Promise.all([
        selectMill(),
        selectShift(),
        selectMandor(),
        selectType(),
        selectStatus(),
        selectCompanyWarehouse()
    ]);
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeader").reset()
    document.getElementById('formDetail').hidden = false;
    document.getElementById("dataTableItem").innerHTML = ""
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertFactoryOperations()' class='btn  btn-primary'>" + kapital(done) + "</a>";
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutListData() {
    // await selectFactoryOperations()
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function showLayoutUpdateData(id) {
    showSpinner()
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeader").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateFactoryOperations(id)
    document.getElementById("formDetail").reset();
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + code + "' onclick='updateFactoryOperations(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function selectMill(code) {
    const language = await JSON.parse(getCookie("language"));
    let dataCompany = await JSON.parse(getCookie("dataCompany"));
    let companyCode = dataCompany[0]["code_company"]
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/harvest"
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
        worksite_POST: companyCode
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
                document.getElementById("millHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/harvest_activities";
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
async function selectStation(code) {
    const language = await JSON.parse(getCookie("language"));
    const worksite = document.getElementById("millHeader").value
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/station"
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
        mill_POST: worksite
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
                document.getElementById("stationDetail").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });



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
async function selectEngine(codeStation, code) {
    const language = await JSON.parse(getCookie("language"));
    const worksite = codeStation || document.getElementById("stationDetail").value
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/station"
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
        mill_POST: worksite
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
                document.getElementById("machineDetail").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });



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
async function selectShift(selectedValue) {
    const responseValue = [1, 2, 3];
    const responseData = ["1", "2", "3"];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("shiftHeader").innerHTML = mainOptionItem + subOptionItem;
}
async function selectMandor(employeeID) {
    const language = await JSON.parse(getCookie("language"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyCode = companyType[0]["code_company"]
    const companyParent = companyType[0]["parent_code"]
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/worksite"
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
        companyCode_POST: companyCode,
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == employeeID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != employeeID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' worksite=" + filternotSubData[i]["worksite"] + " value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"] + " (" + filternotSubData[i]["worksite"] + ")") +
                        "</option>";
                }
                if (employeeID == "" || employeeID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase'  worksite=" + filterSubData[0]["worksite"] + "  value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"] + " (" + filterSubData[0]["worksite"] + ")") + "</option>";
                }

                document.getElementById("foremanHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });



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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function checkDate() {
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const date = yyyymmdd(document.getElementById("dateHeader").value)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "accountingperiods/bycode";
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
        worksite_POST: worksite,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                const period = responseData[0]["period"]
                const yearAndMonth = date.split("-").slice(0, 2).join("-");
                if (yearAndMonth < period) {
                    Dashmix.helpers("jq-notify", {
                        type: "danger", z_index: 2000, message: out_of_period
                    });
                    document.getElementById("dateHeader").value = ""
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });



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
async function countHours() {
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;
    let breakdownTime = document.getElementById("breakdownHeader").value;

    if (!startTime || !endTime) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: time_no_empty });
        return;
    }


    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let diff = endMinutes - startMinutes;


    if (diff < 0) {
        diff += 24 * 60;
    }


    let breakdownMinutes = 0;
    if (breakdownTime) {
        const [bh, bm] = breakdownTime.split(":").map(Number);
        breakdownMinutes = bh * 60 + bm;
    }


    let finalMinutes = diff - breakdownMinutes;
    if (finalMinutes < 0) finalMinutes = 0;

    const hours = Math.floor(finalMinutes / 60);
    const minutes = finalMinutes % 60;

    document.getElementById("timeProcessHeader").value = `${hours} ${hour} ${minutes} ${minute}`;
}
async function selectStatus(selectedValue) {
    const responseValue = ["LN", "PR", "SL"];
    const responseData = [continu, process, done];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";
    let selectedLabel = null;

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";

        if (selected) {
            selectedLabel = label;
        }

        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }

    document.getElementById("statusHeader").innerHTML = mainOptionItem + subOptionItem;
    return selectedLabel;
}
async function selectType(selectedValue) {
    const responseValue = ["PM", "CB", "CM", "FB", "PJ", "SV"];
    const responseData = [preventive_maintenance, calibration, corrective_maintenance, fabrication, project, service];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";
    let selectedLabel = null;

    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";

        if (selected) {
            selectedLabel = label;
        }

        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }

    document.getElementById("typeRepairHeader").innerHTML = mainOptionItem + subOptionItem;
    return selectedLabel;
}
var noRow = 1
async function addDetail() {
    var newid = noRow++;
    await selectItemWarehouse(newid)
    // await selectActivityType(newid)
    // await selectDivision(newid)
    // await selectAsset(newid);
    $('#dataTableItem').append(`
        <tr id="row${newid}">
        <td class="text-center"><a type="button" class="btn btn-danger" id='${newid}' onclick="deleteRow(id)"> <i class="fa-regular fa-trash-can"></i></a></td>
            <td><select class="js-select2 form-select fw-light text-uppercase" name="codeItemDetail[]" onchange="itemMaster(${newid})" id="codeItemDetail${newid}" style="width: 100%"></select></td>
            <td><input type="text" class="form-control text-end text-uppercase" value="0" id="qtyStockDetail${newid}" name="qtyStockDetail[]" disabled/></td>
            <td><input type="text" class="form-control text-center text-uppercase" id="uomDetail${newid}" name="uomDetail[]" disabled/></td>
            <td><input type="text" class="form-control text-end text-uppercase" value="0" onkeyup="compareQty()"  onfocus="removeZero(this)" id="qtyDetail${newid}" name="qtyDetail[]" /></td>
        </tr>
    `);
    $(`#codeItemDetail${newid}, #activityTypeDetail${newid}, #blokDetail${newid}, #assetDetail${newid}, #ActivityDetail${newid}`).select2();
}
async function selectCompanyWarehouse() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
   var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const url = mainUrl + "company/warehouse";
    const data = {
        worksite_POST: worksite,
        language_POST: language
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            const responseData = await response.json();
            if (responseData.access === "success") {
                const dataPeriod = responseData.data.dataPeriod[0];
                const dataWarehouse = responseData.data.dataWarehouse[0];
                // codeWareHouse = dataWarehouse["code_company"];
                // document.getElementById("startDateList").innerHTML = ddmmyyyy(dataPeriod.start_date);
                // document.getElementById("endDateList").innerHTML = ddmmyyyy(dataPeriod.finish_date);
                // document.getElementById("warehouseName").innerHTML = dataWarehouse.name;
                document.getElementById("codeWHform").value = dataWarehouse.code_company;
                // startDateSearch = ddmmyyyy(dataPeriod.start_date);
                // endDateSeacrh = ddmmyyyy(dataPeriod.finish_date);
                // await SelectGoodsIssue(startDateSearch, endDateSeacrh, codeWareHouse)
            } else if (responseData.access === "failed") {
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: responseData.message
                });
                 setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(() => {
                //     window.location.href = "/goods_receipt_asset";
                // }, 3000);
            }
        } else if (response.status === 404) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 401) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_401
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
        });
        setTimeout(async () => {
            await keluar();
        }, 3000);
    }
}
async function selectItemWarehouse(rowIndex, itemCode) {
    let codeWh = document.getElementById("codeWHform").value
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse"
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
        warehouse_POST: codeWh,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]["dataWarehouse"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_item == itemCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_item != itemCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_item"] + "'>" + filternotSubData[i]["code_item"] + " - " + kapital(filternotSubData[i]["log_item_master"]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_item"] + "'>" + filterSubData[0]["code_item"] + " - " + kapital(filterSubData[0]["log_item_master"]["name"]) + "</option>";
                }
                $(`#codeItemDetail${rowIndex}`).html(mainOptionItem + subOptionItem);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
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
async function itemMaster(rowIndex, itemCode) {
    let codeItemTemp = document.getElementById(`codeItemDetail${rowIndex}`).value;
    codeItem = codeItemTemp || itemCode
    let codeWh = document.getElementById("codeWHform").value
    const allSelects = document.querySelectorAll('select[name="codeItemDetail[]"]');
    let count = 0;
    allSelects.forEach(select => {
        if (select.value === codeItem) count++;
    });
    if (count > 1) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: item_already_exists,
        });
        await selectItemWarehouse(rowIndex)
        return false;
    }
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse/byitem"
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
        warehouse_POST: codeWh,
        item_code_POST: codeItem,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                qty = parseFloat(responseData[0]["initial_qty"]) + parseFloat(responseData[0]["incoming_qty"]) - parseFloat(responseData[0]["outgoing_qty"])
                document.getElementById(`uomDetail${rowIndex}`).value = responseData[0]["log_item_master"]["uom"]
                document.getElementById(`qtyStockDetail${rowIndex}`).value = qty
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
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