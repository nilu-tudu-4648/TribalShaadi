# Network Alert Setup

This document describes the network connectivity alert system implemented in the TribalShaadi app.

## Features

### 1. Network Status Detection
- **Real-time monitoring** of network connectivity
- **Internet reachability** checking (not just WiFi/cellular connection)
- **Cross-platform** support (iOS & Android)

### 2. User Alerts
- **Immediate popup alert** when connection is lost
- **Persistent banner** showing connection status
- **Smooth animations** for banner show/hide
- **Auto-dismissal** when connection is restored

### 3. API Error Handling
- **Enhanced middleware** to detect network errors
- **Graceful fallback** for API failures
- **User-friendly error messages**

## Implementation

### Files Created/Modified

1. **`src/hooks/useNetworkStatus.ts`** - Custom hook for network detection
2. **`src/components/NetworkAlert.tsx`** - Alert component with banner
3. **`App.tsx`** - Integration point for global network alerts
4. **`src/store/middleware/apiMiddleware.js`** - Enhanced error handling

### Dependencies

- `@react-native-community/netinfo@11.4.1` - Network state detection

## Usage

The network alert system works automatically once integrated:

```tsx
// Already integrated in App.tsx
import NetworkAlert from './src/components/NetworkAlert';

const App = () => {
  return (
    <>
      <NetworkAlert /> {/* Global network status alerts */}
      {/* Rest of your app */}
    </>
  );
};
```

## Customization

### Alert Styles
Modify `src/components/NetworkAlert.tsx` styles:
- `container` - Banner appearance
- `text` - Alert message styling

### Alert Behavior
Adjust in `NetworkAlert.tsx`:
- Animation duration
- Alert message text
- Banner colors
- Position (top/bottom)

### API Error Messages
Customize in `src/store/middleware/apiMiddleware.js`:
- Network error messages
- Retry logic
- Error handling behavior

## Testing

To test the network alert system:

1. **Airplane Mode**: Turn on airplane mode to simulate no connectivity
2. **WiFi Disconnect**: Disconnect from WiFi while on cellular
3. **Server Unreachable**: Block network access to test API errors

Expected behavior:
- Immediate popup alert appears
- Red banner slides down from top
- Banner disappears when connection restored
- API calls show appropriate error messages

## Technical Details

### Network Detection Logic
```typescript
const { isConnected, isInternetReachable, isOffline } = useNetworkStatus();

// isOffline = true when:
// - isConnected === false (no network)
// - isInternetReachable === false (network but no internet)
```

### Alert Timing
- **Immediate**: Native alert popup
- **Persistent**: Animated banner for ongoing awareness
- **Auto-hide**: Banner disappears when connected

### Error Handling Priority
1. Network errors (no connection)
2. HTTP status errors (401, 500, etc.)
3. Generic API errors