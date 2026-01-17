async function showDataHarvestActivityDetatil(rowId) {
    const worksite = document.getElementById("estateHeader").value
    const row = document.getElementById(rowId);
    if (!row) {
        console.error("Row tidak ditemukan untuk ID:", rowId);
        return;
    }
    const cells = row.cells;
    const nameEmployee = cells[1].innerText;
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
    // penalty cells bisa lebih dari 1 → ambil slice
    const penaltyCells = Array.from(cells).slice(14, cells.length - 3);
    const penaltyValues = penaltyCells.map(cell => cell.innerHTML);
    const totalPenaltyNominal = cells[cells.length - 3].innerText;
    const totalIncome = cells[cells.length - 2].innerText;
    const idEmployee = cells[cells.length - 1].innerText;
    await selectBlock(worksite, block)
    await selectEmployee(idEmployee)


    const elements = document.getElementsByName("penalty[]");
    Array.from(elements).forEach((element, i) => {
        element.value = penaltyValues[i] || ""; // isi value dari cell
    });
    document.getElementById("workResultsHeader").value = workResults;
    document.getElementById("harvestAreaHeader").value = harvestArea;
    document.getElementById("brondolanHeader").value = brondolan;
    document.getElementById("loadData").innerHTML = `<a title="Add" type="submit" onclick="updateHarvestActivityDetatil('${rowId}')" class="btn btn-primary"><i class="fa-solid fa-plus"></i></a>`;
    // dst sesuai kebutuhan
}
async function updateHarvestActivityDetatil(rowId) {
    let row = document.getElementById(rowId);
    if (row) {
        row.remove();
    }
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
                    jQuery("#formHarvestActivityDetail").validate({
                        ignore: [],
                        rules: {
                            "blockHeader": { required: true },
                            "employeeHeader": { required: true },
                            "workResultsHeader": { required: true, min: 1 }, // tidak boleh 0
                            "harvestAreaHeader": { required: true, min: 1 }
                        },
                        messages: {
                            "workResultsHeader": required,
                            "harvestAreaHeader": required,
                            "blockHeader": required,
                            "employeeHeader": required,
                        },
                    });
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
    // === CEK VALIDASI KEDUA FORM ===
    const formHeader = jQuery("#formHarvestActivityHeader");
    const formDetail = jQuery("#formHarvestActivityDetail");

    // validasi kedua form
    const isValidHeader = formHeader.valid();
    const isValidDetail = formDetail.valid();

    if (!isValidHeader || !isValidDetail) {
        return false; // hentikan proses kalau salah satu invalid
    }

    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    const language = await JSON.parse(getCookie("language"));
    const dataCompany = await JSON.parse(getCookie("dataCompany"));
    const companyParent = dataCompany[0]["parent_code"]
    const createDate = yyyymmdd(document.getElementById("createDateHeader").value);
    const estate = document.getElementById("estateHeader").value;
    const block = document.getElementById("blockHeader").value;
    const employee = document.getElementById("employeeHeader").value;
    const workResults = document.getElementById("workResultsHeader").value;
    const harvestArea = document.getElementById("harvestAreaHeader").value;
    const brondolan = document.getElementById("brondolanHeader").value;
    const elements = document.getElementsByName("penalty[]");
    var valuesPenalty = [];
    var valuesCode = [];
    let valuesNominal = [];

    Array.from(elements).forEach(element => {
        valuesPenalty.push(element.value);
        valuesCode.push(element.getAttribute("code")); // ambil attribute code
        valuesNominal.push(element.getAttribute("nominal")); // ambil attribute code
    });
    let resultsPenalty = valuesNominal.map((nominal, index) => {
        let penalty = valuesPenalty[index];
        return parseFloat(nominal) * parseFloat(penalty);
    });
    const resultPenalty = Object.fromEntries(
        valuesCode.map((code, index) => [code, valuesPenalty[index]])
    );
    var totalPenalty = resultsPenalty.reduce((acc, curr) => acc + curr, 0);
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/attribute";
    xhr.onloadstart = function () {
        document.getElementById("loadData").innerHTML = `<div  class=''><span class='input-group-text fw-semibold btn btn-primary'><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span></span><div>`
    };
    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message: overload
        });
        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        estate_POST: estate,
        block_POST: block,
        employee_id_POST: employee,
        date_POST: createDate,
        company_parent_POST: companyParent,
    });
    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                const nameEmployee = responseData["dataBasicSalary"][0]["hrd_employee"]["fullname"]
                const idEmployee = responseData["dataBasicSalary"][0]["employee_id"]
                const plantingYear = responseData["dataBlockmaster"][0]["planting_year"]
                const basicFFB = responseData["dataHarvestIncentive"][0]["harvest_basis_ffb"]
                const haverstBasicI = responseData["dataHarvestIncentive"][0]["harvest_basis_i_ffb"]
                const haverstBasicII = responseData["dataHarvestIncentive"][0]["harvest_basis_ii_ffb"]
                const extraBasisBonus = responseData["dataHarvestIncentive"][0]["extra_basis_bonus"]
                const extraBasisBonusI = responseData["dataHarvestIncentive"][0]["extra_basis_bonus_i"]
                const extraBasisBonusII = responseData["dataHarvestIncentive"][0]["extra_basis_bonus_ii"]
                const averageBunchRate = responseData["dataAverageBunchRate"][0]["average_bunch_rate"]
                const extraBrondolanBonus = responseData["dataHarvestIncentive"][0]["loose_fruit_bonus"]
                const basicSalary = parseFloat(responseData["dataBasicSalary"][0]["nominal"])
                const tonaseKilogram = parseFloat(workResults) * parseFloat(averageBunchRate)
                const incentiveBasic = workResults >= basicFFB ? (responseData["dataHarvestIncentive"][0]["basis_bonus"]) : 0;
                const bonusBrondolan = parseFloat(brondolan) * parseFloat(extraBrondolanBonus)
                const penaltyBasic = workResults < basicFFB ? basicSalary * (1 - (workResults / basicFFB)) : 0;
                const totalPenaltyNominal = penaltyBasic + totalPenalty

                let bonusBasic = 0;

                if (haverstBasicI !== 0) {
                    if (workResults >= haverstBasicII) {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonusII;
                    } else if (workResults >= haverstBasicI) {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonusI;
                    } else {
                        bonusBasic = (workResults - basicFFB) * extraBasisBonus;
                    }
                } else {
                    bonusBasic = (workResults - basicFFB) * extraBasisBonus;
                }
                bonusBasic = Math.max(0, bonusBasic);
                const totalIncome = (basicSalary + incentiveBasic + bonusBasic + bonusBrondolan) - totalPenaltyNominal
                const dataHarvest = [{ nameEmployee, block, plantingYear, basicFFB, averageBunchRate, harvestArea, workResults, brondolan, tonaseKilogram, basicSalary, incentiveBasic, bonusBasic, bonusBrondolan, ...resultPenalty, totalPenaltyNominal, totalIncome, idEmployee, estate }];

                dataHarvest.forEach((data, index) => {
                    // ambil hanya key penalty (DPxx)
                    const penalties = Object.fromEntries(
                        Object.entries(data).filter(([key]) => key.startsWith("DP"))
                    );

                    addRow(
                        index,
                        data.nameEmployee,
                        data.block,
                        data.plantingYear,
                        data.basicFFB,
                        data.averageBunchRate,
                        data.harvestArea,
                        data.workResults,
                        data.brondolan,
                        data.tonaseKilogram,
                        data.basicSalary,
                        data.incentiveBasic,
                        data.bonusBasic,
                        data.bonusBrondolan,
                        penalties,
                        data.totalPenaltyNominal,
                        totalIncome,
                        idEmployee,
                        estate
                    );
                });
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                    message: message
                });
                // setTimeout(function () {
                //     window.location.href = "/harvest_penalty";
                // }, 3000);
            }
        }
        if (this.status == 404) {
            message = "data failed to load";
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_404
            });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 401) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_401
            });
            setTimeout(function () {
                window.location.href = "/";
            }, 3000);
        }
        if (this.status == 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                message: status_500
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
async function showUpdateHarvestActivity(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/code"
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
        code_POST: code,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            await resetDataTables()
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("createDateHeader").value = ddmmyyyy(responseData[0]["date"])
                const estate = responseData[0]["worksite"]
                details = responseData[0]["details"]
                selectHarvestType(responseData[0]["details"][0]["is_cash_payment"])
                selectEstate(estate)
                selectBlock(estate, code)
                selectMandor(responseData[0]["foreman"])
                selectMandor1(responseData[0]["foreman_1"])
                selectKeraniDivisi(responseData[0]["division_clerk"])
                selectKeraniTransport(responseData[0]["loading_clerk"])
                details.forEach((data, index) => {
                    const penalties = data.penalties; // langsung ambil object DPxx

                    addRow(
                        index,
                        data.hrd_employee.fullname,
                        data.code_company,
                        data.planting_year,
                        data.basis_bunch,
                        data.average_bunch_weight,
                        data.harvest_area,
                        data.work_result,
                        data.loose_fruit_weight,
                        data.work_result_kg,
                        data.wage,
                        data.over_basis_incentive,
                        data.premium_wage,
                        data.loose_fruit_premium,
                        penalties,                // ⬅️ kirim object penalties
                        data.penalty_wage,        // total penalty nominal
                        data.total_income,
                        data.employee_id,
                        estate                   // estate (sesuaikan dengan data)
                    );
                });
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/basic_salary";
                }, 3000);
            }
        }
        if (this.status == 404) {
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
async function updateHarvestActivity(el) {
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
    const username = dataLogin["username"]
    const employeeID = dataLogin["idEmployee"]
    const code = el.getAttribute('code')
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
    const code_Header = JSON.parse('{"code_POST":"' + code + '"}');
    const employeeID_Header = JSON.parse('{"employee_id_POST":"' + employeeID + '"}');
    const type_Header = JSON.parse('{"type_POST":"' + type + '"}');
    const createDate_Header = JSON.parse('{"create_date_POST":"' + createDate + '"}');
    const estate_Header = JSON.parse('{"estate_POST":"' + estate + '"}');
    const foreman_Header = JSON.parse('{"foreman_POST":"' + foreman + '"}');
    const foreman1_Header = JSON.parse('{"foreman1_POST":"' + foreman1 + '"}');
    const divisionCler_Header = JSON.parse('{"division_clerk_POST":"' + divisionClerk + '"}');
    const transportClerk_Header = JSON.parse('{"transport_clerk_POST":"' + transportClerk + '"}');

    $.extend(
        language_Header,
        code_Header,
        username_Header,
        employeeID_Header,
        type_Header,
        createDate_Header,
        estate_Header,
        foreman_Header,
        foreman1_Header,
        divisionCler_Header,
        transportClerk_Header,
        { detail }
    );

    dataHaverst.push(language_Header);

    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/update";
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
async function showModalPostingHarvestActivityByCode(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <a id ='" + param + "' type='submit' onclick='postingHarvestActivityByCode(id)' class='btn  btn-primary'>" + kapital(done) + "</a>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function postingHarvestActivityByCode(id) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const employeeID = dataLogin["idEmployee"]
    var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "estateactivity/posting"
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
            message: overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_POST: id,
        username_POST: username,
        employeeID_POST: employeeID
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/harvest_activities";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/harvest_activities";
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