from http.server import BaseHTTPRequestHandler
import json
import pandas as pd
from io import StringIO

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # Decode and read the CSV
        file_content = post_data.decode('utf-8')
        data = pd.read_csv(StringIO(file_content))
        
        # Example: Return first 5 rows as JSON
        result = data.head().to_dict()
        print(result)

        # Send response
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'message': 'File processed', 'data': result}).encode('utf-8'))