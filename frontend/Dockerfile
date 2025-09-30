# 多阶段构建：构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制根目录的 package.json 和 workspace 配置
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制 shared 包
COPY packages/shared ./packages/shared

# 复制前端源码
COPY frontend ./frontend

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建 shared 包
RUN pnpm --filter shared run build

# 构建前端
RUN pnpm --filter frontend run build

# 运行阶段：使用 nginx 提供静态文件
FROM nginx:alpine AS runner

# 复制构建的文件
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]