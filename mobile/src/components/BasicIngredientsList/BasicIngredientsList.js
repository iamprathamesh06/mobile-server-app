import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const BasicIngredientsList = ({
  title,
  image,
  type,
  nutrition,
  description,
  proportion,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.IconContainer}>
          {/* <Ionicons name="image" size={30} color={colors.muted} /> */}
          {/* {console.log(image)} */}
          <Image source={{ uri: image }} style={{ height: 30, width: 30 }} />
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.secondaryText}>{title}</Text>
          <Text>{description}</Text>
          <Text>Type: {type}</Text>
          <Text>Health Benefits: {nutrition}</Text>
          <Text style={styles.primaryText}>Proportion: {proportion}</Text>
        </View>
      </View>
    </View>
  );
};

export default BasicIngredientsList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.white,
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    padding: 5,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfoContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  IconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
