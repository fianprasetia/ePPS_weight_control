async function save() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "estate": { required: !0 },
                            "division": { required: !0 },
                            "block[]": { required: !0 },
                            "driver": { required: !0 },
                            "delivery": { required: !0 },
                            "totalBunches": { required: !0 },
                            "looseFruit": { required: !0 },
                            "emptyBunch": { required: !0 },
                            "overripe": { required: !0 },
                            "unripe": { required: !0 },
                            "longStalk": { required: !0 },
                            "mandatoryDeduction": { required: !0 },
                            "weightIn": { required: !0 },
                            "dateIn": { required: !0 },
                            "noVehicle": { required: !0 },
                            "grossWeight": { required: !0 },
                            "deduction": { required: !0 },
                            "netWeight": { required: !0 },
                        },
                        messages: {
                            "estate": required,
                            "division": required,
                            "block[]": required,
                            "driver": required,
                            "delivery": required,
                            "totalBunches": required,
                            "looseFruit": required,
                            "weightIn": required,
                            "dateIn": required,
                            "noVehicle": required,
                            "grossWeight": required,
                            "deduction": required,
                            "netWeight": required,
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
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"];
    const estate = document.getElementById("estate").value
    const division = document.getElementById("division").value
    const driver = document.getElementById("driver").value
    const delivery = document.getElementById("delivery").value
    const totalBunches = document.getElementById("totalBunches").value
    const looseFruit = document.getElementById("looseFruit").value
    const plantingYear = document.getElementById("plantingYear").value
    const note = document.getElementById("note").value
    const weightIn = document.getElementById("weightIn").value
    const dateIn = document.getElementById("dateIn").value
    const noVehicle = document.getElementById("noVehicle").value

    const dataWeightIn = []
    const block = document.getElementById("block");
    const codeBlock = Array.from(block.selectedOptions).map(option => option.value);
    const detailBlock = [];
    for (let i = 0; i < codeBlock.length; i++) {
        const BlockData = JSON.parse(
            '{"code_block_POST":"' + codeBlock[i] + '"}'
        );
        $.extend(BlockData);
        detailBlock.push(BlockData);
    }

    const languageData = JSON.parse('{"language_POST":"' + language + '"}');
    const employeeIDData = JSON.parse('{"employeeID_POST":"' + employeeID + '"}');
    const estateData = JSON.parse('{"estate_POST":"' + estate + '"}');
    const divisionData = JSON.parse('{"division_POST":"' + division + '"}');
    const noVehicleData = JSON.parse('{"noVehicle_POST":"' + noVehicle + '"}');
    const driverData = JSON.parse('{"driver_POST":"' + driver + '"}');
    const deliveryData = JSON.parse('{"delivery_POST":"' + delivery + '"}');
    const totalBunchesData = JSON.parse('{"totalBunches_POST":"' + totalBunches + '"}');
    const looseFruitData = JSON.parse('{"looseFruit_POST":"' + looseFruit + '"}');
    const plantingYearData = JSON.parse('{"plantingYear_POST":"' + plantingYear + '"}');
    const noteData = JSON.parse('{"note_POST":"' + note + '"}');
    const sourceData = JSON.parse('{"source_POST":"INTERNAL"}');
    const weightInData = JSON.parse('{"weightIn_POST":' + weightIn + '}');
    const dateInData = JSON.parse('{"dateIn_POST":"' + dateIn + '"}');

    $.extend(languageData, employeeIDData, estateData, divisionData, driverData, deliveryData, totalBunchesData, looseFruitData, plantingYearData, noteData, sourceData, weightInData, dateInData, noVehicleData, { detailBlock });
    dataWeightIn.push(languageData);

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "weightbridge/insert";
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
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify(dataWeightIn);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
                }, 3000);
            } else {
                console.log("keluar")
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
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

