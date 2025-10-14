#!/bin/bash

# Script para deploy automatizado com migrations e seed
# Este script executa migrations e seeds ANTES de fazer o deploy da aplicação

set -e  # Para em caso de erro

echo "🚀 Iniciando deploy com migrations e seed..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Aplicar namespace, configmap e secrets
echo -e "${YELLOW}📋 Aplicando configurações base...${NC}"
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 2. Executar migrations
echo -e "${YELLOW}🔧 Executando migrations...${NC}"
kubectl delete job garage-migration -n fiap-garage --ignore-not-found=true
kubectl apply -f k8s/migration-job.yaml

# Aguardar conclusão da migration
echo "⏳ Aguardando conclusão das migrations..."
kubectl wait --for=condition=complete --timeout=300s job/garage-migration -n fiap-garage

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations executadas com sucesso!${NC}"
    
    # Mostrar logs da migration
    echo -e "${YELLOW}📝 Logs da migration:${NC}"
    kubectl logs -n fiap-garage job/garage-migration --tail=50
else
    echo -e "${RED}❌ Falha ao executar migrations!${NC}"
    kubectl logs -n fiap-garage job/garage-migration --tail=100
    exit 1
fi

# 3. Executar seed
echo -e "${YELLOW}🌱 Executando seed...${NC}"
kubectl delete job garage-seed -n fiap-garage --ignore-not-found=true
kubectl apply -f k8s/seed-job.yaml

# Aguardar conclusão do seed
echo "⏳ Aguardando conclusão do seed..."
kubectl wait --for=condition=complete --timeout=300s job/garage-seed -n fiap-garage

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed executado com sucesso!${NC}"
    
    # Mostrar logs do seed
    echo -e "${YELLOW}📝 Logs do seed:${NC}"
    kubectl logs -n fiap-garage job/garage-seed --tail=50
else
    echo -e "${RED}❌ Falha ao executar seed!${NC}"
    kubectl logs -n fiap-garage job/garage-seed --tail=100
    exit 1
fi

# 4. Deploy da aplicação
echo -e "${YELLOW}🚀 Fazendo deploy da aplicação...${NC}"
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/api-service.yaml
kubectl apply -f k8s/hpa.yaml

# 5. Verificar status do deployment
echo -e "${YELLOW}⏳ Aguardando pods ficarem prontos...${NC}"
kubectl rollout status deployment/garage-api -n fiap-garage --timeout=300s

echo -e "${GREEN}✅ Deploy completo!${NC}"
echo ""
echo "📊 Status dos recursos:"
kubectl get all -n fiap-garage

echo ""
echo -e "${GREEN}🎉 Deploy finalizado com sucesso!${NC}"
