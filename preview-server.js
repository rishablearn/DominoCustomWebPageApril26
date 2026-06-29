/**
 * DominoCustomWebPageApril26 - Preview Server
 * ============================================
 * 
 * Simple Node.js server to preview the login page locally
 * before deploying to HCL Domino.
 * 
 * Usage: node preview-server.js
 * Then open: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

// MIME types for serving static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Parse URL
    let urlPath = req.url.split('?')[0];
    
    // Default to index/login page
    if (urlPath === '/' || urlPath === '') {
        urlPath = '/login-forms/CustomLoginForm-Domino.html';
    }

    // Handle mock login POST (for testing)
    if (req.method === 'POST' && urlPath === '/names.nsf') {
        handleMockLogin(req, res);
        return;
    }

    // Construct file path
    const filePath = path.join(__dirname, urlPath);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>404 Not Found</title></head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file "${urlPath}" was not found.</p>
                        <p><a href="/">Go to Login Page</a></p>
                    </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
});

/**
 * Mock login handler for testing
 */
function handleMockLogin(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const username = params.get('Username');
        const password = params.get('Password');
        const redirectTo = params.get('RedirectTo') || '/';
        
        console.log(`Login attempt: Username="${username}"`);
        
        // Simulate login validation
        if (username && password) {
            if (username === 'demo' && password === 'demo') {
                // Successful login - redirect
                res.writeHead(302, { 
                    'Location': redirectTo,
                    'Set-Cookie': 'DominoSession=mock-session-id; Path=/'
                });
                res.end();
            } else if (username === 'unauthorized') {
                // Simulate unauthorized access (reasontype=1)
                res.writeHead(302, { 
                    'Location': '/CustomLoginForm-Domino.html?reasontype=1' 
                });
                res.end();
            } else if (username === 'expired') {
                // Simulate session expired (reasontype=3)
                res.writeHead(302, { 
                    'Location': '/CustomLoginForm-Domino.html?reasontype=3' 
                });
                res.end();
            } else {
                // Invalid credentials (reasontype=2)
                res.writeHead(302, { 
                    'Location': '/CustomLoginForm-Domino.html?reasontype=2' 
                });
                res.end();
            }
        } else {
            // Missing credentials
            res.writeHead(302, { 
                'Location': '/CustomLoginForm-Domino.html?reasontype=2' 
            });
            res.end();
        }
    });
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     DominoCustomWebPageApril26 - Preview Server           ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  Server running at: http://${HOST}:${PORT}                 ║`);
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Test Credentials:                                        ║');
    console.log('║    ✓ demo / demo          - Successful login              ║');
    console.log('║    ✗ any / any            - Invalid credentials           ║');
    console.log('║    ✗ unauthorized / any   - Access denied                 ║');
    console.log('║    ✗ expired / any        - Session expired               ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Press Ctrl+C to stop the server                          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use.`);
        console.error(`Try a different port: PORT=3001 node preview-server.js`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
    });
});
