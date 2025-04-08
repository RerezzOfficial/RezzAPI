const express = require('express');
const router = express.Router();
const creator = 'Rerezz.xyz'
const { UPDATE, ping } = require('../index');
const { pinterest } = require('../lib/scraper');

router.get('/pinterest', async (req, res) => {
  const { query, limit, apikey } = req.query;

  if (!query) {
    return res.status(400).json({
      status: false,
      code: 400,
      creator,
      result: { message: "Parameter 'query' harus diisi!" },
    });
  }

  if (!apikey || apikey.trim() === '') {
    return res.status(400).json({
      status: false,
      creator,
      message: "Parameter 'apikey' harus diisi!",
    });
  }

  const result = await UPDATE(apikey);
  if (!result.success) {
    await ping('api/pinterest', false);
    return res.status(400).json(result);
  }

  try {
    const data = await pinterest.search(query, limit || 100);
    await ping('api/pinterest', true);
    return res.json({
      status: true,
      creator,
      ...data
    });
  } catch (error) {
    await ping('api/pinterest', false);
    return res.status(500).json({
      status: false,
      code: 500,
      creator,
      result: { message: "Internal server error" },
    });
  }
});

module.exports = router;
