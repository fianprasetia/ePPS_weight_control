async function session(responeData, language) {
  await clearCookies();
  sessionStorage.clear();
  localStorage.clear();

  const username = responeData["dataLogin"][0]["username"];
  const idEmployee = responeData["dataLogin"][0]["employee_id"];

  const dataLogin = {
    username: username,
    idEmployee: idEmployee
  };

  const dataLoginString = JSON.stringify(dataLogin);
  setCookie('dataLogin', dataLoginString, 8);

  await sessionLanguage(responeData, language, username);
}
async function sessionLanguage(responeData, language, username) {
  const dataLanguageString = JSON.stringify(language);
  setCookie('language', dataLanguageString, 8);
  await sessionMenu(responeData, language, username);
}
async function sessionMenu(responeData, language, username) {
  const dataMenu = responeData["dataMenu"];

  // Perbaikan: Gunakan array baru, bukan push ke existing array
  const epps_session_menu_wb = [{
    dataMenu: dataMenu,
  }];

  sessionStorage.setItem("epps_session_menu_wb", JSON.stringify(epps_session_menu_wb));
  await sessionEmployee(responeData, language);
}
async function sessionEmployee(responeData, language) {
  const dataEmployee = responeData["dataLogin"][0]["adm_employee"];
  const dataEmployeeString = JSON.stringify(dataEmployee);
  setCookie('dataEmployeeWB', dataEmployeeString, 8);
  await sessionDBScaleID()
}

async function sessionDBScaleID() {
  const request = indexedDB.open("ePPS_WC", 1);
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Membuat Object Store (seperti tabel)
    db.createObjectStore("scale_id", {
      keyPath: "id"
    });
    console.log("Object Store 'scale_id' berhasil dibuat.");
  };
  request.onsuccess = (event) => {
    const db = event.target.result;
    // console.log("Database ePPS_WC berhasil dibuka.", db);
  };
  request.onerror = (event) => {
    console.error("Gagal membuka database:", event.target.error);
  };
}
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Mengatur waktu kadaluarsa
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
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