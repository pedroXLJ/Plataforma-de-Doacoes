# 🎁 Plataforma de Doações - Backend

API REST completa para gerenciar doações, voluntários, entidades e pagamentos via PIX usando PagSeguro.

## 📋 Sumário

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Exemplos de Uso](#exemplos-de-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)

---

## 📦 Requisitos

### Com Docker
- Docker Desktop instalado
- Docker Compose instalado

---

## 🚀 Instalação

### Com Docker Compose (Recomendado)

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/Plataforma-de-Doacoes.git
cd Plataforma-de-Doacoes/backend/demo
```

2. **Inicie os containers**
```bash
docker-compose up -d --build
```

3. **Verifique o status**
```bash
docker-compose ps
```

Pronto! A API estará disponível em `http://localhost:8080`

---

## 🎯 Executando a Aplicação

### Com Docker Compose

**Iniciar a aplicação:**
```bash
docker-compose up -d --build
```

**Ver logs em tempo real:**
```bash
docker-compose logs -f app
```

**Parar a aplicação:**
```bash
docker-compose down
```

**Parar e remover dados (banco de dados):**
```bash
docker-compose down -v
```

### Verificar se está rodando

```bash
curl http://localhost:8080/health
```

Resposta esperada:
```json
{
  "status": "UP",
  "message": "Application is healthy"
}
```

### Front End

**Iniciar:**
```bash
npm run dev (local)
```

---

## 🔌 Endpoints

### 🔓 Autenticação (`/auth`)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/auth/cadastrar-voluntario` | ❌ | Cadastrar novo voluntário |
| `POST` | `/auth/cadastrar-entidade` | ❌ | Cadastrar nova entidade |
| `POST` | `/auth/login` | ❌ | Login (retorna JWT token) |
| `GET` | `/auth/me` | ✅ JWT | Obter dados do usuário autenticado |

### 👥 Voluntários (`/voluntarios`)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `GET` | `/voluntarios` | ❌ | Listar todos os voluntários |

### 🏢 Entidades (`/entidades`)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `GET` | `/entidades` | ❌ | Listar todas as entidades |

### 💰 PIX (`/api/pix`)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `POST` | `/api/pix/gerar` | ✅ JWT | Gerar QR Code PIX para doação |

### 🏥 Health (`/health`)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `GET` | `/health` | ❌ | Health check da aplicação |

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)** para autenticação.

### Fluxo de Autenticação

1. **Cadastrar** usuário (voluntário ou entidade)
2. **Fazer login** com email e senha
3. **Receber token JWT**
4. **Incluir token** em requisições autenticadas no header `Authorization: Bearer <token>`

### Estrutura do Token JWT

```
Header: {"alg":"HS256"}
Payload: {
  "sub": "email@usuario.com",
  "tipo": "VOLUNTARIO",
  "iat": 1764275003,
  "exp": 1764361403
}
Signature: hBJnmRuQv-_82UOzrn8e8woGUnC3RH-5EMooPlvioUM
```

---

## 📚 Exemplos de Uso

### 1. Cadastrar Voluntário

```bash
curl -X POST http://localhost:8080/auth/cadastrar-voluntario \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

Resposta:
```
Voluntário cadastrado com sucesso!
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvQGV4YW1wbGUuY29tIiwidGlwbyI6IlZPTFVOVEFSSU8iLCJpYXQiOjE3NjQyNzUwMDMsImV4cCI6MTc2NDM2MTQwM30.hBJnmRuQv-_82UOzrn8e8woGUnC3RH-5EMooPlvioUM"
}
```

### 3. Obter Dados do Usuário Autenticado

```bash
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvQGV4YW1wbGUuY29tIiwidGlwbyI6IlZPTFVOVEFSSU8iLCJpYXQiOjE3NjQyNzUwMDMsImV4cCI6MTc2NDM2MTQwM30.hBJnmRuQv-_82UOzrn8e8woGUnC3RH-5EMooPlvioUM"
```

Resposta:
```json
{
  "id": 1,
  "email": "joao@example.com",
  "tipo": "VOLUNTARIO",
  "nome": "João Silva",
  "cpf": "12345678901",
  "jaVoluntariou": false
}
```

### 4. Listar Voluntários

```bash
curl -X GET http://localhost:8080/voluntarios
```

Resposta:
```json
[
  {
    "id": 1,
    "email": "joao@example.com",
    "nome": "João Silva",
    "cpf": "12345678901",
    "jaVoluntariou": false
  }
]
```

### 5. Listar Entidades

```bash
curl -X GET http://localhost:8080/entidades
```

Resposta:
```json
[
  {
    "id": 1,
    "email": "ong@example.com",
    "nomeFantasia": "ONG Solidária",
    "cnpj": "12345678000190",
    "areaAtuacao": "Educação",
    "endereco": {
      "rua": "Rua das Flores",
      "numero": "42",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01310100"
    }
  }
]
```

### 6. Gerar PIX para Doação (com autenticação)

```bash
curl -X POST http://localhost:8080/api/pix/gerar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "valor": 50.00,
    "referencia": "doacao-001"
  }'
