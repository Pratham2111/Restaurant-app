# Deployment Guide for Restaurant Management Platform

## 1. Initial VPS Setup

1. Log in to your Hostinger VPS via SSH:
```bash
ssh root@your_server_ip
```

2. Update the system and install essential packages:
```bash
apt update && apt upgrade -y
apt install -y curl git build-essential
```

3. Set up a non-root user for security:
```bash
adduser appuser
usermod -aG sudo appuser
```

## 2. Installing Requirements

1. Install Node.js 20.x:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

2. Install PostgreSQL 16:
```bash
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16
```

3. Verify installations:
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 9.x.x or higher
psql --version  # Should show PostgreSQL 16.x
```

## 3. Project Setup

1. Clone the project:
```bash
cd /var/www
git clone your_repository_url restaurant-app
cd restaurant-app
```

2. Install project dependencies:
```bash
npm install
```

## 4. Database Configuration

1. Create a PostgreSQL database and user:
```bash
sudo -u postgres psql
```

2. In the PostgreSQL prompt:
```sql
CREATE DATABASE restaurant_db;
CREATE USER restaurant_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;
\q
```

3. Set up environment variables:
```bash
nano /etc/environment
```

Add these lines:
```
DATABASE_URL="postgresql://restaurant_user:your_secure_password@localhost:5432/restaurant_db"
PORT=5000
NODE_ENV=production
```

## 5. Running the Application

1. Build the application:
```bash
npm run build
```

2. Install PM2 for process management:
```bash
npm install -g pm2
```

3. Create a PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

Add this content:
```javascript
module.exports = {
  apps: [{
    name: "restaurant-app",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "1G",
    error_file: "/var/log/pm2/restaurant-app-error.log",
    out_file: "/var/log/pm2/restaurant-app-out.log"
  }]
}
```

4. Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Nginx Configuration

1. Install Nginx:
```bash
apt install -y nginx
```

2. Create Nginx configuration:
```bash
nano /etc/nginx/sites-available/restaurant-app
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

3. Enable the site:
```bash
ln -s /etc/nginx/sites-available/restaurant-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 7. SSL Configuration

1. Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

2. Get SSL certificate:
```bash
certbot --nginx -d your-domain.com
```

## 8. Security Settings

1. Configure firewall:
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

2. Set up automatic security updates:
```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

## Maintenance Commands

1. Monitor the application:
```bash
pm2 monit
```

2. View logs:
```bash
# Application logs
pm2 logs restaurant-app

# Nginx logs
tail -f /var/log/nginx/error.log
```

3. Update the application:
```bash
cd /var/www/restaurant-app
git pull
npm install
npm run build
pm2 restart restaurant-app
```

## Common Issues and Troubleshooting

1. Database connection issues:
   - Check PostgreSQL status: `systemctl status postgresql`
   - Verify DATABASE_URL environment variable
   - Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-16-main.log`

2. Application not starting:
   - Check PM2 logs: `pm2 logs`
   - Verify NODE_ENV and PORT environment variables
   - Check application logs in /var/log/pm2/

3. SSL/HTTPS issues:
   - Verify Nginx configuration: `nginx -t`
   - Check SSL certificate renewal: `certbot renew --dry-run`
   - Review Nginx error logs

## Important Notes

1. Security best practices:
   - Keep system and packages updated regularly
   - Monitor server resources and logs
   - Implement rate limiting for API endpoints
   - Regular database backups
   - Monitor SSL certificate expiration

2. Performance optimization:
   - Enable Nginx caching for static assets
   - Configure PM2 clustering based on CPU cores
   - Optimize PostgreSQL settings based on server resources
   - Implement proper indexing for database queries

3. Backup strategy:
   - Regular database backups
   - Configuration files backup
   - Automated backup scripts
   - Off-site backup storage

Replace the following placeholders:
- `your_server_ip` with your VPS IP address
- `your_repository_url` with your Git repository URL
- `your-domain.com` with your actual domain name
- `your_secure_password` with a strong password