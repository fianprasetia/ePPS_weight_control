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
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["harvest_activities"]
        document.getElementById("titleContent").innerHTML = filterLanguage[0]["content"]["harvest_activities"]
        document.getElementById("typeHeaderLabel").innerHTML = filterLanguage[0]["content"]["type"] + "<span class='text-danger'>*</span>"
        document.getElementById("createDateHeaderLabel").innerHTML = filterLanguage[0]["content"]["date"] + "<span class='text-danger'>*</span>"
        document.getElementById("estateHeaderLabel").innerHTML = filterLanguage[0]["content"]["estate"] + "<span class='text-danger'>*</span>"
        document.getElementById("mandorHeaderLabel").innerHTML = filterLanguage[0]["content"]["foreman"]
        document.getElementById("mandor1HeaderLabel").innerHTML = filterLanguage[0]["content"]["foreman"] + " 1"
        document.getElementById("divisionClerkHeaderLabel").innerHTML = filterLanguage[0]["content"]["division_clerk"]
        document.getElementById("transportClerkHeaderLabel").innerHTML = filterLanguage[0]["content"]["transport_clerk"]
        document.getElementById("transactionThead").innerHTML = filterLanguage[0]["content"]["transport_clerk"]
        document.getElementById("locationThead").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("dateThead").innerHTML = filterLanguage[0]["content"]["date"]
        document.getElementById("foremanThead").innerHTML = filterLanguage[0]["content"]["foreman"]
        document.getElementById("foreman1Thead").innerHTML = filterLanguage[0]["content"]["foreman"] + " 1"
        document.getElementById("divisionClerkThead").innerHTML = filterLanguage[0]["content"]["division_clerk"]
        document.getElementById("transportClerkThead").innerHTML = filterLanguage[0]["content"]["transport_clerk"]
        document.getElementById("createThead").innerHTML = filterLanguage[0]["content"]["create_by"]
        document.getElementById("updateThead").innerHTML = filterLanguage[0]["content"]["update_by"]
        document.getElementById("sourceThead").innerHTML = filterLanguage[0]["content"]["access"]
        document.getElementById("actionThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("EmployeeThead").innerHTML = filterLanguage[0]["content"]["employee"]
        document.getElementById("blockThead").innerHTML = filterLanguage[0]["content"]["block"]
        document.getElementById("plantingYearsThead").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("basicFFBThead").innerHTML = filterLanguage[0]["content"]["harvest_basis"]
        document.getElementById("averageBunchThead").innerHTML = filterLanguage[0]["content"]["abw"]
        document.getElementById("WorkResultThead").innerHTML = filterLanguage[0]["content"]["work_results"]
        document.getElementById("wageThead").innerHTML = filterLanguage[0]["content"]["basic_salary"]
        document.getElementById("premiThead").innerHTML = filterLanguage[0]["content"]["harvest_incentive"]
        document.getElementById("penaltyThead").innerHTML = filterLanguage[0]["content"]["harvest_penalty"]
        document.getElementById("nominalPenaltyThead").innerHTML = filterLanguage[0]["content"]["nominal_penalty"]
        document.getElementById("totalIncomeThead").innerHTML = filterLanguage[0]["content"]["total_income"]
    }
}
async function showLayoutUpdateData(id) {
    document.getElementById('createDateHeader').disabled = false;
    document.getElementById('estateHeader').disabled = false;
    document.getElementById('mandorHeader').disabled = false;
    document.getElementById('mandor1Header').disabled = false;
    document.getElementById('typeHeader').disabled = false;
    document.getElementById('divisionClerkHeader').disabled = false;
    document.getElementById('transportClerkHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById('formHarvestActivityDetail').hidden = false;
    document.getElementById("haverstActivityDataTbody").innerHTML = ""
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateHarvestActivity(id)
    await Promise.all([
        selectHarvestPenalty(),
        selectEmployee()
    ]);
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code=" + id + " onclick='updateHarvestActivity(this)' class='btn  btn-primary'>" + kapital(process) + "</a>"
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData() {
    document.getElementById('createDateHeader').disabled = false;
    document.getElementById('estateHeader').disabled = false;
    document.getElementById('mandorHeader').disabled = false;
    document.getElementById('mandor1Header').disabled = false;
    document.getElementById('typeHeader').disabled = false;
    document.getElementById('divisionClerkHeader').disabled = false;
    document.getElementById('transportClerkHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById('load').hidden = true;
    document.getElementById('formHarvestActivityDetail').hidden = false;
    document.getElementById("formHarvestActivityHeader").reset()
    document.getElementById("formHarvestActivityDetail").reset()
    document.getElementById("haverstActivityDataTbody").innerHTML = ""
    await Promise.all([
        selectHarvestPenalty(),
        selectHarvestType(),
        selectEstate(),
        selectMandor(),
        selectMandor1(),
        selectKeraniDivisi(),
        selectKeraniTransport(),
        selectEmployee()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertHarvestActivity()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutListData() {
    await selectEstateActivity();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function showLayoutHarvestActivityData(id) {
    document.getElementById('createDateHeader').disabled = true;
    document.getElementById('estateHeader').disabled = true;
    document.getElementById('mandorHeader').disabled = true;
    document.getElementById('mandor1Header').disabled = true;
    document.getElementById('typeHeader').disabled = true;
    document.getElementById('divisionClerkHeader').disabled = true;
    document.getElementById('transportClerkHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById('formHarvestActivityDetail').hidden = true;
    document.getElementById('load').innerHTML = "";
    document.getElementById("haverstActivityDataTbody").innerHTML = ""
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateHarvestActivity(id)
    await Promise.all([
        selectHarvestPenalty(),
        selectEmployee()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function selectEstateActivity(startDateList, endDateList) {
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
    var url = mainUrl + "estateactivity";
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
        company_code_POST: companyCode,
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
                    var statusPV = "";
                    if (statusTemp == 0) {
                        statusPV = request;
                        editPV = "<button title='posting' type='button' id='" + noTransaction + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingPV = "<button title='posting' type='button' id='" + noTransaction + "' onclick='showModalPostingHarvestActivityByCode(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                        deletePV = "<button title='delete' type='button' id='" + noTransaction + "' onclick='showModalDeleteHarvestActivityByCode (id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                        viewPO = ""
                    } else if (statusTemp == 1) {
                        statusPV = posting;
                        editPV = "";
                        postingPV = "";
                        deletePV = "";
                        viewPO = "<button title='view' type='button' id ='" + noTransaction + "'  onclick='showLayoutHarvestActivityData(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></i></button>";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["transaction_no"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["location"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(responseData[i]["date"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeForeman"] ? responseData[i]["employeeForeman"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeforeman_1"] ? responseData[i]["employeeforeman_1"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeDivision"] ? responseData[i]["employeeDivision"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["employeeLoading"] ? responseData[i]["employeeLoading"]["fullname"] : "") + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeCreate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeUpdate"]["fullname"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["source_type"] == 0 ? desktop : mobile) + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>"+ editPV + viewPO + postingPV + deletePV + "</div></td>\
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
async function selectEstateActivityByDate() {
    const startDate = yyyymmdd(document.getElementById("startDate").value)
    const endDate = yyyymmdd(document.getElementById("endDate").value)
    document.getElementById("loadsearch").disabled = true
    document.getElementById("loadsearch").innerHTML =
        "<div>\
            <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
            </span>\
          <div>";
    await selectEstateActivity(startDate, endDate)
}
async function selectHarvestPenalty() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    let dataCompany = await JSON.parse(getCookie("dataCompany"));
    let companyCode = dataCompany[0]["code_company"]
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestpenalty/harvest";
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
        company_POST: companyCode,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                let chunkSize = 5;
                let tableItem = `
                        <th class="text-center fw-light  text-uppercase" style="width: 10px">${harvest_area}</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${work_results}</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${brondolan}</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${work_results_kg}</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${harvest_incentive} (RP)</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${lebih_basis_rp}</th>
                        <th class="text-center fw-light text-uppercase" style="width: 10px">${brondolan__rp}</th>`
                let inputItem = `
                    <div class="col-sm-4 mb-2">
                        <div class="mb-2">
                            <label class="form-label text-uppercase" id="blockHeaderLabel" for="blockHeader">${block}<span class='text-danger'>*</span></label>
                            <select class="js-select2 form-select fw-light text-uppercase" name="blockHeader" id="blockHeader" style="width: 100%"></select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label text-uppercase" id="employeeHeaderLabel" for="employeeHeader">${employee}<span class='text-danger'>*</span></label>
                            <select class="js-select2 form-select fw-light text-uppercase" name="employeeHeader" id="employeeHeader" style="width: 100%"></select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label text-uppercase" id="workResultsHeaderLabel" for="workResultsHeader">${work_results}<span class='text-danger'>*</span></label>
                            <input type="text" class="form-control fw-light text-uppercase text-end" id="workResultsHeader" name="workResultsHeader" value="0" onkeyup="validateNumber(this);" onfocus="removeZero(this)" />
                        </div>
                        <div class="mb-2">
                            <label class="form-label text-uppercase" id="harvestAreaHeaderLabel" for="harvestAreaHeader">${harvest_area}<span class='text-danger'>*</span></label>
                            <input type="text" class="form-control fw-light text-uppercase text-end" id="harvestAreaHeader" name="harvestAreaHeader" value="0" onkeyup="validateDouble(this);" onfocus="removeZero(this)" />
                        </div>
                        <div class="mb-2">
                            <label class="form-label text-uppercase" id="brondolanHeaderLabel" for="brondolanHeader">${brondolan}</label>
                            <input type="text" class="form-control fw-light text-uppercase text-end" id="brondolanHeader" name="brondolanHeader" value="0" onkeyup="validateDouble(this);" onfocus="removeZero(this)" />
                        </div>
                    </div>`
                for (let i = 0; i < responseData.length; i++) {
                    if (i % chunkSize === 0) {
                        if (i > 0) inputItem += `</div>`;
                        inputItem += `<div class="col-sm-4 mb-2">`;
                    }

                    inputItem += `
                        <div class="mb-2">
                            <label class="form-label text-uppercase">
                                ${responseData[i]["plt_harvest_penalty_type"]["translations"][0]["translation"]} (${responseData[i]["uom"]})
                            </label>
                            <input type="text" class="form-control text-uppercase text-end" code="${responseData[i]["code_harvest_penalty"]}" nominal="${responseData[i]["nominal"]}" id="${responseData[i]["code_harvest_penalty"]}" name="penalty[]" value="0" onkeyup="validateDouble(this);" onfocus="removeZero(this)" />
                        </div>`
                    tableItem += `
                    <th class="text-center fw-light text-uppercase" style="width: 10px">${responseData[i]["plt_harvest_penalty_type"]["translations"][0]["translation"]}</th>`
                }

                if (responseData.length > 0) {
                    inputItem += `</div>`;
                }
                document.getElementById("penalty").innerHTML = inputItem;
                document.getElementById("TRData").innerHTML = tableItem;
                document.getElementById("loadData").innerHTML = `<a title="Add" type="submit" onclick="addHarvestData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
                document.getElementById("penaltyThead").setAttribute("colspan", responseData.length);
                $(".js-select2").select2({
                    width: "100%"
                });
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
async function checkDate() {
    const language = await JSON.parse(getCookie("language"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const date = yyyymmdd(document.getElementById("createDateHeader").value)
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
                    document.getElementById("createDateHeader").value = ""
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger", z_index: 2000, message: message
                });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
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
async function selectHarvestType(selectedValue) {
    const responseValue = [0, 1];
    const responseData = [normal_harvest, harvest_on_credit];

    let mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`;
    let subOptionItem = "";
    let selectedLabel = null;
    for (let i = 0; i < responseValue.length; i++) {
        const value = responseValue[i];
        const label = kapital(responseData[i]);
        const selected = value === selectedValue ? "selected" : "";
        if (value === selectedValue) {
            selectedLabel = label;
        }
        subOptionItem += `<option class='fw-light text-uppercase' value='${value}' ${selected}>${label}</option>`;
    }
    document.getElementById("typeHeader").innerHTML = mainOptionItem + subOptionItem;
    return selectedLabel
}
async function selectEstate(code) {
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
                document.getElementById("estateHeader").innerHTML = mainOptionItem + "" + subOptionItem;
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

                document.getElementById("mandorHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectMandor1(employeeID) {
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

                document.getElementById("mandor1Header").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectKeraniDivisi(employeeID) {
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

                document.getElementById("divisionClerkHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectKeraniTransport(employeeID) {
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

                document.getElementById("transportClerkHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectBlock(estate, code) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = estate || document.getElementById("estateHeader").value
    let language = await JSON.parse(getCookie("language"));
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
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        worksite_POST: worksite,
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
async function selectEmployee(employeeID) {
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
    var url = mainUrl + "employee/harvest   "
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
        location_POST: companyCode,
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

                document.getElementById("employeeHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function addHarvestData() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHarvestActivityHeader").validate({
                        ignore: [],
                        rules: {
                            "typeHeader": { required: true },
                            "createDateHeader": { required: true },
                            "estateHeader": { required: true },


                        },
                        messages: {
                            "typeHeader": required,
                            "createDateHeader": required,
                            "estateHeader": required,


                        },
                    }),
                    jQuery("#formHarvestActivityDetail").validate({
                        ignore: [],
                        rules: {
                            "blockHeader": { required: true },
                            "employeeHeader": { required: true },
                            "workResultsHeader": { required: true, min: 1 },
                            "harvestAreaHeader": { required: true, min: 1 }
                        },
                        messages: {
                            "workResultsHeader": required,
                            "harvestAreaHeader": required,
                            "blockHeader": required,
                            "employeeHeader": required,
                        },
                    });
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

    const formHeader = jQuery("#formHarvestActivityHeader");
    const formDetail = jQuery("#formHarvestActivityDetail");


    const isValidHeader = formHeader.valid();
    const isValidDetail = formDetail.valid();

    if (!isValidHeader || !isValidDetail) {
        return false;
    }
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const companyParent = dataCompany[0]["parent_code"]
    const createDate = yyyymmdd(document.getElementById("createDateHeader").value);
    const estate = document.getElementById("estateHeader").value;
    const block = document.getElementById("blockHeader").value;
    const employee = document.getElementById("employeeHeader").value;
    const workResults = document.getElementById("workResultsHeader").value;
    const harvestArea = document.getElementById("harvestAreaHeader").value;
    const brondolan = document.getElementById("brondolanHeader").value;
    const elements = document.getElementsByName("penalty[]");
    var valuesPenalty = [];
    var valuesCode = [];
    let valuesNominal = [];

    Array.from(elements).forEach(element => {
        valuesPenalty.push(element.value);
        valuesCode.push(element.getAttribute("code"));
        valuesNominal.push(element.getAttribute("nominal"));
    });
    let resultsPenalty = valuesNominal.map((nominal, index) => {
        let penalty = valuesPenalty[index];
        return parseFloat(nominal) * parseFloat(penalty);
    });
    const resultPenalty = Object.fromEntries(
        valuesCode.map((code, index) => [code, valuesPenalty[index]])
    );
    var totalPenalty = resultsPenalty.reduce((acc, curr) => acc + curr, 0);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/attribute";
    xhr.onloadstart = function () {
        document.getElementById("loadData").innerHTML = `<div  class=''><span class='input-group-text fw-semibold btn btn-primary'><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span></span><div>`
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message: overload
        });
        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        estate_POST: estate,
        block_POST: block,
        employee_id_POST: employee,
        date_POST: createDate,
        company_parent_POST: companyParent,
    });
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                const nameEmployee = responseData["dataBasicSalary"][0]["hrd_employee"]["fullname"]
                const idEmployee = responseData["dataBasicSalary"][0]["employee_id"]
                const plantingYear = responseData["dataBlockmaster"][0]["planting_year"]
                const basicFFB = responseData["dataHarvestIncentive"][0]["harvest_basis_ffb"]
                const haverstBasicI = responseData["dataHarvestIncentive"][0]["harvest_basis_i_ffb"]
                const haverstBasicII = responseData["dataHarvestIncentive"][0]["harvest_basis_ii_ffb"]
                const extraBasisBonus = responseData["dataHarvestIncentive"][0]["extra_basis_bonus"]
                const extraBasisBonusI = responseData["dataHarvestIncentive"][0]["extra_basis_bonus_i"]
                const extraBasisBonusII = responseData["dataHarvestIncentive"][0]["extra_basis_bonus_ii"]
                const averageBunchRate = responseData["dataAverageBunchRate"][0]["average_bunch_rate"]
                const extraBrondolanBonus = responseData["dataHarvestIncentive"][0]["loose_fruit_bonus"]
                const basicSalary = parseFloat(responseData["dataBasicSalary"][0]["nominal"])
                const tonaseKilogram = parseFloat(workResults) * parseFloat(averageBunchRate)
                const incentiveBasic = workResults >= basicFFB ? (responseData["dataHarvestIncentive"][0]["basis_bonus"]) : 0;
                const bonusBrondolan = parseFloat(brondolan) * parseFloat(extraBrondolanBonus)
                const penaltyBasic = workResults < basicFFB ? basicSalary * (1 - (workResults / basicFFB)) : 0;
                const totalPenaltyNominal = penaltyBasic + totalPenalty

                let bonusBasic = 0;

                if (haverstBasicI !== 0) {
                    if (workResults >= haverstBasicII) {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonusII;
                    } else if (workResults >= haverstBasicI) {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonusI;
                    } else {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonus;
                    }
                } else {
                    bonusBasic = (workResults - basicFFB) * extraBasisBonus;
                }
                bonusBasic = Math.max(0, bonusBasic);
                const totalIncome = (basicSalary + incentiveBasic + bonusBasic + bonusBrondolan) - totalPenaltyNominal
                const dataHarvest = [{ nameEmployee, block, plantingYear, basicFFB, averageBunchRate, harvestArea, workResults, brondolan, tonaseKilogram, basicSalary, incentiveBasic, bonusBasic, bonusBrondolan, ...resultPenalty, totalPenaltyNominal, totalIncome, idEmployee, estate }];
                dataHarvest.forEach((data, index) => {

                    const penalties = Object.fromEntries(
                        Object.entries(data).filter(([key]) => key.startsWith("DP"))
                    );

                    addRow(
                        index,
                        data.nameEmployee,
                        data.block,
                        data.plantingYear,
                        data.basicFFB,
                        data.averageBunchRate,
                        data.harvestArea,
                        data.workResults,
                        data.brondolan,
                        data.tonaseKilogram,
                        data.basicSalary,
                        data.incentiveBasic,
                        data.bonusBasic,
                        data.bonusBrondolan,
                        penalties,
                        data.totalPenaltyNominal,
                        data.totalIncome,
                        data.idEmployee,
                        data.estate
                    );
                });
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                document.getElementById("loadData").innerHTML = `<a title="Add" type="submit" onclick="addHarvestData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
            }
        }
        if (this.status == 404) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
            });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_401
            });
            setTimeout(function () {
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
async function addRow(
    index,
    nameEmployee,
    block,
    plantingYear,
    basicFFB,
    averageBunchRate,
    harvestArea,
    workResults,
    brondolan,
    tonaseKilogram,
    basicSalary,
    incentiveBasic,
    bonusBasic,
    bonusBrondolan,
    penalties,
    totalPenaltyNominal,
    totalIncome,
    idEmployee,
    estate
) {
    const table = document
        .getElementById("haverstActivityDataThead")
        .getElementsByTagName("tbody")[0];

    const existingIds = Array.from(table.rows).map(row => {
        const cell = row.cells[row.cells.length - 1];
        return cell ? cell.innerText.trim() : null;
    });

    if (existingIds.includes(String(idEmployee))) {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "warning",
            message: duplicate.replace("{{duplicate}}", `${nameEmployee}`)
        });
        document.getElementById("loadData").innerHTML = `<a title="Add" type="submit" onclick="addHarvestData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
        return;
    }

    const row = table.insertRow();
    row.id = "row" + idEmployee;
    let cellIndex = 0;
    const actionRow = row.insertCell(cellIndex++);
    actionRow.innerHTML = `
                    <div class='btn-group'>
                        <button type='button' id="${idEmployee}" onclick="showDataHarvestActivityDetatil('${row.id}')" class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>
                        <button type="button" class="btn btn-danger" id="${idEmployee}" onclick="deleteRow('${row.id}')"><i class="fa-regular fa-trash-can"></i></button>
                    </div>`

    const nameEmployeeRow = row.insertCell(cellIndex++);
    nameEmployeeRow.innerHTML = nameEmployee;
    nameEmployeeRow.className = "text-center fw-light text-uppercase";

    const blockRow = row.insertCell(cellIndex++);
    blockRow.innerHTML = block;
    blockRow.className = "text-center fw-light text-uppercase";

    const plantingYearRow = row.insertCell(cellIndex++);
    plantingYearRow.innerHTML = plantingYear;
    plantingYearRow.className = "text-center fw-light text-uppercase";

    const basicFFBRow = row.insertCell(cellIndex++);
    basicFFBRow.innerHTML = basicFFB;
    basicFFBRow.className = "text-center fw-light text-uppercase";

    const averageBunchRateRow = row.insertCell(cellIndex++);
    averageBunchRateRow.innerHTML = averageBunchRate;
    averageBunchRateRow.className = "text-center fw-light text-uppercase";

    const harvestAreaRow = row.insertCell(cellIndex++);
    harvestAreaRow.innerHTML = harvestArea;
    harvestAreaRow.className = "text-center fw-light text-uppercase";

    const workResultsRow = row.insertCell(cellIndex++);
    workResultsRow.innerHTML = workResults;
    workResultsRow.className = "text-center fw-light text-uppercase";

    const brondolanRow = row.insertCell(cellIndex++);
    brondolanRow.innerHTML = brondolan;
    brondolanRow.className = "text-center fw-light text-uppercase";

    const tonaseKilogramRow = row.insertCell(cellIndex++);
    tonaseKilogramRow.innerHTML = tonaseKilogram;
    tonaseKilogramRow.className = "text-center fw-light text-uppercase";

    const basicSalaryRow = row.insertCell(cellIndex++);
    basicSalaryRow.innerHTML = formatRupiah(basicSalary);
    basicSalaryRow.className = "text-center fw-light text-uppercase";

    const incentiveBasicRow = row.insertCell(cellIndex++);
    incentiveBasicRow.innerHTML = formatRupiah(incentiveBasic);
    incentiveBasicRow.className = "text-center fw-light text-uppercase";

    const bonusBasicRow = row.insertCell(cellIndex++);
    bonusBasicRow.innerHTML = formatRupiah(bonusBasic);
    bonusBasicRow.className = "text-center fw-light text-uppercase";

    const bonusBrondolanRow = row.insertCell(cellIndex++);
    bonusBrondolanRow.innerHTML = formatRupiah(bonusBrondolan);
    bonusBrondolanRow.className = "text-center fw-light text-uppercase";

    Object.entries(penalties).forEach(([key, val]) => {
        const penaltyRow = row.insertCell(cellIndex++);
        penaltyRow.innerHTML = val;
        penaltyRow.className = "text-center fw-light text-uppercase";
    });

    const totalPenaltyNominalRow = row.insertCell(cellIndex++);
    totalPenaltyNominalRow.innerHTML = formatRupiah(customRound(totalPenaltyNominal));
    totalPenaltyNominalRow.className = "text-center fw-light text-uppercase";

    const totalIncomeRow = row.insertCell(cellIndex++);
    totalIncomeRow.innerHTML = formatRupiah(customRound(totalIncome));
    totalIncomeRow.className = "text-center fw-light text-uppercase";

    const idEmployeeRow = row.insertCell(cellIndex++);
    idEmployeeRow.innerHTML = idEmployee;
    idEmployeeRow.className = "text-center fw-light text-uppercase";
    idEmployeeRow.hidden = true;

    document.getElementById("formHarvestActivityDetail").reset()
    document.getElementById("loadData").innerHTML = `<a title="Add" type="submit" onclick="addHarvestData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
    document.getElementById('load').hidden = false;
    await selectBlock(estate)
    await selectEmployee()
}