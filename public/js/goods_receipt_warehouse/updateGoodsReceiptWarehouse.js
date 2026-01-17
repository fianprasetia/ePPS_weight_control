async function updateCheckGoodsReceipt(id) {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsreceiptwarehouse/bycode"
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
        code_goods_receipt_POST: id,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                codePO = responseData["dataGR"][0]["code_purchase_order"]
                await showLayoutUpdateData(codePO);
                document.getElementById("dateOrder").value = ddmmyyyy(responseData["dataGR"][0]["date"]);
                document.getElementById("partners").value = responseData["dataGR"][0]["log_purchase_order"]["log_partner"]["name"];
                document.getElementById("invoice").value = responseData["dataGR"][0]["invoice"];
                document.getElementById("shippingDoc").value = responseData["dataGR"][0]["shipping"];
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + id + "' onclick='updateGoodsReceipt(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
                var tableItem = "";
                var no = 1;
                jmhData = responseData["dataGR"][0]["details"]
                for (i = 0; i < jmhData.length; i++) {
                    qty = responseData["dataPODetail"][i]["qty"]
                    qtyReceived = responseData["dataPODetail"][i]["qty_received"]
                    qtyPO = parseFloat(qty) - parseFloat(qtyReceived)
                    tableItem +=
                        "<tr>\
                        <td class='fw-light text-center'>" + no + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataGR"][0]["details"][i]["code_item"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData["dataGR"][0]["details"][i]["log_item_master"]["name"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataGR"][0]["details"][i]["log_item_master"]["uom"] + "</td>\
                        <td class='fw-light text-center text-uppercase'><input type='text' value='"+ qtyPO + "' class='form-control text-end' id='qtyDataBody' name='qtyDataBody[]' style='width: 150px;' disabled></td>\
                        <td class='fw-light text-center text-uppercase'><input type='number' onkeyup='compareQty()' class='form-control text-end' id='qtyReceivedDataBody' value='"+ responseData["dataGR"][0]["details"][i]["qty"] + "' name='qtyReceivedDataBody[]'  style='width: 150px;'></td>\
                        <td class='fw-light text-center'><div class='btn-group'> <button type='button' class='btn btn-danger' id='"+ responseData["dataGR"][0]["details"][i]["code_goods_receipt__detail"] + "' onclick='deleteRow(id)'><i class='fa-regular fa-trash-can'></i></button></div></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTableItem").innerHTML = tableItem;
                document.getElementById("purchaseOrder").disabled = true;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/purchase_request_capex";
                // }, 3000);
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
async function updateGoodsReceipt(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const employeeID = dataLogin["idEmployee"]
    const dataEmployee = await JSON.parse(getCookie("dataEmployee"));
    const companyCode = dataEmployee["code_company"]
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHeaderGR").validate({
                        ignore: [],
                        rules: {
                            "purchaseOrder": { required: !0 },
                            "dateOrder": { required: !0 },
                        },
                        messages: {
                            "purchaseOrder": required,
                            "dateOrder": required,
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
    const form = jQuery("#formHeaderGR");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const code = id.getAttribute('code');
    const purchaseOrder = document.getElementById("purchaseOrder").value
    const codeWarehouseOrder = document.getElementById("codeWHform").value
    const dateOrder = document.getElementById("dateOrder").value
    const invoice = document.getElementById("invoice").value
    const shippingDoc = document.getElementById("shippingDoc").value
    let detail = [];
    var dataGoodReceipt = [];
    document.querySelectorAll("#dataTableItemMasterOrder tbody tr").forEach((row) => {
        let rowData = {
            // no: row.cells[0].innerText,
            code_item_POST: row.cells[1].innerText,
            // name: row.cells[2].innerText,
            // uom: row.cells[3].innerText,
            qty_total_POST: row.querySelector("input[name='qtyDataBody[]']").value,
            qty_received_POST: row.querySelector("input[name='qtyReceivedDataBody[]']").value
        };
        detail.push(rowData);
        // }
    });

    const codeGR = JSON.parse('{"goods_receipt_POST":"' + code + '"}')
    const languageGR = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameGR = JSON.parse('{"username_POST":"' + username + '"}')
    const purchaseOrderGR = JSON.parse('{"purchase_order_POST":"' + purchaseOrder + '"}')
    const dateGR = JSON.parse('{"date_POST":"' + yyyymmdd(dateOrder) + '"}')
    const employeeGR = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
    const companyCodeMenu = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
    const codeWarehouseGR = JSON.parse('{"code_warehouse_POST":"' + codeWarehouseOrder + '"}')
    const invoiceGR = JSON.parse('{"invoice_POST":"' + invoice + '"}')
    const shippingGR = JSON.parse('{"shipping_POST":"' + shippingDoc + '"}')
    const typeGR = JSON.parse('{"type_POST":"WH"}')
    const statusGR = JSON.parse('{"status_POST":0}')
    $.extend(languageGR, usernameGR, codeGR, purchaseOrderGR, dateGR, employeeGR, companyCodeMenu, codeWarehouseGR, invoiceGR, shippingGR, typeGR, statusGR, { detail });
    dataGoodReceipt.push(languageGR)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsreceiptwarehouse/update";
    xhr.onloadstart = function () {
        document.getElementById("load").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            "+ loading + "...\n\
          </button>";
    };
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
    var data = JSON.stringify(dataGoodReceipt);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["access"] == "success") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_warehouse";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
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
    return false;
}
async function showModalupdatePostingGoodsReceipt(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updatePostingGoodsReceipt(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function updatePostingGoodsReceipt(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsreceiptwarehouse/posting"
    xhr.onloadstart = function () {
        document.getElementById("loadNotice").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
                "+ loading + "...\n\
              </button>";
    };
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
        goods_receipt_POST: id,
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_warehouse";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_warehouse";
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