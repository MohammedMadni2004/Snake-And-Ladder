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
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  boardGrid: {
    borderWidth: 2,
    borderColor: "#333",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  boardRow: {
    flexDirection: "row",
    height: "10%",
  },
  boardCell: {
    width: "10%",
    height: "100%",
    borderWidth: 0.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "relative",
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
  gameOverText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#D32F2F",
    marginVertical: 15,
  },
  winnersContainer: {
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  winnersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  winnersList: {
    marginTop: 5,
  },
  winnerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  winnerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  loserIndicator: {
    borderWidth: 1,
    borderColor: "#D32F2F",
  },
  loserText: {
    fontSize: 16,
    color: "#D32F2F",
  },
});
