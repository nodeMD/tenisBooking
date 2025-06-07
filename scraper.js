const axios = require('axios');
const cheerio = require('cheerio');

async function fetchCourtData(clubName, date) {
    try {
        const url = `https://kluby.org/${clubName}/grafik?data_grafiku=${date}&dyscyplina=1&strona=0`;
        
        console.log(`🌐 Fetching data from: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': `https://kluby.org/${clubName}/grafik`,
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            timeout: 10000
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('❌ Error details:', {
            message: error.message,
            response: error.response?.status,
            url: error.config?.url
        });
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

module.exports = { fetchCourtData };