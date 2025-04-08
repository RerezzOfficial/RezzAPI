const express = require('express');
const router = express.Router();
const axios = require('axios');
const { UPDATE, ping } = require('../index');
const creator = 'Rerezz.xyz';

router.get('/akiyama', async (req, res) => {
    const { apikey } = req.query;

    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }

    const result = await UPDATE(apikey);
    if (!result.success) {
         await ping('api/akiyama', false);
        return res.status(400).json(result);
    }

    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/akiyama.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');

        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];

        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });

        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/akiyama', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/akiyama', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/ana', async (req, res) => {
    const { apikey } = req.query;

    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }

    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/ana', false);
        return res.status(400).json(result);
    }

    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/ana.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');

        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];

        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });

        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/ana', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/ana', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/asuna', async (req, res) => {
    const { apikey } = req.query;

    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }

    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/asuna', false);
        return res.status(400).json(result);
    }

    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/asuna.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');

        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];

        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });

        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/asuna', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/asuna', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/ayujawa', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/ayujawa', false);
        return res.status(400).json(result);
    }
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/ayujawa.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/ayujawa', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/ayujawa', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});


router.get('/boruto', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/boruto', false);
        return res.status(400).json(result);
    }
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/boruto.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/boruto', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/boruto', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/chitanda', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/chitanda', false);
        return res.status(400).json(result);
    }
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/chitanda.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/bochitandaruto', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/chitanda', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/elaina', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/elaina', false);
        return res.status(400).json(result);
    }
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/elaina.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/elaina', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/elaina', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

router.get('/kurumi', async (req, res) => {
    const { apikey } = req.query;
    if (!apikey || apikey.trim() === '') {
        return res.status(400).json({
            status: false,
            creator,
            message: "Parameter 'apikey' harus diisi!",
        });
    }
    const result = await UPDATE(apikey);
    if (!result.success) {
        await ping('api/kurumi', false);
        return res.status(400).json(result);
    }
    try {
        const { data } = await axios.get('https://raw.githubusercontent.com/RerezzOfficial/media/main/anime/kurumi.json');
        if (!Array.isArray(data.images)) throw new Error('Data tidak valid');
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const imageResponse = await axios.get(randomImage, { responseType: 'stream' });
        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        await ping('api/kurumi', true);
        imageResponse.data.pipe(res);
    } catch (error) {
        console.error(error);
        await ping('api/kurumi', false);
        return res.status(500).json({
            status: false,
            creator,
            message: 'Gagal menampilkan gambar Akiyama 😿'
        });
    }
});

module.exports = router;
