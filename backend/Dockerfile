# 最终镜像：生产环境
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# 复制所有必要文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY backend ./backend

# 安装依赖
RUN pnpm install --frozen-lockfile

# 先生成 Prisma 客户端（在 TypeScript 编译之前）
WORKDIR /app/backend
RUN pnpm exec prisma generate

# 然后构建项目
WORKDIR /app
RUN pnpm run build:shared
RUN pnpm run build:backend

# 阶段 2: 运行时镜像
FROM node:20-alpine

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S backend -u 1001

WORKDIR /app

# 复制 package 文件
COPY --chown=backend:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=backend:nodejs packages/shared/package.json ./packages/shared/
COPY --chown=backend:nodejs backend/package.json ./backend/

# 安装生产依赖
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile && \
    pnpm store prune

# 复制构建产物
COPY --from=builder --chown=backend:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=backend:nodejs /app/backend/prisma ./backend/prisma

# 生成 Prisma 客户端
WORKDIR /app/backend
RUN pnpm exec prisma generate

USER backend
EXPOSE 3001

CMD ["dumb-init", "node", "dist/index.js"]