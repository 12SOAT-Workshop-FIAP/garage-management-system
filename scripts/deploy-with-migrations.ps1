# Script PowerShell para deploy automatizado com migrations e seed
# Este script executa migrations e seeds ANTES de fazer o deploy da aplicação

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy com migrations e seed..." -ForegroundColor Cyan

# 1. Aplicar namespace, configmap e secrets
Write-Host "`n📋 Aplicando configurações base..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 2. Executar migrations
Write-Host "`n🔧 Executando migrations..." -ForegroundColor Yellow
kubectl delete job garage-migration -n fiap-garage --ignore-not-found=true
kubectl apply -f k8s/migration-job.yaml

# Aguardar conclusão da migration
Write-Host "⏳ Aguardando conclusão das migrations..." -ForegroundColor Yellow
$migrationResult = kubectl wait --for=condition=complete --timeout=300s job/garage-migration -n fiap-garage 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations executadas com sucesso!" -ForegroundColor Green
    
    # Mostrar logs da migration
    Write-Host "`n📝 Logs da migration:" -ForegroundColor Yellow
    kubectl logs -n fiap-garage job/garage-migration --tail=50
} else {
    Write-Host "❌ Falha ao executar migrations!" -ForegroundColor Red
    kubectl logs -n fiap-garage job/garage-migration --tail=100
    exit 1
}

# 3. Executar seed
Write-Host "`n🌱 Executando seed..." -ForegroundColor Yellow
kubectl delete job garage-seed -n fiap-garage --ignore-not-found=true
kubectl apply -f k8s/seed-job.yaml

# Aguardar conclusão do seed
Write-Host "⏳ Aguardando conclusão do seed..." -ForegroundColor Yellow
$seedResult = kubectl wait --for=condition=complete --timeout=300s job/garage-seed -n fiap-garage 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Seed executado com sucesso!" -ForegroundColor Green
    
    # Mostrar logs do seed
    Write-Host "`n📝 Logs do seed:" -ForegroundColor Yellow
    kubectl logs -n fiap-garage job/garage-seed --tail=50
} else {
    Write-Host "❌ Falha ao executar seed!" -ForegroundColor Red
    kubectl logs -n fiap-garage job/garage-seed --tail=100
    exit 1
}

# 4. Deploy da aplicação
Write-Host "`n🚀 Fazendo deploy da aplicação..." -ForegroundColor Yellow
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/api-service.yaml
kubectl apply -f k8s/hpa.yaml

# 5. Verificar status do deployment
Write-Host "`n⏳ Aguardando pods ficarem prontos..." -ForegroundColor Yellow
kubectl rollout status deployment/garage-api -n fiap-garage --timeout=300s

Write-Host "`n✅ Deploy completo!" -ForegroundColor Green
Write-Host "`n📊 Status dos recursos:" -ForegroundColor Cyan
kubectl get all -n fiap-garage

Write-Host "`n🎉 Deploy finalizado com sucesso!" -ForegroundColor Green
