
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';
import AppHeader from '../components/AppHeader'
import AppSafeView from '../components/AppSafeView'
import { COLORS } from '../constants/AppColors'
import AppLoader from '../components/AppLoader';

const YourStoryScreen = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Your Story" />
      <WebView
        source={{
          uri: 'https://docs.google.com/forms/d/e/1FAIpQLSfRW9DKVngDj29yFPlZyitCel7IGSg-H0J12Yw6XZRlCt9CNg/viewform?usp=header',
        }}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <AppLoader />}
    </AppSafeView>
  )
}

export default YourStoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
})