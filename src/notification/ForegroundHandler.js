import { useEffect } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import { schedulePushNotification } from './notifications';
import { getProposalsGotByMeApi } from '../store/reducers/userReducer';
import {
  baseUrl,
  getProposalsGotByMeUrl,
  getAcceptedProposalByIdUrl,
  getChatHistoryByUserId,
  getUserDetailsApi,
  getUserDetailsUrl,
} from '../constants/functions';
import { store } from '../store/configureStore';
import {
  getAcceptedProposalByIdApi,
} from '../store/reducers/chatReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES, NOTIFICATION_MESSAGES } from '../constants/data';

// Silence the modular API deprecation warning
global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Function to check if Firebase is ready
const isFirebaseReady = () => {
  try {
    return getApps().length > 0;
  } catch (error) {
    return false;
  }
};

const ForegroundHandler = params => {
  useEffect(() => {
    let unsubscribe = null;
    let setupTimer = null;
    let initializationTimer = null;
    let isCleanedUp = false;

    const setupForegroundHandler = async () => {
      try {
        // Check if component was already cleaned up
        if (isCleanedUp) return;

        if (!isFirebaseReady()) {
          return;
        }

        // Clear any existing setup timer
        if (setupTimer) {
          clearTimeout(setupTimer);
          setupTimer = null;
        }

        setupTimer = setTimeout(() => {
          try {
            // Double check cleanup status
            if (isCleanedUp) return;

            unsubscribe = messaging().onMessage(async remoteMessage => {
              try {
                if (Platform.OS === 'android') {
                  const { title, body } = remoteMessage?.notification || {};
                  const userDataString = await AsyncStorage.getItem(
                    ASYNC_VARIBLES.USER,
                  );
                  const user = JSON.parse(userDataString);
                  store.dispatch(
                    getAcceptedProposalByIdApi(
                      `${getAcceptedProposalByIdUrl}/${user.id}`,
                    ),
                  );
                  store.dispatch(
                    getProposalsGotByMeApi(
                      `${baseUrl}/${getProposalsGotByMeUrl}`,
                    ),
                  );
                  await getUserDetailsApi(
                    `${getUserDetailsUrl}id=${user.id}`,
                    store.dispatch,
                  );
                  await getChatHistoryByUserId(user.id, store.dispatch);

                  try {
                    const data = remoteMessage?.data || {};
                    const idCandidate = data.from || data.senderId || data.sender_id || data.userId || data.user_id || data.friendId || data.friend_id;
                    const parsed = idCandidate !== undefined && idCandidate !== null ? Number(idCandidate) : NaN;
                    const senderId = !Number.isNaN(parsed) ? parsed : null;
                    if (senderId && senderId !== user.id) {
                      store.dispatch(
                        addUnreadChatForeground({
                          userId: senderId,
                          content: body || '',
                          created_at: new Date().toISOString(),
                        })
                      );
                    }
                  } catch (_) { }
                  if (!title || !body || title === NOTIFICATION_MESSAGES.TESTING.title) return;

                  // Wrap schedulePushNotification in try-catch to prevent crashes
                  try {
                    await schedulePushNotification(
                      title,
                      body,
                      remoteMessage.data,
                    );
                  } catch (scheduleError) {
                    // Don't re-throw to prevent app crash
                  }
                }
              } catch (messageError) {
                // Don't re-throw to prevent app crash
              }
            });
          } catch (setupError) {
          }
        }, 500); // increased delay to stabilize real devices
      } catch (error) {
      }
    };

    // Add a small delay to ensure Firebase is initialized
    initializationTimer = setTimeout(() => {
      if (!isCleanedUp) {
        setupForegroundHandler();
      }
    }, 2000);

    return () => {
      // Mark as cleaned up to prevent any async operations
      isCleanedUp = true;

      // Clear all timers
      if (initializationTimer) {
        clearTimeout(initializationTimer);
        initializationTimer = null;
      }
      if (setupTimer) {
        clearTimeout(setupTimer);
        setupTimer = null;
      }

      // Unsubscribe from messaging
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (unsubscribeError) {
        }
        unsubscribe = null;
      }
    };
  }, []);

  return null;
};

export default ForegroundHandler;
