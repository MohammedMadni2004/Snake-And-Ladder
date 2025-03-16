import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const PlayerSelection = ({ navigation }) => {
  const [selectedPlayers, setSelectedPlayers] = useState(2);

  const playerOptions = [2, 3, 4];

  const handleStartGame = () => {
    navigation.navigate("GameBoard", { numberOfPlayers: selectedPlayers });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Number of Players</Text>

      <View style={styles.playerOptions}>
        {playerOptions.map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.playerOption,
              selectedPlayers === number && styles.selectedOption,
            ]}
            onPress={() => setSelectedPlayers(number)}
          >
            <Text style={styles.playerOptionText}>{number} Players</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  playerOptions: {
    width: "100%",
    marginBottom: 30,
  },
  playerOption: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00b0ff",
  },
  playerOptionText: {
    textAlign: "center",
    fontSize: 16,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlayerSelection;
