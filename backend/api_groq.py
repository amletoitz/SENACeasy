# ================================
# SENAC Easy — Backend API (Flask + Groq)
# ================================

import os
from flask import Flask, request, jsonify
from groq import Groq
from prompts import build_prompt   # importa o prompt que você tem

app = Flask(__name__)

# Função segura para criar o client Groq (só quando precisar)
def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("❌ GROQ_API_KEY não encontrada no ambiente! Verifique as variáveis no Railway.")
    return Groq(api_key=api_key)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "SENACeasy backend rodando"})


@app.route('/gerar-relatorio', methods=['POST'])
def gerar_relatorio():
    try:
        data = request.get_json()
        if not data or 'mes' not in data:
            return jsonify({"erro": "Campo 'mes' é obrigatório (ex: 'Março 2026')"}), 400

        mes = data['mes']
        
        # Perfil fixo por enquanto (depois vamos pegar do banco ou do frontend)
        perfil = {
            "nome": "Matheus Fellipe",
            "setor": "Administração / Suporte",
            "tipo_trabalho": "atividades administrativas, organização de documentos, suporte ao time",
            "rotina": "organização de arquivos, atendimento interno, controle de planilhas e apoio geral",
            "produtos": "computador, planilhas Excel, sistema interno da empresa",
            "estilo_escrita": "simples"
        }

        # Monta o prompt
        prompt = build_prompt(perfil, mes)

        # Cria o client Groq só agora (evita crash no startup)
        client = get_groq_client()

        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1800,
        )

        relatorio = completion.choices[0].message.content.strip()

        return jsonify({
            "status": "sucesso",
            "relatorio": relatorio,
            "mes": mes
        })

    except ValueError as ve:
        return jsonify({"erro": str(ve)}), 500
    except Exception as e:
        return jsonify({"erro": f"Erro ao gerar relatório: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)