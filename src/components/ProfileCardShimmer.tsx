import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/AppColors';
import { SIZES, fontSize14, Size10 } from '../constants/Sizes';
import NameComponent from './NameComponent';

const { width, height } = Dimensions.get('window');

const ProfileCardShimmer: React.FC = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startShimmer();
  }, [shimmerValue]);

  const shimmerStyle = {
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled={true}
      scrollEnabled={true}
    >
      <View style={styles.imageContainer}>
        <Animated.View style={[styles.profileImageShimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          />
          
          {/* Use NameComponent with loading state to show the skeleton */}
          <NameComponent
            name="null"
            age={0}
            isVerified={false}
            isPremium={false}
            height="null"
            religion="null"
            caste="null"
            districtName="null"
            stateName="null"
            isNameLoading={true}
          />
        </Animated.View>
      </View>
      
      {/* Bio Section Shimmer */}
      <View style={styles.bioSection}>
        {/* <AppText text="Bio" textStyle={styles.bioLabel} /> */}
        <View style={styles.bioShimmerContainer}>
          <Animated.View style={[styles.bioShimmerLine, shimmerStyle]} />
          <Animated.View style={[styles.bioShimmerLine, styles.bioShimmerLineShort, shimmerStyle]} />
        </View>
      </View>
      
      {/* Additional content placeholders */}
      <View style={styles.horizontalLine} />
      <View style={styles.contentShimmer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Animated.View style={[styles.iconShimmer, shimmerStyle]} />
            <Animated.View style={[styles.textShimmer, shimmerStyle]} />
            <Animated.View style={[styles.labelShimmer, shimmerStyle]} />
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.column}>
            <Animated.View style={[styles.iconShimmer, shimmerStyle]} />
            <Animated.View style={[styles.textShimmer, shimmerStyle]} />
            <Animated.View style={[styles.labelShimmer, shimmerStyle]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileCardShimmer;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 4,
  },
  imageContainer: {
    width: width,
    height: height * 0.7,
    borderRadius: Size10,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImageShimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightgrey,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    zIndex: 1,
  },
  bioSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  bioLabel: {
    fontSize: fontSize14,
    fontWeight: '600',
    color: COLORS.textBlack,
    marginBottom: Size10,
  },
  bioShimmerContainer: {
    gap: Size10,
  },
  bioShimmerLine: {
    height: 16,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 8,
    width: '100%',
  },
  bioShimmerLineShort: {
    width: '60%',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SIZES.padding,
  },
  contentShimmer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  column: {
    alignItems: 'center',
    gap: Size10,
    flex: 1,
  },
  verticalLine: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.divider,
  },
  iconShimmer: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 12,
  },
  textShimmer: {
    width: 80,
    height: 16,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 8,
  },
  labelShimmer: {
    width: 60,
    height: 12,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 6,
  },
});
