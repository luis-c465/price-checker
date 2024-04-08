import { styles as productStyles } from "@/app/ProductLister/ProductBox";
import { ImageSearch } from "@/server";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Portal } from "@gorhom/portal";
import { Image, ImageBackground } from "expo-image";
import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ProductPhotoInfoProps = ImageSearch & {
  onClick: (text: string) => void;
};

const { width } = Dimensions.get("screen");

export default function ProductPhotoInfo({
  text,
  url,
  onClick,
}: ProductPhotoInfoProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [query, setQuery] = useState(text)

  function doneWithQuery(query: string) {
    console.log(query);
    setShowQueryModal(false);
    setShowImageModal(false);
    Keyboard.dismiss();
    onClick(query);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowQueryModal(true)}
      >
        <ImageBackground style={styles.image} source={url} cachePolicy="memory">
          <Text style={styles.text} numberOfLines={3}>
            {text}
          </Text>

          <TouchableOpacity
            style={styles.imageMaximizeBtn}
            onPress={() => setShowImageModal(true)}
          >
            <FontAwesome size={20} name="expand" color="#cbd5e1" />
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>

      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showQueryModal}
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={productStyles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Product looks similar?</Text>

              <Text style={productStyles.modalDescription}>
                Edit the query like you were looking this up on a web browser!
              </Text>

              <View style={styles.textFlex}>
                <TextInput
                  style={styles.queryInput}
                  keyboardType="ascii-capable"
                  defaultValue={text}
                  onChangeText={setQuery}
                  placeholder=""
                  numberOfLines={5}
                  multiline
                />

                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={() => doneWithQuery(query)}
                >
                  <Text style={{ color: "white", fontSize: 13, fontWeight: "800"}}>Search</Text>
                </TouchableOpacity>
              </View>

              <Image
                contentFit="contain"
                source={url}
                cachePolicy="memory"
                style={styles.modalImage}
              />

              <TouchableOpacity
                style={productStyles.closeButton}
                onPress={() => setShowQueryModal(false)}
              >
                <Text style={productStyles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showImageModal}
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={productStyles.modalBackground}>
            <View style={styles.modalContent}>
              <Image
                contentFit="contain"
                source={url}
                cachePolicy="memory"
                style={styles.modalImage}
              />

              <Text style={productStyles.modalDescription}>{text}</Text>

              <TouchableOpacity
                style={productStyles.closeButton}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={{
                  color: "white",
                }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderColor: "gray",
    borderWidth: 1,
    minHeight: 200,
    margin: 5,
    width: width / 2 - 20,
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
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 10,
    maxWidth: "100%",
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "rgba(71, 85, 105, 0.8)",
    paddingTop: 3,
  },
  modalImage: {
    width: "80%",
    height: "60%",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "#ffffff", // Light background color for modal content
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  queryInput: {
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    height: 100,
    width: width * 6/10
  },
  modalHeader: {
    fontWeight: "800",
    fontSize: 20,
  },
  textFlex: {
    display: "flex",
    gap: 5,
    flexDirection: "row",
    alignItems: "stretch",
  }, searchBtn: {
    backgroundColor: "#2196f3", // Adjusted blue color for close button
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  }
});
