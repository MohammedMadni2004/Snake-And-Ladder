import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const GameBoard = ({ route }) => {
  const { numberOfPlayers } = route.params;
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [playerPositions, setPlayerPositions] = useState(
    Array(numberOfPlayers).fill(0)
  );
  const [winners, setWinners] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameMessage, setGameMessage] = useState("Roll the dice to start!");

  const snakesAndLadders = {
    4: 14,
    9: 31,
    20: 38,
    28: 84,
    40: 59,
    51: 67,
    63: 81,

    17: 7,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    99: 78,
  };

  const findNextActivePlayer = (currentIdx) => {
    let nextIdx = (currentIdx + 1) % numberOfPlayers;
    let count = 0;

    while (count < numberOfPlayers) {
      if (!winners.includes(nextIdx)) {
        return nextIdx;
      }
      nextIdx = (nextIdx + 1) % numberOfPlayers;
      count++;
    }

    return nextIdx;
  };

  const rollDice = () => {
    if (gameEnded) return;

    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    movePlayer(value);
  };

  const movePlayer = (steps) => {
    const positions = [...playerPositions];
    let newPosition = positions[currentPlayer] + steps;

    if (newPosition > 100) {
      setGameMessage(`You need exact number to reach 100. Try again!`);
    } else {
      positions[currentPlayer] = newPosition;

      if (Object.prototype.hasOwnProperty.call(snakesAndLadders, newPosition)) {
        const isLadder = snakesAndLadders[newPosition] > newPosition;
        setGameMessage(
          isLadder
            ? `Player ${
                currentPlayer + 1
              } climbed a ladder from ${newPosition} to ${
                snakesAndLadders[newPosition]
              }!`
            : `Player ${
                currentPlayer + 1
              } was bitten by a snake and moved from ${newPosition} to ${
                snakesAndLadders[newPosition]
              }!`
        );
        positions[currentPlayer] = snakesAndLadders[newPosition];
      } else {
        setGameMessage(
          `Player ${currentPlayer + 1} moved to position ${newPosition}`
        );
      }

      if (positions[currentPlayer] === 100) {
        if (!winners.includes(currentPlayer)) {
          const newWinners = [...winners, currentPlayer];
          setWinners(newWinners);
          setGameMessage(
            `Player ${currentPlayer + 1} has reached the finish line!`
          );

          if (newWinners.length === numberOfPlayers - 1) {
            const loser = Array.from(Array(numberOfPlayers).keys()).find(
              (player) => !newWinners.includes(player)
            );

            setGameMessage(`Game over! Player ${loser + 1} lost the game.`);
            setGameEnded(true);
          }
        }
      }
    }

    setPlayerPositions(positions);

    if (!gameEnded) {
      const nextPlayer = findNextActivePlayer(currentPlayer);
      setCurrentPlayer(nextPlayer);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Snake and Ladder</Text>

        <View style={styles.gameBoard}>
          <View style={styles.boardGrid}>
            {[...Array(10)].map((_, rowIdx) => (
              <View key={rowIdx} style={styles.boardRow}>
                {[...Array(10)].map((_, colIdx) => {
                  const cellNumber =
                    rowIdx % 2 === 0
                      ? 100 - rowIdx * 10 - colIdx
                      : 100 - rowIdx * 10 - 9 + colIdx;

                  const playersOnCell = (playerPositions || [])
                    .map((pos, idx) => (pos === cellNumber ? idx : -1))
                    .filter((idx) => idx !== -1);

                  return (
                    <View
                      key={colIdx}
                      style={[
                        styles.boardCell,
                        snakesAndLadders[cellNumber] &&
                        snakesAndLadders[cellNumber] > cellNumber
                          ? styles.ladderCell
                          : snakesAndLadders[cellNumber]
                          ? styles.snakeCell
                          : null,
                      ]}
                    >
                      <Text style={styles.cellNumber}>{cellNumber}</Text>
                      {playersOnCell.map((playerIdx) => (
                        <View
                          key={playerIdx}
                          style={[
                            styles.playerToken,
                            { backgroundColor: getPlayerColor(playerIdx) },
                          ]}
                        />
                      ))}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.gameControls}>
          <Text style={styles.gameMessage}>{gameMessage}</Text>

          <View style={styles.playerInfo}>
            {playerPositions.map((position, idx) => (
              <View key={idx} style={styles.playerStatus}>
                <View
                  style={[
                    styles.playerIndicator,
                    { backgroundColor: getPlayerColor(idx) },
                    winners.includes(idx) && styles.winnerIndicator,
                  ]}
                />
                <Text
                  style={[
                    styles.playerText,
                    winners.includes(idx) && styles.winnerText,
                  ]}
                >
                  Player {idx + 1}: Position {position}
                  {winners.includes(idx) ? " 🏆" : ""}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.diceContainer}>
            <Text style={styles.diceValue}>{diceValue || "-"}</Text>
          </View>

          {!gameEnded ? (
            <TouchableOpacity
              style={[
                styles.rollButton,
                winners.includes(currentPlayer) && styles.disabledButton,
              ]}
              onPress={rollDice}
              disabled={winners.includes(currentPlayer)}
            >
              <Text style={styles.rollButtonText}>
                {`Player ${currentPlayer + 1} Roll Dice`}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.gameOverText}>Game Over</Text>
          )}
        </View>
      </View>

      {gameEnded && (
        <View style={styles.winnersContainer}>
          <Text style={styles.winnersTitle}>Winners</Text>
          <View style={styles.winnersList}>
            {winners.map((playerIndex, i) => (
              <View key={playerIndex} style={styles.winnerItem}>
                <View
                  style={[
                    styles.playerIndicator,
                    { backgroundColor: getPlayerColor(playerIndex) },
                    styles.winnerIndicator,
                  ]}
                />
                <Text style={styles.winnerText}>
                  {i + 1}. Player {playerIndex + 1}
                </Text>
              </View>
            ))}

            {Array.from(Array(numberOfPlayers).keys())
              .filter((player) => !winners.includes(player))
              .map((playerIndex) => (
                <View key={`loser-${playerIndex}`} style={styles.winnerItem}>
                  <View
                    style={[
                      styles.playerIndicator,
                      { backgroundColor: getPlayerColor(playerIndex) },
                      styles.loserIndicator,
                    ]}
                  />
                  <Text style={styles.loserText}>
                    {winners.length + 1}. Player {playerIndex + 1} (Lost)
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

function getPlayerColor(playerIndex) {
  const colors = ["#FF5252", "#448AFF", "#66BB6A", "#FFC107"];
  return colors[playerIndex % colors.length];
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  gameBoard: {
    alignItems: "center",
    marginVertical: 10,
  },
  boardGrid: {
    borderWidth: 2,
    borderColor: "#333",
  },
  boardRow: {
    flexDirection: "row",
  },
  boardCell: {
    width: 35,
    height: 35,
    borderWidth: 0.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  snakeCell: {
    backgroundColor: "#ffcdd2",
  },
  ladderCell: {
    backgroundColor: "#c8e6c9",
  },
  cellNumber: {
    fontSize: 10,
  },
  gameControls: {
    padding: 10,
  },
  gameMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "500",
  },
  playerInfo: {
    marginVertical: 10,
  },
  playerStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  playerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  playerText: {
    fontSize: 15,
  },
  diceContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#333",
    marginVertical: 15,
  },
  diceValue: {
    fontSize: 30,
    fontWeight: "bold",
  },
  rollButton: {
    backgroundColor: "#03A9F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  rollButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  playerToken: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  winnerIndicator: {
    borderWidth: 2,
    borderColor: "gold",
  },
  loserIndicator: {
    borderWidth: 2,
    borderColor: "#999",
  },
  winnerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  loserText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#757575",
  },
  winnersContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  winnersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  winnersList: {
    marginVertical: 10,
  },
  winnerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 5,
  },
  gameOverText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default GameBoard;
