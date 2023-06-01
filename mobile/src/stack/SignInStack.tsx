import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/user/Home";
import Tabs from "../drawers/Tabs";
import { CartProvider } from "../context/CartContext";
import Cart from "../screens/user/Cart";
import ProductDetails from "../screens/user/ProductDetails";
import Checkout from "../screens/user/Checkout";
import OrderConfirm from "../screens/user/OrderConfirm";
import MyOrderDetails from "../screens/user/MyOrderDetails";
import Account from "../screens/user/Account";
import { updatePassword } from "firebase/auth";
import UpdatePassword from "../screens/user/UpdatePassword";

// import Home from "../screens/user/Home";

export default function SignInStack() {
  const Stack = createNativeStackNavigator();
  return (
    <CartProvider>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{
            animation: "simple_push",
          }}
        />

        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="MyOrderDetails"
          component={MyOrderDetails}
          options={{ animation: "simple_push" }}
        />

        <Stack.Screen
          name="OrderConfirm"
          component={OrderConfirm}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ animation: "flip" }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={{ animation: "flip" }}
        />
      </Stack.Navigator>
    </CartProvider>
  );
}
