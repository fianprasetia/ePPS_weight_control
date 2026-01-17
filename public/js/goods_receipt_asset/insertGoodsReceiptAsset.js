async function InsertGoodsreceipt() {
    const dataLogin = await JSON.parse(getCookie("dataLogin"));
    const username = dataLogin["username"];
    const dataEmployee = await JSON.parse(getCookie("dataEmployee"));
    const employeeID = dataLogin["idEmployee"]
    const companyCode = dataEmployee["code_company"]
    const purchaseOrder = document.getElementById("purchaseOrder").value
    const codeWarehouseOrder = document.getElementById("codeWHform").value
    const dateOrder = document.getElementById("dateOrder").value
    const invoice = document.getElementById("invoice").value
    const shippingDoc = document.getElementById("shippingDoc").value
    const language = await JSON.parse(getCookie("language"));
    var token = await JSON.parse(getCookie("dataToken"));
    if (token == null) {
      await getAccessToken()
    }
    !(function () {
      class e {
        static initValidation() {
          Dashmix.helpers("jq-validation"),
            jQuery("#formHeaderGR").validate({
              ignore: [],
              rules: {
                "purchaseOrder": { required: !0 },
                "dateOrder": { required: !0 },
              },
              messages: {
                "purchaseOrder": required,
                "dateOrder": required,
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
    const form = jQuery("#formHeaderGR");
    const isValid = form.valid();
    if (!isValid) {
      return false;
    }
    let detail = [];
    var dataGoodReceipt = [];
    document.querySelectorAll("#dataTableItemMasterOrder tbody tr").forEach((row) => {
      let checkbox = row.querySelector("input[name='actions[]']");
      if (checkbox.checked) {
        let rowData = {
          // no: row.cells[0].innerText,
          code_item_POST: row.cells[1].innerText,
          // name: row.cells[2].innerText,
          // uom: row.cells[3].innerText,
          qty_total_POST: row.querySelector("input[name='qtyDataBody[]']").value,
          qty_received_POST: row.querySelector("input[name='qtyReceivedDataBody[]']").value
        };
        detail.push(rowData);
      }
    });
  
    const languageGR = JSON.parse('{"language_POST":"' + language + '"}')
    const usernameGR = JSON.parse('{"username_POST":"' + username + '"}')
    const purchaseOrderGR = JSON.parse('{"purchase_order_POST":"' + purchaseOrder + '"}')
    const dateGR = JSON.parse('{"date_POST":"' + yyyymmdd(dateOrder) + '"}')
    const employeeGR = JSON.parse('{"employeeID_POST":"' + employeeID + '"}')
    const companyCodeMenu = JSON.parse('{"company_code_POST":"' + companyCode + '"}')
    const codeWarehouseGR = JSON.parse('{"code_warehouse_POST":"' + codeWarehouseOrder + '"}')
    const invoiceGR = JSON.parse('{"invoice_POST":"' + invoice + '"}')
    const shippingGR = JSON.parse('{"shipping_POST":"' + shippingDoc + '"}')
    const typeGR = JSON.parse('{"type_POST":"AS"}')
    const statusGR = JSON.parse('{"status_POST":0}')
    $.extend(languageGR, usernameGR, purchaseOrderGR, dateGR, employeeGR, companyCodeMenu, codeWarehouseGR, invoiceGR, shippingGR, typeGR, statusGR, { detail });
    dataGoodReceipt.push(languageGR)
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "goodsreceiptasset/insert";
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
  
    var data = JSON.stringify(dataGoodReceipt);
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
            window.location.href = "/goods_receipt_asset";
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
            window.location.href = "/goods_receipt_asset";
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
  