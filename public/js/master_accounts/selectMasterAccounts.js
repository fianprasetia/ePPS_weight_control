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
    await selectMasterAccounts();
    async function dataContent(data) {
        var filterLanguage = data.filter(
            filtercontent => filtercontent.language == language
        );
        const content = filterLanguage[0]["content"];
        document.getElementById("masterAccountsPage").innerHTML = content["master_coa"];
        document.getElementById("masterAccountsTitle").innerHTML = content["master_coa"];
        document.getElementById("entityLabel").innerHTML = content["entity"] + "<span class='text-danger'>*</span>"
        document.getElementById("statusLabel").innerHTML = content["status"] + "<span class='text-danger'>*</span>"
    }
}
// async function selectMasterAccounts() {
//     const language = await JSON.parse(getCookie("language"));
//     var token = await JSON.parse(getCookie("dataToken"));
//     if (token == null) {
//         await getAccessToken()
//     }
//     var xhr = new XMLHttpRequest();
//     var url = mainUrl + "coa"
//     xhr.onerror = function () {
//         Dashmix.helpers("jq-notify", {
//             type: "danger",
//             z_index: 2000,
//             icon: "fa fa-exclamation me-1",
//             message: overload,
//         });
//         setTimeout(async function () {
//             await keluar()
//         }, 3000);
//     };
//     var data = JSON.stringify({
//         language_POST: language,
//     });
//     xhr.onloadend = async function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var response = await JSON.parse(xhr.response);
//             if (response["access"] == "success") {
//                 // Data response
//                 var responseData = response["data"];

//                 // Ubah code_coa dan parent_coa ke int
//                 responseData.forEach((item) => {
//                     item.code_coa = parseInt(item.code_coa, 10);
//                     item.parent_coa = item.parent_coa ? parseInt(item.parent_coa, 10) : null; // Ubah "0" menjadi null
//                 });


//                 // Bangun hierarki data
//                 responseData.filter((c) => c.parent_coa !== null).forEach((c) => {
//                     const parent = responseData.find((p) => p.code_coa === c.parent_coa);
//                     if (parent) {
//                         parent.subCategories = parent.subCategories || [];
//                         parent.subCategories.push(c);
//                     }
//                 });

