async function showModalUpdatePartners(code) {
    const language = await JSON.parse(getCookie("language"));
    var myModal = new bootstrap.Modal(document.getElementById("modalPartners"), { keyboard: false });
    myModal.toggle();
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit'code =" + code + " onclick='updatePartners(this)' class='btn btn-primary'>" + kapital(done) + "</a>"
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "partners/bycode"
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
        code_partners_POST: code,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                const status = responseData["status"]
                const city = responseData["city"]
                await selectCity(city)
                document.getElementById("name").value = responseData["name"]
                document.getElementById("address").value = responseData["address"]
                document.getElementById("phone").value = responseData["phone"]
                document.getElementById("email").value = responseData["email"]
                document.getElementById("contactName").value = responseData["contact_person"]
                document.getElementById("isSupplier").checked = responseData["is_supplier"]
                document.getElementById("isSupplierTBS").checked = responseData["is_tbs_supplier"]
                document.getElementById("isTransporter").checked = responseData["is_transporter"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(active) : kapital(nonactive)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                document.getElementById("status").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/partners";
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

    xhr.send(data);
    return false;
}
async function updatePartners(id) {
    const code = id.getAttribute('code');
    const language = await JSON.parse(getCookie("language"));
    const name = document.getElementById("name").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const contactName = document.getElementById("contactName").value
    const isSupplier = document.getElementById("isSupplier").checked ? 1 : 0
    const isSupplierTBS = document.getElementById("isSupplierTBS").checked ? 1 : 0
    const isTransporter = document.getElementById("isTransporter").checked ? 1 : 0
    const status = document.getElementById("status").value
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "name": { required: !0 },
                            "status": { required: !0 },
                            "partnersType": { required: !0 },
                            "bankAccount": { number: !0 },
                            "tax": { number: !0 },
                        },
                        messages: {
                            "name": required,
                            "status": required,
                            "partnersType": required,
                            "bankAccount": number,
                            "tax": number
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
    const form = jQuery(".js-validation");
    const isValid = form.valid();
    if (!isValid || !$("#isSupplier").is(":checked") &&
        !$("#isSupplierTBS").is(":checked") &&
        !$("#isTransporter").is(":checked")) {
        $("#partnerType-error").text("Pilih minimal satu tipe partner.");
        return false;
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "partners/update";
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
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(
        {
            language_POST: language,
            code_POST: code,
            name_POST: name,
            address_POST: address,
            city_POST: city,
            phone_POST: phone,
            email_POST: email,
            contact_name_POST: contactName,
            isSupplier_POST: isSupplier,
            isSupplierTBS_POST: isSupplierTBS,
            isTransporter_POST: isTransporter,
            status_POST: status,
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["success"] == true) {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/partners";
                }, 3000);
            } else {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/partners";
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
    xhr.send(data);
    return false;
}