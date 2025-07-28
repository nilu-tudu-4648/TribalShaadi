import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import GradientLoader from "./GradientLoader";
import { Size20, Size40 } from "../constants/Sizes";
import { COLORS } from "../constants/AppColors";

export default function AppLoader() {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <GradientLoader size={Size40} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: COLORS.grey,
    borderRadius: Size20,
    padding: Size20,
    alignItems: "center",
  },
});
