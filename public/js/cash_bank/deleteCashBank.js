function closeModal() {
    $('.modal').modal('hide');
    document.getElementById("formPaymentVoucher").reset()
}
function deleteRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
    updateSubTotal(); // update subtotal setelah baris dihapus
}
async function cancelTransaction() {
    document.getElementById("formHeader").reset()
    document.getElementById("formDetail").reset()
    document.getElementById("dataTableItem").innerHTML = ""
    const formElements = document.querySelectorAll('#formHeader input, #formHeader select, #formHeader textarea, #formHeader button');

    formElements.forEach(el => {
        el.disabled = false;
    });
    await selectCompany();
    await selectCOAHeader();
    await selectPaymentMethod();
    await selectCurrency();
    // await selectPartnersHeader();
    await selectCOADetail();
    await selectPartnersDetail();
    await selectEmployee()
}
async function showModalDeleteCashBankByCode(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='deletePaymentVoucher(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_delete + "</p>"
}
async function deletePaymentVoucher(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "cashbank/delete"
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
        code_cash_bank_POST: id,
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/cash_bank";
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