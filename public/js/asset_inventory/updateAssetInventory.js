async function showModalUpdateAsset(code) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalAssetInventory"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalAssetInventory"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("assetSubType").innerHTML = ""
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='" + code + "' type='submit'  onclick='updateAsset(id)' class='btn btn-primary'>" + kapital(done) + "</a>"
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/bycode"
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
        code_POST: code,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("code").value = responseData[0]["asset_code"]
                document.getElementById("worksite").value = responseData[0]["worksite"]
                document.getElementById("name").value = responseData[0]["log_item_master"]["name"]
                document.getElementById("acquisitionYear").value = responseData[0]["acquisition_year"]
                document.getElementById("periodMonths").value = responseData[0]["depreciation_period_months"]
                document.getElementById("paymentRef").value = responseData[0]["payment_ref"]
                document.getElementById("depreciationStartMonth").value = responseData[0]["depreciation_start_month"]
                document.getElementById("valueMonthly").value = formatRupiah(responseData[0]["depreciation_value_monthly"])
                document.getElementById("historicalCost").value = formatRupiah(responseData[0]["historical_cost"])
                document.getElementById("procurementDoc").value = responseData[0]["procurement_document"]
                document.getElementById("note").value = responseData[0]["note"]
                document.getElementById("company").value = responseData[0]["company"]["parent_code"]
                assetType = responseData[0]["code_asset_type"]
                assetSubType = responseData[0]["code_asset_subtype"]
                assetLocation = responseData[0]["asset_location"]
                await selectAssetType(assetType)
                await selectWorksiteLocation(assetLocation)
                await selectAssetSubType(assetSubType,assetType)
                let status = responseData[0]["status"];

                function getStatusText(statusValue) {
                    const statusMap = {
                        0: kapital(nonactive),
                        1: kapital(active),
                        2: kapital(damaged),
                        3: kapital(retired_asset),
                        4: kapital(lost)
                    };
                    return statusMap[statusValue] || "";
                }
                const statusOrder = [0, 1, 2, 3, 4];
                mainOptionStatus = `<option class="fw-light text-uppercase" value="${status}">${getStatusText(status)}</option>`;
                let otherOptions = "";
                statusOrder.forEach(s => {
                    if (s !== status) {
                        otherOptions += `<option class="fw-light text-uppercase" value="${s}">${getStatusText(s)}</option>`;
                    }
                });
                document.getElementById("status").innerHTML = mainOptionStatus + otherOptions;
                const statusLeasing = responseData[0]["leasing_status"]
                let mainOption
                if (statusLeasing === null || statusLeasing === "" ) {
                    mainOption = "<option  class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOption = ""
                }
                mainOptionStatusLeasing = "<option  class='fw-light text-uppercase' value=" + (statusLeasing == "0" ? "0" : "1") + ">" + (statusLeasing == "0" ? kapital(nonleasing) : kapital(leasing)) + "</option>";
                optionStatusLeasing = "<option  class='fw-light text-uppercase' value=" + (statusLeasing != "0" ? "0" : "1") + ">" + (statusLeasing != "0" ? kapital(nonleasing) : kapital(leasing)) + "</option>";
                document.getElementById("leasing").innerHTML = mainOption + "" + mainOptionStatusLeasing + "" + optionStatusLeasing + "";
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
                }, 3000);
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
async function updateAsset(code) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    // const assetCode = document.getElementById("code").value
    const assetType = document.getElementById("assetType").value
    const assetSubType = document.getElementById("assetSubType").value
    const note = document.getElementById("note").value
    // const company = document.getElementById("company").value
    const valueMonthly = unformatRupiah(document.getElementById("valueMonthly").value)
    const periodMonths = document.getElementById("periodMonths").value
    const location = document.getElementById("location").value
    const leasing = document.getElementById("leasing").value
    const paymentRef = document.getElementById("paymentRef").value
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "assetType": { required: !0 },
                            "assetSubType": { required: !0 },
                            "valueMonthly": { required: !0 },
                            "periodMonths": { required: !0 },
                            "location": { required: !0 },
                            "leasing": { required: !0 },
                        },
                        messages: {
                            "assetType": required,
                            "assetSubType": required,
                            "valueMonthly": required,
                            "periodMonths": required,
                            "location": required,
                            "leasing": required
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
    const form = jQuery(".js-validation");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/update";
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(
        {
            language_POST: language,
            code_POST: code,
            // asset_code_POST: assetCode,
            username_POST: username,
            asset_type_POST: assetType,
            asset_sub_type_POST: assetSubType,
            note_POST: note,
            // company_POST: company,
            value_monthly_POST: valueMonthly,
            period_months_POST: periodMonths,
            payment_ref_POST: paymentRef,
            location_POST: location,
            leasing_POST: leasing,
        }
    );
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
                    window.location.href = "/asset_inventory";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
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
async function showModalUpdatePostingAsset(param) {
    var myModal = new bootstrap.Modal(document.getElementById("modalNotice"), { keyboard: false });
    myModal.toggle();
    document.getElementById("loadNotice").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id ='" + param + "' type='submit' onclick='updatePostingAsset(id)' class='btn  btn-primary'>" + kapital(done) + "</button>"
    document.getElementById("contentNotice").innerHTML = "<p>" + notice_posting + "</p>"
}
async function updatePostingAsset(id) {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"]
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/posting"
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };
    var data = JSON.stringify({
        language_POST: language,
        code_POST: id,
        username_POST: username
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "success", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
                }, 3000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
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
async function showModalUpdateAssetStatus(code) {
    // 
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
        await getAccessToken()
        if (token == null) {
            return;
        }
        var myModal = new bootstrap.Modal(document.getElementById("modalAssetInventory"), { keyboard: false });
        myModal.toggle();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById("modalAssetInventory"), { keyboard: false });
        myModal.toggle();
    }
    document.getElementById("assetSubType").innerHTML = ""
    document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='" + code + "' type='submit'  onclick='updateAssetStatus(id)' class='btn btn-primary'>" + kapital(done) + "</a>"
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/bycode"
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
        code_POST: code,
        language_POST: language,
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                document.getElementById("code").value = responseData[0]["asset_code"]
                document.getElementById("worksite").value = responseData[0]["worksite"]
                document.getElementById("name").value = responseData[0]["log_item_master"]["name"]
                document.getElementById("acquisitionYear").value = responseData[0]["acquisition_year"]
                document.getElementById("periodMonths").value = responseData[0]["depreciation_period_months"]
                document.getElementById("paymentRef").value = responseData[0]["payment_ref"]
                document.getElementById("depreciationStartMonth").value = responseData[0]["depreciation_start_month"]
                document.getElementById("valueMonthly").value = formatRupiah(responseData[0]["depreciation_value_monthly"])
                document.getElementById("historicalCost").value = formatRupiah(responseData[0]["historical_cost"])
                document.getElementById("procurementDoc").value = responseData[0]["procurement_document"]
                document.getElementById("note").value = responseData[0]["note"]
                document.getElementById("company").value = responseData[0]["company"]["parent_code"]
                assetType = responseData[0]["code_asset_type"]
                assetSubType = responseData[0]["code_asset_subtype"]
                assetLocation = responseData[0]["asset_location"]
                await selectAssetType(assetType)
                await selectWorksiteLocation(assetLocation)
                await selectAssetSubType(assetSubType,assetType)
                let status = responseData[0]["status"];

                function getStatusText(statusValue) {
                    const statusMap = {
                        1: kapital(active),
                        2: kapital(damaged),
                        3: kapital(retired_asset),
                        4: kapital(lost)
                    };
                    return statusMap[statusValue] || "";
                }
                const statusOrder = [1, 2, 3, 4];
                mainOptionStatus = `<option class="fw-light text-uppercase" value="${status}">${getStatusText(status)}</option>`;
                let otherOptions = "";
                statusOrder.forEach(s => {
                    if (s !== status) {
                        otherOptions += `<option class="fw-light text-uppercase" value="${s}">${getStatusText(s)}</option>`;
                    }
                });
                document.getElementById("status").innerHTML = mainOptionStatus + otherOptions;
                const statusLeasing = responseData[0]["leasing_status"]
                let mainOption
                if (statusLeasing === null || statusLeasing === "" ) {
                    mainOption = "<option  class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOption = ""
                }
                mainOptionStatusLeasing = "<option  class='fw-light text-uppercase' value=" + (statusLeasing == "0" ? "0" : "1") + ">" + (statusLeasing == "0" ? kapital(nonleasing) : kapital(leasing)) + "</option>";
                optionStatusLeasing = "<option  class='fw-light text-uppercase' value=" + (statusLeasing != "0" ? "0" : "1") + ">" + (statusLeasing != "0" ? kapital(nonleasing) : kapital(leasing)) + "</option>";
                document.getElementById("leasing").innerHTML = mainOption + "" + mainOptionStatusLeasing + "" + optionStatusLeasing + "";

                const form = document.getElementById('form1');
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(element => {
                  element.disabled = true;
                });
                document.getElementById("status").disabled = false
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
                }, 3000);
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
async function updateAssetStatus(code) {
    const language = await JSON.parse(getCookie("language"));
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    // const assetCode = document.getElementById("code").value
    const status = document.getElementById("status").value
    !(function () {
        class e {
            static initValidation() {
                Dashmix.helpers("jq-validation"),
                    jQuery(".js-validation").validate({
                        ignore: [],
                        rules: {
                            "assetType": { required: !0 },
                            "assetSubType": { required: !0 },
                            "valueMonthly": { required: !0 },
                            "periodMonths": { required: !0 },
                            "location": { required: !0 },
                            "leasing": { required: !0 },
                        },
                        messages: {
                            "assetType": required,
                            "assetSubType": required,
                            "valueMonthly": required,
                            "periodMonths": required,
                            "location": required,
                            "leasing": required
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
    const form = jQuery(".js-validation");
    const isValid = form.valid();
    if (!isValid) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "asset/updatestatus";
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
            message:overload,
        });
        setTimeout(async function () {
            await keluar()
        }, 3000);
    };

    var data = JSON.stringify(
        {
            language_POST: language,
            code_POST: code,
            username_POST: username,
            status_POST:status
        }
    );
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
                    window.location.href = "/asset_inventory";
                }, 3000);
            } else if (responseLogin["access"] == "failed") {
                message = responseLogin["message"];
                Dashmix.helpers("jq-notify", {
                    z_index: 2000,
                    type: "danger",
                   message: message,
                });
                setTimeout(function () {
                    window.location.href = "/asset_inventory";
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