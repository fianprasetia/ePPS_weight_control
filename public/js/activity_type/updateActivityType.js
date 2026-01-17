async function showModalUpdateActivityType(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalActivityType"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalActivityType"), { keyboard: false });
        myModal.toggle();
    }
    await selectLanguage()
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activitytype/bycode"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: overload, });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        code_activity_type_POST: id,
        language_POST: language
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("codeActivitiType").disabled = true
                document.getElementById("codeActivitiType").value = responseData[0]["code_activity_type"]
                codeCOA = responseData[0]["code_coa"]
                await selectCOA(codeCOA)
                var languageData = await responseData[0]["adm_activity_type_translations"]
                for (i = 0; i < languageData.length; i++) {
                    document.getElementById("language" + i).value = await responseData[0]["adm_activity_type_translations"][i]["translation"]
                }
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='updateActivityType()' class='btn  btn-primary'>" + kapital(done) + "</button>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/company";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function updateActivityType() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "codeActivitiType": { required: !0 },
                            "codeCOA": { required: !0 },
                        },
                        messages: {
                            "codeActivitiType": required,
                            "codeCOA": required,
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
    const form = jQuery("#form2");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const codeActivityType = document.getElementById("codeActivitiType").value;
    const elements = document.getElementsByName("language[]");
    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });
    var detail = [];
    var dataActivityType = [];
    for (var i = 0; i < valuesLanguage.length; i++) {
        const languageData = JSON.parse(
            '{"language_POST":"' + valuesLanguage[i] + '"}'
        );
        $.extend(languageData);
        detail.push(languageData);
    }
    const code = document.getElementById("codeCOA");
    const codeCOA = Array.from(code.selectedOptions).map(option => option.value);
    var detailCOA = [];
    for (var i = 0; i < codeCOA.length; i++) {
        const COAData = JSON.parse(
            '{"code_coa_POST":"' + codeCOA[i] + '"}'
        );
        $.extend(COAData);
        detailCOA.push(COAData);
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}');
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}');
    const codelActivityTypeMenu = JSON.parse('{"code_activity_type_POST":"' + codeActivityType + '"}');
    $.extend(languageMenu, usernameMenu, codelActivityTypeMenu, { detailCOA }, { detail });
    dataActivityType.push(languageMenu);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activitytype/update";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML = "<button class='btn btn-hero btn-primary shadow' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>" + loading + "...</button>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message:overload
        });
        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    };

    var data = JSON.stringify(dataActivityType);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["access"] == "success") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "success", icon: "fa fa-check me-1", message: message });
                setTimeout(function () {
                    window.location.href = "/activity_type";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", message: message });
                setTimeout(function () {
                    window.location.href = "/activity_type";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(function () {
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