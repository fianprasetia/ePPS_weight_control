async function showModalUpdatePurchaseRequest(id) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(
            document.getElementById("modalPurchaseRequestApproval")
        );
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(
            document.getElementById("modalPurchaseRequestApproval")
        );
        myModal.toggle();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequest/bycodepurchaserequest";
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
                document.getElementById("load").innerHTML =
                    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
                    cancel +
                    "</a>";
                document.getElementById("loadApprove").innerHTML = "<a id='reject'  type='submit' code='" + id + "' statusApproval='3' onclick='UpdatePurchaseRequest(id)' class='btn btn-danger'>" + reject + "</a>  <button id='approve' type='submit' code='" + id + "'statusApproval='2' onclick='UpdatePurchaseRequest(id)' class='btn  btn-primary'>" + approve + "</button>"

                dataDetail.forEach((data, index) => {
                    addRowCheck(
                        data.id,
                        data.log_item_master.name,
                        data.qty_request,
                        data.log_item_master.uom,
                        data.note
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
async function addRowCheck(idRow, description, qty, uom, note) {
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
    cell2.innerHTML = qty;
    cell2.className = "text-center fw-light text-uppercase";

    const cell3 = row.insertCell(2);
    cell3.innerHTML = uom;
    cell3.className = "text-center fw-light text-uppercase";

    const cell4 = row.insertCell(3);
    cell4.innerHTML = note;
    cell4.className = "text-center fw-light text-uppercase";

}
async function UpdatePurchaseRequest(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    const username = dataLogin["username"];
    const element = document.getElementById(id); // Ambil elemen checkbox berdasarkan param
    const status = element.getAttribute("statusApproval");
    const code = element.getAttribute("code");
    const note = document.getElementById("note").value
    const dateApprove = new Date();
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#noteApprove").validate({
                        ignore: [],
                        rules: {
                            "note": { required: !0 },
                        },
                        messages: {
                            "note": required,
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
    const form = jQuery("#noteApprove");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "purchaserequestapproval/update";
    xhr.onloadstart = function () {
        document.getElementById("loadApprove").innerHTML =
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

    var data = JSON.stringify(
        {
            language_POST: language,
            employeeID_POST: employeeID,
            code_purchase_request_POST: code,
            note_POST: note,
            date_approve_POST: dateApprove,
            status_POST: status,
            username_POST: username
        }
    );
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
                    window.location.href = "/purchase_request_approval";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/purchase_request_approval";
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