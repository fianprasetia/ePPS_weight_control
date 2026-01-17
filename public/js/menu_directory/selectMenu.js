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
        menuDirectory = filterLanguage[0]["content"]["menu_directory"]
        urlPage = filterLanguage[0]["content"]["url_page"]
        icon = filterLanguage[0]["content"]["icon"]
        batch = filterLanguage[0]["content"]["batch"]
        document.getElementById("menuPage").innerHTML = menuDirectory
        document.getElementById("titleMenu").innerHTML = menuDirectory
        document.getElementById("urlLabel").innerHTML = urlPage
        document.getElementById("iconLabel").innerHTML = icon
        document.getElementById("batchLabel").innerHTML = batch
        await selectMenu()
    }
}
async function selectMenu() {
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
   if (!token) {
        token = await getAccessToken(); 
    }
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "menu"
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
                responseData.filter((c) => c.parent_id).forEach((c) => {
                    const parent = responseData.find((p) => p.id_menu === c.parent_id);
                    parent.subCategories = parent.subCategories || [];
                    parent.subCategories.push(c);
                });
                responseData = responseData.filter((c) => !c.parent_id);

                detailMenu = "<ul>\
                                                        <li>\
                                                            <a id='treeMainMenu'><span class='fw-light text-uppercase'>"+ mainmenu + "</span></a>\
                                                                <ul>"
                var idMenuLevel_1 = ""
                for (j in responseData) {
                    captionlevel_1 = responseData[j]["adm_menu_translations"][0]["translation"]
                    idMenuLevel_1 = responseData[j]["id_menu"]
                    sublevel_1 = responseData[j]["subCategories"]
                    noOrdinal_1 = responseData[j]["no_ordinal"]
                    page_1 = responseData[j]["page"]
                    icon_1 = page_1 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
                    detailMenu += "\
                                                                    <li>"+ icon_1 + "<a href='#'  leveladd='2' id='" + idMenuLevel_1 + "' onclick='showModalUpdateMenu(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_1 + "  (" + noOrdinal_1 + ")</span></a>\
                                                                        <ul>"
                    for (k in sublevel_1) {
                        captionlevel_2 = sublevel_1[k]["adm_menu_translations"][0]["translation"]
                        idMenuLevel_2 = sublevel_1[k]["id_menu"]
                        noOrdinal_2 = sublevel_1[k]["no_ordinal"]
                        parent_2 = sublevel_1[k]["parent_id"]
                        sublevel_2 = sublevel_1[k]["subCategories"]
                        page_2 = sublevel_1[k]["page"]
                        icon_2 = page_2 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
                        detailMenu += "\
                                                                            <li class='parent_li'>"+ icon_2 + "<a leveladd='3'  href='#' id='" + idMenuLevel_2 + "' onclick='showModalUpdateMenu(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_2 + "  (" + noOrdinal_2 + ")</span></a>\
                                                                            <ul>"
                        for (l in sublevel_2) {
                            captionlevel_3 = sublevel_2[l]["adm_menu_translations"][0]["translation"]
                            var idMenuLevel_3 = sublevel_2[l]["id_menu"]
                            noOrdinal_3 = sublevel_2[l]["no_ordinal"]
                            sublevel_3 = sublevel_2[l]["subCategories"]
                            page_3 = sublevel_2[l]["page"]
                            icon_3 = page_3 === "" ? "<span><i class='fa fa-plus-square'></i></span>" : "";
                            detailMenu += "\
                                                                                <li class='parent_li'>"+ icon_3 + "<a leveladd='3'  href='#'id='" + idMenuLevel_3 + "' onclick='showModalUpdateMenu(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_3 + " (" + noOrdinal_3 + ")</span></a>\
                                                                                    <ul>"
                            for (m in sublevel_3) {
                                captionlevel_4 = sublevel_3[m]["adm_menu_translations"][0]["translation"]
                                idMenuLevel_4 = sublevel_3[m]["id_menu"]
                                noOrdinal_4 = sublevel_3[m]["no_ordinal"]
                                sublevel_4 = sublevel_3[m]["subCategories"]
                                detailMenu += "\
                                                                                                          <li class='parent_li'><a leveladd='4' href='#' id='"+ idMenuLevel_4 + "' onclick='showModalUpdateMenu(id)'><span class='fw-light text-dark text-uppercase'>" + captionlevel_4 + " (" + noOrdinal_4 + ")</span></a>"
                            }

                            detailMenu += "\
                                                                                                               <li class='parent_li'><a  href='#' ><span onclick='showModalInsertMenu(id)' id='"+ idMenuLevel_3 + "'  class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
                                                                                                            </ul>\
                                                                                                          </li>"
                        }
                        detailMenu += "\
                                                                                                               <li class='parent_li'><a  href='#' ><span onclick='showModalInsertMenu(id)' id='"+ idMenuLevel_2 + "'  class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
                                                                                                            </ul>\
                                                                                                          </li>"
                    }
                    detailMenu += "\
                                                                        <li class='parent_li'><a href='#' ><span onclick='showModalInsertMenu(id)' id='"+ idMenuLevel_1 + "' class='fw-light text-dark  text-uppercase'>" + add + "</span></a></li>\
                                                                    </ul>\
                                                            </li>"
                }
                detailMenu += "\
                                                                    <li><a href='#' leveladd='1' id='0' onclick='showModalInsertMenu(id)'><span class='fw-light text-dark text-uppercase'>" + add + "</span></a></li>\
                                                            </ul>\
                                                        </li>\
                                                    </ul>"

                await scriptTree()
                document.getElementById("treeMenu").innerHTML = detailMenu;
                setTimeout(() => {
                    hideSpinner();
                }, 1000);
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
            document.getElementById("rowMenu").hidden = false
        }, 1000);
    });
}
selectContent() 