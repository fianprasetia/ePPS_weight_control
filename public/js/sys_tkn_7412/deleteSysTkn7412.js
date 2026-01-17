async function showModalDeleteToken(username, accessType) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>Cancel</a> <a type='submit' onclick='deleteToken(\"" + username + "\", \"" + accessType + "\")' class='btn  btn-primary'>Done</a>"
    document.getElementById("contentNotice").innerHTML = "<p>Are you sure you want to delete this transaction?</p>"
}
function closeModal() {
    $('.modal').modal('hide');
    // document.getElementById("formApproval").reset()
    // document.getElementById("formSearch").reset()
}
async function deleteToken(username, accessType) {
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "token/deletetype";
    xhr.onloadstart = function () {
        document.getElementById("loadNotice").innerHTML =
            "<button class='btn btn-hero btn-primary shadow' type='button' disabled>\n\
            <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
            Loading...\n\
          </button>";
    };
    var data = JSON.stringify({
        access_type_POST: accessType,
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var selectData = await JSON.parse(xhr.response);
            if (selectData["access"] == "success") {
                setTimeout(function () {
                    window.location.href = "/sys_tkn_7412";
                }, 3000);

            }
        }
        // if (this.status == 404) {
        //     message = "Data failed";
        //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
        //     setTimeout(function () {
        //         window.location.href = "/";
        //     }, 3000);
        // }
        // if (this.status == 401) {
        //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
        //     setTimeout(function () {
        //         window.location.href = "/";
        //     }, 3000);
        // }
        // if (this.status == 500) {
        //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
        //     setTimeout(function () {
        //         window.location.href = "/";
        //     }, 3000);
        // }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
    return false;
}