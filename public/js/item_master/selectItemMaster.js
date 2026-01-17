async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }

    let language = await JSON.parse(getCookie("language"));
    const data = "file/language.json";

    // Fetch data dan tunggu hingga selesai
    const response = await fetch(data);
    const jsonData = await response.json();

    // Proses data
    await dataContent(jsonData);

    // Panggil `selectSearchItemCategory` setelah semua proses selesai
    await selectSearchItemCategory();

    async function dataContent(data) {
        var filterLanguage = data.filter(
            (filtercontent) => filtercontent.language == language
        );

        const content = filterLanguage[0]["content"];
        // Update elemen HTML
        document.getElementById("itemMasterPage").innerHTML = content["item_master"];
        document.getElementById("titleItemMaster").innerHTML = content["item_master"];
        document.getElementById("category").innerHTML = content["category"];
        document.getElementById("code_item").innerHTML = content["code_item"];
        document.getElementById("description").innerHTML = content["description"];
        document.getElementById("uom").innerHTML = content["uom"];
        document.getElementById("status").innerHTML = content["status"];
        document.getElementById("actions").innerHTML = content["actions"];
        document.getElementById("searchCategoryLabel").innerHTML = content["category"];
        document.getElementById("searchDescriptionLabel").innerHTML = content["description"];
        document.getElementById("categoryLabel").innerHTML = content["category"] + "<span class='text-danger'>*</span>";
        document.getElementById("descriptionLabel").innerHTML = content["description"] + "<span class='text-danger'>*</span>";
        document.getElementById("uomLabel").innerHTML = content["uom"] + "<span class='text-danger'>*</span>";
        document.getElementById("statusLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>";
    }
}

async function selectItemMaster() {
    const language = await JSON.parse(getCookie("language"));
    const searchDescription = document.getElementById("searchDescription").value
    const searchCategory = document.getElementById("searchCategory").value
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "itemmaster"
    xhr.onloadstart = function () {
        document.getElementById("loadsearch").disabled = true
        document.getElementById("loadsearch").innerHTML =
            "<div  class=''>\
                  <span class='input-group-text fw-semibold btn btn-primary'>\
                  <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
                 </span>\
                    <div>";
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
        category_POST: searchCategory,
        description_POST: kapital(searchDescription),
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                await resetDataTables()
                var responseData = response["data"]
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    var editItemMaster = " <button title='" + edit + "' type='button' id ='" + responseData[i]["code_item"] + "' onclick='showModalUpdateItemMaster(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_category"] + " - " + responseData[i]["log_item_category"]["log_item_category_translations"][0]["translation"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["code_item"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["name"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["uom"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + (responseData[i]["status"] == 0 ? active : nonactive) + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editItemMaster + "</div></td>\
                        </tr>";
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectItemMaster()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>"
                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/item_master";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectUOM(uomCode) {
    const language = await JSON.parse(getCookie("language"));
    const dataUOM = "file/uom.json";
    fetch(dataUOM)
        .then((response) => response.json())
        .then((dataUOM) => dataContent(dataUOM));
    function dataContent(dataUOM) {
        var responseData = dataUOM
        const filteredDataOUM = Object.entries(responseData.uom)
            .filter(([key, value]) => value[language]) // Memfilter berdasarkan bahasa
            .map(([key, value]) => ({ key, name: value[language] }));
        var filterSubData = filteredDataOUM.filter((filterSubData) => filterSubData.key == uomCode);
        var filternotSubData = filteredDataOUM.filter((filternotSubData) => filternotSubData.key != uomCode);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
            subOptionItem +=
                "<option class='fw-light text-uppercase' value='" +
                filternotSubData[i]["key"] +
                "'>" +
                kapital(filternotSubData[i]["name"]) + " (" + filternotSubData[i]["key"] + ") </option>";
        }
        if (filterSubData == "" || filterSubData == undefined) {
            mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
            mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["key"] + ">" + kapital(filterSubData[0]["name"]) + " (" + filterSubData[0]["key"] + ")</option>";
        }
        document.getElementById("selectUOM").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
    }
}
async function selectItemCategory(codeCategory) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "itemcategory"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_category == codeCategory);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_category != codeCategory);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_category"] +
                        "'>" + filternotSubData[i]["code_category"] + " - " +
                        kapital(filternotSubData[i]["log_item_category_translations"][0]["translation"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_category"] + "> " + filterSubData[0]["code_category"] + " - " + kapital(filterSubData[0]["log_item_category_translations"][0]["translation"]) + "</option>";
                }

                document.getElementById("selectCategory").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/item_master";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
async function selectSearchItemCategory(codeCategory) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "itemcategory"
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                subOptionItem = "";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        responseData[i]["code_category"] +
                        "'>" + responseData[i]["code_category"] + " - " +
                        kapital(responseData[i]["log_item_category_translations"][0]["translation"]) +
                        "</option>";
                }
                mainOptionItem = "<option class='fw-light text-uppercase' selected value=''>" + kapital(all) + "</option>";
                document.getElementById("searchCategory").innerHTML = mainOptionItem + "" + subOptionItem;
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
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        } if (this.status == 401) {
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
selectContent() 