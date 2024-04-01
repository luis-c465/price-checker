import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const nav = useNavigation()

  nav.addListener("focus", () => {
    setShowCamera(true)
  })

  nav.addListener("blur", () => {
    setShowCamera(false)
  })


  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off); // Initialize FlashMode state //not working
  const cameraRef = useRef<Camera>(null); // Add a ref to the camera for taking pictures

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //METHODS
  //Method to flip camera
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  // Method to toggle flash
  const toggleFlash = () => {
    setFlash(flash === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  return (
    <View style={styles.container}>
      {!image ? (
        showCamera && <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Text style={styles.text}>↻</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flashButton}
              onPress={() => toggleFlash()}
            >
              <Ionicons
                name="flash"
                color={flash === FlashMode.off ? "gray" : "white"}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View>
        {image ? (
          <View>
            <TouchableOpacity
              style={styles.pictureTakenContainer}
              onPress={() => setImage(null)}
            >
              <Text style={styles.text}>retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            {/* Add a new TouchableOpacity for taking photos */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Text style={styles.text}></Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    position: "absolute", // Position the container absolutely
    right: 0, // Align to the right
    top: 0, // Align to the top
    padding: 20, // Add some padding to not stick to the edge
    flexDirection: "column",
  },
  flipButton: {
    alignSelf: "center",
    marginBottom: 15,
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  flashButton: {
    alignSelf: "center",
    marginBottom: 15,
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  flipText: {
    fontSize: 18,
    color: "black",
  },

  pictureTakenContainer: {
    position: "absolute", // Keep container positioned over camera view
    left: 0, // Start from the left edge
    right: 0, // Stretch to the right edge
    bottom: 0, // Position at the bottom
    padding: 20, // Add some padding around
    backgroundColor: "black",
    flexDirection: "row", // Align children in a row
    justifyContent: "center", // Center children horizontally
    alignItems: "flex-end", // Align children to the bottom (flex-end)
  },
  cameraContainer: {
    position: "absolute", // Keep container positioned over camera view
    left: 0, // Start from the left edge
    right: 0, // Stretch to the right edge
    bottom: 0, // Position at the bottom
    padding: 20, // Add some padding around
    flexDirection: "row", // Align children in a row
    justifyContent: "center", // Center children horizontally
    alignItems: "flex-end", // Align children to the bottom (flex-end)
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "transparent", // Make background transparent
    borderWidth: 4, // Add border width
    borderColor: "#FFF", // Set border color to white or any color of your choice
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
