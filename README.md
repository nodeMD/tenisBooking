# Korty - Tenis Court Availability Checker

A simple Node.js script to check tenis court availability on kluby.org and get a clean JSON output with booking links.

## Features

- Check court availability for any club on kluby.org
- Filter results by date and time range
- Get direct booking links for available courts
- Simple JSON output for easy integration with other tools

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone this repository:

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage

```bash
node index.js [clubName] [date] [timeRange]
```

### Parameters

- `clubName`: (Optional) The club's short name as it appears in the kluby.org URL. Defaults to 'mera'.
- `date`: (Optional) Date in YYYY-MM-DD format. Defaults to today.
- `timeRange`: (Optional) Time range in "HH:MM-HH:MM" format (24-hour clock). Example: "16:30-20:00"

### Examples

1. Check availability for the default club (mera) for today:
   ```bash
   node index.js
   ```

2. Check availability for a specific club and date:
   ```bash
   node index.js park-tennis-academy 2025-06-15
   ```

3. Check availability for a specific time range:
   ```bash
   node index.js mera 2025-06-15 "16:30-20:00"
   ```

## Convenience Script

For checking multiple clubs at once, you can use the `checkAvailiability.sh` script. This script checks both park-tennis-academy and mera clubs with a predefined time range.

### Usage

```bash
./checkAvailiability.sh
```

### Configuration

Edit the script to modify:
- `DATE`: The date to check (default: 2025-06-07)
- `TIME_RANGE`: The time range to check (default: 18:00-19:30)

### Example Output

```bash
Checking availability for date: 2025-06-07
Time range: 18:00-19:30
------------------------------
# Output for park-tennis-academy...
# Output for mera...
```

## Output Format

The script outputs a JSON object with the following structure:

```json
{
  "clubName": "mera",
  "date": "2025-06-15",
  "availableHours": {
    "16:30": {
    "link1": "https://kluby.org/mera/grafik/rezerwuj/1798/1749313800",
    "link2": "https://kluby.org/mera/grafik/rezerwuj/1798/1749314800",
    },
    "18:00": {
      "link1": "https://kluby.org/mera/grafik/rezerwuj/1798/1749383800"
    }
  }
}
```

## Output Files

- `availability.json`: Contains the JSON output for the last checked club
- `debug.html`: Raw HTML response for debugging purposes (overwritten on each run)

> **Note**: When using `checkAvailiability.sh`, only the results from the last club checked will remain in `availability.json`.

## Dependencies

- `axios`: For making HTTP requests
- `cheerio`: For parsing HTML

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This project is not affiliated with or endorsed by kluby.org. Use it responsibly and respect the website's terms of service.
