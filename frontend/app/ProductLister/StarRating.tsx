import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  // Calculate the number of filled and empty stars
  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;

  // Render stars based on the rating
  const renderStars = () => {
    const stars = [];
    // Render filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <Text key={`filled-${i}`} style={styles.star}>
          ★
        </Text>
      );
    }
    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} style={styles.starOutline}>
          ☆
        </Text>
      );
    }
    return stars;
  };

  return <View style={styles.container}>{renderStars()}</View>;
};

const styles = {
  container: {
    flexDirection: "row" as ViewStyle["flexDirection"], // Specify the type explicitly
  },
  star: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of filled stars
  },
  starOutline: {
    color: "#ffd700",
    fontSize: 20, // Set the font size of empty stars
    opacity: 0.3, // Set opacity to create outline effect
  },
};

export default StarRating;
