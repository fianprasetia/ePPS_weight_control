function closeModal() {
    // Menyembunyikan modal
    $('.modal').modal('hide');
  
    // Mereset form di dalam modal
    $('#attendanceMachineForm')[0].reset();
  
    // Menghapus pesan validasi (kelas is-invalid)
    $('#attendanceMachineForm').find('.is-invalid').removeClass('is-invalid');
    
    // Menghapus elemen pesan error jika ada (bisa berupa span atau div untuk pesan error)
    $('#attendanceMachineForm').find('.invalid-feedback').remove(); 
  
    // Menghapus pilihan pada elemen select2 jika diperlukan
    $('.js-select2').val(null).trigger('change');
  
  
  
  
  }