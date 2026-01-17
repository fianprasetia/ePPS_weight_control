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

    // Proses data
    await dataContent(jsonData);

    await selectPartners()


    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["partners"]
        document.getElementById("titleModal").innerHTML = filterLanguage[0]["content"]["partners"]
        document.getElementById("codePartnersThead").innerHTML = filterLanguage[0]["content"]["code_partners"]
        document.getElementById("nameThead").innerHTML = filterLanguage[0]["content"]["name"]
        document.getElementById("addressThead").innerHTML = filterLanguage[0]["content"]["address"]
        document.getElementById("cityThead").innerHTML = filterLanguage[0]["content"]["city"]
        document.getElementById("phoneThead").innerHTML = filterLanguage[0]["content"]["phone_number"]
        document.getElementById("emailThead").innerHTML = filterLanguage[0]["content"]["email"]
        document.getElementById("contactPersonThead").innerHTML = filterLanguage[0]["content"]["contact_name"]
        document.getElementById("contactNameLabel").innerHTML = filterLanguage[0]["content"]["contact_name"]
        document.getElementById("taxThead").innerHTML = filterLanguage[0]["content"]["tax_identification_number"]
        document.getElementById("bankNameThead").innerHTML = filterLanguage[0]["content"]["bank_name"]
        document.getElementById("bankAccountThead").innerHTML = filterLanguage[0]["content"]["bank_account_number"]
        document.getElementById("statusThead").innerHTML = filterLanguage[0]["content"]["status"]
        document.getElementById("actionsThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("partnersTypeLabel").innerHTML = filterLanguage[0]["content"]["partners_type"] + "<span class='text-danger'>*</span>"
        document.getElementById("nameLabel").innerHTML = filterLanguage[0]["content"]["name"] + "<span class='text-danger'>*</span>"
        document.getElementById("addressLabel").innerHTML = filterLanguage[0]["content"]["address"]
        document.getElementById("taxLabel").innerHTML = filterLanguage[0]["content"]["tax_identification_number"]
        document.getElementById("cityLabel").innerHTML = filterLanguage[0]["content"]["city"]
        document.getElementById("phoneLabel").innerHTML = filterLanguage[0]["content"]["phone_number"]
        document.getElementById("emailLabel").innerHTML = filterLanguage[0]["content"]["email"]
        document.getElementById("bankNameLabel").innerHTML = filterLanguage[0]["content"]["bank_name"]
        document.getElementById("bankAccountLabel").innerHTML = filterLanguage[0]["content"]["bank_account_number"]
        document.getElementById("statusLabel").innerHTML = filterLanguage[0]["content"]["status"] + "<span class='text-danger'>*</span>"
    }

}
async function selectPartners() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "partners"
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
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = await response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_partners"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["address"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["city"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["phone"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["email"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["contact_person"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["tax_id"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["bank_name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["bank_account"] + "</td>\
                            <td class='fw-light text-center'>" + (responseData[i]["status"] == 0 ? active : nonactive) + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button type='button' id ='" + responseData[i]["code_partners"] + "' onclick='showModalUpdateBankAccount(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
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
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send();
    return false;
}
async function selectPartnersType(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "partnerstype"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_partners_type == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_partners_type != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_partners_type"] +
                        "'>" +
                        kapital(filternotSubData[i]["log_partners_type_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_partners_type"] + ">" + kapital(filterSubData[0]["log_partners_type_translations"][0]["translation"]) + "</option>";
                }

                document.getElementById("partnersType").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
async function selectCity(codeCity) {
    const dataCity = "file/city.json";
    fetch(dataCity)
        .then((response) => response.json())
        .then((dataCity) => dataContent(dataCity));
    function dataContent(dataCity) {
        var responseData = dataCity
        var filterSubData = responseData.filter((filterSubData) => filterSubData.city == codeCity);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.city != codeCity);
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
        if (codeCity == "" || codeCity == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["city"] + ">" + kapital(filterSubData[0]["city"]) + "</option>";
        }
        document.getElementById("city").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}