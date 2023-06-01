import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import axios from "axios";
import { network } from "../constants";
import RazorpayCheckout from "react-native-razorpay";

export default function Payment() {
  const handlePayment = () => {
    console.log("Payment Initiated");
    const body = {
      amount: 1000,
    };
    axios
      .post(`${network.serverip}/payment/createOrder`, body)
      .then((res) => {
        let data = res.data;
        let { id, amount } = data.order;
        console.log(id, amount);
        var options = {
          description: "Credits towards consultation",
          image: "https://i.imgur.com/3g7nmJC.jpg",
          currency: "INR",
          key: "rzp_test_J7hHZ8aH48BTB3",
          amount: amount,
          name: "Acme Corp",
          order_id: id, //Replace this with an order_id created using Orders API.
          prefill: {
            email: "gaurav.kumar@example.com",
            contact: "9191919191",
            name: "Gaurav Kumar",
          },
          theme: { color: "#53a20e" },
        };
        RazorpayCheckout.open(options)
          .then((data) => {
            // handle success
            console.log(`Success: ${data.razorpay_payment_id}`);
          })
          .catch((error) => {
            // handle failure
            console.log(`Error: ${error.code} | ${error.message}`);
          });
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => handlePayment()}>
        <Text>Payment</Text>
      </TouchableOpacity>
    </View>
  );
}
