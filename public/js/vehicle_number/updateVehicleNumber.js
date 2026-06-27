async function showModalUpdateVehicleNumber(id) {
    var myModal = new bootstrap.Modal(document.getElementById("modalVehicleNumber"), { keyboard: false });
    myModal.toggle();
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "vehiclenumber/bycode"
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
        language_POST: language,
        code_POST: id,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                document.getElementById("vehicleNumber").value = responseData["no_vehicle"]
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateVehicleNumber(" + id + ")' class='btn  btn-primary'>" + kapital(done) + "</a>"
                const status = responseData["status"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "1" ? kapital(active) : kapital(nonactive)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status == "1" ? "0" : "1") + ">" + (status != "1" ? kapital(active) : kapital(nonactive)) + "</option>";
                document.getElementById("status").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";

            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/vehiclenumber";
                }, 3000);
            }
        } if (this.status == 404) {
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

    xhr.send(data);
    return false;
}
async function updateVehicleNumber(id) {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "vehicleNumber": { required: !0 },
                            "status": { required: !0 }
                        },
                        messages: {
                            "vehicleNumber": required,
                            "status": required
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
        return false
    }
    const language = await JSON.parse(getCookie("language"));
    const vehicleNumber = document.getElementById("vehicleNumber").value
    const status = document.getElementById("status").value
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "vehiclenumber/update";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
          <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
          "+ loading + "...\n\
        </button>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", message: overload, });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };

    var data = JSON.stringify(
        {
            language_POST: language,
            vehicle_number_POST: vehicleNumber,
            status_POST: status,
            code_POST: id,
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                message = response["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "success", icon: "fa fa-check me-1", message: message, });
                setTimeout(function () {
                    window.location.href = "/vehicle_number";
                }, 3000);
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", icon: "fa fa-times me-1", message: message, });
                setTimeout(function () {
                    window.location.href = "/vehicle_number";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            message = "data failed to load";
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

    xhr.send(data);
    return false;
}