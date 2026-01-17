async function showModalUpdatePartners(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalPartners"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalPartners"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updatePartners()' class='btn btn-primary'>" + kapital(done) + "</a>"
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "partners/code"
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
        code_partners_POST: id,
        // language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                const status = responseData[0]["status"]
                const city = responseData[0]["city"]
                const partnersType = responseData[0]["code_partners_type"]
                await selectPartnersType(partnersType)
                await selectCity(city)
                document.getElementById("code").value = responseData[0]["code_partners"]
                document.getElementById("name").value = responseData[0]["name"]
                document.getElementById("address").value = responseData[0]["address"]
                document.getElementById("phone").value = responseData[0]["phone"]
                document.getElementById("email").value = responseData[0]["email"]
                document.getElementById("contactName").value = responseData[0]["contact_person"]
                document.getElementById("tax").value = responseData[0]["tax_id"]
                document.getElementById("bankName").value = responseData[0]["bank_name"]
                document.getElementById("bankAccount").value = responseData[0]["bank_account"]
                mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(active) : kapital(nonactive)) + "</option>";
                optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
                document.getElementById("status").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";
                document.getElementById("partnersType").disabled = true
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
async function updatePartners() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const code = document.getElementById("code").value
    const partnersType = document.getElementById("partnersType").value
    const name = document.getElementById("name").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const contactName = document.getElementById("contactName").value
    const tax = document.getElementById("tax").value
    const bankName = document.getElementById("bankName").value
    const bankAccount = document.getElementById("bankAccount").value
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
    if (!isValid) {
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(
        {
            language_POST: language,
            code_POST: code,
            partners_type_POST: partnersType,
            name_POST: name,
            address_POST: address,
            city_POST: city,
            phone_POST: phone,
            email_POST: email,
            contact_name_POST: contactName,
            tax_POST: tax,
            bank_name_POST: bankName,
            bank_account_POST: bankAccount,
            status_POST: status,
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
                    window.location.href = "/partners";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}