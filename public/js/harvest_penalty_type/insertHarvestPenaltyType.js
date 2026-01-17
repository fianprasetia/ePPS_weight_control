async function showModalInsertHarvestPenaltyType(id) {
    await selectLanguage();
    // document.getElementById("code").disabled = false
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestPenaltyType"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestPenaltyType"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("load").innerHTML =
        "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='InsertHarvestPenaltyType()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function InsertHarvestPenaltyType() {

    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "language[]": { required: !0 },
                        },
                        messages: {
                            "language[]": required,
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
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    // const code = document.getElementById("code").value;
    // const depreciation = document.getElementById("depreciation").value;
    // const fixed = document.getElementById("fixed").value;
    const elements = document.getElementsByName("language[]");
    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });
    var detail = [];
    var dataHarvestPenaltyType = [];
    for (var i = 0; i < valuesLanguage.length; i++) {
        const languageData = JSON.parse(
            '{"language_POST":"' + valuesLanguage[i] + '"}'
        );
        $.extend(languageData);
        detail.push(languageData);
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}');
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}');
    // const codelMenu = JSON.parse('{"code_POST":"' + code + '"}');
    // const depreciationMenu = JSON.parse('{"depreciation_POST":"' + depreciation + '"}');
    // const accumulatedMenu = JSON.parse('{"accumulated_POST":"' + fixed + '"}');
    $.extend(usernameMenu, languageMenu, { detail });
    dataHarvestPenaltyType.push(usernameMenu);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestpenaltytype/insert";
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
        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    };

    var data = JSON.stringify(dataHarvestPenaltyType);
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
                    window.location.href = "/harvest_penalty_type";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/harvest_penalty_type";
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