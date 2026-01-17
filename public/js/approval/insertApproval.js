async function showModalInsertApproval() {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalApproval"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalApproval"), { keyboard: false });
        myModal.toggle();
    }
    await selectApprovalType()
    await selectWorksite()
    await selectEmployee()
    document.getElementById("approval").disabled = false
    document.getElementById("worksite").disabled = false
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='insertApproval()' class='btn  btn-primary'>" + kapital(done) + "</a>"
}
async function insertApproval() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
    }
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "approval": { required: !0 },
                            "worksite": { required: !0 },
                        },
                        messages: {
                            "approval": required,
                            "worksite": required,
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
    const approval = document.getElementById("approval").value
    const worksite = document.getElementById("worksite").value
    if (approval == "" || worksite == "") {
        return false
    }
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tr');
    var dataApproval = [];
    var dataMenu = [];
    for (var i = 0; i < rows.length; i++) {
        var no = rows[i].cells[0].innerText;
        var codeApprovalType = rows[i].cells[3].innerText;
        var codeWorksite = rows[i].cells[4].innerText;
        var codeEmployee = rows[i].cells[5].innerText;
        dataApproval.push({
            approvalNo_POST: no,
            approvalType_POST: codeApprovalType,
            worksite_POST: codeWorksite,
            employeeID_POST: codeEmployee,
        });
    }
    if (dataApproval.length === 0) {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message: empoyee_approval,
        });
        return false
    }
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}')
    $.extend(languageMenu, usernameMenu, { dataApproval });
    dataMenu.push(languageMenu)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "approval/insert";
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
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(dataMenu);
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
                    window.location.href = "/approval";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/approval";
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