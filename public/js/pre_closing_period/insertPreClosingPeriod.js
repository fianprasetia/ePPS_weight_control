async function insertDeprecation() {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const worksite = dataCompany[0]["code_company"]
    const companyCode = dataCompany[0]["parent_code"]

    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let period = yyyymm(document.getElementById("startDateList").innerHTML)
    let transaction = document.getElementById("transaction").value
    let dataDeprecation = [];
    let detail = [];
    document.querySelectorAll("#tableDeprecation tbody tr").forEach((row) => {
        let rowData = {
            code_asset_type_POST: row.cells[0].innerText.trim(),
            total_historical_cost_POST: unformatRupiah(row.cells[3].innerText.trim()),
        };
        detail.push(rowData);
    });
    const languageHead = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameHead = JSON.parse('{"username_POST":"' + username + '"}')
    const periodHead = JSON.parse('{"period_POST":"' + period + '"}')
    const transactionHead = JSON.parse('{"transaction_POST":"' + transaction + '"}')
    const worksiteHead = JSON.parse('{"worksite_POST":"' + worksite + '"}')
    const companyHead = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
    $.extend(languageHead, usernameHead, periodHead, transactionHead, worksiteHead, companyHead, { detail });
    dataDeprecation.push(languageHead)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/postingbydepreciation";
    xhr.onloadstart = function () {
        document.getElementById("loadPreClosingPeriod").innerHTML =
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
    var data = JSON.stringify(dataDeprecation);
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
                    window.location.href = "/pre_closing_period";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/pre_closing_period";
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
