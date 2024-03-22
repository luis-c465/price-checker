// SortByPriceButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface SortByPriceButtonProps {
  onPress: () => void;
}

const SortByPriceButton: React.FC<SortByPriceButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Sort by Price</Text>
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

export default SortByPriceButton;
