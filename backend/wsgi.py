# ================================
# SENAC Easy — Entry point WSGI
# ================================

import sys
import os

# Adiciona o diretório atual no path do Python
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from api_groq import app

if __name__ == "__main__":
    app.run()