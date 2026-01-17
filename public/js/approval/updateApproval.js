async function showModalUpdateApproval(company, approvalType) {
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
    document.getElementById("tableOrder").innerHTML = ''
    await selectEmployee()
    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "approval/companytype"
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
        approvalType_POST: approvalType,
        companyCode_POST: company,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateApproval()' class='btn  btn-primary'>" + kapital(done) + "</a>"
                document.getElementById("approval").innerHTML = "<option class='fw-light text-uppercase' value='" + responseData[0]["type_approval"] + "'>" + kapital(responseData[0]["adm_approval_type"]["adm_approval_type_translations"][0]["translation"]) + "</option>"
                document.getElementById("approval").disabled = true
                document.getElementById("worksite").innerHTML = "<option class='fw-light text-uppercase' value='" + responseData[0]["code_company"] + "'>" + kapital(responseData[0]["adm_company"]["name"]) + "</option>"
                document.getElementById("worksite").disabled = true
                responseData.forEach((data, index) => {
                    addRow(index, data.hrd_employee.fullname, data.type_approval, data.code_company, data.employee_id);
                });
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/company";
                }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
function addRow(index, employee_name, type_approval, code_company, employee_id) {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var rowCount = table.rows.length + 1;

    // Membuat elemen <tr> dengan ID dinamis
    var row = table.insertRow();
    row.id = "row" + index; // Mengatur ID baris

    var cell1 = row.insertCell(0);
    cell1.innerHTML = rowCount; // Menampilkan nomor urut
    cell1.className = 'text-center fw-light';

    var cell2 = row.insertCell(1);
    cell2.innerHTML = employee_name; // ID Approval
    cell2.className = 'text-center fw-light text-uppercase';

    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<button type='button' class='btn btn-danger' nama='" + employee + "' id='" + index + "' onclick='deleteRow(this.id)'> <i class='fa-regular fa-trash-can'></i></button>";

    var cell4 = row.insertCell(3);
    cell4.innerHTML = type_approval; // Level Approval
    cell4.hidden = true;

    var cell5 = row.insertCell(4);
    cell5.innerHTML = code_company; // Nama Perusahaan
    cell5.hidden = true;

    var cell6 = row.insertCell(5);
    cell6.innerHTML = employee_id; // Tipe Approval
    cell6.hidden = true;

}
async function updateApproval() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
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
    const languageMenu = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameMenu = JSON.parse('{"username_POST":"' + username + '"}')
    $.extend(languageMenu, usernameMenu, { dataApproval });
    dataMenu.push(languageMenu)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "approval/update";
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
