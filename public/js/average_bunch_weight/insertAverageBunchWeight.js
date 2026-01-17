async function insertAverageBunchRate() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeaderAverageBunchRate").validate({
                        ignore: [],
                        rules: {
                            "estateHeader": { required: !0 },
                            "divisiHeader": { required: !0 },
                            "periodDateHeader": { required: !0 },
                        },
                        messages: {
                            "estateHeader": required,
                            "divisiHeader": required,
                            "periodDateHeader": required,
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
    const form = jQuery("#formHeaderAverageBunchRate");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const estate = document.getElementById("estateHeader").value
    const divisi = document.getElementById("divisiHeader").value
    const periodDate = document.getElementById("periodDateHeader").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const detail = [];
    const dataAverageBunchRate = [];
    const table = document.getElementById("averageBunchRate").getElementsByTagName("tbody")[0];
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const block = rows[i].cells[1].innerText;
        const bjr = rows[i].querySelector('input[name="bjr[]"]').value;

        detail.push({
            block_POST: block,
            bjr_POST: bjr
        });
    }
    const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
    const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
    const estate_Header = JSON.parse('{"estate_POST":"' + estate + '"}')
    const divisi_Header = JSON.parse('{"division_POST":"' + divisi + '"}')
    const periodDate_Header = JSON.parse('{"period_date_POST":"' + yyyymm(periodDate) + '"}')
    $.extend(language_Header, usernname_Header, estate_Header, divisi_Header, periodDate_Header, { detail });
    dataAverageBunchRate.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "averagebunchrate/insert";
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
    var data = JSON.stringify(dataAverageBunchRate);
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
                    window.location.href = "/average_bunch_weight";
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
                    window.location.href = "/average_bunch_weight";
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