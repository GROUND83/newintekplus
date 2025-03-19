#!/bin/bash
set -e  # 오류 발생 시 스크립트 중단

# 현재 디렉토리 출력
echo "Current directory: $(pwd)"

# node_modules 디렉토리가 있는지 확인
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  yarn install  # 또는 npm install
fi

# next.js 바이너리가 있는지 확인
if [ ! -f "node_modules/next/dist/bin/next" ]; then
  echo "Re-installing next.js..."
  yarn add next  # 또는 npm install next
fi

# PM2로 애플리케이션 시작
yarn run pm2 start ecosystem.config.js --env production