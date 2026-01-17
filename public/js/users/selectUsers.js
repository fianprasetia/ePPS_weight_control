async function selectContent() {
    token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    fetch(data)
        .then((response) => response.json())
        .then((data) => dataContent(data));
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        document.getElementById("usersPage").innerHTML = user
        document.getElementById("titleUsers").innerHTML = user
        document.getElementById("id_employee").innerHTML = filterLanguage[0]["content"]["employee_id"]
        document.getElementById("fullname").innerHTML = filterLanguage[0]["content"]["fullname"]
        document.getElementById("fullnameLabel").innerHTML = filterLanguage[0]["content"]["fullname"] + "<span class='text-danger'>*</span>"
        document.getElementById("username").innerHTML = filterLanguage[0]["content"]["username"]
        document.getElementById("usernameLabelPassword").innerHTML = filterLanguage[0]["content"]["username"]
        document.getElementById("selectUsernameCopy").innerHTML = filterLanguage[0]["content"]["username"]
        document.getElementById("usernameLabel").innerHTML = filterLanguage[0]["content"]["username"] + "<span class='text-danger'>*</span>"
        document.getElementById("usernameLabelCopy").innerHTML = filterLanguage[0]["content"]["username"] + "<span class='text-danger'>*</span>"
        document.getElementById("passwordLabel").innerHTML = filterLanguage[0]["content"]["password"] + "<span class='text-danger'>*</span>"
        document.getElementById("passwordLabel1").innerHTML = filterLanguage[0]["content"]["password"] + "<span class='text-danger'>*</span>"
        document.getElementById("repasswordLabel2").innerHTML = filterLanguage[0]["content"]["retype_password"] + "<span class='text-danger'>*</span>"
        document.getElementById("location").innerHTML = filterLanguage[0]["content"]["location"]
        document.getElementById("locationLabel").innerHTML = filterLanguage[0]["content"]["location"] + "<span class='text-danger'>*</span>"
        document.getElementById("access_web").innerHTML = filterLanguage[0]["content"]["access_web_system"]
        document.getElementById("access_webLabel").innerHTML = filterLanguage[0]["content"]["access_web_system"] + "<span class='text-danger'>*</span>"
        document.getElementById("access_mobile").innerHTML = filterLanguage[0]["content"]["access_mobile_system"]
        document.getElementById("access_mobileLabel").innerHTML = filterLanguage[0]["content"]["access_mobile_system"] + "<span class='text-danger'>*</span>"
        document.getElementById("titleUsersAccess").innerHTML = filterLanguage[0]["content"]["web_menu_access"]
        document.getElementById("status").innerHTML = filterLanguage[0]["content"]["status"]
        document.getElementById("statusLabel").innerHTML = filterLanguage[0]["content"]["status"] + "<span class='text-danger'>*</span>"
        document.getElementById("actions").innerHTML = filterLanguage[0]["content"]["actions"]
        document.getElementById("titleUsersPassword").innerHTML = filterLanguage[0]["content"]["changepassword"]
        document.getElementById("descriptionCopMenu").innerHTML = filterLanguage[0]["content"]["copy_another_user"]
        document.getElementById("copyMenu").innerHTML = filterLanguage[0]["content"]["copy_access"]
        document.getElementById("editMenu").innerHTML = filterLanguage[0]["content"]["edit_access"]
        await selectUsers()
    }
}
async function selectUsers() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "users"
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
                var tableItem = "";
                for (i = 0; i < responseData.length; i++) {
                    mobile = responseData[i]["access_mobile"];
                    web = responseData[i]["access_web"];
                    var menuMobilebUser = (mobile == 1) ? "<button title='" + mobilemenuaccess + "' type='button' id='" + responseData[i]["username"] + "' onclick='showModalUpdateMobileAccess(id)' class='btn btn-primary'><i class='fa-solid fa-mobile-screen'></i></button>" : "";
                    var menuWebUser = (web == 1) ? "<button title='" + webmenuaccess + "' type='button' id ='" + responseData[i]["username"] + "' onclick='showModalUpdateAccess(id)' class='btn btn-primary'><i class='fa-solid fa-display'></i>" : "";
                    var editUser = " <button title='" + edit + "' type='button' id ='" + responseData[i]["username"] + "' onclick='showModalUpdateUsers(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>"
                    var passUser = " <button title='" + changepassword + "' type='button' id ='" + responseData[i]["username"] + "' onclick='showModalUpdatePassword(id)' class='btn btn-primary'><i class='fa-solid fa-lock'></i></button>"
                    tableItem +=
                        "<tr>\
                            <td class='fw-light text-center'>" + responseData[i]["employee_id"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["hrd_employee"]["fullname"] + "</td>\
                            <td class='fw-light text-center'>" + responseData[i]["username"] + "</td>\
                            <td class='fw-light text-center text-uppercase'>" + responseData[i]["adm_company"]["name"] + "</td>\
                            <td class='fw-light  text-center'>" + (responseData[i]["access_web"] == 0 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>") + "</td>\
                            <td class='fw-light text-center'>" + (responseData[i]["access_mobile"] == 0 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>") + "</td>\
                            <td class='fw-light text-center'>" + (responseData[i]["status"] == 0 ? "<i class='fa-solid fa-circle-minus fa-xl text-danger'></i>" : "<i class='fa-solid fa-circle-check fa-xl text-primary'></i>") + "</td>\
                            <td class='fw-light text-center'><div class='btn-group'>" + editUser + passUser + menuWebUser + menuMobilebUser + "</div></td>\
                        </tr>";
                }
                document.getElementById("dataTable").innerHTML = tableItem;
                await table();
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
async function selectEmployee(employeeID) {
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
    });
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = await JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"]
                var filterSubData = responseData.filter((filterSubData) => filterSubData.employee_id == employeeID);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.employee_id != employeeID);
                mainOptionItem = "";
                subOptionItem = "";
                for (i = 0; i < filternotSubData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        filternotSubData[i]["employee_id"] +
                        "'>" +
                        kapital(filternotSubData[i]["fullname"]) +
                        "</option>";
                }
                if (employeeID == "" || employeeID == undefined) {
                    mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
                } else {
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["employee_id"] + ">" + kapital(filterSubData[0]["fullname"]) + "</option>";
                }

                document.getElementById("selectFullname").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
