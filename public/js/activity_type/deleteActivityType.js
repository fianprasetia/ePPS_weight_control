function closeModal() {
    $('.modal').modal('hide');
    document.getElementById("form2").reset()
    document.getElementById("codeCOA").innerHTML =""
    document.getElementById("codeActivitiType").disabled = false
  }
  