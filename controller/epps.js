function ddmmyyyy(tanggal) {
    var bagianTanggal = tanggal.split('-');
    var tanggalBaru = bagianTanggal[2] + '-' + bagianTanggal[1] + '-' + bagianTanggal[0];
    return tanggalBaru;
}
function formatRupiah(money) {
    return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(money);
}
module.exports = {
    ddmmyyyy,
    formatRupiah
};