async function selectCompany(companyCode) {
    const language = await JSON.parse(getCookie("language"));
    let token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        await getAccessToken();
        token = await JSON.parse(getCookie("dataToken"));
        if (!token) return;
    }

    const url = mainUrl + "company";
    const data = JSON.stringify({ language_POST: language });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + token,
            },
            body: data,
        });

        if (response.status === 200) {
            const result = await response.json();

            if (result.access === "success") {
                const responseData = result.data;
                const filterSubData = responseData.filter(item => item.code_company == companyCode);
                const filternotSubData = responseData.filter(item =>
                    item.code_company !== companyCode && item.level == 3
                );

                let mainOptionItem = "";
                let subOptionItem = "";

                for (let i = 0; i < filternotSubData.length; i++) {
                    subOptionItem += `
                        <option class='fw-light text-uppercase' value='${filternotSubData[i]["code_company"]}'>
                            ${kapital(filternotSubData[i]["name"])}
                        </option>`;
                }

                if (!companyCode) {
                    mainOptionItem += `<option class='fw-light text-uppercase' selected disabled value=''>
                        ${kapital(select)}
                    </option>`;
                } else {
                    mainOptionItem += `<option class='fw-light text-uppercase' value='${filterSubData[0]["code_company"]}'>
                        ${kapital(filterSubData[0]["name"])}
                    </option>`;
                }

                document.getElementById("selectLocation").innerHTML = mainOptionItem + subOptionItem;

            } else if (result.access === "failed") {
                Dashmix.helpers("jq-notify", {
                    type: "danger",
                    z_index: 2000,
                   message: result.message,
                });
                setTimeout(() => {
                    window.location.href = "/users";
                }, 3000);
            }

        } else if (response.status === 404) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_404,
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);

        } else if (response.status === 401) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_401,
            });
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);

        } else if (response.status === 500) {
            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                 message: status_500,
            });
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
        setTimeout(async () => {
            await keluar();
        }, 3000);
    }

    return false;
}
async function selectUsernameMobile() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "users/mobile"
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
                var subOptionItem = ""
                mainOptionItem = "<option class='fw-light text-uppercase' value='' selected disabled>" + kapital(select) + "</option>";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        responseData[i]["username"] +
                        "'>" +
                        responseData[i]["username"] +
                        "</option>";
                }
                document.getElementById("selectUsernameCopy").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
