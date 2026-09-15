const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8088;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/save-image') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { filename, data } = JSON.parse(body);
        const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
        const targetPath = path.join(__dirname, filename);
        fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, saved: filename }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/send-quote') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const recipient = payload.recipient || 'saltproteccion@gmail.com';
        
        // FormSubmit.co API forwarder with full HTML and custom formatting
        const https = require('https');
        const postData = JSON.stringify({
          _subject: `🛡️ Nueva Cotización: ${payload.service_type || 'Seguridad'} - ${payload.full_name || 'Cliente'}`,
          _template: 'table',
          _captcha: 'false',
          'Nombre Completo': payload.full_name || 'No especificado',
          'Tipo de Cliente': payload.client_type || 'No especificado',
          'Teléfono': payload.phone || 'No especificado',
          'Correo del Cliente': payload.email || 'No especificado',
          'Servicio Solicitado': payload.service_type || 'No especificado',
          'Detalles / Requerimientos': payload.comments || 'No especificado',
          'Fecha y Hora': new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
          'Origen': 'Sitio Web Oficial Seguridad SALT'
        });

        const options = {
          hostname: 'formsubmit.co',
          port: 443,
          path: `/ajax/${encodeURIComponent(recipient)}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const apiReq = https.request(options, (apiRes) => {
          let apiData = '';
          apiRes.on('data', d => { apiData += d; });
          apiRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ ok: true, forwarded: true }));
          });
        });

        apiReq.on('error', (e) => {
          console.error('Error forwarding email via FormSubmit:', e);
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        });

        apiReq.write(postData);
        apiReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
