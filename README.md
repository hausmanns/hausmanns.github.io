# Portfolio Website with Google Scholar Integration

This portfolio website includes an automatic Publications section that fetches and displays publications from Google Scholar.

## Features

- **Dynamic Publications**: Automatically fetches publications from Google Scholar
- **Multiple Fallback Methods**: Uses local JSON, API, and external services
- **Responsive Design**: Publications display beautifully on all devices
- **Auto-updating**: Publications stay current with your Google Scholar profile

## Publications Setup

### Method 1: Pre-generate JSON (Recommended for GitHub Pages)

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Python script to fetch your publications:
```bash
python scholar_api.py
```

This will create a `publications.json` file that the website will automatically use.

3. Set up automatic updates (optional):
   - Run the Python script periodically (e.g., weekly via cron or GitHub Actions)
   - Commit the updated `publications.json` file to your repository

### Method 2: Local API Server (For Development)

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the local API server:
```bash
python scholar_api.py serve
```

3. The website will automatically detect and use the local API

### Method 3: Fallback Data

If neither of the above methods work, the website will use Semantic Scholar API or fallback to manually curated publication data.

## Configuration

### Google Scholar User ID

Update your Google Scholar user ID in both files:
- `js/publications.js`: Update `SCHOLAR_USER_ID`
- `scholar_api.py`: Update `SCHOLAR_USER_ID`

To find your Google Scholar ID:
1. Go to your Google Scholar profile
2. Look at the URL: `https://scholar.google.com/citations?user=YOUR_ID_HERE`
3. Copy the ID after `user=`

### Customization

You can customize the publications display by:
- Modifying the CSS in `css/styles.css` (search for `.publications-section`)
- Editing the publication card template in `js/publications.js`
- Adjusting the Python script to change which fields are fetched

## GitHub Pages Deployment

For GitHub Pages or other static hosting:

1. Run `python scholar_api.py` locally to generate `publications.json`
2. Commit the `publications.json` file to your repository
3. Set up a GitHub Action to automatically update publications:

The GitHub Action is already configured in `.github/workflows/update-publications.yml`. It will:

- **Run automatically** every Sunday at 6 AM UTC
- **Run manually** when you trigger it from the GitHub Actions tab
- **Run on changes** to the scholar_api.py or workflow files
- **Only commit** when there are actual changes to publications

**To enable the GitHub Action:**

1. Push all files to your GitHub repository:
```bash
git add .
git commit -m "Add Publications section with auto-update"
git push
```

2. Go to your GitHub repository → Actions tab
3. You should see the "Update Publications" workflow
4. Click "Run workflow" to test it manually

**GitHub Action Features:**

```yaml
# .github/workflows/update-publications.yml
name: Update Publications
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Update publications
        run: python scholar_api.py
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add publications.json
          git commit -m "Update publications" || exit 0
          git push
```

## Troubleshooting

### Publications not loading

1. Check the browser console for error messages
2. Verify your Google Scholar profile is public
3. Try running the Python script manually to test data fetching
4. Check that `publications.json` exists and contains valid data

### Rate limiting issues

Google Scholar may rate limit requests. The Python script includes:
- Automatic proxy rotation
- Request delays
- Caching to reduce API calls

### Missing dependencies

Install all required packages:
```bash
pip install scholarly flask flask-cors requests
```

## File Structure

```
├── js/
│   ├── publications.js     # Frontend JavaScript for publications
│   └── ...
├── css/
│   └── styles.css          # Includes publications styling
├── scholar_api.py          # Backend Python script
├── publications.json       # Generated publications data
├── requirements.txt        # Python dependencies
└── index.html             # Main website with publications section
```

## Dependencies

### Python
- `scholarly` - Google Scholar scraping
- `flask` - Local API server (optional)
- `flask-cors` - CORS support
- `requests` - HTTP requests

### JavaScript
- No external dependencies
- Uses native fetch API and DOM manipulation

## License

This project is open source. Feel free to adapt it for your own portfolio! 