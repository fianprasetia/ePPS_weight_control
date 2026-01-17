async function insertBasicSalary() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formBasicSalary").validate({
                        ignore: [],
                        rules: {
                            "locationHeader": { required: !0 },
                            "employeeTypeHeader": { required: !0 },
                            "periodDateHeader": { required: !0 },
                        },
                        messages: {
                            "locationHeader": required,
                            "employeeTypeHeader": required,
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
    const form = jQuery("#formBasicSalary");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const location = document.getElementById("locationHeader").value
    const type = document.getElementById("employeeTypeHeader").value
    const periodDate = document.getElementById("periodDateHeader").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const detail = [];
    const dataBasicSalary = [];
    const table = document.getElementById("basicSalaryDataThead").getElementsByTagName("tbody")[0];
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const emploteeID = rows[i].cells[1].innerText;
        const nominal = rows[i].querySelector('input[name="nominal[]"]').value;
        const jobTitle = rows[i].cells[6].innerText;

        detail.push({
            employee_id_POST: emploteeID,
            nominal_POST: unformatRupiah(nominal),
            id_job_title_POST: jobTitle
        });
    }
    const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
    const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
    const location_Header = JSON.parse('{"location_POST":"' + location + '"}')
    const type_Header = JSON.parse('{"type_POST":"' + type + '"}')
    const periodDate_Header = JSON.parse('{"period_date_POST":"' + periodDate + '"}')
    $.extend(language_Header, usernname_Header, location_Header, type_Header, periodDate_Header, { detail });
    dataBasicSalary.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "basicsalary/insert";
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
    var data = JSON.stringify(dataBasicSalary);
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
                    window.location.href = "/basic_salary";
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
                    window.location.href = "/basic_salary";
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