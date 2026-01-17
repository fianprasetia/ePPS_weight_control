async function showModalUpdateLanguage(el) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalLanguage"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalLanguage"), { keyboard: false });
        myModal.toggle();
    }
    await selectLanguage()
    const key = el.getAttribute("data-keycode");
    const response = await fetch("file/language.json");
    const dataLangugae = await response.json();
    // ambil nilai untuk setiap bahasa
    const values = dataLangugae.map(d => ({
        language: d.language,
        value: d.content[key] || "-"
    }));
    for (let i = 0; i < values.length; i++) {
        const code = values[i]["language"]; // misal "en"
        const el = document.querySelector('input[code="' + code + '"]'); // pakai selector attribute
        if (el) {
            el.value = values[i]["value"];
        }
    }
    values.forEach(v => {
        const input = document.getElementById("language_" + v.language);
        if (input) input.value = v.value;
    });
    document.getElementById("key").disabled = true
    document.getElementById("key").value = key
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateLanguage()' class='btn  btn-primary'>" + kapital(done) + "</a>"
}
async function updateLanguage() {
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
    var url = secondUrl + "translate/update"
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