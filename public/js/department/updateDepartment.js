async function showModalUpdateDepartment(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalDeaprtment"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalDeaprtment"), { keyboard: false });
        myModal.toggle();
    }
    await selectLanguage()
    let language = await JSON.parse(getCookie("language"));
    //   const element = document.getElementById(id);
    // const level = element.getAttribute("levelUpdate");
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "department/bycode"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-exclamation me-1",
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        code_POST: id,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                let status = responseData[0]["status"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                document.getElementById("status").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";
                var languageData = await responseData[0]["hrd_department_translations"]
                for (i = 0; i < languageData.length; i++) {
                    document.getElementById("language" + i).value = await responseData[0]["hrd_department_translations"][i]["translation"]
                }
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' code=" + id + " onclick='updateDepartment(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
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
async function updateDepartment(id) {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "status": { required: !0 },
                            "language[]": { required: !0 }
                        },
                        messages: {
                            "status": required,
                            "language[]": required
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
    const form = jQuery(".js-validation");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const code = id.getAttribute('code');
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const status = document.getElementById("status").value
    const elements = document.getElementsByName('language[]');
    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });
    var detail = []
    var dataDepartment = []
    for (var i = 0; i < valuesLanguage.length; i++) {
        const languageData = JSON.parse('{"language_POST":"' + valuesLanguage[i] + '"}')
        $.extend(languageData);
        detail.push(languageData)
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}')
    const statusMenu = JSON.parse('{"status_POST":"' + status + '"}')
    const codeMenu = JSON.parse('{"code_POST":"' + code + '"}')
    $.extend(statusMenu, usernameMenu, codeMenu, languageMenu, { detail });
    dataDepartment.push(statusMenu)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "department/update";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            "+ loading + "...\n\
          </button>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            icon: "fa fa-exclamation me-1",
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify(dataDepartment);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["access"] == "success") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/department";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    icon: "fa fa-times me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/department";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
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