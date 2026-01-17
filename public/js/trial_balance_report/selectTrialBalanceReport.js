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
    await selectCompany();
    async function dataContent(data) {
        var filterLanguage = data.filter(filtercontent => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        // document.getElementById("titleModal").innerHTML = content["trial_balance"];
        document.getElementById("titlePage").innerHTML = content["trial_balance"];
        document.getElementById("codeCOAHead").innerHTML = content["coa_code"]
        document.getElementById("descriptionsHead").innerHTML = content["description"]
        document.getElementById("openingBalanceHead").innerHTML = content["opening_balance"]
        document.getElementById("debetHead").innerHTML = content["debit"]
        document.getElementById("creditHead").innerHTML = content["credit"]
        document.getElementById("endBalanceHead").innerHTML = content["end_balance"]
        document.getElementById("codeJournal").innerHTML = content["journal_code"]
        document.getElementById("date").innerHTML = content["date"]
        document.getElementById("worksite").innerHTML = content["worksite"]
        document.getElementById("codeCOA").innerHTML = content["coa_code"]
        document.getElementById("sequenceNumber").innerHTML = content["sequence_number"]
        document.getElementById("debit").innerHTML = content["debit"]
        document.getElementById("credit").innerHTML = content["credit"]
        document.getElementById("referenceCode").innerHTML = content["reference_code"]
        document.getElementById("descriptions").innerHTML = content["description"]
        document.getElementById("codePartner").innerHTML = content["code_partners"]
        document.getElementById("codeItem").innerHTML = content["code_item"]
    }
}
async function selectCompany(companyCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/type"
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
        companyType_POST: companyTypeCode,
        companyParent_POST: companyParent,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == companyCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != companyCode);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["code_company"] +
                        "'>" +
                        kapital(filternotSubData[i]["name"]) +
                        "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("companyHeader").innerHTML = mainOptionItem + "" + subOptionItem;
                document.getElementById("akun").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(hide_account) + "</option> <option value='1'>" + kapital(show) + "</option><option value='0'>" + kapital(no_show) + "</option>"
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/employee_data";
                // }, 3000);
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
async function selectWorksite(worksiteCode) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    var companyType = await JSON.parse(getCookie("dataCompany"));
    const companyTypeCode = companyType[0]["code_company_type"]
    const companyParent = companyType[0]["parent_code"]
    const companyCode = companyType[0]["code_company"]
   if (!token) {
        token = await getAccessToken(); 
    }
    var item = ""
    if (companyTypeCode == "Head") {
        item = "<option class='fw-light text-uppercase' value='all'>" + kapital(all) + "</option>";
    } else {
        item = ''
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/neraca"
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
        companyType_POST: companyTypeCode,
        companyParent_POST: companyParent,
        companyCode_POST: companyCode
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == worksiteCode);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != worksiteCode);
                mainOptionItem = "";
                subOptionItem = "";
                subOptionItemAll = item;
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += "<option class='fw-light text-uppercase' value='" + filternotSubData[i]["code_company"] + "'>" + kapital(filternotSubData[i]["name"]) + "</option>";
                }
                if (filterSubData == "" || filterSubData == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value='" + filterSubData[0]["code_company"] + "'>" + kapital(filterSubData[0]["name"]) + "</option>";
                }
                document.getElementById("locationHeader").innerHTML = mainOptionItem + subOptionItemAll + subOptionItem;
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
async function selectTrialBalance() {
    (function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "companyHeader": { required: true },
                            "locationHeader": { required: true },
                            "startDate": { required: true },
                            "akun": { required: true },
                        },
                        messages: {
                            "companyHeader": required,
                            "locationHeader": required,
                            "startDate": required,
                            "akun": required,
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

    const form = jQuery("#form2");
    const isValid = form.valid();
    if (!isValid) return false;

    await resetDataTables();
    document.getElementById("dataTable").innerHTML = "";
    document.getElementById("dataTableFoot").innerHTML = "";


    const language = JSON.parse(getCookie("language"));
    let token = JSON.parse(getCookie("dataToken"));
    const companyCode = document.getElementById("companyHeader").value;
    const worksite = document.getElementById("locationHeader").value;
    const akun = document.getElementById("akun").value;
    const startDate = yyyymm(document.getElementById("startDate").value);
    const endDate = yyyymm(document.getElementById("endDate").value);

    if (!token) await getAccessToken();

    const loadData = {
        language_POST: language,
        company_code_POST: companyCode,
        akun_POST: akun,
        worksite_POST: worksite,
        start_date_POST: startDate,
        end_date_POST: endDate,
    };

    document.getElementById("loadsearch").disabled = true;
    document.getElementById("loadsearch").innerHTML = `
        <div>
            <span class='input-group-text fw-semibold btn btn-primary'>
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
            </span>
        </div>`;

    try {
        const response = await fetch(mainUrl + "trialbalancereport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(loadData),
        });

        if (response.status === 404) throw new Error(status_404);
        if (response.status === 401) throw new Error(status_401);
        if (response.status === 500) throw new Error(status_500);

        const result = await response.json();

        if (result.access === "success") {
            const dataBalanceMonthly = result.data.dataBalanceMonthly;
            const dataCOAGlobal = result.data.dataCOAGlobal;

            const arrBalanceMonthly = dataBalanceMonthly.reduce((acc, current) => {
                const existingItem = acc.find(item => item.code_code === current.code_coa);

                if (existingItem) {
                    existingItem.debit += current.debit;
                    existingItem.credit += current.credit;
                } else {
                    acc.push({
                        code_code: current.code_coa,
                        descriptions: current.fat_coa.fat_coa_translations[0].translation,
                        opening_balance: current.opening_balance,
                        debit: current.debit,
                        credit: current.credit,
                        level: 5
                    });
                }

                return acc;
            }, []);
            const arrCOAGlobal = dataCOAGlobal.map(item => ({
                code_code: item.code_coa,
                descriptions: item.fat_coa_translations[0].translation,
                opening_balance: 0,
                debit: 0,
                credit: 0,
                level: item.level_coa
            }));

            const trialBalance = [...arrCOAGlobal, ...arrBalanceMonthly].sort((a, b) =>
                a.code_code.localeCompare(b.code_code)
            );

            let tableItem = "";
            for (let i = 0; i < trialBalance.length; i++) {
                const item = trialBalance[i];
                let colortable = "bg-gray-lighter";
                if (item.level === 1) colortable = "bg-xpro-lighter";
                else if (item.level === 2) colortable = "bg-gray";
                else if (item.level === 3) colortable = "bg-xdream-lighter";
                else if (item.level === 4) colortable = "bg-gray-light";

                const closingBalance = parseFloat(item.opening_balance) + parseFloat(item.debit) - parseFloat(item.credit);

                tableItem += `
                    <tr company='${companyCode}' worksite='${worksite}' starDate='${startDate}' endDate='${endDate}' id='${item.code_code}' onclick='showModalSelectTrialBalance(this)' class='clickable-row'>
                        <td class='fw-light text-uppercase ${colortable}'>${item.code_code}</td>
                        <td class='fw-light text-uppercase ${colortable}'>${item.descriptions}</td>
                        <td class='fw-light text-end ${colortable}'>${formatAccounting(item.opening_balance)}</td>
                        <td class='fw-light text-end ${colortable}'>${formatAccounting(item.debit)}</td>
                        <td class='fw-light text-end ${colortable}'>${formatAccounting(item.credit)}</td>
                        <td class='fw-light text-end ${colortable}'>${formatAccounting(closingBalance)}</td>
                    </tr>`;
            }

            const totalOpen = trialBalance.reduce((sum, item) => sum + item.opening_balance, 0);
            const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
            const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);
            const totalEnd = totalOpen + totalDebit - totalCredit;

            let tableItemFoot = `
                    <tr>
                      <td id="subtotalFoot" class="text-center text-uppercase" colspan="2">${total}</td>
                      <td id="totalOpen" class="text-end text-uppercase">${formatAccounting(totalOpen)}</td>
                      <td id="totalDebit" class="text-end text-uppercase">${formatAccounting(totalDebit)}</td>
                      <td id="totalCredit" class="text-end text-uppercase">${formatAccounting(totalCredit)}</td>
                      <td id="totalEnd" class="text-end text-uppercase">${formatAccounting(totalEnd)}</td>
                    </tr>`

            document.getElementById("dataTable").innerHTML = tableItem;
            document.getElementById("dataTableFoot").innerHTML = tableItemFoot;
            document.getElementById("doc").hidden = false;
            document.getElementById("loadsearch").innerHTML = `
                <span onclick='selectTrialBalance()' class='input-group-text fw-semibold btn btn-primary'>
                    <i class='fa-solid fa-magnifying-glass'></i>
                </span>`;
            await table();

        } else if (result.access === "failed") {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: result.message,
            });
            setTimeout(() => window.location.href = "/trial_balance_report", 3000);
        }

    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:error.message || overload,
        });
        setTimeout(() => window.location.href = "/", 3000);
    }

    return false;
}
async function showModalSelectTrialBalance(el) {
    await resetDataTables()
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalTrialBalace"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalTrialBalace"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("dataTableItem").innerHTML = "";
    let language = await JSON.parse(getCookie("language"));
    const id = el.id;
    const starDate = el.getAttribute('starDate');
    const endDate = el.getAttribute('endDate');
    const worksite = el.getAttribute('worksite');
    const company = el.getAttribute('company');
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "journal"
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
        code_coa_POST: id,
        start_date_POST: starDate,
        end_date_POST: endDate,
        worksite_POST: worksite,
        company_code_POST: company,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                let tableItem = "";
                let totalCredit = 0;
                let totalDebit = 0;
                for (let i = 0; i < responseData.length; i++) {
                    const item = responseData[i];
                    if (item.dk_code === 'C') {
                        totalCredit += item.amount;
                    }
                    if (item.dk_code === 'D') {
                        totalDebit += item.amount;
                    }
                    let textBold = ""
                    if (item.code_coa === id) {
                        textBold = "fw-bold"
                    }
                    tableItem += `
                        <tr>
                            <td class='fw-light text-uppercase'>${item.code_journal}</td>
                            <td class='fw-light text-uppercase'>${ddmmyyyy(item.date)}</td>
                            <td class='fw-light text-uppercase'>${item.worksite}</td>
                            <td class='fw-light text-uppercase' title='${item.fat_coa.fat_coa_translations[0].translation}'>${item.code_coa}</td>
                            <td class='fw-light text-uppercase'>${item.sequence_number}</td>
                            <td class='fw-light text-end ${textBold}'> ${item.dk_code === 'D' ? formatAccounting(item.amount) : formatAccounting(0)}</td>
                            <td class='fw-light text-end ${textBold}'>${item.dk_code === 'C' ? formatAccounting(item.amount) : formatAccounting(0)}</td>
                            <td class='fw-light text-uppercase'>${item.reference_code}</td>
                            <td class='fw-light text-uppercase'>${item.description}</td>
                            <td class='fw-light text-uppercase'>${item.code_partners}</td>
                            <td class='fw-light text-end'>${item.code_item}</td>
                        </tr>`;
                }
                let tableItemFoot = `
                <tr>
                  <td class="text-center text-uppercase" colspan="5">${total}</td>
                  <td class="text-end text-uppercase">${formatAccounting(totalDebit)}</td>
                  <td class="text-end text-uppercase">${formatAccounting(totalCredit)}</td>
                  <td colspan="4"></td>
                </tr>`
                document.getElementById("dataTableItem").innerHTML = tableItem;
                document.getElementById("dataTableFootItem").innerHTML = tableItemFoot;
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>"
                document.getElementById("docDetail").setAttribute("data-id", el.id);
                document.getElementById("docDetail").setAttribute("data-starDate", el.getAttribute("starDate"));
                document.getElementById("docDetail").setAttribute("data-endDate", el.getAttribute("endDate"));
                document.getElementById("docDetail").setAttribute("data-worksite", el.getAttribute("worksite"));
                document.getElementById("docDetail").setAttribute("data-company", el.getAttribute("company"));

                await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>"
                // setTimeout(function () {
                //     window.location.href = "/trial_balance_report";
                // }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
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
async function selectTrialBalanceToExcel() {
    document.getElementById("doc").innerHTML = "<a class='btn' type='button' disabled><span class='spinner-border text-success' role='status' aria-hidden='true'></span></a>"

    const language = JSON.parse(getCookie("language"));
    let token = JSON.parse(getCookie("dataToken"));
    const companyCode = document.getElementById("companyHeader").value;
    const worksite = document.getElementById("locationHeader").value;
    const akun = document.getElementById("akun").value;
    const startDate = yyyymm(document.getElementById("startDate").value);
    const endDate = yyyymm(document.getElementById("endDate").value);

    if (!token) await getAccessToken();

    const loadData = {
        language_POST: language,
        company_code_POST: companyCode,
        akun_POST: akun,
        worksite_POST: worksite,
        start_date_POST: startDate,
        end_date_POST: endDate,
    };

    try {
        const response = await fetch(mainUrl + "trialbalancereport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(loadData),
        });

        if (response.status === 404) throw new Error(status_404);
        if (response.status === 401) throw new Error(status_401);
        if (response.status === 500) throw new Error(status_500);

        const result = await response.json();

        if (result.access === "success") {
            const dataBalanceMonthly = result.data.dataBalanceMonthly;
            const dataCOAGlobal = result.data.dataCOAGlobal;

            const arrBalanceMonthly = dataBalanceMonthly.reduce((acc, current) => {
                const existingItem = acc.find(item => item.code_code === current.code_coa);

                if (existingItem) {
                    existingItem.debit += current.debit;
                    existingItem.credit += current.credit;
                } else {
                    acc.push({
                        code_code: current.code_coa,
                        descriptions: current.fat_coa.fat_coa_translations[0].translation,
                        opening_balance: current.opening_balance,
                        debit: current.debit,
                        credit: current.credit,
                        level: 5
                    });
                }

                return acc;
            }, []);

            const arrCOAGlobal = dataCOAGlobal.map(item => ({
                code_code: item.code_coa,
                descriptions: item.fat_coa_translations[0].translation,
                opening_balance: 0,
                debit: 0,
                credit: 0,
                level: item.level_coa
            }));

            const trialBalance = [...arrCOAGlobal, ...arrBalanceMonthly].sort((a, b) =>
                a.code_code.localeCompare(b.code_code)
            );
            await trialBalanceToExcel(trialBalance)
        } else if (result.access === "failed") {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: result.message,
            });
            setTimeout(() => window.location.href = "/trial_balance_report", 3000);
        }

    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:error.message || overload,
        });
        setTimeout(() => window.location.href = "/", 3000);
    }
    return false;
}
async function trialBalanceToExcel(trialBalance) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));

   if (!token) {
        token = await getAccessToken(); 
    }
    const formData = new FormData();
    const loadData = {
        language_POST: language,
        trial_balance_POST: trialBalance
    };
    const jsonBlob = new Blob([JSON.stringify(loadData)], { type: 'application/json' });
    formData.append("data", jsonBlob); // Kirim sebagai 'data'

    const xhr = new XMLHttpRequest();
    const url = secondUrl + "trialbalance";
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

    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["access"] === "success") {
                const responseData = response["data"];
                setTimeout(() => {
                    const fileUrl = `file/trialbalance/${responseData}`;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = responseData;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    document.getElementById("doc").innerHTML = "<button onclick='selectTrialBalanceToExcel()' class='btn' href='#'><img class='' style='width:35px;' src='file/icon/xls.png'></button>"
                }, 3000);
            } else {
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: response["message"] || "Gagal memproses permintaan.",
                });
                setTimeout(() => window.location.href = "/trial_balance_report", 3000);
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
async function selectTrialBalanceToExcelDetail() {
    document.getElementById("docDetail").innerHTML = "<a class='btn' type='button' disabled><span class='spinner-border text-success' role='status' aria-hidden='true'></span></a>"
    let token = await JSON.parse(getCookie("dataToken"));
    const docDetail = document.getElementById("docDetail");
    const id = docDetail.getAttribute("data-id");
    const starDate = docDetail.getAttribute("data-starDate");
    const endDate = docDetail.getAttribute("data-endDate");
    const worksite = docDetail.getAttribute("data-worksite");
    const company = docDetail.getAttribute("data-company");

    let language = await JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "journal"
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
        code_coa_POST: id,
        start_date_POST: starDate,
        end_date_POST: endDate,
        worksite_POST: worksite,
        company_code_POST: company,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                await trialBalanceToExcelDetail(responseData)
                // let tableItem = "";
                // let totalCredit = 0;
                // let totalDebit = 0;
                // for (let i = 0; i < responseData.length; i++) {
                //     const item = responseData[i];
                //     if (item.dk_code === 'C') {
                //         totalCredit += item.amount;
                //     }
                //     if (item.dk_code === 'D') {
                //         totalDebit += item.amount;
                //     }
                //     tableItem += `
                //         <tr>
                //             <td class='fw-light text-uppercase'>${item.code_journal}</td>
                //             <td class='fw-light text-uppercase'>${ddmmyyyy(item.date)}</td>
                //             <td class='fw-light text-uppercase'>${item.worksite}</td>
                //             <td class='fw-light text-uppercase' title='${item.fat_coa.fat_coa_translations[0].translation}'>${item.code_coa}</td>
                //             <td class='fw-light text-uppercase'>${item.sequence_number}</td>
                //             <td class='fw-light text-end'> ${item.dk_code === 'D' ? formatAccounting(item.amount) : formatAccounting(0)}</td>
                //             <td class='fw-light text-end'>${item.dk_code === 'C' ? formatAccounting(item.amount) : formatAccounting(0)}</td>
                //             <td class='fw-light text-uppercase'>${item.reference_code}</td>
                //             <td class='fw-light text-uppercase'>${item.description}</td>
                //             <td class='fw-light text-uppercase'>${item.code_partners}</td>
                //             <td class='fw-light text-end'>${item.code_item}</td>
                //         </tr>`;
                // }
                // let tableItemFoot = `
                // <tr>
                //   <td class="text-center text-uppercase" colspan="5">${total}</td>
                //   <td class="text-end text-uppercase">${formatAccounting(totalDebit)}</td>
                //   <td class="text-end text-uppercase">${formatAccounting(totalCredit)}</td>
                //   <td colspan="4"></td>
                // </tr>`
                // document.getElementById("dataTableItem").innerHTML = tableItem;
                // document.getElementById("dataTableFootItem").innerHTML = tableItemFoot;
                // document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>"
                // await table();
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                // setTimeout(function () {
                //     window.location.href = "/trial_balance_report";
                // }, 3000);
            }
        } if (this.status == 404) {
            message = "Data failed";
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
async function trialBalanceToExcelDetail(responseData) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));

   if (!token) {
        token = await getAccessToken(); 
    }
    const formData = new FormData();
    const loadData = {
        language_POST: language,
        journal_POST: responseData
    };
    const jsonBlob = new Blob([JSON.stringify(loadData)], { type: 'application/json' });
    formData.append("data", jsonBlob); // Kirim sebagai 'data'

    const xhr = new XMLHttpRequest();
    const url = secondUrl + "journal";
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

    xhr.onloadend = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(xhr.response);
            if (response["access"] === "success") {
                const responseData = response["data"];
                setTimeout(() => {
                    const fileUrl = `file/journal/${responseData}`;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = responseData;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    document.getElementById("docDetail").innerHTML = "<button onclick='selectTrialBalanceToExcelDetail()' class='btn' href='#'><img class='' style='width:35px;' src='file/icon/xls.png'></button>"
                }, 3000);
            } else {
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: response["message"] || "Gagal memproses permintaan.",
                });
                setTimeout(() => window.location.href = "/trial_balance_report", 3000);
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