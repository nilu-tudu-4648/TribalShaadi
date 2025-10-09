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
        {
          subTitle: 'Never Send Money or Share Financial Information',
          text: "Never send money, especially over wire transfer, even if the person claims to be in an emergency. Wiring money is like sending cash — it's nearly impossible to reverse the transaction or trace where the money went. Never share information that could be used to access your financial accounts. If another user asks you for money, report it to us immediately.",
        },
        {
          subTitle: 'Protect Your Personal Information',
          text: "Never share personal information, such as your home or work address, or details about your daily routine (e.g., that you go to a certain gym every Monday) with people you don't know. If you are a parent, limit the information that you share about your children on your profile and in early communications. Avoid sharing details such as your children's names, where they go to school, or their ages or genders.",
        },
        {
          subTitle: 'Stay on the Platform',
          text: "Keep conversations on the Tribalshaadi platform while you're getting to know someone. Because Users with bad intentions often try to move the conversation to text, messaging apps, email, or phone right away.",
        },
        {
          subTitle: 'Report All Suspicious and Offensive Behavior',
          text: "You know when someone's crossed the line and when they do, we want to know about it. Block and report anyone that violates our terms. Here are some examples of violations:\n• Requests for money or donations\n• Underage users\n• Harassment, threats, and offensive messages\n• Inappropriate or harmful behavior during or after meeting in person\n• Fraudulent profiles\n• Spam or solicitation including links to commercial websites or attempts to sell products or services",
        },
        {
          subTitle: 'Protect Your Account',
          text: 'Be sure to be careful when logging into your account from a public or shared computer. Tribalshaadi will never send you an email asking for your username and password information — if you receive an email asking for account information, report it immediately. If you are logging in using your phone number, do not share your SMS code with anyone. Any website requesting this code to verify your identity is not affiliated with Tribalshaadi in any way.',
        },
      ],
    },
    {
      title: 'Meeting in Person',
      points: [
        {
          subTitle: "Don't Rush",
          text: "Take your time and get to know the other person before agreeing to meet or chat off Tribalshaadi. Don't be afraid to ask questions to screen for any red flags or personal dealbreakers. After moving to chat off Tribalshaadi, a phone call or video chat can be a useful screening tool before meeting in person.",
        },
        {
          subTitle: 'Meet in Public and Stay in Public',
          text: "Meet for the first few times in a populated, public place — never at your home, your date's home, or any other private location. If your date pressures you to go to a private location, end the date.",
        },
        {
          subTitle: 'Tell Friends and Family About Your Plans',
          text: "Tell a friend or family member of your plans, including when and where you're going. Have your cell phone charged and with you at all times.",
        },
        {
          subTitle: 'Be in Control of Your Transportation',
          text: "We want you to be in control of how you get to and from your date so that you can leave whenever you want. If you're driving yourself, it's a good idea to have a backup plan such as a ride-share app or a friend to pick you up.",
        },
        {
          subTitle: "Don't Leave Drinks or Personal Items Unattended",
          text: 'Know where your drink comes from and know where it is at all times — only accept drinks poured or served directly from the bartender or server. Many substances that are slipped into drinks to facilitate sexual assault are odorless, colorless, and tasteless. Also, keep your phone, purse, wallet, and anything containing personal information on you at all times.',
        },
        {
          subTitle: 'If You Feel Uncomfortable, Leave',
          text: "It's okay to end the date early if you're feeling uncomfortable. In fact, it's encouraged. And if your instincts are telling you something is off or you feel unsafe, ask the bartender or server for help.",
        },
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
            text="Meeting new people is exciting, but you should always be cautious when interacting with someone you don't know. Use your best judgment and put your safety first, whether you are exchanging initial messages or meeting in person. While you can't control the actions of others, there are things you can do to help you stay safe during your Tribalshaadi experience."
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
    color: COLORS.black,
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
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 22,
  },
  bulletPoint: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    color: COLORS.black,
    paddingLeft: Size16,
    lineHeight: lignHeight20,
  },
  pointText: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    fontWeight: '400',
    color: COLORS.black,
    lineHeight: 20,
  },
});
