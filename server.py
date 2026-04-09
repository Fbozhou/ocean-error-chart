import http.server
import socketserver

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path == '/':
            self.path = '/index.html'
        super().end_headers()

with socketserver.TCPServer(('0.0.0.0', 8081), MyHandler) as httpd:
    print("serving at port 8081, / -> /index.html")
    httpd.serve_forever()