async function selectUsername() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "users/web"
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
                var subOptionItem = ""
                mainOptionItem = "<option class='fw-light text-uppercase' value='' selected disabled>" + kapital(select) + "</option>";
                for (i = 0; i < responseData.length; i++) {
                    subOptionItem +=
                        "<option class='fw-light text-uppercase' value='" +
                        responseData[i]["username"] +
                        "'>" +
                        responseData[i]["username"] +
                        "</option>";
                }
                document.getElementById("selectUsernameCopy").innerHTML = mainOptionItem + "" + subOptionItem;
            } else if (response["access"] == "failed") {
                message = response["message"];
                Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
                setTimeout(function () {
                    window.location.href = "/users";
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
function viewPassword(passwordId, eyeIconId) {
    var passwordInput = document.getElementById(passwordId);
    var eyeIcon = document.getElementById(eyeIconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}
function validatePassword() {
    let pass2 = document.getElementById("password1").value;
    let pass1 = document.getElementById("password2").value;
    if (pass1 != pass2) {
        document.getElementById("salah").innerHTML = passwordnotmacth;
    } else if (pass1 == pass2) {
        document.getElementById("salah").innerHTML = "";
    }
}
function parentMenu(param) {
    const element = document.getElementById(param); // Ambil elemen checkbox berdasarkan param
    const parentId = element.getAttribute("parentid"); // Ambil nilai atribut parentid

    // Jika elemen memiliki parentid (berarti ini child checkbox)
    if (parentId) {
        const parentCheckbox = document.getElementById(parentId); // Ambil parent checkbox berdasarkan parentid

        if (!element.checked) {
            // Jika child di-uncheck, periksa apakah semua child lainnya juga di-uncheck
            const siblings = document.querySelectorAll(`[parentid='${parentId}']`); // Ambil semua checkbox yang punya parentid sama
            const allUnchecked = Array.from(siblings).every(sibling => !sibling.checked); // Periksa apakah semua child tidak dicentang

            if (allUnchecked) {
                parentCheckbox.checked = false; // Jika semua child tidak dicentang, uncheck parent
            }

            // Uncheck sub-child dari child yang di-uncheck
            const subChildren = document.querySelectorAll(`[parentid='${param}']`);
            subChildren.forEach(function (subChild) {
                subChild.checked = false; // Uncheck setiap sub-child
            });
        } else {
            // Jika salah satu child dicentang, pastikan parent juga dicentang
            parentCheckbox.checked = true;
        }
    } else {
        // Jika checkbox tidak memiliki parentid (ini adalah parent)
        const children = document.querySelectorAll(`[parentid='${param}']`); // Cari semua checkbox yang punya parentid = param (child-nya)

        // Jika parent dicentang, biarkan child tetap dalam status mereka saat ini (tidak diubah)
        if (!element.checked) {
            // Jika parent di-uncheck, semua child dan sub-child juga di-uncheck
            children.forEach(function (child) {
                child.checked = false;

                // Uncheck sub-child dari child
                const subChildren = document.querySelectorAll(`[parentid='${child.id}']`);
                subChildren.forEach(function (subChild) {
                    subChild.checked = false; // Uncheck setiap sub-child
                });
            });
        }
    }
}

selectContent()