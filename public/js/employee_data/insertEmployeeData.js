async function showModalInsertEmployee() {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalEmployee"), { keyboard: false });
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalEmployee"), { keyboard: false });
    myModal.toggle();
  }
  document.body.style.overflowY = 'hidden';
  await selectGender()
  await selectCity()
  await selectProvince()
  await selectCountry()
  await selectDepartment()
  await selectJobTitle()
  await selectCompany()
  await selectType()
  await selectStatus()
  await selectGrade()
  await selectWorksite()
  await selectProvinceReception()
  await selectCatu()
  await selectStatusTax()
  await selectSalary()
  await selectMarital()
  await selectReligion()
  await selectEducation()
  await selectBlood()

  document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='insertEmployee()' class='btn  btn-primary'>" + kapital(done) + "</button>"
  urlPhoto = mainUrl + "img/employee/employee.jpg";
  photoElement = document.getElementById("avatarPreview");
  photoElement.setAttribute("src", urlPhoto);
}
async function insertEmployee() {
  const language = await JSON.parse(getCookie("language"));
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"];
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"),
          jQuery(".js-validation").validate({
            ignore: [],
            rules: {
              "IdentityNumber": { required: !0 },
              "fullname": { required: !0 },
              "gender": { required: !0 },
              "department": { required: !0 },
              "jobTitle": { required: !0 },
              "company": { required: !0 },
              "employeeType": { required: !0 },
              "employeeStatus": { required: !0 },
              "grade": { required: !0 },
              "dateJoining": { required: !0 },
              "worksite": { required: !0 },
              "receptionLocation": { required: !0 },
              "ration": { required: !0 },
              "taxStatus": { required: !0 },
              "salarySystem": { required: !0 },
              "marital": { required: !0 },
              "religion": { required: !0 },
              "education": { required: !0 },
            },
            messages: {
              "IdentityNumber": required,
              "fullname": required,
              "gender": required,
              "department": required,
              "jobTitle": required,
              "company": required,
              "employeeType": required,
              "employeeStatus": required,
              "grade": required,
              "dateJoining": required,
              "worksite": required,
              "receptionLocation": required,
              "ration": required,
              "taxStatus": required,
              "salarySystem": required,
              "marital": required,
              "religion": required,
              "education": required,
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
  const identityNumber = document.getElementById("IdentityNumber").value
  const fullname = document.getElementById("fullname").value
  const gender = document.getElementById("gender").value
  const dateBirthTemp = document.getElementById("dateBirth").value
  const placeBirth = document.getElementById("placeBirth").value
  const address = document.getElementById("address").value
  const city = document.getElementById("city").value
  const zipCode = document.getElementById("zipCode").value
  const nationality = document.getElementById("nationality").value
  const department = document.getElementById("department").value
  const jobTitle = document.getElementById("jobTitle").value
  const company = document.getElementById("company").value
  const employeeType = document.getElementById("employeeType").value
  const employeeStatus = document.getElementById("employeeStatus").value
  const grade = document.getElementById("grade").value
  const dateJoiningTemp = document.getElementById("dateJoining").value
  const dateAppoimenTemp = document.getElementById("dateAppoimen").value
  const worksite = document.getElementById("worksite").value
  const receptionLocation = document.getElementById("receptionLocation").value
  const ration = document.getElementById("ration").value
  const noTelepon = document.getElementById("noTelepon").value
  const noHandphone = document.getElementById("noHandphone").value
  const personalEmail = document.getElementById("personalEmail").value
  const businessEmail = document.getElementById("businessEmail").value
  const emergencyNumber = document.getElementById("emergencyNumber").value
  const taxStatus = document.getElementById("taxStatus").value
  const bankNumber = document.getElementById("bankNumber").value
  const bank = document.getElementById("bank").value
  const salarySystem = document.getElementById("salarySystem").value
  const marital = document.getElementById("marital").value
  const weddingDateTemp = document.getElementById("weddingDate").value
  const childrenNumber = document.getElementById("childrenNumber").value
  const dependentsNumber = document.getElementById("dependentsNumber").value
  const familyNumber = document.getElementById("familyNumber").value
  const tax = document.getElementById("tax").value
  const noPassport = document.getElementById("noPassport").value
  const healthInsuranceNumber = document.getElementById("healthInsuranceNumber").value
  const employmentInsurancePurposes = document.getElementById("employmentInsurancePurposes").value
  const driversLicenseNumber = document.getElementById("driversLicenseNumber").value
  const religion = document.getElementById("religion").value
  const bloodType = document.getElementById("bloodType").value
  const education = document.getElementById("education").value
  const province = document.getElementById("province").value
  const photoInput = document.getElementById("avatarInput");
  // const photoFile = photoInput.files[0];
  const dateJoining = dateJoiningTemp ? yyyymmdd(dateJoiningTemp) : null;
  const dateAppoimen = dateAppoimenTemp ? yyyymmdd(dateAppoimenTemp) : null;
  const weddingDate = weddingDateTemp ? yyyymmdd(weddingDateTemp) : null;
  const dateBirth = dateBirthTemp ? yyyymmdd(dateBirthTemp) : null;

  if (identityNumber == "" || fullname == "" || gender == "" || department == "" || jobTitle == "" || company == "" || employeeType == "" || employeeStatus == "" || grade == "" || dateJoining == "" || worksite == "" || receptionLocation == "" || ration == "" || taxStatus == "" || salarySystem == "" || marital == "" || religion == "" || education == "") {
    return false
  }


  var xhr = new XMLHttpRequest();
  var url = mainUrl + "employee/insert";
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

  const jsonData =
  {
    language_POST: language,
    identityNumber_POST: identityNumber,
    fullname_POST: fullname,
    gender_POST: gender,
    dateBirth_POST: dateBirth,
    placeBirth_POST: placeBirth,
    city_POST: city,
    zipCode_POST: zipCode,
    province_POST: province,
    address_POST: address,
    nationality_POST: nationality,
    department_POST: department,
    jobTitle_POST: jobTitle,
    tax_POST: tax,
    company_POST: company,
    employeeType_POST: employeeType,
    employeeStatus_POST: employeeStatus,
    grade_POST: grade,
    dateJoining_POST: dateJoining,
    dateAppoimen_POST: dateAppoimen,
    worksite_POST: worksite,
    receptionLocation_POST: receptionLocation,
    ration_POST: ration,
    noTelepon_POST: noTelepon,
    noHandphone_POST: noHandphone,
    personalEmail_POST: personalEmail,
    businessEmail_POST: businessEmail,
    emergencyNumber_POST: emergencyNumber,
    taxStatus_POST: taxStatus,
    bankNumber_POST: bankNumber,
    bank_POST: bank,
    salarySystem_POST: salarySystem,
    marital_POST: marital,
    weddingDate_POST: weddingDate,
    childrenNumber_POST: childrenNumber,
    dependentsNumber_POST: dependentsNumber,
    familyNumber_POST: familyNumber,
    noPassport_POST: noPassport,
    healthInsuranceNumber_POST: healthInsuranceNumber,
    employmentInsurancePurposes_POST: employmentInsurancePurposes,
    driversLicenseNumber_POST: driversLicenseNumber,
    religion_POST: religion,
    bloodType_POST: bloodType,
    education_POST: education,
    username_POST: username
  }

  const formData = new FormData();
  formData.append('photo', photoInput.files[0]); // Tambahkan file ke FormData
  formData.append('data', JSON.stringify(jsonData));

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
          window.location.href = "/employee_data";
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
          window.location.href = "/employee_data";
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
  // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(formData);
  return false;




}