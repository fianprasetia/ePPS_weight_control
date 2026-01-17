async function insertBlockMaster() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeaderBlockMaster").validate({
                        ignore: [],
                        rules: {
                            "blockHeader": { required: !0 },
                            "plantingYearHeader": { required: !0 },
                            "treeClassHeader": { required: !0 },
                            "plantedAreaHeader": { required: !0 },
                            "unplantedAreaHeader": { required: !0 },
                            "numberOfTreesHeader": { required: !0 },
                            "blockStatusHeader": { required: !0 },
                            "startHarvestHeader": { required: !0 },
                            "soilCodeHeader": { required: !0 },
                            "soilClassificationHeader": { required: !0 },
                            "topographyHeader": { required: !0 },
                            "nucleusPlasmaHeader": { required: !0 },
                            "seedTypeHeader": { required: !0 },
                        },
                        messages: {
                            "blockHeader": required,
                            "plantingYearHeader": required,
                            "treeClassHeader": required,
                            "plantedAreaHeader": required,
                            "unplantedAreaHeader": required,
                            "numberOfTreesHeader": required,
                            "blockStatusHeader": required,
                            "startHarvestHeader": required,
                            "soilCodeHeader": required,
                            "soilClassificationHeader": required,
                            "topographyHeader": required,
                            "nucleusPlasmaHeader": required,
                            "seedTypeHeader": required,
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
    const form = jQuery("#formHeaderBlockMaster");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const block = document.getElementById("blockHeader").value
    const plantingYear = document.getElementById("plantingYearHeader").value
    const treeClass = document.getElementById("treeClassHeader").value
    const plantedArea = document.getElementById("plantedAreaHeader").value
    const unplantedArea = document.getElementById("unplantedAreaHeader").value
    const numberOfTrees = document.getElementById("numberOfTreesHeader").value
    const blockStatus = document.getElementById("blockStatusHeader").value
    const startHarvest = document.getElementById("startHarvestHeader").value
    const soilCode = document.getElementById("soilCodeHeader").value
    const soilClassification = document.getElementById("soilClassificationHeader").value
    const topography = document.getElementById("topographyHeader").value
    const nucleusPlasma = document.getElementById("nucleusPlasmaHeader").value;
    const seedType = document.getElementById("seedTypeHeader").value
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "blockmaster/insert";
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
    var data = JSON.stringify({
        language_POST: language,
        block_POST: block,
        planting_year_POST: plantingYear,
        tree_class_POST: treeClass,
        planted_area_POST: plantedArea,
        unplanted_area_POST: unplantedArea,
        number_of_trees_POST: numberOfTrees,
        block_status_POST: blockStatus,
        start_harvest_POST: yyyymm(startHarvest),
        soil_code_POST: soilCode,
        soil_classification_POST: soilClassification,
        topography_POST: topography,
        nucleus_plasma_POST: nucleusPlasma,
        seed_type_POST: seedType,
        username_POST: username,
        employee_id_POST: employeeID,
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
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/block_master";
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
                    window.location.href = "/block_master";
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