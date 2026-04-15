# SENACeasy 📋

App mobile que automatiza a criação de **Relatórios Diários de Prática Profissional** para aprendizes do SENAC MG.

## Como funciona

1. Usuário preenche seu perfil (setor, rotina, tipo de trabalho)
2. Digita o mês desejado
3. A IA gera um relatório personalizado em português
4. Usuário copia e cola no portal do SENAC

## Stack

- **Frontend:** React Native + Expo
- **Backend:** Flask (Python) + Groq API (Mixtral)
- **Deploy:** Railway (backend) + Expo (mobile)

## Rodando localmente

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
cp ../.env.example ../.env  # preencha com sua GROQ_API_KEY
python api_groq.py
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```
GROQ_API_KEY=sua_chave_aqui
```

## Endpoints do Backend

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| POST | `/gerar-relatorio` | Gera o relatório via IA |

## Licença

MIT
