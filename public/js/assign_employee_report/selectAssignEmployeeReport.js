
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        // alert("ksong")
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("assingEmployeeReportPage").innerHTML = filterLanguage[0]["content"]["assign_employee_report"]
        document.getElementById("nameTabel").innerHTML = filterLanguage[0]["content"]["name"]
        document.getElementById("assignEmployeeTable").innerHTML = filterLanguage[0]["content"]["assign_employee"]
        document.getElementById("dateTable").innerHTML = filterLanguage[0]["content"]["date"]
        document.getElementById("onDutyTable").innerHTML = filterLanguage[0]["content"]["on_duty"]
        document.getElementById("offDutyTable").innerHTML = filterLanguage[0]["content"]["off_duty"]
        document.getElementById("checkInTable").innerHTML = filterLanguage[0]["content"]["checkin"]
        document.getElementById("checkOutTable").innerHTML = filterLanguage[0]["content"]["checkout"]
        document.getElementById("lateTable").innerHTML = filterLanguage[0]["content"]["late_tolerance"]
        document.getElementById("EarlyTable").innerHTML = filterLanguage[0]["content"]["leave_early_time"]
        document.getElementById("overTable").innerHTML = filterLanguage[0]["content"]["over_time"]
        await selectWorksite()
        setTimeout(() => {
            hideSpinner();
        }, 1000);
    }
}
async function selectWorksite(worksiteCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    const companyCode = companyType[0]["code_company"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/worksite"
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
        language_POST: language,
        companyType_POST: companyTypeCode,
        companyParent_POST: companyParent,
        companyCode_POST: companyCode
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == worksiteCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != worksiteCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_company"] +
                        "'>" +
                        kapital(filternotSubData[i]["name"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("worksite").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee_report";
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
async function selectEmployee(employeeID) {
    const language = await JSON.parse(getCookie("language"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyCode = document.getElementById("worksite").value
    const companyParent = companyType[0]["parent_code"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/worksite"
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
        language_POST: language,
        companyType_POST: companyTypeCode,
        companyCode_POST: companyCode,
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == employeeID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != employeeID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' worksite=" + filternotSubData[i]["worksite"] + " value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"]) +
                        "</option>";
                }
                if (employeeID == "" || employeeID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected value='all'>" + kapital(all) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase'  worksite=" + filterSubData[0]["worksite"] + "  value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"]) + "</option>";
                }

                document.getElementById("name").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/assign_employee_report";
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
async function selectDataAttendance() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "worksite": { required: !0 },
                            "name": { required: !0 },
                            "startDate": { required: !0 },
                        },
                        messages: {
                            "worksite": required,
                            "name": required,
                            "startDate": required,
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
    document.getElementById("dataTable").innerHTML = ""
    document.getElementById("doc").hidden = true
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    const companyCode = document.getElementById("worksite").value
    const companyEmployee = document.getElementById("name").value
    const startDate = yyyymmdd(document.getElementById("startDate").value)
    const endDate = yyyymmdd(document.getElementById("endDate").value)

   if (!token) {
        token = await getAccessToken(); 
    }

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employeeassignreport";
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
            "<div  class=''>\
              <span class='input-group-text fw-semibold btn btn-primary'>\
              <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
             </span>\
                <div>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };

    var data = JSON.stringify({
        language_POST: language,
        companyCode_POST: companyCode,
        employeeCode_POST: companyEmployee,
        startDate_POST: startDate,
        endDate_POST: endDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var tableItem = "";
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = await response["data"];
                const dataAssignEmployee = responseData.dataAssignEmployee;
                const dataAttendanceLog = responseData.dataAttendanceLog;

                const combinedData = dataAssignEmployee.map(employee => {
                    const attendanceRecords = dataAttendanceLog.filter(log => log.employee_id == employee.employee_id);

                    return {
                        employee_id: employee.employee_id,
                        fullname: employee.hrd_employee.fullname,
                        code_company: employee.code_company,
                        attendance: attendanceRecords.map(record => ({
                            id: record.employee_id,
                            date: record.date,
                            check_in: record.check_in,
                            check_out: record.check_out
                        })),
                        working_hours: {
                            monday: employee.MondayHours,
                            tuesday: employee.TuesdayHours,
                            wednesday: employee.WednesdayHours,
                            thursday: employee.ThursdayHours,
                            friday: employee.FridayHours,
                            saturday: employee.SaturdayHours,
                            sunday: employee.SundayHours
                        }
                    };
                });
                combinedData.forEach(employee => {
                    const attendanceData = employee.attendance;
                    const attendanceName = employee.fullname;
                    const attendanceWorkingHours = employee.working_hours;
                    attendanceData.forEach(attendance => {
                        const dayName = getDayName(attendance.date);
                        const assignEmployeeTemp = attendanceWorkingHours[dayName.toLowerCase()]["hrd_working_hours_translations"][0]["translation"];
                        const onDutyTemp = attendanceWorkingHours[dayName.toLowerCase()]["on_duty_time"];
                        const offDutyTemp = attendanceWorkingHours[dayName.toLowerCase()]["off_duty_time"];
                        const beginningInTemp = attendanceWorkingHours[dayName.toLowerCase()]["beginning_in"];
                        const endingInTemp = attendanceWorkingHours[dayName.toLowerCase()]["ending_in"];
                        const lateTimeTemp = attendanceWorkingHours[dayName.toLowerCase()]["late_time"];
                        const leaveEarlyTimeTemp = attendanceWorkingHours[dayName.toLowerCase()]["leave_early_time"];
                        const beginningOutTemp = attendanceWorkingHours[dayName.toLowerCase()]["beginning_out"];
                        const endingOutTemp = attendanceWorkingHours[dayName.toLowerCase()]["ending_out"];
                        const checkInTemp = attendance.check_in;
                        const checkOutTemp = attendance.check_out;

                        const onDuty = onDutyTemp.substring(0, 5); // Mengambil hanya jam dan menit
                        const offDuty = offDutyTemp.substring(0, 5);
                        const beginningIn = beginningInTemp.substring(0, 5);
                        const endingIn = endingInTemp.substring(0, 5);
                        const lateTime = lateTimeTemp.substring(0, 5);
                        const leaveEarly = leaveEarlyTimeTemp.substring(0, 5);
                        const beginningOut = beginningOutTemp.substring(0, 5);
                        const endingOut = endingOutTemp.substring(0, 5);
                        const checkIn = checkInTemp.substring(0, 5); // Mengambil hanya jam dan menit
                        const checkOut = checkOutTemp.substring(0, 5); // Mengambil hanya jam dan menit

                        const onDutyTime = new Date(`1970-01-01T${onDuty}:00`);  // Misalnya "08:00"
                        const offDutyTime = new Date(`1970-01-01T${offDuty}:00`);  // Misalnya "08:00"
                        const checkInTimeDate = new Date(`1970-01-01T${checkIn}:00`);
                        const checkOutTimeDate = new Date(`1970-01-01T${checkOut}:00`);
                        const beginningOutTime = new Date(`1970-01-01T${beginningOut}:00`);
                        const beginningInTime = new Date(`1970-01-01T${beginningIn}:00`);
                        const lateTimeDate = new Date(`1970-01-01T${lateTime}:00`);
                        const leaveEarlyTimeDate = new Date(`1970-01-01T${leaveEarly}:00`);

                        const diffInMs = checkInTimeDate - lateTimeDate;
                        const diffOutMs = leaveEarlyTimeDate - checkOutTimeDate;
                        const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
                        const diffOutMinutes = Math.floor(diffOutMs / 1000 / 60);
                        var late = diffInMinutes > 0 ? `${diffInMinutes} ${minutes}` : "";
                        var early = diffOutMinutes > 0 ? `${diffOutMinutes} ${minutes}` : "";

                        var onDutyWork, offDutyWork, lateWork, earlyWork, checkOutTime, checkinTime, textRed;

                        if (onDuty === "00:00") {
                            onDutyWork = "";
                            offDutyWork = "";
                            lateWork = "";
                        } else {
                            onDutyWork = onDuty;
                            offDutyWork = offDuty;
                            lateWork = late;
                        }
                        if (beginningOutTime > checkOutTimeDate) {
                            checkOutTime = ""
                            earlyWork = "";
                        } else {
                            checkOutTime = checkOut
                            earlyWork = early;
                        }
                        if (beginningInTime > checkInTimeDate) {
                            checkinTime = ""
                        } else {
                            checkinTime = checkIn
                        }
                        if (checkInTimeDate.getHours() >= 20) {
                            let checkOutDateObj = new Date(new Date(attendance.date).getTime() + 86400000);
                            const year = checkOutDateObj.getFullYear();
                            const month = (checkOutDateObj.getMonth() + 1).toString().padStart(2, '0'); // Tambah 1 untuk bulan (0-11)
                            const day = checkOutDateObj.getDate().toString().padStart(2, '0');
                            const formattedDate = `${year}-${month}-${day}`;
                            const filteredData = dataAttendanceLog.filter(log =>
                                log.employee_id === attendance.id && log.date === formattedDate
                            );
                            time = filteredData[0]["check_in"]
                            checkOutTime = time.substring(0, 5);
                        }
                        const checkOutTimeDateOver = new Date(`1970-01-01T${checkOutTime}:00`);
                        const diffOverMs = checkOutTimeDateOver - offDutyTime;
                        const diffOverMinutes = Math.floor(diffOverMs / 1000 / 60);
                        var over = (offDuty !== "00:00" && diffOverMinutes > 0) ? `${diffOverMinutes} ${minutes}` : "";
                        tableItem += `
                                    <tr>
                                        <td class='fw-light text-center text-uppercase'>${attendanceName}</td>
                                        <td class='fw-light text-center text-uppercase'>${assignEmployeeTemp}</td>
                                        <td class='fw-light text-center text-uppercase'>${ddmmyyyy(attendance.date)}</td>
                                        <td class='fw-light text-center text-uppercase'>${onDutyWork}</td>
                                        <td class='fw-light text-center text-uppercase'>${offDutyWork}</td>
                                        <td class='fw-light text-center text-uppercase'>${checkinTime}</td>
                                        <td class='fw-light text-center text-uppercase'>${checkOutTime}</td>
                                        <td class='fw-light text-center text-uppercase text-danger'>${lateWork}</td>
                                        <td class='fw-light text-center text-uppercase text-danger'>${earlyWork}</td>
                                        <td class='fw-light text-center text-uppercase'>${over}</td>
                                    </tr>`;
                    });
                });
                document.getElementById("dataTable").innerHTML = tableItem;
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectDataAttendance()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
                document.getElementById("doc").hidden = false
                await table();
            } else if (response["access"] == "failed") {
                const message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectDataAttendance()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
            }
        }

        if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }

        if (this.status == 500) {
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
function getDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
}
async function pdf() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyCode = companyType[0]["code_company"]
    const startDate = document.getElementById("startDate").value
    const endDate = document.getElementById("endDate").value
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "employeeassignreport";
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
    const attendanceData = [];
    const dataAttendancePdf = [];
    document.querySelectorAll("#dataTable tr").forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
            attendanceData.push({
                fullname: cells[0].innerText,
                date: cells[2].innerText,
                onDuty: cells[3].innerText,
                offDuty: cells[4].innerText,
                checkIn: cells[5].innerText,
                checkOut: cells[6].innerText,
                lateWork: cells[7].innerText,
                earlyWork: cells[8].innerText,
                over: cells[9].innerText,
            });
        }
    });
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const emploeeCode = JSON.parse('{"employeeCode_POST":"' + companyCode + '"}')
    const startDatePdf = JSON.parse('{"startDate_POST":"' + startDate + '"}')
    const endDatePdf = JSON.parse('{"endDate_POST":"' + endDate + '"}')
    $.extend(languageMenu, emploeeCode, startDatePdf, endDatePdf, { attendanceData });
    dataAttendancePdf.push(languageMenu)
    var data = JSON.stringify(
        {
            dataAttendancePdf
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                const fileUrl = `file/${responseData}`;
                const link = document.createElement('a');
                link.href = fileUrl;
                // link.download = `attendance_report_${companyCode}.pdf`;
                link.download = responseData;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                linkFile = `file/attendance/${responseData}`
                deleteFile(linkFile)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/assign_employee";
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
selectContent()