
async function showModalUpdateGoodsIssue(id) {
    let language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(
            document.getElementById("modalGoodsIssueApproval")
        );
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(
            document.getElementById("modalGoodsIssueApproval")
        );
        myModal.toggle();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsissue/bycode";
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
        language_POST: language,
        code_goods_issue_POST: id
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                jmhData = responseData["dataGI"][0]["details"]
                for (i = 0; i < jmhData.length; i++) {
                    tableItem +=
                        "<tr>\
                        <td class='fw-light text-center text-uppercase'>" + responseData["dataGI"][0]["details"][i]["log_item_master"]["name"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData["dataGI"][0]["details"][i]["log_item_master"]["uom"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData["dataGI"][0]["details"][i]["qty"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataGI"][0]["details"][i]["worksite"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["dataGI"][0]["details"][i]["asset_code"] + "</td>\
                        <td class='fw-light text-center'>" + kapital(responseData["dataGI"][0]["details"][i]["adm_activity"]["adm_activity_translations"][0]["translation"]) + "</td>\
                        </tr>";
                }
                document.getElementById("dataTableGoodsIssueOrder").innerHTML = tableItem;
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>";
                document.getElementById("loadApprove").innerHTML = "<a id='reject'  type='submit' code='" + id + "' statusApproval='3' onclick='UpdateGoodsIssueApproval(id)' class='btn btn-danger'>" + reject + "</a> <a id='approve' type='submit' code='" + id + "'statusApproval='2' onclick='UpdateGoodsIssueApproval(id)' class='btn  btn-primary'>" + approve + "</a>"
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: message
                });
                setTimeout(function () {
                    window.location.href = "/goods_receipt_approval";
                }, 3000);
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000, message: status_404
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000, message: status_401
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger", z_index: 2000,  message: status_500
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
async function UpdateGoodsIssueApproval(id) {
    const element = document.getElementById(id); // Ambil elemen checkbox berdasarkan param
    const status = element.getAttribute("statusApproval");
    const code = element.getAttribute("code");
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const employeeID = dataLogin["idEmployee"]
    const username = dataLogin["username"]
    const note = document.getElementById("note").value
    const dateApprove = new Date();
    const language = await JSON.parse(getCookie("language"));
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
    var url = mainUrl + "goodsissueapproval/update";
    xhr.onloadstart = function () {
        document.getElementById("loadApprove").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> " + loading + "...</button>";
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
            code_goods_issue_POST: code,
            note_POST: note,
            date_approve_POST: dateApprove,
            status_POST: status,
            username_POST: username,
        }
    );
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseLogin = JSON.parse(xhr.response);
            if (responseLogin["access"] == "success") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "success", message: message, });
                setTimeout(function () {
                    window.location.href = "/goods_issue_approval";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", message: message, });
                setTimeout(function () {
                    window.location.href = "/goods_issue_approval";
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