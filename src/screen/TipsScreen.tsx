import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  Size8,
  Size12,
  Size16,
  Size20,
  fontSize20,
  fontSize36,
  fontWeight500,
  fontWeight700,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';

const TipsScreen = () => {
  const safetyTips = [
    {
      title: 'Online Safety',
      points: [
        {
          subTitle: 'Safeguard your information',
          text: "Never share personal information, such as your home or work address, or details about your daily routine (e.g., that you go to a certain gym every Monday) with people you just made connection.",
        },
        {
          subTitle: 'Continue conversations on the App',
          text: "Keep chatting within Tribalshaadi to benefit from our safety features and reporting tools.\n\nOnly share your phone number, email, or other contact details when you feel completely ready.\n\nAvoid moving conversations to other platforms too soon—this ensures your privacy and lets us support you if needed.",
        },
        {
          subTitle: 'Never Send Money or Share Financial Information',
          text: "Never send money, especially through bank transfer, even if someone claims to be in an emergency.\n\nTransferring money is like sending cash – it's nearly impossible to reverse the transaction or trace where it went.\n\nNever share details that could give access to your financial accounts. If another user asks you for money, report it to us immediately.",
        },
      ],
    },
    {
      title: 'Meeting in Person',
      points: [
        {
          subTitle: 'Take your time',
          text: "Take your time before meeting or moving conversations outside the app. Get to know the other person well first, and don't hesitate to ask questions if something feels off. A quick phone or video call can also help you spot any red flags early.",
        },
        {
          subTitle: 'Meet in Public',
          text: "For the first few meetings, choose safe, public places. If the other person pushes you to meet in a private location, it's best to end the date.",
        },
        {
          subTitle: 'If you feel Uncomfortable, Leave',
          text: "Trust your instincts. If you ever feel uncomfortable, it's absolutely fine—encouraged even—to end the date early. If something feels wrong or unsafe, don't hesitate to reach out to people nearby for help.",
        },
      ],
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Safety Guidelines" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <AppText text="Safety Guidelines" textStyle={[styles.mainTitle,styles.mainTitleText]} />

          <AppText
            text="We at Tribalshaadi have strived to take all possible steps to build a safe online community. We advise all our users to follow the guidelines to stay safe during your Tribalshaadi experience."
            textStyle={styles.pointText}
          />

          <View style={styles.sectionsWrapper}>
            {safetyTips.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <AppText text={section.title} textStyle={styles.mainTitle} />

                <View style={styles.pointsWrapper}>
                  {section.points.map((point, pointIndex) => (
                    <View key={pointIndex} style={styles.pointContainer}>
                      <AppText
                        text={`• ${point.subTitle}`}
                        textStyle={styles.sectionTitle}
                      />
                      <AppText text={point.text} textStyle={styles.pointText} />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppSafeView>
  );
};

export default TipsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  mainTitleText: {
    fontSize: fontSize36,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_MEDIUM,
    color: COLORS.black,
    fontWeight: fontWeight500,
  },
  contentContainer: {
    padding: Size16,
    paddingBottom: Size20,
  },
  contentWrapper: {
    gap: Size16,
  },
  sectionsWrapper: {
    gap: Size16,
  },
  sectionContainer: {
    gap: Size12,
  },
  pointsWrapper: {
    gap: Size16,
  },
  pointContainer: {
    gap: Size8,
  },
  mainTitle: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: COLORS.violet,
    textAlign: 'left',
  },
  introText: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    color: COLORS.grey,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    fontWeight: fontWeight700,
    color: COLORS.black,
  },
  bulletPoint: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    color: COLORS.black,
    paddingLeft: Size16,
  },
  pointText: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    color: COLORS.black,
  },
});
