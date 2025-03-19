import styles from "./GameBoardStyles";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Svg, { Path, Line, Circle, G, Ellipse } from "react-native-svg";

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
  const [boardSize, setBoardSize] = useState({ width: 350, height: 350 });
  const [cellPositions, setCellPositions] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  
  const diceAnimation = useRef(new Animated.Value(0)).current;
  const playerAnimations = useRef(Array(numberOfPlayers).fill().map(() => ({
    position: new Animated.ValueXY({ x: 0, y: 0 }),
    scale: new Animated.Value(1),
    rotation: new Animated.Value(0)
  }))).current;
  
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

  useEffect(() => {
    const cellSize = boardSize.width / 10;
    const positions = {};

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cellNumber = row % 2 === 0 
          ? 100 - row * 10 - col 
          : 100 - row * 10 - 9 + col;
          
        positions[cellNumber] = {
          x: col * cellSize + cellSize / 2,
          y: row * cellSize + cellSize / 2,
          cellSize: cellSize
        };
      }
    }
    
    setCellPositions(positions);
  }, [boardSize]);

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

  const animateDiceRoll = () => {
    diceAnimation.setValue(0);
    
    return Animated.timing(diceAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true
    }).start();
  };
  
  const animatePlayerMovement = (playerIdx, fromPos, toPos) => {
    if (!cellPositions[fromPos] || !cellPositions[toPos]) return Promise.resolve();
    
    const fromX = cellPositions[fromPos]?.x || 0;
    const fromY = cellPositions[fromPos]?.y || 0;
    const toX = cellPositions[toPos]?.x || 0;
    const toY = cellPositions[toPos]?.y || 0;
    
    playerAnimations[playerIdx].position.setValue({ x: fromX, y: fromY });
    
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(playerAnimations[playerIdx].position, {
          toValue: { x: toX, y: toY },
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(resolve);
    });
  };
  
  const animateLadderClimb = (playerIdx, fromPos, toPos) => {
    if (!cellPositions[fromPos] || !cellPositions[toPos]) return Promise.resolve();
    
    const fromX = cellPositions[fromPos]?.x || 0;
    const fromY = cellPositions[fromPos]?.y || 0;
    const toX = cellPositions[toPos]?.x || 0;
    const toY = cellPositions[toPos]?.y || 0;
    
    playerAnimations[playerIdx].position.setValue({ x: fromX, y: fromY });
    
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.parallel([
          Animated.timing(playerAnimations[playerIdx].position, {
            toValue: { x: toX, y: toY },
            duration: 1000,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true
          }),
          Animated.sequence([
            Animated.timing(playerAnimations[playerIdx].rotation, {
              toValue: 0.15,
              duration: 250,
              useNativeDriver: true
            }),
            Animated.timing(playerAnimations[playerIdx].rotation, {
              toValue: -0.15,
              duration: 250,
              useNativeDriver: true
            }),
            Animated.timing(playerAnimations[playerIdx].rotation, {
              toValue: 0.15,
              duration: 250,
              useNativeDriver: true
            }),
            Animated.timing(playerAnimations[playerIdx].rotation, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true
            })
          ])
        ]),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(resolve);
    });
  };
  
  const animateSnakeBite = (playerIdx, fromPos, toPos) => {
    if (!cellPositions[fromPos] || !cellPositions[toPos]) return Promise.resolve();
    
    const fromX = cellPositions[fromPos]?.x || 0;
    const fromY = cellPositions[fromPos]?.y || 0;
    const toX = cellPositions[toPos]?.x || 0;
    const toY = cellPositions[toPos]?.y || 0;
    
    playerAnimations[playerIdx].position.setValue({ x: fromX, y: fromY });
    
    return new Promise((resolve) => {
      Animated.sequence([
        // Shake with fear
        Animated.sequence([
          Animated.timing(playerAnimations[playerIdx].rotation, {
            toValue: 0.2,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(playerAnimations[playerIdx].rotation, {
            toValue: -0.2,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(playerAnimations[playerIdx].rotation, {
            toValue: 0.2,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(playerAnimations[playerIdx].rotation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }),
        ]),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(playerAnimations[playerIdx].position, {
          toValue: { x: toX, y: toY },
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
        Animated.timing(playerAnimations[playerIdx].scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(resolve);
    });
  };

  const rollDice = async () => {
    if (gameEnded || isAnimating) return;
    
    setIsAnimating(true);
    
    await new Promise((resolve) => {
      animateDiceRoll();
      setTimeout(resolve, 1000);
    });
    
    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    await movePlayer(value);
    
    setIsAnimating(false);
  };

  const movePlayer = async (steps) => {
    const positions = [...playerPositions];
    let oldPosition = positions[currentPlayer];
    let newPosition = oldPosition + steps;
    
    if (newPosition > 100) {
      setGameMessage(`You need exact number to reach 100. Try again!`);
    } else {
      positions[currentPlayer] = newPosition;
      
      await animatePlayerMovement(currentPlayer, oldPosition, newPosition);
      
      if (Object.prototype.hasOwnProperty.call(snakesAndLadders, newPosition)) {
        const isLadder = snakesAndLadders[newPosition] > newPosition;
        const oldPosBeforeEffect = newPosition;
        
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
        
        if (isLadder) {
          await animateLadderClimb(currentPlayer, oldPosBeforeEffect, snakesAndLadders[newPosition]);
        } else {
          await animateSnakeBite(currentPlayer, oldPosBeforeEffect, snakesAndLadders[newPosition]);
        }
        
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

  const getSnakePath = (start, end) => {
    if (!cellPositions[start] || !cellPositions[end]) return null;
    
    const startX = cellPositions[start].x;
    const startY = cellPositions[start].y;
    const endX = cellPositions[end].x;
    const endY = cellPositions[end].y;
    
    const controlPoint1X = startX + (endX - startX) * 0.25;
    const controlPoint1Y = startY + (endY - startY) * 0.25 + 20;
    
    const controlPoint2X = startX + (endX - startX) * 0.5;
    const controlPoint2Y = startY + (endY - startY) * 0.5 - 20;
    
    const controlPoint3X = startX + (endX - startX) * 0.75;
    const controlPoint3Y = startY + (endY - startY) * 0.75 + 20;
    
    return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${controlPoint3X} ${controlPoint3Y} S ${endX} ${endY}, ${endX} ${endY}`;
  };

  const getSnakeHead = (start) => {
    if (!cellPositions[start]) return null;
    
    return {
      x: cellPositions[start].x,
      y: cellPositions[start].y,
      radius: cellPositions[start].cellSize / 5
    };
  };

  const onBoardLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setBoardSize({ width, height: width });
  };
  
  const renderRatToken = (playerIdx, size) => {
    const color = getPlayerColor(playerIdx);
    const eyeColor = "black";
    const noseColor = "#FF9999";
    const earColor = "#FFCCCC";
    
    return (
      <G>
        <Ellipse 
          cx="0" 
          cy="0" 
          rx={size * 0.8} 
          ry={size * 0.6} 
          fill={color} 
        />
        
        <Circle 
          cx={size * 0.6} 
          cy="0" 
          r={size * 0.5} 
          fill={color} 
        />
        
        <Ellipse 
          cx={size * 0.7} 
          cy={-size * 0.6} 
          rx={size * 0.3} 
          ry={size * 0.4} 
          fill={earColor} 
        />
        <Ellipse 
          cx={size * 1.0} 
          cy={-size * 0.5} 
          rx={size * 0.3} 
          ry={size * 0.4} 
          fill={earColor} 
        />
        
        <Circle 
          cx={size * 0.8} 
          cy={-size * 0.1} 
          r={size * 0.15} 
          fill={eyeColor} 
        />
        <Circle 
          cx={size * 1.1} 
          cy={-size * 0.1} 
          r={size * 0.15} 
          fill={eyeColor} 
        />
        
        <Circle 
          cx={size * 1.2} 
          cy={size * 0.1} 
          r={size * 0.15} 
          fill={noseColor} 
        />
        
        <Path 
          d={`M ${-size * 0.7} 0 C ${-size * 1.2} ${size * 0.3}, ${-size * 1.5} ${-size * 0.3}, ${-size * 1.8} ${size * 0.1}`}
          stroke={color}
          strokeWidth={size * 0.3}
          fill="none"
        />
      </G>
    );
  };

  const diceRotation = diceAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ['0deg', '180deg', '360deg', '540deg', '720deg', '720deg']
  });
  
  const diceScale = diceAnimation.interpolate({
    inputRange: [0, 0.5, 0.7, 0.8, 0.9, 1],
    outputRange: [1, 0.8, 1.2, 1.1, 1.05, 1]
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Snake and Ladder</Text>

        <View style={styles.gameBoard} onLayout={onBoardLayout}>
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
                    </View>
                  );
                })}
              </View>
            ))}

            {Object.keys(cellPositions).length > 0 && (
              <Svg
                style={StyleSheet.absoluteFill}
                width={boardSize.width}
                height={boardSize.height}
              >
                {Object.entries(snakesAndLadders).map(
                  ([start, end]) => {
                    if (end > start && cellPositions[start] && cellPositions[end]) {
                      const startCell = cellPositions[start];
                      const endCell = cellPositions[end];
                      
                      return (
                        <React.Fragment key={`ladder-${start}-${end}`}>
                          <Line
                            x1={startCell.x - startCell.cellSize / 4}
                            y1={startCell.y}
                            x2={endCell.x - endCell.cellSize / 4}
                            y2={endCell.y}
                            stroke="#8B4513"
                            strokeWidth="3"
                          />
                          
                          <Line
                            x1={startCell.x + startCell.cellSize / 4}
                            y1={startCell.y}
                            x2={endCell.x + endCell.cellSize / 4}
                            y2={endCell.y}
                            stroke="#8B4513"
                            strokeWidth="3"
                          />
                          
                          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
                            const rungY = startCell.y + (endCell.y - startCell.y) * ratio;
                            const rungX1 = startCell.x - startCell.cellSize / 4 + 
                                          (endCell.x - startCell.x - startCell.cellSize / 4) * ratio;
                            const rungX2 = startCell.x + startCell.cellSize / 4 + 
                                          (endCell.x - startCell.x + startCell.cellSize / 4) * ratio;
                            
                            return (
                              <Line
                                key={`rung-${start}-${end}-${i}`}
                                x1={rungX1}
                                y1={rungY}
                                x2={rungX2}
                                y2={rungY}
                                stroke="#8B4513"
                                strokeWidth="2"
                              />
                            );
                          })}
                        </React.Fragment>
                      );
                    }
                    return null;
                  }
                )}
                
                {Object.entries(snakesAndLadders).map(
                  ([start, end]) => {
                    if (end < start) {
                      const snakePath = getSnakePath(start, end);
                      const snakeHead = getSnakeHead(start);
                      
                      if (snakePath && snakeHead) {
                        return (
                          <React.Fragment key={`snake-${start}-${end}`}>
                            <Path
                              d={snakePath}
                              fill="none"
                              stroke="#558B2F"
                              strokeWidth="5"
                              strokeLinecap="round"
                            />
                            
                            <Circle
                              cx={snakeHead.x}
                              cy={snakeHead.y}
                              r={snakeHead.radius}
                              fill="#D32F2F"
                            />
                            
                            <Circle
                              cx={snakeHead.x - snakeHead.radius / 2}
                              cy={snakeHead.y - snakeHead.radius / 2}
                              r={snakeHead.radius / 4}
                              fill="black"
                            />
                            <Circle
                              cx={snakeHead.x + snakeHead.radius / 2}
                              cy={snakeHead.y - snakeHead.radius / 2}
                              r={snakeHead.radius / 4}
                              fill="black"
                            />
                          </React.Fragment>
                        );
                      }
                    }
                    return null;
                  }
                )}
                
                {playerPositions.map((position, idx) => {
                  if (position === 0) return null;
                  
                  const cell = cellPositions[position];
                  if (!cell) return null;
                  
                  const cellSize = cell.cellSize || 20;
                  const tokenSize = cellSize / 3;
                  
                  const offsetX = ((idx % 2) * 2 - 1) * (cellSize / 5);
                  const offsetY = (Math.floor(idx / 2) * 2 - 1) * (cellSize / 5);
                  
                  const rotateInterpolate = playerAnimations[idx].rotation.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-30deg', '0deg', '30deg']
                  });
                  
                  return (
                    <Animated.View 
                      key={`player-${idx}`}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: tokenSize * 4,
                        height: tokenSize * 4,
                        marginLeft: -tokenSize * 2,
                        marginTop: -tokenSize * 2,
                        transform: [
                          { translateX: playerAnimations[idx].position.x },
                          { translateY: playerAnimations[idx].position.y },
                          { translateX: offsetX },
                          { translateY: offsetY },
                          { scale: playerAnimations[idx].scale },
                          { rotate: rotateInterpolate }
                        ]
                      }}
                    >
                      <Svg width="100%" height="100%" viewBox={`${-tokenSize * 2} ${-tokenSize * 2} ${tokenSize * 4} ${tokenSize * 4}`}>
                        {renderRatToken(idx, tokenSize)}
                      </Svg>
                    </Animated.View>
                  );
                })}
              </Svg>
            )}
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
                  Rat {idx + 1}: Position {position}
                  {winners.includes(idx) ? " 🏆" : ""}
                </Text>
              </View>
            ))}
          </View>

          <Animated.View 
            style={[
              styles.diceContainer,
              {
                transform: [
                  { rotate: diceRotation },
                  { scale: diceScale }
                ]
              }
            ]}
          >
            <Text style={styles.diceValue}>{diceValue || "-"}</Text>
          </Animated.View>

          {!gameEnded ? (
            <TouchableOpacity
              style={[
                styles.rollButton,
                (winners.includes(currentPlayer) || isAnimating) && styles.disabledButton,
              ]}
              onPress={rollDice}
              disabled={winners.includes(currentPlayer) || isAnimating}
            >
              <Text style={styles.rollButtonText}>
                {isAnimating ? "Rolling..." : `Rat ${currentPlayer + 1} Roll Dice`}
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
                  {i + 1}. Rat {playerIndex + 1}
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
                    {winners.length + 1}. Rat {playerIndex + 1} (Lost)
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


export default GameBoard;
	
