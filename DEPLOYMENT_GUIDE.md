# Deployment Guide for Restaurant Management Platform

## Important Note About Storage
This application uses in-memory storage (MemStorage) for data persistence. While you might see database-related configuration files in the codebase (like `drizzle.config.ts` and `server/db.ts`), these are not currently used and can be ignored during deployment.

The data is stored in two places:
1. In memory during runtime (MemStorage class in server/storage.ts)
2. JSON files in the `/var/www/restaurant-app/data/` directory for persistence across restarts:
   - users.json: User accounts and roles
   - menu-items.json: Menu items and their details
   - categories.json: Menu categories
   - tables.json: Restaurant table information
   - bookings.json: Table bookings
   - orders.json: Customer orders
   - site-settings.json: Application settings

You can safely ignore any database-related environment variables (like DATABASE_URL) as they are not used in the current implementation.

## Session Configuration
For proper session management and login persistence, ensure these environment variables are set:

```bash
# Add to /etc/environment or your environment configuration
export SESSION_SECRET="your_very_secure_random_string"  # Used for encrypting sessions
export DOMAIN="your-domain.com"  # Your actual domain name
export NODE_ENV="production"
```

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

## 2. Installing Node.js

1. Install Node.js 20.x:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

2. Verify installations:
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 9.x.x or higher
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

3. Set up environment variables:
```bash
nano /etc/environment
```

Add these lines:
```
PORT=5000
NODE_ENV=production
SESSION_SECRET=your_secure_secret_key  # Used for session encryption
```

## 4. Running the Application

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
      PORT: 5000,
      SESSION_SECRET: "your_secure_secret_key"
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

## 5. Nginx Configuration

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

        # Hostinger-specific optimizations
        client_max_body_size 100M;
        keepalive_timeout 65;
        keepalive_requests 100;
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

## 6. SSL Configuration

1. Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

2. Get SSL certificate:
```bash
certbot --nginx -d your-domain.com
```

## 7. Security Settings

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

1. Application not starting:
   - Check PM2 logs: `pm2 logs`
   - Verify NODE_ENV and PORT environment variables
   - Check application logs in /var/log/pm2/

2. SSL/HTTPS issues:
   - Verify Nginx configuration: `nginx -t`
   - Check SSL certificate renewal: `certbot renew --dry-run`
   - Review Nginx error logs

## Important Notes

1. Security best practices:
   - Keep system and packages updated regularly
   - Monitor server resources and logs
   - Implement rate limiting for API endpoints
   - Monitor SSL certificate expiration

2. Performance optimization:
   - Enable Nginx caching for static assets
   - Configure PM2 clustering based on CPU cores
   - Implement proper caching strategies

3. Backup strategy:
   - Regular file system backups of the data directory
   - Configuration files backup
   - Automated backup scripts
   - Off-site backup storage


## Additional Considerations for In-Memory Storage

1. Data Persistence:
   - Data is primarily stored in memory while the application runs
   - JSON files in `/var/www/restaurant-app/data/` provide persistence across restarts
   - Set up regular backups of the data directory using cron:
     ```bash
     # Add to crontab for daily backups at 2 AM
     0 2 * * * tar -czf /backup/restaurant-data-$(date +\%Y\%m\%d).tar.gz /var/www/restaurant-app/data/
     ```

2. Memory Management:
   - Monitor memory usage carefully as all data is stored in RAM
   - Configure PM2 with appropriate memory limits
   - Set up monitoring alerts for memory usage
   - Check memory usage regularly:
     ```bash
     pm2 monit
     free -m
     ```

3. Backup Strategy:
   - Set up automated backups of the data directory:
     ```bash
     # Create backup directory
     mkdir -p /backup/restaurant-data

     # Create backup script
     cat > /usr/local/bin/backup-restaurant-data.sh << 'EOF'
     #!/bin/bash
     BACKUP_DIR="/backup/restaurant-data"
     TIMESTAMP=$(date +%Y%m%d_%H%M%S)
     tar -czf "$BACKUP_DIR/restaurant-data-$TIMESTAMP.tar.gz" /var/www/restaurant-app/data/
     find "$BACKUP_DIR" -type f -mtime +7 -delete
     EOF

     # Make script executable
     chmod +x /usr/local/bin/backup-restaurant-data.sh

     # Add to crontab
     echo "0 */6 * * * /usr/local/bin/backup-restaurant-data.sh" | crontab -
     ```
   - Keep at least 7 days of backups
   - Test backup restoration regularly
   - Consider off-site backup storage

## Hostinger VPS Specific Notes

1. Resource Monitoring:
   - Use Hostinger's VPS control panel to monitor resource usage
   - Set up email alerts for high resource usage
   - Monitor memory usage closely due to in-memory storage

2. Backup Management:
   - Use Hostinger's backup features for system-level backups
   - Set up automated backups through the control panel
   - Keep local backups of the data directory

3. Domain Management:
   - Configure DNS through Hostinger's DNS manager
   - Point your domain to the VPS IP address
   - Set appropriate TTL values for DNS records

Replace the following placeholders:
- `your_server_ip` with your VPS IP address
- `your_repository_url` with your Git repository URL
- `your-domain.com` with your actual domain name