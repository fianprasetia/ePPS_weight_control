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
async function showModalUpdateAndPrint() {
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
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                await updateAndPrint(ticketNo)
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
let globalResponseData = null;
async function updateAndPrint(ticketNo) {
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "printticket/bycode";
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
        ticket_POST: ticketNo,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                let responseData = response["data"];
                globalResponseData = responseData;
                document.getElementById("previewCompany").innerText = responseData["dataWeighControl"]["name_company"];
                document.getElementById("previewMill").innerText = responseData["dataWeighControl"]["name_mill"];
                document.getElementById("previewTicketNo").innerText = responseData["dataWeighBridge"]["ticket_no"];
                document.getElementById("previewDateIn").innerText = formatDateTime(responseData["dataWeighBridge"]["entry_time"]);
                document.getElementById("previewDateOut").innerText = formatDateTime(responseData["dataWeighBridge"]["exit_time"]);
                document.getElementById("previewDivisionCode").innerText = responseData["dataWeighBridge"]["division"]["name"];
                document.getElementById("previewUnitType").innerText = responseData["dataWeighBridge"]["unit_type"];
                document.getElementById("previewYearPlant").innerText = responseData["dataWeighBridge"]["year_plant"];
                document.getElementById("previewLooseFruit").innerText = responseData["dataWeighBridge"]["loose_fruit"];
                document.getElementById("previewBunchCount").innerText = responseData["dataWeighBridge"]["bunch_count"];
                document.getElementById("previewSpbNo").innerText = responseData["dataWeighBridge"]["spb_no"];
                document.getElementById("previewDriverName").innerText = responseData["dataWeighBridge"]["driver_name"];
                document.getElementById("previewVehicleNo").innerText = responseData["dataWeighBridge"]["vehicle_no"];
                document.getElementById("previewOperatorTimbangan").innerText = responseData["dataWeighBridge"]["adm_employee"]["fullname"];
                document.getElementById("previewDriver").innerText = responseData["dataWeighBridge"]["driver_name"];

                tableItem =
                    "<tr>\
                        <td class='fw-light text-center'>" + responseData["dataWeighBridge"]["gross_weight"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataWeighBridge"]["tare_weight"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataWeighBridge"]["deduction"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataWeighBridge"]["netto"] + "</td>\
                    </tr>";
                document.getElementById("previewDataTableItem").innerHTML = tableItem;
                const socket = io(mainUrl); // atau cukup io() jika satu domain
                socket.emit(
                    "getPrinters",
                    {
                        scaleId: "01"
                    },
                    function (response) {
                        if (!response.success) {
                            alert(response.message);
                            return;
                        }
                        let html = "";
                        response.printers.forEach(function (printer) {
                            html += `<option value="${printer}">${printer}</option>`;
                        });
                        document.getElementById("printer").innerHTML = html;
                    }
                );
                var myModal = new bootstrap.Modal(document.getElementById("modalInternalFFB"), { keyboard: false });
                myModal.toggle();
                document.getElementById("loadAccessPrint").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger text-uppercase'>" + kapital(cancel) + "</a> <a id='printBtn' type='submit' onclick='printTicket()' class='btn  btn-primary text-uppercase'>Print</a>"
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

async function printTicket() {
    const language = await JSON.parse(getCookie("language"));
    const scaleID = await getScaleID();

    if (!scaleID) {
        console.error("Scale ID tidak ditemukan");
        return;
    }
    // const socket = io(mainUrl);
    socket.emit(
        "printTicketTBSInti",
        {
            scaleId: scaleID,
            printer: $("#printer").val(),
            responseData: globalResponseData,
            language: language
        },
        function (response) {

            if (response.success) {

                alert("Print Berhasil");
                updateStatus()

            } else {

                alert(response.message);

            }

        }
    );
}
async function updateStatus() {
    const language = await JSON.parse(getCookie("language"));
    const ticketNo = document.getElementById("ticket").value;
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "weightbridge/updatebystatus";
    // xhr.onloadstart = function () {
    //     document.getElementById("load").innerHTML =
    //         "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
    //       <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
    //       "+ loading + "...\n\
    //     </button>";
    // };
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
        ticket_no: ticketNo,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["success"] == true) {
                // await updateAndPrint(ticketNo)
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