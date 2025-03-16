import React, { useState } from "react";
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
  const [winner, setWinner] = useState([]);
    const [showWinners, setShowWinners] = useState(false);
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

  const rollDice = () => {
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
        setGameMessage(`Player ${currentPlayer + 1} wins the game!`);
        setWinner((prevWinners) => {
          const updatedWinners = [...prevWinners, currentPlayer];
          if (updatedWinners.length === numberOfPlayers-1) {
            setShowWinners(true);
          }
          return updatedWinners;
        });
      }
      
    }

    setPlayerPositions(positions);
    setCurrentPlayer((currentPlayer + 1) % numberOfPlayers);
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
                  ]}
                />
                <Text style={styles.playerText}>
                  Player {idx + 1}: Position {position}
                  
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.diceContainer}>
            <Text style={styles.diceValue}>{diceValue || "-"}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.rollButton,
              playerPositions[currentPlayer] === 100 && styles.disabledButton,
            ]}
            onPress={rollDice}
            {...(playerPositions[currentPlayer] === 100 && setCurrentPlayer((currentPlayer + 1) % numberOfPlayers))}
            // disabled={playerPositions[currentPlayer] === 100}
          >
            <Text style={styles.rollButtonText}>
              {`Player ${currentPlayer + 1} Roll Dice`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {showWinners && <View>
        <Text style={styles.title}>Winners</Text>
        <View style={styles.playerInfo}>
            {winner.map((playerIndex) => (
              <View key={playerIndex} style={styles.playerStatus}>
                <View
                  style={[
                    styles.playerIndicator,
                    { backgroundColor: getPlayerColor(playerIndex) },
                  ]}
                />
                <Text style={styles.playerText}>
                  Player {playerIndex + 1}
                </Text>
              </View>
            ))}
          </View>
      </View>}
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
});

export default GameBoard;
