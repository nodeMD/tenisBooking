const cheerio = require('cheerio');

function isTimeInRange(time, startTime, endTime) {
    const parseTime = (t) => {
        const [hours, minutes] = t.split(':').map(Number);
        return hours * 60 + minutes;
    };
    
    const timeInMinutes = parseTime(time);
    const startInMinutes = parseTime(startTime);
    const endInMinutes = parseTime(endTime);
    
    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
}

function formatAsJson(html, clubName, timeRange = null) {
    const $ = cheerio.load(html);
    const result = {
        date: '',
        courts: [],
        timeSlots: [],
        availability: {}
    };

    // Find the table with class table-grafik
    const table = $('table.table-grafik');
    if (table.length === 0) {
        return { error: "No table with class 'table-grafik' found" };
    }

    // Extract court information from the first row
    const courtCells = table.find('thead th').slice(1); // Skip the time column
    const courts = courtCells.map((i, cell) => {
        const $cell = $(cell);
        const courtInfo = $cell.text().trim().split('\n').map(s => s.trim()).filter(Boolean);
        return {
            id: i + 1,
            name: courtInfo[0] || `Court ${i + 1}`,
            type: courtInfo[1] || '',
            surface: courtInfo[2] || ''
        };
    }).get();

    // Extract time slots and availability
    const timeSlots = [];
    const availability = {};

    table.find('tbody tr').each((rowIndex, row) => {
        const $row = $(row);
        const timeCell = $row.find('td').first();
        const time = timeCell.text().trim();
        
        if (time) {
            timeSlots.push(time);
            availability[time] = {};

            courts.forEach((court, courtIndex) => {
                const cellIndex = courtIndex + 1; // +1 to skip time cell
                const $cell = $row.find(`td:nth-child(${cellIndex + 1})`);
                const status = getStatusFromCell($cell);
                
                availability[time][court.id] = {
                    status: status,
                    note: $cell.attr('title') || $cell.text().trim(),
                    bookingLink: $cell.find('a').attr('href') ? 
                        `https://kluby.org${$cell.find('a').attr('href')}` : null
                };
            });
        }
    });

    // Try to extract the date from the page
    const dateMatch = $('input[name="data_grafiku"]').attr('value') || 
                     $('input[name="data_grafiku"]').val() || 
                     new Date().toISOString().split('T')[0];

    // Parse time range if provided
    let startTime = '00:00';
    let endTime = '23:59';
    
    if (timeRange) {
        const [start, end] = timeRange.split('-');
        if (start && end) {
            startTime = start.trim();
            endTime = end.trim();
        }
    }
    
    // Initialize available hours object
    const availableHours = {};
    
    // Find all available time slots with reservation links within the specified range
    Object.entries(availability).forEach(([time, courtsData]) => {
        if (isTimeInRange(time, startTime, endTime)) {
            let linkIndex = 1;
            availableHours[time] = {};
            
            // Collect all available courts for this time slot
            Object.entries(courtsData).forEach(([courtId, courtData]) => {
                if (courtData.status === 'available' && courtData.bookingLink) {
                    availableHours[time][`link${linkIndex++}`] = courtData.bookingLink;
                }
            });
            
            // If no available courts, remove the time slot
            if (Object.keys(availableHours[time]).length === 0) {
                delete availableHours[time];
            }
        }
    });

    // Create simplified version with just the first available link for each hour
    const simplifiedHours = {};
    Object.entries(availableHours).forEach(([time, links]) => {
        simplifiedHours[time] = Object.values(links)[0];
    });

    return {
        clubName: clubName,
        date: dateMatch,
        availableHours: simplifiedHours,
        detailedAvailability: {
            availableHours: availableHours
        }
    };
}

function getStatusFromCell($cell) {
    if ($cell.hasClass('zajete')) return 'booked';
    if ($cell.hasClass('zarezerwowane')) return 'reserved';
    if ($cell.hasClass('nieaktywne')) return 'unavailable';
    if ($cell.find('a[href*="rezerwuj"]').length > 0) return 'available';
    return 'unknown';
}

module.exports = { formatAsJson };