//                 responseData = responseData.filter((c) => !c.parent_coa);
//                 detailMenu = "<div class='space-x-1 text-start mb-3'>\
//                                     <button type='button' class='btn btn-outline-secondary fw-light text-dark text-uppercase' id='expandAll'>"+ expand_all + "</button>\
//                                 </div>"
//                 detailMenu += "<ul>\
//                                                         <li>\
//                                                             <a id='treeMainMenu'><span class='fw-light text-uppercase'>"+ master_coa + "</span></a>\
//                                                                 <ul>"
//                 // var idCoaLevel_1
//                 for (j in responseData) {
//                     let captionlevel_1 = responseData[j]["fat_coa_translations"][0]["translation"]
//                     let idCoaLevel_1 = responseData[j]["code_coa"]
//                     let sublevel_1 = responseData[j]["subCategories"]
//                     let typelevel_1 = responseData[j]["type_coa"]
//                     let coalevel_1 = responseData[j]["level_coa"]
//                     let parentlevel_1 = responseData[j]["parent_coa"]
//                     detailMenu += "\
//                                                                     <li><span>"+ idCoaLevel_1 + "</span><a href='#' code='" + idCoaLevel_1 + "' id='btnupdate" + idCoaLevel_1 + "' onclick='showModalUpdateMasterAccounts(this)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_1 + "</span></a>\
//                                                                         <ul>"
//                     for (k in sublevel_1) {
//                         let captionlevel_2 = sublevel_1[k]["fat_coa_translations"][0]["translation"]
//                         let idCoaLevel_2 = sublevel_1[k]["code_coa"]
//                         let sublevel_2 = sublevel_1[k]["subCategories"]
//                         let typelevel_2 = sublevel_1[k]["type_coa"]
//                         let coalevel_2 = sublevel_1[k]["level_coa"]
//                         let parentlevel_2 = sublevel_1[k]["parent_coa"]
//                         detailMenu += "\
//                                                                                 <li class='parent_li'><span>"+ idCoaLevel_2 + "</span><a href='#' code='" + idCoaLevel_2 + "' id='btnupdate" + idCoaLevel_2 + "' onclick='showModalUpdateMasterAccounts(this)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_2 + " </span></a>\
//                                                                                 <ul>"
//                         for (l in sublevel_2) {
//                             let captionlevel_3 = sublevel_2[l]["fat_coa_translations"][0]["translation"]
//                             let idCoaLevel_3 = sublevel_2[l]["code_coa"]
//                             let sublevel_3 = sublevel_2[l]["subCategories"]
//                             let typelevel_3 = sublevel_2[l]["type_coa"]
//                             let coalevel_3 = sublevel_2[l]["level_coa"]
//                             let parentlevel_3 = sublevel_2[l]["parent_coa"]
//                             detailMenu += "\
//                                                                                     <li class='parent_li'><span>"+ idCoaLevel_3 + "</span><a href='#' code='" + idCoaLevel_3 + "' id='btnupdate" + idCoaLevel_3 + "' onclick='showModalUpdateMasterAccounts(this)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_3 + "</span></a>\
//                                                                                         <ul>"
//                             for (m in sublevel_3) {
//                                 let captionlevel_4 = sublevel_3[m]["fat_coa_translations"][0]["translation"]
//                                 let idCoaLevel_4 = sublevel_3[m]["code_coa"]
//                                 let sublevel_4 = sublevel_3[m]["subCategories"]
//                                 let typelevel_4 = sublevel_3[m]["type_coa"]
//                                 let coalevel_4 = sublevel_3[m]["level_coa"]
//                                 let parentlevel_4 = sublevel_3[m]["parent_coa"]
//                                 detailMenu += "\
//                                                                                                               <li class='parent_li'><span>"+ idCoaLevel_4 + "</span><a href='#' code='" + idCoaLevel_4 + "' id='btnupdate" + idCoaLevel_4 + "' onclick='showModalUpdateMasterAccounts(this)''><span class='fw-light text-dark text-uppercase'>" + captionlevel_4 + " </span></a>\
//                                                                                                               <ul>"
//                                 for (n in sublevel_4) {
//                                     captionlevel_5 = sublevel_4[n]["fat_coa_translations"][0]["translation"]
//                                     idCoaLevel_5 = sublevel_4[n]["code_coa"]

//                                     detailMenu += "\
//                                                                                                                 <li class='parent_li'><span>"+ idCoaLevel_5 + "</span><a href='#' code='" + idCoaLevel_5 + "' id='btnupdate" + idCoaLevel_5 + "' onclick='showModalUpdateMasterAccounts(this)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_5 + " </span></a>"

//                                     detailMenu += "\
//                                                                                                                 </li>"
//                                 }
//                                 detailMenu += "\
//                                                                                                                     <li class='parent_li'><a  href='#' ><span onclick='showModalInsertMasterAccounts(this)' type='"+ typelevel_4 + "' parent='" + idCoaLevel_4 + "' level='5'  id='btn" + idCoaLevel_4 + "'  class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
//                                                                                                                 </ul>\
//                                                                                                             </li>"
//                             }
//                             detailMenu += "\
//                                                                                                                     <li class='parent_li'><a  href='#' ><span onclick='showModalInsertMasterAccounts(this)' type='"+ typelevel_3 + "' parent='" + idCoaLevel_3 + "' level='4'  id='btn" + idCoaLevel_3 + "'  class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
//                                                                                                                 </ul>\
//                                                                                                             </li>"
//                         }
//                         detailMenu += "\
//                                                                                                                     <li class='parent_li'><a  href='#' ><span onclick='showModalInsertMasterAccounts(this)'  type='"+ typelevel_2 + "' parent='" + idCoaLevel_2 + "' level='3' id='btn" + idCoaLevel_2 + "'  class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
//                                                                                                                 </ul>\
//                                                                                                             </li>"
//                     }
//                     detailMenu += "\
//                                                                                                                     <li class='parent_li'><a href='#' ><span onclick='showModalInsertMasterAccounts(this)' type='"+ typelevel_1 + "' parent='" + idCoaLevel_1 + "' level='2' id='btn" + idCoaLevel_1 + "' class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
//                                                                                                                 </ul>\
//                                                                                                             </li>"
//                 }
//                 detailMenu += "\
//                                                             </ul>\
//                                                         </li>\
//                                                     </ul>"

