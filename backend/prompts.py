# ================================
# SENAC Easy — Prompts da IA
# ================================
# Separado do api_groq.py para facilitar ajustes futuros.


def build_prompt(perfil: dict, mes: str) -> str:
    """
    Monta o prompt personalizado para geração do relatório.
    Quanto mais informações no perfil, mais personalizado fica o texto.
    """

    nome = perfil.get("nome", "o aprendiz")
    setor = perfil.get("setor", "setor administrativo")
    tipo_trabalho = perfil.get("tipo_trabalho", "atividades gerais")
    rotina = perfil.get("rotina", "atividades do dia a dia")
    produtos = perfil.get("produtos", "")
    estilo = perfil.get("estilo_escrita", "formal")  # formal | simples | detalhado

    # Instrução de estilo
    instrucoes_estilo = {
        "formal": "Use linguagem formal, profissional e objetiva.",
        "simples": "Use linguagem simples, clara e direta, como um jovem aprendiz escreveria.",
        "detalhado": "Use linguagem formal e descreva as atividades com bastante detalhe.",
    }.get(estilo, "Use linguagem formal e profissional.")

    # Linha extra sobre produtos/ferramentas, se informado
    linha_produtos = (
        f"Durante as atividades, {nome} utilizou ou teve contato com: {produtos}."
        if produtos
        else ""
    )

    prompt = f"""Você é um assistente que ajuda jovens aprendizes do programa SENAC MG a escrever seus Relatórios Diários de Prática Profissional.

Gere um relatório para o mês de {mes}, descrevendo as atividades práticas realizadas por {nome}, que trabalha no setor de {setor} e realiza as seguintes atividades: {tipo_trabalho}.

Rotina típica do aprendiz: {rotina}.
{linha_produtos}

Instruções importantes:
- {instrucoes_estilo}
- O relatório deve ter entre 20 e 28 dias úteis descritos.
- Cada dia deve ter de 2 a 4 linhas descrevendo atividades diferentes, mas coerentes com a rotina.
- Varie as atividades ao longo dos dias para soar natural (não repita o mesmo texto todos os dias).
- Use verbos de ação no passado (realizou, organizou, auxiliou, conferiu, atendeu, etc.).
- Não invente atividades fora do contexto do setor informado.
- Não inclua introdução, título ou explicação. Entregue APENAS os dias no formato abaixo.

Formato de cada dia:
Dia XX/MM/AAAA — [descrição das atividades do dia]

Exemplo:
Dia 01/03/2024 — Auxiliou na organização dos documentos do setor, conferiu planilhas de controle e participou de reunião de alinhamento com a equipe.

Gere o relatório completo agora, começando pelo primeiro dia útil do mês de {mes}.
"""

    return prompt
