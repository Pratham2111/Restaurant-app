# Deployment Guide for Restaurant Management Platform on Hostinger VPS

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

1. Clone the project (replace with your repository URL):
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
```

4. Initialize the database schema:
```bash
npm run db:push
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
    }
  }]
}
```

4. Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Domain and SSL Configuration

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
    }
}
```

3. Enable the site:
```bash
ln -s /etc/nginx/sites-available/restaurant-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

4. Install SSL certificate using Certbot:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Maintenance and Monitoring

1. Monitor the application:
```bash
pm2 monit
```

2. View logs:
```bash
pm2 logs restaurant-app
```

3. Update the application:
```bash
cd /var/www/restaurant-app
git pull
npm install
npm run build
pm2 restart restaurant-app
```

## Important Notes

1. Replace placeholders:
   - `your_server_ip` with your VPS IP address
   - `your-domain.com` with your actual domain
   - `your_secure_password` with a strong password

2. Security considerations:
   - Configure firewall (UFW)
   - Set up regular backups
   - Keep system and packages updated
   - Use strong passwords
   - Implement rate limiting

3. Performance optimization:
   - Enable Nginx caching
   - Configure PM2 clustering
   - Optimize PostgreSQL settings

4. Troubleshooting:
   - Check logs: `pm2 logs`
   - Monitor system resources: `htop`
   - Check Nginx logs: `/var/log/nginx/error.log`
