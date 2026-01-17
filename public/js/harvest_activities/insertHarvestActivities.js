async function insertHarvestActivity() {
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#formHarvestActivityHeader").validate({
                        ignore: [],
                        rules: {
                            "typeHeader": { required: true },
                            "createDateHeader": { required: true },
                            "estateHeader": { required: true },
                        },
                        messages: {
                            "typeHeader": required,
                            "createDateHeader": required,
                            "estateHeader": required,
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
    const form = jQuery("#formHarvestActivityHeader");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const parentCompany = dataCompany["parent_code"]
    const createDate = yyyymmdd(document.getElementById("createDateHeader").value);
    const type = document.getElementById("typeHeader").value;
    const estate = document.getElementById("estateHeader").value;
    const foreman = document.getElementById("mandorHeader").value;
    const foreman1 = document.getElementById("mandor1Header").value;
    const divisionClerk = document.getElementById("divisionClerkHeader").value;
    const transportClerk = document.getElementById("transportClerkHeader").value;
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const dataHaverst = [];
    const detail = [];
    const table = document.getElementById("haverstActivityDataThead").getElementsByTagName("tbody")[0];
    const rows = table.rows;

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells; // <--- WAJIB ada
        const block = cells[2].innerText;
        const plantingYear = cells[3].innerText;
        const basicFFB = cells[4].innerText;
        const averageBunchRate = cells[5].innerText;
        const harvestArea = cells[6].innerText;
        const workResults = cells[7].innerText;
        const brondolan = cells[8].innerText;
        const tonaseKilogram = cells[9].innerText;
        const basicSalary = cells[10].innerText;
        const incentiveBasic = cells[11].innerText;
        const bonusBasic = cells[12].innerText;
        const bonusBrondolan = cells[13].innerText;

        const penaltyCells = Array.from(cells).slice(14, cells.length - 3);
        const penaltyValues = penaltyCells.map(cell => cell.innerHTML);

        const totalPenaltyNominal = cells[cells.length - 3].innerText;
        const totalIncome = cells[cells.length - 2].innerText;
        const idEmployee = cells[cells.length - 1].innerText;

        detail.push({
            block_POST: block,
            planting_year_POST: plantingYear,
            basic_ffb_POST: basicFFB,
            average_bunch_rate_POST: averageBunchRate,
            harvest_area_POST: harvestArea,
            work_results_POST: workResults,
            brondolan_POST: brondolan,
            tonase_kilogram_POST: tonaseKilogram,
            basic_salary_POST: unformatRupiah(basicSalary),
            incentive_basic_POST: unformatRupiah(incentiveBasic),
            bonusBasic_POST: unformatRupiah(bonusBasic),
            bonus_brondolan_POST: unformatRupiah(bonusBrondolan),
            penalty_values_POST: penaltyValues,
            total_penalty_nominal_POST: unformatRupiah(totalPenaltyNominal),
            total_income_POST: unformatRupiah(totalIncome),
            id_employee_POST: idEmployee
        });
    }

    const language_Header = JSON.parse('{"language_POST":"' + language + '"}');
    const username_Header = JSON.parse('{"username_POST":"' + username + '"}');
    const employeeID_Header = JSON.parse('{"employee_id_POST":"' + employeeID + '"}');
    const type_Header = JSON.parse('{"type_POST":"' + type + '"}');
    const createDate_Header = JSON.parse('{"create_date_POST":"' + createDate + '"}');
    const estate_Header = JSON.parse('{"estate_POST":"' + estate + '"}');
    const parentCompany_Header = JSON.parse('{"company_code_POST":"' + parentCompany + '"}');
    const foreman_Header = JSON.parse('{"foreman_POST":"' + foreman + '"}');
    const foreman1_Header = JSON.parse('{"foreman1_POST":"' + foreman1 + '"}');
    const divisionCler_Header = JSON.parse('{"division_clerk_POST":"' + divisionClerk + '"}');
    const transportClerk_Header = JSON.parse('{"transport_clerk_POST":"' + transportClerk + '"}');

    $.extend(
        language_Header,
        username_Header,
        employeeID_Header,
        type_Header,
        createDate_Header,
        estate_Header,
        parentCompany_Header,
        foreman_Header,
        foreman1_Header,
        divisionCler_Header,
        transportClerk_Header,
        { detail }
    );

    dataHaverst.push(language_Header);

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/insert";
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
            icon: "fa fa-exclamation me-1",
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify(dataHaverst);
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
                    window.location.href = "/harvest_activities";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    icon: "fa fa-times me-1",
                    message: message,
                });
                setTimeout(function () {
                    window.location.href = "/harvest_activities";
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