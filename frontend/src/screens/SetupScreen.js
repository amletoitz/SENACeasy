// ================================
// SENAC Easy — Tela de Setup
// Usuário preenche seu perfil uma vez
// ================================

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { salvarPerfil } from "../storage/userStorage";

export default function SetupScreen({ onConcluir }) {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [tipoTrabalho, setTipoTrabalho] = useState("");
  const [rotina, setRotina] = useState("");
  const [produtos, setProdutos] = useState("");
  const [estiloEscrita, setEstiloEscrita] = useState("simples");

  const estilos = ["simples", "formal", "detalhado"];

  async function handleSalvar() {
    // Validação mínima
    if (!nome.trim() || !setor.trim() || !tipoTrabalho.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos: Nome, Setor e Tipo de trabalho."
      );
      return;
    }

    const perfil = {
      nome: nome.trim(),
      setor: setor.trim(),
      tipo_trabalho: tipoTrabalho.trim(),
      rotina: rotina.trim(),
      produtos: produtos.trim(),
      estilo_escrita: estiloEscrita,
    };

    await salvarPerfil(perfil);
    onConcluir(perfil); // Avança para a tela principal
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
        <Text style={styles.titulo}>Configure seu perfil</Text>
        <Text style={styles.subtitulo}>
          Feito uma vez — quanto mais detalhes, mais personalizado fica o
          relatório.
        </Text>

        {/* Nome */}
        <Text style={styles.label}>Seu nome *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João Silva"
          value={nome}
          onChangeText={setNome}
        />

        {/* Setor */}
        <Text style={styles.label}>Setor onde trabalha *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Administrativo, RH, Estoque..."
          value={setor}
          onChangeText={setSetor}
        />

        {/* Tipo de trabalho */}
        <Text style={styles.label}>Seu cargo / função *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Auxiliar administrativo, Aprendiz de vendas..."
          value={tipoTrabalho}
          onChangeText={setTipoTrabalho}
        />

        {/* Rotina */}
        <Text style={styles.label}>Rotina diária (o que você faz no dia a dia?)</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          placeholder="Ex: organizo documentos, faço planilhas, atendo clientes, confiro notas fiscais..."
          value={rotina}
          onChangeText={setRotina}
          multiline
          numberOfLines={3}
        />

        {/* Produtos / ferramentas */}
        <Text style={styles.label}>Ferramentas / produtos que usa</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Excel, impressora, sistema SAP, caixa registradora..."
          value={produtos}
          onChangeText={setProdutos}
        />

        {/* Estilo de escrita */}
        <Text style={styles.label}>Estilo do relatório</Text>
        <View style={styles.estiloContainer}>
          {estilos.map((e) => (
            <TouchableOpacity
              key={e}
              style={[
                styles.estiloBotao,
                estiloEscrita === e && styles.estiloBotaoAtivo,
              ]}
              onPress={() => setEstiloEscrita(e)}
            >
              <Text
                style={[
                  styles.estiloTexto,
                  estiloEscrita === e && styles.estiloTextoAtivo,
                ]}
              >
                {e.charAt(0).toUpperCase() + e.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão salvar */}
        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.botaoSalvarTexto}>Salvar e continuar →</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 6,
    marginTop: 16,
  },
  subtitulo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 24,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#222",
  },
  inputMultilinha: {
    height: 80,
    textAlignVertical: "top",
  },
  estiloContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  estiloBotao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  estiloBotaoAtivo: {
    backgroundColor: "#1a1a2e",
    borderColor: "#1a1a2e",
  },
  estiloTexto: {
    fontSize: 13,
    color: "#555",
  },
  estiloTextoAtivo: {
    color: "#fff",
    fontWeight: "600",
  },
  botaoSalvar: {
    marginTop: 32,
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoSalvarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
