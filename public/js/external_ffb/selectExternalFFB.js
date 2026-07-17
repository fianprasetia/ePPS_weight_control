selectContent()
async function selectContent() {
    let language = await JSON.parse(getCookie("language"));
    const data = await "file/language.json";
    const response = await fetch(data);
    const jsonData = await response.json();
    await dataContent(jsonData);
    // await selectEstate()
    // await selectVehicleNumber()
    // await selectWeighBridge()
    // await loadScale()
    async function dataContent(data) {
        var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
        const content = filterLanguage[0]["content"];
        document.getElementById("sourceLabel").innerHTML = filterLanguage[0]["content"]["external_ffb"]
        document.getElementById("indicatorLabel").innerHTML = filterLanguage[0]["content"]["indicator"]
        document.getElementById("stable").innerHTML = " <i class='fa fa-circle-check'></i>" + filterLanguage[0]["content"]["stable"]
        document.getElementById("titleInfo").innerHTML = filterLanguage[0]["content"]["input_information"]
        document.getElementById("ticketLabel").innerHTML = filterLanguage[0]["content"]["ticket"]
        document.getElementById("supplierLabel").innerHTML = filterLanguage[0]["content"]["partners"] + "<span class='text-danger'>*</span>"
        document.getElementById("transporterLabel").innerHTML = filterLanguage[0]["content"]["transporter"] + "<span class='text-danger'>*</span>"
        document.getElementById("driverLabel").innerHTML = filterLanguage[0]["content"]["driver"] + "<span class='text-danger'>*</span>"
        document.getElementById("noVehicleLabel").innerHTML = filterLanguage[0]["content"]["vehicle_number"] + "<span class='text-danger'>*</span>"
        document.getElementById("deliveryLabel").innerHTML = filterLanguage[0]["content"]["delivery_note"] + "<span class='text-danger'>*</span>"
        document.getElementById("typeLabel").innerHTML = filterLanguage[0]["content"]["type"] + "<span class='text-danger'>*</span>"
        document.getElementById("totalBunchesLabel").innerHTML = filterLanguage[0]["content"]["total_bunches"]
        document.getElementById("looseFruitLabel").innerHTML = filterLanguage[0]["content"]["brondolan"]
        document.getElementById("plantingYearLabel").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("noteLabel").innerHTML = filterLanguage[0]["content"]["note"]
        document.getElementById("emptyBunchLabel").innerHTML = filterLanguage[0]["content"]["empty_bunch"]
        document.getElementById("overripeLabel").innerHTML = filterLanguage[0]["content"]["overripe"]
        document.getElementById("unripeLabel").innerHTML = filterLanguage[0]["content"]["unripe"]
        document.getElementById("longStalkLabel").innerHTML = filterLanguage[0]["content"]["long_stalk"]
        document.getElementById("mandatoryDeductionLabel").innerHTML = filterLanguage[0]["content"]["mandatory_deduction"]
        document.getElementById("incomingWeighing").innerHTML = filterLanguage[0]["content"]["incoming_weighing"]
        document.getElementById("dateInLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightInLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightIn").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("outgoingWeighing").innerHTML = filterLanguage[0]["content"]["outgoing_weighing"]
        document.getElementById("dateOutLabel").innerHTML = filterLanguage[0]["content"]["time"]
        document.getElementById("weightOutLabel").innerHTML = filterLanguage[0]["content"]["weight"]
        document.getElementById("getWeightOut").innerHTML = filterLanguage[0]["content"]["get_weight"]
        document.getElementById("total").innerHTML = filterLanguage[0]["content"]["total"]
        document.getElementById("grossWeightLabel").innerHTML = filterLanguage[0]["content"]["gross_weight"]
        document.getElementById("deductionLabel").innerHTML = filterLanguage[0]["content"]["deduction"]
        document.getElementById("netWeightLabel").innerHTML = filterLanguage[0]["content"]["net_weight"]
        document.getElementById("save").innerHTML = filterLanguage[0]["content"]["save"]
        document.getElementById("weighbridgeData").innerHTML = filterLanguage[0]["content"]["weighbridge_data"]
        document.getElementById("noVehicleThead").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("driverThead").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("estateThead").innerHTML = filterLanguage[0]["content"]["estate"]
        document.getElementById("divisionThead").innerHTML = filterLanguage[0]["content"]["division"]
        document.getElementById("operatorThead").innerHTML = filterLanguage[0]["content"]["operator"]
        document.getElementById("previewWeightInThead").innerHTML = filterLanguage[0]["content"]["gross_weight"]
        document.getElementById("previewWeightOutThead").innerHTML = filterLanguage[0]["content"]["tare_weight"]
        document.getElementById("previewWeightDeductionThead").innerHTML = filterLanguage[0]["content"]["deduction"]
        document.getElementById("previewWeightNettoThead").innerHTML = filterLanguage[0]["content"]["net_weight"]
        document.getElementById("titleInternalFFB").innerHTML = filterLanguage[0]["content"]["weighing_print_preview"]
        document.getElementById("previewTicketNoLabel").innerHTML = filterLanguage[0]["content"]["ticket"]
        // document.getElementById("previewDivisionCodeLabel").innerHTML = filterLanguage[0]["content"]["division"]
        // document.getElementById("previewUnitTypeLabel").innerHTML = filterLanguage[0]["content"]["block"]
        document.getElementById("previewBunchCountLabel").innerHTML = filterLanguage[0]["content"]["total_bunches"]
        document.getElementById("previewLooseFruitLabel").innerHTML = filterLanguage[0]["content"]["brondolan"]
        document.getElementById("previewYearPlantLabel").innerHTML = filterLanguage[0]["content"]["planting_year"]
        document.getElementById("previewSpbNoLabel").innerHTML = filterLanguage[0]["content"]["delivery_note"]
        document.getElementById("previewDriverNameLabel").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("previewVehicleNoLabel").innerHTML = filterLanguage[0]["content"]["vehicle_number"]
        document.getElementById("previewDateInLabel").innerHTML = filterLanguage[0]["content"]["date_of_entry"]
        document.getElementById("previewDateOutLabel").innerHTML = filterLanguage[0]["content"]["date_of_exit"]
        document.getElementById("previewOperatorLabel").innerHTML = filterLanguage[0]["content"]["operator"]
        document.getElementById("previewDriverLabel").innerHTML = filterLanguage[0]["content"]["driver"]
        document.getElementById("previewDipeLabel").innerHTML = filterLanguage[0]["content"]["checked_by"]
        const btnOut = document.getElementById('getWeightOutBtn');
        btnOut.style.pointerEvents = 'none';
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.style.pointerEvents = 'none';
        document.getElementById("type").innerHTML = "<option class='fw-light text-uppercase' selected disabled value=''>" + kapital(select) + "</option> <option value='PLASMA'>" + kapital(plasma_smallholder) + "</option><option value='SWADAYA'>" + kapital(independent_smallholder) + "</option>"
    }
}