```

Resposta:
```json
{
  "orderId": "order-123456",
  "qrCodeText": "00020126580014br.gov.bcb.pix...",
  "qrCodeImage": "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAY..."
}
```

---

## 📁 Estrutura do Projeto

```
demo/
├── src/
│   ├── main/
│   │   ├── java/doacao/demo/
│   │   │   ├── config/              # Configurações (JWT, Security, CORS)
│   │   │   ├── controllers/         # REST Controllers
│   │   │   ├── DTOs/               # Data Transfer Objects
│   │   │   ├── models/             # Entidades JPA
│   │   │   ├── repositories/       # Acesso a dados
│   │   │   ├── services/           # Lógica de negócio
│   │   │   └── DemoApplication.java # Classe principal
│   │   └── resources/
│   │       └── application.properties # Configurações
│   └── test/                        # Testes unitários e de integração
├── Dockerfile                       # Build da aplicação
├── docker-compose.yml              # Orquestração de containers
├── pom.xml                         # Dependências Maven
├── mvnw / mvnw.cmd                # Maven Wrapper
└── README.md                       # Este arquivo
```

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 21 | Linguagem principal |
| Spring Boot | 4.0.0 | Framework web |
| Spring Security | 7.0.0 | Autenticação e autorização |
| Spring Data JPA | 4.0.0 | Acesso a dados |
| MySQL | 8.0 | Banco de dados |
| Hibernate | 7.1.8 | ORM |
| JWT (jjwt) | 0.11.5 | Tokens JWT |
| Lombok | 1.18.42 | Redução de boilerplate |
| Docker | Latest | Containerização |
| Maven | 3.9.4 | Build tool |

---

## 🔗 Integração com Frontend

O frontend React está em `npm run dev` e se conecta automaticamente ao backend em `http://localhost:8080`.

### CORS Configurado
O backend aceita requisições do frontend configurado em `app.frontend.origin` (padrão: `http://localhost:3000`).

Para alterar, edite `application.properties`:
```properties
app.frontend.origin=http://seu-dominio:porta
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused" na porta 8080
```bash
# Verifique se o container está rodando
docker-compose ps

# Veja os logs
docker-compose logs app
```

### Erro: "Database connection failed"
```bash
# Reinicie os containers
docker-compose down
docker-compose up -d --build

# Aguarde ~30 segundos para o MySQL inicializar
```

### Erro: "Port 8080 already in use"
```bash
# Encontre o processo usando a porta
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Ou mude a porta em docker-compose.yml
ports:
  - "8081:8080"  # Mapeie para 8081
```

---

## 📝 Validações

- **Email**: Deve ser válido (RFC 5322)
- **Senha**: Mínimo 6 caracteres
- **CPF**: Mínimo 11 dígitos
- **CNPJ**: Mínimo 14 dígitos
- **PIX Valor**: Positivo e numérico

---

## 🔒 Segurança

- ✅ Senhas criptografadas com BCrypt
- ✅ Tokens JWT com expiração (24h)
- ✅ CSRF desabilitado (API stateless)
- ✅ CORS restrito ao domínio do frontend
- ✅ Validação de entrada em todas as requisições

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 🚀 Próximos Passos

- [ ] Implementar endpoints de doações
- [ ] Adicionar filtros e paginação
- [ ] Melhorar tratamento de erros
- [ ] Adicionar testes de integração completos
- [ ] Deploy em produção (AWS/Azure)

---

**Desenvolvido com ❤️ para a Plataforma de Doações**
