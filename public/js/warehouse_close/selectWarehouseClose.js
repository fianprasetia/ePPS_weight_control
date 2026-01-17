
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
    await SelectWarehouse()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["warehouse_closeout"];
        document.getElementById("titleModal").innerHTML = content["warehouse_closeout"];
        document.getElementById("titlePeriod").innerHTML = content["period"];
        document.getElementById("codeAssetHeader").innerHTML = content["code_item"];
        document.getElementById("descriptionHeader").innerHTML = content["description"];
        document.getElementById("uomHeader").innerHTML = content["uom"];
        document.getElementById("locationHeader").innerHTML = content["storage_location"];
        document.getElementById("beginningHeader").innerHTML = content["opening_balance"];
        document.getElementById("incomingHeader").innerHTML = content["in"];
        document.getElementById("outingHeader").innerHTML = content["out"];
        document.getElementById("endingHeader").innerHTML = content["end_balance"];
        document.getElementById("WareHouseReconciliationLabel").innerHTML = content["note"];
    }
}
async function SelectWarehouse(code) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const worksite = dataCompany[0]["code_company"]

    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/warehousecloseout";
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != code);
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
                document.getElementById("warehouse").innerHTML = mainOptionItem + "" + subOptionItem;
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message,
                });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_404,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_401,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_500,
            });
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
async function searchWarehouse() {
    let warehouse = document.getElementById("warehouse").value
    // let dataLogin = await JSON.parse(getCookie("dataLogin"));
    // // let employeeID = dataLogin["idEmployee"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse";
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
        warehouse_POST: warehouse,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData["dataWarehouse"].length; i++) {
                    let qtyEnd = responseData["dataWarehouse"][i]["initial_qty"] + responseData["dataWarehouse"][i]["incoming_qty"] - responseData["dataWarehouse"][i]["outgoing_qty"]
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center'>" + responseData["dataWarehouse"][i]["code_item"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataWarehouse"][i]["log_item_master"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + kapital(responseData["dataWarehouse"][i]["log_item_master"]["uom"]) + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataWarehouse"][i]["storage_location"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataWarehouse"][i]["initial_qty"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataWarehouse"][i]["incoming_qty"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData["dataWarehouse"][i]["outgoing_qty"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + qtyEnd + "</td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                document.getElementById("startDateList").innerHTML = mmyyyy(responseData["dataPeriod"][0]["period"]);
                document.getElementById("load").innerHTML = "<a title='reconciliation' type='submit' onclick='showModareconciliationWarehouseClose()' class='fw-semibold btn btn-primary'>" + kapital(reconciliation) + "</a> <a title='process' type='submit' onclick='updateWarehouseClose()' class='fw-semibold btn btn-primary'>" + kapital(process) + "</a>";
                //  document.getElementById("loadsearch").innerHTML = "<span onclick='searchWarehouse()' class='input-group-text fw-semibold btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></span>"
                await table();
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='searchWarehouse()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message,
                });
                // setTimeout(function () {
                //     window.location.href = "/warehouse_close";
                // }, 3000);
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='searchWarehouse()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_404,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_401,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_500,
            });
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
async function showModareconciliationWarehouseClose() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        var myModal = new bootstrap.Modal(document.getElementById("modalWareHouseReconciliation"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalWareHouseReconciliation"), { keyboard: false });
        myModal.toggle();
    }
    await reconciliationWarehouseClose()
    document.getElementById("loadReconciliation").innerHTML =
        "<a id='doneBtn' type='submit' onclick='closeModal()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function reconciliationWarehouseClose() {
    let warehouse = document.getElementById("warehouse").value
    let period = document.getElementById("startDateList").innerHTML
    let dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse/reconciliation";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
          <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
          "+ loading + "...\n\
        </button>";
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: overload, });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        warehouse_POST: warehouse,
        period_POST: yyyymm(period),
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                dataGoodReceipt = responseData["dataGoodReceipt"]
                dataGoodIssue = responseData["dataGoodIssue"]
                dataBalanceMonthly = responseData["dataBalanceMonthly"]
                dataWareHouse = responseData["dataWareHouse"]
                let dataTable = `
                                <table class="js-table-checkable table table-hover table-vcenter">
                                    <thead>
                                        <tr>
                                            <th id="noTransactionReconciliation" class="text-center text-uppercase">${transaction_number}</th>
                                            <th id="statusReconciliation" class="text-center text-uppercase">${status}</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                for (let i = 0; i < dataGoodReceipt.length; i++) {
                    dataTable += `
                                        <tr>
                                            <td class='fw-light text-center text-uppercase'>${dataGoodReceipt[i]["code_goods_receipt"]}</td>
                                            <td class='fw-light text-center text-uppercase'>${(dataGoodReceipt[i]["status"] == 0 || dataGoodReceipt[i]["status"] == 1 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>")}</td>
                                        </tr>`;
                }
                for (let i = 0; i < dataGoodIssue.length; i++) {
                    dataTable += `
                                        <tr>
                                            <td class='fw-light text-center text-uppercase'>${dataGoodIssue[i]["code_goods_issue"]}</td>
                                            <td class='fw-light text-center text-uppercase'>${(dataGoodIssue[i]["status"] == 0 || dataGoodIssue[i]["status"] == 1 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>")}</td>
                                        </tr>`;
                }
                dataTable += `          
                                    </tbody>
                                </table>`;

                const dataValueWarehoue = Object.entries(
                    dataWareHouse.reduce((acc, row) => {
                        const coa = row.log_item_master.log_item_category.code_coa;
                        const result = parseFloat(row.beginning_price * row.initial_qty) + parseFloat(row.incoming_price * row.incoming_qty) - parseFloat(row.outgoing_price * row.outgoing_qty)
                        acc[coa] = (acc[coa] || 0) + result;
                        return acc;
                    }, {})
                ).map(([code_coa, result]) => ({ code_coa, result }));
                const dataValueBalanceMonthly = Object.entries(
                    dataBalanceMonthly.reduce((acc, row) => {
                        const coa = row.code_coa;
                        const result = parseFloat(row.opening_balance) + parseFloat(row.debit) - parseFloat(row.credit)
                        acc[coa] = (acc[coa] || 0) + result;
                        return acc;
                    }, {})
                ).map(([code_coa, result]) => ({ code_coa, result }));
                const monthlyLookup = dataValueBalanceMonthly.reduce((acc, row) => {
                    acc[row.code_coa] = row.result;
                    return acc;
                }, {});

                dataValueWarehoue
                    .filter(row => row.result !== monthlyLookup[row.code_coa])
                    .map(row => ({
                        code_coa: row.code_coa,
                        "result_WH": row.result,
                        "result_BM": monthlyLookup[row.code_coa],
                        "difference": Math.abs(row.result - monthlyLookup[row.code_coa])
                    }));
                const notBalancedMessages = dataValueWarehoue
                    .filter(row => monthlyLookup[row.code_coa] !== undefined && row.result !== monthlyLookup[row.code_coa])
                    .map(row => {
                        const difference = Math.abs(row.result - monthlyLookup[row.code_coa]);
                        // return `Akun ${row.code_coa} tidak balance dengan selisih ${difference}`;
                        return `${not_balance.replace("{{coa}}", `${row.code_coa}`).replace("{{nominal}}", `${difference}`)}`;
                    });

                let dataMessages = ``
                if (notBalancedMessages.length === 0) {
                    dataMessages = `<p class="fw-light text-uppercase text-success">${close_warehouse}</p>`;
                } else {
                    for (let i = 0; i < notBalancedMessages.length; i++) {
                        dataMessages += `<p class="fw-light text-uppercase text-danger">${notBalancedMessages[i]}</p>`;
                    }
                }

                document.getElementById("NoteWareHouseReconciliation").innerHTML = dataMessages;
                document.getElementById("dataTableWareHouseReconciliation").innerHTML = dataTable;
                document.getElementById("load").innerHTML = "<a title='reconciliation' type='submit' onclick='showModareconciliationWarehouseClose()' class='fw-semibold btn btn-primary'>" + kapital(reconciliation) + "</a> <a title='process' type='submit' onclick='updateWarehouseClose()' class='fw-semibold btn btn-primary'>" + kapital(process) + "</a>";
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message, });
                setTimeout(function () {
                    window.location.href = "/warehouse_close";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404, });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401, });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500, });
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