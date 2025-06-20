#!/usr/bin/env python3
"""
Google Scholar Publications API
A simple Flask API to fetch publications from Google Scholar using the scholarly library.
This serves as a backend for the portfolio website to bypass CORS restrictions.
"""

import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    from scholarly import scholarly
    from scholarly import ProxyGenerator
    SCHOLARLY_AVAILABLE = True
except ImportError:
    SCHOLARLY_AVAILABLE = False
    print("Warning: scholarly library not available. Install with: pip install scholarly")

try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False
    print("Warning: Flask not available. Install with: pip install flask flask-cors")

# Configuration
SCHOLAR_USER_ID = 'xBW0bCcAAAAJ'  # Your Google Scholar ID
CACHE_DURATION_HOURS = 24  # Cache publications for 24 hours
CACHE_FILE = 'publications_cache.json'
MAX_PUBLICATIONS = 20  # Limit number of publications to fetch

# Fallback data in case of API failures
FALLBACK_PUBLICATIONS = [
    {
        "title": "VR for neuroscience research: virtual reality system for studying adaptive visuomotor behavior in mice",
        "authors": ["S Hausmann", "M Mathis"],
        "venue": "bioRxiv",
        "year": "2024",
        "citations": 0,
        "url": "https://scholar.google.com/citations?user=xBW0bCcAAAAJ"
    },
    {
        "title": "Measuring and modeling the motor system with machine learning",
        "authors": ["M Mathis", "S Hausmann", "others"],
        "venue": "Current Opinion in Neurobiology",
        "year": "2021",
        "citations": 45,
        "url": "https://www.sciencedirect.com/science/article/pii/S0959438821000519"
    }
]

class ScholarAPI:
    def __init__(self):
        self.cache_file = Path(CACHE_FILE)
        self._setup_proxy()
    
    def _setup_proxy(self):
        """Setup proxy for scholarly if available"""
        if not SCHOLARLY_AVAILABLE:
            return
        
        try:
            # Try to set up free proxies to avoid rate limiting
            pg = ProxyGenerator()
            pg.FreeProxies()
            scholarly.use_proxy(pg)
            print("Proxy configured for scholarly")
        except Exception as e:
            print(f"Warning: Could not setup proxy: {e}")
    
    def _load_cache(self) -> Optional[Dict]:
        """Load cached publications if they exist and are recent"""
        if not self.cache_file.exists():
            return None
        
        try:
            with open(self.cache_file, 'r', encoding='utf-8') as f:
                cache = json.load(f)
            
            cached_time = datetime.fromisoformat(cache.get('timestamp', '1970-01-01'))
            if datetime.now() - cached_time < timedelta(hours=CACHE_DURATION_HOURS):
                print("Using cached publications")
                return cache
            else:
                print("Cache expired, fetching fresh data")
                return None
        except Exception as e:
            print(f"Error loading cache: {e}")
            return None
    
    def _save_cache(self, data: Dict):
        """Save publications to cache"""
        try:
            cache_data = {
                'timestamp': datetime.now().isoformat(),
                'publications': data,
                'user_id': SCHOLAR_USER_ID
            }
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
            print("Publications cached successfully")
        except Exception as e:
            print(f"Error saving cache: {e}")
    
    def fetch_publications(self) -> List[Dict[str, Any]]:
        """Fetch publications from Google Scholar"""
        
        # Try to load from cache first
        cache = self._load_cache()
        if cache and 'publications' in cache:
            return cache['publications']
        
        if not SCHOLARLY_AVAILABLE:
            print("Scholarly library not available, using fallback data")
            return FALLBACK_PUBLICATIONS
        
        try:
            print(f"Fetching publications for user: {SCHOLAR_USER_ID}")
            
            # Search for the author
            search_query = scholarly.search_author_id(SCHOLAR_USER_ID)
            author = scholarly.fill(search_query)
            
            publications = []
            
            # Process each publication
            for i, pub in enumerate(author.get('publications', [])):
                if i >= MAX_PUBLICATIONS:
                    break
                
                try:
                    # Fill publication details
                    filled_pub = scholarly.fill(pub)
                    
                    # Extract relevant information
                    bib = filled_pub.get('bib', {})
                    publication = {
                        'title': bib.get('title', 'Untitled'),
                        'authors': bib.get('author', '').split(' and ') if bib.get('author') else [],
                        'venue': bib.get('venue', bib.get('journal', '')),
                        'year': bib.get('pub_year', ''),
                        'citations': filled_pub.get('num_citations', 0),
                        'url': filled_pub.get('pub_url', '#')
                    }
                    
                    # Clean up authors list
                    if isinstance(publication['authors'], str):
                        publication['authors'] = [publication['authors']]
                    publication['authors'] = [a.strip() for a in publication['authors'] if a.strip()]
                    
                    publications.append(publication)
                    
                    # Small delay to be respectful to Google Scholar
                    time.sleep(1)
                    
                except Exception as e:
                    print(f"Error processing publication {i}: {e}")
                    continue
            
            # Cache the results
            self._save_cache(publications)
            
            return publications
            
        except Exception as e:
            print(f"Error fetching from Google Scholar: {e}")
            return FALLBACK_PUBLICATIONS

# Flask App (only if Flask is available)
if FLASK_AVAILABLE:
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    scholar_api = ScholarAPI()
    
    @app.route('/api/publications')
    def get_publications():
        """API endpoint to get publications"""
        try:
            publications = scholar_api.fetch_publications()
            return jsonify({
                'success': True,
                'publications': publications,
                'count': len(publications),
                'cached': scholar_api._load_cache() is not None
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'publications': FALLBACK_PUBLICATIONS
            }), 500
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'scholarly_available': SCHOLARLY_AVAILABLE,
            'timestamp': datetime.now().isoformat()
        })
    
    @app.route('/')
    def index():
        """Simple index page"""
        return """
        <h1>Google Scholar Publications API</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/api/publications">/api/publications</a> - Get publications</li>
            <li><a href="/api/health">/api/health</a> - Health check</li>
        </ul>
        """

def main():
    """Main function for command-line usage"""
    if not SCHOLARLY_AVAILABLE:
        print("Installing required packages...")
        import subprocess
        import sys
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'scholarly', 'flask', 'flask-cors'])
            print("Packages installed. Please restart the script.")
            return
        except subprocess.CalledProcessError:
            print("Failed to install packages. Please install manually:")
            print("pip install scholarly flask flask-cors")
            return
    
    api = ScholarAPI()
    publications = api.fetch_publications()
    
    print(f"\nFetched {len(publications)} publications:")
    for i, pub in enumerate(publications, 1):
        print(f"{i}. {pub['title']} ({pub['year']}) - {pub['citations']} citations")
    
    # Save to a JSON file for static hosting
    output_file = 'publications.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'publications': publications,
            'updated': datetime.now().isoformat(),
            'user_id': SCHOLAR_USER_ID
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\nPublications saved to {output_file}")

if __name__ == '__main__':
    if FLASK_AVAILABLE and len(__import__('sys').argv) > 1 and __import__('sys').argv[1] == 'serve':
        print("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        main() 