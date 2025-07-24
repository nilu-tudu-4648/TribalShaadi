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
  lignHeight20,
  fontSize14,
  fontSize20,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';

const TipsScreen = () => {
  const safetyTips = [
    {
      title: 'Online Safety',
      points: [
        'Never Send Money or Share Financial Information',
        "Never send money, especially over wire transfer, even if the person claims to be in an emergency. Wiring money is like sending cash — it's nearly impossible to reverse the transaction or trace where the money went.",
        "Never share personal information (such as social security number, home or work address, or details about your daily routine) with people you don't know.",
        'Never share financial account information with another user',
      ],
    },
    {
      title: 'Protect Personal Information',
      points: [
        "Never share personal information, such as your home or work address, or details about your daily routine (i.e., that you go to a certain gym every Monday) with people you don't know.",
        "Limit the information you share about your children in your conversations, especially about your children's names, where they live, or about your children.",
      ],
    },
    {
      title: 'Stay on the Platform',
      points: [
        "Keep conversations on the Tribalshadi platform while you're getting to know each other. Users with bad intentions often try to move the conversation to text, messaging apps, email or phone right away.",
      ],
    },
    {
      title: 'Report All Suspicious and Offensive Behavior',
      points: [
        'You know when someone has crossed the line and when they do, we want to know about it. Block and report anyone that violates our terms. Here are some examples of violations:',
        '• Requests for money or donations',
        '• Underage users',
        '• Harassment, threats, and offensive messages',
        '• Inappropriate behavior during or after meeting in person',
        '• Other concerning behavior',
      ],
    },
    {
      title: 'Protect Your Account',
      points: [
        'Be sure to log out when logging into your account from a public or shared computer. Never leave your account open on a shared computer.',
      ],
    },
    {
      title: 'Meeting in Person',
      points: [
        "Don't Rush",
        "Take time and get to know the other person before agreeing to meet or chat off Tribalshadi platform. Don't be afraid to ask questions to screen for any red flags or personal dealbreakers. A phone call or video chat can be a useful screening tool before meeting.",
      ],
    },
    {
      title: 'Meet in Public and Stay in Public',
      points: [
        "Meet for the first few dates in a populated, public place — never at your home, your date's home, or any other private location. If your date pressures you to go to a private location, end the date.",
      ],
    },
    {
      title: 'Tell Friends and Family About Your Plans',
      points: [
        "Tell a friend or family member of your plans, including when and where you're going. Have that person call you at a certain point throughout the date.",
      ],
    },
    {
      title: 'Be in Control of Your Transportation',
      points: [
        "We want you to be in control of how you get to and from your date so that you can leave whenever you want. If you're driving yourself, it's a good idea to have a backup plan such as a ride-share app or a friend to pick you up.",
      ],
    },
    {
      title: "Don't Leave Drinks or Personal Items Unattended",
      points: [
        "Know where your drink comes from and know where it is at all times — only accept drinks poured or served directly from the bartender or server. Don't leave drinks unattended or with someone you don't know.",
      ],
    },
    {
      title: 'If You Feel Uncomfortable, Leave',
      points: [
        "It's okay to end the date early if you're feeling uncomfortable. In fact, it's encouraged. And if your instincts are telling you something is off or you feel unsafe, don't hesitate to contact local authorities.",
      ],
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Safety tips" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <AppText text="Safe Matching Advice" textStyle={styles.mainTitle} />

          <AppText
            text="Meeting new people is exciting, but you should always be cautious when interacting with someone you don't know. Use your best judgment and put your safety first, whether you are exchanging initial messages or meeting in person. While you can't control the actions of others, you can take steps to help you stay safe during your Tribalshadi experience."
            textStyle={styles.pointText}
          />

          <View style={styles.sectionsWrapper}>
            {safetyTips.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <AppText text={section.title} textStyle={styles.sectionTitle} />

                <View style={styles.pointsWrapper}>
                  {section.points.map((point, pointIndex) => (
                    <View key={pointIndex} style={styles.pointContainer}>
                      {point.startsWith('•') ? (
                        <AppText text={point} textStyle={styles.bulletPoint} />
                      ) : (
                        <AppText text={point} textStyle={styles.pointText} />
                      )}
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
    gap: Size8,
  },
  pointContainer: {
    // No styles needed, gap handled by parent
  },
  mainTitle: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.black,
    textAlign: 'left',
  },
  introText: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    color: COLORS.grey,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 22,
  },
  bulletPoint: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    color: COLORS.black,
    paddingLeft: Size16,
    lineHeight: lignHeight20,
  },
  pointText: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_REGULAR,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
