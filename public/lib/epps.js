// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("page-container").style.zoom = "80%";
// });



testClientBandwidth()
window.addEventListener("DOMContentLoaded", () => {
  const iconColor = localStorage.getItem("bandwidthIconColor");
  const keterangan = localStorage.getItem("bandwidthKeterangan");
  const speed = localStorage.getItem("bandwidthSpeed");

  if (iconColor && keterangan) {
    document.getElementById("connection").innerHTML = `<i class="fa-solid fa-signal ${iconColor}"></i>`;
    document.getElementById("textConnection").innerHTML = `${keterangan} (${speed} Mbps)`
  } else {
    // Kalau belum pernah diukur, tampilkan ikon abu-abu
    document.getElementById("connection").innerHTML = `<i class="fa-solid fa-signal text-gray"></i>`;
  }
});

async function testClientBandwidth() {
  const xhr = new XMLHttpRequest();
  const fileSizeInBits = 5 * 1024 * 1024 * 8;
  const start = performance.now();

  xhr.open("GET", mainUrl + "download-test-file.bin", true);
  xhr.responseType = "blob";

  xhr.onload = function () {
    const end = performance.now();
    const durationInSeconds = (end - start) / 1000;
    const speedMbps = (fileSizeInBits / durationInSeconds) / (1024 * 1024);

    let keterangan = "";
    let iconColor = "text-secondary";

    if (speedMbps < 1) {
      keterangan = weak;
      iconColor = "text-danger";
    } else if (speedMbps <= 4) {
      keterangan = enough;
      iconColor = "text-warning";
    } else if (speedMbps <= 20) {
      keterangan = normal;
      iconColor = "text-info";
    } else if (speedMbps <= 50) {
      keterangan = good;
      iconColor = "text-success";
    } else {
      keterangan = fast;
      iconColor = "text-success";
    }

    // Simpan hasil ke localStorage
    localStorage.setItem("bandwidthTested", "true");
    localStorage.setItem("bandwidthIconColor", iconColor);
    localStorage.setItem("bandwidthKeterangan", keterangan);
    localStorage.setItem("bandwidthSpeed", speedMbps.toFixed(2));


    // Tampilkan ikon koneksi
    document.getElementById("connection").innerHTML = `<i class="fa-solid fa-signal ${iconColor}"></i>`;
    document.getElementById("textConnection").innerHTML = `${keterangan} (${speedMbps.toFixed(2)} Mbps)`
  };

  xhr.onerror = function () {
    console.error("Gagal mengunduh file untuk tes bandwidth.");
    document.getElementById("connection").innerHTML =
      `<i class="fa-solid fa-signal text-muted" title="Gagal mengukur koneksi"></i>`;
  };
  xhr.send();
}
authorize()
async function authorize() {
  const path = window.location.pathname;
  if (path === "/") return; // Skip pengecekan untuk root path
  try {
    const { dataMenu } = JSON.parse(sessionStorage.getItem("epps_session_menu"))[0];
    const pathExists = dataMenu.some(item => item.page?.trim() === path);
    if (!pathExists) {
      window.location.href = "/";
      return;
    }
    window.history.replaceState({}, "", "/");
  } catch (error) {
    console.error("Authorization error:", error);
    window.location.href = "/"; // Fallback ke home jika error
  }
}
function toggleDarkMode() {
  // Mengganti mode gelap
  Dashmix.layout("dark_mode_toggle");

  // Cek apakah mode gelap aktif dan simpan ke localStorage
  const isDarkMode = document.body.classList.toggle("dark-mode"); // Menambahkan atau menghapus class dari body
  localStorage.setItem("darkMode", isDarkMode);

  // Tambahkan atau hapus class dari page-container
  const pageContainer = document.getElementById("page-container");
  if (isDarkMode) {
    pageContainer.classList.add("page-header-dark");
  } else {
    Dashmix.layout("dark_mode_toggle");
    document.body.classList.remove("dark-mode");
    document.getElementById("page-container").classList.remove("page-header-dark");
  }
  setTimeout(() => {
    location.reload();
  }, 200);
}
checkDarkMode();
function checkDarkMode() {
  // Ambil status dari localStorage
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Terapkan mode gelap jika aktif
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("page-container").classList.add("page-header-dark");
    document.getElementById("iconNavigator").innerHTML = `<i class="fa fa-moon" id="dark-mode-toggler"></i>`;
  } else {
    document.body.classList.remove("dark-mode");
    document.getElementById("page-container").classList.remove("page-header-dark");
    document.getElementById("iconNavigator").innerHTML = `<i class="far fa-moon" id="dark-mode-toggler"></i>`;
  }
}
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const sessionLogin = JSON.parse(getCookie("dataLogin"));
    const language = JSON.parse(getCookie("language"));
    const username = sessionLogin["username"];

    const xhr = new XMLHttpRequest();
    const url = mainUrl + "token";
    const data = JSON.stringify({
      username_POST: username,
      language_POST: language
    });

    xhr.onloadend = function () {
      if (this.readyState === 4 && this.status === 200) {
        const responseLogin = JSON.parse(xhr.response);
        if (responseLogin["access"] === "success") {
          const accessToken = responseLogin["data"];
          setCookieToken("dataToken", JSON.stringify(accessToken), 15);
          resolve(accessToken); // ✅ token baru dikembalikan
        } else {
          const message = responseLogin["message"];
          Dashmix.helpers("jq-notify", {
            z_index: 2000,
            type: "danger",
            icon: "fa fa-times me-1",
            message: message
          });
          clearCookies();
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
          reject(new Error(message));
        }
      } else if (this.status !== 200) {
        reject(new Error("Failed to fetch token"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
  });
}

// async function getAccessToken() {
//   var sessionLogin = await JSON.parse(getCookie("dataLogin"));
//   const language = await JSON.parse(getCookie("language"));
//   username = sessionLogin["username"];
//   var xhr = new XMLHttpRequest();
//   var url = mainUrl + "token";
//   var data = JSON.stringify({
//     username_POST: username,
//     language_POST: language
//   });
//   xhr.onloadend = async function () {
//     if (this.readyState == 4 && this.status == 200) {
//       var responseLogin = await JSON.parse(xhr.response);
//       if (responseLogin["access"] == "success") {
//         var accessToken = responseLogin["data"];
//         const dataTokenString = JSON.stringify(accessToken);
//         setCookieToken("dataToken", dataTokenString, 60);
//       } else if (responseLogin["access"] == "failed") {
//         message = responseLogin["message"];
//         Dashmix.helpers("jq-notify", {
//           z_index: 2000,
//           type: "danger",
//           icon: "fa fa-times me-1",
//           message: message
//         });
//         await clearCookies();
//         setTimeout(async function () {
//           window.location.href = "/login";
//         }, 3000);
//       }
//     }
//   };
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xhr.send(data);
//   return false;
// }
function setCookieToken(name, value, minutes) {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000); // Mengatur waktu kadaluarsa
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
content();
let alertLogout;
let purchase_request;
let goods_receipt;
let approval;
let add
let overload
let select
let done
let cancel
let loading
let edit
let required
let status_500
let status_404
let status_401
let worksite
let action
let approval_type
let all
let minutes
let active
let nonactive
let employee_id
let record
let no_new_record
let notice_posting;
let notice_delete;
let notice_date_request;
let request;
let waiting_approval;
let approve;
let finding_suppliers;
let reject;
let minlengthchar;
let termofpayment;
let datepo;
let deliveryDate;
let currency;
let receivingLocations;
let note;
let master_coa;
let mainmenu
let number
let select_access
let expand_all
let no_item;
let changepassword;
let passwordnotmacth;
let webmenuaccess;
let mobilemenuaccess;
let copy_another_user;
let copy_access;
let edit_access;
let cash;
let credit;
let user;
let notif_qty_received;
let out_of_period;
let release;
let goods_received;
let pending_payment;
let paid;
let damaged;
let retired_asset;
let posting
let lost
let leasing
let nonleasing
let please_wait
let process
let minlength
let company
let hide_account
let show
let no_show
let total
let item_already_exists
let status
let message
let dataa
let no_fields
let goods_issue
let list_data
let purchase_order
let transaction_number
let inn
let out
let transfer
let giro
let cheque
let weak
let enough
let normal
let good
let fast
let reconciliation
let not_balance
let close_warehouse
let duplicate
let coa_code
let amount
let vat
let down_payment
let remaining
let partners
let depreciation
let meter
let entisol
let histosol
let inceptisol
let ultisol
let mineral
let mud
let undulating
let flat
let hill
let nucleus_estate
let plasma_estate
let auto_translate
let working_day
let holiday
let abw
let block
let employee
let work_results
let harvest_area
let brondolan
let harvest_on_credit
let normal_harvest
let desktop
let mobile
let work_results_kg
let harvest_incentive
let extra_basis_panen
let extra_basis_bonus
let lebih_basis_rp
let brondolan__rp
let hour
let minute
let time_no_empty
let trash
let stagnation
let breakdown
let commercial_downtime
let duplicate_machine
let continu
let preventive_maintenance
let calibration
let fabrication
let corrective_maintenance
let project
let service
let empoyee_approval
let comparison_sheet
let notice_done
let closed
let returnd
let notice_return

async function content() {
  let language = await JSON.parse(getCookie("language"));
  const data = "file/language.json";
  const response = await fetch(data);
  const jsonData = await response.json();
  await dataContent(jsonData);
  async function dataContent(data) {
    filterLanguage = data.filter(filtercontent => filtercontent.language == language);
    home = await filterLanguage[0]["content"]["home"];
    mainMenu = await filterLanguage[0]["content"]["main_menu"];
    alertLogout = await filterLanguage[0]["content"]["alert_logout"];
    signout = await filterLanguage[0]["content"]["signout"];
    account = await filterLanguage[0]["content"]["account"];
    purchase_request = await filterLanguage[0]["content"]["purchase_request"];
    goods_receipt = await filterLanguage[0]["content"]["goods_receipt"];
    approval = await filterLanguage[0]["content"]["approval"];
    add = await filterLanguage[0]["content"]["add"]
    overload = await filterLanguage[0]["content"]["overload"]
    select = await filterLanguage[0]["content"]["select"]
    done = await filterLanguage[0]["content"]["done"]
    cancel = await filterLanguage[0]["content"]["cancel"]
    loading = await filterLanguage[0]["content"]["loading"]
    edit = await filterLanguage[0]["content"]["edit"]
    required = await filterLanguage[0]["content"]["required"]
    status_500 = await filterLanguage[0]["content"]["status_500"]
    status_404 = await filterLanguage[0]["content"]["status_404"]
    status_401 = await filterLanguage[0]["content"]["status_401"]
    approval = await filterLanguage[0]["content"]["approval"]
    worksite = await filterLanguage[0]["content"]["worksite"]
    action = await filterLanguage[0]["content"]["actions"]
    approval_type = await filterLanguage[0]["content"]["approval_type"]
    all = await filterLanguage[0]["content"]["all"]
    minutes = await filterLanguage[0]["content"]["minutes"]
    active = await filterLanguage[0]["content"]["active"]
    nonactive = await filterLanguage[0]["content"]["nonactive"]
    employee_id = await filterLanguage[0]["content"]["employee_id"]
    record = await filterLanguage[0]["content"]["record"]
    no_new_record = await filterLanguage[0]["content"]["no_new_record"]
    notice_posting = await filterLanguage[0]["content"]["notice_posting"];
    notice_delete = await filterLanguage[0]["content"]["notice_delete"];
    notice_done = await filterLanguage[0]["content"]["notice_done"];
    notice_date_request = await filterLanguage[0]["content"]["notice_date_request"];
    request = await filterLanguage[0]["content"]["request"];
    waiting_approval = await filterLanguage[0]["content"]["waiting_approval"];
    approve = await filterLanguage[0]["content"]["approve"];
    finding_suppliers = await filterLanguage[0]["content"]["finding_suppliers"];
    reject = await filterLanguage[0]["content"]["reject"];
    minlengthchar = await filterLanguage[0]["content"]["minlengthchar"];
    termofpayment = await filterLanguage[0]["content"]["term_of_payment"]
    datepo = await filterLanguage[0]["content"]["date_po"]
    deliveryDate = await filterLanguage[0]["content"]["delivery_date"]
    currency = await filterLanguage[0]["content"]["currency"]
    note = await filterLanguage[0]["content"]["note"]
    master_coa = await filterLanguage[0]["content"]["master_coa"]
    receivingLocations = await filterLanguage[0]["content"]["receiving_locations"]
    mainmenu = await filterLanguage[0]["content"]["main_menu"]
    number = await filterLanguage[0]["content"]["number"];
    expand_all = await filterLanguage[0]["content"]["expand_all"]
    select_access = await filterLanguage[0]["content"]["select_access"]
    no_item = await filterLanguage[0]["content"]["no_item"];
    changepassword = await filterLanguage[0]["content"]["changepassword"];
    passwordnotmacth = await filterLanguage[0]["content"]["password_not_match"];
    webmenuaccess = await filterLanguage[0]["content"]["web_menu_access"];
    mobilemenuaccess = await filterLanguage[0]["content"]["mobile_menu_access"];
    copy_another_user = await filterLanguage[0]["content"]["copy_another_user"];
    copy_access = await filterLanguage[0]["content"]["copy_access"];
    edit_access = await filterLanguage[0]["content"]["edit_access"];
    cash = await filterLanguage[0]["content"]["cash"];
    credit = await filterLanguage[0]["content"]["credit"];
    user = await filterLanguage[0]["content"]["user"];
    notif_qty_received = await filterLanguage[0]["content"]["notif_qty_received"];
    out_of_period = await filterLanguage[0]["content"]["out_of_period"];
    release = await filterLanguage[0]["content"]["release"];
    goods_received = await filterLanguage[0]["content"]["goods_received"];
    pending_payment = await filterLanguage[0]["content"]["pending_payment"];
    paid = await filterLanguage[0]["content"]["paid"];
    damaged = await filterLanguage[0]["content"]["damaged"];
    lost = await filterLanguage[0]["content"]["lost"];
    retired_asset = await filterLanguage[0]["content"]["retired_asset"];
    posting = await filterLanguage[0]["content"]["posting"];
    leasing = await filterLanguage[0]["content"]["leasing"];
    nonleasing = await filterLanguage[0]["content"]["nonleasing"];
    please_wait = await filterLanguage[0]["content"]["please_wait"];
    process = await filterLanguage[0]["content"]["process"];
    minlength = await filterLanguage[0]["content"]["minlength"];
    company = await filterLanguage[0]["content"]["company"];
    hide_account = await filterLanguage[0]["content"]["hide_account"];
    show = await filterLanguage[0]["content"]["show"];
    no_show = await filterLanguage[0]["content"]["no_show"];
    total = await filterLanguage[0]["content"]["total"];
    item_already_exists = await filterLanguage[0]["content"]["item_already_exists"];
    status = await filterLanguage[0]["content"]["status"];
    message = await filterLanguage[0]["content"]["message"];
    dataa = await filterLanguage[0]["content"]["data"];
    no_fields = await filterLanguage[0]["content"]["no_fields"];
    goods_issue = await filterLanguage[0]["content"]["goods_issue"];
    list_data = await filterLanguage[0]["content"]["list_data"];
    purchase_order = await filterLanguage[0]["content"]["purchase_order"];
    transaction_number = await filterLanguage[0]["content"]["transaction_number"];
    inn = await filterLanguage[0]["content"]["in"];
    out = await filterLanguage[0]["content"]["out"];
    giro = await filterLanguage[0]["content"]["giro"];
    cheque = await filterLanguage[0]["content"]["cheque"];
    transfer = await filterLanguage[0]["content"]["transfer"];
    weak = await filterLanguage[0]["content"]["weak"];
    enough = await filterLanguage[0]["content"]["enough"];
    normal = await filterLanguage[0]["content"]["normal"];
    good = await filterLanguage[0]["content"]["good"];
    fast = await filterLanguage[0]["content"]["fast"];
    not_balance = await filterLanguage[0]["content"]["not_balance"];
    close_warehouse = await filterLanguage[0]["content"]["close_warehouse"];
    reconciliation = await filterLanguage[0]["content"]["reconciliation"];
    duplicate = await filterLanguage[0]["content"]["duplicate"];
    coa_code = await filterLanguage[0]["content"]["coa_code"];
    amount = await filterLanguage[0]["content"]["amount"];
    vat = await filterLanguage[0]["content"]["vat"];
    down_payment = await filterLanguage[0]["content"]["down_payment"];
    remaining = await filterLanguage[0]["content"]["remaining"];
    partners = await filterLanguage[0]["content"]["partners"];
    depreciation = await filterLanguage[0]["content"]["depreciation"];
    meter = await filterLanguage[0]["content"]["meter"];
    entisol = await filterLanguage[0]["content"]["entisol"];
    histosol = await filterLanguage[0]["content"]["histosol"];
    inceptisol = await filterLanguage[0]["content"]["inceptisol"];
    ultisol = await filterLanguage[0]["content"]["ultisol"];
    mineral = await filterLanguage[0]["content"]["mineral"];
    mud = await filterLanguage[0]["content"]["mud"];
    undulating = await filterLanguage[0]["content"]["undulating"];
    flat = await filterLanguage[0]["content"]["flat"];
    hill = await filterLanguage[0]["content"]["hill"];
    nucleus_estate = await filterLanguage[0]["content"]["nucleus_estate"];
    plasma_estate = await filterLanguage[0]["content"]["plasma_estate"];
    auto_translate = await filterLanguage[0]["content"]["auto_translate"];
    working_day = await filterLanguage[0]["content"]["working_day"];
    holiday = await filterLanguage[0]["content"]["holiday"];
    abw = await filterLanguage[0]["content"]["abw"];
    block = await filterLanguage[0]["content"]["block"];
    employee = await filterLanguage[0]["content"]["employee"];
    work_results = await filterLanguage[0]["content"]["work_results"];
    harvest_area = await filterLanguage[0]["content"]["harvest_area"];
    brondolan = await filterLanguage[0]["content"]["brondolan"];
    harvest_on_credit = await filterLanguage[0]["content"]["harvest_on_credit"];
    normal_harvest = await filterLanguage[0]["content"]["normal_harvest"];
    desktop = await filterLanguage[0]["content"]["desktop"];
    mobile = await filterLanguage[0]["content"]["mobile"];
    work_results_kg = await filterLanguage[0]["content"]["work_results_kg"];
    harvest_incentive = await filterLanguage[0]["content"]["harvest_incentive"];
    extra_basis_panen = await filterLanguage[0]["content"]["extra_basis_panen"];
    extra_basis_bonus = await filterLanguage[0]["content"]["extra_basis_bonus"];
    lebih_basis_rp = await filterLanguage[0]["content"]["lebih_basis_rp"];
    brondolan__rp = await filterLanguage[0]["content"]["brondolan__rp"];
    hour = await filterLanguage[0]["content"]["hour"];
    minute = await filterLanguage[0]["content"]["minute"];
    time_no_empty = await filterLanguage[0]["content"]["time_no_empty"];
    trash = await filterLanguage[0]["content"]["delete"];
    stagnation = await filterLanguage[0]["content"]["stagnation"];
    breakdown = await filterLanguage[0]["content"]["breakdown"];
    commercial_downtime = await filterLanguage[0]["content"]["commercial_downtime"];
    duplicate_machine = await filterLanguage[0]["content"]["duplicate_machine"];
    continu = await filterLanguage[0]["content"]["continue"];
    calibration = await filterLanguage[0]["content"]["calibration"];
    preventive_maintenance = await filterLanguage[0]["content"]["preventive_maintenance"];
    fabrication = await filterLanguage[0]["content"]["fabrication"];
    corrective_maintenance = await filterLanguage[0]["content"]["corrective_maintenance"];
    project = await filterLanguage[0]["content"]["project"];
    service = await filterLanguage[0]["content"]["service"];
    empoyee_approval = await filterLanguage[0]["content"]["empoyee_approval"];
    comparison_sheet = await filterLanguage[0]["content"]["comparison_sheet"];
    closed = await filterLanguage[0]["content"]["close"];
    returnd = await filterLanguage[0]["content"]["return"];
    notice_return = await filterLanguage[0]["content"]["notice_return"];
    document.getElementById("mainMenuNav").innerHTML = await filterLanguage[0]["content"]["main_menu"];
    document.getElementById("homeNav").innerHTML = await filterLanguage[0]["content"]["home"];;
    document.getElementById("signoutindex").innerHTML = await filterLanguage[0]["content"]["signout"];;
    // document.getElementById("accountIndex").innerHTML = await filterLanguage[0]["content"]["account"];;
    document.getElementById("pleaseWait").innerHTML = await filterLanguage[0]["content"]["please_wait"];;
  }
  await approvalTransaction();
}
// let loadingModalInstance;
async function keluar() {
  // showSpinner();
  // if (!loadingModalInstance) {
  const modalEl = document.getElementById("loadingModal");
  loadingModalInstance = new bootstrap.Modal(modalEl, {
    keyboard: false,
    backdrop: 'static'
  });
  // }
  loadingModalInstance.show();
  sessionUsername = await JSON.parse(getCookie("dataLogin"));
  username = sessionUsername["username"];
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "token/delete";
  var data = JSON.stringify({
    username_POST: username
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var selectData = await JSON.parse(xhr.response);
      if (selectData["access"] == "success") {
        setTimeout(() => {
          if (loadingModalInstance) {
            loadingModalInstance.hide();
          }
        }, 1000);
        Dashmix.helpers("jq-notify", { type: "danger", message: alertLogout });
        setTimeout(function () {
          window.location.href = "/login";
        }, 3000);
        clearCookies();
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
  };
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(data);
  return false;
}
getePPSSessionMenu();
async function getePPSSessionMenu() {
  categoriesMenu = await JSON.parse(sessionStorage.getItem("epps_session_menu"));
  categories = categoriesMenu[0]["dataMenu"];
  categories.filter(c => c.parent_id).forEach(c => {
    const parent = categories.find(p => p.id_menu === c.parent_id);
    parent.subCategories = parent.subCategories || [];
    parent.subCategories.push(c);
  });
  categories = categories.filter(c => !c.parent_id);
  indexSidebarMenu =
    "\
                                                    <li class='nav-main-item'>\
                                                        <a class='nav-main-link' href='/'>\
                                                          <i class='nav-main-link-icon fa-solid fa-house'></i>\
                                                          <span id='homeNav' class='nav-main-link-name'></span>\
                                                        </a>\
                                                      </li>\
                                                      <li id='mainMenuNav' class='nav-main-heading text-uppercase'></li>\
                                                    </li>";

  for (i in categories) {
    captionlevel_1 = categories[i]["adm_menu_translations"][0]["translation"];
    iconlevel_1 = categories[i]["icon"];
    sublevel_1 = categories[i]["subCategories"];
    indexSidebarMenu +=
      "\
                                                    <li class='nav-main-item'>\
                                                        <a class='nav-main-link nav-main-link-submenu' data-toggle='submenu' aria-haspopup='true' aria-expanded='false' href='#'>\
                                                        <i class='nav-main-link-icon " + iconlevel_1 + "'></i>\
                                                        <span class='nav-main-link-name text-uppercase'>" + captionlevel_1 + "</span>\
                                                        </a>\
                                                      <ul class='nav-main-submenu'>";
    for (j in sublevel_1) {
      captionlevel_2 = sublevel_1[j]["adm_menu_translations"][0]["translation"];
      iconlevel_2 = sublevel_1[j]["icon"];
      pagelevel_2 = sublevel_1[j]["page"];
      sublevel_2 = sublevel_1[j]["subCategories"];
      if (pagelevel_2 == null || pagelevel_2 == "") {
        navigasi_2 = "data-toggle='submenu' aria-haspopup='true' aria-expanded='false'";
        iconsubmenu_2 = "nav-main-link-submenu";
      } else {
        navigasi_2 = "";
        iconsubmenu_2 = "";
      }
      indexSidebarMenu +=
        "\
                                                          <li class='nav-main-item'>\
                                                          <a class='nav-main-link " + iconsubmenu_2 + "' " + navigasi_2 + " href='" + pagelevel_2 + "' >\
                                                          <span class='nav-main-link-name text-uppercase'>" + captionlevel_2 + "</span>\
                                                          </a>\
                                                          <ul class='nav-main-submenu'>";
      for (k in sublevel_2) {
        captionlevel_3 = sublevel_2[k]["adm_menu_translations"][0]["translation"];
        iconlevel_3 = sublevel_2[k]["icon"];
        pagelevel_3 = sublevel_2[k]["page"];
        sublevel_3 = sublevel_2[k]["subCategories"];
        if (pagelevel_3 == "" || pagelevel_3 == null) {
          navigasi_3 = "data-toggle='submenu' aria-haspopup='true' aria-expanded='false'";
          iconsubmenu_3 = "nav-main-link-submenu";
        } else {
          navigasi_3 = "";
          iconsubmenu_3 = "";
        }
        indexSidebarMenu +=
          "\
                                                          <li class='nav-main-item'>\
                                                          <a class='nav-main-link " + iconsubmenu_3 + "' " + navigasi_3 + " href='" + pagelevel_3 + "'>\
                                                          <span class='nav-main-link-name text-uppercase'>" + captionlevel_3 + "</span>\
                                                          </a>\
                                                          <ul class='nav-main-submenu'>";
        for (l in sublevel_3) {
          captionlevel_4 = sublevel_3[l]["adm_menu_translations"][0]["translation"];
          iconlevel_4 = sublevel_3[l]["icon"];
          pagelevel_4 = sublevel_3[l]["page"];
          sublevel_4 = sublevel_3[l]["subCategories"];
          if (pagelevel_4 == "") {
            navigasi_4 = "data-toggle='submenu' aria-haspopup='true' aria-expanded='false'";
            iconsubmenu_4 = "nav-main-link-submenu";
          } else {
            navigasi_4 = "";
            iconsubmenu_4 = "";
          }
          indexSidebarMenu +=
            "\
                                                            <li class='nav-main-item'>\
                                                            <a class='nav-main-link " + iconsubmenu_4 + "' " + navigasi_4 + "  href='" + pagelevel_4 + "'>\
                                                            <span class='nav-main-link-name text-uppercase'>" + captionlevel_4 + "</span>\
                                                            </a>\
                                                            <ul class='nav-main-submenu'>";
          for (m in sublevel_4) {
            captionlevel_5 = sublevel_4[m]["adm_menu_translations"][0]["translation"];
            iconlevel_5 = sublevel_4[m]["icon"];
            pagelevel_5 = sublevel_4[m]["page"];
            sublevel_5 = sublevel_4[m]["subCategories"];
            if (pagelevel_5 == "") {
              navigasi_5 = "data-toggle='submenu' aria-haspopup='true' aria-expanded='false'";
              iconsubmenu_5 = "nav-main-link-submenu";
            } else {
              navigasi_5 = "";
              iconsubmenu_5 = "";
            }
            indexSidebarMenu +=
              "\
                                                              <li class='nav-main-item'>\
                                                              <a class='nav-main-link " + iconsubmenu_5 + "' " + navigasi_5 + " href='" + pagelevel_5 + "'>\
                                                              <span class='nav-main-link-name text-uppercase'>" + captionlevel_5 + "</span>\
                                                              </a>\
                                                              <ul class='nav-main-submenu'>";
          }
          indexSidebarMenu += "                      </ul>\
                                                            </li>";
        }
        indexSidebarMenu += "                      </ul>\
                                                          </li>";
      }
      indexSidebarMenu += "                      </ul>\
                                                        </li>";
    }
    indexSidebarMenu += "\
                                                      </ul>\
                                                    </li>";
  }
  document.getElementById("sidebarman").innerHTML = indexSidebarMenu;
  await content();
}
getePPSSessionNameEmplyee();
async function getePPSSessionNameEmplyee() {
  sessionFullName = await JSON.parse(getCookie("dataEmployee"));
  fullName = sessionFullName["fullname"];
  photo = sessionFullName["photo"];
  const urlPhoto = mainUrl + "img/employee/" + photo;
  document.getElementById("photonavproflie").src = urlPhoto;
  document.getElementById("fullnamenav").innerHTML = fullName + " ||";
  document.getElementById("fullnamenavprofile").innerHTML = fullName;
}
getePPSSessionUserLogin();
async function getePPSSessionUserLogin() {
  var sessionLogin = await JSON.parse(getCookie("dataLogin"));
  codeCompany = sessionLogin["codeCompany"];
  document.getElementById("lokasinav").innerHTML = codeCompany;
}
function ddmmyyyy(tanggal) {
  var bagianTanggal = tanggal.split("-");
  var tanggalBaru = bagianTanggal[2] + "-" + bagianTanggal[1] + "-" + bagianTanggal[0];
  return tanggalBaru;
}
function yyyymmdd(tanggal) {
  var bagianTanggal = tanggal.split("-");
  var tanggalBaru = bagianTanggal[2] + "-" + bagianTanggal[1] + "-" + bagianTanggal[0];
  return tanggalBaru;
}
function yyyymm(tanggal) {
  var bagianTanggal = tanggal.split("-");
  var tanggalBaru = bagianTanggal[1] + "-" + bagianTanggal[0];
  return tanggalBaru;
}
function mmyyyy(str) {
  return str.trim().split("-").reverse().join("-");
}
function kapital(str) {
  return str.toUpperCase();
}
async function selectLanguage() {
  return new Promise(async (resolve, reject) => {
    try {
      let language = JSON.parse(getCookie("language"));
      let token = JSON.parse(getCookie("dataToken"));
      if (!token) {
        await getAccessToken();
        token = JSON.parse(getCookie("dataToken"));
        if (!token) {
          reject("Failed to retrieve access token");
          return;
        }
      }

      var xhr = new XMLHttpRequest();
      var url = mainUrl + "language";

      xhr.onerror = function () {
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-exclamation me-1",
          message: overload
        });
        setTimeout(async function () {
          await keluar();
          reject("XHR request failed");
        }, 3000);
      };

      var data = JSON.stringify({
        language_POST: language
      });

      xhr.onloadend = async function () {
        if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(xhr.response);
          if (response["access"] === "success") {
            var responseData = response["data"];
            var languageMenu = `
                <div class="col-sm-6 mb-2">
                  <label class="form-label text-uppercase" id="translateLabel" for="translate">${auto_translate}</label>
                  <div class="d-flex gap-2">
                    <input type="text" class="form-control fw-light text-uppercase" id="translate" name="translate">
                      <div id="loadTranslate">
                        <a id="doneBtn" type="submit" onclick='autoTranslate(${JSON.stringify(responseData)})' class="btn btn-primary">
                          ${kapital(process)}
                        </a>
                      </div>
                  </div>
                </div>
              `;
            for (let i = 0; i < responseData.length; i++) {
              languageMenu += `

                <div class='col-sm-12 mb-2'>
                  <label class='form-label text-uppercase' for='language${i}'>
                    ${responseData[i]["description"]}<span class='text-danger'>*</span>
                  </label>
                  <input type='text' code='${responseData[i]["language_code"]}' class='form-control fw-light text-uppercase' id='language${i}' name='language[]'>
                </div>`;
            }
            document.getElementById("language").innerHTML = languageMenu;
            resolve("Language selection loaded successfully");
          } else {
            reject(response["message"] || "Access failed");
          }
        } else if (this.status === 404) {
          Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: status_404
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          reject("Data failed (404)");
        } else if (this.status === 401) {
          Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: status_401
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          reject("Unauthorized (401)");
        } else if (this.status === 500) {
          Dashmix.helpers("jq-notify", {
            type: "danger",
            z_index: 2000,
            icon: "fa fa-times me-1",
            message: status_500
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          reject("Server error (500)");
        }
      };

      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.send(data);
    } catch (error) {
      reject(error.message || "An unexpected error occurred");
    }
  });
}
async function autoTranslate(param) {
  const text = document.getElementById('translate').value;
  var xhr = new XMLHttpRequest();
  var url = secondUrl + "translate";
  xhr.onloadstart = function () {
    document.getElementById("loadTranslate").innerHTML =
      "<a class='btn btn-hero btn-primary shadow' type='submit' disabled>\n\
        <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\n\
      </a>";
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
  var data = JSON.stringify({
    text: text,
    targetLangs: param.map(item => item.description)
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        var values = Object.values(responseData);
        // console.log(param)
        // return false
        // var languageData = await param[0]["translations"]
        for (i = 0; i < param.length; i++) {
          document.getElementById("language" + i).value = values[i]
        }
        document.getElementById("loadTranslate").innerHTML = `
          <a id="doneBtn" type="submit" onclick='autoTranslate(${JSON.stringify(param)})' class="btn btn-primary">
            ${kapital(process)}
          </a>`

      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
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
}
async function dictionary(param) {
  return new Promise((resolve, reject) => {
    const language = JSON.parse(getCookie("language"));
    var xhr = new XMLHttpRequest();
    var url = secondUrl + "translate/auto";

    xhr.onerror = function () {
      reject("Network error");
    };

    var data = JSON.stringify({
      text: param,
      targetLangs: language
    });

    xhr.onloadend = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhr.response);
        if (response["access"] == "success") {
          resolve(response["data"]); // ⬅️ Kembalikan hasil
        } else {
          reject(response["message"]);
        }
      } else if (this.status == 404) {
        reject("404 Not Found");
      } else if (this.status == 401) {
        reject("401 Unauthorized");
      } else if (this.status == 500) {
        reject("500 Server Error");
      }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.send(data);
  });
}
function clearCookies() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}
async function table() {
  !(function () {
    class a {
      static initDataTables() {
        jQuery.extend(jQuery.fn.dataTable.ext.classes, {
          sWrapper: "dataTables_wrapper dt-bootstrap5",
          sFilterInput: "form-control",
          sLengthSelect: "form-select"
        }), jQuery.extend(!0, jQuery.fn.dataTable.defaults, {
          language: {
            lengthMenu: "_MENU_",
            search: "_INPUT_",
            searchPlaceholder: "Search..",
            info: "Page <strong>_PAGE_</strong> of <strong>_PAGES_</strong>",
            paginate: {
              first: '<i class="fa fa-angle-double-left"></i>',
              previous: '<i class="fa fa-angle-left"></i>',
              next: '<i class="fa fa-angle-right"></i>',
              last: '<i class="fa fa-angle-double-right"></i>'
            }
          }
        }), jQuery.extend(!0, jQuery.fn.DataTable.Buttons.defaults, {
          dom: { button: { className: "btn btn-sm btn-primary" } }
        }), jQuery(".js-dataTable-full").DataTable().destroy();
        jQuery(".js-dataTable-full").DataTable({
          pageLength: 10,
          lengthMenu: [[10, 50, 100], [10, 50, 100]],
          autoWidth: !1
        }), jQuery(".js-dataTable-buttons").DataTable().destroy();
        jQuery(".js-dataTable-buttons").DataTable({
          pageLength: 10,
          lengthMenu: [[10, 50, 100], [10, 50, 100]],
          autoWidth: !1,
          buttons: ["copy", "csv", "excel", "pdf", "print"],
          dom: "<'row'<'col-sm-12'<'text-center bg-body-light py-2 mb-2'B>>><'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
        }), jQuery(".js-dataTable-full-pagination").DataTable().destroy();
        jQuery(".js-dataTable-full-pagination").DataTable({
          pagingType: "full_numbers",
          pageLength: 10,
          lengthMenu: [[10, 50, 100], [10, 50, 100]],
          autoWidth: !1
        }), jQuery(".js-dataTable-simple").DataTable().destroy();
        jQuery(".js-dataTable-simple").DataTable({
          pageLength: 5,
          lengthMenu: !1,
          searching: !1,
          autoWidth: !1,
          dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-6'i><'col-sm-6'p>>"
        }), jQuery(".js-dataTable-responsive").DataTable({
          pagingType: "full_numbers",
          pageLength: 10,
          lengthMenu: [[10, 50, 100], [10, 50, 100]],
          autoWidth: !1,
          responsive: !0
        });
      }
      // static resetDataTables() {
      //   jQuery(".js-dataTable-full").DataTable().clear().draw();
      //   jQuery(".js-dataTable-responsive").DataTable().clear().draw();
      // }

      static init() {
        this.initDataTables();
      }
    }
    Dashmix.onLoad(() => a.init());
  })();
}
function resetDataTables() {
  jQuery(".js-dataTable-responsive").DataTable().destroy();
}
async function timeID(formattedDate) {
  const inputDate = new Date(formattedDate);
  inputDate.setUTCHours(inputDate.getUTCHours() + 7);
  const day = String(inputDate.getUTCDate()).padStart(2, "0");
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const year = inputDate.getUTCFullYear();
  const hours = String(inputDate.getUTCHours()).padStart(2, "0");
  const minutes = String(inputDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getUTCSeconds()).padStart(2, "0");
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
function formatTime(time) {
  return time.substring(0, 5); // Mengambil karakter dari indeks 0 sampai 4
}
function convertToMinutes(time) {
  const [hours, minutes, seconds] = time.split(":").map(Number); // Pisahkan jam, menit, dan detik
  return hours * 60 + minutes + Math.floor(seconds / 60); // Hitung total menit
}
async function approvalTransaction() {
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken(); // ✅ sekarang beneran tunggu token
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "approvaltransactions";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: "overload"
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language,
    employeeID_POST: employeeID
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        jmldataPurchaseRequest = responseData["dataPurchaseRequest"].length;
        jmldataGoodsReceipt = responseData["dataGoodsReceipt"].length;
        jmldataGoodsIssue = responseData["dataGoodsIssue"].length;
        jmldataNotice = parseFloat(jmldataPurchaseRequest) + parseFloat(jmldataGoodsReceipt) + parseFloat(jmldataGoodsIssue);
        if (jmldataPurchaseRequest == "") {
          noticePurchaseRequest = "";
        } else {
          noticePurchaseRequest = `
            <li>
              <a class="d-flex text-dark py-2" href="/purchase_request_approval">
                <div class="flex-shrink-0 mx-3">
                  <i class="fa fa-fw fa-check-circle text-success"></i>
                </div>
                <div class="flex-grow-1 fs-sm pe-2">
                  <div class="fw-semibold">${purchase_request}</div>
                  <div class="text-muted">${jmldataPurchaseRequest} ${approval}</div>
                </div>
              </a>
            </li>`;
        }
        if (jmldataGoodsReceipt == "") {
          noticeGoodsreceipt = "";
        } else {
          noticeGoodsreceipt = `
            <li>
              <a class="d-flex text-dark py-2" href="/goods_receipt_approval">
                <div class="flex-shrink-0 mx-3">
                  <i class="fa fa-fw fa-check-circle text-success"></i>
                </div>
                <div class="flex-grow-1 fs-sm pe-2">
                  <div class="fw-semibold">${goods_receipt}</div>
                  <div class="text-muted">${jmldataGoodsReceipt} ${approval}</div>
                </div>
              </a>
            </li>`;
        }
        if (jmldataGoodsIssue == "") {
          noticeGoodsIssue = "";
        } else {
          noticeGoodsIssue = `
            <li>
              <a class="d-flex text-dark py-2" href="/goods_issue_approval">
                <div class="flex-shrink-0 mx-3">
                  <i class="fa fa-fw fa-check-circle text-success"></i>
                </div>
                <div class="flex-grow-1 fs-sm pe-2">
                  <div class="fw-semibold">${goods_issue}</div>
                  <div class="text-muted">${jmldataGoodsIssue} ${approval}</div>
                </div>
              </a>
            </li>`;
        }
        document.getElementById("allApproval").innerHTML = jmldataNotice === 0 ? "" : jmldataNotice;;
        document.getElementById("noticeApproval").innerHTML = noticePurchaseRequest + noticeGoodsreceipt + noticeGoodsIssue;
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/";
        }, 3000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
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
function formatRupiah(money) {
  return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(money);
}
async function deleteFile(fileUrl) {
  const language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = secondUrl + "deletefile";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-exclamation me-1",
      message: overload
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language,
    delete_POST: fileUrl
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = await response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "success",
          icon: "fa fa-check me-1",
          message: message
        });
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_quotation";
        }, 3000);
      }
    }
    if (this.status == 404) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
  };
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
}
function unformatRupiah(formatted) {
  if (typeof formatted === 'number') {
    return formatted;
  }
  return Number(formatted.replace(/\./g, ''));
}
function customRound(number) {
  return Math.floor(number + 0.5);
}
function roundToNearest(value) {
  return Math.round(value / 1000) * 1000;
}
function typeformatRupiah(el) {
  let angka = el.value.replace(/\./g, ''); // Hapus titik yang sudah ada
  if (!isNaN(angka)) {
    el.value = Number(angka).toLocaleString("id-ID"); // Format ke ribuan dengan titik
  } else {
    el.value = el.value.slice(0, -1); // Jika input bukan angka, hapus karakter terakhir
  }
}
function removeZero(el) {
  if (el.value === "0") {
    el.value = "";
  }
}
function formatAccounting(money) {
  const formatted = formatRupiah(Math.abs(money));
  return money < 0 ? `(${formatted})` : formatted;
}
function formatTimestamp(ts) {
  const [datePart, timePart] = ts.split(' ');
  const [year, month, day] = datePart.split('-');
  return `${day}-${month}-${year} ${timePart}`;
}
function validateNumber(input) {
  input.value = input.value.replace(/[^0-9]/g, ''); // hanya angka 0-9
}
function validateDouble(input) {
  input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');// hanya angka 0-9
}
var get_login = JSON.parse(getCookie("dataLogin"));
var epps_session_menu = JSON.parse(sessionStorage.getItem("epps_session_menu"));
if (get_login == null || epps_session_menu == null) {
  window.location.href = "/login";
}
