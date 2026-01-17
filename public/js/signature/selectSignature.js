selectContent();
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    await selectSignature()
    async function dataContent(data) {
        var filterLanguage = data.filter(
            filtercontent => filtercontent.language == language
        );
        const content = filterLanguage[0]["content"];
        document.getElementById("backgroundImage").innerHTML = content["image_backgrounds"];
        document.getElementById("signatureTitle").innerHTML = content["signature"];
        document.getElementById("signaturePage").innerHTML = content["signature"];
        document.getElementById("employeeLabel").innerHTML = content["fullname"] + "<span class='text-danger'>*</span>"
        document.getElementById("statusLabel").innerHTML = content["select"] + "<span class='text-danger'>*</span>"
        document.getElementById("nikHead").innerHTML = content["employee_id"];
        document.getElementById("nameHead").innerHTML = content["name"];
        document.getElementById("statusHead").innerHTML = content["status"];
        document.getElementById("signHead").innerHTML = content["signature"];
        document.getElementById("actionsHead").innerHTML = content["actions"];
    }
}
async function selectSignature() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "signature"
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
                var tableItem = ""
                var no = 1
                for (i = 0; i < responseData.length; i++) {

                    tableItem +=
                        "<tr>\
                                      <td class='fw-light text-center'>" +
                        no +
                        "</td>\
                                      <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["employee_id"] +
                        "</td>\
                                      <td class='fw-light text-center text-uppercase'>" +
                        responseData[i]["hrd_employee"]["fullname"] +
                        "</td>\
                                      <td class='fw-light text-center text-uppercase'>" +
                        (responseData[i]["status"] == 0 ? active : nonactive) +
                        "</td>\
                                      <td class='text-center'> <img src='/sign/"+ responseData[i]["photo"] + "' class='' alt='' style='height: 100px;'></td>\
                                      <td class='fw-light text-center text-uppercase'><div class='btn-group'><button type='button' id ='" + responseData[i]["employee_id"] + "' onclick='showModalUpdateSignature(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></button></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("tableBody").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/posting";
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
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
    return false;
}
async function selectEmployee(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee"
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
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"]) + "</option>";
                }

                document.getElementById("employee").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
function selectGetImage() {
    document.getElementById('avatarInput').click();
}
function previewAvatar() {
    const input = document.getElementById('avatarInput');
    const preview = document.getElementById('avatarPreview');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Set canvas size
                canvas.width = 128;
                canvas.height = 128;

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the image on canvas with new size
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Get the resized image data URL
                const resizedImageURL = canvas.toDataURL('image/png');

                // Set the new image URL to preview
                preview.src = resizedImageURL;
            };
            img.src = e.target.result; // Set the image source to file result
        };

        reader.readAsDataURL(file); // Baca file sebagai Data URL
    } else {
        console.error("No file selected or FileReader failed."); // Debug: Log jika tidak ada file
    }
}