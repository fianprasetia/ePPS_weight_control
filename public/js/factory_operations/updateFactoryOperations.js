async function showDataItemRepairDetail(rowId) {
    const row = document.getElementById(rowId);
    if (!row) {
        console.error("Row tidak ditemukan untuk ID:", rowId);
        return;
    }

    
    const cells = row.cells;

    const startRepairTime = cells[3].innerText;
    const endRepairTime = cells[4].innerText;
    const breakdown = cells[5].innerText;
    const startpresure = cells[6].innerText;
    const endpresure = cells[7].innerText;
    const note = cells[8].innerText;
    const codeStation = cells[10].innerText;
    const codeMachine = cells[11].innerText;
    const codeStatus = cells[12].innerText;
    await selectStation(codeStation);
    await selectEngine(codeStation, codeMachine);
    await selectStatus(codeStatus)
    document.getElementById("startRepairTime").value = startRepairTime
    document.getElementById("endRepairTime").value = endRepairTime
    document.getElementById("breakdownDetail").value = breakdown
    document.getElementById("startpresure").value = startpresure
    document.getElementById("endpresure").value = endpresure
    document.getElementById("noteDetail").value = note


    document.getElementById("actionsOrder").innerHTML = `<a title="Add" type="submit" onclick="updateItemRepairDetail('${rowId}')" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
}
async function updateItemRepairDetail(rowId) {
    let row = document.getElementById(rowId);
    if (row) {
        row.remove();
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation");
                jQuery("#formDetail").validate({
                    ignore: [],
                    rules: {
                        "stationDetail": { required: !0 },
                        "machineDetail": { required: !0 },
                        "startRepairTime": { required: !0 },
                        "endRepairTime": { required: !0 },
                        "breakdownDetail": { required: !0 },
                        "startpresure": { required: !0 },
                        "endpresure": { required: !0 },
                        "noteDetail": { required: !0 },
                        "statusDetail": { required: !0 },
                    },
                    messages: {
                        "stationDetail": required,
                        "machineDetail": required,
                        "startRepairTime": required,
                        "endRepairTime": required,
                        "breakdownDetail": required,
                        "startpresure": required,
                        "endpresure": required,
                        "noteDetail": required,
                        "statusDetail": required
                    }
                });

                jQuery(".js-select2").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
                jQuery(".js-flatpickr").on("change", e => {
                    jQuery(e.currentTarget).valid();
                });
            }
            static init() {
                this.initValidation();
            }
        }
        Dashmix.onLoad(() => e.init());
    })();

    const form = jQuery("#formDetail");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    
    
    const mill = document.getElementById("millHeader").value;
    var elementstation = document.querySelector("#stationDetail")
    const station = (elementstation.options[elementstation.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementstation.options[elementstation.selectedIndex].innerHTML
    var elementmachine = document.querySelector("#machineDetail")
    const machine = (elementmachine.options[elementmachine.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementmachine.options[elementmachine.selectedIndex].innerHTML
    const startRepairTime = document.getElementById("startRepairTime").value;
    const endRepairTime = document.getElementById("endRepairTime").value;
    const breakdown = document.getElementById("breakdownDetail").value;
    const startpresure = document.getElementById("startpresure").value;
    const endpresure = document.getElementById("endpresure").value;
    const note = document.getElementById("noteDetail").value;
    var elementstatus = document.querySelector("#statusDetail")
    const status = (elementstatus.options[elementstatus.selectedIndex].innerHTML.trim().toUpperCase() === "PILIH") ? "" : elementstatus.options[elementstatus.selectedIndex].innerHTML
    const codeStation = document.getElementById("stationDetail").value;
    const codeMachine = document.getElementById("machineDetail").value;
    const codeStatus = document.getElementById("statusDetail").value;


    let isDuplicate = false;


    const existingRows = document.querySelectorAll("#dataTableItem tr");
    for (let row of existingRows) {
        const cell = row.cells[1];
        if (cell && cell.textContent.trim() === machine) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: duplicate.replace("{{mesin}}", `${duplicate_machine}`) });
    } else {
        const index = existingRows.length;
        addRowItemRepair(
            index,
            station,
            machine,
            startRepairTime,
            endRepairTime,
            breakdown,
            startpresure,
            endpresure,
            note,
            status,
            codeStation,
            codeMachine,
            codeStatus
        );
    }
    await selectStation(mill);
    await selectStatus()
    document.getElementById("machineDetail").innerHTML = "";
    document.getElementById("formDetail").reset();
}
async function showUpdateFactoryOperations(code) {
    document.getElementById("dataTableItem").innerHTML = ""
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "factoryoperations/code"
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
        code_POST: code,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            await resetDataTables()
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                await Promise.all([
                    selectMill(responseData[0]["mill"]),
                    selectShift(responseData[0]["work_shift"]),
                    selectMandor(responseData[0]["foreman"]),
                    selectAssiten(responseData[0]["assistant"]),
                ]);
                const startTimeTemp = responseData[0]["on_duty_time"]
                let startTime = startTimeTemp.split(":").slice(0, 2).join(":");
                const endTimeTemp = responseData[0]["off_duty_time"]
                let endTime = endTimeTemp.split(":").slice(0, 2).join(":");
                document.getElementById("dateHeader").value = ddmmyyyy(responseData[0]["date"])
                document.getElementById("startTime").value = startTime
                document.getElementById("endTime").value = endTime
                document.getElementById("timeProcessHeader").value = responseData[0]["total_working_hours"]
                document.getElementById("breakdownHeader").value = responseData[0]["total_repair_time"]
                document.getElementById("NumberofCagesHeader").value = responseData[0]["number_of_cages"]
                document.getElementById("processedFFBHeader").value = responseData[0]["processed_ffb"]
                
                
                
                dataDetail = responseData[0]["details"];

                for (const data of dataDetail) {
                    let uniqueIndex = data.id * 111;
                    const station = data.factorystation.name;
                    const machine = data.factorymachine.name;

                    const startRepairTemp = data.on_repair_time
                    const startRepair = startRepairTemp.split(":").slice(0, 2).join(":");
                    const endRepairTemp = data.off_repair_time
                    const endRepair = endRepairTemp.split(":").slice(0, 2).join(":");
                    
                    let statusLabel = await selectStatus(data.status);

                    addRowItemRepair(
                        uniqueIndex,
                        station,
                        machine,
                        startRepair,
                        endRepair,
                        data.total_repair_time,
                        data.presure_start,
                        data.presure_end,
                        data.note,
                        statusLabel,
                        data.station,
                        data.machine,
                        data.status,
                    );
                }

                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            message = "data failed to load";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function updateFactoryOperations(id) {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeader").validate({
                        ignore: [],
                        rules: {
                            "millHeader": { required: !0 },
                            "dateHeader": { required: !0 },
                            "shiftHeader": { required: !0 },
                            "startTime": { required: !0 },
                            "endTime": { required: !0 },
                            "foremanHeader": { required: !0 },
                            "assistantHeader": { required: !0 },
                            "breakdownHeader": { required: !0 },
                            "NumberofCagesHeader": { required: !0 },
                            "processedFFBHeader": { required: !0 },
                        },
                        messages: {
                            "millHeader": required,
                            "dateHeader": required,
                            "shiftHeader": required,
                            "startTime": required,
                            "endTime": required,
                            "foremanHeader": required,
                            "breakdownHeader": required,
                            "timeProcessHeader": required,
                            "NumberofCagesHeader": required,
                            "processedFFBHeader": required,
                        }
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
    const form = jQuery("#formHeader");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const code = id.getAttribute('code');
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const mill = document.getElementById("millHeader").value
    const date = document.getElementById("dateHeader").value
    const shift = document.getElementById("shiftHeader").value
    const startTime = document.getElementById("startTime").value
    const endTime = document.getElementById("endTime").value
    const foreman = document.getElementById("foremanHeader").value
    const assistant = document.getElementById("assistantHeader").value
    const timeProcess = document.getElementById("timeProcessHeader").value
    const breakdown = document.getElementById("breakdownHeader").value
    const NumberofCages = document.getElementById("NumberofCagesHeader").value
    const processedFFB = document.getElementById("processedFFBHeader").value
    var dataFactoryOperations = [];
    var detail = [];
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        const startRepairTime = rows[i].cells[3].innerText;
        const endRepairTime = rows[i].cells[4].innerText;
        const breakdown = rows[i].cells[5].innerText;
        const startpresure = rows[i].cells[6].innerText;
        const endpresure = rows[i].cells[7].innerText;
        const note = rows[i].cells[8].innerText;
        const codeStation = rows[i].cells[10].innerText;
        const codeMachine = rows[i].cells[11].innerText;
        const codeStatus = rows[i].cells[12].innerText;
        detail.push({
            start_repair_time_POST: startRepairTime,
            end_repair_time_POST: endRepairTime,
            breakdown_POST: breakdown,
            start_presure_POST: startpresure,
            end_presure_POST: endpresure,
            note_POST: note,
            code_station_POST: codeStation,
            code_machine_POST: codeMachine,
            code_status_POST: codeStatus,
        });
    }
    const language_Header = JSON.parse('{"language_POST":"' + language + '"}')
    const usernname_Header = JSON.parse('{"username_POST":"' + username + '"}')
    const employeeID_Header = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
    const code_Header = JSON.parse('{"code_POST":"' + code + '"}')
    const mill_Header = JSON.parse('{"mill_POST":"' + mill + '"}')
    const date_Header = JSON.parse('{"date_POST":"' + yyyymmdd(date) + '"}')
    const shift_Header = JSON.parse('{"shift_POST":"' + shift + '"}')
    const startTime_Header = JSON.parse('{"start_time_POST":"' + startTime + '"}')
    const endTime_Header = JSON.parse('{"end_time_POST":"' + endTime + '"}')
    const foreman_Header = JSON.parse('{"foreman_POST":"' + foreman + '"}')
    const assistant_Header = JSON.parse('{"assistant_POST":"' + assistant + '"}')
    const timeProcess_Header = JSON.parse('{"timeProcess_POST":"' + timeProcess + '"}')
    const breakdown_Header = JSON.parse('{"breakdown_POST":"' + breakdown + '"}')
    const NumberofCages_Header = JSON.parse('{"Number_of_cages_POST":"' + NumberofCages + '"}')
    const processedFFB_Header = JSON.parse('{"processed_FFB_POST":"' + processedFFB + '"}')
    $.extend(language_Header, employeeID_Header, usernname_Header, code_Header, mill_Header, date_Header, shift_Header, startTime_Header, endTime_Header, foreman_Header, assistant_Header, timeProcess_Header, breakdown_Header, NumberofCages_Header, processedFFB_Header, { detail });
    dataFactoryOperations.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "factoryoperations/update";
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
    var data = JSON.stringify(dataFactoryOperations);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/factory_operations";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/factory_operations";
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
async function showModalPostingFactoryOperations(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id ='" + param + "' type='submit' onclick='postingFactoryOperations(id)' class='btn  btn-primary'>" + kapital(done) + "</a>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function postingFactoryOperations(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const employeeID = dataLogin["idEmployee"]
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "factoryoperations/posting"
    xhr.onloadstart = function () {
        document.getElementById("loadNotice").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            "+ loading + "...\n\
          </button>";
    };
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
        code_POST: id,
        username_POST: username,
        employeeID_POST: employeeID
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/factory_operations";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/factory_operations";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            message = "data failed to load";
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}