selectContent()
async function selectContent() {
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("millActivationPage").innerHTML = filterLanguage[0]["content"]["mill_activation"]
        document.getElementById("titleMillActivation").innerHTML = filterLanguage[0]["content"]["mill_activation"]
        await selectMillActivation()
    }
}
async function selectMillActivation() {
    const language = await JSON.parse(getCookie("language"));
    let xhr = new XMLHttpRequest();
    let url = mainUrl + "millactivation";
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = await JSON.parse(xhr.response);
            if (response["success"] == true) {
                let responseData = response["data"];
                tableItem =
                    "<tr>\
                        <td class='fw-light text-center'>" + responseData["weight_control_code"] + "</td>\
                        <td class='fw-light text-center text-uppercase'>" + responseData["code_company"] + "</td>\
                        <td class='fw-light text-center'>" + responseData["mill"] + "</td>\
                    </tr>";
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            }

        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);

};
