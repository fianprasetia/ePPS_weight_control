async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        // alert("ksong")
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("attendanceMachinePage").innerHTML = filterLanguage[0]["content"]["attendance_machine"]
        document.getElementById("titleAttendanceMachine").innerHTML = filterLanguage[0]["content"]["attendance_machine"]
        document.getElementById("WorksiteTabel").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("ipAddressTable").innerHTML = filterLanguage[0]["content"]["ip_address"]
        document.getElementById("locationTable").innerHTML = filterLanguage[0]["content"]["location"];
        document.getElementById("portTable").innerHTML = filterLanguage[0]["content"]["port"]
        document.getElementById("statusTable").innerHTML = filterLanguage[0]["content"]["status"]
        document.getElementById("actionsTable").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("worksiteLabel").innerHTML = filterLanguage[0]["content"]["worksite"] + "<span class='text-danger'>*</span>"
        document.getElementById("ipAddressLabel").innerHTML = filterLanguage[0]["content"]["ip_address"] + "<span class='text-danger'>*</span>"
        document.getElementById("poartLabel").innerHTML = filterLanguage[0]["content"]["port"] + "<span class='text-danger'>*</span>"
        document.getElementById("statusLabel").innerHTML = filterLanguage[0]["content"]["status"] + "<span class='text-danger'>*</span>"
        document.getElementById("locationLabel").innerHTML = filterLanguage[0]["content"]["location"];
        await selectAttedance()
    }
}
async function selectAttedance() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    // var companyType = await JSON.parse(getCookie("dataCompany"));
    // const companyTypeCode = companyType[0]["code_company_type"]
    // const companyCode = companyType[0]["code_company"]
    // const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "attendance"
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
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    var editAttendance = " <button title='" + edit + "' type='button' id ='" + responseData[i]["id_attendance_machine"] + "' onclick='showModalUpadateAttendanceMachine(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["adm_company"]["name"] +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        responseData[i]["ip_address"] +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        responseData[i]["port"] +
                        "</td>\
                            <td class='fw-light  text-center text-uppercase'>" +
                        responseData[i]["location"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        (responseData[i]["status"] == 0 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>") +
                        "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editAttendance + "</div></td>\
                        </tr>";
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
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
async function selectWorksite(worksiteCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    const companyCode = companyType[0]["code_company"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/worksite"
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
        companyType_POST: companyTypeCode,
        companyParent_POST: companyParent,
        companyCode_POST: companyCode
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == worksiteCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != worksiteCode);
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
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("selectWorksite").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
selectContent()