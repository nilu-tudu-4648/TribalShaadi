import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import AppHeader from '../components/AppHeader';
import AppSafeView from '../components/AppSafeView';
import { Size16 } from '../constants/Sizes';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/AppColors';

const InviteScreen = () => {

  const handleInvite = async () => {
    try {
      const shareOptions = {
        title: 'Join TribalShaadi - Find Your Perfect Match!',
        message: `🌟 Hey! I'm using TribalShaadi to find meaningful connections within our community. 

Join me and thousands of others in finding your perfect life partner! 

✨ Connect with like-minded people from your tribe
💕 Build meaningful relationships 
🔒 Safe and secure platform
🎯 Find your perfect match

Download TribalShaadi now and start your journey to love!

📱 Download: [App Store/Play Store Link]
🔗 Use my referral code for special benefits!

#TribalShaadi #FindLove #Community #Marriage`,
        url: 'https://tribalshaadi.com', // Replace with your actual app URL
        // You can also add specific social media options
        social: Share.Social.WHATSAPP, // This can be customized based on user selection
      };

      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
    } catch (error) {
      console.log('Error sharing:', error);
      if (error instanceof Error && error.message !== 'User did not share') {
        Alert.alert('Error', 'Unable to share at this time. Please try again.');
      }
    }
  };

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Invite" titleStyle={{ color: COLORS.white }} arrowColor={COLORS.white} />
      <View style={{ gap: Size16 }}>
        <AppText
          text="Help Your Friends Find Their Match!"
          style={styles.title}
        />

        <AppText
          text="Do you know someone looking for their life partner? Invite them to join TribalShaadi and help them connect with like-minded people from their community."
          style={styles.description}
        />

        <AppButton
          title="Share Invite"
          onPress={handleInvite}
          buttonStyle={styles.inviteButton}
          textStyle={styles.inviteButtonText}
        />

      </View>
    </AppSafeView>
  );
};

export default InviteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C084FC', // Light purple
    // padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  inviteButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  platformContainer: {
    flexDirection: 'row',
    gap: Size16,
  },
  platformButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  platformButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
