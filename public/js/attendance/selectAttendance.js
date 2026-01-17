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
        document.getElementById("attendancePage").innerHTML = filterLanguage[0]["content"]["attendance"]
        document.getElementById("titleAttendance").innerHTML = filterLanguage[0]["content"]["attendance"]
        document.getElementById("WorksiteTabel").innerHTML = filterLanguage[0]["content"]["worksite"]
        document.getElementById("ipAddressTable").innerHTML = filterLanguage[0]["content"]["ip_address"]
        document.getElementById("locationTable").innerHTML = filterLanguage[0]["content"]["location"];
        document.getElementById("portTable").innerHTML = filterLanguage[0]["content"]["port"]
        document.getElementById("statusTable").innerHTML = filterLanguage[0]["content"]["status"]
        document.getElementById("actionsTable").innerHTML = filterLanguage[0]["content"]["actions"]
        await selectAttedanceByWorksite()
    }
}
async function selectAttedanceByWorksite() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "attendance/worksite"
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    var playAttendance = " <button title='" + edit + "' type='button' port ='" + responseData[i]["port"] + "'  ip ='" + responseData[i]["ip_address"] + "' id ='" + responseData[i]["id_attendance_machine"] + "' onclick='selectAttendanceMachine(id)' class='btn btn-primary'><i class='fa-solid fa-play'></i></button>"
                    var getAttendance = " <button title='" + edit + "' type='button' port ='" + responseData[i]["port"] + "'  ip ='" + responseData[i]["ip_address"] + "'  id ='" + responseData[i]["id_attendance_machine"] + "' onclick='showModalSelectAttendanceData(id)' class='btn btn-primary'><i class='fa-solid fa-people-roof'></i></button>"
                    var uploadAttendance = " <button title='" + edit + "' type='button'  port ='" + responseData[i]["port"] + "'  ip ='" + responseData[i]["ip_address"] + "' id ='" + responseData[i]["id_attendance_machine"] + "' onclick='showModalUpadateAttendanceMachine(id)' class='btn btn-primary'><i class='fa-solid fa-upload'></i></button>"
                    var downloadAttendance = " <button title='" + edit + "' type='button'  port ='" + responseData[i]["port"] + "'  ip ='" + responseData[i]["ip_address"] + "' id ='" + responseData[i]["id_attendance_machine"] + "' onclick='showModalSelectUserAttendanceMachine(id)' class='btn btn-primary'><i class='fa-solid fa-download'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center text-uppercase'>" + kapital(responseData[i]["adm_company"]["name"]) + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["ip_address"] + "</td>\
                            <td class='fw-light  text-center'>" + responseData[i]["port"] + "</td>\
                            <td class='fw-light  text-center'>" + kapital(responseData[i]["location"]) + "</td>\
                            <td parent='" + responseData[i]["id_attendance_machine"] + "' class='fw-light text-center atur'></td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + playAttendance + getAttendance + uploadAttendance + downloadAttendance + "</div></td>\
                        </tr>";

                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(function () {
                //     window.location.href = "/employee_data";
                // }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
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
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectAttendanceMachine(id) {
    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
    var newIconHTML = " <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
          "+ loading + "...";

    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
    const element = document.getElementById(id);
    var ip = element.getAttribute("ip");
    var port = element.getAttribute("port");
    var xhr = new XMLHttpRequest();
    var url = localUrl + "attendance/connect"
    xhr.onerror = function () {
        var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
        var newIconHTML = "<i class='fa-solid fa-link-slash fa-xl text-danger'></i>"; // HTML baru yang ingin dimasukkan

        updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
    };
    var data = JSON.stringify({
        ipAddress_POST: ip,
        port_POST: port,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                if (responseData == "Connected") {
                    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
                    var newIconHTML = "<i class='fa-solid fa-link fa-xl text-xeco-lighter'></i>"; // HTML baru yang ingin dimasukkan

                    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
                }
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/attendance";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 500) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "failed") {
                var responseData = response["data"]
                if (responseData == "noConnected") {
                    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
                    var newIconHTML = "<i class='fa-solid fa-link-slash fa-xl text-danger'></i>"; // HTML baru yang ingin dimasukkan

                    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
                }
            }
        } if (this.status == 408) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "failed") {
                var responseData = response["data"]
                if (responseData == "noConnected") {
                    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
                    var newIconHTML = "<i class='fa-solid fa-link-slash fa-xl text-danger'></i>"; // HTML baru yang ingin dimasukkan

                    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
                }
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
function updateInnerHTMLBasedOnParent(parentValue, newHTML) {
    // Mencari elemen td dengan atribut parent yang sesuai
    var tdElements = document.querySelectorAll("td[parent='" + parentValue + "']");

    tdElements.forEach(function (td) {
        // Mengubah innerHTML
        td.innerHTML = newHTML;
    });
}
async function showModalSelectAttendanceData(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("dataAttendanceTable").innerHTML = ""
    const element = document.getElementById(id);
    var ip = element.getAttribute("ip");
    var port = element.getAttribute("port");
    var xhr = new XMLHttpRequest();
    var url = localUrl + "attendance"
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
        ipAddress_POST: ip,
        port_POST: port,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                jmlData = responseData
                if (jmlData == 0) {
                    document.getElementById("dataAttendanceTable").innerHTML = `${no_new_record}`;
                    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='closeModal()' class='btn  btn-primary'>" + kapital(done) + "</a>"
                    return false;
                }
                dataAttendance = [];
                dataAttendancePush = [];
                tableData = "";
                tableData += ` <table class="table table-bordered table-striped table-vcenter js-dataTable-responsive">
                                <thead>
                                    <tr>
                                        <th id="WorksiteTabel" class="text-center text-uppercase">${employee_id}</th>
                                        <th id="ipAddressTable" class="text-center text-uppercase">${record}</th>
                                    </tr>
                                </thead>`;
                for (i = 0; i < jmlData.length; i++) {
                    const dateStr = responseData[i]["recordTime"];
                    const employeeID = responseData[i]["deviceUserId"];
                    const date = new Date(dateStr);
                    const newDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
                    const day = String(newDate.getUTCDate()).padStart(2, '0'); // Tanggal
                    const month = String(newDate.getUTCMonth() + 1).padStart(2, '0'); // Bulan (0-11)
                    const year = newDate.getUTCFullYear(); // Tahun
                    const hours = String(newDate.getUTCHours()).padStart(2, '0'); // Jam
                    const minutes = String(newDate.getUTCMinutes()).padStart(2, '0'); // Menit
                    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
                    tableData += `  <tbody>
                                <tr>
                                <td class="text-center text-uppercase">${responseData[i]["deviceUserId"]}</td>
                                <td class="text-center text-uppercase">${formattedDate}</td>
                                </tr>
                                </tbody>`;
                    dataAttendancePush.push({
                        employeeID_POST: employeeID,
                        recordTime_POST: formattedDate,
                    });

                }
                $.extend(dataAttendancePush);
                dataAttendance.push(dataAttendancePush)
                tableData += `</table>`;
                document.getElementById("dataAttendanceTable").innerHTML = tableData
                await insertAttendanceLog(dataAttendance)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/attendance";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 408) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "failed") {
                var responseData = response["data"]
                if (responseData == "noConnected") {
                    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
                    var newIconHTML = "<i class='fa-solid fa-link-slash fa-xl text-danger'></i>"; // HTML baru yang ingin dimasukkan

                    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
                }
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function showModalSelectUserAttendanceMachine(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("dataAttendanceTable").innerHTML = ""
    const element = document.getElementById(id);
    var ip = element.getAttribute("ip");
    var port = element.getAttribute("port");
    var xhr = new XMLHttpRequest();
    var url = localUrl + "attendance/users"
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
        ipAddress_POST: ip,
        port_POST: port,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]["data"]
                dataAttendance = [];
                dataAttendancePush = [];
                const jmlData = responseData
                tableData = "";
                tableData += ` <table class="table table-bordered table-striped table-vcenter js-dataTable-responsive">
                                <thead>
                                    <tr>
                                        <th class="text-center text-uppercase">${employee_id}</th>
                                        <th class="text-center text-uppercase">Name</th>
                                        <th class="text-center text-uppercase">Role</th>
                                    </tr>
                                </thead>`;
                for (i = 0; i < jmlData.length; i++) {
                    const employeeID = responseData[i]["deviceUserId"];
                    tableData += `  <tbody>
                                        <tr>
                                            <td class="text-center text-uppercase">${responseData[i]["userId"]}</td>
                                            <td class="text-center text-uppercase">${responseData[i]["name"]}</td>
                                            <td class="text-center text-uppercase">${(responseData[i]["role"]) == 0 ? "User" : "Super Admin"}</td>
                                        </tr>
                                    </tbody>`;
                    // dataAttendancePush.push({
                    //     employeeID_POST: employeeID,
                    //     recordTime_POST: formattedDate,
                    // });

                }
                $.extend(dataAttendancePush);
                dataAttendance.push(dataAttendancePush)
                tableData += `</table>`;
                document.getElementById("dataAttendanceTable").innerHTML = tableData
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='closeModal()' class='btn  btn-primary'>" + kapital(done) + "</a>"
                // await insertAttendanceLog(dataAttendance)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/attendance";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 408) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "failed") {
                var responseData = response["data"]
                if (responseData == "noConnected") {
                    var parentIdToUpdate = id; // Ganti dengan ID parent yang ingin diupdate
                    var newIconHTML = "<i class='fa-solid fa-link-slash fa-xl text-danger'></i>"; // HTML baru yang ingin dimasukkan

                    updateInnerHTMLBasedOnParent(parentIdToUpdate, newIconHTML);
                }
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
selectContent()

