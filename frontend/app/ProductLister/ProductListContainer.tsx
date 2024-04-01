import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ProductBox, { ProductData } from "./ProductBox";
import { defaultProductsData } from "./DefaultProduct";
import FilterModal from ".//FilterModal";
import SortModal from ".//SortModal";
import styles from ".//styles";

interface ProductListContainerProps {
  products?: ProductData[];
}

const ProductListContainer: React.FC<ProductListContainerProps> = ({}) => {
  const [products, setProducts] = useState<ProductData[]>(defaultProductsData);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const sortProducts = (products: ProductData[], sortBy: string | null) => {
    if (sortBy === "Price") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Rating") {
      return [...products].sort((a, b) => b.rating - a.rating);
    } else {
      return products;
    }
  };

  useEffect(() => {
    const sortedProducts = sortProducts(products, sortBy);
    // Check if the products have already been sorted
    if (JSON.stringify(sortedProducts) === JSON.stringify(products)) {
      return;
    }
    setProducts(sortedProducts);
  }, [sortBy]);

  const [showSortModal, setShowSortModal] = useState(false);

  const handleSortBy = (option: string | null) => {
    setSortBy(option);
    setShowSortModal(false);
  };

  const handleSort = () => {
    setShowSortModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const applyFilters = (filters: any) => {
    let filteredProducts = [...defaultProductsData];

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice
      );
    }
    if (filters.minRating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.minRating
      );
    }
    if (filters.maxRating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating <= filters.maxRating
      );
    }
    if (filters.condition !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.condition === filters.condition
      );
    }

    setProducts(filteredProducts);
    setShowFilterModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.productName}>Product Name</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleFilter}>
          <FontAwesome5 name="filter" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleSort}>
          <FontAwesome5 name="sort" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {products.map((product, index) => (
          <ProductBox key={index} {...product} />
        ))}
      </ScrollView>
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        applyFilters={applyFilters}
      />
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        applySort={handleSortBy}
      />
    </View>
  );
};

export default ProductListContainer;
