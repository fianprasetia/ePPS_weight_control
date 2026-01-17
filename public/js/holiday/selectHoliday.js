selectContent()
async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();

    await dataContent(jsonData);
    await showLayoutListData()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["holiday"]
        document.getElementById("dateThead").innerHTML = filterLanguage[0]["content"]["date"]
        document.getElementById("descriptionThead").innerHTML = filterLanguage[0]["content"]["description"]
        document.getElementById("typeThead").innerHTML = filterLanguage[0]["content"]["type"]
        document.getElementById("yearsThead").innerHTML = filterLanguage[0]["content"]["year"]
        document.getElementById("actionThead").innerHTML = filterLanguage[0]["content"]["actions"]
        // document.getElementById("locationHeader").innerHTML = filterLanguage[0]["content"]["worksite"]
        // document.getElementById("employeeTypeHeader").innerHTML = filterLanguage[0]["content"]["employee_type"]
        // document.getElementById("periodDateHeader").innerHTML = filterLanguage[0]["content"]["period"]
        // document.getElementById("idEmployeeThead").innerHTML = filterLanguage[0]["content"]["employee_id"]
        // document.getElementById("nameThead").innerHTML = filterLanguage[0]["content"]["fullname"]
        // document.getElementById("jobTitleThead").innerHTML = filterLanguage[0]["content"]["job_title"]
        // document.getElementById("typeThead").innerHTML = filterLanguage[0]["content"]["employee_type"]
        // document.getElementById("nominalThead").innerHTML = filterLanguage[0]["content"]["amount"]
    }
}
async function showLayoutUpdateData(id) {
    document.getElementById('periodDateHeader').disabled = true;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = true
    document.getElementById("formHoliday").reset()
    document.getElementById("holidaysTbody").innerHTML = "";
    await new Promise(resolve => setTimeout(resolve, 0));
    await showUpdateHoliday(id)
    await Promise.all([
        // selectCOA(),
        // selectDepartment(),
        // selectAsset()
    ]);

    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
}
async function showLayoutCreateData(id) {
    document.getElementById('periodDateHeader').disabled = false;
    document.getElementById('createData').hidden = false;
    document.getElementById('listData').hidden = true;
    document.getElementById("loadsearch").hidden = false
    document.getElementById("formHoliday").reset()
    // document.getElementById("averageBunchRateItemData").innerHTML = "";
    document.getElementById("load").innerHTML = ""
    // document.getElementById("divisiHeader").innerHTML = "";
    await Promise.all([
        // selectHoliday(),
        // selectTreeClass(),
        // selectActivityType(),
        // selectSoilCode(),
        // selectSoilClassification(),
        // selectTopologi(),
        // selectNucleusPlasma(),
        // selectSeedType()
    ]);
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;

}
async function showLayoutListData() {
    await selectHolidayDate();
    document.getElementById("listData").hidden = false;
    document.getElementById('createData').hidden = true;
    document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function selectHolidayDate() {
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    const language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "holiday";
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message: overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            await resetDataTables()
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    const period = responseData[i]["period"];
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + no + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["period"] + "</td>\
                            <td class='fw-light text-center'><button title='posting' type='button' id='" + no + "' period ='" + period + "' onclick='showLayoutUpdateData(this)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button></td>\
                        </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                    message: message,
                });
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
                document.getElementById("dataTable").innerHTML = ""
                await table();
            }
        }
        if (this.status == 404) {
            message = "Data failed";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_401,
            });
            setTimeout(async function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500,
            });
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
async function selectHoliday() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHoliday").validate({
                        ignore: [],
                        rules: {
                            "periodDateHeader": { required: !0 },
                        },
                        messages: {
                            "periodDateHeader": required,
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
    const form = jQuery("#formHoliday");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    await resetDataTables()
    const periodDate = document.getElementById("periodDateHeader").value
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "holiday"
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
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        period_POST: periodDate,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                console.log(responseData)
                responseData.forEach((day, index) => {
                    addRow(
                        index + 1, // urutan baris
                        day.date,
                        day.name,
                        day.type
                    );
                });
                document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='selectEmployee()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-list'></i>\
                </span>"
                document.getElementById("holidaysThead").hidden = false
                document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' onclick='insertHolidays()' class='btn  btn-primary'>" + kapital(process) + "</a>";
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/basic_salary";
                }, 3000);
            }
        } if (this.status == 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(async function () {
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
async function addRow(index, date, name, type) {
    const table = document
        .getElementById("holidaysThead")
        .getElementsByTagName("tbody")[0];
    var rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.id = "row" + index;

    const noRow = row.insertCell(0);
    noRow.innerHTML = rowCount;
    noRow.className = "text-center fw-light text-uppercase";
    noRow.style.width = "5%";

    const dateRow = row.insertCell(1);
    dateRow.innerHTML = `<input type="text" class="js-flatpickr form-control fw-light text-center dateHolidays" id="dateHolidays" value="${ddmmyyyy(date)}" name="dateHolidays[]" data-date-format="d-m-Y">`;
    dateRow.className = "text-center fw-light text-uppercase";

    const nameRow = row.insertCell(2);
    nameRow.innerHTML = `<input type="text" class="form-control text-center fw-light text-uppercase" id="description" value="${name}" name="description[]" style="width:100%;">`;
    nameRow.className = "text-center fw-light text-uppercase";

    const typeRow = row.insertCell(3);
    typeRow.innerHTML = type;
    typeRow.className = "text-center  fw-light text-uppercase";


    // const nominalRow = row.insertCell(4);
    // nominalRow.innerHTML = `<div class='btn-group'><a type='button' id =${rowCount} date="${date}" onclick='showModalUpdateDepartment(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div>`;
    // nominalRow.className = "fw-light text-center";
    // nominalRow.style.width = "20%";

    $(".dateHolidays").datepicker({
        format: "dd-mm-yyyy",
        autoclose: true,
        todayHighlight: true
    });

}