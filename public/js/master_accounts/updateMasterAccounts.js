async function showModalUpdateMasterAccounts(id) {
    const code = id.getAttribute('code');
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalMasterAccounts"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalMasterAccounts"), { keyboard: false });
        myModal.toggle();
    }
    await selectLanguage()
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/code"
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
        code_POST: code,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("level").value = responseData[0]["level_coa"]
                document.getElementById("parent").value = responseData[0]["parent_coa"]
                document.getElementById("type").value = responseData[0]["type_coa"]
                entity = responseData[0]["entity_coa"]
                await selectCompany(entity)
                var languageData = await responseData[0]["fat_coa_translations"]
                for (i = 0; i < languageData.length; i++) {
                    document.getElementById("language" + i).value = await responseData[0]["fat_coa_translations"][i]["translation"]
                }
                const status = responseData[0]["status_coa"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "1" ? kapital(active) : kapital(nonactive)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "1" ? "1" : "0") + ">" + (status != "1" ? kapital(active) : kapital(nonactive)) + "</option>";
                document.getElementById("status").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateMasterAccounts(" + code + ")' class='btn  btn-primary'>" + kapital(done) + "</a>"
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
async function updateMasterAccounts(code) {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"), jQuery(".js-validation").validate(
                    {
                        ignore: [],
                        rules: {
                            "entity": { required: !0 },
                        },
                        messages: {
                            "entity": required,
                        },
                    }
                ), jQuery(".js-select2").on("change", e => {
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
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const level = document.getElementById("level").value;
    const parent = document.getElementById("parent").value;
    const type = document.getElementById("type").value;
    const entity = document.getElementById("entity").value;
    const status = document.getElementById("status").value;
    const elements = document.getElementsByName("language[]");
    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });
    var detail = [];
    var dataCOA = [];
    for (var i = 0; i < valuesLanguage.length; i++) {
        const languageData = JSON.parse(
            '{"language_POST":"' + valuesLanguage[i] + '"}'
        );
        $.extend(languageData);
        detail.push(languageData);
    }
    const languageCOA = JSON.parse('{"language_POST":"' + language + '"}');
    const usernameCOA = JSON.parse('{"username_POST":"' + username + '"}');
    const levelCOA = JSON.parse('{"level_POST":"' + level + '"}');
    const parentCOA = JSON.parse('{"parent_POST":"' + parent + '"}');
    const typeCOA = JSON.parse('{"type_POST":"' + type + '"}');
    const entityCOA = JSON.parse('{"entity_POST":"' + entity + '"}');
    const statusCOA = JSON.parse('{"status_POST":"' + status + '"}');
    const codeCOA = JSON.parse('{"code_POST":"' + code + '"}');
    $.extend(levelCOA, parentCOA, typeCOA, entityCOA, statusCOA, codeCOA, languageCOA, usernameCOA, {
        detail
    });
    dataCOA.push(levelCOA);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/update";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            " +
            loading +
            "...\n\
          </button>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message:overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };

    var data = JSON.stringify(dataCOA);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["access"] == "success") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/master_accounts";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message
                });
                setTimeout(function () {
                    window.location.href = "/master_accounts";
                }, 3000);
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