async function selectShowPaymentVoucher(responseData) {
  document.getElementById("transactionUnposingData").innerHTML = "";
  code = responseData[0]["code_payment_voucher"]
  detail = responseData[0]["details"]
  dateTaxTemp = responseData[0]["tax_invoice_date"]
  var dateTax = ""
  if (dateTaxTemp == null) {
    dateTax = ""
  } else {
    dateTax = ddmmyyyy(responseData[0]["tax_invoice_date"])
  }
  let dataTable = `
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="typeVoucherHeaderLabel" for="typeVoucherHeader">type voucher</label>
                        <div class="col-sm-8 text-uppercase">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["fat_payment_voucher_type"]["translations"][0]["translation"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="noTransactionHeaderLabel" for="noTransactionHeader">no purchase order</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["no_transaction"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="noInvoiceHeaderLabel" for="noInvoiceHeader">No Invoice</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["no_invoice"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="companyHeaderLabel" for="companyHeader">Company</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["company"]["name"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="locationHeaderLabel" for="locationHeader">location</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["adm_company"]["name"]}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="receivedDateHeaderLabel" for="receivedDateHeader">Received Date</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${ddmmyyyy(responseData[0]["date_create"])}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="partnerHeaderLabel" for="partnerHeader">Partners</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["log_partner"]["name"]}" disabled />  
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="currencyHeaderLabel" for="currencyHeader">currency</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["currency"]}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="currencyRateHeaderLabel" for="currencyRateHeader">exchange rate</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["exchange_rate"]}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="dueDateHeaderLabel" for="dueDateHeader">Due Date</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control fw-light text-uppercase" value="${ddmmyyyy(responseData[0]["due_date"])}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="taxInvoiceNumberHeaderLabel" for="taxInvoiceNumberHeader">no faktur pajak</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["tax_invoice_number"]}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="taxInvoiceDateHeaderLabel" for="taxInvoiceNumberHeader">tanggal faktur pajak</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${dateTax}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="invoiceAmountHeaderLabel" for="invoiceAmountHeader">nilai invoice</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${formatRupiah(responseData[0]["invoice_amount"])}" disabled />  
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="noteHeaderLabel" for="noteHeader">note</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["note"]}" disabled />  
                        </div>
                      </div>
                    </div>
                  </div>`
  dataTable += `
                        <div class="row table-responsive mb-2">
                        <table class="table table-striped table-vcenter">
                          <thead>
                            <tr>
                              <th id="assetCodeDetailTable" class="text-center text-uppercase">Kode Asset</th>
                              <th id="codeCoaDetailTable" class="text-center text-uppercase">code coa</th>
                              <th id="amountDetailTable" class="text-center text-uppercase">ammount</th>
                              <th id="departmentDetailTable" class="text-center text-uppercase">Department</th>
                            </tr>
                          </thead>
                                  <tbody>`;
  for (let i = 0; i < detail.length; i++) {
    dataTable += `
                                      <tr>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["asset_code"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["fat_coa"]["fat_coa_translations"][0]["translation"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${formatRupiah(detail[i]["amount"])}</td>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["department"]["hrd_department_translations"][0]["translation"]}</td>
                                      </tr>`;
  }
  dataTable += `
                                  </tbody>
                              </table>
                              </div>`;
  document.getElementById("transactionUnposingData").innerHTML = dataTable;
  document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + code + "' onclick='updateUnpostingPaymentVoucher(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
  document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='SelectTransactionUposting()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
}
async function updateUnpostingPaymentVoucher(id) {
  const code = id.getAttribute('code');
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"]
  const employeeID = dataLogin["idEmployee"]
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "transactionunposting/unpostingbypaymentvoucher";
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
  var data = JSON.stringify({
    language_POST: language,
    no_transaction_POST: code,
    username_POST: username
  });
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "success",
          icon: "fa fa-check me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/transaction_unposting";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/transaction_unposting";
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
async function selectShowCashBank(responseData) {
  document.getElementById("transactionUnposingData").innerHTML = "";
  const paymentMethodData = ['transfer', 'cash', 'giro', 'cheque'];
  const responseValue = ['transfer', 'cash', 'giro', 'cheque'];
  const paymentMethod = responseData[0]["payment_method"];
  const result = responseValue.includes(paymentMethod) ? paymentMethodData[responseValue.indexOf(paymentMethod)] : null;
  const typePayment = responseData[0]["type_transactions"];
  const type = typePayment === "out" ? kapital(out) : kapital(inn)

  code = responseData[0]["code_cash_bank"]
  detail = responseData[0]["details"]
  // dateTaxTemp = responseData[0]["tax_invoice_date"]
  // var dateTax = ""
  // if (dateTaxTemp == null) {
  //   dateTax = ""
  // } else {
  //   dateTax = ddmmyyyy(responseData[0]["tax_invoice_date"])
  // }
  let dataTable = `
                   <div class="row mb-2">
                    <div class="col-sm-6">
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="companyHeaderLabel" for="companyHeader">Company</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["adm_company"]["name"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="worksiteHeaderLabel" for="worksiteHeader">Worksite</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["WorksiteCompany"]["name"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="codecoaHeaderLabel" for="codecoaHeader">Code COa</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["fat_coa"]["fat_coa_translations"][0]["translation"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="sourceOfFundsLabel" for="sourceOfFundsHeader">Source of Funds</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["fat_account_bank"]["bank_account_number"]} - ${responseData[0]["fat_account_bank"]["bank"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="createDateHeaderLabel" for="createDateHeader">Create Date</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${ddmmyyyy(responseData[0]["date_create"])}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="tipeHeaderLabel" for="typeHeader">tipe transaksi</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${type}" disabled />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="paidToHeaderLabel" for="paidToHeader">Paid To</label>
                        <div class="col-sm-8">
                         <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["paid_to"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="currencyHeaderLabel" for="currencyHeader">currency</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["currency"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="currencyRateHeaderLabel" for="currencyRateHeader">exchange rate</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["exchange_rate"]}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="paymentHeaderLabel" for="paymentHeader">Payment Method</label>
                        <div class="col-sm-8">
                          <input type="text" class="form-control fw-light text-uppercase" value="${result}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="invoiceAmountHeaderLabel" for="invoiceAmountHeader">nilai invoice</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control fw-light text-uppercase" value="${formatRupiah(responseData[0]["amount"])}" disabled />
                        </div>
                      </div>
                      <div class="row mb-2">
                        <label class="col-sm-4 col-form-label text-uppercase" id="noteHeaderLabel" for="noteHeader">note</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control fw-light text-uppercase" value="${responseData[0]["note"]}" disabled />
                        </div>
                      </div>
                    </div>
                  </div>`
  dataTable += `
                        <div class="row table-responsive mb-2">
                        <table class="table table-striped table-vcenter">
                          <thead>
                            <tr>
                              <th id="notransactionThead" class="text-center text-uppercase" style="width: 400px">No Transaction</th>
                              <th id="codeCoaThead" class="text-center text-uppercase" style="width: 400px">code coa</th>
                              <th id="partnerThead" class="text-center text-uppercase" style="width: 250px">Partner</th>
                              <th id="employeeThead" class="text-center text-uppercase" style="width: 400px">Employee</th>
                              <th id="noteThead" class="text-center text-uppercase" style="width: 400px">Note</th>
                              <th id="nominalThead" class="text-center text-uppercase" style="width: 400px">nominal</th>
                            </tr>
                          </thead>
                                  <tbody>`;
  for (let i = 0; i < detail.length; i++) {
    const fullname = detail[i].employee_id !== null ? detail[i].hrd_employee?.fullname || "" : "";
    dataTable += `
                                      <tr>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["code_transactions"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["fat_coa"]["fat_coa_translations"][0]["translation"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["log_partner"]["name"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${fullname}</td>
                                          <td class='fw-light text-center text-uppercase'>${detail[i]["note"]}</td>
                                          <td class='fw-light text-center text-uppercase'>${formatRupiah(detail[i]["amount"])}</td>
                                      </tr>`;
  }
  dataTable += `
                                  </tbody>
                              </table>
                              </div>`;
  document.getElementById("transactionUnposingData").innerHTML = dataTable;
  document.getElementById("load").innerHTML = "<a id='doneBtn' type='submit' code='" + code + "' onclick='updateUnpostingCashBank(this)' class='btn  btn-primary'>" + kapital(done) + "</a>"
  document.getElementById("loadsearch").innerHTML = "  \
                <span onclick='SelectTransactionUposting()' class='input-group-text fw-semibold btn btn-primary'>\
                <i class='fa-solid fa-magnifying-glass'></i>\
                </span>";
}
async function updateUnpostingCashBank(id) {
  const code = id.getAttribute('code');
  const dataLogin = await JSON.parse(getCookie("dataLogin"));
  const username = dataLogin["username"]
  const employeeID = dataLogin["idEmployee"]
  const language = await JSON.parse(getCookie("language"));
  var token = await JSON.parse(getCookie("dataToken"));
  if (!token) {
        token = await getAccessToken(); 
    }
  var xhr = new XMLHttpRequest();
  var url = mainUrl + "transactionunposting/unpostingbycashbank";
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
  var data = JSON.stringify({
    language_POST: language,
    no_transaction_POST: code,
    username_POST: username
  });
  xhr.onloadend = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(xhr.response);
      if (response["access"] == "success") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "success",
          icon: "fa fa-check me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/transaction_unposting";
        }, 3000);
      } else if (response["access"] == "failed") {
        message = response["message"];
        Dashmix.helpers("jq-notify", {
          z_index: 2000,
          type: "danger",
          icon: "fa fa-times me-1",
          message: message,
        });
        setTimeout(function () {
          window.location.href = "/transaction_unposting";
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