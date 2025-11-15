# 多阶段构建：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 运行阶段：使用 nginx 提供静态文件
FROM nginx:alpine AS runner

# 直接复制构建好的前端文件到 nginx 的默认目录
COPY frontend/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]