import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function ButtonGroup({ quantity, setQuantity }) {
  return (
    <View style={styles.btnGroup}>
      <TouchableOpacity
        style={[
          styles.btn,
          quantity === 1 ? { backgroundColor: "#6B7280" } : null,
        ]}
        onPress={() => setQuantity(1)}
      >
        <Text
          style={[styles.btnText, quantity === 1 ? { color: "white" } : null]}
        >
          1 KG
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btn,
          quantity === 3 ? { backgroundColor: "#6B7280" } : null,
        ]}
        onPress={() => setQuantity(3)}
      >
        <Text
          style={[styles.btnText, quantity === 3 ? { color: "white" } : null]}
        >
          3 KG
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btn,
          quantity === 5 ? { backgroundColor: "#6B7280" } : null,
        ]}
        onPress={() => setQuantity(5)}
      >
        <Text
          style={[styles.btnText, quantity === 5 ? { color: "white" } : null]}
        >
          5 KG
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btn,
          quantity === 10 ? { backgroundColor: "#6B7280" } : null,
        ]}
        onPress={() => setQuantity(10)}
      >
        <Text
          style={[styles.btnText, quantity === 10 ? { color: "white" } : null]}
        >
          10 KG
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnGroup: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
    backgroundColor: "#F2F2F2",
  },
  btn: {
    flex: 1,
    borderRightWidth: 0.25,
    borderLeftWidth: 0.25,
    borderColor: "#6B7280",
  },
  btnText: {
    textAlign: "center",
    paddingVertical: 16,
    fontSize: 14,
  },
});
