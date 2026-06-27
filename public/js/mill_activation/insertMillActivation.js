async function showModalInsertMillActivation(id) {
    const element = document.getElementById(id);
    var myModal = new bootstrap.Modal(document.getElementById("modalMillActivation"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadsearch").disabled = false
}
async function insertMillActivation(el) {
    const language = await JSON.parse(getCookie("language"));
    const responseData = JSON.parse(el.dataset.response);
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "millactivation/insert";
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
        data_POST: responseData
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "success",
                    icon: "fa fa-check me-1",
                    message: message
                });
                setTimeout(function () {
                    window.location.href = "/mill_activation";
                }, 3000);
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                document.getElementById("loadActivate").innerHTML =
                    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
                    cancel +
                    "</a>";
                document.getElementById("loadsearch").innerHTML = "\
                    <span onclick='activeCode()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                    </span>"
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);

}
async function activeCode() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "codeActivate": { required: !0 },
                        },
                        messages: {
                            "codeActivate": required,
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
    if (!isValid) {
        return false;
    }
    document.getElementById("loadsearch").disabled = true
    document.getElementById("loadsearch").innerHTML =
        "<span class='input-group-text fw-semibold btn btn-primary'>\
              <i class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></i>\
        </span>";
    const language = await JSON.parse(getCookie("language"));
    let code = document.getElementById("codeActivate").value;
    let xhr = new XMLHttpRequest();
    let url = erpUrl + "weightcontrol/detail";
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
        code_POST: code
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                let responseDataWC = response["data"]["weight_control"];
                const responseData = response["data"];
                tableItem =
                    "<tr>\
                            <td class='fw-light text-center'>" + responseDataWC["weight_control_code"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseDataWC["company"]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseDataWC["factory"]["name"] + "</td>\
                        </tr>";
                document.getElementById("dataActivateTable").innerHTML = tableItem;
                document.getElementById("loadActivate").innerHTML =
                    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
                    cancel +
                    "</a> <a id='doneBtn' type='submit'  onclick='insertMillActivation(this)' class='btn  btn-primary'>" +
                    done +
                    "</a>";
                document.getElementById("doneBtn").dataset.response = JSON.stringify(responseData);
                await table();
                document.getElementById("loadsearch").innerHTML = "\
                <span onclick='activeCode()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                    </span>"
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                document.getElementById("loadActivate").innerHTML =
                    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
                    cancel +
                    "</a>";
                document.getElementById("loadsearch").innerHTML = "\
                    <span onclick='activeCode()' class='input-group-text fw-semibold btn btn-primary'>\
                        <i class='fa-solid fa-magnifying-glass'></i>\
                    </span>"
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}