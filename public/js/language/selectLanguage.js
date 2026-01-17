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
    await selectTranslate()
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titleModal").innerHTML = content["dictionary"];
        document.getElementById("titlePage").innerHTML = content["dictionary"];
        // document.getElementById("codeActivityTypeThead").innerHTML = content["activity_type_code"]
        // document.getElementById("descriptionThead").innerHTML = content["description"]
        // document.getElementById("codeCOAThead").innerHTML = content["coa_group"]
        // document.getElementById("actionsThead").innerHTML = content["actions"]
        // document.getElementById("codeActivitiTypeLabel").innerHTML = content["activity_type_code"] + "<span class='text-danger'>*</span>"
        // document.getElementById("codeCOALabel").innerHTML = content["coa_group"] + "<span class='text-danger'>*</span>"
    }
}

async function selectTranslate() {
    return new Promise(async (resolve, reject) => {
        try {
            let language = JSON.parse(getCookie("language"));
            let token = JSON.parse(getCookie("dataToken"));
            if (!token) {
                token = await getAccessToken();
            }
            var xhr = new XMLHttpRequest();
            var url = mainUrl + "language";

            xhr.onerror = function () {
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    icon: "fa fa-exclamation me-1",
                    message: overload
                });
                setTimeout(async function () {
                    await keluar();
                    reject("XHR request failed");
                }, 3000);
            };

            var data = JSON.stringify({
                language_POST: language
            });

            xhr.onloadend = async function () {
                if (this.readyState === 4 && this.status === 200) {
                    var response = JSON.parse(xhr.response);
                    if (response["access"] === "success") {
                        var responseData = response["data"];
                        let codes = [];
                        var languageMenu = `
                            <table id="languageTable" class="table table-bordered table-striped table-vcenter js-dataTable-responsive">
                                <thead>
                                    <tr>
                                        <th class="text-center text-uppercase">key</th>`
                        for (let i = 0; i < responseData.length; i++) {
                            languageMenu += `
                                        <th class="text-center text-uppercase"> ${responseData[i]["description"]}</th>`
                            codes.push(responseData[i]["language_code"]);
                        }
                        languageMenu += ` 
                                        <th class="text-center text-uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="dataTable"></tbody>
                            </table>`
                        document.getElementById("languageTranslate").innerHTML = languageMenu;
                        await loadLanguage(codes)
                        await table();
                        setTimeout(() => {
                            hideSpinner();
                        }, 1000);
                    } else {
                        reject(response["message"] || "Access failed");
                    }
                } else if (this.status === 404) {
                    Dashmix.helpers("jq-notify", {
                        type: "danger",
                        z_index: 2000,
                        icon: "fa fa-times me-1",
                        message: status_404
                    });
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                    reject("Data failed (404)");
                } else if (this.status === 401) {
                    Dashmix.helpers("jq-notify", {
                        type: "danger",
                        z_index: 2000,
                        icon: "fa fa-times me-1",
                        message: status_401
                    });
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                    reject("Unauthorized (401)");
                } else if (this.status === 500) {
                    Dashmix.helpers("jq-notify", {
                        type: "danger",
                        z_index: 2000,
                        icon: "fa fa-times me-1",
                        message: status_500
                    });
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                    reject("Server error (500)");
                }
            };

            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.send(data);
        } catch (error) {
            reject(error.message || "An unexpected error occurred");
        }
    });
}

async function loadLanguage(codes) {
    try {
        const response = await fetch("file/language.json");
        if (!response.ok) {
            throw new Error("Failed to load language.json");
        }
        const data = await response.json();

        const tbody = document.getElementById("dataTable");

        // ambil semua key unik dari semua content
        const allKeys = new Set();
        data.forEach(item => {
            Object.keys(item.content).forEach(k => allKeys.add(k));
        });

        // buat baris per key
        allKeys.forEach(key => {
            const row = document.createElement("tr");

            // kolom pertama (key)
            const keyCell = document.createElement("td");
            keyCell.textContent = key;
            row.appendChild(keyCell);

            // isi value sesuai urutan codes (en, id, zh, dst)
            codes.forEach(code => {
                const langItem = data.find(d => d.language === code);
                const cell = document.createElement("td");
                cell.textContent = langItem?.content[key] || "-";
                cell.classList.add("text-uppercase");
                row.appendChild(cell);
            });
            const actionCell = document.createElement("td");
            actionCell.classList.add("fw-light", "text-center");
            actionCell.innerHTML = `
                <a title="Edit" type="button"
                    data-keycode="${key}"
                    onclick="showModalUpdateLanguage(this)"
                    class="btn btn-primary" >
                    <i class="fa-regular fa-pen-to-square"></i>
                </a>`
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

