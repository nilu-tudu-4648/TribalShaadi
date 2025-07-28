
import React from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';
import AppHeader from '../components/AppHeader'
import AppSafeView from '../components/AppSafeView'
import { COLORS } from '../constants/AppColors'

const SupportScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Support" />
      <WebView
        source={{
          uri: 'https://docs.google.com/forms/d/e/1FAIpQLScJIRI94k3xfSFVId79151eL2XQ2G6doKKzSemziONACjljdA/viewform?usp=header',
        }}
      />
    </AppSafeView>
  )
}

export default SupportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
})