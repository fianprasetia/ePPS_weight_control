async function showLayoutUpdateData(id) {
    const btnIn = document.getElementById('getWeightInBtn')
    btnIn.style.pointerEvents = 'none';
    const btnOut = document.getElementById('getWeightOutBtn');
    btnOut.style.pointerEvents = 'auto';
    document.getElementById('getWeightInBtn').classList.replace('btn-primary', 'btn-secondary');
    document.getElementById('getWeightOutBtn').classList.replace('btn-secondary', 'btn-primary');

    const language = await JSON.parse(getCookie("language"));
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "weightbridge/bycode";
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
    let data = JSON.stringify({
        language_POST: language,
        code_POST: id
    });

    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                let responseData = response["data"];
                let estateID = responseData["estate_code"];
                let divisionID = responseData["division_code"];
                let blockID = responseData["unit_type"];
                let vehicleID = responseData["vehicle_no"];
                await selectEstate(estateID)
                await selectDivision(estateID, divisionID)
                await selectBlock(divisionID, blockID)
                await selectVehicleNumber(vehicleID)
                document.getElementById("ticket").value = responseData["ticket_no"];
                document.getElementById("division").value = responseData["division_code"];
                document.getElementById("block").value = responseData["block_code"];
                document.getElementById("noVehicle").value = responseData["vehicle_no"];
                document.getElementById("driver").value = responseData["driver_name"];
                document.getElementById("delivery").value = responseData["spb_no"];
                document.getElementById("totalBunches").value = responseData["bunch_count"];
                document.getElementById("looseFruit").value = responseData["loose_fruit"];
                document.getElementById("plantingYear").value = responseData["year_plant"];
                document.getElementById("weightIn").value = responseData["gross_weight"];
                document.getElementById("note").value = responseData["note"];
                document.getElementById("dateIn").value = formatDateTime(responseData["entry_time"]);
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            }

        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

async function showModalUpdateAndPrint(id) {
    if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
    }
    await loadPrinters()
    var myModal = new bootstrap.Modal(document.getElementById("modalInternalFFB"), { keyboard: false });
    myModal.toggle();
}

async function updateAndPrint() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "weightOut": { required: !0 },
                            "dateOut": { required: !0 },
                            "grossWeight": { required: !0 },
                            "deduction": { required: !0 },
                            "netWeight": { required: !0 },
                        },
                        messages: {
                            "weightOut": required,
                            "dateOut": required,
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
    const ticketNo = document.getElementById("ticket").value;
    const weightOut = document.getElementById("weightOut").value;
    const dateOut = document.getElementById("dateOut").value;
    const grossWeight = document.getElementById("grossWeight").value; // bruto
    const deduction = document.getElementById("deduction").value;
    const netWeight = document.getElementById("netWeight").value; // netto

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "weightbridge/update";
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
    let data = JSON.stringify({
        language_POST: language,
        employeeID_POST: employeeID,
        ticket_no: ticketNo,
        weightOut_POST: weightOut,
        dateOut_POST: dateOut,
        grossWeight_POST: grossWeight,
        deduction_POST: deduction,
        netWeight_POST: netWeight,
    });
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                const responseData = response["data"];
                const generatedTicketNo = responseData ? responseData.ticket_no : ticketNo;

                // Populate print preview modal fields
                document.getElementById("previewTicketNo").innerText = generatedTicketNo || '-';
                document.getElementById("previewSpbNo").innerText = delivery || '-';
                document.getElementById("previewVehicleNo").innerText = noVehicle || '-';
                document.getElementById("previewDriverName").innerText = driver || '-';
                document.getElementById("previewEstateCode").innerText = estate || '-';
                document.getElementById("previewDivisionCode").innerText = division || '-';
                document.getElementById("previewUnitType").innerText = codeBlock.join(', ') || '-';
                document.getElementById("previewYearPlant").innerText = plantingYear || '-';
                document.getElementById("previewEntryTime").innerText = dateIn || '-';
                document.getElementById("previewExitTime").innerText = dateOut || '-';
                document.getElementById("previewGrossWeight").innerText = (weightIn || '0') + ' KG';
                document.getElementById("previewTareWeight").innerText = (weightOut || '0') + ' KG';
                document.getElementById("previewBruto").innerText = (grossWeight || '0') + ' KG';
                document.getElementById("previewNetto").innerText = (netWeight || '0') + ' KG';
                document.getElementById("previewNote").innerText = note || '-';
                document.getElementById("previewCreatedBy").innerText = employeeID || '-';

                // Fetch company name from Selected Estate dropdown text
                const estateSelect = document.getElementById("estate");
                const selectedEstateName = estateSelect.options[estateSelect.selectedIndex]?.text || '';
                document.getElementById("previewCompanyName").innerText = selectedEstateName || 'PT SIA PLANTATION';

                // Set Action on Print Button
                document.getElementById("btnPrintTicket").onclick = function () {
                    window.open('/print-ticket/' + generatedTicketNo, '_blank');
                    $('#modalInternalFFB').modal('hide');
                    setTimeout(() => {
                        window.location.href = "/internal_ffb";
                    }, 1000);
                };

                // Show modal
                $('#modalInternalFFB').modal('show');
            } else {
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: response["message"]
                });
            }
        } else {
            Dashmix.helpers("jq-notify", {
                z_index: 2000,
                type: "danger",
                message: "Server error: " + this.status
            });
        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
    return false;
}