//                 await scriptTree()
//                 document.getElementById("treeMenu").innerHTML = detailMenu;
//             } else if (response["access"] == "failed") {
//                 message = response["message"];
//                 Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
//                 setTimeout(function () {
//                     window.location.href = "/company";
//                 }, 3000);
//             }
//         } if (this.status == 404) {
//             message = "Data failed";
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
//             setTimeout(async function () {
//                 window.location.href = "/";
//             }, 3000);
//         } if (this.status == 401) {
//             message = "data failed to load";
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
//             setTimeout(async function () {
//                 window.location.href = "/";
//             }, 3000);
//         } if (this.status == 500) {
//             Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
//             setTimeout(function () {
//                 window.location.href = "/";
//             }, 3000);
//         }
//     };
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhr.setRequestHeader("Authorization", "Bearer " + token);
//     xhr.send(data);
//     return false;
// }
async function selectMasterAccounts() {
    const language = await JSON.parse(getCookie("language"));
   var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }

    const xhr = new XMLHttpRequest();
    const url = mainUrl + "coa";
    const data = JSON.stringify({ language_POST: language });

    xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            message:overload,
        });
        setTimeout(async () => {
            await keluar();
        }, 3000);
    };

    xhr.onloadend = async function () {
        if (this.readyState !== 4) return;

        const status = this.status;
        const response = status === 200 ? JSON.parse(xhr.response) : null;

        if (status === 200 && response?.access === "success") {
            let responseData = response.data;

            // Parsing COA codes to integer
            responseData.forEach(item => {
                item.code_coa = parseInt(item.code_coa, 10);
                item.parent_coa = item.parent_coa ? parseInt(item.parent_coa, 10) : null;
            });

            // Build hierarchy
            responseData.filter(c => c.parent_coa !== null).forEach(c => {
                const parent = responseData.find(p => p.code_coa === c.parent_coa);
                if (parent) {
                    parent.subCategories = parent.subCategories || [];
                    parent.subCategories.push(c);
                }
            });

            // Filter top-level only
            responseData = responseData.filter(c => !c.parent_coa);

            let detailMenu = `
                <div class='space-x-1 text-start mb-3'>
                    <button type='button' class='btn btn-outline-secondary fw-light text-dark text-uppercase' id='expandAll'>${expand_all}</button>
                </div>
                <ul>
                    <li>
                        <a id='treeMainMenu'>
                            <span class='fw-light text-uppercase'>${master_coa}</span>
                        </a>
                        <ul>`;

            for (const level1 of responseData) {
                const { code_coa: id1, type_coa: type1, level_coa: level1Num, fat_coa_translations: trans1, subCategories: sub1 = [] } = level1;
                detailMenu += `
                    <li>
                        <span>${id1}</span>
                        <a href='#' code='${id1}' id='btnupdate${id1}' onclick='showModalUpdateMasterAccounts(this)'>
                            <span class='fw-light text-dark text-uppercase'>${trans1[0].translation}</span>
                        </a>
                        <ul>`;

                for (const level2 of sub1) {
                    const { code_coa: id2, type_coa: type2, fat_coa_translations: trans2, subCategories: sub2 = [] } = level2;
                    detailMenu += `
                        <li class='parent_li'>
                            <span>${id2}</span>
                            <a href='#' code='${id2}' id='btnupdate${id2}' onclick='showModalUpdateMasterAccounts(this)'>
                                <span class='fw-light text-dark text-uppercase'>${trans2[0].translation}</span>
                            </a>
                            <ul>`;

                    for (const level3 of sub2) {
                        const { code_coa: id3, type_coa: type3, fat_coa_translations: trans3, subCategories: sub3 = [] } = level3;
                        detailMenu += `
                            <li class='parent_li'>
                                <span>${id3}</span>
                                <a href='#' code='${id3}' id='btnupdate${id3}' onclick='showModalUpdateMasterAccounts(this)'>
                                    <span class='fw-light text-dark text-uppercase'>${trans3[0].translation}</span>
                                </a>
                                <ul>`;

                        for (const level4 of sub3) {
                            const { code_coa: id4, type_coa: type4, fat_coa_translations: trans4, subCategories: sub4 = [] } = level4;
                            detailMenu += `
                                <li class='parent_li'>
                                    <span>${id4}</span>
                                    <a href='#' code='${id4}' id='btnupdate${id4}' onclick='showModalUpdateMasterAccounts(this)'>
                                        <span class='fw-light text-dark text-uppercase'>${trans4[0].translation}</span>
                                    </a>
                                    <ul>`;

                            for (const level5 of sub4) {
                                const { code_coa: id5, fat_coa_translations: trans5 } = level5;
                                detailMenu += `
                                        <li class='parent_li'>
                                            <span>${id5}</span>
                                            <a href='#' code='${id5}' id='btnupdate${id5}' onclick='showModalUpdateMasterAccounts(this)'>
                                                <span class='fw-light text-dark text-uppercase'>${trans5[0].translation}</span>
                                            </a>
                                        </li>`;
                            }

                            detailMenu += `
                                        <li class='parent_li'>
                                            <a href='#'>
                                                <span onclick='showModalInsertMasterAccounts(this)' type='${type4}' parent='${id4}' level='5' id='btn${id4}' class='fw-light text-dark text-uppercase'>${add}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>`;
                        }

                        detailMenu += `
                                    <li class='parent_li'>
                                        <a href='#'>
                                            <span onclick='showModalInsertMasterAccounts(this)' type='${type3}' parent='${id3}' level='4' id='btn${id3}' class='fw-light text-dark text-uppercase'>${add}</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>`;
                    }

                    detailMenu += `
                                <li class='parent_li'>
                                    <a href='#'>
                                        <span onclick='showModalInsertMasterAccounts(this)' type='${type2}' parent='${id2}' level='3' id='btn${id2}' class='fw-light text-dark text-uppercase'>${add}</span>
                                    </a>
                                </li>
                            </ul>
                        </li>`;
                }

                detailMenu += `
                            <li class='parent_li'>
                                <a href='#'>
                                    <span onclick='showModalInsertMasterAccounts(this)' type='${type1}' parent='${id1}' level='2' id='btn${id1}' class='fw-light text-dark text-uppercase'>${add}</span>
                                </a>
                            </li>
                        </ul>
                    </li>`;
            }

            detailMenu += `
                        </ul>
                    </li>
                </ul>`;

            await scriptTree();
            document.getElementById("treeMenu").innerHTML = detailMenu;
            setTimeout(() => {
                hideSpinner();
            }, 1000);
        } else {
            let message = "";
            switch (status) {
                case 404:
                    message = status_404;
                    break;
                case 401:
                    message = status_401;
                    break;
                case 500:
                    message = status_500;
                    break;
                default:
                    message = response?.message || "Unknown error";
            }

            Dashmix.helpers("jq-notify", {
                type: "danger",
                z_index: 2000,
                icon: "fa fa-times me-1",
                message,
            });

            setTimeout(() => {
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
            document.getElementById("rowMenu").hidden = false
        }, 1000);
    });
}
async function selectCompany(code) {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "company/coa"
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
                var filterSubData = responseData.filter((filterSubData) => filterSubData.code_company == code);
                var filternotSubData = responseData.filter((filternotSubData) => filternotSubData.code_company != code);
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
                    mainOptionItem += "<option class='fw-light text-uppercase' value=" + filterSubData[0]["code_company"] + ">" + kapital(filterSubData[0]["name"]) + "</option>";
                }

                document.getElementById("entity").innerHTML = mainOptionItem + "" + subOptionItem;
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