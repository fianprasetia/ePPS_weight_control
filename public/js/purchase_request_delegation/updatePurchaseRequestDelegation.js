async function showModalUpdatePurchaseRequestDelegation(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(
            document.getElementById("modalPurchaseRequestDelegation"), { keyboard: false }

        );
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(
            document.getElementById("modalPurchaseRequestDelegation"), { keyboard: false }
        );
        myModal.toggle();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/delegationcode";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        code_purchase_request_POST: id
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                dataDetail = responseData[0]["log_purchase_request_details"];
                dataApproval = responseData[0]["log_purchase_request_approvals"];
                employeeID = responseData[0]["employee_purchasing"];
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a type='submit' id=" + id + " onclick='UpdatePurchaseRequestDelegation(id)' class='btn btn-primary'>" + kapital(done) + "</a>"
                dataDetail.forEach((data, index) => {
                    addRowCheck(
                        data.id,
                        data.log_item_master.name,
                        data.qty_request,
                        data.qty_actual,
                        data.log_item_master.uom,
                        data.note,
                        data.code_item,
                        data.code_purchase_request
                    );
                });

                dataApproval.forEach((data, index) => {
                    addRowApproval(
                        data.id,
                        data.hrd_employee.fullname,
                        data.note,
                    );
                });
                const createTab = document.querySelector(
                    'a[data-bs-target="#purchase-request-form"]'
                );

                // Aktifkan tab menggunakan Bootstrap Tab API
                if (createTab) {
                    const tabInstance = new bootstrap.Tab(createTab);
                    tabInstance.show();
                }
                await selectEmployee(employeeID)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message
                });
                setTimeout(function () {
                    window.location.href = "/purchase_request_capex";
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
async function addRowCheck(idRow, description, qty_request, qty_actual, uom, note, code_item, code_pr) {
    const table = document
        .getElementById("dataTableItem")
        .getElementsByTagName("tbody")[0];
    var rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.id = "row" + idRow;

    const cell1 = row.insertCell(0);
    cell1.innerHTML = description;
    cell1.className = "text-center fw-light";

    const cell2 = row.insertCell(1);
    cell2.innerHTML = qty_request;
    cell2.className = "text-center fw-light text-uppercase";

    const cell3 = row.insertCell(2);
    cell3.innerHTML = "<input type='number' value='" + qty_actual + "' class='form-control text-center fw-light text-uppercase' id='qtyActual' name='qtyActual[]' style='width: 150px;'>"
    cell3.className = "text-center fw-light text-uppercase text_center";

    const cell4 = row.insertCell(3);
    cell4.innerHTML = uom;
    cell4.className = "text-center fw-light text-uppercase";

    const cell5 = row.insertCell(4);
    cell5.innerHTML = "<input type='text' value='" + note + "' class='form-control text-center fw-light text-uppercase' id='note' name='note[]'>";
    cell5.className = "text-center fw-light text-uppercase";

    const cell6 = row.insertCell(5);
    cell6.innerHTML = `<button title='Approve' type='button' code='${code_pr}' id='btn-${idRow}' onclick='UpdateItemPurchaseRequestDelegation(this, "${idRow}")' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>`;
    cell6.className = "text-center fw-light text-uppercase";

    const cell7 = row.insertCell(6);
    cell7.innerHTML = code_item;
    cell7.className = "text-center fw-light text-uppercase";
    cell7.hidden = true

}
async function addRowApproval(idRow, name, note) {
    const table = document
        .getElementById("dataTableApproval")
        .getElementsByTagName("tbody")[0];
    var rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.id = "row" + idRow;

    const cell1 = row.insertCell(0);
    cell1.innerHTML = name;
    cell1.className = "text-center fw-light text-uppercase";

    const cell2 = row.insertCell(1);
    cell2.innerHTML = note;
    cell2.className = "text-center fw-light text-uppercase";
}
async function UpdatePurchaseRequestDelegation(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const employeeID = document.getElementById("selectPurchasing").value
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#noteDelegation").validate({
                        ignore: [],
                        rules: {
                            "selectPurchasing": { required: !0 },
                        },
                        messages: {
                            "selectPurchasing": required,
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
    const form = jQuery("#noteDelegation");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    var table = document.getElementById("dataTableItem").getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tr');
    var dataDelegation = [];
    var detail = [];
    for (var i = 0; i < rows.length; i++) {
        const qtyRequest = rows[i].cells[1].innerText;
        const qtyActual = rows[i].cells[2].querySelector('input').value;
        const uom = rows[i].cells[3].innerText;
        const note = rows[i].cells[4].querySelector('input').value;
        // const note = rows[i].cells[4].innerText;
        const codeItem = rows[i].cells[6].innerText;
        detail.push({
            code_item_POST: codeItem,
            qty_request_POST: qtyRequest,
            qty_actualt_POST: qtyActual,
            note_POST: note,
            uom_POST: uom,
        });
    }
    const languageHeader = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameHeader = JSON.parse('{"username_POST":"' + username + '"}')
    const idHeader = JSON.parse('{"code_purchase_request_POST":"' + id + '"}')
    const EmployeeIdHeader = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
    $.extend(languageHeader, usernameHeader, idHeader, EmployeeIdHeader, { detail });
    dataDelegation.push(languageHeader)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/updatedelegation";
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

    var data = JSON.stringify(dataDelegation);
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/purchase_request_delegation";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/purchase_request_delegation";
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
async function UpdateItemPurchaseRequestDelegation(button, idRow) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const codeValue = button.getAttribute('code');
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/updateitem";
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


    var data = JSON.stringify(
        {
            language_POST: language,
            code_POST: idRow,
            username_POST: username
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message,
                });
                closeModal()
                showModalUpdatePurchaseRequestDelegation(codeValue)
                // setTimeout(function () {
                //     window.location.href = "/purchase_request_delegation";
                // }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/purchase_request_delegation";
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
