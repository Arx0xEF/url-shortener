# URL Shortener

A REST API built with Node.js and PostgreSQL that shortens long URLs and tracks click analytics.

## Features

- Shorten any valid HTTP/HTTPS URL
- Redirect short URLs to original destination
- Track clicks with IP address logging
- Input validation and error handling
- Simple web frontend

## Tech Stack

- **Runtime:** Node.js (no frameworks — raw `http` module)
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (Fetch API)

## Project Structure

```
url-shortener/
├── index.js          # Entry point, HTTP server
├── routes.js         # Request routing
├── controllers.js    # Business logic
├── db.js             # Database connection pool
├── index.html        # Frontend
├── .env              # Environment variables (not committed)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
```

4. Set up the database — open `psql` and run:
```sql
CREATE DATABASE url_shortener;

\c url_shortener

CREATE TABLE urls (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    orig_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clicks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    short_code TEXT REFERENCES urls(short_code),
    ip_addr TEXT,
    clicked_at TIMESTAMP DEFAULT NOW()
);
```

5. Start the server:
```bash
node index.js
```

6. Open your browser and visit `http://localhost:5500`

## API Endpoints

### POST /shorten
Shortens a long URL.

**Request body:**
```json
{
  "url": "https://www.example.com/very/long/url"
}
```

**Response:**
```json
{
  "short_url": "http://localhost:5500/a3f9b2c1"
}
```

### GET /:shortCode
Redirects to the original URL and logs the click.

**Example:** `GET /a3f9b2c1` → `302 redirect to https://www.example.com/very/long/url`

## Future Improvements

- Rate limiting to prevent abuse
- Geolocation tracking (country, city) per click
- Custom short codes
- Link expiration
- Analytics dashboard
- Authentication
