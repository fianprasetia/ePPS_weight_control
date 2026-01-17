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

        document.getElementById("workingHoursPage").innerHTML = filterLanguage[0]["content"]["working_hours"]
        document.getElementById("titleworkingHours").innerHTML = filterLanguage[0]["content"]["working_hours"]
        document.getElementById("nameTabel").innerHTML = filterLanguage[0]["content"]["name"]
        document.getElementById("onDutTable").innerHTML = filterLanguage[0]["content"]["on_duty"]
        document.getElementById("onDutyLabel").innerHTML = filterLanguage[0]["content"]["on_duty"] + "<span class='text-danger'>*</span>"
        document.getElementById("offDutyTable").innerHTML = filterLanguage[0]["content"]["off_duty"]
        document.getElementById("offDutyLabel").innerHTML = filterLanguage[0]["content"]["off_duty"] + "<span class='text-danger'>*</span>"
        document.getElementById("lateTable").innerHTML = filterLanguage[0]["content"]["late_tolerance"]
        document.getElementById("lateToleranceLabel").innerHTML = filterLanguage[0]["content"]["late_tolerance"] + "<span class='text-danger'>*</span>"
        document.getElementById("earlyTable").innerHTML = filterLanguage[0]["content"]["leave_early_time"]
        document.getElementById("earlyToleranceLabel").innerHTML = filterLanguage[0]["content"]["leave_early_time"] + "<span class='text-danger'>*</span>"
        document.getElementById("beginningInTable").innerHTML = filterLanguage[0]["content"]["beginning_in"]
        document.getElementById("checkInOpenLabel").innerHTML = filterLanguage[0]["content"]["beginning_in"] + "<span class='text-danger'>*</span>"
        document.getElementById("endingInTable").innerHTML = filterLanguage[0]["content"]["ending_in"]
        document.getElementById("checkInClosedLabel").innerHTML = filterLanguage[0]["content"]["ending_in"] + "<span class='text-danger'>*</span>"
        document.getElementById("beginningOutTable").innerHTML = filterLanguage[0]["content"]["beginning_out"]
        document.getElementById("checkOutOpenLabel").innerHTML = filterLanguage[0]["content"]["beginning_out"] + "<span class='text-danger'>*</span>"
        document.getElementById("endingOutTable").innerHTML = filterLanguage[0]["content"]["ending_out"]
        document.getElementById("checkOutClosedLabel").innerHTML = filterLanguage[0]["content"]["ending_out"] + "<span class='text-danger'>*</span>"
        document.getElementById("actionsTable").innerHTML = filterLanguage[0]["content"]["actions"]
        await selectWorkingHours()
    }
}
async function selectWorkingHours() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "workinghours"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    var editTable = "<button title='" + edit + "' type='button' id ='" + responseData[i]["id_working_hours"] + "' onclick='showModalUpadateWorkHours(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_working_hours_translations"][0]["translation"] +
                        "</td>\
                            <td class='fw-light text-center'>" +
                        formatTime(responseData[i]["on_duty_time"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["off_duty_time"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["late_time"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["leave_early_time"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["beginning_in"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["ending_in"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["beginning_out"]) +
                        "</td>\
                            <td class='fw-light  text-center'>" +
                        formatTime(responseData[i]["ending_out"]) +
                        "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editTable + "</div></td>\
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
selectContent()