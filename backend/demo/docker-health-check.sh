#!/bin/bash
# Script para verificar se a aplicação está funcionando corretamente em Docker

echo "================================"
echo "Docker Compose Health Check"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se Docker está rodando
echo "[1] Verificando Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker não está rodando${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker está rodando${NC}"
echo ""

# 2. Verificar containers em execução
echo "[2] Verificando containers..."
if docker ps | grep -q "db_doacoes"; then
    echo -e "${GREEN}✓ MySQL (db_doacoes) está rodando${NC}"
else
    echo -e "${RED}✗ MySQL (db_doacoes) não está rodando${NC}"
fi

if docker ps | grep -q "demo_app"; then
    echo -e "${GREEN}✓ App (demo_app) está rodando${NC}"
else
    echo -e "${YELLOW}⚠ App (demo_app) ainda não está rodando (normal no início)${NC}"
fi
echo ""

# 3. Testar conexão com MySQL
echo "[3] Testando conexão com MySQL..."
if docker exec db_doacoes mysqladmin ping -u pedro -psenhalegal > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL respondeu ao ping${NC}"
else
    echo -e "${RED}✗ MySQL não respondeu ao ping${NC}"
fi
echo ""

# 4. Verificar tabelas no banco
echo "[4] Verificando tabelas criadas..."
TABLES=$(docker exec db_doacoes mysql -u pedro -psenhalegal -e "USE doacoes; SHOW TABLES;" 2>/dev/null | tail -n +2)
if [ ! -z "$TABLES" ]; then
    echo -e "${GREEN}✓ Tabelas encontradas:${NC}"
    echo "$TABLES" | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠ Nenhuma tabela encontrada (pode estar criando)${NC}"
fi
echo ""

# 5. Testar endpoint /health da aplicação
echo "[5] Testando endpoint /health..."
if docker ps | grep -q "demo_app"; then
    HEALTH=$(curl -s http://localhost:8080/health)
    if [ ! -z "$HEALTH" ]; then
        echo -e "${GREEN}✓ Aplicação respondendo:${NC}"
        echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
    else
        echo -e "${YELLOW}⚠ Aplicação ainda iniciando...${NC}"
    fi
else
    echo -e "${YELLOW}⚠ App não está rodando ainda${NC}"
fi
echo ""

# 6. Testar endpoint /auth/health (se existir)
echo "[6] Testando endpoint de cadastro..."
if docker ps | grep -q "demo_app"; then
    curl -s http://localhost:8080/health > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Endpoint /health está acessível${NC}"
    else
        echo -e "${YELLOW}⚠ Endpoints ainda não estão respondendo${NC}"
    fi
else
    echo -e "${YELLOW}⚠ App não está rodando${NC}"
fi
echo ""

echo "================================"
echo "Health Check Completo"
echo "================================"
echo ""
echo "Próximos passos:"
echo "  - Logs MySQL: docker-compose logs mysql"
echo "  - Logs App:   docker-compose logs app"
echo "  - Testar API: curl http://localhost:8080/health"
