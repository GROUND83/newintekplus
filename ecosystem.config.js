module.exports = {
  apps: [
    {
      name: "intekplus-server", // 앱의 이름
      script: "./node_modules/next/dist/bin/next", // Next.js 스크립트 경로
      args: "start", // Next.js 앱을 시작할 때 사용할 인수
      exec_mode: "cluster", // 실행 모드: cluster 또는 fork 중 선택
      instances: "1", // 클러스터 모드에서 실행할 인스턴스 수 (CPU 코어 수만큼)
      autorestart: true, // 프로세스 자동 재시작 활성화
      watch: true, // 파일 변경 감지 활성화 (개발 중에만 활용)
      max_memory_restart: "1G", // 1GB 이상 메모리 사용 시 재시작
      env: {
        NODE_ENV: "production", // Node.js 환경 설정
      },
    },
  ],
};
