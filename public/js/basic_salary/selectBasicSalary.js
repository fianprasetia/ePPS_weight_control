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
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["basic_salary"]
        document.getElementById("locationThead").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("periodThead").innerHTML = filterLanguage[0]["content"]["period"]
        document.getElementById("actionThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("locationHeader").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("employeeTypeHeader").innerHTML = filterLanguage[0]["content"]["employee_type"]
        document.getElementById("periodDateHeader").innerHTML = filterLanguage[0]["content"]["period"]
        document.getElementById("idEmployeeThead").innerHTML = filterLanguage[0]["content"]["employee_id"]
        document.getElementById("nameThead").innerHTML = filterLanguage[0]["content"]["fullname"]
        document.getElementById("jobTitleThead").innerHTML = filterLanguage[0]["content"]["job_title"]
        document.getElementById("typeThead").innerHTML = filterLanguage[0]["content"]["employee_type"]
        document.getElementById("nominalThead").innerHTML = filterLanguage[0]["content"]["amount"]
    }
}
async function showLayoutUpdateData(id) {
    document.getElementById('locationHeader').disabled = true;
    document.getElementById('employeeTypeHeader').disabled = true;
    document.getElementById('periodDateHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = true
    document.getElementById("formBasicSalary").reset()
    document.getElementById("basicSalaryDataTbody").innerHTML = "";
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateBasicSalary(id)
    await Promise.all([
        // selectCOA(),
        // selectDepartment(),
        // selectAsset()
    ]);

    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData(id) {
    document.getElementById('locationHeader').disabled = false;
    document.getElementById('employeeTypeHeader').disabled = false;
    document.getElementById('periodDateHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = false
    document.getElementById("formBasicSalary").reset()
     document.getElementById("basicSalaryDataThead").hidden = true
    document.getElementById("load").innerHTML = ""
    // document.getElementById("divisiHeader").innerHTML = "";
    await Promise.all([
        selectLocation(),
        selectEmployeeType()
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
    await selectBasicSalary();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function selectLocation(code) {
    const language = await JSON.parse(getCookie("language"));
    let dataCompany = await JSON.parse(getCookie("dataCompany"));
    let companyType = dataCompany[0]["code_company_type"]
    let parentCode = dataCompany[0]["parent_code"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/basicsalary"
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
        company_type_POST: companyType,
        parent_code_POST: parentCode,

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
                document.getElementById("locationHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/basic_salary";
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
async function selectEmployeeType(typeCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeetype/bydaily"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_type_code == typeCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_type_code != typeCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_type_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_employee_type_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["employee_type_code"] + "'>" + kapital(filterSubData[0]["hrd_employee_type_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("employeeTypeHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/basic_salary";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
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
async function selectBasicSalary() {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    let dataCompany = await JSON.parse(getCookie("dataCompany"));
    let companyType = dataCompany[0]["code_company_type"]
    let parentCode = dataCompany[0]["parent_code"]
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "basicsalary";
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
        company_type_POST: companyType,
        parent_code_POST: parentCode,
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
                    const company = responseData[i]["code_company"];
                    const period = responseData[i]["period"];
                    const type = responseData[i]["employee_type_code"];
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["adm_company.name"] + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["hrd_employee_type.hrd_employee_type_translations.translation"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["period"] + "</td>\
                            <td class='fw-light text-center'><button title='posting' type='button' id='" + no + "' period ='" + period + "' employeeType ='" + type + "' location ='" + company + "' onclick='showLayoutUpdateData(this)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button></td>\
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
async function selectEmployee() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formBasicSalary").validate({
                        ignore: [],
                        rules: {
                            "locationHeader": { required: !0 },
                            "employeeTypeHeader": { required: !0 },
                            "periodDateHeader": { required: !0 },
                        },
                        messages: {
                            "locationHeader": required,
                            "employeeTypeHeader": required,
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
    const form = jQuery("#formBasicSalary");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    await resetDataTables()
    document.getElementById("basicSalaryDataTbody").innerHTML = "";
    document.getElementById("dataTable").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    const location = document.getElementById("locationHeader").value
    const employeeType = document.getElementById("employeeTypeHeader").value
    const periodDate = document.getElementById("periodDateHeader").value
   if (!token) {
        token = await getAccessToken(); 
    }

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/basicsalary";
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
        location_POST: location,
        employee_type_POST: employeeType,
        period_date_POST: periodDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = await response["data"];
                nominal = 0
                responseData.forEach((emp, index) => {
                    addRow(
                        index + 1, // urutan baris
                        emp.employee_id,
                        emp.fullname,
                        emp.hrd_job_title.hrd_job_title_translations[0].translation,
                        emp.hrd_employee_type.hrd_employee_type_translations[0].translation,
                        nominal,
                        emp.id_job_title
                    );
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectEmployee()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-list'></i>\
                </span>"
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertBasicSalary()' class='btn  btn-primary'>" + kapital(process) + "</a>";
                document.getElementById("basicSalaryDataThead").hidden = false
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
async function addRow(index, idEmployee, fullname, jobTitle, type, nominal, idJobTitle) {
    const nominalSalary = nominal || 0
    const table = document
        .getElementById("basicSalaryDataThead")
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
    const idEmployeeRow = row.insertCell(1);
    idEmployeeRow.innerHTML = idEmployee;
    idEmployeeRow.className = "fw-light text-uppercase";
    idEmployeeRow.style.width = "20%";

    const fullnameRow = row.insertCell(2);
    fullnameRow.innerHTML = fullname;
    fullnameRow.className = "fw-light text-uppercase";
    fullnameRow.style.width = "20%";
    // Kolom Period
    const jobTitleRow = row.insertCell(3);
    jobTitleRow.innerHTML = jobTitle;
    jobTitleRow.className = "fw-light text-uppercase";
    jobTitleRow.style.width = "20%";


    const typeRow = row.insertCell(4);
    typeRow.innerHTML = type;
    typeRow.className = "fw-light text-uppercase";
    typeRow.style.width = "20%";

    // Kolom BJR
    const nominalRow = row.insertCell(5);
    nominalRow.innerHTML = `<input type="text" class="form-control text-end fw-light text-uppercase nominal_input" id="nominal_${rowCount}" value="${nominalSalary}" name="nominal[]" onfocus='removeZero(this)' onkeyup='typeformatRupiah(this);' style="width:100%; text-align:right;">`;
    nominalRow.className = "text-center fw-light text-uppercase";
    nominalRow.style.width = "20%";

    const idJobTitleRow = row.insertCell(6);
    idJobTitleRow.innerHTML = idJobTitle;
    idJobTitleRow.className = "fw-light text-uppercase";
    idJobTitleRow.style.width = "20%";
    idJobTitleRow.hidden = true;
}
function syncNominal(el) {
    typeformatRupiah(el);
    const value = el.value;
    document.querySelectorAll('.nominal_input').forEach(input => {
        input.value = value;
    });
}