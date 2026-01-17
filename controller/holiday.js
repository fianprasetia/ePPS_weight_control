const Holidays = require('date-holidays');
const hd = new Holidays('ID');
const moment = require('moment');
const controller = {};

controller.holidays = async function (req, res) {
    try {
        const year = req.body["period_POST"]

        // Ambil daftar hari libur nasional
        const holidays = hd.getHolidays(year).filter(h => h.type === 'public');
        const liburNasional = holidays.map(h => ({
            date: moment(h.date, ["YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss Z"]).format("YYYY-MM-DD"),
            name: h.name,
            type: "national"
        }));

        // Ambil semua hari Minggu
        let sundays = [];
        let date = moment(`${year}-01-01`);
        while (date.year() === Number(year)) {
            if (date.day() === 0) { // 0 = Minggu
                sundays.push({
                    date: date.format('YYYY-MM-DD'),
                    name: "Hari Minggu",
                    type: "weekend"
                });
            }
            date.add(1, 'day');
        }

        // Gabungkan
        const allLibur = [...liburNasional];

        // Tambahkan Minggu hanya kalau belum ada di daftar
        sundays.forEach(sunday => {
            if (!allLibur.some(libur => libur.date.startsWith(sunday.date))) {
                allLibur.push(sunday);
            }
        });

        allLibur.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.status(200).json({
            access: "success",
            year,
            data: allLibur
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Get holidays failed" });
    }
};

module.exports = controller;
