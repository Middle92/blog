 #!/bin/bash
cd /home/blog
git pull
pm2 reload blog_node
npm install
npm run build