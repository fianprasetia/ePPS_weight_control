async function showModalUpadateAttendanceMachine(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"),{keyboard:false});
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalattendance"),{keyboard:false});
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