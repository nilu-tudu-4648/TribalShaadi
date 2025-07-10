import { COLORS } from "../constants/AppColors";
import React from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

const AppScrollView = ({
  children,
  style,
  hScrollIndicator = false,
  vScrollIndicator = false,
  viewHorizontal = false,
  onRefresh = null, 
  isRefreshing = false, 
  otherProps = {}, 
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      showsHorizontalScrollIndicator={hScrollIndicator}
      showsVerticalScrollIndicator={vScrollIndicator}
      horizontal={viewHorizontal}
      refreshControl={
        onRefresh && (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#000" // Customize the color if needed
            colors={[COLORS.primary, "#689F38"]} // Colors of the refresh spinner
          />
        )
      }
      {...otherProps}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(AppScrollView);
