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
    document.getElementById("companyPage").innerHTML = filterLanguage[0]["content"]["company"]
    document.getElementById("titleCompany").innerHTML = filterLanguage[0]["content"]["company"]
    document.getElementById("codeLabel").innerHTML = filterLanguage[0]["content"]["code"] + "<span class='text-danger'>*</span>"
    document.getElementById("nameLabel").innerHTML = filterLanguage[0]["content"]["name"] + "<span class='text-danger'>*</span>"
    document.getElementById("typeLabel").innerHTML = filterLanguage[0]["content"]["type"] + "<span class='text-danger'>*</span>"
    document.getElementById("addressLabel").innerHTML = filterLanguage[0]["content"]["address"]
    document.getElementById("provinceLabel").innerHTML = filterLanguage[0]["content"]["province"]
    document.getElementById("phone_numberLabel").innerHTML = filterLanguage[0]["content"]["phone_number"]
    document.getElementById("emailLabel").innerHTML = filterLanguage[0]["content"]["email"]
    document.getElementById("cityLabel").innerHTML = filterLanguage[0]["content"]["city"]
    document.getElementById("zip_codeLabel").innerHTML = filterLanguage[0]["content"]["zip_code"]
    document.getElementById("taxLabel").innerHTML = filterLanguage[0]["content"]["tax_identification_number"]
    document.getElementById("capacityLabel").innerHTML = filterLanguage[0]["content"]["capacity"]
    await selectCompany()
  }
}
async function selectCompany() {
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "company"
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
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
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        responseData.filter((c) => c.parent_code).forEach((c) => {
          const parent = responseData.find((p) => p.code_company === c.parent_code);
          parent.subCategories = parent.subCategories || [];
          parent.subCategories.push(c);
        });
        responseData = responseData.filter((c) => !c.parent_code);
        for (i in responseData)
          captionlevel_1 = responseData[i]["name"]
        codeCompanylevel_1 = responseData[i]["code_company"]
        sublevel_1 = responseData[i]["subCategories"]
        {
          detailCompany = "\
                                            <ul>\
                                                <li><a href='#' ><span class='fw-light text-dark text-uppercase'>"+ captionlevel_1 + "</span></a>\
                                                    <ul>"
          for (j in sublevel_1) {
            captionlevel_2 = sublevel_1[j]["name"]
            codeCompanylevel_2 = sublevel_1[j]["code_company"]
            sublevel_2 = sublevel_1[j]["subCategories"]
            detailCompany += "\
                                                          <li><span><i class='fa fa-plus-square'></i></span><a href='#' levelUpdate='02' id='"+ codeCompanylevel_2 + "' onclick='showModalUpdateCompany(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_2 + "</span></a>\
                                                                  <ul>"
            for (k in sublevel_2) {
              captionlevel_3 = sublevel_2[k]["name"]
              codeCompanylevel_3 = sublevel_2[k]["code_company"]
              sublevel_3 = sublevel_2[k]["subCategories"]
              detailCompany += "\
                                                                      <li class='parent_li'><span><i class='fa fa-plus-square'></i></span><a levelUpdate='03'  href='#' id='"+ codeCompanylevel_3 + "' onclick='showModalUpdateCompany(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_3 + "</span></a>\
                                                                        <ul>"
              for (l in sublevel_3) {
                captionlevel_4 = sublevel_3[l]["name"]
                codeCompanylevel_4 = sublevel_3[l]["code_company"]
                sublevel_4 = sublevel_3[l]["subCategories"]
                detailCompany += "\
                                                                      <li class='parent_li'><span><i class='fa fa-plus-square'></i></span><a levelUpdate='04'  href='# 'id='"+ codeCompanylevel_4 + "' onclick='showModalUpdateCompany(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_4 + "</span></a>\
                                                                          <ul>"
                for (m in sublevel_4) {
                  captionlevel_5 = sublevel_4[m]["name"]
                  codeCompanylevel_5 = sublevel_4[m]["code_company"]
                  sublevel_5 = sublevel_4[m]["subCategories"]
                  detailCompany += "\
                                                                      <li class='parent_li'><a levelUpdate='05' href='#' id='"+ codeCompanylevel_5 + "' onclick='showModalUpdateCompany(id)'><span class='fw-dark text-dark text-uppercase'>" + captionlevel_5 + "</span></a>"
                }

                detailCompany += "\
                                                                           <li class='parent_li'><a  href='#' length='10' leveladd='05' id='"+ codeCompanylevel_4 + "' onclick='showModalInsertCompany(this)'><span class='fw-dark text-dark text-uppercase'>" + add + "</span></a></li>\
                                                                        </ul>\
                                                                      </li>"
              }
              detailCompany += "\
                                                                           <li class='parent_li'><a  length='6' leveladd='04' href='#' id='"+ codeCompanylevel_3 + "' onclick='showModalInsertCompany(this)'><span class='fw-dark text-dark text-uppercase'>" + add + "</span></a></li>\
                                                                        </ul>\
                                                                      </li>"
            }
            detailCompany += "\
                                                                      <li class='parent_li'><a href='#' length='4' leveladd='03' id='"+ codeCompanylevel_2 + "' onclick='showModalInsertCompany(this)'><span class='fw-dark text-dark text-uppercase'>" + add + "</span></a></li>\
                                                                  </ul>\
                                                          </li>"
          }
          detailCompany += "\
                                                          <li><a href='#' length='3' leveladd='02' id='"+ codeCompanylevel_1 + "' onclick='showModalInsertCompany(this)'><span class='fw-light text-dark text-uppercase'>" + add + "</span></a></li>\
                                                    </ul>\
                                                </li>\
                                            </ul>"
        }
        await scriptTree()
        document.getElementById("treeCompany").innerHTML = detailCompany;
        setTimeout(() => {
          hideSpinner();
        }, 1000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(() => {
          hideSpinner();
        }, 1000);
        // setTimeout(function () {
        //   window.location.href = "/";
        // }, 3000);
      }
    } if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    } if (this.status == 401) {
      message = "data failed to load";
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
    setTimeout(function () {
      document.getElementById("rowCompany").hidden = false
    }, 1000);
  });
}
async function selectCompanyType(codeCompany) {
  let language = await JSON.parse(getCookie("language"));
  let token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "companytype"
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
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company_type == codeCompany);
        var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company_type != codeCompany);
        mainOptionItem = "";
        subOptionItem = "";
        for (i = 0; i < filternotSubData.length; i++) {
          subOptionItem +=
            "<option class='fw-light text-uppercase' value='" +
            filternotSubData[i]["code_company_type"] +
            "'>" +
            kapital(filternotSubData[i]["adm_company_type_translations"][0]["translation"]) +
            "</option>";
        }
        if (codeCompany == "" || codeCompany == undefined) {
          mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
        } else {
          mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company_type"] + ">" + kapital(filterSubData[0]["adm_company_type_translations"][0]["translation"]) + "</option>";
        }
      }
      document.getElementById("type").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
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
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}
async function selectProvince(codeProvince) {
  const dataProvince = "file/province.json";
  fetch(dataProvince)
    .then((response) => response.json())
    .then((dataProvince) => dataContent(dataProvince));
  function dataContent(dataProvince) {
    var responseData = dataProvince
    var filterSubData = responseData.filter((filterSubData) => filterSubData.id == codeProvince);
    var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.id != codeProvince);
    mainOptionItem = "";
    subOptionItem = "";
    for (i = 0; i < filternotSubData.length; i++) {
      subOptionItem +=
        "<option class='fw-light text-uppercase' value='" +
        filternotSubData[i]["id"] +
        "'>" +
        kapital(filternotSubData[i]["province"]) +
        "</option>";
    }
    if (codeProvince == "" || codeProvince == undefined) {
      mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
    } else {
      mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["id"] + ">" + kapital(filterSubData[0]["province"]) + "</option>";
    }
    document.getElementById("province").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
  }
}
async function selectCity(codeCity) {
  const dataCity = "file/city.json";
  fetch(dataCity)
    .then((response) => response.json())
    .then((dataCity) => dataContent(dataCity));
  function dataContent(dataCity) {
    var responseData = dataCity
    var filterSubData = responseData.filter((filterSubData) => filterSubData.city == codeCity);
    var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.city != codeCity);
    mainOptionItem = "";
    subOptionItem = "";
    for (i = 0; i < filternotSubData.length; i++) {
      subOptionItem +=
        "<option class='fw-light text-uppercase' value='" +
        filternotSubData[i]["city"] +
        "'>" +
        kapital(filternotSubData[i]["city"]) +
        "</option>";
    }
    if (codeCity == "" || codeCity == undefined) {
      mainOptionItem += "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option>";
    } else {
      mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["city"] + ">" + kapital(filterSubData[0]["city"]) + "</option>";
    }
    document.getElementById("city").innerHTML = "" + mainOptionItem + " " + subOptionItem + "";
  }
}
selectContent();
