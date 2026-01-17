async function showModalUpdateEmployee(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken()
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(document.getElementById("modalEmployee"));
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalEmployee"));
    myModal.toggle();
  }
  document.body.style.overflowY = 'hidden';
  let language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "employee/id"
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
    employeeCode_POST: id,
    language_POST: language,
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"]
        const dateBirthTemp = responseData[0]["date_of_birth"]
        const dateJoiningTemp = responseData[0]["date_of_joining"]
        const dateAppoimenTemp = responseData[0]["date_of_appointment"]
        const weddingDateTemp = responseData[0]["wedding_date"]
        const dateExitTemp = responseData[0]["date_of_exit"]
        const genderCode = responseData[0]["gender_code"]
        const cityCode = responseData[0]["city"]
        const provinceCode = responseData[0]["province"]
        const countryCode = responseData[0]["nationality"]
        const departmentCode = responseData[0]["department_code"]
        const jobTitleCode = responseData[0]["id_job_title"]
        const companyCode = responseData[0]["code_company"]
        const typeCode = responseData[0]["employee_type_code"]
        const statusCode = responseData[0]["code_employee_status"]
        const gradeCode = responseData[0]["grade_code"]
        const worksiteCode = responseData[0]["worksite"]
        const provinceReceptionCode = responseData[0]["reception_location"]
        const catuCode = responseData[0]["catu_code"]
        const statusTaxCode = responseData[0]["employee_tax_code"]
        const salaryCode = responseData[0]["employee_salary_code"]
        const maritalCode = responseData[0]["marital_code"]
        const religionCode = responseData[0]["code_religion"]
        const educationCode = responseData[0]["code_education"]
        const bloodCode = responseData[0]["blood_type"]
        const photo = responseData[0]["photo"]
      
        await selectGender(genderCode)
        await selectCity(cityCode)
        await selectProvince(provinceCode)
        await selectCountry(countryCode)
        await selectDepartment(departmentCode)
        await selectJobTitle(jobTitleCode)
        await selectCompany(companyCode)
        await selectType(typeCode)
        await selectStatus(statusCode)
        await selectGrade(gradeCode)
        await selectWorksite(worksiteCode)
        await selectProvinceReception(provinceReceptionCode)
        await selectCatu(catuCode)
        await selectStatusTax(statusTaxCode)
        await selectSalary(salaryCode)
        await selectMarital(maritalCode)
        await selectReligion(religionCode)
        await selectEducation(educationCode)
        await selectBlood(bloodCode)

        // Set URL for the photo
        const urlPhoto = mainUrl + "img/employee/" + photo;
        document.getElementById("avatarPreview").src = urlPhoto;

        // Menampilkan foto di canvas
        loadImageToCanvas(urlPhoto);

        // // Display the photo in the img element
        // const photoElement = document.getElementById("avatarPreview");
        // photoElement.src = urlPhoto;  // Directly setting src for the preview image
        
        // // Optionally: If you want to keep the photo URL hidden for further use, you can do this:
        // const photoElementHidden = document.getElementById("avatarInput");
        // photoElementHidden.dataset.src = urlPhoto;  
        document.getElementById("load").innerHTML = "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" + kapital(cancel) + "</a> <button id='doneBtn' type='submit' onclick='updateEmployee()' class='btn  btn-primary'>" + kapital(done) + "</button>"




        const dateJoining = dateJoiningTemp ? ddmmyyyy(dateJoiningTemp) : "00-00-0000";
        const dateAppoimen = dateAppoimenTemp ? ddmmyyyy(dateAppoimenTemp) : "00-00-0000";
        const weddingDate = weddingDateTemp ? ddmmyyyy(weddingDateTemp) : "00-00-0000";
        const dateBirth = dateBirthTemp ? ddmmyyyy(dateBirthTemp) : "00-00-0000";
        const dateExit = dateExitTemp ? ddmmyyyy(dateExitTemp) : "00-00-0000";

        document.getElementById("employeeID").value = responseData[0]["employee_id"]
        document.getElementById("IdentityNumber").value = responseData[0]["identity_card_number"]
        document.getElementById("fullname").value = responseData[0]["fullname"]
        document.getElementById("nameBanner").innerHTML = responseData[0]["fullname"]
        document.getElementById("dateBirth").value = dateBirth
        document.getElementById("placeBirth").value = responseData[0]["place_of_birth"]
        document.getElementById("address").value = responseData[0]["address"]
        document.getElementById("zipCode").value = responseData[0]["zip_code"]
        document.getElementById("dateJoining").value = dateJoining
        document.getElementById("dateAppoimen").value = dateAppoimen
        document.getElementById("dateExit").value = dateExit
        document.getElementById("noTelepon").value = responseData[0]["no_telepon"]
        document.getElementById("noHandphone").value = responseData[0]["mobile_number"]
        document.getElementById("personalEmail").value = responseData[0]["personal_email"]
        document.getElementById("businessEmail").value = responseData[0]["business_email"]
        document.getElementById("emergencyNumber").value = responseData[0]["emergency_contact_number"]
        document.getElementById("bankNumber").value = responseData[0]["bank_account_number"]
        document.getElementById("bank").value = responseData[0]["bank"]
        document.getElementById("weddingDate").value = weddingDate
        document.getElementById("childrenNumber").value = responseData[0]["number_of_children"]
        document.getElementById("dependentsNumber").value = responseData[0]["number_of_dependents"]
        document.getElementById("familyNumber").value = responseData[0]["family_card_number"]
        document.getElementById("tax").value = responseData[0]["tax_identification_number"]
        document.getElementById("noPassport").value = responseData[0]["passport_number"]
        document.getElementById("healthInsuranceNumber").value = responseData[0]["health_insurance_number"]
        document.getElementById("employmentInsurancePurposes").value = responseData[0]["employment_insurance_purposes"]
        document.getElementById("driversLicenseNumber").value = responseData[0]["drivers_license_number"]
        document.getElementById("jobTitleBanner").innerHTML = responseData[0]["hrd_job_title"]["hrd_job_title_translations"][0]["translation"]
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: message });
        setTimeout(function () {
          window.location.href = "/employee_data";
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
    }if (this.status == 500) {
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
async function updateEmployee() {
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
  const employeeId = document.getElementById("employeeID").value
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
  const dateExitTemp = document.getElementById("dateExit").value
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

  const dateJoining = (dateJoiningTemp === "" || dateJoiningTemp === "00-00-0000") ? null : yyyymmdd(dateJoiningTemp);
  const dateAppoimen = (dateAppoimenTemp === "" || dateAppoimenTemp === "00-00-0000") ? null : yyyymmdd(dateAppoimenTemp);
  const weddingDate = (weddingDateTemp === "" || weddingDateTemp === "00-00-0000") ? null : yyyymmdd(weddingDateTemp);
  const dateBirth = (dateBirthTemp === "" || dateBirthTemp === "00-00-0000") ? null : yyyymmdd(dateBirthTemp);
  const dateExit = (dateExitTemp === "" || dateExitTemp === "00-00-0000") ? null : yyyymmdd(dateExitTemp);

  const fields = [identityNumber, fullname, gender, department, jobTitle, company, employeeType, employeeStatus, grade, dateJoining, worksite, receptionLocation, ration, taxStatus, salarySystem, marital, religion, education];

  if (fields.some(field => field === "")) {
      return false;
  }

  var xhr = new XMLHttpRequest();
  var url = mainUrl + "employee/update/" + employeeId;
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
    dateExit_POST: dateExit,
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
    } 
    if (this.status == 404) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_404 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    } if (this.status == 401) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_401 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }if (this.status == 500) {
      Dashmix.helpers("jq-notify", { type: "danger", z_index: 2000, message: status_500 });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
  };
  xhr.open("PUT", url, true);
  // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(formData);
  return false;
}
function loadImageToCanvas(imageUrl) {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();
  
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
  };
  
  image.src = imageUrl;
}
function previewAvatar() {
  const input = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      // Tampilkan gambar di elemen img
      avatarPreview.src = e.target.result;

      // Tampilkan gambar di canvas
      const image = new Image();
      image.onload = function() {
        // Atur ukuran canvas sesuai dengan ukuran gambar
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      }
      image.src = e.target.result;
    }

    reader.readAsDataURL(file); // Baca file sebagai URL data
  }
}
