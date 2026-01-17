function deleteRow(id) {
    let button = document.getElementById(id);
    let row = button.closest("tr");
    if (row) {
        row.remove();
    }
}