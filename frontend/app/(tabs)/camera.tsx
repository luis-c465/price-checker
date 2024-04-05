import { imagesAtom } from "@/atoms";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { ImagePicker } from "expo-image-multiple-picker";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const nav = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [images, setImages] = useState<string[]>([]);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const [showPicker, setShowPicker] = useState(false);
  const setImagesAtom = useSetAtom(imagesAtom)

  useEffect(() => {
    const unsubscribeFocus = nav.addListener("focus", () => {
      setShowCamera(true);
    });
    const unsubscribeBlur = nav.addListener("blur", () => {
      setShowCamera(false);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [nav]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(
        cameraStatus === "granted" && mediaStatus === "granted",
      );
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImages((prevImages) => [...prevImages, data.uri]);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const toggleFlash = () => {
    setFlash((flash) =>
      flash === FlashMode.off ? FlashMode.on : FlashMode.off,
    );
  };

  function handlePress() {
    setShowPicker((current) => !current);
  }

  const handleDone = async () => {
    console.log("Done with images:", images);
    setImagesAtom([...images])
    router.push("/photos")
  };

  const renderImageThumbnails = () =>
    images.map((uri, index) => (
      <View key={index} style={styles.thumbnailContainer}>
        <Image source={{ uri }} style={styles.thumbnail} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeImage(index)}
        >
          <Text style={styles.removeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    ));

  return (
    <View style={styles.container}>
      {!showPicker && showCamera && (
        <>
          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ref={cameraRef}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.rightButtons}
                onPress={toggleCameraType}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rightButtons}
                onPress={toggleFlash}
              >
                <Ionicons
                  name={
                    flash === FlashMode.off
                      ? "flash-off-outline"
                      : "flash-outline"
                  }
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handlePress}
            >
              <Ionicons name="images-outline" size={24} color="white" />
            </TouchableOpacity>
          </Camera>

          <ScrollView horizontal style={styles.imagesContainer}>
            {renderImageThumbnails()}
          </ScrollView>

          {images.length > 0 && (
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>DONE</Text>
            </TouchableOpacity>
          )}

          <View style={styles.cameraContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Ionicons name="camera-outline" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {showPicker && (
        <ImagePicker
          theme={{
            header(props) {
              return (
                <View
                  style={{
                    padding: 10,
                    height: 60,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowPicker(false)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="arrow-back" size={30} color="white" />
                    <Text>Back</Text>
                  </TouchableOpacity>

                  <Text style={{ color: "white", fontSize: 20 }}>
                    {props.imagesPicked}  selected
                  </Text>

                  <TouchableOpacity onPress={() => {
                    if (props.imagesPicked > 0 && props.save) props.save()
                  }}>
                    <Text style={{
                      color: props.imagesPicked > 0 ? "white" : "gray",
                      fontSize: 16
                    }}>Done</Text>
                  </TouchableOpacity>
                </View>
              );
            },
          }}
          onSave={(assets) => {
            const uris = assets.map((asset) => asset.uri);
            setImages((prevImages) => [...prevImages, ...uris]);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
          galleryColumns={4}
          multiple
          noAlbums
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
  },
  rightButtons: {
    marginLeft: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  galleryButton: {
    position: "absolute",
    left: 20,
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
  imagesContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    padding: 10,
  },
  thumbnailContainer: {
    position: "relative",
    marginRight: 5,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
  doneButton: {
    position: "absolute",
    bottom: 35,
    left: 255,
    right: 30,
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    zIndex: 1, // Ensure it's above other components
  },
  doneButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  cameraContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 15,
  },
});
