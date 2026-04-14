// ================================
// SENAC Easy — Storage do Usuário
// Salva e carrega o perfil localmente
// ================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_PERFIL = "@senaceasy:perfil";

// Salva o perfil do usuário no dispositivo
export async function salvarPerfil(perfil) {
  try {
    await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
  } catch (e) {
    console.error("Erro ao salvar perfil:", e);
  }
}

// Carrega o perfil salvo. Retorna null se não existir.
export async function carregarPerfil() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_PERFIL);
    return dados ? JSON.parse(dados) : null;
  } catch (e) {
    console.error("Erro ao carregar perfil:", e);
    return null;
  }
}

// Apaga o perfil (útil para reset ou logout futuro)
export async function limparPerfil() {
  try {
    await AsyncStorage.removeItem(CHAVE_PERFIL);
  } catch (e) {
    console.error("Erro ao limpar perfil:", e);
  }
}
