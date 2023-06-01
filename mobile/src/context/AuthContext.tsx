import { gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";
import { client } from "../client/ApolloClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const ME_QUERY = gql`
  query {
    me {
      name
      email
      emailVerified
      phone
      role
      user_dbid
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // AsyncStorage.removeItem("token");

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(token ? true : false);
      // Any code that needs to execute after getting the token value can go here
    }
    const getMeQuery = async () => {
      try {
        const { error, data, loading } = await client.query({
          query: ME_QUERY,
        });
        setUser(data.me);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        console.log(JSON.stringify(err));
      }
    };

    async function completeAuthCheck() {
      await checkToken();
      await getMeQuery();
      setAuthLoading(false);
    }
    completeAuthCheck();
  }, []);

  const value = {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    authLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
