import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { network } from "../constants";

const httpLink = createHttpLink({
  uri: `${network.serverip}/graphql`,
});

const authLink = new ApolloLink(async (operation, forward) => {
  const token = await AsyncStorage.getItem("token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? token : "",
      xclienttype: "mobile",
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});
