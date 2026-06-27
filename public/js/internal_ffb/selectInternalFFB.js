selectContent()
async function selectContent() {
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    await selectEstate()
    await selectVehicleNumber()
    await selectWeighBridge()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("sourceLabel").innerHTML = filterLanguage[0]["content"]["internal_ffb"]
        document.getElementById("indicatorLabel").innerHTML = filterLanguage[0]["content"]["indicator"]
        document.getElementById("stable").innerHTML = " <i class='fa fa-circle-check'></i>" + filterLanguage[0]["content"]["stable"]
        document.getElementById("titleInfo").innerHTML = filterLanguage[0]["content"]["input_information"]
        document.getElementById("ticketLabel").innerHTML = filterLanguage[0]["content"]["ticket"]
        document.getElementById("estateLabel").innerHTML = filterLanguage[0]["content"]["estate"] + "<span class='text-danger'>*</span>"
        document.getElementById("divisionLabel").innerHTML = filterLanguage[0]["content"]["division"] + "<span class='text-danger'>*</span>"
        document.getElementById("blockLabel").innerHTML = filterLanguage[0]["content"]["block"] + "<span class='text-danger'>*</span>"
        document.getElementById("driverLabel").innerHTML = filterLanguage[0]["content"]["driver"] + "<span class='text-danger'>*</span>"
        document.getElementById("noVehicleLabel").innerHTML = filterLanguage[0]["content"]["vehicle_number"] + "<span class='text-danger'>*</span>"
        document.getElementById("deliveryLabel").innerHTML = filterLanguage[0]["content"]["delivery_note"] + "<span class='text-danger'>*</span>"
        document.getElementById("totalBunchesLabel").innerHTML = filterLanguage[0]["content"]["total_bunches"]
        document.getElementById("looseFruitLabel").innerHTML = filterLanguage[0]["content"]["brondolan"]
        document.getElementById("plantingYearLabel").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("noteLabel").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("emptyBunchLabel").innerHTML = filterLanguage[0]["content"]["empty_bunch"]
        document.getElementById("overripeLabel").innerHTML = filterLanguage[0]["content"]["overripe"]
        document.getElementById("unripeLabel").innerHTML = filterLanguage[0]["content"]["unripe"]
        document.getElementById("longStalkLabel").innerHTML = filterLanguage[0]["content"]["long_stalk"]
        document.getElementById("mandatoryDeductionLabel").innerHTML = filterLanguage[0]["content"]["mandatory_deduction"]
        document.getElementById("incomingWeighing").innerHTML = filterLanguage[0]["content"]["incoming_weighing"]
        document.getElementById("dateInLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightInLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightIn").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("outgoingWeighing").innerHTML = filterLanguage[0]["content"]["outgoing_weighing"]
        document.getElementById("dateOutLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightOutLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightOut").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("total").innerHTML = filterLanguage[0]["content"]["total"]
        document.getElementById("grossWeightLabel").innerHTML = filterLanguage[0]["content"]["gross_weight"]
        document.getElementById("deductionLabel").innerHTML = filterLanguage[0]["content"]["deduction"]
        document.getElementById("netWeightLabel").innerHTML = filterLanguage[0]["content"]["net_weight"]
        // document.getElementById("save").innerHTML = filterLanguage[0]["content"]["save_&_print"]
        document.getElementById("save").innerHTML = filterLanguage[0]["content"]["save"]
        document.getElementById("weighbridgeData").innerHTML = filterLanguage[0]["content"]["weighbridge_data"]
        document.getElementById("noVehicleThead").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("driverThead").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("estateThead").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("divisionThead").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("plantingYearThead").innerHTML = filterLanguage[0]["content"]["planting_year"]
        const btnOut = document.getElementById('getWeightOutBtn');
        btnOut.style.pointerEvents = 'none';
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.style.pointerEvents = 'none';

    }
}
async function selectWeighBridge() {
    const language = await JSON.parse(getCookie("language"));
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "weightbridge";
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
                var no = 1;
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    var attributeUpdate = `id="${responseData[i]["ticket_no"]}"  href="javascript:void(0)" onclick="showLayoutUpdateData(id)" `
                    tableItem +=
                        "<tr  " + attributeUpdate + ">\
                        <td class='fw-light text-center text-uppercase'>" + no + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["vehicle_no"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["driver_name"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["estate_code"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["division_code"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData[i]["year_plant"] + "</td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTableItem").innerHTML = tableItem;
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
async function selectEstate(estateID) {
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/estate"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == estateID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != estateID);
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
                if (estateID == "" || estateID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }

                document.getElementById("estate").innerHTML = mainOptionItem + "" + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
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
    xhr.send(data);
    return false;
}
async function selectDivision(estateID, divisionID) {
    const language = await JSON.parse(getCookie("language"));
    const estate = estateID || document.getElementById("estate").value
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/division"
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
        estate_POST: estate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == divisionID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != divisionID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (estateID == "" || estateID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }

                document.getElementById("division").innerHTML = mainOptionItem + "" + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
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
    xhr.send(data);
    return false;
}
async function selectBlock(divisionID, blockID) {
    let language = await JSON.parse(getCookie("language"));
    const division = divisionID || document.getElementById("division").value
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/block"
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
        division_POST: division,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 201 || this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                let filterSubData = [];
                let filternotSubData = [];

                if (blockID && blockID !== "") {
                    filterSubData = responseData.filter((item) => blockID.includes(item.code_company));
                    // Konversi ke array (anggap kode berupa angka, jadi pakai map(Number))
                    // let codeArray = codeCOA.split(',').map(Number);
                    // filterSubData = responseData.filter((item) => codeArray.includes(item.code_coa));
                    filternotSubData = responseData.filter((item) => !blockID.includes(item.code_company));
                } else {
                    filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == blockID);
                    filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != blockID);
                }
                var mainOptionItem = "";
                var subOptionItem = "";
                for (var i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {

                } else {
                    for (var j = 0; j < filterSubData.length; j++) {
                        mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[j]["code_company"] + "' selected>" + kapital(filterSubData[j]["name"]) + "</option>";
                    }
                }
                document.getElementById('block').innerHTML = mainOptionItem + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
                }, 3000);
            }
        } else {
            handleErrorResponse(this.status, this.response);
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
    return false;
}
async function selectVehicleNumber(vehicleID) {
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "vehiclenumber/bytransaction"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.no_vehicle == vehicleID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.no_vehicle != vehicleID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["no_vehicle"] + "'>" + kapital(filternotSubData[i]["no_vehicle"]) + "</option>";
                }
                if (vehicleID == "" || vehicleID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["no_vehicle"] + ">" + kapital(filterSubData[0]["no_vehicle"]) + "</option>";
                }

                document.getElementById("noVehicle").innerHTML = mainOptionItem + "" + subOptionItem;
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/internal_ffb";
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
    xhr.send(data);
    return false;
}
async function getWeightIn() {
    const indicatorValue = document.getElementById("indicatorValue").innerText
    document.getElementById("weightIn").value = indicatorValue;
    document.getElementById("dateIn").value = formatDate(new Date())
    document.getElementById('saveBtn').disabled = false;
    document.getElementById('saveBtn').classList.replace('btn-secondary', 'btn-primary');
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.style.pointerEvents = 'auto';
}
async function getWeightOut() {
    const indicatorValue = document.getElementById("indicatorValue").innerText
    document.getElementById("weightOut").value = indicatorValue;
    document.getElementById("dateOut").value = formatDate(new Date())
    const weightIn = document.getElementById("weightIn").value;

    const weightOut = document.getElementById("weightOut").value;
    const netto = weightIn - weightOut;
    document.getElementById("grossWeight").value = netto;
    const deduction = document.getElementById("deduction").value;
    document.getElementById("netWeight").value = parseFloat(netto) - parseFloat(deduction);
    document.getElementById("saveBtn").setAttribute("onclick", "showModalUpdateAndPrint()");
    document.getElementById('saveBtn').classList.replace('btn-secondary', 'btn-primary');
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.style.pointerEvents = 'auto';
    document.getElementById("save").innerHTML = filterLanguage[0]["content"]["save_&_print"]

}



