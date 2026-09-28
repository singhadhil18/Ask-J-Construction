"""Local preview with the compression/cache policy supplied in .htaccess."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import gzip
import io
import argparse

ROOT = Path(__file__).resolve().parent
PUBLIC_FILES = {
    'index.html', 'about.html', 'services.html', 'projects.html',
    'customer-testimonials.html', 'contact.html', 'service-areas-faq.html',
    'site-updates.css', 'mobile-compatibility.css', 'contact-form.js',
    'robots.txt', 'sitemap.xml',
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        if self.path.startswith('/assets/'):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        path = Path(self.translate_path(self.path)).resolve()
        if path == ROOT:
            path = ROOT / 'index.html'
        if not path.is_file() or not (
            path.parent == ROOT and path.name in PUBLIC_FILES
            or path.is_relative_to(ROOT / 'assets')
        ):
            self.send_error(404)
            return None
        if path.is_file() and path.suffix in ('.html', '.css', '.js', '.json', '.svg', '.xml', '.txt'):
            data = path.read_bytes()
            compressed = 'gzip' in self.headers.get('Accept-Encoding', '')
            if compressed:
                data = gzip.compress(data)
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(str(path)))
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Vary', 'Accept-Encoding')
            if compressed:
                self.send_header('Content-Encoding', 'gzip')
            self.end_headers()
            return io.BytesIO(data)
        return super().send_head()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8001)
    parser.add_argument('--bind', default='127.0.0.1')
    args = parser.parse_args()
    ThreadingHTTPServer((args.bind, args.port), Handler).serve_forever()
