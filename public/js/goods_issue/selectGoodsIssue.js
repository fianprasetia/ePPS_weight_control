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
    await showLayoutListData()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["goods_issue"];
        document.getElementById("titleContent").innerHTML = content["goods_issue"];
        document.getElementById("titleApproval").innerHTML = content["goods_issue"];
        document.getElementById("titlePeriod").innerHTML = content["period"];
        document.getElementById("dateLabel").innerHTML = content["date"] + "<span class='text-danger'>*</span>"
        document.getElementById("employeeLabel").innerHTML = content["request_by"] + "<span class='text-danger'>*</span>"
        document.getElementById("noteLabel").innerHTML = content["note"];
        document.getElementById("codeItemTable").innerHTML = content["item_master"] + "<span class='text-danger'>*</span>"
        document.getElementById("stockQuantityTable").innerHTML = content["stock_quantity"]
        document.getElementById("uomTable").innerHTML = content["uom"];
        document.getElementById("qtyTable").innerHTML = content["qty"] + "<span class='text-danger'>*</span>"
        document.getElementById("blockTable").innerHTML = content["block"];
        document.getElementById("assetTable").innerHTML = content["asset"];
        document.getElementById("activityTypeTable").innerHTML = content["activity_code"] + "<span class='text-danger'>*</span>"
        document.getElementById("activityTable").innerHTML = content["activity"] + "<span class='text-danger'>*</span>"
        document.getElementById("noGiListData").innerHTML = content["goods_issue_number"];
        document.getElementById("dateListData").innerHTML = content["date"];
        document.getElementById("employeeWarehouseData").innerHTML = content["wh_staff"];
        document.getElementById("employeeRequestData").innerHTML = content["request_by"];
        document.getElementById("statusListData").innerHTML = content["status"];
        document.getElementById("actionsListData").innerHTML = content["actions"];
        document.getElementById("nameApproval").innerHTML = content["name"];
        document.getElementById("levelApproval").innerHTML = content["level_approval"];
        document.getElementById("statusApproval").innerHTML = content["status"];
        document.getElementById("noteApproval").innerHTML = content["note"];
        document.getElementById("dateApproval").innerHTML = content["date_approval"];
    }
    document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertGoodsIssue()' class='btn  btn-primary'>" + kapital(done) + "</a>";
}
async function showLayoutUpdateData(id) {
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderGI").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    await updateCheckGoodsIssue(id)
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData() {
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("formHeaderGI").reset()
    await new Promise(resolve => setTimeout(resolve, 0));
    await selectEmployee();
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutListData() {
    document.getElementById("formGoodIssue").reset()
    await selectCompanyWarehouse();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function selectCompanyWarehouse() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
   var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const url = mainUrl + "company/warehouse";
    const data = {
        worksite_POST: worksite,
        language_POST: language
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            const responseData = await response.json();
            if (responseData.access === "success") {

                const dataPeriod = responseData.data.dataPeriod[0];
                const dataWarehouse = responseData.data.dataWarehouse[0];
                codeWareHouse = dataWarehouse["code_company"];
                document.getElementById("startDateList").innerHTML = ddmmyyyy(dataPeriod.start_date);
                document.getElementById("endDateList").innerHTML = ddmmyyyy(dataPeriod.finish_date);
                document.getElementById("warehouseName").innerHTML = dataWarehouse.name;
                document.getElementById("codeWHform").value = dataWarehouse.code_company;
                startDateSearch = ddmmyyyy(dataPeriod.start_date);
                endDateSeacrh = ddmmyyyy(dataPeriod.finish_date);
                await SelectGoodsIssue(startDateSearch, endDateSeacrh, codeWareHouse)
            } else if (responseData.access === "failed") {
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: responseData.message
                });
                 setTimeout(() => {
                    hideSpinner();
                }, 1000);
                // setTimeout(() => {
                //     window.location.href = "/goods_receipt_asset";
                // }, 3000);
            }
        } else if (response.status === 404) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 401) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_401
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
        });
        setTimeout(async () => {
            await keluar();
        }, 3000);
    }
}
var noRow = 1
async function addDetail() {
    var newid = noRow++;
    await selectItemWarehouse(newid)
    await selectActivityType(newid)
    await selectDivision(newid)
    await selectAsset(newid);
    $('#dataTableItem').append(`
        <tr id="row${newid}">
        <td class="text-center"><a type="button" class="btn btn-danger" id='${newid}' onclick="deleteRow(id)"> <i class="fa-regular fa-trash-can"></i></a></td>
            <td><select class="js-select2 form-select fw-light text-uppercase" name="codeItemDetail[]" onchange="itemMaster(${newid})" id="codeItemDetail${newid}" style="width: 100%"></select></td>
            <td><input type="text" class="form-control text-end text-uppercase" value="0" id="qtyStockDetail${newid}" name="qtyStockDetail[]" disabled/></td>
            <td><input type="text" class="form-control text-center text-uppercase" id="uomDetail${newid}" name="uomDetail[]" disabled/></td>
            <td><input type="text" class="form-control text-end text-uppercase" value="0" onkeyup="compareQty()"  onfocus="removeZero(this)" id="qtyDetail${newid}" name="qtyDetail[]" /></td>
            <td><select class="js-select2 form-select fw-light text-uppercase" name="blokDetail[]" id="blokDetail${newid}" style="width: 100%"></select></td>
            <td><select class="js-select2 form-select fw-light text-uppercase" name="assetDetail[]" id="assetDetail${newid}" style="width: 100%"></select></td>
            <td><select class="js-select2 form-select fw-light text-uppercase"  onchange="activity(${newid})" name="activityTypeDetail[]" id="activityTypeDetail${newid}" style="width: 100%"></select></td>
            <td><select class="js-select2 form-select fw-light text-uppercase" name="ActivityDetail[]" id="ActivityDetail${newid}" style="width: 100%"></select></td>
        </tr>
    `);
    $(`#codeItemDetail${newid}, #activityTypeDetail${newid}, #blokDetail${newid}, #assetDetail${newid}, #ActivityDetail${newid}`).select2();
}
async function selectItemWarehouse(rowIndex, itemCode) {
    let codeWh = document.getElementById("codeWHform").value
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse"
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
        warehouse_POST: codeWh,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]["dataWarehouse"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_item == itemCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_item != itemCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_item"] + "'>" + filternotSubData[i]["code_item"] + " - " + kapital(filternotSubData[i]["log_item_master"]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_item"] + "'>" + filterSubData[0]["code_item"] + " - " + kapital(filterSubData[0]["log_item_master"]["name"]) + "</option>";
                }
                $(`#codeItemDetail${rowIndex}`).html(mainOptionItem + subOptionItem);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function itemMaster(rowIndex, itemCode) {
    let codeItemTemp = document.getElementById(`codeItemDetail${rowIndex}`).value;
    codeItem = codeItemTemp || itemCode
    let codeWh = document.getElementById("codeWHform").value
    const allSelects = document.querySelectorAll('select[name="codeItemDetail[]"]');
    let count = 0;
    allSelects.forEach(select => {
        if (select.value === codeItem) count++;
    });
    if (count > 1) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: item_already_exists,
        });
        await selectItemWarehouse(rowIndex)
        return false;
    }
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse/byitem"
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
        warehouse_POST: codeWh,
        item_code_POST: codeItem,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                qty = parseFloat(responseData[0]["initial_qty"]) + parseFloat(responseData[0]["incoming_qty"]) - parseFloat(responseData[0]["outgoing_qty"])
                document.getElementById(`uomDetail${rowIndex}`).value = responseData[0]["log_item_master"]["uom"]
                document.getElementById(`qtyStockDetail${rowIndex}`).value = qty
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function selectEmployee(code) {
    let language = await JSON.parse(getCookie("language"));
    let dataLogin = await JSON.parse(getCookie("dataLogin"));
    let worksite = dataLogin["codeCompany"]
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee/gi"
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
        worksite_POST: worksite,
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
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["employee_id"] + "'>" + filternotSubData[i]["employee_id"] + " - " + kapital(filternotSubData[i]["fullname"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["employee_id"] + "'>" + filterSubData[0]["employee_id"] + " - " + kapital(filterSubData[0]["fullname"]) + "</option>";
                }
                document.getElementById("employee").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
function compareQty() {
    const rows = document.querySelectorAll("tr");
    rows.forEach(row => {
        const qtyStock = row.querySelector("input[name='qtyStockDetail[]']");
        var qtyInput = row.querySelector("input[name='qtyDetail[]']");

        if (!qtyStock || !qtyInput) return;

        const qtyStockTotal = parseFloat(qtyStock.value) || 0;
        const qtyInputTotal = parseFloat(qtyInput.value) || 0;
        if (qtyInputTotal > qtyStockTotal) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: notif_qty_received });
            qtyInput.value = 0
        }
    });
}
async function selectActivityType(rowIndex, codeActivityType) {
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activitytype"
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
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_activity_type == codeActivityType);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_activity_type != codeActivityType);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_activity_type"] + "'>" + kapital(filternotSubData[i]["code_activity_type"]) + " - " + kapital(filternotSubData[i]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_activity_type"] + "'>" + kapital(filterSubData[0]["code_activity_type"]) + " - " + kapital(filterSubData[0]["adm_activity_type_translations"][0]["translation"]) + "</option>";
                }
                $(`#activityTypeDetail${rowIndex}`).html(mainOptionItem + subOptionItem);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function selectDivision(rowIndex, codeDivision) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == codeDivision);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != codeDivision);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                $(`#blokDetail${rowIndex}`).html(mainOptionItem + subOptionItem);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function activity(rowIndex, typecode, code) {
    let codeActivityTypeTemp = document.getElementById(`activityTypeDetail${rowIndex}`).value;
    var codeActivityType = codeActivityTypeTemp || typecode
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "activity/byactivitytype"
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
        code_activity_type_POST: codeActivityType,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_activity == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_activity != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_activity"] + "'>" + kapital(filternotSubData[i]["adm_activity_translations"][0]["translation"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_activity"] + "'>" + kapital(filterSubData[0]["adm_activity_translations"][0]["translation"]) + "</option>";
                }
                document.getElementById(`ActivityDetail${rowIndex}`).innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function selectAsset(rowIndex, code) {
    let language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const worksite = dataLogin["codeCompany"];
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/byworksite"
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.asset_code == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.asset_code != code);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["asset_code"] + "'>" + filternotSubData[i]["asset_code"] + " - " + kapital(filternotSubData[i]["log_item_master"]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["asset_code"] + "'>" + filterSubData[0]["asset_code"] + " - " + kapital(filterSubData[0]["log_item_master"]["name"]) + "</option>";
                }
                document.getElementById(`assetDetail${rowIndex}`).innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function SelectGoodsIssue(startDateSearch, endDateSeacrh, codeWareHouse) {
    const codeWH = codeWareHouse
    const startDate = yyyymmdd(startDateSearch)
    const endDate = yyyymmdd(endDateSeacrh)
    document.getElementById("startDate").value = ddmmyyyy(startDate);
    document.getElementById("endDate").value = ddmmyyyy(endDate)
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const language = await JSON.parse(getCookie("language"));
    const employeeID = dataLogin["idEmployee"];
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsissue"
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_warehouse_POST: codeWH,
        start_date_POST: startDate,
        end_date_POST: endDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            await resetDataTables()
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    statusTemp = responseData[i]["status"];
                    noGI = responseData[i]["code_goods_issue"];
                    let status;
                    if (statusTemp == 0) {
                        editData = "<button title='" + edit + "' type='button' id='" + noGI + "' onclick='showLayoutUpdateData(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
                        postingData = "<button title='posting' type='button' id='" + noGI + "' onclick='showModalupdatePostingGoodsIssue(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
                        deleteData = "<button title='delete' type='button' id='" + noGI + "' onclick='showModalDeleteGoodsIssue(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                        approvalData = "";
                        viewData = "";
                        pdfGR = "";
                        status = request;
                    } else if (statusTemp == 1) {
                        editData = "";
                        postingData = "";
                        deleteData = "";
                        approvalData = "<button title='approval' type='button'id='" + noGI + "'' onclick='showModalSelectApproval(id)' class='btn btn-primary'><i class='fa-regular fa-user'></i></button>";
                        viewData = "<button title='view' type='button' id='" + noGI + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
                        pdfGR = "";
                        status = waiting_approval;
                    } else if (statusTemp == 2) {
                        editData = "";
                        postingData = "";
                        deleteData = "";
                        approvalData = "";
                        viewData = "<button title='view' type='button' id='" + noGI + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
                        pdfGR = "<button title='pdf' type='button' code ='" + noGI + "' id='btn-" + no + "' onclick='selectGoodsIssueByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                        status = approve;
                    } else if (statusTemp == 3) {
                        editData = "";
                        postingData = "";
                        deleteData = "";
                        approvalData = "";
                        viewData = "<button title='view' type='button' id='" + noGI + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
                        pdfGR = "<button title='pdf' type='button' code ='" + noGI + "' id='btn-" + no + "' onclick='selectGoodsIssueByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                        status = reject;
                    } else if (statusTemp == 4) {
                        editData = "";
                        postingData = "";
                        deleteData = "";
                        approvalData = "";
                        viewData = "<button title='view' type='button' id='" + noGI + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
                        pdfGR = "<button title='pdf' type='button' code ='" + noGI + "' id='btn-" + no + "' onclick='selectGoodsIssueByCode(this)' class='btn btn-primary'><i class='fa-regular fa-file-pdf'></i></button>";
                        status = reject;
                    }
                    tableItem +=
                        "<tr>\
                  <td class='fw-light text-center'>" + no + "</td>\
                  <td class='fw-light text-center'>" + responseData[i]["code_goods_issue"] + "</td>\
                  <td class='fw-light text-center'>" + ddmmyyyy(responseData[i]["date"]) + "</td>\
                  <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeWarehouse"]["fullname"] + "</td>\
                  <td class='fw-light text-center text-uppercase'>" + responseData[i]["employeeRequest"]["fullname"] + "</td>\
                  <td class='fw-light text-center text-uppercase'>" + status + "</td>\
                  <td class='fw-light text-center'><div class='btn-group'>" + editData + pdfGR + approvalData + postingData + deleteData + "</div></td>\
              </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                document.getElementById("loadsearch").innerHTML = "  \
          <span onclick='SelectGoodsIssueByDate()' class='input-group-text fw-semibold btn btn-primary'>\
          <i class='fa-solid fa-magnifying-glass'></i>\
          </span>"
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: message
                });
                document.getElementById("dataTable").innerHTML = "";
                document.getElementById("loadsearch").innerHTML = "  \
          <span onclick='SelectGoodsIssueByDate()' class='input-group-text fw-semibold btn btn-primary'>\
          <i class='fa-solid fa-magnifying-glass'></i>\
          </span>"
                await table();
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
                message: status_404
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
                message: status_401
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
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
async function showModalSelectApproval(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(
            document.getElementById("modalApprovalGoodsReceipt")
        );
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(
            document.getElementById("modalApprovalGoodsReceipt")
        );
        myModal.toggle();
    }
    document.getElementById("loadApproval").innerHTML =
        "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
        cancel +
        "</a>";
    document.getElementById("dataTableApprovalDetail").innerHTML = "";
    let language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"];
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsissue/bycode";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_goods_issue_POST: id
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                dataApproval = responseData["dataGI"][0]["log_goods_issue_approvals"];
                dataApproval.forEach((data, index) => {
                    let status;
                    if (data.status == 0) {
                        status = waiting_approval;
                    } else if (data.status == 1) {
                        status = waiting_approval;
                    } else if (data.status == 2) {
                        status = approve;
                    } else if (data.status == 3) {
                        status = reject;
                    }
                    var date;
                    if (data.date == null) {
                        date = "00-00-0000";
                    } else {
                        const dateApprove = new Date(data.date); // Mengonversi string ke objek Date
                        const dd = String(dateApprove.getDate()).padStart(2, "0"); // Hari (2 digit)
                        const mm = String(dateApprove.getMonth() + 1).padStart(2, "0"); // Bulan (2 digit)
                        const yyyy = dateApprove.getFullYear(); // Tahun (4 digit)
                        const HH = String(dateApprove.getHours()).padStart(2, "0"); // Jam (2 digit)
                        const MM = String(dateApprove.getMinutes()).padStart(2, "0"); // Menit (2 digit)
                        date = `${dd}-${mm}-${yyyy} ${HH}:${MM}`;
                    }
                    employeeName = data.hrd_employee?.fullname
                    addRowApproval(
                        index,
                        data.hrd_employee.fullname,
                        data.level_approval,
                        status, // Gunakan nilai status yang sudah diolah
                        data.note,
                        date
                    );
                });
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
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
                message: status_401
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
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
async function addRowApproval(
    index,
    fullname,
    level_approval,
    status,
    note,
    date
) {
    const table = document
        .getElementById("dataTableApproval")
        .getElementsByTagName("tbody")[0];
    var rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.id = "row" + index;

    const cell1 = row.insertCell(0);
    cell1.innerHTML = fullname;
    cell1.className = "text-center fw-light text-uppercase";

    const cell2 = row.insertCell(1);
    cell2.innerHTML = level_approval;
    cell2.className = "text-center fw-light text-uppercase";

    const cell3 = row.insertCell(2);
    cell3.innerHTML = status;
    cell3.className = "text-center fw-light text-uppercase";

    const cell4 = row.insertCell(3);
    cell4.innerHTML = note;
    cell4.className = "text-center fw-light text-uppercase";

    const cell5 = row.insertCell(4);
    cell5.innerHTML = date;
    cell5.className = "text-center fw-light text-uppercase";
}
async function SelectGoodsIssueByDate() {
    startDateList = document.getElementById("startDate").value
    endDateList = document.getElementById("endDate").value
    codeWHform = document.getElementById("codeWHform").value
    document.getElementById("loadsearch").disabled = true
    document.getElementById("loadsearch").innerHTML =
        "<div>\
              <span class='input-group-text fw-semibold btn btn-primary'>\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
              </span>\
            <div>";
    await SelectGoodsIssue(startDateList, endDateList, codeWareHouse)
}
async function selectGoodsIssueByCode(button) {
    const codeValue = button.getAttribute('code');
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"];
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsissue/bycode";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_goods_issue_POST: codeValue,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                await pdf(responseData, button)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/goods_issue";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
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
                message: status_401
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
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
}
async function pdf(responseData, button) {
    jmlData = responseData["dataSignature"].length
    var dataSign = []
    for (var i = 0; i < jmlData; i++) {
        var sign = responseData["dataSignature"][i]["photo"]
        dataSign.push({ image: sign, });
    }
    const dataResponseGoodsIssue = JSON.stringify(responseData["dataGI"][0]);
    const dataResponsesignature = JSON.stringify(dataSign);
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "goodsissue";
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
    const dataGoodsIssuePdf = [];
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const dataGoodsIssue = JSON.parse(`{"goods_issue_POST": ${dataResponseGoodsIssue}}`);
    const dataSignature = JSON.parse(`{"signature_POST": ${dataResponsesignature}}`);
    $.extend(languageMenu, dataGoodsIssue, dataSignature);
    dataGoodsIssuePdf.push(languageMenu)
    var data = JSON.stringify({
        dataGoodsIssuePdf
    });
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                setTimeout(async function () {
                    const fileUrl = `file/issue/${responseData}`;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = responseData;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    // deleteFile(fileUrl)
                    button.disabled = false;
                    button.innerHTML = "<i class='fa-regular fa-file-pdf'></i>";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_warehouse";
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
}
function checkDate() {
    let inputDatePeriod = yyyymmdd(document.getElementById("dateOrder").value)
    let startDatePeriod = yyyymmdd(document.getElementById("startDateList").innerHTML)
    let endDatePeriod = yyyymmdd(document.getElementById("endDateList").innerHTML)
    let startDate = new Date(startDatePeriod); // Format: YYYY-MM-DD
    let endDate = new Date(endDatePeriod);
    let userDate = new Date(inputDatePeriod);

    if (userDate < startDate) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: out_of_period
        });
        document.getElementById("dateOrder").value = ""
    } else if (userDate > endDate) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: out_of_period
        });
        document.getElementById("dateOrder").value = ""
    }
}