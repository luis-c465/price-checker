// StarRating.tsx
import React from "react";
import { Text } from "react-native";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  // Calculate the number of empty stars (5 - rating)
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  return (
    <>
      {/* Render filled stars based on the rating */}
      {[...Array(filledStars)].map((_, index) => (
        <Text key={index} style={styles.star}>
          ★
        </Text>
      ))}
      {/* Render empty stars based on the remaining emptyStars */}
      {[...Array(emptyStars)].map((_, index) => (
        <Text key={`empty-${index}`} style={styles.starOutline}>
          ☆
        </Text>
      ))}
    </>
  );
};

const styles = {
  star: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of stars
  },
  starOutline: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of stars
    opacity: 0.3, // Set opacity to create outline effect
  },
};

export default StarRating;
