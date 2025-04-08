const axios = require("axios");
const Tiktok = require('@tobyg74/tiktok-api-dl');

const creator = 'Rerezz Official'

async function jadwalSholat(kota) {
    try {
      const encodedCity = encodeURIComponent(kota.trim());
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodedCity}&country=Indonesia&method=2`;
      const res = await axios.get(url);
  
      const data = res.data.data.timings;
  
      return {
        success: true,
        creator: creator,
        kota,
        jadwal: {
          Subuh: data.Fajr,
          Dzuhur: data.Dhuhr,
          Ashar: data.Asr,
          Maghrib: data.Maghrib,
          Isya: data.Isha
        }
      };
    } catch (err) {
      return {
        success: false,
        creator: creator,
        message: 'Gagal mengambil jadwal sholat',
        error: err.response?.data || err.message
      };
    }
}

async function TikTokDl(url) {
  try {
    const result = await Tiktok.Downloader(url, {
      version: 'v1',
      showOriginalResponse: false
    });

    if (result.status !== 'success' || !result.result) {
      throw new Error(result.message || 'Gagal mendapatkan data dari TikTok.');
    }

    const r = result.result;

    return {
      status: 'success',
      id: r.id,
      type: r.type,
      description: r.description,
      hashtags: r.hashtag || [],
      duration: r.video?.duration || 0,
      video: {
        no_watermark: r.video?.downloadAddr || '', 
        watermark: r.video?.playAddr || '', 
        cover: r.video?.cover || '',
        originCover: r.video?.originCover || '',
        dynamicCover: r.video?.dynamicCover || ''
      },
      music: {
        title: r.music?.title || '',
        author: r.music?.author || '',
        album: r.music?.album || '',
        playUrl: r.music?.playUrl?.[0] || '',
        cover: r.music?.coverLarge?.[0] || ''
      },
      author: {
        username: r.author?.username || '',
        nickname: r.author?.nickname || '',
        signature: r.author?.signature || '',
        region: r.author?.region || '',
        avatar: r.author?.avatarLarger || ''
      },
      stats: {
        play: r.statistics?.playCount || 0,
        like: r.statistics?.diggCount || 0,
        comment: r.statistics?.commentCount || 0,
        share: r.statistics?.shareCount || 0,
        download: r.statistics?.downloadCount || 0,
        repost: r.statistics?.repostCount || 0
      }
    };
  } catch (err) {
    return {
      status: 'error',
      message: err.message
    };
  }
}

async function TokTokdlv2(url) {
  try {
    const { data } = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);

    if (!data || !data.data || !data.data.play) {
      throw new Error('Gagal mengambil video.');
    }
    return {
      status: true,
      username: data.data.author.unique_id,
      nickname: data.data.author.nickname,
      description: data.data.title,
      music: data.data.music,
      video: {
        no_watermark: data.data.play,
        watermark: data.data.wmplay,
        cover: data.data.cover,
        thumbnail: data.data.origin_cover,
      }
    };
  } catch (err) {
    return {
      status: false,
      message: err.message
    };
  }
}


module.exports = {
    jadwalSholat,
    TikTokDl,
    TokTokdlv2
};
