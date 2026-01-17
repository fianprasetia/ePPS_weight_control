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
        document.getElementById("titlePage").innerHTML = content["factory_operations"]
        document.getElementById("titleContent").innerHTML = content["factory_operations"]
        document.getElementById("millHeaderLabel").innerHTML = content["factory"] + "<span class='text-danger'>*</span>";
        document.getElementById("dateHeaderLabel").innerHTML = content["date"] + "<span class='text-danger'>*</span>";
        document.getElementById("shiftHeaderLabel").innerHTML = content["work_shift"] + "<span class='text-danger'>*</span>";
        document.getElementById("timeHeaderLabel").innerHTML = content["on_duty"] + "<span class='text-danger'>*</span>";
        document.getElementById("foremanHeaderLabel").innerHTML = content["foreman"] + "<span class='text-danger'>*</span>";
        document.getElementById("assistantHeaderLabel").innerHTML = content["assistant"] + "<span class='text-danger'>*</span>";
        document.getElementById("timeProcessHeaderLabel").innerHTML = content["total_working_hours"] + "<span class='text-danger'>*</span>";
        document.getElementById("breakdownHeaderLabel").innerHTML = content["total_repair_time"] + "<span class='text-danger'>*</span>";
        document.getElementById("NumberofCagesHeaderLabel").innerHTML = content["number_of_cages"] + "<span class='text-danger'>*</span>";
        document.getElementById("processedFFBHeaderLabel").innerHTML = content["processed_ffb_kg"] + "<span class='text-danger'>*</span>";
        document.getElementById("stationDetailLabel").innerHTML = content["station"] + "<span class='text-danger'>*</span>";
        document.getElementById("machineDetailLabel").innerHTML = content["machine"] + "<span class='text-danger'>*</span>";
        document.getElementById("timeRepairDetailLabel").innerHTML = content["repair_time"] + "<span class='text-danger'>*</span>";
        document.getElementById("breakdownDetailLabel").innerHTML = content["total_repair_time"] + "<span class='text-danger'>*</span>";
        document.getElementById("presureDetailLabel").innerHTML = content["presure"] + "<span class='text-danger'>*</span>";
        document.getElementById("noteDetailLabel").innerHTML = content["note"] + "<span class='text-danger'>*</span>";
        document.getElementById("statusDetailLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>";
        document.getElementById("stationThead").innerHTML = content["station"]
        document.getElementById("machineThead").innerHTML = content["machine"]
        document.getElementById("timeRepairThead").innerHTML = content["repair_time"]
        document.getElementById("downtimeThead").innerHTML = content["total_repair_time"]
        document.getElementById("presuretime").innerHTML = content["presure"]
        document.getElementById("noteThead").innerHTML = content["note"]
        document.getElementById("statusThead").innerHTML = content["status"]
        document.getElementById("noTransactionTable").innerHTML = content["transaction_number"]
        document.getElementById("locationTable").innerHTML = content["location"]
        document.getElementById("dateTable").innerHTML = content["date"]
        document.getElementById("workShiftTable").innerHTML = content["work_shift"]
        document.getElementById("downtimeTable").innerHTML = content["breakdown_time"]
        document.getElementById("foremanTable").innerHTML = content["foreman"]
        document.getElementById("assistantTable").innerHTML = content["assistant"]
        document.getElementById("createByTable").innerHTML = content["assistant"]
        document.getElementById("updateByTable").innerHTML = content["assistant"]
        document.getElementById("actionTable").innerHTML = content["assistant"]
    }
}
async function showLayoutCreateData() {
    await Promise.all([
        selectMill(),
        selectShift(),
        selectMandor(),
        selectAssiten(),
        selectStatus()
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
    await selectFactoryOperations()
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
async function showLayoutFactoryOperationsData(id) {
    document.getElementById('actionsOrder').disabled = true;
    document.getElementById('millHeader').disabled = true;
    document.getElementById('dateHeader').disabled = true;
    document.getElementById('shiftHeader').disabled = true;
    document.getElementById('startTime').disabled = true;
    document.getElementById('endTime').disabled = true;
    document.getElementById('foremanHeader').disabled = true;
    document.getElementById('assistantHeader').disabled = true;
    document.getElementById('timeProcessHeader').disabled = true;
    document.getElementById('breakdownHeader').disabled = true;
    document.getElementById('NumberofCagesHeader').disabled = true;
    document.getElementById('processedFFBHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById('formDetail').hidden = true;
    document.getElementById('load').innerHTML = "";
    document.getElementById("dataTableItem").innerHTML = ""
    await showUpdateFactoryOperations(id)
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function selectFactoryOperations(startDateList, endDateList) {
    document.getElementById("dataTable").innerHTML = ""
    const lastDate = new Date();
    const getToday = new Date();
    lastDate.setDate(getToday.getDate() - 30);
    startDate = startDateList || lastDate.getFullYear() + "-" + (lastDate.getMonth() + 1).toString().padStart(2, "0") + "-" + lastDate.getDate().toString().padStart(2, "0");
    endDate = endDateList || getToday.getFullYear() + "-" + (getToday.getMonth() + 1).toString().padStart(2, "0") + "-" + getToday.getDate().toString().padStart(2, "0");
    document.getElementById("startDate").value = ddmmyyyy(startDate);
    document.getElementById("endDate").value = ddmmyyyy(endDate);

    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const companyCode = dataCompany[0]["code_company"]

    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "factoryoperations";
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
        start_date_POST: startDate,
        end_date_POST: endDate,
        mill_POST: companyCode,
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
                    const statusTemp = responseData[i]["status"];
                    const noTransaction = responseData[i]["transaction_no"];
                    var statusData = "";
                    if (statusTemp == 0) {
                        statusData = request;
                        editData = "<button title='" + edit + "' type='button' id='" + noTransaction + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "<button title='" + posting + "' type='button' id='" + noTransaction + "' onclick='showModalPostingFactoryOperations(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                        deleteData = "<button title='" + trash + "' type='button' id='" + noTransaction + "' onclick='showModalDeleteFactoryOperations (id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                        viewPO = ""
                    } else if (statusTemp == 1) {
                        statusData = posting;
                        editData = "";
                        postingData = "";
                        deleteData = "";
                        viewPO = "<button title='view' type='button' id ='" + noTransaction + "'  onclick='showLayoutFactoryOperationsData(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></i></button>";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["transaction_no"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["factory"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["date"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["on_duty_time"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["off_duty_time"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["total_repair_time"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeForeman"] ? responseData[i]["employeeForeman"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeAssistant"] ? responseData[i]["employeeAssistant"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeCreate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeUpdate"]["fullname"] + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ editData + viewPO + postingData + deleteData + "</div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                document.getElementById("loadsearch").innerHTML = "  \
                    <div>\
                        <span onclick='selectEstateActivityByDate()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                        </span>\
                    <div>"
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
                document.getElementById("loadsearch").innerHTML = "  \
                    <div>\
                        <span onclick='selectEstateActivityByDate()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                        </span>\
                    </div>"
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
async function selectAssiten(employeeID) {
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

                document.getElementById("assistantHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function countHoursRepair() {
    let startTime = document.getElementById("startRepairTime").value;
    let endTime = document.getElementById("endRepairTime").value;

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

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    document.getElementById("breakdownDetail").value = `${hours} ${hour} ${minutes} ${minute}`;
}
async function selectStatus(selectedValue) {
    const responseValue = ["edt", "sdt", "cdt"];
    const responseData = [breakdown, stagnation, commercial_downtime];

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

    document.getElementById("statusDetail").innerHTML = mainOptionItem + subOptionItem;
    return selectedLabel;
}
async function selectItemRepair() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation");
                jQuery("#formDetail").validate({
                    ignore: [],
                    rules: {
                        "stationDetail": { required: !0 },
                        "machineDetail": { required: !0 },
                        "startRepairTime": { required: !0 },
                        "endRepairTime": { required: !0 },
                        "breakdownDetail": { required: !0 },
                        "startpresure": { required: !0 },
                        "endpresure": { required: !0 },
                        "noteDetail": { required: !0 },
                        "statusDetail": { required: !0 },
                    },
                    messages: {
                        "stationDetail": required,
                        "machineDetail": required,
                        "startRepairTime": required,
                        "endRepairTime": required,
                        "breakdownDetail": required,
                        "startpresure": required,
                        "endpresure": required,
                        "noteDetail": required,
                        "statusDetail": required
                    }
                });

                jQuery(".js-select2").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
                jQuery(".js-flatpickr").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
            }
            static init() {
                this.initValidation();
            }
        }
        Dashmix.onLoad(() => e.init());
    })();

    const form = jQuery("#formDetail");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const mill = document.getElementById("millHeader").value;
    var elementstation = document.querySelector("#stationDetail")
    const station = (elementstation.options[elementstation.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementstation.options[elementstation.selectedIndex].innerHTML
    var elementmachine = document.querySelector("#machineDetail")
    const machine = (elementmachine.options[elementmachine.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementmachine.options[elementmachine.selectedIndex].innerHTML
    const startRepairTime = document.getElementById("startRepairTime").value;
    const endRepairTime = document.getElementById("endRepairTime").value;
    const breakdown = document.getElementById("breakdownDetail").value;
    const startpresure = document.getElementById("startpresure").value;
    const endpresure = document.getElementById("endpresure").value;
    const note = document.getElementById("noteDetail").value;
    var elementstatus = document.querySelector("#statusDetail")
    const status = (elementstatus.options[elementstatus.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementstatus.options[elementstatus.selectedIndex].innerHTML
    const codeStation = document.getElementById("stationDetail").value;
    const codeMachine = document.getElementById("machineDetail").value;
    const codeStatus = document.getElementById("statusDetail").value;

    let isDuplicate = false;


    const existingRows = document.querySelectorAll("#dataTableItem tr");
    for (let row of existingRows) {
        const cell = row.cells[1];
        if (cell && cell.textContent.trim() === machine) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: duplicate.replace("{{mesin}}", `${duplicate_machine}`) });
    } else {
        const index = existingRows.length;
        addRowItemRepair(
            index,
            station,
            machine,
            startRepairTime,
            endRepairTime,
            breakdown,
            startpresure,
            endpresure,
            note,
            status,
            codeStation,
            codeMachine,
            codeStatus
        );
    }
    await selectStation(mill);
    await selectStatus()
    document.getElementById("machineDetail").innerHTML = "";
    document.getElementById("formDetail").reset();
}
async function addRowItemRepair(
    index,
    station,
    machine,
    startRepairTime,
    endRepairTime,
    breakdown,
    startpresure,
    endpresure,
    note,
    status,
    codeStation,
    codeMachine,
    codeStatus
) {
    const table = document.getElementById("dataTableItem")
    const row = table.insertRow();
    row.id = "row" + index;

    const cellremove = row.insertCell(0);
    cellremove.innerHTML = `
        <div div class='btn-group' >
            <button type='button' title="${edit}" id="${index}" onclick="showDataItemRepairDetail('${row.id}')" class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>
            <button type="button" title="${trash}" class="btn btn-danger" id="${index}" onclick="deleteRow('${row.id}')"><i class="fa-regular fa-trash-can"></i></button>
        </div > `;
    cellremove.className = "text-center";

    const cellstation = row.insertCell(1);
    cellstation.innerHTML = station;
    cellstation.className = "text-center fw-light text-uppercase";

    const cellmachine = row.insertCell(2);
    cellmachine.innerHTML = machine;
    cellmachine.className = "text-center fw-light text-uppercase";

    const cellstartRepairTime = row.insertCell(3);
    cellstartRepairTime.innerHTML = startRepairTime;
    cellstartRepairTime.className = "text-center fw-light text-uppercase";

    const cellendRepairTime = row.insertCell(4);
    cellendRepairTime.innerHTML = endRepairTime;
    cellendRepairTime.className = "text-center fw-light text-uppercase";

    const cellbreakdown = row.insertCell(5);
    cellbreakdown.innerHTML = breakdown;
    cellbreakdown.className = "text-center fw-light text-uppercase";

    const cellstartpresure = row.insertCell(6);
    cellstartpresure.innerHTML = startpresure;
    cellstartpresure.className = "text-center fw-light text-uppercase";

    const cellendpresure = row.insertCell(7);
    cellendpresure.innerHTML = endpresure;
    cellendpresure.className = "text-center fw-light text-uppercase";

    const cellnote = row.insertCell(8);
    cellnote.innerHTML = note;
    cellnote.className = "text-center fw-light text-uppercase";

    const cellstatus = row.insertCell(9);
    cellstatus.innerHTML = status;
    cellstatus.className = "text-center fw-light text-uppercase";

    const cellcodeStation = row.insertCell(10);
    cellcodeStation.innerHTML = codeStation;
    cellcodeStation.hidden = true;

    const cellcodeMachine = row.insertCell(11);
    cellcodeMachine.innerHTML = codeMachine;
    cellcodeMachine.hidden = true;

    const cellcodeStatus = row.insertCell(12);
    cellcodeStatus.innerHTML = codeStatus;
    cellcodeStatus.hidden = true;
}








































































