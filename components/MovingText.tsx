import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type MovingTextProps = {
  text: string;
  animationThreshold: number;
  widthFraction?: number; // Fraction of the screen width (e.g., 0.75 for 3/4, 0.5 for 1/2)
  style?: any;
};

export const MovingText = ({
  text,
  animationThreshold,
  widthFraction = 1,
  style,
}: MovingTextProps) => {
  const translateX = useSharedValue(0);
  const shouldAnimate = text.length >= animationThreshold;

  const screenWidth = Dimensions.get("window").width;
  const containerWidth = screenWidth * widthFraction;

  const textWidth = text.length * 8; // Adjust this multiplier based on your font size and text length

  useEffect(() => {
    if (!shouldAnimate) return;

    translateX.value = withDelay(
      1000,
      withRepeat(
        withTiming(-textWidth, {
          duration: 10000,
          easing: Easing.linear,
        }),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(translateX);
      translateX.value = 0;
    };
  }, [translateX, text, animationThreshold, shouldAnimate, textWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, { width: containerWidth }]}>
      <Animated.Text
        numberOfLines={1}
        style={[
          style,
          animatedStyle,
          shouldAnimate && {
            width: textWidth, // Preventing the ellipsis from appearing
            paddingLeft: 16, // Avoid the initial character being barely visible
          },
        ]}
      >
        {text}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
  },
});
