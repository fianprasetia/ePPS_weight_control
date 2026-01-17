async function showModalInsertMasterAccounts(id) {
    const parent = id.getAttribute('parent');
    const level = id.getAttribute('level');
    const type = id.getAttribute('type');
    // const level = element.getAttribute("leveladd");
    // const parent = element.getAttribute("parentadd");
    await selectLanguage();
    await selectCompany();
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalMasterAccounts"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalMasterAccounts"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("level").value = level;
    document.getElementById("parent").value = parent;
    document.getElementById("type").value = type;
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='insertMasterAccounts()' class='btn  btn-primary'>" + kapital(done) + "</a>";
    document.getElementById("status").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='1'>" + kapital(active) + "</option><option value='0'>" + kapital(nonactive) + "</option>"
}
async function insertMasterAccounts() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"), jQuery("#form2").validate(
                    {
                        ignore: [],
                        rules: {
                            "entity": { required: !0 },
                            "status": { required: !0 },
                        },
                        messages: {
                            "entity": required,
                            "status": required,
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
    const form = jQuery("#form2");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
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
    $.extend(levelCOA, parentCOA, typeCOA, entityCOA, statusCOA, languageCOA, usernameCOA, {
        detail
    });
    dataCOA.push(levelCOA);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa/insert";
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