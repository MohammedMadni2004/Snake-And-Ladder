import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayerSelection from "./screens/PlayerSelection";
import GameBoard from "./screens/GameBoard";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlayerSelection">
        <Stack.Screen
          name="PlayerSelection"
          component={PlayerSelection}
          options={{ title: "Select Players" }}
        />
        <Stack.Screen
          name="GameBoard"
          component={GameBoard}
          options={{ title: "Snake & Ladder" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
