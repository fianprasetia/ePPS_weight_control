async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        // alert("ksong")
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("approvalPage").innerHTML = filterLanguage[0]["content"]["approval"]
        document.getElementById("titleApproval").innerHTML = filterLanguage[0]["content"]["approval"]
        await selectApproval()
    }
}
async function selectApproval() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "approval/bylanguage"
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
                var data = response["data"]
                const getMaxApprovalLevel = (dataArray) => {
                    return dataArray.reduce((maxLevel, item) => {
                        return item.level_approval > maxLevel ? item.level_approval : maxLevel;
                    }, 0); // Mulai dari level 0
                };

                const maxApprovalLevel = getMaxApprovalLevel(data);

                // Membuat header tabel dinamis
                const tableHeader = document.getElementById('tableHeader');
                tableHeader.innerHTML = `
                <th class="text-center text-uppercase">${worksite}</th>
                <th class="text-center text-uppercase">${approval_type}</th>
                ${Array.from({ length: maxApprovalLevel }, (_, i) => `<th class="text-center text-uppercase">${approval} ${i + 1}</th>`).join('')}
                <th class="text-center text-uppercase">${action}</th>`;

                const tableBody = document.getElementById('tableBody');
                // Mengelompokkan data berdasarkan perusahaan dan jenis approval
                const groupedData = data.reduce((acc, item) => {
                    const companyKey = kapital(item.code_company);
                    const approvalKey = kapital(item.adm_approval_type.adm_approval_type_translations[0].translation);

                    // Cek apakah company sudah ada di dalam accumulator
                    if (!acc[companyKey]) {
                        acc[companyKey] = {};
                    }

                    // Cek apakah jenis approval sudah ada di dalam company
                    if (!acc[companyKey][approvalKey]) {
                        acc[companyKey][approvalKey] = [];
                    }

                    // Push data berdasarkan level approval
                    acc[companyKey][approvalKey][item.level_approval] = item;

                    return acc;
                }, {});

                // Mencari level approval maksimal

                // Iterasi data yang sudah dikelompokkan
                for (const company in groupedData) {
                    for (const approvalType in groupedData[company]) {
                        const row = document.createElement('tr');

                        // Ambil data nama perusahaan dan jenis approval
                        const companyName = groupedData[company][approvalType][1]?.adm_company.name || "";
                        row.innerHTML = `<td class='fw-light text-center text-uppercase'>${companyName}</td><td class='fw-light text-center'>${approvalType}</td>`;

                        // Isi kolom berdasarkan level approval
                        for (let i = 1; i <= maxApprovalLevel; i++) {
                            const data = kapital(groupedData[company][approvalType][i]?.hrd_employee.fullname || "");
                            row.innerHTML += `<td class='fw-light text-center text-uppercase'>${data}</td>`;
                        }
                        const codeApprovalType = groupedData[company][approvalType][1]?.type_approval || ""
                        // Tambahkan tombol Edit
                        row.innerHTML += `<td class='fw-light text-center'><button title='${edit}' class="btn btn-primary" onclick="showModalUpdateApproval('${company}', '${codeApprovalType}')"><i class='fa-regular fa-pen-to-square'></i></button></td>`;

                        tableBody.appendChild(row);
                    }
                }
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
async function selectApprovalType() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "approvaltype/bylanguage"
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
                        responseData[i]["type_approval"] +
                        "'>" +
                        kapital(responseData[i]["adm_approval_type_translations"][0]["translation"]) +
                        "</option>";
                }
                mainOptionItem = `<option class='fw-light text-uppercase' selected disabled value=''>${kapital(select)}</option>`
                document.getElementById("approval").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/approval";
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
async function selectWorksite() {
    const worksite = document.getElementById("approval").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/approvalworksite"
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
        worksite_POST: worksite,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                subOptionItem = "";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" + responseData[i]["code_company"] + "'>" + kapital(responseData[i]["code_company"]) + " - " + kapital(responseData[i]["name"]) + "</option>";
                }
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                document.getElementById("worksite").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
async function selectEmployee() {
    const worksite = document.getElementById("approval").value
    // var element = document.querySelector("#approval")
    // var harga = element.options[element.selectedIndex].innerHTML;
    // alert(harga)
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "employee"
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
        worksite_POST: worksite,
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
                        responseData[i]["employee_id"] +
                        "'>" +
                        kapital(responseData[i]["fullname"]) +
                        "</option>";
                }
                mainOptionItem = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                document.getElementById("employee").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/employee_data";
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
var noRow = 1
async function selectApprovalStage() {
    const approval = document.getElementById("approval").value
    const worksite = document.getElementById("worksite").value
    const selectEmployeeID = document.getElementById("employee").value
    if (approval == "" || worksite == "" || selectEmployeeID == "") {
        return false
    }
    document.getElementById("approval").disabled = true
    document.getElementById("worksite").disabled = true
    var elementEmployee = document.querySelector("#employee")
    var employee = elementEmployee.options[elementEmployee.selectedIndex].innerHTML;
    var codeApprovalType = document.getElementById("approval").value
    var codeWorksite = document.getElementById("worksite").value
    var codeEmployee = document.getElementById("employee").value
    var newid = noRow++;
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];

    // Dapatkan jumlah baris saat ini untuk menentukan nomor urut berikutnya
    var rowCount = table.rows.length;
    var newid = rowCount + 1; // Nomor urut baru

    // Contoh data yang akan ditampilkan (kamu bisa ganti sesuai kebutuhan)
    // var employee = employee;

    // Buat elemen baris baru
    var row = table.insertRow();
    row.id = "row" + newid;
    // Masukkan nomor urut di kolom pertama
    var cell1 = row.insertCell(0);
    cell1.innerHTML = newid;
    cell1.className = 'text-center fw-light';

    // Masukkan data karyawan di kolom kedua
    var cell2 = row.insertCell(1);
    cell2.innerHTML = employee;
    cell2.className = 'text-center fw-light text-uppercase';
    // Masukkan tombol hapus di kolom ketiga
    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<button type='button'  title='" + trash + "' class='btn btn-danger' nama='" + employee + "' id='" + newid + "' onclick='deleteRow(this.id)'> <i class='fa-regular fa-trash-can'></i></button>";

    var cell4 = row.insertCell(3);
    cell4.innerHTML = codeApprovalType;
    cell4.hidden = true;

    var cell5 = row.insertCell(4);
    cell5.innerHTML = codeWorksite;
    cell5.hidden = true;

    var cell6 = row.insertCell(5);
    cell6.innerHTML = codeEmployee;
    cell6.hidden = true;
    await selectEmployee()
}
selectContent()