# ================================
# SENAC Easy — Dockerfile
# ================================

# Imagem base leve do Python
FROM python:3.11-slim

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia só o requirements primeiro (cache do Docker)
COPY requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do backend
COPY backend/ ./backend/

# Expõe a porta padrão
EXPOSE 5000

# Comando de inicialização com Gunicorn (produção)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "backend.wsgi:app"]
