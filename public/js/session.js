async function session(responseLogin, language) {
  await clearCookies()
  sessionStorage.clear()
  localStorage.clear()
  const username = await responseLogin["data"]["dataLogin"][0]["username"]
  const codeCompany = await responseLogin["data"]["dataLogin"][0]["code_company"]
  const idEmployee = await responseLogin["data"]["dataLogin"][0]["employee_id"]
  const dataLogin = {
    username: username,
    codeCompany: codeCompany,
    idEmployee: idEmployee
  };
  const dataLoginString = JSON.stringify(dataLogin);
  setCookie('dataLogin', dataLoginString, 8);
  await sessionLanguage(responseLogin, language, username)
}
async function sessionLanguage(responseLogin, language, username) {
  const dataLanguageString = JSON.stringify(language);
  setCookie('language', dataLanguageString, 8);
  await sessionMenu(responseLogin, language, username)
}
async function sessionMenu(responseLogin, language, username) {
  const dataMenu = await responseLogin["data"]["dataMenu"]
  if (sessionStorage.epps_session_menu) {
    epps_session_menu = JSON.parse(sessionStorage.getItem("epps_session_menu"));
  } else {
    epps_session_menu = [];
  }
  epps_session_menu.push({
    dataMenu: dataMenu,
  });
  sessionStorage.setItem("epps_session_menu", JSON.stringify(epps_session_menu));
  await sessionEmployee(responseLogin, language)
  // await insertSessionMenu(username, dataMenu)
}
async function sessionEmployee(responseLogin, language) {
  const dataEmployee = await responseLogin["data"]["dataLogin"][0]["hrd_employee"]
  const dataEmployeeString = JSON.stringify(dataEmployee);
  setCookie('dataEmployee', dataEmployeeString, 8);
  sessionCompany(responseLogin, language)
}
async function sessionCompany(responseLogin, language) {
  dataCompany = await responseLogin["data"]["dataCompany"]
  const dataCompanyString = JSON.stringify(dataCompany);
  setCookie('dataCompany', dataCompanyString, 8);
  sessionToken(responseLogin, language)
}
async function sessionToken(responseLogin, language) {
  dataToken = await responseLogin["token"]
  const dataTokenString = JSON.stringify(dataToken);
  setCookieToken('dataToken', dataTokenString, 15);
  sessionPeriodeFAT(responseLogin, language)
}
async function sessionPeriodeFAT(responseLogin, language) {
  dataPeriods = await responseLogin["data"]["dataAccountingPeriods"]
  const dataPeriodsString = JSON.stringify(dataPeriods);
  setCookie('dataPeriods', dataPeriodsString, 8);
}
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Mengatur waktu kadaluarsa
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
function setCookieToken(name, value, minutes) {
  const date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000)); // Mengatur waktu kadaluarsa
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
// async function insertSessionMenu(username, dataMenu) {
//   const allPages = dataMenu
//     .filter(item => item.page && item.page.trim() !== '')
//     .map(item => item.page);

//   var xhr = new XMLHttpRequest();
//   var url = secondUrl + "session/insertmenu";

//   var data = JSON.stringify({
//     username_POST: username,
//     menu_POST: allPages,
//   });
//   // xhr.onloadend = function () {
//   //   if (this.readyState == 4 && this.status == 200) {
//   //     var responseLogin = JSON.parse(xhr.response);
//   //     if (responseLogin["access"] == "success") {
//   //       insertSignatureData()

//   //     } else if (responseLogin["access"] == "failed") {
//   //       message = responseLogin["message"];
//   //       Dashmix.helpers("jq-notify", {
//   //         z_index: 2000,
//   //         type: "danger",
//   //         icon: "fa fa-times me-1",
//   //         message: message,
//   //       });
//   //       setTimeout(function () {
//   //         window.location.href = "/signature";
//   //       }, 3000);
//   //     }
//   //   } if (this.status == 404) {
//   //     message = "data failed to load";
//   //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
//   //     setTimeout(function () {
//   //       window.location.href = "/";
//   //     }, 3000);
//   //   } if (this.status == 401) {
//   //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
//   //     setTimeout(function () {
//   //       window.location.href = "/";
//   //     }, 3000);
//   //   } if (this.status == 500) {
//   //     Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
//   //     setTimeout(function () {
//   //       window.location.href = "/";
//   //     }, 3000);
//   //   }
//   // };
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xhr.setRequestHeader("Authorization", "Bearer " + token);
//   xhr.send(data);
// }