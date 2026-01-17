async function showModalInsertHarvestPenalty(id) {
    await selectEstate()
    await selectHarvestPenaltyType()
    await selectUOM()
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestPenalty"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalHarvestPenalty"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("load").innerHTML =
        "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='insertHarvestPenalty()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function insertHarvestPenalty() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "estateHeader": { required: !0 },
                            "harvestPenaltyTypeHeader": { required: !0 },
                            "uomHeader": { required: !0 },
                            "nominalHeader": { required: !0 },
                        },
                        messages: {
                            "estateHeader": required,
                            "harvestPenaltyTypeHeader": required,
                            "uomHeader": required,
                            "nominalHeader": required,
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
    const estate = document.getElementById("estateHeader").value;
    const harvestPenaltyType = document.getElementById("harvestPenaltyTypeHeader").value;
    const uom = document.getElementById("uomHeader").value;
    const nominal = document.getElementById("nominalHeader").value;
    const note = document.getElementById("noteHeader").value;
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "harvestpenalty/insert";
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
        estate_POST: estate,
        harvest_penalty_type_POST: harvestPenaltyType,
        uom_POST: uom,
        nominal_POST: unformatRupiah(nominal),
        note_POST: note,

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
                    window.location.href = "/harvest_penalty";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/harvest_penalty";
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