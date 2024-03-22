// SortByRatingButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface SortByRatingButtonProps {
  onPress: () => void;
}

const SortByRatingButton: React.FC<SortByRatingButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Sort by Rating</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SortByRatingButton;
