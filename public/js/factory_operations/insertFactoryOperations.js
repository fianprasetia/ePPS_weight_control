async function insertFactoryOperations() {
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
    $.extend(language_Header, employeeID_Header, usernname_Header, mill_Header, date_Header, shift_Header, startTime_Header, endTime_Header, foreman_Header, assistant_Header, timeProcess_Header, breakdown_Header, NumberofCages_Header, processedFFB_Header, { detail });
    dataFactoryOperations.push(language_Header)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "factoryoperations/insert";
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