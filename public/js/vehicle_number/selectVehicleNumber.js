selectContent()
async function selectContent() {
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("vehicleNumberPage").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("titleVehicleNumber").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("vehicleNumberThead").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("statusThead").innerHTML = filterLanguage[0]["content"]["status"]
        document.getElementById("actionThead").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("statusLabel").innerHTML = filterLanguage[0]["content"]["status"] + "<span class='text-danger'>*</span>"
        document.getElementById("vehicleNumberLabel").innerHTML = filterLanguage[0]["content"]["vehicle_number"] + "<span class='text-danger'>*</span>"
        await selectVehicleNumber()
    }
}

async function selectVehicleNumber() {
    const language = await JSON.parse(getCookie("language"));
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "vehiclenumber";
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                let responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                             <td class='fw-light text-center text-uppercase'>" + responseData[i]["no_vehicle"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + (responseData[i]["status"] === 0 ? nonactive : active) + "</td>\
                        <td class='fw-light text-center'><div class='btn-group'><button type='button'  title='" + edit + "' id ='" + responseData[i]["id_vehicle_number"] + "' onclick='showModalUpdateVehicleNumber(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
function validasiVehicleNumber(input) {
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Cari posisi angka pertama
    const indexAngka = value.search(/\d/);

    let hurufDepan = '';
    let angka = '';
    let hurufBelakang = '';

    if (indexAngka >= 0) {
        hurufDepan = value.substring(0, indexAngka);
        angka = value.substring(indexAngka).match(/^\d{0,4}/)?.[0] || '';
        hurufBelakang = value
            .substring(indexAngka + angka.length)
            .replace(/[^A-Z]/g, '')
            .substring(0, 3);
    } else {
        hurufDepan = value;
    }

    let hasil = hurufDepan;
    if (angka) hasil += ' ' + angka;
    if (hurufBelakang) hasil += ' ' + hurufBelakang;

    input.value = hasil;
}