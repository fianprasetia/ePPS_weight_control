async function showModalUpdateMenu(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalMenu"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalMenu"), { keyboard: false });
        myModal.toggle();
    }
    await selectLanguage()
    let language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const element = document.getElementById(id);
    const level = element.getAttribute("levelUpdate");
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "menu/code"
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
        code_POST: id,
        language_POST: language,
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("code").value = responseData[0]["id_menu"]
                document.getElementById("level").value = responseData[0]["level"]
                document.getElementById("parent").value = responseData[0]["parent_id"]
                document.getElementById("url").value = responseData[0]["page"]
                document.getElementById("icon").value = responseData[0]["icon"]
                document.getElementById("batch").value = responseData[0]["no_ordinal"]
                var languageData = await responseData[0]["adm_menu_translations"]
                for (i = 0; i < languageData.length; i++) {
                    document.getElementById("language" + i).value = await responseData[0]["adm_menu_translations"][i]["translation"]
                }
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='updateMenu()' class='btn  btn-primary'>" + kapital(done) + "</button>"
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
async function updateMenu() {
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        // ignore: [],
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
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const code = document.getElementById("code").value
    const level = document.getElementById("level").value
    const parent = document.getElementById("parent").value
    const urlPage = document.getElementById("url").value
    const icon = document.getElementById("icon").value
    const batch = document.getElementById("batch").value
    const elements = document.getElementsByName('language[]');
    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });
    var detail = []
    var dataMenu = []
    for (var i = 0; i < valuesLanguage.length; i++) {
        const languageData = JSON.parse('{"language_POST":"' + valuesLanguage[i] + '"}')
        $.extend(languageData);
        detail.push(languageData)
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}')
    const levelMenu = JSON.parse('{"level_POST":' + level + '}')
    const parentMenu = JSON.parse('{"parent_POST":' + parent + '}')
    const urlMenu = JSON.parse('{"url_POST":"' + urlPage + '"}')
    const iconMenu = JSON.parse('{"icon_POST":"' + icon + '"}')
    const batchMenu = JSON.parse('{"batch_POST":' + batch + '}')
    $.extend(levelMenu, usernameMenu, parentMenu, urlMenu, iconMenu, batchMenu, languageMenu, { detail });
    dataMenu.push(levelMenu)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "menu/update/" + code;
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(dataMenu);
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
                    window.location.href = "/menu_directory";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/menu_directory";
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
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}