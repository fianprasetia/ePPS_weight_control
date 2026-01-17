function closeModal() {
    $('.modal').modal('hide');
    document.getElementById("form1").reset()
    resetFormToInitialState()
  }
  function resetFormToInitialState() {
    const form = document.getElementById("form1");
    
    // Daftar ID elemen yang seharusnya disabled sesuai HTML awal
    const initiallyDisabledElements = [
        "code", "assetSubType", "name", "company", "worksite", 
        "historicalCost", "valueMonthly", "acquisitionYear",
        "depreciationStartMonth", "periodMonths", "procurementDoc", "status"
    ];
    
    // Reset semua input dan select
    const allInputs = form.querySelectorAll('input');
    const allSelects = form.querySelectorAll('select');
    
    // Aktifkan semua elemen terlebih dahulu
    allInputs.forEach(input => input.disabled = false);
    allSelects.forEach(select => select.disabled = false);
    
    // Nonaktifkan elemen yang seharusnya disabled sesuai HTML awal
    initiallyDisabledElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.disabled = true;
        }
    });
    
    // Khusus untuk assetType, pastikan enabled
    const assetType = document.getElementById("assetType");
    if (assetType) {
        assetType.disabled = false;
    }
}