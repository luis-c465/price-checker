import ProductListContainer, {
  ProductListContainerProps,
} from "@/components/ProudctSearch";
import { getProductSearchResponse } from "@/server";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const ProductSearchPage: React.FC = () => {
  const [productData, setProductsData] = useState<ProductListContainerProps>();
  const { query } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query == null) return;

    setLoading(true);
    (async () => {
      try
      {
        const data = await getProductSearchResponse(query as string);
        setProductsData(data);
        setLoading(false);
      } catch (e)
      {
        console.error(e)
        setLoading(false)
      }
    })();
  }, [query]);

  if (loading) {
    return <BigLoadingState />
  } else {
    return (
      <ProductListContainer
        name={productData?.name!}
        products={productData?.products!}
      />
    );
  }
};

function BigLoadingState() {
  return (
    <View style={styles.loading}>
      <Text>Searching online for the produts</Text>

      <Text style={{ color: "gray" }}>This may take a while</Text>

      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
})

export default ProductSearchPage;
