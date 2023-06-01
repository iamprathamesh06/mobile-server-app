import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import OrderList from "../../components/OrderList/OrderList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { gql } from "@apollo/client";
import { client } from "../../client/ApolloClient";

const MyOrderScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Please wait...");
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [UserInfo, setUserInfo] = useState({});

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setRefreshing(false);
  };

  //method to navigate to order detail screen of a specific order
  const handleOrderDetail = (item) => {
    navigation.navigate("MyOrderDetails", {
      order_id: item._id,
    });
  };

  //fetch order from server using API call
  const fetchOrders = () => {
    const GET_USER_ORDERS = gql`
      query GetUserOrders($userId: String!) {
        getUserOrders(user_id: $userId) {
          _id
          amount
          createdAt
          order_status
          contact_info
          product_details {
            product_id
          }
        }
      }
    `;
    client
      .query({
        query: GET_USER_ORDERS,
        variables: { userId: user.user_dbid },
        fetchPolicy: "no-cache",
      })
      .then((response) => {
        const sortedOrders = response.data.getUserOrders
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .reverse();

        setOrders(sortedOrders);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  };

  //convert authUser to Json object and fetch orders on initial render
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={label} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
        <View></View>
        <TouchableOpacity onPress={() => handleOnRefresh()}>
          <Ionicons name="cart-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>My Orders</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Your order and your order status
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      {orders.length == 0 ? (
        <View style={styles.ListContiainerEmpty}>
          <Text style={styles.secondaryTextSmItalic}>
            "There are no orders placed yet."
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, width: "100%", padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refeshing}
              onRefresh={handleOnRefresh}
            />
          }
        >
          {orders.map((order, index) => {
            return (
              <OrderList
                item={order}
                key={index}
                onPress={() => handleOrderDetail(order)}
              />
            );
          })}
          <View style={styles.emptyView}></View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  emptyView: {
    height: 20,
  },
  ListContiainerEmpty: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  secondaryTextSmItalic: {
    fontStyle: "italic",
    fontSize: 15,
    color: colors.muted,
  },
});
