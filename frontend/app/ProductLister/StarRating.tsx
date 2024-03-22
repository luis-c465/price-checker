// StarRating.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  return (
    <View style={styles.starRating}>
      {[...Array(filledStars)].map((_, index) => (
        <Text key={index} style={styles.star}>
          ★
        </Text>
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <Text key={index} style={[styles.star, styles.emptyStar]}>
          ☆
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starRating: {
    flexDirection: "row",
  },
  star: {
    color: "#ffd700",
    fontSize: 24,
  },
  emptyStar: {
    color: "#ccc",
  },
});

export default StarRating;
