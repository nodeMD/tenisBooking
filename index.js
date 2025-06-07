const { fetchCourtData } = require('./scraper');
const { formatAsJson } = require('./formatter');
const fs = require('fs');

async function main() {
    try {
        // Get command line arguments
        const args = process.argv.slice(2);
        const clubName = args[0] || 'mera';
        const date = args[1] || new Date().toISOString().split('T')[0];
        const timeRange = args[2] || null; // Format: "HH:MM-HH:MM"

        console.log(`🏸 Fetching court availability for ${clubName} on ${date}...\n`);
        
        const html = await fetchCourtData(clubName, date);
        
        // Save HTML for debugging
        fs.writeFileSync('debug.html', html);
        console.log('Debug HTML saved to debug.html');
        
        const result = formatAsJson(html, clubName, timeRange);
        
        // Output as formatted JSON
        console.log(JSON.stringify(result, null, 2));
        
        // Save to file
        fs.writeFileSync('availability.json', JSON.stringify(result, null, 2));
        console.log('\nData saved to availability.json');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        process.exit(1);
    }
}

main();