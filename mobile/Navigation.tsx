import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import App from "./App";
import SignInStack from "./src/stack/SignInStack";
import SignOutStack from "./src/stack/SignOutStack";
import { useAuth } from "./src/context/AuthContext";

export default function Navigation() {
  const { isAuthenticated, authLoading } = useAuth();
  let condition = isAuthenticated ? <SignInStack /> : <SignOutStack />;
  return (
    <NavigationContainer>{!authLoading ? condition : null}</NavigationContainer>
  );
}
