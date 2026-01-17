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
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = content["warehouse_stock"];
        document.getElementById("codeCOAHead").innerHTML = content["coa_code"]
        document.getElementById("codeItemHead").innerHTML = content["code_item"]
        document.getElementById("descriptionsHead").innerHTML = content["description"]
        document.getElementById("uomHead").innerHTML = content["uom"]
        document.getElementById("beginningHead").innerHTML = content["opening_balance"]
        document.getElementById("inHead").innerHTML = content["in"]
        document.getElementById("outHead").innerHTML = content["out"]
        document.getElementById("endingHead").innerHTML = content["end_balance"]
        document.getElementById("periodDateHeader").placeholder = content["period"];
    }
    setTimeout(() => {
        hideSpinner();
    }, 1000);
}
async function selectCompany(companyCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/type"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == companyCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != companyCode);
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
                document.getElementById("companyHeader").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/warehouse_inventory_report";
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
async function selectWorksite(worksiteCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = document.getElementById("companyHeader").value
    const companyCode = companyType[0]["code_company"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/warehouseworksite"
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
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("locationHeader").innerHTML = mainOptionItem + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/warehouse_inventory_report";
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
async function selectItemMaster(code_item) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const warehouse = document.getElementById("locationHeader").value
    const period = document.getElementById("periodDateHeader").value
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "warehouse/byitemwarehouse"
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
        warehouse_POST: warehouse,
        period_POST: yyyymm(period),
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_item == code_item);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_item != code_item);
                mainOptionItem = "";
                subOptionItem = "";
                subOptionItemAll = "<option class='fw-light text-uppercase' value='all'>" + kapital(all) + "</option>";;
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_item"] + "'>" + filternotSubData[i]["code_item"] + " - " + kapital(filternotSubData[i]["log_item_master"]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_item"] + "'>" + filterSubData[0]["code_item"] + " - " + kapital(filterSubData[0]["log_item_master"]["name"]) + "</option>";
                }
                document.getElementById("itemMasterHeader").innerHTML = mainOptionItem + subOptionItemAll + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/warehouse_inventory_report";
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
async function selectWarehouseItem() {
    (function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "periodDateHeader": { required: true },
                            "companyHeader": { required: true },
                            "locationHeader": { required: true },
                            "itemMasterHeader": { required: true },
                        },
                        messages: {
                            "periodDateHeader": required,
                            "companyHeader": required,
                            "locationHeader": required,
                            "itemMasterHeader": required,
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
    if (!isValid) return false;

    await resetDataTables();
    document.getElementById("dataTable").innerHTML = "";
    document.getElementById("dataTableFoot").innerHTML = "";

    const language = JSON.parse(getCookie("language"));
    let token = JSON.parse(getCookie("dataToken"));
    const period = yyyymm(document.getElementById("periodDateHeader").value);
    const warehouse = document.getElementById("locationHeader").value;
    const itemMaster = document.getElementById("itemMasterHeader").value;

    if (!token) await getAccessToken();

    const loadData = {
        language_POST: language,
        period_POST: period,
        warehouse_POST: warehouse,
        item_master_POST: itemMaster,
    };
    document.getElementById("loadsearch").disabled = true;
    document.getElementById("loadsearch").innerHTML = `
        <div>
            <span class='input-group-text fw-semibold btn btn-primary'>
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
            </span>
        </div>`;

    try {
        const response = await fetch(mainUrl + "warehouse/byitemwarehousedetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(loadData),
        });

        if (response.status === 404) throw new Error(status_404);
        if (response.status === 401) throw new Error(status_401);
        if (response.status === 500) throw new Error(status_500);

        const result = await response.json();

        if (result.access === "success") {
            var responseData = result["data"]

            var no = 1
            let totalBeginning = 0;
            let totalIncoming = 0;
            let totalOutgoing = 0;
            let totalEnding = 0;
            let tableItem = "";
            for (let i = 0; i < responseData.length; i++) {
                const item = responseData[i];
                const beginningTotalPrice = parseFloat(item.initial_qty) * parseFloat(item.beginning_price);
                const incomingTotalPrice = parseFloat(item.incoming_qty) * parseFloat(item.incoming_price);
                const outgoingTotalPrice = parseFloat(item.outgoing_qty) * parseFloat(item.outgoing_price);
                const endingQty = parseFloat(item.initial_qty) + parseFloat(item.incoming_qty) - parseFloat(item.outgoing_qty);
                const endingTotalPrice = parseFloat(beginningTotalPrice) + parseFloat(incomingTotalPrice) - parseFloat(outgoingTotalPrice);
                const endingPrice = parseFloat(endingTotalPrice) / parseFloat(endingQty);
                totalBeginning += beginningTotalPrice;
                totalIncoming += incomingTotalPrice;
                totalOutgoing += outgoingTotalPrice;
                totalEnding += endingTotalPrice;
                tableItem += `
                    <tr>
                        <td class='fw-light text-uppercase '>${no}</td>
                        <td class='fw-light text-uppercase '>${item.log_item_master.log_item_category.code_coa}</td>
                        <td class='fw-light text-uppercase '>${item.code_item}</td>
                        <td class='fw-light text-uppercase '>${item.log_item_master.name}</td>
                        <td class='fw-light text-uppercase '>${item.log_item_master.uom}</td>
                        <td class='fw-light text-uppercase text-center'>${item.initial_qty}</td>
                        <td class='fw-light text-uppercase text-center'>${item.incoming_qty}</td>
                        <td class='fw-light text-uppercase text-center'>${item.outgoing_qty}</td>
                        <td class='fw-light text-uppercase text-center'>${endingQty}</td>
                    </tr>`;
                no++
            }

            document.getElementById("dataTable").innerHTML = tableItem;
            document.getElementById("doc").hidden = false;
            document.getElementById("loadsearch").innerHTML = `
                <span onclick='selectWarehouseItem()' class='input-group-text fw-semibold btn btn-primary'>
                    <i class='fa-solid fa-magnifying-glass'></i>
                </span>`;
            await table();

        } else if (result.access === "failed") {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: result.message,
            });
            setTimeout(() => window.location.href = "/warehouse_inventory_report", 3000);
        }

    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:error.message || overload,
        });
        setTimeout(() => window.location.href = "/", 3000);
    }

    return false;
}
async function selectWarehouseInventoryExcel() {
    document.getElementById("doc").innerHTML = "<a class='btn' type='button' disabled><span class='spinner-border text-success' role='status' aria-hidden='true'></span></a>"

    const language = JSON.parse(getCookie("language"));
    let token = JSON.parse(getCookie("dataToken"));
    const period = yyyymm(document.getElementById("periodDateHeader").value);
    const warehouse = document.getElementById("locationHeader").value;
    const itemMaster = document.getElementById("itemMasterHeader").value;

    if (!token) await getAccessToken();

    const loadData = {
        language_POST: language,
        period_POST: period,
        warehouse_POST: warehouse,
        item_master_POST: itemMaster,
    };

    try {
        const response = await fetch(mainUrl + "warehouse/byitemwarehousedetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(loadData),
        });

        if (response.status === 404) throw new Error(status_404);
        if (response.status === 401) throw new Error(status_401);
        if (response.status === 500) throw new Error(status_500);

        const result = await response.json();

        if (result.access === "success") {
            const responseData = result.data;
            await warehouseInventoryToExcel(responseData)
        } else if (result.access === "failed") {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: result.message,
            });
            setTimeout(() => window.location.href = "/warehouse_inventory_report", 3000);
        }

    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:error.message || overload,
        });
        setTimeout(() => window.location.href = "/", 3000);
    }
    return false;
}
async function warehouseInventoryToExcel(responseData) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));

   if (!token) {
        token = await getAccessToken(); 
    }
    const formData = new FormData();
    const loadData = {
        language_POST: language,
        warehouse_inventory_POST: responseData
    };
    const jsonBlob = new Blob([JSON.stringify(loadData)], { type: 'application/json' });
    formData.append("data", jsonBlob); // Kirim sebagai 'data'
    const xhr = new XMLHttpRequest();
    const url = secondUrl + "warehouseinventory";
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
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["access"] === "success") {
                const responseData = response["data"];
                setTimeout(() => {
                    const fileUrl = `file/warehouse/${responseData}`;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = responseData;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    document.getElementById("doc").innerHTML = "<button onclick='selectWarehouseInventoryExcel()' class='btn' href='#'><img class='' style='width:35px;' src='file/icon/xls.png'></button>"
                }, 3000);
            } else {
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: response["message"] || "Gagal memproses permintaan.",
                });
                setTimeout(() => window.location.href = "/warehouse_inventory_report", 3000);
            }
        }
        if (this.status === 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(() => window.location.href = "/", 3000);
        } else if (this.status === 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(() => window.location.href = "/", 3000);
        } else if (this.status === 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            setTimeout(() => window.location.href = "/", 3000);
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(formData);
}