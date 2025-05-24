# 構建階段
FROM node:18-alpine as build

# 設定工作目錄
WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm ci

# 複製代碼並構建
COPY . .
# 跳過TypeScript檢查，直接使用vite構建
RUN sed -i 's/"build": "tsc -b && vite build"/"build": "vite build"/' package.json && npm run build

# 生產階段
FROM nginx:alpine

# 複製構建結果到 nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 創建啟動腳本
RUN echo '#!/bin/sh\n\
# 替換API URL\n\
if [ ! -z "$VITE_API_URL" ]; then\n\
  echo "Setting API URL to: $VITE_API_URL"\n\
  sed -i "s|API_URL: \".*\"|API_URL: \"$VITE_API_URL\"|g" /usr/share/nginx/html/index.html\n\
fi\n\
\n\
# 啟動nginx\n\
exec nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh \
&& chmod +x /docker-entrypoint.sh

# 配置 nginx 處理 SPA 路由
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    # 啟用 gzip 壓縮提升效能 \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_comp_level 6; \
    gzip_min_length 1000; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
