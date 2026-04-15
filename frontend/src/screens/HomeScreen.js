// ================================
// SENAC Easy — Tela Principal
// Gera o relatório e mostra o resultado
// ================================

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Clipboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CONFIG from "../config";

export default function HomeScreen({ perfil, onEditarPerfil }) {
  const [mes, setMes] = useState("");
  const [relatorio, setRelatorio] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  async function handleGerar() {
    if (!mes.trim()) {
      Alert.alert("Atenção", "Digite o mês e o ano. Ex: março de 2024");
      return;
    }

    setCarregando(true);
    setRelatorio("");
    setFeedbackEnviado(false);

    try {
      const resposta = await fetch(`${CONFIG.API_URL}/gerar-relatorio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mes: mes.trim(), perfil }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro desconhecido");
      }

      setRelatorio(dados.relatorio);
    } catch (e) {
      console.error("Erro ao gerar relatório:", e);
      Alert.alert(
        "Erro",
        "Não foi possível gerar o relatório. Verifique sua conexão e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  function handleCopiar() {
    if (!relatorio) return;
    Clipboard.setString(relatorio);
    Alert.alert("Copiado!", "Relatório copiado. Cole no site do SENAC.");
  }

  function handleFeedback(tipo) {
    // Por enquanto só registra localmente (feedback real vem em fase futura)
    setFeedbackEnviado(true);
    const msg =
      tipo === "positivo"
        ? "Ótimo! Que bom que o relatório ficou bom 😊"
        : "Entendido! Vamos melhorar nas próximas versões.";
    Alert.alert("Obrigado pelo feedback!", msg);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>SENACeasy</Text>
          <Text style={styles.subtitulo}>Olá, {perfil.nome || "aprendiz"}!</Text>
          <TouchableOpacity onPress={onEditarPerfil}>
            <Text style={styles.linkEditar}>✏️ Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Perfil resumido */}
        <View style={styles.resumoPerfil}>
          <Text style={styles.resumoTexto}>
            📋 {perfil.tipo_trabalho} · {perfil.setor}
          </Text>
        </View>

        {/* Campo de mês */}
        <Text style={styles.label}>Mês do relatório</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: março de 2024"
          value={mes}
          onChangeText={setMes}
          autoCapitalize="none"
        />

        {/* Botão gerar */}
        <TouchableOpacity
          style={[styles.botaoGerar, carregando && styles.botaoDesabilitado]}
          onPress={handleGerar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoGerarTexto}>⚡ Gerar Relatório</Text>
          )}
        </TouchableOpacity>

        {/* Resultado */}
        {relatorio ? (
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultadoTitulo}>Relatório gerado ✅</Text>

            {/* Caixa do relatório */}
            <ScrollView
              style={styles.relatorioCaixa}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.relatorioTexto}>{relatorio}</Text>
            </ScrollView>

            {/* Botão copiar */}
            <TouchableOpacity style={styles.botaoCopiar} onPress={handleCopiar}>
              <Text style={styles.botaoCopiarTexto}>📋 Copiar relatório</Text>
            </TouchableOpacity>

            {/* Feedback */}
            {!feedbackEnviado && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>O relatório ficou bom?</Text>
                <View style={styles.feedbackBotoes}>
                  <TouchableOpacity
                    style={styles.feedbackBotao}
                    onPress={() => handleFeedback("positivo")}
                  >
                    <Text style={styles.feedbackEmoji}>👍</Text>
                    <Text style={styles.feedbackTexto}>Gostei</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackBotao}
                    onPress={() => handleFeedback("negativo")}
                  >
                    <Text style={styles.feedbackEmoji}>👎</Text>
                    <Text style={styles.feedbackTexto}>Não gostei</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {/* Instrução final */}
        {relatorio ? (
          <Text style={styles.instrucao}>
            💡 Copie o texto acima e cole no campo de relatório do portal SENAC.
          </Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  cabecalho: {
    marginTop: 16,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  subtitulo: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
  },
  linkEditar: {
    fontSize: 13,
    color: "#e63946",
    marginTop: 4,
  },
  resumoPerfil: {
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
  },
  resumoTexto: {
    fontSize: 13,
    color: "#555",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#222",
  },
  botaoGerar: {
    marginTop: 16,
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoGerarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultadoContainer: {
    marginTop: 24,
  },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  relatorioCaixa: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    maxHeight: 320,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  relatorioTexto: {
    fontSize: 13,
    color: "#333",
    lineHeight: 21,
  },
  botaoCopiar: {
    marginTop: 12,
    backgroundColor: "#1a1a2e",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoCopiarTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  feedbackContainer: {
    marginTop: 18,
    alignItems: "center",
  },
  feedbackLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  feedbackBotoes: {
    flexDirection: "row",
    gap: 20,
  },
  feedbackBotao: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    width: 90,
  },
  feedbackEmoji: {
    fontSize: 24,
  },
  feedbackTexto: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  instrucao: {
    marginTop: 16,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
});
