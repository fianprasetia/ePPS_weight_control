async function showModalUpdateUsers(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalUsers"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalUsers"), { keyboard: false });
    myModal.toggle();
  }
  let language = await JSON.parse(getCookie("language"));
  document.getElementById("selectFullname").disabled = true
  document.getElementById("passwordhide").hidden = true
  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <a id='doneBtn' type='submit' onclick='updateUsers()' class='btn btn-primary'>" + kapital(done) + "</a>"
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/username"
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(async function () {
      await keluar()
    }, 3000);
  };
  var data = JSON.stringify({
    username_POST: id,
    language_POST: language,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        const companyCode = responseData[0]["code_company"]
        await selectCompany(companyCode)
        const accessWeb = responseData[0]["access_web"]
        const status = responseData[0]["status"]
        const accessMobile = responseData[0]["access_mobile"]
        document.getElementById("selectUsername").value = responseData[0]["username"]
        document.getElementById("selectFullname").innerHTML = "<option class='fw-light text-uppercase' selected value='" + responseData[0]["employee_id"] + "'>" + kapital(responseData[0]["hrd_employee"]["fullname"]) + "</option> "
        mainOptionWeb = "<option  class='fw-light text-uppercase' value=" + accessWeb + ">" + (accessWeb == "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        optionWeb = "<option  class='fw-light text-uppercase' value=" + (accessWeb != "0" ? "0" : "1") + ">" + (accessWeb != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        document.getElementById("selectAccess_web").innerHTML = "" + mainOptionWeb + "" + optionWeb + "";
        mainOptionMobile = "<option  class='fw-light text-uppercase' value=" + accessMobile + ">" + (accessMobile == "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        optionMobile = "<option  class='fw-light text-uppercase' value=" + (accessMobile != "0" ? "0" : "1") + ">" + (accessMobile != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        document.getElementById("selectAccess_mobile").innerHTML = "" + mainOptionMobile + "" + optionMobile + "";
        mainOptionStatus = "<option  class='fw-light text-uppercase' value=" + status + ">" + (status == "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        optionStatus = "<option  class='fw-light text-uppercase' value=" + (status != "0" ? "0" : "1") + ">" + (status != "0" ? kapital(nonactive) : kapital(active)) + "</option>";
        document.getElementById("selectStatusActive").innerHTML = "" + mainOptionStatus + "" + optionStatus + "";

      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/company";
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
async function updateUsers() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const usernameLogin = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
  }
  const fullname = document.getElementById("selectFullname").value
  const username = document.getElementById("selectUsername").value
  const location = document.getElementById("selectLocation").value
  const access_web = document.getElementById("selectAccess_web").value
  const access_mobile = document.getElementById("selectAccess_mobile").value
  const status = document.getElementById("selectStatusActive").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "selectUsername": { required: !0, minlength: 4 },
              "selectFullname": { required: !0 },
              "selectLocation": { required: !0 },
              "selectAccess_web": { required: !0 },
              "selectAccess_mobile": { required: !0 },
              "selectStatusActive": { required: !0 },
            },
            messages: {
              "selectUsername": {
                required: required,
                minlength: minlength,
              },
              "selectFullname": required,
              "selectLocation": required,
              "selectAccess_web": required,
              "selectAccess_mobile": required,
              "selectStatusActive": required,
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
  if (fullname == "" || username == "" || location == "" || access_web == "" || access_mobile == "" || status == "") {
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/update/" + username;
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

  var data = JSON.stringify(
    {
      language_POST: language,
      employeeID_POST: fullname,
      location_POST: location,
      accessWeb_POST: access_web,
      accessMobile_POST: access_mobile,
      status_POST: status,
      username_POST: usernameLogin
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}
async function showModalUpdatePassword(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersPassword"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersPassword"), { keyboard: false });
    myModal.toggle();
  }
  document.getElementById("loadpassword").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <button type='submit' onclick='updatePassword()' class='btn btn-primary'>" + kapital(done) + "</button>"
  document.getElementById("selectUsernamePassword").value = id;
  document.getElementById("selectUsernamePassword").disabled = true;
}
async function updatePassword() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const usernameLogin = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  const username = document.getElementById("selectUsernamePassword").value
  const password = document.getElementById("password1").value
  const retypepassword = document.getElementById("password2").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formPassword").validate({
            ignore: [],
            rules: {
              "password1": { required: !0 },
              "password2": { required: !0 },
            },
            messages: {
              "password1": required,
              "password2": required,
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
  if (password == "" || retypepassword == "") {
    return false
  }
  if (password != retypepassword) {
    return true;
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/password/" + username;
  xhr.onloadstart = function () {
    document.getElementById("loadpassword").innerHTML =
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

  var data = JSON.stringify(
    {
      language_POST: language,
      password_POST: password,
      username_POST: usernameLogin
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}
async function showModalUpdateAccess(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersAccess"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersAccess"), { keyboard: false });
    myModal.toggle();
  }
  document.getElementById("titleUsersAccess").innerHTML = webmenuaccess
  document.getElementById("tabList").innerHTML = ""
  document.getElementById("tabList").innerHTML = `  <ul class="nav nav-tabs nav-tabs-alt"  role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link space-x-1 active" onclick="headersMenuAccess('edit',cancel,done)"
                                        data-bs-toggle="tab" data-bs-target="#account-profile" role="tab"
                                        aria-controls="account-profile" aria-selected="true">
                                        <i class="fa fa-user-circle d-sm-none"></i>
                                        <span id="editMenu" class="d-none d-sm-inline">${edit_access}</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link space-x-1" onclick="headersMenuAccess('copy',cancel,done)"
                                        data-bs-toggle="tab" data-bs-target="#account-password" role="tab"
                                        aria-controls="account-password" aria-selected="false">
                                        <i class="fa fa-asterisk d-sm-none"></i>
                                        <span id="copyMenu" class="d-none d-sm-inline">${copy_access}</span>
                                    </a>
                                </li>
                            </ul>
                            <div class="block-content tab-content">
                                <div class="tab-pane active" id="account-profile" role="tabpanel"
                                    aria-labelledby="account-profile-tab" tabindex="0">
                                    <div id="rowAccess" class="row" hidden>
                                        <div id="treeAccess" class="tree">
                                        </div>
                                    </div>
                                    <div hidden class="col-sm-12 mb-2">
                                        <input type="text" class="form-control fw-light" id="selectUsernameAccess"
                                            name="selectUsernameAccess">
                                    </div>
                                </div>
                                <div class="tab-pane" id="account-password" role="tabpanel"
                                    aria-labelledby="account-password-tab" tabindex="0">
                                    <div class="row push p-sm-2 p-lg-4">
                                        <div class="offset-xl-1 col-xl-4 order-xl-1">
                                            <p id="descriptionCopMenu"
                                                class="bg-body-light p-4 rounded-3 text-muted fs-sm">
                                             ${copy_another_user}
                                            </p>
                                        </div>
                                        <div class="col-xl-6 order-xl-0">
                                            <div class="col-sm-12 mb-2">
                                                <label id="usernameLabelCopy" class="form-label text-uppercase"
                                                    for="selectUsernameCopy"></label>
                                                <select value="" class="js-select2 form-select fw-light text-uppercase"
                                                    name="selectUsernameCopy" id="selectUsernameCopy"
                                                    style="width: 100%" data-container="#modalUsersAccess">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
  const username = document.getElementById("selectUsernameAccess").value = id
  await selectUsername()
  document.getElementById("loadAccess").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <button type='submit' id='" + id + "' onclick='updateAccess(id)' class='btn btn-primary'>" + kapital(done) + "</button>"
  let language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/authentication"
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(async function () {
      await keluar()
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        dataAuth = responseData['dataAuth']
        dataMenu = responseData['dataMenu']
        var arrUserMenu = []
        var arrMenu = []
        for (i = 0; i < dataAuth.length; i++) {
          dataAuthUser = dataAuth[i]['adm_menu']
          statusUser = JSON.parse('{"status": 1}')
          $.extend(dataAuthUser, statusUser);
          arrUserMenu.push(dataAuthUser);
        }
        for (i = 0; i < dataMenu.length; i++) {
          dataMenuUser = dataMenu[i]
          statusMenu = JSON.parse('{"status": 0}')
          $.extend(dataMenuUser, statusMenu);
          arrMenu.push(dataMenuUser);
        }
        categories = arrMenu.concat(arrUserMenu)
        // let sortedcategories = categories.sort((c1, c2) => (c1.id_menu > c2.id_menu) ? 1 : (c1.id_menu < c2.id_menu) ? -1 : 0);
        let sortedcategories = categories.sort((c1, c2) => {
          if (c1.level === c2.level) {
            return c1.no_ordinal - c2.no_ordinal;
          } else {
            return c1.level - c2.level;
          }
        });
        sortedcategories.filter((c) => c.parent_id).forEach((c) => {
          const parent = sortedcategories.find((p) => p.id_menu === c.parent_id);
          parent.subCategories = parent.subCategories || [];
          parent.subCategories.push(c);
        });
        sortedcategories = sortedcategories.filter((c) => !c.parent_id);
        detailMenu = "<div class='space-x-1 text-start mb-3'>\
                         <button type='button' class='btn btn-outline-secondary fw-light text-dark text-uppercase' id='expandAll'>"+ expand_all + "</button>\
                       </div>"
        detailMenu += "<ul>\
                                                      <li>\
                                                          <a id='treeMainMenu'><span class='fw-light text-uppercase'>"+ mainmenu + "</span></a>\
                                                              <ul>"
        for (j in sortedcategories) {
          const captionlevel_1 = sortedcategories[j]["adm_menu_translations"][0]["translation"]
          const idMenuLevel_1 = sortedcategories[j]["id_menu"]
          const sublevel_1 = sortedcategories[j]["subCategories"]
          const parent_1 = sortedcategories[j]["parent_id"]
          const status_1 = sortedcategories[j]["status"]
          const page_1 = sortedcategories[j]["page"]
          const icon_1 = page_1 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
          if (status_1 == "1") {
            cek_1 = "checked"
          } else {
            cek_1 = ""
          }
          detailMenu += "\
                                                                  <li>"+ icon_1 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_1 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_1 + "' onclick='parentMenu(id)' id='" + idMenuLevel_1 + "'' name='menuAccesss' " + cek_1 + "></span></a>\
                                                                      <ul>"
          for (k in sublevel_1) {
            const captionlevel_2 = sublevel_1[k]["adm_menu_translations"][0]["translation"]
            const idMenuLevel_2 = sublevel_1[k]["id_menu"]
            const parent_2 = sublevel_1[k]["parent_id"]
            const sublevel_2 = sublevel_1[k]["subCategories"]
            const status_2 = sublevel_1[k]["status"]
            const page_2 = sublevel_1[k]["page"]
            const icon_2 = page_2 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
            if (status_2 == "1") {
              cek_2 = "checked"
            } else {
              cek_2 = ""
            }
            detailMenu += "\
                                                                          <li class='parent_li'>"+ icon_2 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_2 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_2 + "' parentid='" + parent_2 + "' onclick='parentMenu(id)' id='" + idMenuLevel_2 + "'' name='menuAccesss' " + cek_2 + "></span></a>\
                                                                          <ul>"
            for (l in sublevel_2) {
              const captionlevel_3 = sublevel_2[l]["adm_menu_translations"][0]["translation"]
              const idMenuLevel_3 = sublevel_2[l]["id_menu"]
              const parent_3 = sublevel_2[l]["parent_id"]
              const sublevel_3 = sublevel_2[l]["subCategories"]
              const status_3 = sublevel_2[l]["status"]
              const page_3 = sublevel_2[l]["page"]
              const icon_3 = page_3 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
              if (status_3 == "1") {
                cek_3 = "checked"
              } else {
                cek_3 = ""
              }
              detailMenu += "\
                                                                              <li class='parent_li'>"+ icon_3 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_3 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_3 + "'  parentid='" + parent_3 + "' onclick='parentMenu(id)' id='" + idMenuLevel_3 + "'' name='menuAccesss' " + cek_3 + "></span></a>\
                                                                                  <ul>"
              for (m in sublevel_3) {
                const captionlevel_4 = sublevel_3[m]["adm_menu_translations"][0]["translation"]
                const idMenuLevel_4 = sublevel_3[m]["id_menu"]
                const parent_4 = sublevel_3[m]["parent_id"]
                const status_4 = sublevel_3[m]["status"]
                if (status_4 == "1") {
                  cek_4 = "checked"
                } else {
                  cek_4 = ""
                }
                detailMenu += "\
                                                                                                        <li class='parent_li'><a><span class='fw-light text-dark text-uppercase'>" + captionlevel_4 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_4 + "' parentid='" + parent_4 + "' onclick='parentMenu(id)' id='" + idMenuLevel_4 + "'' name='menuAccesss' " + cek_4 + "></span></a>"
              }

              detailMenu += "\
                                                                                                          </ul>\
                                                                                                        </li>"
            }
            detailMenu += "\
                                                                                                          </ul>\
                                                                                                        </li>"
          }
          detailMenu += "\
                                                                  </ul>\
                                                          </li>"
        }
        detailMenu += "\
                                                          </ul>\
                                                      </li>\
                                                  </ul>"

        await scriptTree()
        document.getElementById("treeAccess").innerHTML = detailMenu;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/company";
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
function scriptTree() {
  $(function () {
    // Hide all child elements initially
    $(".tree li.parent_li").hide("fast");
    // Set event listener to toggle branches
    $(".tree li:has(ul)")
      .addClass("parent_li")
      .find(" > span")
      .attr("title", "Expand this branch");
    $(".tree li.parent_li > span").on("click", function (e) {
      var children = $(this).parent("li.parent_li").find(" > ul > li");
      if (children.is(":visible")) {
        children.hide("fast");
        $(this)
          .attr("title", "Expand this branch")
          .find(" > i")
          .addClass("fa-plus-square")
          .removeClass("fa-minus-square");
      } else {
        children.show("fast");
        $(this)
          .attr("title", "Collapse this branch")
          .find(" > i")
          .addClass("fa-minus-square")
          .removeClass("fa-plus-square");
      }
      e.stopPropagation();
    });

    $("#expandAll").on("click", function () {
      $(".tree li.parent_li > ul > li.parent_li").show("fast"); // Show only parent_li elements
      $(".tree li.parent_li > span > i")
        .addClass("fa-minus-square")
        .removeClass("fa-plus-square"); // Update icons
    });

    setTimeout(function () {
      document.getElementById("rowAccess").hidden = false
    }, 1000);
  });
}
async function updateAccess() {
  const username = document.getElementById("selectUsernameAccess").value
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const usernameLogin = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var userAccess = [];
  $("input:checkbox[name=menuAccesss]:checked").each(function () {
    userAccess.push($(this).val());
  });
  if (userAccess == "") {
    Dashmix.helpers('jq-notify', { type: 'danger', z_index: 2000, icon: 'fa fa-exclamation me-1', message: select_access });
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/update/authentication";
  xhr.onloadstart = function () {
    document.getElementById("loadAccess").innerHTML =
      "<button class='btn btn-primary shadow' type='button' disabled>\n\
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
  var menuAcces = []
  for (i = 0; i < userAccess.length; i++) {
    userprivilege_POST = JSON.parse('{"userprivilege_POST":' + userAccess[i] + '}')
    username_POST = JSON.parse('{"username_POST":"' + username + '"}')
    $.extend(userprivilege_POST, username_POST);
    menuAcces.push(userprivilege_POST)
  }
  const languageData = JSON.parse('{"language_POST":"' + language + '"}')
  const usernameData = JSON.parse('{"username_POST":"' + usernameLogin + '"}')
  var dataMenuAccess = {
    dataAuth: menuAcces,
    dataLanguage: languageData,
    dataUsername: usernameData,
  }
  var data = JSON.stringify(dataMenuAccess);
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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
function headersMenuAccess(param, cancel, done) {
  let content = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> ";

  if (param == "edit") {
    content += "<button type='submit' onclick='updateAccess()' class='btn btn-primary'>" + kapital(done) + "</button>";
  } else {
    content += "<button type='submit' onclick='updateCopyAccess()' class='btn btn-primary'>" + kapital(done) + "</button>";
  }

  document.getElementById("loadAccess").innerHTML = content;
}
async function updateCopyAccess() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  const target = document.getElementById("selectUsernameAccess").value
  const source = document.getElementById("selectUsernameCopy").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formAccess").validate({
            ignore: [],
            rules: {
              "selectUsernameCopy": { required: !0 },
            },
            messages: {
              "selectUsernameCopy": required,
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
  if (source == "") {
    return source !== "";
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/update/copyauthentication";
  xhr.onloadstart = function () {
    document.getElementById("loadAccess").innerHTML =
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

  var data = JSON.stringify(
    {
      language_POST: language,
      target_POST: target,
      source_POST: source,
      username_POST: username
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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
async function showModalUpdateMobileAccess(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersAccess"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalUsersAccess"), { keyboard: false });
    myModal.toggle();
  }
  document.getElementById("titleUsersAccess").innerHTML = mobilemenuaccess
  document.getElementById("tabList").innerHTML = ""
  document.getElementById("tabList").innerHTML = `  <ul class="nav nav-tabs nav-tabs-alt"  role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link space-x-1 active" onclick="headersMenuAccessMobile('edit',cancel,done)"
                                        data-bs-toggle="tab" data-bs-target="#account-profile" role="tab"
                                        aria-controls="account-profile" aria-selected="true">
                                        <i class="fa fa-user-circle d-sm-none"></i>
                                        <span id="editMenu" class="d-none d-sm-inline">${edit_access}</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link space-x-1" onclick="headersMenuAccessMobile('copy',cancel,done)"
                                        data-bs-toggle="tab" data-bs-target="#account-password" role="tab"
                                        aria-controls="account-password" aria-selected="false">
                                        <i class="fa fa-asterisk d-sm-none"></i>
                                        <span id="copyMenu" class="d-none d-sm-inline">${copy_access}</span>
                                    </a>
                                </li>
                            </ul>
                            <div class="block-content tab-content">
                                <div class="tab-pane active" id="account-profile" role="tabpanel"
                                    aria-labelledby="account-profile-tab" tabindex="0">
                                    <div id="rowAccess" class="row" hidden>
                                        <div id="treeAccess" class="tree">
                                        </div>
                                    </div>
                                    <div hidden class="col-sm-12 mb-2">
                                        <input type="text" class="form-control fw-light" id="selectUsernameAccess"
                                            name="selectUsernameAccess">
                                    </div>
                                </div>
                                <div class="tab-pane" id="account-password" role="tabpanel"
                                    aria-labelledby="account-password-tab" tabindex="0">
                                    <div class="row push p-sm-2 p-lg-4">
                                        <div class="offset-xl-1 col-xl-4 order-xl-1">
                                            <p id="descriptionCopMenu"
                                                class="bg-body-light p-4 rounded-3 text-muted fs-sm">
                                               ${copy_another_user}
                                            </p>
                                        </div>
                                        <div class="col-xl-6 order-xl-0">
                                            <div class="col-sm-12 mb-2">
                                                <label id="usernameLabelCopy" class="form-label text-uppercase"
                                                    for="selectUsernameCopy"></label>
                                                <select value="" class="js-select2 form-select fw-light text-uppercase"
                                                    name="selectUsernameCopy" id="selectUsernameCopy"
                                                    style="width: 100%" data-container="#modalUsersAccess">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
  const username = document.getElementById("selectUsernameAccess").value = id
  await selectUsernameMobile()
  document.getElementById("loadAccess").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> <button type='submit' id='" + id + "' onclick='updateAccessMobile(id)' class='btn btn-primary'>" + kapital(done) + "</button>"
  let language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/authenticationmobile"
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload,
    });
    setTimeout(async function () {
      await keluar()
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language,
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        dataAuth = responseData['dataAuth']
        dataMenu = responseData['dataMenu']
        var arrUserMenu = []
        var arrMenu = []
        for (i = 0; i < dataAuth.length; i++) {
          dataAuthUser = dataAuth[i]['adm_menu_mobile']
          statusUser = JSON.parse('{"status": 1}')
          $.extend(dataAuthUser, statusUser);
          arrUserMenu.push(dataAuthUser);
        }
        for (i = 0; i < dataMenu.length; i++) {
          dataMenuUser = dataMenu[i]
          statusMenu = JSON.parse('{"status": 0}')
          $.extend(dataMenuUser, statusMenu);
          arrMenu.push(dataMenuUser);
        }
        categories = arrMenu.concat(arrUserMenu)
        // let sortedcategories = categories.sort((c1, c2) => (c1.id_menu > c2.id_menu) ? 1 : (c1.id_menu < c2.id_menu) ? -1 : 0);
        let sortedcategories = categories.sort((c1, c2) => {
          if (c1.level === c2.level) {
            return c1.no_ordinal - c2.no_ordinal;
          } else {
            return c1.level - c2.level;
          }
        });
        sortedcategories.filter((c) => c.parent_id).forEach((c) => {
          const parent = sortedcategories.find((p) => p.id_menu === c.parent_id);
          parent.subCategories = parent.subCategories || [];
          parent.subCategories.push(c);
        });
        sortedcategories = sortedcategories.filter((c) => !c.parent_id);
        detailMenu = "<div class='space-x-1 text-start mb-3'>\
                         <button type='button' class='btn btn-outline-secondary fw-light text-dark text-uppercase' id='expandAll'>"+ expand_all + "</button>\
                       </div>"
        detailMenu += "<ul>\
                                                      <li>\
                                                          <a id='treeMainMenu'><span class='fw-light text-uppercase'>"+ mainmenu + "</span></a>\
                                                              <ul>"
        for (j in sortedcategories) {
          const captionlevel_1 = sortedcategories[j]["adm_menu_mobile_translations"][0]["translation"]
          const idMenuLevel_1 = sortedcategories[j]["id_menu"]
          const sublevel_1 = sortedcategories[j]["subCategories"]
          const parent_1 = sortedcategories[j]["parent_id"]
          const status_1 = sortedcategories[j]["status"]
          const page_1 = sortedcategories[j]["page"]
          const icon_1 = page_1 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
          if (status_1 == "1") {
            cek_1 = "checked"
          } else {
            cek_1 = ""
          }
          detailMenu += "\
                                                                  <li>"+ icon_1 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_1 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_1 + "' onclick='parentMenu(id)' id='" + idMenuLevel_1 + "'' name='menuAccesss' " + cek_1 + "></span></a>\
                                                                      <ul>"
          for (k in sublevel_1) {
            const captionlevel_2 = sublevel_1[k]["adm_menu_mobile_translations"][0]["translation"]
            const idMenuLevel_2 = sublevel_1[k]["id_menu"]
            const parent_2 = sublevel_1[k]["parent_id"]
            const sublevel_2 = sublevel_1[k]["subCategories"]
            const status_2 = sublevel_1[k]["status"]
            const page_2 = sublevel_1[k]["page"]
            const icon_2 = page_2 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
            if (status_2 == "1") {
              cek_2 = "checked"
            } else {
              cek_2 = ""
            }
            detailMenu += "\
                                                                          <li class='parent_li'>"+ icon_2 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_2 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_2 + "' parentid='" + parent_2 + "' onclick='parentMenu(id)' id='" + idMenuLevel_2 + "'' name='menuAccesss' " + cek_2 + "></span></a>\
                                                                          <ul>"
            for (l in sublevel_2) {
              const captionlevel_3 = sublevel_2[l]["adm_menu_mobile_translations"][0]["translation"]
              const idMenuLevel_3 = sublevel_2[l]["id_menu"]
              const parent_3 = sublevel_2[l]["parent_id"]
              const sublevel_3 = sublevel_2[l]["subCategories"]
              const status_3 = sublevel_2[l]["status"]
              const page_3 = sublevel_2[l]["page"]
              const icon_3 = page_3 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
              if (status_3 == "1") {
                cek_3 = "checked"
              } else {
                cek_3 = ""
              }
              detailMenu += "\
                                                                              <li class='parent_li'>"+ icon_3 + "<a><span class='fw-light text-dark text-uppercase'>" + captionlevel_3 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_3 + "'  parentid='" + parent_3 + "' onclick='parentMenu(id)' id='" + idMenuLevel_3 + "'' name='menuAccesss' " + cek_3 + "></span></a>\
                                                                                  <ul>"
              for (m in sublevel_3) {
                const captionlevel_4 = sublevel_3[m]["adm_menu_mobile_translations"][0]["translation"]
                const idMenuLevel_4 = sublevel_3[m]["id_menu"]
                const parent_4 = sublevel_3[m]["parent_id"]
                const status_4 = sublevel_3[m]["status"]
                if (status_4 == "1") {
                  cek_4 = "checked"
                } else {
                  cek_4 = ""
                }
                detailMenu += "\
                                                                                                        <li class='parent_li'><a><span class='fw-light text-dark text-uppercase'>" + captionlevel_4 + " <input class='form-check-input' type='checkbox' value='" + idMenuLevel_4 + "' parentid='" + parent_4 + "' onclick='parentMenu(id)' id='" + idMenuLevel_4 + "'' name='menuAccesss' " + cek_4 + "></span></a>"
              }

              detailMenu += "\
                                                                                                          </ul>\
                                                                                                        </li>"
            }
            detailMenu += "\
                                                                                                          </ul>\
                                                                                                        </li>"
          }
          detailMenu += "\
                                                                  </ul>\
                                                          </li>"
        }
        detailMenu += "\
                                                          </ul>\
                                                      </li>\
                                                  </ul>"

        await scriptTree()
        document.getElementById("treeAccess").innerHTML = detailMenu;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/company";
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
async function updateAccessMobile() {
  const username = document.getElementById("selectUsernameAccess").value
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const usernameLogin = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var userAccess = [];
  $("input:checkbox[name=menuAccesss]:checked").each(function () {
    userAccess.push($(this).val());
  });
  if (userAccess == "") {
    Dashmix.helpers('jq-notify', { type: 'danger', z_index: 2000, icon: 'fa fa-exclamation me-1', message: select_access });
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/update/authenticationmobile";
  xhr.onloadstart = function () {
    document.getElementById("loadAccess").innerHTML =
      "<button class='btn btn-primary shadow' type='button' disabled>\n\
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
  var menuAcces = []
  for (i = 0; i < userAccess.length; i++) {
    userprivilege_POST = JSON.parse('{"userprivilege_POST":' + userAccess[i] + '}')
    username_POST = JSON.parse('{"username_POST":"' + username + '"}')
    $.extend(userprivilege_POST, username_POST);
    menuAcces.push(userprivilege_POST)
  }
  const languageData = JSON.parse('{"language_POST":"' + language + '"}')
  const usernameData = JSON.parse('{"username_POST":"' + usernameLogin + '"}')
  var dataMenuAccess = {
    dataAuth: menuAcces,
    dataLanguage: languageData,
    dataUsername: usernameData,
  }
  var data = JSON.stringify(dataMenuAccess);
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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
function headersMenuAccessMobile(param, cancel, done) {
  let content = "<a id='cancelBtn' onclick='closeModal()' class='btn btn-danger'>" + kapital(cancel) + "</a> ";

  if (param == "edit") {
    content += "<button type='submit' onclick='updateAccessMobile()' class='btn btn-primary'>" + kapital(done) + "</button>";
  } else {
    content += "<button type='submit' onclick='updateCopyAccessMobile()' class='btn btn-primary'>" + kapital(done) + "</button>";
  }
  document.getElementById("loadAccess").innerHTML = content;
}
async function updateCopyAccessMobile() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  const target = document.getElementById("selectUsernameAccess").value
  const source = document.getElementById("selectUsernameCopy").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery("#formAccess").validate({
            ignore: [],
            rules: {
              "selectUsernameCopy": { required: !0 },
            },
            messages: {
              "selectUsernameCopy": required,
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
  if (source == "") {
    return source !== "";
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "users/update/copyauthenticationmobile";
  xhr.onloadstart = function () {
    document.getElementById("loadAccess").innerHTML =
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

  var data = JSON.stringify(
    {
      language_POST: language,
      target_POST: target,
      source_POST: source,
      username_POST: username
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
          window.location.href = "/users";
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
          window.location.href = "/users";
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