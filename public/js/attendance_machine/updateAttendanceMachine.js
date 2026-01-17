async function showModalUpadateAttendanceMachine(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalattendanceMachine"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalattendanceMachine"), { keyboard: false });
        myModal.toggle();
    }
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "attendance/id"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        attendanceMachine_POST: id,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                const status = responseData[0]["status"]
                const worksiteCode = responseData[0]["code_company"]
                document.getElementById("idMachine").value = responseData[0]["id_attendance_machine"]
                document.getElementById("ipAddress").value = responseData[0]["ip_address"]
                document.getElementById("port").value = responseData[0]["port"]
                document.getElementById("location").value = responseData[0]["location"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                document.getElementById("selectStatusActive").innerHTML =
                    "" + mainOptionStatus + "" + optionStatus + "";
                await selectWorksite(worksiteCode);
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='updateAttendanceMachine()' class='btn  btn-primary'>" + kapital(done) + "</button>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/attendance_machine";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
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
async function updateAttendanceMachine() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "selectWorksite": { required: !0 },
                            "ipAddress": { required: !0 },
                            "port": { required: !0 },
                            "selectStatusActive": { required: !0 },
                        },
                        messages: {
                            "selectWorksite": required,
                            "ipAddress": required,
                            "port": required,
                            "selectStatusActive": required,
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
    const worksite = document.getElementById("selectWorksite").value
    const ipAddress = document.getElementById("ipAddress").value
    const port = document.getElementById("port").value
    const status = document.getElementById("selectStatusActive").value
    const location = document.getElementById("location").value
    const id = document.getElementById("idMachine").value

    if (worksite == "" || ipAddress == "" || port == "" || status == "") {
        return false
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "attendance/update/" + id;
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
    var data = JSON.stringify(
        {
            language_POST: language,
            worksite_POST: worksite,
            ipAddress_POST: ipAddress,
            port_POST: port,
            status_POST: status,
            location_POST: location,
            username_POST: username
        }
    );
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
                    window.location.href = "/attendance_machine";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/attendance_machine";
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