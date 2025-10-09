#!/bin/bash

set -euo pipefail

echo "🚀 Iniciando teste de stress..."
echo "Pressione Ctrl+C para parar"

API_URL=${API_URL:-"http://localhost:3000"}
REQUESTS_PER_SECOND=${REQUESTS_PER_SECOND:-1000}
CONCURRENCY=${CONCURRENCY:-50}
DURATION=${1:-60}

if ! command -v curl >/dev/null; then
  echo "❌ curl não encontrado no PATH" >&2
  exit 1
fi

trap 'echo "\n🛑 Teste interrompido"; exit 0' INT TERM

start_time=$(date +%s)

while true; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))

  if [ "$elapsed" -ge "$DURATION" ]; then
    echo "⏰ Teste concluído após $DURATION segundos"
    break
  fi

  echo "🔥 Gerando carga... ($elapsed/$DURATION segundos)"
  seq "$REQUESTS_PER_SECOND" | xargs -n1 -P "$CONCURRENCY" -I{} curl -s -o /dev/null "$API_URL"
  sleep 1
done

echo "✅ Stress test finalizado!"