async function printInternalFFB() {

    const language = await JSON.parse(getCookie("language"));
    const id = document.getElementById("ticket").value; ``
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "weightbridge/byticketno";
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
                await printTicket(responseData)
                // let estateID = responseData["estate_code"];
                // let divisionID = responseData["division_code"];
                // let blockID = responseData["unit_type"];
                // let vehicleID = responseData["vehicle_no"];
                // await selectEstate(estateID)
                // await selectDivision(estateID, divisionID)
                // await selectBlock(divisionID, blockID)
                // await selectVehicleNumber(vehicleID)
                // document.getElementById("ticket").value = responseData["ticket_no"];
                // document.getElementById("division").value = responseData["division_code"];
                // document.getElementById("block").value = responseData["block_code"];
                // document.getElementById("noVehicle").value = responseData["vehicle_no"];
                // document.getElementById("driver").value = responseData["driver_name"];
                // document.getElementById("delivery").value = responseData["spb_no"];
                // document.getElementById("totalBunches").value = responseData["bunch_count"];
                // document.getElementById("looseFruit").value = responseData["loose_fruit"];
                // document.getElementById("plantingYear").value = responseData["year_plant"];
                // document.getElementById("weightIn").value = responseData["gross_weight"];
                // document.getElementById("note").value = responseData["note"];
                // document.getElementById("dateIn").value = formatDateTime(responseData["entry_time"]);
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




















async function printTicket(responseData) {
    // window.open(`/print-ticket/${encodeURIComponent(ticketNo)}`, '_blank');
    try {
        const ticketNo = document.getElementById("ticket").value; ``

        await connectQZ();

        // const printer = await qz.printers.getDefault();
        const printer = document.getElementById("printer").value;
        console.log("Default Printer:", printer);
        const config = qz.configs.create(printer);
        const WIDTH = 116;

        function center(text) {
            text = String(text ?? "");

            const left = Math.max(0, Math.floor((WIDTH - text.length) / 2));

            return " ".repeat(left) + text;
        }

        function line(char = "-") {
            return char.repeat(WIDTH);
        }

        function twoColumn(left, right) {
            left = String(left ?? "");
            right = String(right ?? "");

            const pad = WIDTH - left.length - right.length;

            return left + " ".repeat(Math.max(1, pad)) + right;
        }

        function field(label, value) {
            return label.padEnd(14) + ": " + value;
        }

        let data = [];

        // Init Printer
        data.push("\x1B@");

        const html = document.getElementById("previewTicketContent").outerHTML;

        // const data = [{
        //     type: 'html',
        //     format: 'plain',
        //     data: html
        // }];
        // const data = [
        //     "\x1B@", // Initialize

        //     "                    PT. SEDJAHTERA INDO AGRO\r\n",
        //     "                  Bukit Ajong Palm Oil Factory\r\n",
        //     "Dusun Kopar, Desa Dosan, Kec. Parindu, Kabupaten Sanggau\r\n",
        //     "======================================================================\r\n",
        //     "\r\n",
        //     `No Tiket   : ${ticketNo}                    NO SPB         : \r\n`,
        //     "Customer   : PT. BARRA BINTANG NUSANTARA    Date In        : 22/06/2026 15:31\r\n",
        //     "Penjual    : PT. SEDJAHTERA INDO AGRO       First Weight   : 3810 Kg\r\n",
        //     "Produk     : PK OUTSPECK                    Second Weight  : 12890 Kg\r\n",
        //     "Vehicle No : KB 8013 AL                     Net Weight     : 9080 Kg\r\n",
        //     "Driver     : ABDUL ROSIP\r\n",
        //     "No Kontrak : `${}`\r\n",
        //     "\r\n",
        //     "\r\n",
        //     "Weighbridge Operator     Driver               Diperiksa\r\n",
        //     "\r\n",
        //     "\r\n",
        //     "___________________      _________________    _________________\r\n",
        //     "DEPILIA                 ABDUL ROSIP\r\n",

        //     "\x0C"
        // ];

        await qz.print(config, data);

        Dashmix.helpers('jq-notify', {
            type: 'success',
            icon: 'fa fa-check me-1',
            message: 'Print Success'
        });
        console.log(data);
    } catch (err) {
        console.error(err);

        Dashmix.helpers('jq-notify', {
            type: 'danger',
            icon: 'fa fa-times me-1',
            message: err.message
        });
    }
}






async function connectQZ() {

    qz.security.setCertificatePromise(function (resolve, reject) {
        resolve(null);
    });

    qz.security.setSignaturePromise(function (toSign) {
        return function (resolve, reject) {
            resolve();
        };
    });
    console.log(qz.websocket.isActive());

    if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
        console.log("QZ Connected");
    }
}
async function loadPrinters() {
    try {
        if (!qz.websocket.isActive()) {
            await qz.websocket.connect();
        }

        const printers = await qz.printers.find();
        const select = document.getElementById("printer");
        select.innerHTML = "";
        select.innerHTML += `<option class='fw-light text-uppercase' selected disabled value=''>` + kapital(select) + `</option>`;
        printers.forEach(printer => {
            select.innerHTML += ` <option class='fw-light text-uppercase' value="${printer}">${printer} </option>`;
        });

    } catch (err) {
        console.error(err);
    }
}