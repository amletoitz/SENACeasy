// ================================
// SENAC Easy — App Principal
// Controla qual tela mostrar
// ================================

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import SetupScreen from "./src/screens/SetupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { carregarPerfil } from "./src/storage/userStorage";

export default function App() {
  const [perfil, setPerfil] = useState(null);       // null = não carregou ainda
  const [inicializado, setInicializado] = useState(false); // evita flash de tela

  // Ao abrir o app, verifica se o usuário já tem perfil salvo
  useEffect(() => {
    async function verificarPerfil() {
      const perfilSalvo = await carregarPerfil();
      setPerfil(perfilSalvo); // null se não tiver perfil ainda
      setInicializado(true);
    }
    verificarPerfil();
  }, []);

  // Tela de carregamento inicial
  if (!inicializado) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  // Se não tem perfil → mostra Setup
  if (!perfil) {
    return (
      <SetupScreen
        onConcluir={(novoPerfil) => setPerfil(novoPerfil)}
      />
    );
  }

  // Se tem perfil → mostra Home
  return (
    <HomeScreen
      perfil={perfil}
      onEditarPerfil={() => setPerfil(null)} // volta para o setup
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
