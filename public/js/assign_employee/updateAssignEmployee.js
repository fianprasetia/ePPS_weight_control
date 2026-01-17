async function showModalUpadateAssignEmployee(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalAssignEmployee"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalAssignEmployee"), { keyboard: false });
    myModal.toggle();
  }
  let language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "employeeassign/id"
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
    employeID_POST: id,
    language_POST: language,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        const employeeID = responseData[0]["employee_id"]
        const MondayHours = responseData[0]["monday"]
        const TuesdayHours = responseData[0]["tuesday"]
        const WednesdayHours = responseData[0]["wednesday"]
        const ThursdayHours = responseData[0]["thursday"]
        const FridayHours = responseData[0]["friday"]
        const SaturdayHours = responseData[0]["saturday"]
        const SundayHours = responseData[0]["sunday"]
        await selectEmployee(employeeID)
        await selectMondayHours(MondayHours)
        await selectTuesdayHours(TuesdayHours)
        await selectWednesdayHours(WednesdayHours)
        await selectThursdayHours(ThursdayHours)
        await selectFridayHours(FridayHours)
        await selectSaturdayHours(SaturdayHours)
        await selectSundayHours(SundayHours)

        document.getElementById("name").disabled = true
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='updateAssignEmployee()()' class='btn  btn-primary'>" + kapital(done) + "</button>"
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/assign_employee";
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
async function updateAssignEmployee() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  const id = document.getElementById("name").value
  const element = document.querySelector("#name");
  const selectedOption = element.options[element.selectedIndex];
  const worksite = selectedOption.getAttribute("worksite");
  const monday = document.getElementById("monday").value
  const tuesday = document.getElementById("tuesday").value
  const wednesday = document.getElementById("wednesday").value
  const thursday = document.getElementById("thursday").value
  const friday = document.getElementById("friday").value
  const saturday = document.getElementById("saturday").value
  const sunday = document.getElementById("sunday").value
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "monday": { required: !0 },
              "tuesday": { required: !0 },
              "password": { required: !0 },
              "wednesday": { required: !0 },
              "thursday": { required: !0 },
              "friday": { required: !0 },
              "saturday": { required: !0 },
              "sunday": { required: !0 },
            },
            messages: {
              "monday": required,
              "tuesday": required,
              "wednesday": required,
              "thursday": required,
              "friday": required,
              "saturday": required,
              "sunday": required,
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
  if (id == "" || worksite == "" || monday == "" || tuesday == "" || wednesday == "" || thursday == "" || friday == "" || saturday == "" || sunday == "") {
    return false
  }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "employeeassign/update/" + id;
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
      worksite_POST: worksite,
      name_POST: id,
      monday_POST: monday,
      tuesday_POST: tuesday,
      wednesday_POST: wednesday,
      thursday_POST: thursday,
      friday_POST: friday,
      saturday_POST: saturday,
      sunday_POST: sunday,
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
          window.location.href = "/assign_employee";
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
          window.location.href = "/assign_employee";
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
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(data);
  return false;
}