# ================================
# SENAC Easy — Backend Principal
# Flask + Groq API
# ================================

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from prompts import build_prompt

# Carrega variáveis do .env (só em desenvolvimento local)
load_dotenv()

app = Flask(__name__)

# Permite requisições do app mobile (qualquer origem no MVP)
CORS(app)

# Inicializa cliente Groq com a chave do ambiente
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Modelo usado (rápido e eficiente para textos em português)
MODELO = "mixtral-8x7b-32768"


# --------------------------------
# Health Check
# --------------------------------
@app.route("/health", methods=["GET"])
def health():
    """Verifica se o servidor está no ar. Usado pelo Railway."""
    return jsonify({"status": "ok", "servico": "SENACeasy Backend"}), 200


# --------------------------------
# Gerar Relatório
# --------------------------------
@app.route("/gerar-relatorio", methods=["POST"])
def gerar_relatorio():
    """
    Recebe o perfil do usuário e o mês,
    e retorna o relatório gerado pela IA.

    Body esperado (JSON):
    {
        "mes": "março de 2024",
        "perfil": {
            "nome": "João Silva",
            "setor": "administrativo",
            "tipo_trabalho": "auxiliar administrativo",
            "rotina": "organização de documentos, atendimento, planilhas",
            "produtos": "Excel, impressora, sistema interno",
            "estilo_escrita": "simples"
        }
    }
    """

    dados = request.get_json()

    # Validação básica
    if not dados:
        return jsonify({"erro": "Corpo da requisição vazio."}), 400

    mes = dados.get("mes", "").strip()
    perfil = dados.get("perfil", {})

    if not mes:
        return jsonify({"erro": "Campo 'mes' é obrigatório."}), 400

    # Monta o prompt personalizado
    prompt = build_prompt(perfil=perfil, mes=mes)

    try:
        # Chama a API do Groq
        resposta = client.chat.completions.create(
            model=MODELO,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é um assistente especializado em relatórios de prática "
                        "profissional para jovens aprendizes do SENAC MG. "
                        "Responda sempre em português brasileiro."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.8,       # Um pouco de variação para não ficar repetitivo
            max_tokens=4096,       # Suficiente para ~25 dias de relatório
        )

        relatorio = resposta.choices[0].message.content.strip()

        return jsonify({"relatorio": relatorio}), 200

    except Exception as e:
        # Log do erro no servidor
        print(f"[ERRO] Falha ao chamar Groq: {e}")
        return jsonify({"erro": "Falha ao gerar relatório. Tente novamente."}), 500


# --------------------------------
# Inicialização local
# --------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "production") == "development"
    print(f"🚀 SENACeasy backend rodando na porta {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
