import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import emptyBox from "../../assets/image/emptybox.png";
import { colors, network } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import CustomInput from "../../components/CustomInput";
import { useCart } from "../../context/CartContext";
import { gql } from "@apollo/client";
import { client } from "../../client/ApolloClient";
import SearchableDropdown from "react-native-searchable-dropdown";

const category = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Wheat",
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Bajra",
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Rice",
  },
];

const Products = ({ navigation, route }) => {
  const { cartProducts, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const { filterItemTitle } = route.params;
  console.log(filterItemTitle);
  const [filterItem, setFilterItem] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);

  useEffect(() => {
    if (filterItemTitle) {
      setFilterItem(filterItemTitle);
      setShowFilterBar(true);
    }
  }, [filterItemTitle]);

  //get the dimenssions of active window
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  //method to navigate to product detail screen of specific product
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product, products });
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  const fetchProduct = () => {
    const GET_PRODUCTS = gql`
      query {
        getProducts(options: {}) {
          _id
          name
          ingredients {
            grain_id
            proportion
          }
          price
          description
          imgUrl
        }
      }
    `;
    client
      .query({ query: GET_PRODUCTS })
      .then((response) => {
        setProducts(response.data.getProducts);
        setDisplayProducts(response.data.getProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //method to filter the product according to user search in selected category
  const filter = () => {
    if (filterItem !== "") {
      const results = products.filter((product) => {
        return product?.name.toLowerCase().includes(filterItem.toLowerCase());
      });
      console.log(results);
      setDisplayProducts(results);
      setShowFilterBar(true);
    } else {
      setDisplayProducts(products);
      setShowFilterBar(false);
    }
  };

  //fetch the product on initial render
  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    filter();
  }, [filterItem]);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.jumpTo("home");
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>

        <View></View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("Cart")}
        >
          {cartProducts?.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>
                {cartProducts.length}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View
          style={{
            padding: 0,
            paddingLeft: 20,
            paddingRight: 20,
            marginVertical: 20,
            zIndex: 1,
          }}
        >
          <View style={styles.inputContainer}>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => handleProductPress(item)}
              defaultIndex={0}
              containerStyle={{
                borderRadius: 5,
                width: "100%",
                elevation: 5,
                position: "absolute",
                zIndex: 10,
                top: -20,
                maxHeight: 300,
                backgroundColor: colors.light,
              }}
              textInputStyle={{
                borderRadius: 10,
                padding: 6,
                paddingLeft: 10,
                borderWidth: 0,
                backgroundColor: colors.white,
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: colors.white,
                borderColor: colors.muted,
              }}
              itemTextStyle={{
                color: colors.muted,
              }}
              itemsContainerStyle={{
                maxHeight: "100%",
              }}
              items={products}
              placeholder="Search..."
              resetValue={false}
              underlineColorAndroid="transparent"
            />
            {/* <CustomInput radius={5} placeholder={"Search...."} /> */}
          </View>
        </View>

        {/*  */}
        <View style={styles.categoryContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={styles.flatListContainer}
            horizontal={true}
            data={category}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: 20 }} key={index}>
                <CustomIconButton
                  key={index}
                  text={item.title}
                  onPress={() =>
                    navigation.navigate("categories", {
                      filterItemTitle: item.title || "",
                      showFilter: true,
                    })
                  }
                />
              </View>
            )}
          />
          <View style={styles.emptyView}></View>
        </View>
        {/*  */}
        {showFilterBar && filterItem && (
          <View style={styles.filterBarContainer}>
            <Text style={styles.filterText}>
              Filter applied: {filterItemTitle}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowFilterBar(false);
                setFilterItem("");
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.primary}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* <View style={styles.noItemContainer}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.white,
              height: 150,
              width: 150,
              borderRadius: 10,
            }}
          >
            <Image
              source={emptyBox}
              style={{ height: 80, width: 80, resizeMode: "contain" }}
            />
            <Text style={styles.emptyBoxText}>
              There no product in this category
            </Text>
          </View>
        </View> */}

        <FlatList
          data={displayProducts}
          refreshControl={
            <RefreshControl
              refreshing={refeshing}
              onRefresh={handleOnRefresh}
            />
          }
          keyExtractor={(index, item) => `${index}-${item}`}
          contentContainerStyle={{ margin: 10 }}
          numColumns={2}
          renderItem={({ item: product }) => (
            <View
              style={[
                styles.productCartContainer,
                { width: (windowWidth - windowWidth * 0.1) / 2 },
              ]}
            >
              <ProductCard
                cardSize={"large"}
                name={product.name}
                image={product.imgUrl}
                price={product.price}
                quantity={1}
                disabledCartIcon={
                  cartProducts.find((p: any) => p._id == product._id)
                    ? true
                    : false
                }
                limit={12}
                onPress={() => handleProductPress(product)}
                onPressSecondary={() => addToCart(product, 1)}
              />
              <View style={styles.emptyView}></View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  filterBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: {
    color: colors.primary,
    marginRight: 10,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 60,
  },
  closeIcon: {
    marginLeft: 10,
  },
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
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
  bodyContainer: {
    flex: 1,
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    justifyContent: "flex-start",
  },
  flatListContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  productCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  noItemContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emptyBoxText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  emptyView: {
    height: 20,
  },
});
