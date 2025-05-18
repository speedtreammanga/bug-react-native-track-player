import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Button({ onPress, label, color }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.btnPressed]}
    >
      <View
        title="Play music"
        color="white"
        style={[
          styles.btn,
          color == "light" ? styles.btnLight : styles.btnDark,
        ]}
      >
        <Text
          style={[
            styles.label,
            color == "light" ? styles.labelLight : styles.labelDark,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnDark: {
    backgroundColor: "black",
  },
  btnLight: {
    backgroundColor: "white",
  },
  btn: {
    padding: 12,
    display: "flex",
    borderRadius: 10,
  },
  btnPressed: {
    opacity: 0.8,
  },
  labelDark: {
    color: "white",
  },
  labelLight: {
    color: "black",
  },
  label: {
    fontSize: 20,
    textAlign: "center",
  },
});
