import { StyleSheet, Image, Text, View, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import SuccessImage from "../../assets/image/success.png";
import CustomButton from "../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { getFormattedDate } from "../../utils/getFormattedDate";

const OrderConfirm = ({ navigation, route }) => {
  const { user } = useAuth();
  let orderStatus = route.params;

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.imageConatiner}>
        <Image source={SuccessImage} style={styles.Image} />
      </View>
      <Text style={styles.secondaryText}>Your Order has been confirmed</Text>
      <View style={styles.orderDetails}>
        <Text>Order ID: {orderStatus._id}</Text>
        <Text>Customer Name: {user.name}</Text>
        <Text>Amount: {orderStatus.amount}</Text>
        <Text>Date: {getFormattedDate(orderStatus.createdAt)}</Text>
        <Text>Payment Status: {orderStatus.payment_status}</Text>
      </View>
      <View>
        <CustomButton
          text={"Back to Home"}
          onPress={() => navigation.replace("Tabs")}
        />
      </View>
    </View>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 40,
    flex: 1,
  },
  imageConatiner: {
    width: "100%",
  },
  Image: {
    width: 400,
    height: 300,
  },
  secondaryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderDetails: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});
