import { imagesAtom } from "@/atoms";
import ProductPhotoInfo from "@/components/ProductPhotoInfo";
import { ImageSearch, getImageSearchResponse } from "@/server";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PhotoAnalyzer() {
  const images = useAtomValue(imagesAtom);
  const [loading, setLoading] = useState(true);
  const [serverData, setServerData] = useState<ImageSearch[]>();

  useEffect(() => {
    if (images.length == 0) return;
    (async () => {
      setLoading(true);
      try {
        const response = await getImageSearchResponse(images);
        setServerData(response.products);
      } catch (e) {
        console.error(`Error occurred when fetching data from server!`);
        console.error(e);
      }

      setLoading(false);
    })();
  }, [images]);

  if (loading) {
    return <BigLoadingState />;
  } else {
    return <Photos images={serverData!} />;
  }
}

function BigLoadingState() {
  return (
    <View style={styles.bigLoad}>
      <Text>Analayzing the taken photos!</Text>

      <Text style={{ color: "gray" }}>This may take a while</Text>

      <ActivityIndicator size="large" />
    </View>
  );
}

function Photos({ images }: { images: ImageSearch[] }) {
  const [manualSearch, setManualSearch] = useState("");
  function onSearch(query: string) {
    router.navigate({
      pathname: "/products/[query]",
      params: { query },
    });
  }

  return (
    <View style={styles.photosContainer}>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          textAlign: "center",
          padding: 5,
          fontWeight: "700",
        }}
      >
        Select your product
      </Text>

      <View style={styles.cantFindContainer}>
        <TextInput
          style={{
            flexGrow: 2,
            height: "100%",
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderWidth: 1,
            borderColor: "#334155",
            borderRadius: 5,
            color: "#94a3b8",
          }}
          value={manualSearch}
          onChangeText={setManualSearch}
          onSubmitEditing={() => onSearch(manualSearch)}
          keyboardType="ascii-capable"
          placeholder="Cant find it? Put search query!"
          placeholderTextColor="#64748b"
        />
      </View>

      <FlatList
        style={styles.photos}
        data={images}
        numColumns={2}
        contentContainerStyle={{
          display: "flex",
          alignItems: "flex-start"
        }}
        renderItem={(d) => (
          <ProductPhotoInfo
            url={d.item.url}
            text={d.item.text}
            onClick={onSearch}
          />
        )}
        keyExtractor={(_, i) => `${i}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bigLoad: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  photos: {
    display: "flex",
    gap: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photosContainer: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 5,
  },
  cantFindContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    height: 40,
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 5,
    justifyContent: "space-between",
  },
});
