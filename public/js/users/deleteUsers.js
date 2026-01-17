// function closeModal() {
//     $('.modal').modal('hide');
//     // document.getElementById("form2").reset()
//   }
function closeModal() {
  // Menyembunyikan modal
 
  // Mereset form di dalam modal
  $('#formAccess')[0].reset();

  // Menghapus pesan validasi (kelas is-invalid)
  $('#formAccess').find('.is-invalid').removeClass('is-invalid');
  
  // Menghapus elemen pesan error jika ada (bisa berupa span atau div untuk pesan error)
  $('#formAccess').find('.invalid-feedback').remove(); 

  // Mereset form di dalam modal
  $('#formPassword')[0].reset();

  // Menghapus pesan validasi (kelas is-invalid)
  $('#formPassword').find('.is-invalid').removeClass('is-invalid');
  
  // Menghapus elemen pesan error jika ada (bisa berupa span atau div untuk pesan error)
  $('#formPassword').find('.invalid-feedback').remove(); 

  // Menghapus pilihan pada elemen select2 jika diperlukan
  $('.js-select2').val(null).trigger('change');


  $('.modal').modal('hide');

  // $('#empoyeeForm')[0].reset(); // Reset form
  // $('#empoyeeForm').validate().resetForm(); // Reset validasi
  // $('#empoyeeForm').find('.is-invalid').removeClass('is-invalid');
}