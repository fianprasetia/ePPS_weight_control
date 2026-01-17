selectContent();
async function selectContent() {
 var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }
  let language = await JSON.parse(getCookie("language"));
  const data = await "file/language.json";

  // Fetch data dan tunggu hingga selesai
  const response = await fetch(data);
  const jsonData = await response.json();

  // Proses data
  await dataContent(jsonData);
  await SelectReceivingLocations();
  async function dataContent(data) {
    var filterLanguage = data.filter(
      filtercontent => filtercontent.language == language
    );
    document.getElementById("titlePage").innerHTML = filterLanguage[0]["content"]["receiving_locations"];
    document.getElementById("titleModal").innerHTML = filterLanguage[0]["content"]["receiving_locations"];
    document.getElementById("nameThead").innerHTML = filterLanguage[0]["content"]["name_location"];
    document.getElementById("addressThead").innerHTML = filterLanguage[0]["content"]["address"];
    document.getElementById("contactPersonThead").innerHTML = filterLanguage[0]["content"]["contact_name"];
    document.getElementById("contactPhoneThead").innerHTML = filterLanguage[0]["content"]["phone_number"];
    document.getElementById("statusThead").innerHTML = filterLanguage[0]["content"]["status"];
    document.getElementById("actionsThead").innerHTML = filterLanguage[0]["content"]["actions"];
    document.getElementById("nameLocationLabel").innerHTML = filterLanguage[0]["content"]["name_location"] + "<span class='text-danger'>*</span>";
    document.getElementById("addressLabel").innerHTML = filterLanguage[0]["content"]["address"] + "<span class='text-danger'>*</span>";
    document.getElementById("contactPersonLabel").innerHTML = filterLanguage[0]["content"]["contact_name"] + "<span class='text-danger'>*</span>";
    document.getElementById("contactPhoneLabel").innerHTML = filterLanguage[0]["content"]["phone_number"] + "<span class='text-danger'>*</span>";
    document.getElementById("statusLabel").innerHTML = filterLanguage[0]["content"]["status"] + "<span class='text-danger'>*</span>";
  }
}
async function SelectReceivingLocations() {
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  const language = await JSON.parse(getCookie("language"));
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "receivinglocations";
  xhr.onerror = function () {
    Dashmix.helpers("jq-notify", {
      type: "danger",
      z_index: 2000,
      icon: "fa fa-exclamation me-1",
      message: overload
    });
    setTimeout(async function () {
      await keluar();
    }, 3000);
  };
  var data = JSON.stringify({
    language_POST: language
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];

        var tableItem = "";
        var no = 1;
        for (i = 0; i < responseData.length; i++) {
          tableItem +=
            "<tr>\
                            <td class='fw-light text-center'>" +
            no +
            "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
            responseData[i]["name"] +
            "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
            responseData[i]["address"] +
            "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
            responseData[i]["contact_person"] +
            "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
            responseData[i]["contact_phone"] +
            "</td>\
                            <td class='fw-light text-center text-uppercase'>" +
            (responseData[i]["status"] == 0 ? active : nonactive) +
            "</td>\
                            <td class='fw-light text-center'><div class='btn-group'><button type='button' id ='" +
            responseData[i]["id_receiving_locations"] +
            "' onclick='showModalUpdateReceivingLocations(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></div></td>\
                        </tr>";
          no++;
        }
        document.getElementById("dataTable").innerHTML = tableItem;
        await table();
        setTimeout(() => {
          hideSpinner();
        }, 1000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(() => {
          hideSpinner();
        }, 1000);
      }
    }
    if (this.status == 404) {
      message = "Data failed";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_404
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
      message = "data failed to load";
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_401
      });
      setTimeout(async function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 500) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_500
      });
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
