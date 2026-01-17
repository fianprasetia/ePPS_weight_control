async function showModalUpdateActivity(param) {
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        token = await JSON.parse(getCookie("dataToken")); // Ambil ulang setelah refresh token
        if (token == null) {
            return;
        }
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalActivity"), { keyboard: false });
    myModal.toggle();
    await selectLanguage();
    let language = await JSON.parse(getCookie("language"));
    const url = mainUrl + "activity/bycode";
    const data = {
        code_activity_POST: param,
        language_POST: language
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data)
        });
        if (response.status === 200) {
            const responseData = await response.json();

            if (responseData["access"] === "success") {
                const responseContent = responseData["data"];
                document.getElementById("codeActivitiType").disabled = true;
                codeActivitiType = responseContent[0]["code_activity_type"];
                codeCOA = responseContent[0]["code_coa"];
                uom = responseContent[0]["uom"];
                let status = responseContent[0]["status"];

                await selectUOM(uom);
                await selectActivityType(codeActivitiType);
                await selectCOA(codeActivitiType, codeCOA);

                let languageData = responseContent[0]["adm_activity_translations"];
                for (let i = 0; i < languageData.length; i++) {
                    document.getElementById("language" + i).value = languageData[i]["translation"];
                }

                mainOptionStatus = `<option class='fw-light text-uppercase' value="${status}">${status == "1" ? kapital(active) : kapital(nonactive)}</option>`;
                optionStatus = `<option class='fw-light text-uppercase' value="${status != "1" ? "1" : "0"}">${status != "1" ? kapital(active) : kapital(nonactive)}</option>`;
                document.getElementById("status").innerHTML = mainOptionStatus + optionStatus;

                mainOptionPremi = `<option class='fw-light text-uppercase' value="${status}">${status == "1" ? kapital(active) : kapital(nonactive)}</option>`;
                optionPremi = `<option class='fw-light text-uppercase' value="${status != "0" ? "1" : "0"}">${status != "1" ? kapital(nonactive) : kapital(active)}</option>`;
                document.getElementById("selectpremi").innerHTML = mainOptionPremi + optionPremi;

                document.getElementById("load").innerHTML = `<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>${cancel}</a> <a id='${param}' type='submit' onclick='updateActivity(id)' class='btn btn-primary'>${done}</a>`;
            } else if (responseData["access"] === "failed") {
                let message = responseData["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(() => {
                    window.location.href = "/activity";
                }, 3000);
            }
        } else if (response.status === 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 500) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    } catch (error) {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async function () {
            await keluar();
        }, 3000);
    }
}
async function updateActivity(id) {
    let codeActivity = id
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken();
        token = await JSON.parse(getCookie("dataToken"));
        if (token == null) {
            return;
        }
    }
    (function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery("#form2").validate({
                        ignore: [],
                        rules: {
                            "codeActivitiType": { required: true },
                            "codeCOA": { required: true },
                            "selectUOM": { required: true },
                            "selectpremi": { required: true },
                            "status": { required: true },
                        },
                        messages: {
                            "codeActivitiType": required,
                            "codeCOA": required,
                            "selectUOM": required,
                            "selectpremi": required,
                            "status": required,
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
    if (!isValid) {
        return false;
    }

    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const codeActivityType = document.getElementById("codeActivitiType").value;
    const selectUOM = document.getElementById("selectUOM").value;
    const codeCOA = document.getElementById("codeCOA").value;
    const premi = document.getElementById("selectpremi").value;
    const status = document.getElementById("status").value;
    const elements = document.getElementsByName("language[]");

    let valuesLanguage = [];
    elements.forEach(element => {
        valuesLanguage.push(element.value);
    });

    let detail = [];
    for (let i = 0; i < valuesLanguage.length; i++) {
        detail.push({ language_POST: valuesLanguage[i] });
    }

    const dataActivity = [{
        language_POST: language,
        username_POST: username,
        code_activity_type_POST: codeActivityType,
        code_activity_POST: codeActivity,
        uom_POST: selectUOM,
        code_COA_POST: codeCOA,
        premi_POST: premi,
        status_POST: status,
        detail: detail
    }];
    const url = mainUrl + "activity/update";

    try {
        document.getElementById("load").innerHTML = `<button class='btn btn-hero btn-primary shadow' type='button' disabled><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> ${loading}...</button>`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dataActivity)
        });

        if (response.status === 200) {
            const responseLogin = await response.json();
            if (responseLogin.access === "success") {
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "success", icon: "fa fa-check me-1", message: responseLogin.message });
                setTimeout(() => {
                    window.location.href = "/activity";
                }, 3000);
            } else if (responseLogin.access === "failed") {
                Dashmix.helpers("jq-notify", { z_index: 2000, type: "danger", message: responseLogin.message });
                setTimeout(() => {
                    window.location.href = "/activity";
                }, 3000);
            }
        } else if (response.status === 404) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 401) {
            Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else if (response.status === 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_500
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }

    } catch (error) {
        console.error(error);
        Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            message:overload
        });
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }

    return false;
}
