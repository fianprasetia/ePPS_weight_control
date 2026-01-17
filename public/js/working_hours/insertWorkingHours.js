async function showModalInsertWorkHours() {
  await selectLanguage()
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalWorkHours"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalWorkHours"), { keyboard: false });
    myModal.toggle();
  }
  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a>  <button id='doneBtn' type='submit' onclick='insertWorkingHours()' class='btn  btn-primary'>" + kapital(done) + "</button>"
}
async function insertWorkingHours() {
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  // const name = document.getElementById("name").value
  const onDuty = document.getElementById("onDuty").value
  const offDuty = document.getElementById("offDuty").value
  const lateTolerance = document.getElementById("lateTolerance").value
  const earlyTolerance = document.getElementById("earlyTolerance").value
  const checkInOpen = document.getElementById("checkInOpen").value
  const checkInClosed = document.getElementById("checkInClosed").value
  const checkOutOpen = document.getElementById("checkOutOpen").value
  const checkOutClosed = document.getElementById("checkOutClosed").value
  const elementsLanguage = document.getElementsByName('language[]');
  let valuesLanguage = [];
  elementsLanguage.forEach(element => {
    valuesLanguage.push(element.value);
  });
  var detail = []
  var dataWorkingHours = []
  for (var i = 0; i < valuesLanguage.length; i++) {
    const languageData = JSON.parse('{"language_POST":"' + valuesLanguage[i] + '"}')
    $.extend(languageData);
    detail.push(languageData)
  }
  const languageWorkingHours = JSON.parse('{"language_POST":"' + language + '"}')
  const onDutyWorkingHours = JSON.parse('{"onDuty_POST":"' + onDuty + '"}')
  const offDutyWorkingHours = JSON.parse('{"offDuty_POST":"' + offDuty + '"}')
  const lateToleranceWorkingHours = JSON.parse('{"lateTolerance_POST":"' + lateTolerance + '"}')
  const earlyToleranceWorkingHours = JSON.parse('{"earlyTolerance_POST":"' + earlyTolerance + '"}')
  const checkInOpenWorkingHours = JSON.parse('{"checkInOpen_POST":"' + checkInOpen + '"}')
  const checkInClosedWorkingHours = JSON.parse('{"checkInClosed_POST":"' + checkInClosed + '"}')
  const checkOutOpenWorkingHours = JSON.parse('{"checkOutOpen_POST":"' + checkOutOpen + '"}')
  const checkOutClosedWorkingHours = JSON.parse('{"checkOutClosed_POST":"' + checkOutClosed + '"}')
  $.extend(languageWorkingHours, onDutyWorkingHours, offDutyWorkingHours, lateToleranceWorkingHours, earlyToleranceWorkingHours, checkInOpenWorkingHours, checkInClosedWorkingHours, checkOutOpenWorkingHours, checkOutClosedWorkingHours, { detail });
  dataWorkingHours.push(languageWorkingHours)
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              // "name": { required: !0 },
              "onDuty": { required: !0 },
              "offDuty": { required: !0 },
              "lateTolerance": { required: !0 },
              "earlyTolerance": { required: !0 },
              "checkInOpen": { required: !0 },
              "checkInClosed": { required: !0 },
              "checkOutOpen": { required: !0 },
              "checkOutClosed": { required: !0 },
            },
            messages: {
              // "name": required,
              "onDuty": required,
              "offDuty": required,
              "lateTolerance": required,
              "earlyTolerance": required,
              "checkInOpen": required,
              "checkInClosed": required,
              "checkOutOpen": required,
              "checkOutClosed": required,
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
  if (onDuty == "" || offDuty == "" || lateTolerance == "" || earlyTolerance == "" || checkInOpen == "" || checkInClosed == "" || checkOutOpen == "" || checkOutClosed == "") {
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "workinghours/insert";
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

  var data = JSON.stringify(dataWorkingHours);
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
          window.location.href = "/working_hours";
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
          window.location.href = "/working_hours";
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