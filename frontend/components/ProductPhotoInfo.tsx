import { ImageSearch } from "@/server";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Portal } from "@gorhom/portal";
import { ImageBackground } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { PreviewModal } from "react-native-image-preview-reanimated";

type ProductPhotoInfoProps = ImageSearch & {
  onClick: () => void;
};

export default function ProductPhotoInfo({
  text,
  url,
  onClick,
}: ProductPhotoInfoProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={onClick}
      >
        <ImageBackground style={styles.image} source={url} cachePolicy="memory">
          <Text style={styles.text} numberOfLines={3}>
            {text}
          </Text>

          <TouchableOpacity
            style={styles.imageMaximizeBtn}
            onPress={() => setShowModal(true)}
          >
            <FontAwesome size={20} name="expand" color="#cbd5e1" />
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>

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
    position: "relative",
    borderColor: "gray",
    borderWidth: 1,
    minHeight: 200,
    margin: 5,
    width: "48%",
  },

  imageMaximizeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    color: "white",
    backgroundColor: "rgba(71, 85, 105, 0.8)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "rgba(71, 85, 105, 0.8)",
    paddingTop: 3
  },
});
