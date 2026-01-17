async function SelectTokenAll() {
    var xhr = new XMLHttpRequest();
    var url = mainUrl + "token/all";
    xhr.onerror = function () {
        alert("Request failed");
    };
    xhr.onloadend = async function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.response);
            if (response["access"] == "success") {
                var responseData = response["data"];
                var tableItem = "";
                var no = 1;
                for (i = 0; i < responseData.length; i++) {
                    username = responseData[i]["username"];
                    type = responseData[i]["access_type"]
                    dateTimeOriginal = responseData[i]["createdAt"]
                    const originalDate = new Date(dateTimeOriginal);
                    originalDate.setHours(originalDate.getHours() + 7);
                    dateTime = originalDate.toISOString()
                    const date = new Date(dateTime);
                    const year = date.getUTCFullYear();
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const hours = String(date.getUTCHours()).padStart(2, '0');
                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
                    const formatted = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
                    deleteData = "<button title='delete' type='button' onclick='showModalDeleteToken(\"" + username + "\", \"" + type + "\")' class='btn btn-danger'><i class='fa-regular fa-trash-can'></i></button>";
                    tableItem +=
                        "<tr>\
                        <td class='fw-light text-center align-middle'>" + no + "</td>\
                        <td class='fw-light text-center align-middle'>" + responseData[i]["username"] + "</td>\
                        <td class='fw-light text-center align-middle'>" + formatted + "</td>\
                        <td class='fw-light text-center text-uppercase align-middle'>" + responseData[i]["access_type"] + "</td>\
                        <td class='fw-light text-center align-middle'><div class='btn-group'>" + deleteData + "</div></td>\
                    </tr>";
                    no++;
                }
                document.getElementById("dataTable").innerHTML = tableItem;
            } else if (response["access"] == "failed") {

            }
        }
    };
    xhr.open("GET", url, true);
    //   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
    return false;
}
SelectTokenAll()