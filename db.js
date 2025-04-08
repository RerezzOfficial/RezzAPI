const TikTokScraper = require('tiktok-scraper');

async function searchUser(username) {
  try {
    const user = await TikTokScraper.getUserProfileInfo(username);
    console.log(user);
  } catch (err) {
    console.error('Gagal cari user:', err.message);
  }
}

searchUser('im_rerezz');
