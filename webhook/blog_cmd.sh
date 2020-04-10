 #!/bin/bash
cd /home/blog
git pull
pm2 reload blog
npm install
npm run build