selectContent();
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    await selectMasterAccounts();
    async function dataContent(data) {
        var filterLanguage = data.filter(
            filtercontent => filtercontent.language == language
        );
        const content = filterLanguage[0]["content"];
        document.getElementById("masterAccountsPage").innerHTML = content["master_coa"];
        document.getElementById("codeCOAHead").innerHTML = content["coa_code"];
        document.getElementById("descriptionsHead").innerHTML = content["description"]
        document.getElementById("levelHead").innerHTML = content["level"]
        document.getElementById("typeHead").innerHTML = content["type"]
        document.getElementById("entityHead").innerHTML = content["entity"]
        document.getElementById("statusHead").innerHTML = content["status"]
    }
}
async function selectMasterAccounts() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa"
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
    var data = JSON.stringify({
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    if (responseData[i]["level_coa"] == 1) {
                        colortable = "bg-xpro-lighter";
                    } else if (responseData[i]["level_coa"] == 2) {
                        colortable = "bg-gray";
                    } else if (responseData[i]["level_coa"] == 3) {
                        colortable = "bg-xdream-lighter";
                    } else if (responseData[i]["level_coa"] == 4) {
                        colortable = "bg-gray-light";
                    } else if (responseData[i]["level_coa"] == 5) {
                        colortable = "bg-gray-lighter";
                    }
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-dark text-uppercase " + colortable + "'>" + responseData[i]["code_coa"] + "</td>\
                            <td class='fw-light text-dark text-uppercase " + colortable + "'>" + responseData[i]["fat_coa_translations"][0]["translation"] + "</td>\
                            <td class='fw-light text-dark text-center text-uppercase " + colortable + "'>" + responseData[i]["level_coa"] + "</td>\
                            <td class='fw-light text-dark text-center text-uppercase " + colortable + "'>" + responseData[i]["type_coa"] + "</td>\
                            <td class='fw-light text-dark text-center text-uppercase " + colortable + "'>" + responseData[i]["entity_coa"] + "</td>\
                            <td class='fw-light text-dark text-center text-uppercase " + colortable + "'>" + (responseData[i]["status_coa"] == 1 ? active : nonactive) + "</td>\
                        </tr>";
                }
                document.getElementById("dataTableItem").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
async function selectMasterAccountsExcel() {
    document.getElementById("doc").innerHTML = "<a class='btn' type='button' disabled><span class='spinner-border text-success' role='status' aria-hidden='true'></span></a>"
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "coa"
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
    var data = JSON.stringify({
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                await excel(responseData)
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/master_accounts_report";
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
// async function excel(responseData) {
//     const language = await JSON.parse(getCookie("language"));
//     var token = await JSON.parse(getCookie("dataToken"));
//     if (token == null) {
//         await getAccessToken()
//     }
//     var xhr = new XMLHttpRequest();
//     var url = secondUrl + "masteraccounts";
//     xhr.onerror = function () {
//         Dashmix.helpers("jq-notify", {
//             z_index: 2000,
//             type: "danger",
//             icon: "fa fa-exclamation me-1",
//             message: overload,
//         });
//         setTimeout(async function () {
//             await keluar()
//         }, 3000);
//     };
//     const dataMasterAccountsAxcel = [];
//     const languageMenu = {
//         language_POST: language
//     };

//     const dataMasterAccounts = {
//         master_account_POST: responseData 
//     };

//     $.extend(languageMenu, dataMasterAccounts);
//     dataMasterAccountsAxcel.push(languageMenu)
//     var data = JSON.stringify(
//         {
//             dataMasterAccountsAxcel
//         }
//     );
//     xhr.onloadend = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var response = JSON.parse(xhr.response);
//             if (response["access"] == "success") {
//                 var responseData = response["data"]
//                 setTimeout(async function () {
//                     const fileUrl = `file/coa/${responseData}`;
//                     const link = document.createElement('a');
//                     link.href = fileUrl;
//                     link.download = responseData;
//                     document.body.appendChild(link);
//                     link.click();
//                     document.body.removeChild(link);
//                 }, 3000);

//             } else if (response["access"] == "failed") {
//                 message = response["message"];
//                 Dashmix.helpers("jq-notify", {
//                     z_index: 2000,
//                     type: "danger",
//                     icon: "fa fa-times me-1",
//                     message: message,
//                 });
//                 setTimeout(function () {
//                     window.location.href = "/master_accounts_report";
//                 }, 3000);
//             }
//         } if (this.status == 404) {
//             message = "data failed to load";
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
//             setTimeout(function () {
//                 window.location.href = "/";
//             }, 3000);
//         } if (this.status == 401) {
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
//             setTimeout(function () {
//                 window.location.href = "/";
//             }, 3000);
//         } if (this.status == 500) {
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
//             setTimeout(function () {
//                 window.location.href = "/";
//             }, 3000);
//         }
//     };
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhr.setRequestHeader("Authorization", "Bearer " + token);
//     xhr.send(data);
// }
async function excel(responseData) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));

    if (!token) {
        token = await getAccessToken(); // ✅ sekarang beneran tunggu token
    }
    const formData = new FormData();
    const payload = {
        language_POST: language,
        master_account_POST: responseData
    };
    const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    formData.append("data", jsonBlob); // Kirim sebagai 'data'

    const xhr = new XMLHttpRequest();
    const url = secondUrl + "masteraccounts";
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

    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["access"] === "success") {
                const responseData = response["data"];
                setTimeout(() => {
                    const fileUrl = `file/coa/${responseData}`;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = responseData;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    document.getElementById("doc").innerHTML = "<button onclick='selectMasterAccountsExcel()' class='btn' href='#'><img class='' style='width:35px;' src='file/icon/xls.png'></button>"
                }, 3000);
            } else {
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: response["message"] || "Gagal memproses permintaan.",
                });
                setTimeout(() => window.location.href = "/master_accounts_report", 3000);
            }
        }

        if (this.status === 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(() => window.location.href = "/", 3000);
        } else if (this.status === 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(() => window.location.href = "/", 3000);
        } else if (this.status === 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            setTimeout(() => window.location.href = "/", 3000);
        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(formData);
}
