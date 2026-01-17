function deleteRow(id) {
    const element = document.getElementById(id);
    var nama = element.getAttribute("nama");
    var row = document.getElementById("row" + id);
    if (row) {
        row.parentNode.removeChild(row);
    }else {
        console.error("Row not found with ID:", id);
    }
    updateRowNumbers(); 
}

function updateRowNumbers() {
    var table = document.getElementById("dynamicTable").getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerHTML = i + 1; 
    }
}
function closeModal() {
    $('.modal').modal('hide');
    document.getElementById("formApproval").reset()
  }
  