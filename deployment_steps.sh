#!/bin/bash

# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# 3. Install required packages
apt install -y nginx certbot python3-certbot-nginx

# 4. Set up project directory
cd /var/www
rm -rf restaurant-app  # Remove if exists
git clone https://github.com/Pratham2111/Restaurant-app.git restaurant-app
cd restaurant-app

# 5. Install project dependencies
npm install
npm install -g pm2

# 6. Set environment variables
cat >> /etc/environment << EOL
NODE_ENV="production"
SESSION_SECRET="1E1F935ACB2A1B4AE3A634D3A5D4F"
EOL

# 7. Configure Nginx
cat > /etc/nginx/sites-available/restaurant-app << 'EOL'
server {
    listen 80;
    server_name icanserveyou.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name icanserveyou.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/icanserveyou.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/icanserveyou.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Important headers for session handling
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # Cookie security
        proxy_cookie_path / "/; Secure; HttpOnly; SameSite=None";
        proxy_cookie_domain localhost icanserveyou.com;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOL

# 8. Enable the Nginx site
ln -sf /etc/nginx/sites-available/restaurant-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 9. Set up SSL
certbot --nginx -d icanserveyou.com --non-interactive --agree-tos --email your-email@example.com

# 10. Build and start the application
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: "restaurant-app",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 5000,
      SESSION_SECRET: "1E1F935ACB2A1B4AE3A634D3A5D4F"
    },
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "1G",
    error_file: "/var/log/pm2/restaurant-app-error.log",
    out_file: "/var/log/pm2/restaurant-app-out.log"
  }]
}
EOL

# 11. Create log directory and set permissions
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/log/pm2

# 12. Set up log rotation
cat > /etc/logrotate.d/restaurant-app << EOL
/var/log/pm2/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 www-data adm
}
EOL

# Final restart
systemctl restart nginx
pm2 restart all