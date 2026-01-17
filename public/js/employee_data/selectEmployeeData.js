async function selectContent() {
    await selectEmployee()
    await new Promise(resolve => setTimeout(resolve, 0));
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

        document.getElementById("employeePage").innerHTML = filterLanguage[0]["content"]["employee_data"]
        document.getElementById("titleEmployee").innerHTML = filterLanguage[0]["content"]["employee_data"]
        document.getElementById("id_employeeTable").innerHTML = filterLanguage[0]["content"]["employee_id"]
        document.getElementById("fullnameTable").innerHTML = filterLanguage[0]["content"]["fullname"]
        document.getElementById("datebirthTable").innerHTML = filterLanguage[0]["content"]["date_of_birth"]
        document.getElementById("companyTable").innerHTML = filterLanguage[0]["content"]["company"]
        document.getElementById("worksiteTable").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("jobtitleTable").innerHTML = filterLanguage[0]["content"]["job_title"]
        document.getElementById("datejoiningTable").innerHTML = filterLanguage[0]["content"]["date_of_joining"]
        document.getElementById("dateAppoimenTable").innerHTML = filterLanguage[0]["content"]["date_of_appointment"]
        document.getElementById("dateexitTable").innerHTML = filterLanguage[0]["content"]["date_of_exit"]
        document.getElementById("employeestatusTable").innerHTML = filterLanguage[0]["content"]["employee_status"]
        document.getElementById("genderTable").innerHTML = filterLanguage[0]["content"]["gender"]
        document.getElementById("actions").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("employeeInfo").innerHTML = filterLanguage[0]["content"]["employee_information"]
        document.getElementById("companyInfo").innerHTML = filterLanguage[0]["content"]["company_information"]
        document.getElementById("contactInfo").innerHTML = filterLanguage[0]["content"]["contact_information"]
        document.getElementById("financialInfo").innerHTML = filterLanguage[0]["content"]["financial_information"]
        document.getElementById("familyInfo").innerHTML = filterLanguage[0]["content"]["family_and_social_information"]
        document.getElementById("governmentInfo").innerHTML = filterLanguage[0]["content"]["government_and_insurance_information"]
        document.getElementById("otherInfo").innerHTML = filterLanguage[0]["content"]["other_details"]
        document.getElementById("employeeIDLabel").innerHTML = filterLanguage[0]["content"]["employee_id"]
        document.getElementById("fullnameLabel").innerHTML = filterLanguage[0]["content"]["fullname"] + "<span class='text-danger'>*</span>"
        document.getElementById("genderLabel").innerHTML = filterLanguage[0]["content"]["gender"] + "<span class='text-danger'>*</span>"
        document.getElementById("dateBirthLabel").innerHTML = filterLanguage[0]["content"]["date_of_birth"]
        document.getElementById("placeBirthLabel").innerHTML = filterLanguage[0]["content"]["place_of_birth"]
        document.getElementById("addressLabel").innerHTML = filterLanguage[0]["content"]["address"]
        document.getElementById("cityLabel").innerHTML = filterLanguage[0]["content"]["city"]
        document.getElementById("provinceLabel").innerHTML = filterLanguage[0]["content"]["province"]
        document.getElementById("zipCodeLabel").innerHTML = filterLanguage[0]["content"]["zip_code"]
        document.getElementById("nationalityLabel").innerHTML = filterLanguage[0]["content"]["nationality"]
        document.getElementById("departmentLabel").innerHTML = filterLanguage[0]["content"]["department"] + "<span class='text-danger'>*</span>"
        document.getElementById("jobTitleLabel").innerHTML = filterLanguage[0]["content"]["job_title"] + "<span class='text-danger'>*</span>"
        document.getElementById("companyLabel").innerHTML = filterLanguage[0]["content"]["company"] + "<span class='text-danger'>*</span>"
        document.getElementById("employeeTypeLabel").innerHTML = filterLanguage[0]["content"]["employee_type"] + "<span class='text-danger'>*</span>"
        document.getElementById("employeeStatusLabel").innerHTML = filterLanguage[0]["content"]["employee_status"] + "<span class='text-danger'>*</span>"
        document.getElementById("gradeLabel").innerHTML = filterLanguage[0]["content"]["grade"] + "<span class='text-danger'>*</span>"
        document.getElementById("dateJoiningLabel").innerHTML = filterLanguage[0]["content"]["date_of_joining"] + "<span class='text-danger'>*</span>"
        document.getElementById("dateAppoimenLabel").innerHTML = filterLanguage[0]["content"]["date_of_appointment"]
        document.getElementById("dateExitLabel").innerHTML = filterLanguage[0]["content"]["date_of_exit"]
        document.getElementById("worksiteLabel").innerHTML = filterLanguage[0]["content"]["worksite"] + "<span class='text-danger'>*</span>"
        document.getElementById("receptionLocationLabel").innerHTML = filterLanguage[0]["content"]["reception_location"] + "<span class='text-danger'>*</span>"
        document.getElementById("rationLabel").innerHTML = filterLanguage[0]["content"]["ration"] + "<span class='text-danger'>*</span>"
        document.getElementById("noTeleponLabel").innerHTML = filterLanguage[0]["content"]["phone_number"]
        document.getElementById("noHandphoneLabel").innerHTML = filterLanguage[0]["content"]["handphone_number"]
        document.getElementById("personalEmailLabel").innerHTML = filterLanguage[0]["content"]["personal_email"]
        document.getElementById("businessEmailLabel").innerHTML = filterLanguage[0]["content"]["business_email"]
        document.getElementById("emergencyNumberLabel").innerHTML = filterLanguage[0]["content"]["emergency_contact_number"]
        document.getElementById("bankNumberLabel").innerHTML = filterLanguage[0]["content"]["bank_account_number"]
        document.getElementById("bankLabel").innerHTML = filterLanguage[0]["content"]["bank_name"]
        document.getElementById("taxLabel").innerHTML = filterLanguage[0]["content"]["tax_identification_number"]
        document.getElementById("salarySystemLabel").innerHTML = filterLanguage[0]["content"]["salary_system"] + "<span class='text-danger'>*</span>"
        document.getElementById("maritalLabel").innerHTML = filterLanguage[0]["content"]["marital_status"] + "<span class='text-danger'>*</span>"
        document.getElementById("weddingDateLabel").innerHTML = filterLanguage[0]["content"]["wedding_date"]
        document.getElementById("childrenNumberLabel").innerHTML = filterLanguage[0]["content"]["number_of_children"]
        document.getElementById("dependentsNumberLabel").innerHTML = filterLanguage[0]["content"]["number_of_dependents"]
        document.getElementById("familyNumberLabel").innerHTML = filterLanguage[0]["content"]["family_card_number"]
        document.getElementById("IdentityNumberLabel").innerHTML = filterLanguage[0]["content"]["identity_card_number"] + "<span class='text-danger'>*</span>"
        document.getElementById("noPassportLabel").innerHTML = filterLanguage[0]["content"]["passport_number"]
        document.getElementById("healthInsuranceNumberLabel").innerHTML = filterLanguage[0]["content"]["health_insurance_number"]
        document.getElementById("employmentInsurancePurposesLabel").innerHTML = filterLanguage[0]["content"]["employment_insurance_number"]
        document.getElementById("driversLicenseNumberLabel").innerHTML = filterLanguage[0]["content"]["drivers_license_number"]
        document.getElementById("taxStatusLabel").innerHTML = filterLanguage[0]["content"]["tax_status"] + "<span class='text-danger'>*</span>"
        document.getElementById("religionLabel").innerHTML = filterLanguage[0]["content"]["religion"] + "<span class='text-danger'>*</span>"
        document.getElementById("bloodTypeLabel").innerHTML = filterLanguage[0]["content"]["blood_type"]
        document.getElementById("educationLabel").innerHTML = filterLanguage[0]["content"]["education"] + "<span class='text-danger'>*</span>"
    }
}
async function selectEmployee() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyCode = companyType[0]["code_company"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/type"
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
        companyCode_POST: companyCode,
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    const date_of_appointment = responseData[i]["date_of_appointment"]
                    const date_of_exit = responseData[i]["date_of_exit"]
                    const date_of_birth = responseData[i]["date_of_birth"]
                    if (date_of_birth == null) {
                        var dateBirth = "0000-00-00"
                    } else {
                        var dateBirth = date_of_birth
                    }
                    if (date_of_appointment == null) {
                        var dateJoining = "0000-00-00"
                    } else {
                        var dateJoining = date_of_appointment
                    }
                    if (date_of_exit == null) {
                        var dateExit = "0000-00-00"
                    } else {
                        var dateExit = date_of_exit
                    }
                    var editUser = " <button title='" + edit + "' type='button' id ='" + responseData[i]["employee_id"] + "' onclick='showModalUpdateEmployee(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + responseData[i]["employee_id"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["fullname"] +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        ddmmyyyy(dateBirth) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["adm_company"]["name"] +
                        "</td>\
                            <td class='fw-light  text-center text-uppercase'>" +
                        responseData[i]["WorksiteCompany"]["name"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_job_title"]["hrd_job_title_translations"][0]["translation"] +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        ddmmyyyy(responseData[i]["date_of_joining"]) +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        ddmmyyyy(dateJoining) +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        ddmmyyyy(dateExit) +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_employee_status"]["hrd_employee_status_translation"]["translation"] +
                        "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_gender"]["hrd_gender_translations"][0]["translation"] +
                        "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editUser + "</div></td>\
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
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(function () {
                //     window.location.href = "/employee_data";
                // }, 3000);
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
async function selectGender(genderCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "gender/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.gender_code == genderCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.gender_code != genderCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["gender_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_gender_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["gender_code"] + "'>" + kapital(filterSubData[0]["hrd_gender_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("gender").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
async function selectCity(cityCode) {
    const dataCity = "file/city.json";
    fetch(dataCity)
        .then((response) => response.json())
        .then((dataCity) => dataContent(dataCity));
    function dataContent(dataCity) {
        var responseData = dataCity
        var filterSubData = responseData.filter((filterSubData) => filterSubData.city == cityCode);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.city != cityCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["city"] +
                "'>" +
                kapital(filternotSubData[i]["city"]) +
                "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["city"] + ">" + kapital(filterSubData[0]["city"]) + "</option>";
        }
        document.getElementById("city").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectProvince(provinceCode) {
    const dataProvince = "file/province.json";
    fetch(dataProvince)
        .then((response) => response.json())
        .then((dataProvince) => dataContent(dataProvince));
    function dataContent(dataProvince) {
        var responseData = dataProvince
        var filterSubData = responseData.filter((filterSubData) => filterSubData.id == provinceCode);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.id != provinceCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["id"] +
                "'>" +
                kapital(filternotSubData[i]["province"]) +
                "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["id"] + ">" + kapital(filterSubData[0]["province"]) + "</option>";
        }
        document.getElementById("province").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectCountry(countryCode) {
    const dataCountry = "file/country.json";
    fetch(dataCountry)
        .then((response) => response.json())
        .then((dataCountry) => dataContent(dataCountry));
    function dataContent(dataCountry) {
        var responseData = dataCountry
        var filterSubData = responseData.filter((filterSubData) => filterSubData.code == countryCode);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code != countryCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["code"] +
                "'>" +
                kapital(filternotSubData[i]["name"]) +
                "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
        }
        document.getElementById("nationality").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectDepartment(departmentCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "department/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.department_code == departmentCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.department_code != departmentCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["department_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_department_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["department_code"] + "'>" + kapital(filterSubData[0]["hrd_department_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("department").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectJobTitle(jobTitleCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "jobtitle/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.id_job_title == jobTitleCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.id_job_title != jobTitleCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["id_job_title"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_job_title_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["id_job_title"] + "'>" + kapital(filterSubData[0]["hrd_job_title_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("jobTitle").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectCompany(companyCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/type"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == companyCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != companyCode);
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
                document.getElementById("company").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
async function selectType(typeCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeetype/bylanguage"
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
                document.getElementById("employeeType").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectStatus(statusCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeestatus/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_employee_status == statusCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_employee_status != statusCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_employee_status"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_employee_status_translation"]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_employee_status"] + "'>" + kapital(filterSubData[0]["hrd_employee_status_translation"]["translation"]) + "</option>";
                }
                document.getElementById("employeeStatus").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectGrade(gradeCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "grade/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.grade_code == gradeCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.grade_code != gradeCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["grade_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_grade_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["grade_code"] + "'>" + kapital(filterSubData[0]["hrd_grade_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("grade").innerHTML = mainOptionItem + "" + subOptionItem;
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
                document.getElementById("worksite").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectProvinceReception(provinceReceptionCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/province"
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
                var responseDataProvince = response["data"]
                var detailCode = []
                for (i = 0; i < responseDataProvince.length; i++) {
                    provinceCode = responseDataProvince[i]["province"]
                    $.extend(provinceCode);
                    detailCode.push(provinceCode)
                }
                const dataProvince = "file/province.json";
                fetch(dataProvince)
                    .then((response) => response.json())
                    .then((dataProvince) => dataContent(dataProvince));
                function dataContent(dataProvince) {
                    var responseData = dataProvince
                    var filterSubProvonceData = responseData.filter((filterSubData) => detailCode.includes(filterSubData.id));
                    var filterSubData = filterSubProvonceData.filter((filterSubData) => filterSubData.id == provinceReceptionCode);
                    var filternotSubData = filterSubProvonceData.filter((filternotSubData) => filternotSubData.id != provinceReceptionCode);
                    mainOptionItem = "";
                    subOptionItem = "";
                    for (i = 0; i < filternotSubData.length; i++) {
                        subOptionItem +=
                            "<option class='fw-light text-uppercase' value='" +
                            filternotSubData[i]["id"] +
                            "'>" +
                            kapital(filternotSubData[i]["province"]) +
                            "</option>";
                    }
                    if (filterSubData == "" || filterSubData == undefined) {
                        mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                    } else {
                        mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["id"] + ">" + kapital(filterSubData[0]["province"]) + "</option>";
                    }
                    document.getElementById("receptionLocation").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
                }
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
async function selectCatu(catuCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "catu/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.catu_code == catuCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.catu_code != catuCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["catu_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_catu_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["catu_code"] + "'>" + kapital(filterSubData[0]["hrd_catu_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("ration").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectStatusTax(statusTaxCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeestatustax/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_tax_code == statusTaxCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_tax_code != statusTaxCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_tax_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_employee_tax_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["employee_tax_code"] + "'>" + kapital(filterSubData[0]["hrd_employee_tax_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById("taxStatus").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectSalary(salaryCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeesalary/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_salary_code == salaryCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_salary_code != salaryCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_salary_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_employee_salary_translation"]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["employee_salary_code"] + "'>" + kapital(filterSubData[0]["hrd_employee_salary_translation"]["translation"]) + "</option>";
                }


                document.getElementById("salarySystem").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectMarital(maritalCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeemarital/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.marital_code == maritalCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.marital_code != maritalCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["marital_code"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_employee_marital_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["marital_code"] + "'>" + kapital(filterSubData[0]["hrd_employee_marital_translations"][0]["translation"]) + "</option>";
                }


                document.getElementById("marital").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectReligion(religionCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "religion/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_religion == religionCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_religion != religionCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_religion"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_religion_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_religion"] + "'>" + kapital(filterSubData[0]["hrd_religion_translations"][0]["translation"]) + "</option>";
                }


                document.getElementById("religion").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectEducation(educationCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "education/bylanguage"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_education == educationCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_education != educationCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_education"] +
                        "'>" +
                        kapital(filternotSubData[i]["hrd_education_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_education"] + "'>" + kapital(filterSubData[0]["hrd_education_translations"][0]["translation"]) + "</option>";
                }


                document.getElementById("education").innerHTML = mainOptionItem + "" + subOptionItem;
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
async function selectBlood(bloodCode) {
    const dataBlood = "file/blood.json";
    fetch(dataBlood)
        .then((response) => response.json())
        .then((dataBlood) => dataContent(dataBlood));
    function dataContent(dataBlood) {
        var responseData = dataBlood
        var filterSubData = responseData.filter((filterSubData) => filterSubData.code == bloodCode);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code != bloodCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["code"] +
                "'>" +
                kapital(filternotSubData[i]["name"]) +
                "</option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
        }
        document.getElementById("bloodType").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
function selectGetImage() {
    document.getElementById('avatarInput').click();
}
function previewAvatar() {
    const input = document.getElementById('avatarInput');
    const preview = document.getElementById('avatarPreview');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Set canvas size
                canvas.width = 128;
                canvas.height = 128;

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the image on canvas with new size
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Get the resized image data URL
                const resizedImageURL = canvas.toDataURL('image/png');

                // Set the new image URL to preview
                preview.src = resizedImageURL;
            };
            img.src = e.target.result; // Set the image source to file result
        };

        reader.readAsDataURL(file); // Baca file sebagai Data URL
    } else {
        console.error("No file selected or FileReader failed."); // Debug: Log jika tidak ada file
    }
}
selectContent()