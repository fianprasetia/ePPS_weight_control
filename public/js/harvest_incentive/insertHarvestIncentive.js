async function showModalInsertHarvestIncentive(id) {
    await selectCompany()
    await selectHarvestDay()
    // await selectUOM()
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestIncentive"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestIncentive"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("load").innerHTML =
        "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='insertHarvestIncentive()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function insertHarvestIncentive() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "companyHeader": { required: !0 },
                            "harvestDayHeader": { required: !0 },
                            "startBJR": { required: !0 },
                            "endBJR": { required: !0 },
                            "harvestBasis": { required: !0 },
                            "basisBonus": { required: !0 },
                            "extraBasisBonus": { required: !0 },
                            "extraBasisBonus2": { required: !0 },
                            "looseFruitBonus": { required: !0 },
                        },
                        messages: {
                            "companyHeader": required,
                            "harvestDayHeader": required,
                            "startBJR": required,
                            "endBJR": required,
                            "harvestBasis": required,
                            "basisBonus": required,
                            "extraBasisBonus": required,
                            "extraBasisBonus2": required,
                            "looseFruitBonus": required,
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
    const employeeID = dataLogin["idEmployee"];
    const company = document.getElementById("companyHeader").value;
    const harvestDay = document.getElementById("harvestDayHeader").value;
    const startBJR = document.getElementById("startBJR").value;
    const endBJR = document.getElementById("endBJR").value;
    const harvestBasis = document.getElementById("harvestBasis").value;
    const harvestBasisI = document.getElementById("harvestBasisI").value;
    const harvestBasisII = document.getElementById("harvestBasisII").value;
    const basisBonus = document.getElementById("basisBonus").value;
    const extraBasisBonus = document.getElementById("extraBasisBonus").value;
    const extraBasisBonusI = document.getElementById("extraBasisBonusI").value;
    const extraBasisBonusII = document.getElementById("extraBasisBonusII").value;
    const looseFruitBonus = document.getElementById("looseFruitBonus").value;
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestincentive/insert";
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
            message: overload
        });
        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        username_POST: username,
        employee_id_POST: employeeID,
        company_POST: company,
        harvest_day_POST: harvestDay,
        startBJR_POST: startBJR,
        endBJR_POST: endBJR,
        harvestBasis_POST: harvestBasis,
        harvestBasis_I_POST: harvestBasisI,
        harvestBasis_II_POST: harvestBasisII,
        basis_bonus_POST: unformatRupiah(basisBonus),
        extra_basis_bonus_POST: unformatRupiah(extraBasisBonus),
        extra_basis_bonus_I_POST: unformatRupiah(extraBasisBonusI),
        extra_basis_bonus_II_POST: unformatRupiah(extraBasisBonusII),
        loose_fruit_bonus_POST: unformatRupiah(looseFruitBonus),
    });
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
                    window.location.href = "/harvest_incentive";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/harvest_incentive";
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