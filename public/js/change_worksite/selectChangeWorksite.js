async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("changeWorksitePage").innerHTML = filterLanguage[0]["content"]["change_worksite"]
        document.getElementById("titleChangeWorksite").innerHTML = filterLanguage[0]["content"]["change_worksite"]
        document.getElementById("worksiteLabel").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("descriptionChangeWorksite").innerHTML = filterLanguage[0]["content"]["change_worksite_description"]
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateChangeWorksite()' class='btn  btn-primary'>" + kapital(done) + "</a>"
        token == null ? selectContent() : await showModalSelectWorksite();
    }
}
selectContent()
async function showModalSelectWorksite() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        var myModal = new bootstrap.Modal(document.getElementById("modalWorksite"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalWorksite"), { keyboard: false });
        myModal.toggle();
    }
    let language = await JSON.parse(getCookie("language"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    var dataEmployee = await JSON.parse(getCookie("dataEmployee"));
    const departmentCode = dataEmployee["department_code"]
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/changeworksite"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await kelluar();
        }, 3000);
    };
    var data = JSON.stringify({
        companyType_POST: companyTypeCode,
        department_POST: departmentCode,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                subOptionItem = "";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        responseData[i]["code_company"] +
                        "'>" +
                        kapital(responseData[i]["name"]) +
                        "</option>";
                }
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                document.getElementById("selectWorksite").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
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
                //     window.location.href = "/";
                // }, 3000);
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
            setTimeout(function () {
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
