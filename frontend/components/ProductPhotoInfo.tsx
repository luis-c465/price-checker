import { ImageSearch } from "@/server";
import { Portal } from "@gorhom/portal";
import { ImageBackground } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PreviewModal } from "react-native-image-preview-reanimated";

type ProductPhotoInfoProps = ImageSearch & {
  onClick: () => void
}

export default function ProductPhotoInfo({ text, url, onClick }: ProductPhotoInfoProps) {
  return (
    <View style={styles.container}>
      <ClickableImage url={url} />

      <TouchableOpacity style={styles.productButton}>
        <Text style={styles.text} numberOfLines={3}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ClickableImage({ url }: { url: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.image}
          source={url}
          cachePolicy={"memory"}
        >
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => setShowModal(true)}
          />
        </ImageBackground>
      </View>

      <Portal>
        <PreviewModal
          onCloseModal={() => setShowModal(false)}
          isModalOpen={showModal}
          images={[url]}
          modalAnimationIn="fadeIn"
          modalAnimationOut="fadeOut"
          imageAnimationIn="fadeIn"
          imageAnimationOut="fadeOut"
          isSwipeToDismissEnabled={false}
          showPaginationComponent={false}
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    minHeight: 200,
    minWidth: 150,
    width: "48%"
  },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    height: "75%",
    width: "100%",
    resizeMode: "center",
  },
  imageButton: {
    width: "100%",
    height: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  productButton: {
    width: "auto",
    padding: 10,
    margin: 0,
    backgroundColor: "gray",
    alignItems: "center",
    paddingTop: 20,
  }
});
