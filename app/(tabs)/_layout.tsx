import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "@/constants/tokens";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {/* Content Container */}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 500,
              fontSize: 14,
              marginBottom: 2,
            },
            tabBarStyle: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 0,
              paddingTop: 8,
              height: 70,
              position: "relative",
              bottom: 0,
              width: "100%",
              backgroundColor: "transparent", // Make background transparent for blur effect
              zIndex: 0, // Ensure it is beneath the FloatingPlayer
            },
            // tabBarBackground: () => (
            //   <BlurView
            //     intensity={45}
            //     style={{
            //       ...StyleSheet.absoluteFillObject,
            //       overflow: "hidden",
            //       borderTopLeftRadius: 20,
            //       borderTopRightRadius: 20,
            //       zIndex: 0,
            //       position: "absolute",
            //     }}
            //   />
            // ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Songs",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name="musical-notes-sharp"
                  size={focused ? 32 : 28}
                  color={color}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: focused ? 12 : 10,
                    fontWeight: focused ? "bold" : "normal",
                    color: "#888",
                    marginBottom: 5,
                  }}
                >
                  Songs
                </Text>
              ),
            }}
          />
          <Tabs.Screen
            name="playlist"
            options={{
              title: "PlayList",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="playlist-play"
                  size={focused ? 32 : 28}
                  color={color}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: focused ? 12 : 10,
                    fontWeight: focused ? "bold" : "normal",
                    color: "#888",
                    marginBottom: 5,
                  }}
                >
                  PlayList
                </Text>
              ),
            }}
          />
          <Tabs.Screen
            name="favourites"
            options={{
              title: "Favourites",
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome
                  name="heart"
                  size={focused ? 32 : 28}
                  color={color}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: focused ? 12 : 10,
                    fontWeight: focused ? "bold" : "normal",
                    color: "#888",
                    marginBottom: 5,
                  }}
                >
                  Favorites
                </Text>
              ),
            }}
          />
          {/* <Tabs.Screen
            name="artists"
            options={{
              title: "Artists",
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome6
                  name="users-line"
                  size={focused ? 32 : 28}
                  color={color}
                />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: focused ? 12 : 10,
                    fontWeight: focused ? "bold" : "normal",
                    color: "#888",
                    marginBottom: 5,
                  }}
                >
                  Artists
                </Text>
              ),
            }}
          /> */}
        </Tabs>
        <View className="absolute bottom-[74px] w-full">
          <FloatingPlayer />
        </View>
      </View>
      {/* Floating Player */}
    </SafeAreaView>
  );
}
