# Build stage
FROM node:20-alpine AS builder

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 소스 복사
COPY package.json pnpm-lock.yaml ./
COPY . .

# 의존성 설치 및 빌드
RUN pnpm install
RUN pnpm build

# Production stage
FROM node:20-alpine

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# builder에서 필요한 파일들만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/envs ./envs

# 프로덕션 의존성만 설치
RUN pnpm install --prod

# 포트 노출
EXPOSE 7777

# 앱 실행
CMD ["pnpm", "start:prod"]