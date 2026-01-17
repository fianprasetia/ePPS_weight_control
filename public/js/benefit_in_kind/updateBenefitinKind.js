async function showModalUpadteBenefitinKind(el) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalBenefitinKind"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalBenefitinKind"), { keyboard: false });
        myModal.toggle();
    }
    const company = el.getAttribute("data-company");
    const type = el.getAttribute("data-type");
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "natura/code"
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
        language_POST: language,
        company_POST: company,
        type_POST: type,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("company").disabled = true
                document.getElementById("type").disabled = true
                const company = responseData[0]["code_company"]
                const catu = responseData[0]["catu_code"]
                document.getElementById("employee").value = responseData[0]["employee"]
                document.getElementById("husbandWife").value = responseData[0]["husband_wife"]
                document.getElementById("firstChild").value = responseData[0]["first_child"]
                document.getElementById("secondChild").value = responseData[0]["second_child"]
                document.getElementById("thirdChild").value = responseData[0]["third_child"]
                document.getElementById("totalKilogram").value = responseData[0]["total_kilogram"]
                document.getElementById("rpDay").value = formatRupiah(responseData[0]["rp_day"])
                document.getElementById("ricePrice").value = formatRupiah(responseData[0]["rice_price_kg"])
                await selectCompany(company);
                await selectCatu(catu);
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateBenefitinKind()' class='btn  btn-primary'>" + kapital(done) + "</a>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/benefit_in_kind";
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
async function updateBenefitinKind() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "company": { required: !0 },
                            "type": { required: !0 },
                            "employee": { required: !0 },
                            "husbandWife": { number: !0 },
                            "firstChild": { number: !0 },
                        },
                        messages: {
                            "company": required,
                            "type": required,
                            "employee": required,
                            "husbandWife": number,
                            "firstChild": number
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
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const company = document.getElementById("company").value
    const type = document.getElementById("type").value
    const employee = document.getElementById("employee").value
    const husbandWife = document.getElementById("husbandWife").value
    const firstChild = document.getElementById("firstChild").value
    const secondChild = document.getElementById("secondChild").value
    const thirdChild = document.getElementById("thirdChild").value
    const totalKilogram = document.getElementById("totalKilogram").value
    const ricePrice = unformatRupiah(document.getElementById("ricePrice").value)
    const rpDay = unformatRupiah(document.getElementById("rpDay").value)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "natura/update";
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
    var data = JSON.stringify(
        {
            language_POST: language,
            username_POST: username,
            company_POST: company,
            type_POST: type,
            employee_POST: employee,
            husband_wife_POST: husbandWife,
            first_child_POST: firstChild,
            second_child_POST: secondChild,
            third_child_POST: thirdChild,
            total_kilogram_POST: totalKilogram,
            rice_price_POST: ricePrice,
            rp_day_POST: rpDay,
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
                    window.location.href = "/benefit_in_kind";
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
                    window.location.href = "/benefit_in_kind";
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