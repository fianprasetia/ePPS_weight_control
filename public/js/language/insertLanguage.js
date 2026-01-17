async function showModalInsertLanguage() {
    await selectLanguage();
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalLanguage"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalLanguage"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("key").disabled = false
    document.getElementById("load").innerHTML =
        "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='insertLanguage()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}

async function insertLanguage() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "language[]": { required: !0 },
                            "key": { required: !0 },
                        },
                        messages: {
                            "language[]": required,
                            "key": required,
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
    let token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    const key = document.getElementById("key").value
    const elements = document.getElementsByName("language[]");
    let valuesLanguage = [];
    let valuesCode = [];

    Array.from(elements).forEach(element => {
        valuesLanguage.push(element.value);
        valuesCode.push(element.getAttribute("code")); // ambil attribute code
    });

    let detail = [];
    var dataLanguage = [];
    for (let i = 0; i < valuesLanguage.length; i++) {
        const languageData = {
            language_POST: valuesLanguage[i],
            code_POST: valuesCode[i]
        };
        detail.push(languageData);
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}');
    const keyLanguage = JSON.parse('{"key_POST":"' + key + '"}');
    $.extend(languageMenu, keyLanguage, { detail });
    dataLanguage.push(languageMenu);
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "translate/insert"
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
            type: "danger",
            z_index: 2000,
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        dataLanguage
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/language";
                }, 3000);
            } else if (response["access"] == "failed") {
                console.log("keluar")
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/language";
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
