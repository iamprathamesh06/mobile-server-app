import React from "react";
import Navigation from "./Navigation";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./src/context/AuthContext";
import { client } from "./src/client/ApolloClient";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Navigation />
      </ApolloProvider>
    </AuthProvider>
  );
}
