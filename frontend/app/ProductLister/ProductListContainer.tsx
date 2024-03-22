// ProductListContainer.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ProductBox, { ProductData } from "./ProductBox";
import SortByPriceButton from "./SortByPriceButton";
import SortByRatingButton from "./SortByRatingButton";

interface ProductListContainerProps {
  products?: ProductData[];
}

const ProductListContainer: React.FC<ProductListContainerProps> = ({
  products = [],
}) => {
  const [sortBy, setSortBy] = useState("");

  // Sort by options
  const sortByOptions = ["Price", "Rating"];

  const sortByPrice = () => {
    // Sort products by price
    // Update products state
    setSortBy("Price");
  };

  const sortByRating = () => {
    // Sort products by rating
    // Update products state
    setSortBy("Rating");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.productName}>Product Name</Text>
        <View style={styles.sortFilterContainer}>
          <SortByPriceButton onPress={sortByPrice} />
          <SortByRatingButton onPress={sortByRating} />
        </View>
      </View>
      {/* Product List */}
      <ScrollView style={styles.productListContainer}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductBox key={index} {...product} />
          ))
        ) : (
          <ProductBox
            price={0}
            shipping={false}
            seller="Default Seller"
            description="Default Description"
            rating={0}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sortFilterContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  sortBy: {
    marginRight: 5,
  },
  productListContainer: {
    maxHeight: 400,
  },
});

export default ProductListContainer;
