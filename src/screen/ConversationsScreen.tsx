import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppSafeView from '../components/AppSafeView';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  fontSize14,
  fontSize12,
  Size16,
  Size12,
  Size8,
  Size20,
  Size4,
  Size40,
  Size5,
  Size22,
  Size10,
  fontSize30,
  Size25,
  Size14,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ArrowIosBackSvg, SendIcon } from '../components/svg/SvgIcons2';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterChatByUserId,
  formatDateShort,
  formatChatDateHeader,
  isDifferentDay,
  getChatHistoryByUserId,
  getUserDetailsApi,
  getUserDetailsUrl,
  imageUrl,
  setReducerLoadingfalse,
  updateChatIsReadApi,
  updateChatIsReadUrl,
  baseUrl,
  insertUserNotificationsUrl,
  apiUrl,
} from '../constants/functions';
import AppTextInput from '../components/AppTextInput';
import { io, Socket } from 'socket.io-client';
import {
  insertUserNotificationsApi,
} from '../store/reducers/chatReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES, NOTIFICATION_MESSAGES } from '../constants/data';
import axios from 'axios';

// Message type definitions
interface Message {
  id: string | number;
  type: 'story_starter' | 'received' | 'sent' | 'date_header';
  message?: string;
  time?: string;
  date?: string;
  timestamp?: number;
  status?: 'sent' | 'sending' | 'failed';
  dateHeader?: string; // For date header messages
}

// Initial story starter message
const INITIAL_STORY_STARTER: Message = {
  id: 'story_starter_1',
  type: 'story_starter',
  date: '11 April 2025',
  timestamp: Date.now(),
};

