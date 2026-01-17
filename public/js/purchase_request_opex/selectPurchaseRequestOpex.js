async function selectContent() {
 var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
    token = await getAccessToken();
  }

  let language = await JSON.parse(getCookie("language"));
  const data = "file/language.json";

  // Fetch data dan tunggu hingga selesai
  const response = await fetch(data);
  const jsonData = await response.json();

  // Proses data
  await dataContent(jsonData);

  await showLayoutListData();

  async function dataContent(data) {
    var filterLanguage = data.filter(
      filtercontent => filtercontent.language == language
    );
    const content = filterLanguage[0]["content"];
    document.getElementById("purchaseRequestOpexPage").innerHTML = content["purchase_request_opex"];
    document.getElementById("titlePurchaseRequestOpexApproval").innerHTML = content["purchase_request_opex"];
    document.getElementById("titleContent").innerHTML = content["purchase_request_opex"];
    document.getElementById("titleItemMaster").innerHTML = content["purchase_request_opex"];
    document.getElementById("dateRequestLabel").innerHTML = content["date_request"];
    document.getElementById("dateRequestListData").innerHTML = content["date_request"];
    document.getElementById("dateCreateListData").innerHTML = content["date_create"];
    document.getElementById("noteHeaderLabel").innerHTML = content["note"];
    document.getElementById("noteLabel").innerHTML = content["note"];
    document.getElementById("noteOrder").innerHTML = content["note"];
    document.getElementById("noteListData").innerHTML = content["note"];
    document.getElementById("noteApproval").innerHTML = content["note"];
    document.getElementById("descriptionLabel").innerHTML = content["description"];
    document.getElementById("descriptionOrder").innerHTML = content["description"];
    document.getElementById("descriptionItemMaster").innerHTML = content["description"];
    document.getElementById("codeItemMasterLabel").innerHTML = content["code_item_description"];
    document.getElementById("codeItemMaster").innerHTML = content["code_item"];
    document.getElementById("codeItemLabel").innerHTML = content["code_item"];
    document.getElementById("codeItemOrder").innerHTML = content["code_item"];
    document.getElementById("uomItemMaster").innerHTML = content["uom"];
    document.getElementById("uomLabel").innerHTML = content["uom"];
    document.getElementById("uomOrder").innerHTML = content["uom"];
    document.getElementById("actionsOrder").innerHTML = content["actions"];
    document.getElementById("actionsListData").innerHTML = content["actions"];
    document.getElementById("dateApproval").innerHTML = content["date_approval"];
    document.getElementById("nameApproval").innerHTML = content["name"];
    document.getElementById("levelApproval").innerHTML = content["level_approval"];
    document.getElementById("qtyLabel").innerHTML = content["qty"];
    document.getElementById("qtyOrder").innerHTML = content["qty"];
    document.getElementById("noPRListData").innerHTML = content["noPR"];
  }
}
function checkDate() {
  const dateRequest = document.getElementById("date_request").value;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset jam, menit, detik

  // Tambahkan 7 hari ke tanggal hari ini
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);

  // Konversi request ke objek Date
  const [day, month, year] = dateRequest.split("-");
  const requestDate = new Date(`${year}-${month}-${day}`);

  // Bandingkan tanggal
  if (requestDate < sevenDaysLater) {
    Dashmix.helpers("jq-notify", {
      z_index: 2000,
      type: "danger",
      icon: "fa fa-times me-1",
      message: notice_date_request
    });
    setTimeout(function () { }, 3000);
    document.getElementById("date_request").value = "";
  }
}
async function showLayoutCreateData() {
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById('createData').hidden = false;
  document.getElementById('listData').hidden = true;
  document.getElementById("formHeaderPR").reset()
  document.getElementById("formadditemmaster").reset()
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutListData()" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i></button>`;
  // document.getElementById("typeHeader").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='in'>" + kapital(inn) + "</option><option value='out'>" + kapital(out) + "</option>"

}
async function showLayoutListData() {
  await SelectPurchaseRequest();
  await new Promise(resolve => setTimeout(resolve, 0));
  document.getElementById("listData").hidden = false;
  document.getElementById('createData').hidden = true;
  document.getElementById('mainNavigator').innerHTML = `<button title="Add" type="submit" onclick="showLayoutCreateData()" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>`
}
async function SelectPurchaseRequest() {
  await resetDataTables()
  document.getElementById("load").innerHTML =
    "<a id='cancelBtn' onclick='cancelTransaction()' class='btn  btn-danger'>" +
    cancel +
    "</a> <a id='doneBtn' type='submit' onclick='InsertPurchaseRequest()' class='btn  btn-primary'>" +
    done +
    "</a>";
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest";
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
    employeeID_POST: employeeID
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        var filterSubData = responseData.filter((filterSubData) => filterSubData.type == "OPEX");
        var tableItem = "";
        var no = 1;
        for (i = 0; i < filterSubData.length; i++) {
          statusTemp = filterSubData[i]["status"];
          noPR = filterSubData[i]["code_purchase_request"];
          let status;
          if (statusTemp == 0) {
            editData = "<button title='" + edit + "' type='button' id='" + noPR + "' onclick='updateCheckPurchaseRequest(id)' class='btn btn-primary'><i class='fa-regular fa-pen-to-square'></i></button>";
            postingData = "<button title='posting' type='button' id='" + noPR + "' onclick='showModalupdatePostingPurchaseRequest(id)' class='btn btn-danger'><i class='fa-solid fa-circle'></i></button>";
            deleteData = "<button title='delete' type='button' id='" + noPR + "' onclick='showModalDeletePostingPurchaseRequest(id)' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
            approvalData = "";
            viewData = "";
            status = request;
          } else if (statusTemp == 1) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noPR + "'' onclick='showModalSelectApproval(id)' class='btn btn-danger'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noPR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            status = waiting_approval;
          } else if (statusTemp == 2) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noPR + "'' onclick='showModalSelectApproval(id)' class='btn btn-danger'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noPR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            status = approve;
          } else if (statusTemp == 3) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noPR + "'' onclick='showModalSelectApproval(id)' class='btn btn-danger'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noPR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            status = finding_suppliers;
          } else if (statusTemp == 4) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noPR + "'' onclick='showModalSelectApproval(id)' class='btn btn-danger'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noPR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            status = done;
          } else if (statusTemp == 5) {
            editData = "";
            postingData = "";
            deleteData = "";
            approvalData = "<button title='approval' type='button'id='" + noPR + "'' onclick='showModalSelectApproval(id)' class='btn btn-danger'><i class='fa-regular fa-user'></i></button>";
            viewData = "<button title='view' type='button' id='" + noPR + "' onclick='selectViewPurchaseRequest(id)' class='btn btn-primary'><i class='fa-solid fa-magnifying-glass'></i></button>";
            status = reject;
          }
          tableItem +=
            "<tr>\
                <td class='fw-light text-center'>" + no + "</td>\
                <td class='fw-light text-center'>" + filterSubData[i]["code_purchase_request"] + "</td>\
                <td class='fw-light text-center text-uppercase'>" + ddmmyyyy(filterSubData[i]["date"]) + "</td>\
                <td class='fw-light text-center'>" + ddmmyyyy(filterSubData[i]["date_request"]) + "</td>\
                <td class='fw-light text-center text-uppercase'>" + filterSubData[i]["note"] + "</td>\
                <td class='fw-light  text-center text-uppercase'>" + status + "</td>\
                <td class='fw-light text-center'><div class='btn-group'>" + viewData + editData + postingData + deleteData + approvalData + "</div></td>\
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
        // setTimeout(function () {
        //   window.location.href = "/purchase_request_opex";
        // }, 3000);
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
async function showModalSelectItemMaster() {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken();
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(
      document.getElementById("modalItemMaster"), { keyboard: false }
    );
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(
      document.getElementById("modalItemMaster"), { keyboard: false }
    );
    myModal.toggle();
  }
  document.getElementById("loadItemMaster").innerHTML =
    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
    cancel +
    "</a>";
}
async function selectItemMaster() {
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation"), jQuery("#formSearch").validate({
          ignore: [],
          rules: {
            searchDescription: { required: !0, minlength: 3 }
          },
          messages: {
            searchDescription: { required, minlengthchar }
          }
        }), jQuery(".js-select2").on("change", e => {
          jQuery(e.currentTarget).valid();
        });
        jQuery(".js-flatpickr").on("change", e => {
          jQuery(e.currentTarget).valid();
        });
      }
      static init() {
        this.initValidation();
      }
    }
    Dashmix.onLoad(() => e.init());
  })();
  const form = jQuery("#formSearch");
  const isValid = form.valid();
  if (!isValid) {
    return false;
  }
  document.getElementById("dataTableItemData").innerHTML = "";
  // var table = document.getElementById("dataTableItem").getElementsByTagName('tbody')[0];
  // var rows = table.getElementsByTagName('tr');
  const code = document.getElementById("searchDescription").value;
  const language = await JSON.parse(getCookie("language"));
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "itemmaster/codename";
  xhr.onloadstart = function () {
    document.getElementById("loadsearch").disabled = true;
    document.getElementById("loadsearch").innerHTML =
      "<div  class=''>\
                <span class='input-group-text fw-semibold btn btn-primary'>\
                <span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>\
               </span>\
                  <div>";
  };
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
    language_POST: language,
    code_POST: kapital(code)
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = await JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        responseData.forEach((data, index) => {
          addRowItemMaster(index, data.code_item, data.name, data.uom);
        });
        document.getElementById("loadsearch").innerHTML =
          "  \
                <span onclick='selectItemMaster()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        // setTimeout(function () {
        //   window.location.href = "/purchase_request_opex";
        // }, 3000);
        document.getElementById("loadsearch").innerHTML =
          "  \
        <span onclick='selectItemMaster()' class='input-group-text fw-semibold btn btn-primary'>\
        <i class='fa-solid fa-magnifying-glass'></i>\
        </span>";
      }
    }
    if (this.status == 404) {
      Dashmix.helpers("jq-notify", {
        type: "danger",
        z_index: 2000,
        icon: "fa fa-times me-1",
        message: status_404
      });
      setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
    if (this.status == 401) {
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
async function addRowItemMaster(index, code_item, name, uom) {
  var table = document
    .getElementById("dataTableItem")
    .getElementsByTagName("tbody")[0];
  // var rowCount = table.rows.length + 1;

  // Membuat elemen <tr> dengan ID dinamis
  var row = table.insertRow();
  row.id = "row" + index; // Mengatur ID baris

  row.onclick = function () {
    handleRowClick(this); // Panggil fungsi handleRowClick dengan elemen baris sebagai argumen
  };
  var cell1 = row.insertCell(0);
  cell1.innerHTML = code_item; // Menampilkan nomor urut
  cell1.className = "text-center fw-light";

  var cell2 = row.insertCell(1);
  cell2.innerHTML = name; // Nama item
  cell2.className = "text-center fw-light text-uppercase";

  var cell3 = row.insertCell(2);
  cell3.innerHTML = uom; // Satuan item
  cell3.className = "text-center fw-light text-uppercase";
}
function handleRowClick(row) {
  // Ambil data dari baris yang diklik
  var code_item = row.cells[0].innerHTML;
  var name = row.cells[1].innerHTML;
  var uom = row.cells[2].innerHTML;
  document.getElementById("codeItem").value = code_item;
  document.getElementById("description").value = name;
  document.getElementById("uom").value = uom;
  document.getElementById("dataTableItemData").innerHTML = "";
  $(".modal").modal("hide");
  document.getElementById("formSearch").reset();
}
async function SelectItemMasterOrder() {
  !(function () {
    class e {
      static initValidation() {
        Dashmix.helpers("jq-validation");
        jQuery("#formadditemmaster").validate({
          ignore: [],
          rules: {
            codeItem: { required: !0 },
            description: { required: !0 },
            qty: { required: !0, number: !0 },
            uom: { required: !0 }
          },
          messages: {
            codeItem: required,
            description: required,
            qty: { required, number },
            uom: required
          }
        });

        jQuery(".js-select2").on("change", e => {
          jQuery(e.currentTarget).valid();
        });
        jQuery(".js-flatpickr").on("change", e => {
          jQuery(e.currentTarget).valid();
        });
      }
      static init() {
        this.initValidation();
      }
    }
    Dashmix.onLoad(() => e.init());
  })();

  const form = jQuery("#formadditemmaster");
  const isValid = form.valid();
  if (!isValid) {
    return false;
  }

  const code = document.getElementById("codeItem").value;
  const description = document.getElementById("description").value;
  const qty = document.getElementById("qty").value;
  const uom = document.getElementById("uom").value;
  const noted = document.getElementById("note").value;

  // Simulasi responseData
  const responseData = [{ code, description, qty, uom, noted }];

  responseData.forEach((data, index) => {
    addRowItemMasterOrder(
      index,
      data.code,
      data.description,
      data.qty,
      data.uom,
      data.noted
    );
  });
}
async function addRowItemMasterOrder(
  index,
  code,
  description,
  qty,
  uom,
  noted
) {
  const table = document
    .getElementById("dataTableItemMasterOrder")
    .getElementsByTagName("tbody")[0];
  const row = table.insertRow();
  row.id = "row" + index;

  const cell1 = row.insertCell(0);
  cell1.innerHTML = code;
  cell1.className = "text-center fw-light";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = description;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = qty;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = uom;
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = noted;
  cell5.className = "text-center fw-light text-uppercase";

  const cell6 = row.insertCell(5);
  cell6.innerHTML = `
    <button type="button" class="btn btn-danger" id="${index}" onclick="deleteRow('${row.id}')">
      <i class="fa-regular fa-trash-can"></i>
    </button>`;
  cell6.className = "text-center";
  document.getElementById("formadditemmaster").reset();
}
function deleteRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.parentNode.removeChild(row);
  }
}
async function showModalSelectApproval(id) {
  let token = await JSON.parse(getCookie("dataToken"));
  if (token == null) {
    await getAccessToken();
    if (token == null) {
      return;
    }
    var myModal = new bootstrap.Modal(
      document.getElementById("modalApprovalPurchaseRequest")
    );
    myModal.toggle();
  } else {
    var myModal = new bootstrap.Modal(
      document.getElementById("modalApprovalPurchaseRequest")
    );
    myModal.toggle();
  }
  document.getElementById("loadApproval").innerHTML =
    "<a id='cancelBtn' onclick='closeModal()' class='btn  btn-danger'>" +
    cancel +
    "</a>";
  document.getElementById("dataTableApprovalDetail").innerHTML = "";
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const employeeID = dataLogin["idEmployee"];
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/bycodepurchaserequest";
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
    code_purchase_request_POST: id
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        dataApproval = responseData[0]["log_purchase_request_approvals"];
        dataApproval.forEach((data, index) => {
          // Menentukan status berdasarkan nilai data.status
          let status;
          if (data.status == 0) {
            status = waiting_approval;
          } else if (data.status == 1) {
            status = waiting_approval;
          } else if (data.status == 2) {
            status = approve;
          } else if (data.status == 3) {
            status = reject;
          }
          var date;
          if (data.date == null) {
            date = "00-00-0000";
          } else {
            const dateApprove = new Date(data.date); // Mengonversi string ke objek Date
            const dd = String(dateApprove.getDate()).padStart(2, "0"); // Hari (2 digit)
            const mm = String(dateApprove.getMonth() + 1).padStart(2, "0"); // Bulan (2 digit)
            const yyyy = dateApprove.getFullYear(); // Tahun (4 digit)
            const HH = String(dateApprove.getHours()).padStart(2, "0"); // Jam (2 digit)
            const MM = String(dateApprove.getMinutes()).padStart(2, "0"); // Menit (2 digit)
            date = `${dd}-${mm}-${yyyy} ${HH}:${MM}`;
          }
          employeeName = data.hrd_employee?.fullname
          addRowApproval(
            index,
            data.hrd_employee.fullname,
            data.level_approval,
            status, // Gunakan nilai status yang sudah diolah
            data.note,
            date
          );
        });
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_opex";
        }, 3000);
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
async function addRowApproval(
  index,
  fullname,
  level_approval,
  status,
  note,
  date
) {
  const table = document
    .getElementById("dataTableApproval")
    .getElementsByTagName("tbody")[0];
  var rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.id = "row" + index;

  const cell1 = row.insertCell(0);
  cell1.innerHTML = fullname;
  cell1.className = "text-center fw-light text-uppercase";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = level_approval;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = status;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = note;
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = date;
  cell5.className = "text-center fw-light text-uppercase";
}
async function selectViewPurchaseRequest(id) {
  await showLayoutCreateData()
  // const dataLogin = await JSON.parse(getCookie("dataLogin"));
  // const employeeID = dataLogin["idEmployee"]
 var token = await JSON.parse(getCookie("dataToken"));
    if (!token) {
        token = await getAccessToken();
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "purchaserequest/bycodepurchaserequest";
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
    code_purchase_request_POST: id
  });
  xhr.onloadend = async function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        var responseData = response["data"];
        document.getElementById("load").innerHTML =
          "<a id='cancelBtn' onclick='cancelTransaction()' class='btn  btn-danger'>" +
          cancel +
          "</a>";
        document.getElementById("code").value =
          responseData[0]["code_purchase_request"];
        document.getElementById("date_request").value = ddmmyyyy(
          responseData[0]["date_request"]
        );
        document.getElementById("noteHeader").value = responseData[0]["note"];
        document.getElementById("dataTableItemMasterOrderDetail").innerHTML = ""
        dataDetail = responseData[0]["log_purchase_request_details"];

        // Simulasi responseData

        dataDetail.forEach((data, index) => {
          addRowCheck(
            data.id,
            data.code_item,
            data.log_item_master.name,
            data.qty_request,
            data.log_item_master.uom,
            data.note
          );
        });
        // const createTab = document.querySelector(
        //   'a[data-bs-target="#purchase-request-form"]'
        // );

        // // Aktifkan tab menggunakan Bootstrap Tab API
        // if (createTab) {
        //   const tabInstance = new bootstrap.Tab(createTab);
        //   tabInstance.show();
        // }
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          type: "danger",
          z_index: 2000,
          icon: "fa fa-times me-1",
          message: message
        });
        setTimeout(function () {
          window.location.href = "/purchase_request_opex";
        }, 3000);
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
async function addRowCheck(idRow, code, description, qty, uom, note) {
  const table = document
    .getElementById("dataTableItemMasterOrder")
    .getElementsByTagName("tbody")[0];
  var rowCount = table.rows.length + 1;
  const row = table.insertRow();
  row.id = "row" + idRow;

  const cell1 = row.insertCell(0);
  cell1.innerHTML = code;
  cell1.className = "text-center fw-light";

  const cell2 = row.insertCell(1);
  cell2.innerHTML = description;
  cell2.className = "text-center fw-light text-uppercase";

  const cell3 = row.insertCell(2);
  cell3.innerHTML = qty;
  cell3.className = "text-center fw-light text-uppercase";

  const cell4 = row.insertCell(3);
  cell4.innerHTML = uom;
  cell4.className = "text-center fw-light text-uppercase";

  const cell5 = row.insertCell(4);
  cell5.innerHTML = note;
  cell5.className = "text-center fw-light text-uppercase";

  const cell6 = row.insertCell(5);
  cell6.innerHTML = "";
  cell6.className = "text-center";
  document.getElementById("formatItemInput").hidden = true;
  document.getElementById("formatItemInputSearch").hidden = true;
  document.getElementById("date_request").disabled = true;
  document.getElementById("noteHeader").disabled = true;
}
selectContent();
