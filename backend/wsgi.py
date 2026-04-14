# ================================
# SENAC Easy — Entry point WSGI
# Usado pelo Gunicorn em produção
# ================================

from api_groq import app

if __name__ == "__main__":
    app.run()