const ConversationsScreen = () => {
  const navigation = useNavigation();
  const [messageText, setMessageText] = useState('');
  const [chatData, setChatData] = useState<Message[]>([INITIAL_STORY_STARTER]);
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const { userDetails } = useRoute().params as { userDetails: any };
  const socket = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const dispatch = useDispatch();
  const messageIdCounter = useRef<number>(0);
  // Generate unique ID for messages
  const generateUniqueId = useCallback(() => {
    messageIdCounter.current += 1;
    return `${Date.now()}_${messageIdCounter.current}`;
  }, []);

  // Helper function to group messages with date headers
  const groupMessagesWithDateHeaders = useCallback((messages: Message[]) => {
    if (!messages.length) return [INITIAL_STORY_STARTER];

    const groupedMessages: Message[] = [INITIAL_STORY_STARTER];
    let lastDateHeader = '';

    messages.forEach((message, _index) => {
      const messageTimestamp = message.timestamp || Date.now();
      const currentDateHeader = formatChatDateHeader(messageTimestamp);

      // Add date header if this is a new day
      if (currentDateHeader !== lastDateHeader) {
        groupedMessages.push({
          id: `date_header_${messageTimestamp}`,
          type: 'date_header',
          dateHeader: currentDateHeader,
          timestamp: messageTimestamp,
        });
        lastDateHeader = currentDateHeader;
      }

      groupedMessages.push(message);
    });

    return groupedMessages;
  }, []);
  const filterReceivedMessages = useCallback(
    async (messages: any[]) => {
      const receivedMessages = messages.filter(
        (message: any) => message.userId !== user.id && message.isRead === 0,
      );

      if (receivedMessages.length > 0 && receivedMessages[0].chatId) {
        await updateChatIsReadApi(`${updateChatIsReadUrl}`, {
          chatId: receivedMessages[0].chatId,
          isRead: true,
        });
      }

      await getChatHistoryByUserId(user.id, dispatch);

      return receivedMessages;
    },
    [user.id, dispatch],
  );

  const loadChatMessages = useCallback(async () => {
    if (!user?.id || !userDetails?.friendId) {
      return;
    }

    try {
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });

      const filteredChat = await filterChatByUserId(
        user.id,
        userDetails.friendId,
      );
      await filterReceivedMessages(filteredChat);

      if (Array.isArray(filteredChat) && filteredChat.length > 0) {
        const loadedMessages: Message[] = filteredChat
          .filter((record: any) => record?.content?.trim())
          .map((record: any) => {
            const isSent = String(record.userId) === String(user.id);
            return {
              id: generateUniqueId(),
              type: isSent ? 'sent' : 'received',
              message: record.content,
              time: new Date(record.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timestamp: new Date(record.created_at).getTime(),
              status: 'sent',
            };
          });

        const groupedMessages = groupMessagesWithDateHeaders(loadedMessages);

        // Save the last message (excluding date headers) to AsyncStorage
        // Find the last non-date-header message
        const lastMessage = [...groupedMessages]
          .reverse()
          .find(msg => msg.type !== 'date_header');
        const savedLastMessage = await AsyncStorage.getItem(
          ASYNC_VARIBLES.LAST_MESSAGE,
        );

        if (lastMessage) {
          let messagesArray: any[] = [];
          if (savedLastMessage) {
            try {
              messagesArray = JSON.parse(savedLastMessage);
              if (!Array.isArray(messagesArray)) {
                messagesArray = [messagesArray];
              }
            } catch (e) {
              messagesArray = [];
            }
            const friendId = userDetails.friendId;
            const lastMsgWithFriendId = { ...lastMessage, friendId };
            const idx = messagesArray.findIndex(
              (msg: any) => msg.friendId === friendId,
            );
            if (idx !== -1) {
              messagesArray[idx] = lastMsgWithFriendId;
            } else {
              messagesArray.push(lastMsgWithFriendId);
            }
            await AsyncStorage.setItem(
              ASYNC_VARIBLES.LAST_MESSAGE,
              JSON.stringify(messagesArray),
            );
          } else {
            await AsyncStorage.setItem(
              ASYNC_VARIBLES.LAST_MESSAGE,
              JSON.stringify([
                { ...lastMessage, friendId: userDetails.friendId },
              ]),
            );
          }
        }

        setChatData(groupedMessages);
      } else {
        setChatData([INITIAL_STORY_STARTER]);
      }
    } catch (error) {
      console.error('error loading chat messages:', error);
      setChatData([INITIAL_STORY_STARTER]);
    }
  }, [
    user?.id,
    userDetails?.friendId,
    generateUniqueId,
    dispatch,
    filterReceivedMessages,
    groupMessagesWithDateHeaders,
  ]);
  // Update last message preview in storage for this friend
  const updateLastMessagePreview = useCallback(
    async (friendId: string | number, message: Message) => {
      try {
        const savedLastMessage = await AsyncStorage.getItem(
          ASYNC_VARIBLES.LAST_MESSAGE,
        );
        let messagesArray: any[] = [];
        if (savedLastMessage) {
          try {
            messagesArray = JSON.parse(savedLastMessage);
            if (!Array.isArray(messagesArray)) {
              messagesArray = [messagesArray];
            }
          } catch (e) {
            messagesArray = [];
          }
        }

        const lastMsgWithFriendId = { ...message, friendId };
        const idx = messagesArray.findIndex(
          (msg: any) => msg.friendId === friendId,
        );
        if (idx !== -1) {
          messagesArray[idx] = lastMsgWithFriendId;
        } else {
          messagesArray.push(lastMsgWithFriendId);
        }

        await AsyncStorage.setItem(
          ASYNC_VARIBLES.LAST_MESSAGE,
          JSON.stringify(messagesArray),
        );
      } catch (error) {
        console.error('error updating last message preview:', error);
      }
    },
    [],
  );
  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);
  const getUserStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const userStatus = await axios.get(
      `${baseUrl}/${getUserDetailsUrl}id=${userDetails.friendId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Add timeout to prevent hanging requests
      },
    );
    return userStatus.data.recordList[0].middleName;
  }, [userDetails.friendId]);

  const addMessage = useCallback(
    async (message: Omit<Message, 'id' | 'timestamp'>) => {
      const newMessage: Message = {
        ...message,
        id: generateUniqueId(), // Use unique ID generator
        timestamp: Date.now(),
      };

      setChatData(currentChatData => {
        const lastMessage = currentChatData[currentChatData.length - 1];
        const newMessageTimestamp = newMessage.timestamp || Date.now();
        const currentDateHeader = formatChatDateHeader(newMessageTimestamp);

        let updatedMessages = [...currentChatData];

        const needsDateHeader =
          !lastMessage ||
          lastMessage.type === 'story_starter' ||
          (lastMessage.timestamp &&
            isDifferentDay(lastMessage.timestamp, newMessageTimestamp));

        if (needsDateHeader) {
          const dateHeaderMessage: Message = {
            id: `date_header_${newMessageTimestamp}`,
            type: 'date_header',
            dateHeader: currentDateHeader,
            timestamp: newMessageTimestamp,
          };
          updatedMessages.push(dateHeaderMessage);
        }

        updatedMessages.push(newMessage);
        return updatedMessages;
      });

      // Persist last message preview live with a proper time (avoid "sending...")
      const previewMessage: Message = {
        ...newMessage,
        time:
          newMessage.status === 'sending' ? getCurrentTime() : newMessage.time,
      };
      await updateLastMessagePreview(userDetails.friendId, previewMessage);
      //this is for updating the unread chat history
      // Scroll immediately after state update
      setTimeout(() => {
        scrollToBottom();
      }, 50); // Small delay to ensure state update is processed
    },
    [
      scrollToBottom,
      generateUniqueId,
      userDetails.friendId,
      updateLastMessagePreview,
    ],
  );

  // Initialize socket connection with fallback URLs
  const initializeSocket = useCallback(
    (attempt: number = 0) => {
      const serverUrls = [apiUrl];

      if (attempt >= serverUrls.length) {
        console.error('❌ All connection attempts failed');

        return;
      }

      const SERVER_URL = serverUrls[attempt];

      // Cleanup previous socket if exists
      if (socket.current) {
        socket.current.removeAllListeners();
        socket.current.disconnect();
      }

      socket.current = io(SERVER_URL, {
        transports: ['websocket', 'polling'], // Try both transports
        timeout: 10000, // 10 second timeout
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        forceNew: true,
        upgrade: true,
      });

      socket.current.on('connect', () => {
        if (user?.id) {
          socket.current?.emit('register', user.id);
        }
      });

      socket.current.on('connect_error', error => {
        console.error(
          `❌ Connection attempt ${attempt + 1} failed:`,
          error.message,
        );

        // Try next URL after a short delay
        setTimeout(() => {
          initializeSocket(attempt + 1);
        }, 1500);
      });

      // Handle reconnection events
      socket.current.on('reconnect', attemptNumber => {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`);

        // Re-register user after reconnection
        if (user?.id) {
          console.log(
            `📝 Re-registering user ${user.id} after reconnection...`,
          );
          socket.current?.emit('register', user.id);
        }
      });

      socket.current.on('reconnect_error', error => {
        console.error('❌ Reconnection failed:', error.message);
      });

      socket.current.on('reconnect_failed', () => {
        console.error('❌ All reconnection attempts failed');
      });

      socket.current.on('receive_message', ({ from, content, timestamp }) => {
        // Convert IDs to string for comparison (in case one is number, one is string)
        if (String(from) === String(userDetails?.friendId)) {
          console.log('✅ Message is from the correct user, adding to chat');
          addMessage({
            type: 'received',
            message: content,
            time: new Date(timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
          });

        } else {
          console.log('⚠️ Message from unexpected user, ignoring');
        }
      });

      socket.current.on('message_sent', async ({ content }) => {
        console.log('✅ Message sent confirmation received for:', content);
        setChatData(currentChatData =>
          currentChatData.map(msg =>
            msg.message === content && msg.status === 'sending'
              ? { ...msg, status: 'sent', time: getCurrentTime() }
              : msg,
          ),
        );
        const userStatus = await getUserStatus();
        console.log(userStatus, 'userStatus');
        if (userStatus === 'online') {
          dispatch(
            insertUserNotificationsApi(
              `${baseUrl}/${insertUserNotificationsUrl}`,
              {
                title: NOTIFICATION_MESSAGES.TESTING.title,
                message: NOTIFICATION_MESSAGES.TESTING.message,
                receiverUserId: userDetails.friendId,
              },
            ),
          );
        }

        scrollToBottom(); // Auto-scroll when message status updates
        // Update last message preview time to confirmed time
        updateLastMessagePreview(userDetails.friendId, {
          id: generateUniqueId(),
          type: 'sent',
          message: content,
          time: getCurrentTime(),
          timestamp: Date.now(),
          status: 'sent',
        } as Message);
      });

      socket.current.on('error_message', error => {
        console.error('❌ Socket Error:', error.response.data);

        // Update any sending messages to failed status
        setChatData(currentChatData =>
          currentChatData.map(msg =>
            msg.status === 'sending'
              ? { ...msg, status: 'failed', time: 'Failed' }
              : msg,
          ),
        );
      });

      socket.current.on('disconnect', reason => {
        console.log('🔴 Disconnected from socket server. Reason:', reason);

        if (reason === 'io server disconnect') {
          // Server disconnected the socket, it will try to reconnect automatically
          console.log('🔄 Server disconnected, will attempt to reconnect...');
        }
      });
    },
    [
      user?.id,
      userDetails?.friendId,
      addMessage,
      scrollToBottom,
      generateUniqueId,
      updateLastMessagePreview,
      dispatch,
      getUserStatus,
      // loadChatMessages,
    ],
  );
  // Load messages when redux state changes
  useEffect(() => {
    if (user?.id && userDetails?.friendId) {
      loadChatMessages();
    }
  }, [loadChatMessages, user?.id, userDetails?.friendId]);

  // Initialize socket and fetch initial data on component mount
  useEffect(() => {
    initializeSocket(0);
    return () => {
      if (socket.current) {
        socket.current.removeAllListeners();
        socket.current.disconnect();
      }
    };
  }, [initializeSocket, user?.id, userDetails?.friendId, dispatch]);

  // Auto-scroll when chatData changes
  useEffect(() => {
    if (chatData.length > 1) {
      // Skip initial story starter
      scrollToBottom();
    }
  }, [chatData, scrollToBottom]);

  // Generate current time string
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSendMessage = () => {
    if (!socket.current?.connected) {
      console.error('❌ Cannot send message: Not connected to server');
      return;
    }

    if (messageText.trim() && user?.id && userDetails?.friendId) {
      const content = messageText.trim();
      console.log('📤 Sending message:', {
        from: user?.id,
        to: userDetails.friendId,
        content,
      });
      socket.current?.emit('send_message', {
        from: String(user?.id), // Ensure it's a string
        to: String(userDetails.friendId), // Ensure it's a string
        content,
      });
      addMessage({
        type: 'sent',
        message: content,
        time: getCurrentTime(),
        status: 'sending',
      });
      setMessageText('');
    } else {
      console.error('❌ Cannot send message:', {
        messageEmpty: !messageText.trim(),
        noUserId: !user?.id,
        noUserDetailsId: !userDetails?.friendId,
        notConnected: !socket.current?.connected,
      });
    }
  };
  const renderMessage = (item: Message) => {
    if (item.type === 'story_starter') {
      return (
        <View key={item?.id} style={styles.storyStarterContainer}>
          <View style={styles.userImagesContainer}>
            <View style={styles.userImageWrapper}>
              <Image
                source={{ uri: imageUrl + user?.image }}
                style={styles.userImage}
              />
            </View>
            <View style={[styles.userImageWrapper, styles.overlappingImage]}>
              <Image
                source={{ uri: imageUrl + userDetails?.image }}
                style={styles.userImage}
              />
            </View>
          </View>
          <AppText
            text={`Your story started on\n${formatDateShort(
              userDetails?.friendsSince || '',
            )}`}
            textStyle={styles.storyStarterText}
          />
        </View>
      );
    }

    if (item.type === 'date_header') {
      return (
        <View key={item?.id} style={styles.dateHeaderContainer}>
          <View style={styles.dateHeaderBubble}>
            <AppText
              text={item.dateHeader || ''}
              textStyle={styles.dateHeaderText}
            />
          </View>
        </View>
      );
    }

    if (item.type === 'received') {
      return (
        <View key={item?.id} style={styles.messageContainer}>
          <View style={styles.timeContainerEnd}>
            <AppText text={item.time} textStyle={styles.timeText} />
          </View>
          <View style={styles.receivedMessageBubble}>
            <AppText
              text={item.message}
              textStyle={styles.receivedMessageText}
            />
          </View>
        </View>
      );
    }

    if (item.type === 'sent') {
      return (
        <View key={item?.id} style={styles.messageContainer}>
          <View style={styles.timeContainer}>
            <AppText
              text={
                item.status === 'sending'
                  ? 'sending...'
                  : item.status === 'failed'
                  ? 'Failed'
                  : item.time
              }
              textStyle={[
                styles.timeText,
                item.status === 'failed' && styles.failedMessage,
              ]}
            />
          </View>
          <View style={styles.sentMessageBubble}>
            <AppText text={item.message} textStyle={styles.sentMessageText} />
          </View>
        </View>
      );
    }

    return null;
  };
  const handleBack = useCallback(() => {
    navigation.goBack();
    loadChatMessages();
  }, [navigation, loadChatMessages]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [handleBack]);
  return (
    <AppSafeView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ArrowIosBackSvg
              color={COLORS.black}
              width={Size25}
              height={Size25}
            />
          </Pressable>
          <View style={styles.headerCenter}>
            <AppText
              text={`${userDetails.firstName} ${userDetails.lastName ?? ''}`}
              textStyle={styles.headerTitle}
            />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {chatData.map(renderMessage)}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <AppTextInput
              textInputStyle={styles.textInput}
              placeholder="Type a message"
              placeholderTextColor={COLORS.placeholderText}
              value={messageText}
              onChangeText={text => {
                // Prevent input if the text is only numbers
                if (/^\d+$/.test(text)) {
                  // Do not update the messageText if only numbers
                  return;
                }
                setMessageText(text);
              }}
              multiline
              maxLength={500}
              keyboardType="default"
              label={false}
            />
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <SendIcon
              width={Size40}
              height={Size40}
              color={messageText.trim() ? COLORS.violet : COLORS.grey}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AppSafeView>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingTop: Size16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight2,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: fontSize30,
    height: fontSize30,
    borderRadius: fontSize30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  headerTitle: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  headerCenter: {
    flex: 1,
    left: Size10,
  },
  connectionStatus: {
    fontSize: fontSize12,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    paddingTop: Size4,
  },
  headerSpacer: {
    width: fontSize30,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  messagesContent: {
    padding: Size16,
    gap: Size22,
    paddingBottom: Size20 + Size40,
    flexGrow: 1,
  },
  storyStarterContainer: {
    alignItems: 'center',
    paddingVertical: Size20,
  },
  userImagesContainer: {
    flexDirection: 'row',
    paddingBottom: Size12,
    position: 'relative',
  },
  userImageWrapper: {
    borderRadius: Size20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  overlappingImage: {
    position: 'absolute',
    left: Size20 + Size8, // Positioning the second image to overlap
  },
  userImage: {
    width: Size40,
    height: Size40,
    borderRadius: Size20,
    backgroundColor: COLORS.grey,
  },
  storyStarterText: {
    fontSize: fontSize12,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  messageContainer: {
    gap: Size5,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeContainerEnd: {
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: fontSize12,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  receivedMessageBubble: {
    backgroundColor: COLORS.white,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderRadius: Size10,
    borderTopLeftRadius: Size4 / 2,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.borderLight3,
  },
  receivedMessageText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  sentMessageBubble: {
    backgroundColor: COLORS.recivedBackground,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderRadius: Size10,
    borderTopRightRadius: Size4 / 2,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  sentMessageText: {
    fontSize: fontSize14,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight2,
    gap: Size12,
    backgroundColor: COLORS.white,
    minHeight: Size40 + Size40,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    borderRadius: Size20,
    borderWidth: 1,
    borderColor: COLORS.violet,
    paddingHorizontal: Size16,
    paddingVertical: Size10,
    height: Size40 + Size12,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    textAlignVertical: 'top',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: Size40,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  sendButton: {
    backgroundColor: COLORS.transparent,
  },
  failedMessage: {
    color: COLORS.red,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: Size12,
  },
  dateHeaderBubble: {
    backgroundColor: COLORS.lightgrey,
    paddingHorizontal: Size12,
    paddingVertical: Size8,
    borderRadius: Size10,
    borderWidth: 1,
    borderColor: COLORS.borderLight3,
  },
  dateHeaderText: {
    fontSize: fontSize12,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_MEDIUM,
    textAlign: 'center',
  },
});
