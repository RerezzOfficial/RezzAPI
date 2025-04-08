const express = require('express');
const router = express.Router();
const { UPDATE, ping } = require('../index');
const creator = 'Rerezz.xyz'
const { jadwalSholat } = require('../lib/function')

router.get('/jadwal-sholat', async (req, res) => {
    const { kota, apikey } = req.query;
    if (!kota || kota.trim() === '') {
      return res.status(400).json({
        status: false,
        creator: creator,
        message: 'Parameter \'kota\' harus diisi!' });
    }
    if (!apikey || apikey.trim() === '') {
      return res.status(400).json({ 
        status: false,
        creator: creator,
        message: 'Parameter \'apikey\' harus diisi!' });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
      await ping('api/jadwal-sholat', false);
      return res.status(400).json(result);
    }
    const jadwal = await jadwalSholat(kota); 
    if (jadwal.success) {
      await ping('api/jadwal-sholat', true);
      return res.json(jadwal);
    } else {
      await ping('api/jadwal-sholat', false);
      return res.status(500).json(jadwal);
    }
});

module.exports = router;