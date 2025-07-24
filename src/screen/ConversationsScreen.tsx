import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ArrowIosBackSvg, SendIcon } from '../components/svg/SvgIcons2';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ASYNC_VARIBLES } from '../constants/data';
import { useSelector } from 'react-redux';
import { formatDateShort, imageUrl } from '../constants/functions';
import AppTextInput from '../components/AppTextInput';
import { io, Socket } from 'socket.io-client';

// Message type definitions
interface Message {
  id: number;
  type: 'story_starter' | 'received' | 'sent';
  message?: string;
  time?: string;
  date?: string;
  timestamp?: number;
  status?: 'sent' | 'sending' | 'failed';
}

// Initial story starter message
const INITIAL_STORY_STARTER: Message = {
  id: 1,
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
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const { messages } = useSelector((state: any) => state.entities.chatReducer);
  console.log('messages', messages);
  console.log('user:', user);
  console.log('userDetails:', userDetails);

  // Save chat messages to AsyncStorage
  const saveChatMessages = useCallback(async (messages: Message[]) => {
    try {
      await AsyncStorage.setItem(
        ASYNC_VARIBLES.CHAT_MESSAGES,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Add new message to chat
  const addMessage = useCallback(
    (message: Omit<Message, 'id' | 'timestamp'>) => {
      const newMessage: Message = {
        ...message,
        id: Date.now(), // Use timestamp as unique ID
        timestamp: Date.now(),
      };

      setChatData(currentChatData => {
        const updatedMessages = [...currentChatData, newMessage];
        saveChatMessages(updatedMessages);
        scrollToBottom(); // Auto-scroll when new message is added
        return updatedMessages;
      });
    },
    [saveChatMessages, scrollToBottom],
  );

  // Initialize socket connection with fallback URLs
  const initializeSocket = useCallback(
    (attempt: number = 0) => {
      const serverUrls = [
        'https://api.tribalshaadi.co.in',
        'http://api.tribalshaadi.co.in',
        'https://api.tribalshaadi.co.in:4000',
        'http://api.tribalshaadi.co.in:4000',
      ];

      if (attempt >= serverUrls.length) {
        console.error('❌ All connection attempts failed');

        return;
      }

      const SERVER_URL = serverUrls[attempt];
      console.log(`🔄 Connection attempt ${attempt + 1}: ${SERVER_URL}`);

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
        console.log('🟢 Connected to socket server');
        console.log('Socket ID:', socket.current?.id);
        console.log('Transport:', socket.current?.io?.engine?.transport?.name);
        console.log('Server URL:', SERVER_URL);

        if (user?.id) {
          console.log(`📝 Registering user ${user.id}...`);
          socket.current?.emit('register', user.id);
        } else {
          console.error('❌ No user ID found for registration');
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

      // Handle registration confirmation from server
      socket.current.on('registration_confirmed', ({ userId, socketId }) => {
        console.log(
          `✅ Registration confirmed for user ${userId} with socket ${socketId}`,
        );
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
        console.log('📨 Received message:', { from, content, timestamp });
        console.log('Expected from userDetails.friendId:', userDetails?.friendId);

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

      socket.current.on('message_sent', ({ to, content, timestamp }) => {
        console.log('✅ Message sent confirmation:', {
          to,
          content,
          timestamp,
        });

        setChatData(currentChatData =>
          currentChatData.map(msg =>
            msg.message === content && msg.status === 'sending'
              ? { ...msg, status: 'sent', time: getCurrentTime() }
              : msg,
          ),
        );
        scrollToBottom(); // Auto-scroll when message status updates
      });

      socket.current.on('error_message', error => {
        console.error('❌ Socket Error:', error);

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

      // Handle server pings for connection health
      socket.current.on('pong', () => {
        console.log('🏓 Received pong from server');
      });

      // Send periodic pings to test connection
      const pingInterval = setInterval(() => {
        if (socket.current?.connected) {
          socket.current.emit('ping');
        }
      }, 30000); // Ping every 30 seconds

      // Store interval reference for cleanup
      pingIntervalRef.current = pingInterval;
    },
    [user?.id, userDetails?.friendId, addMessage, scrollToBottom],
  );

  // Load messages on component mount
  useEffect(() => {
    initializeSocket(0);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (socket.current) {
        socket.current.removeAllListeners();
        socket.current.disconnect();
      }
      // Clear ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [initializeSocket]);

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
        from: user.id,
        to: userDetails.friendId,
        content,
      });

      addMessage({
        type: 'sent',
        message: content,
        time: 'sending...',
        status: 'sending',
      });

      socket.current?.emit('send_message', {
        from: String(user.id), // Ensure it's a string
        to: String(userDetails.friendId), // Ensure it's a string
        content,
      });

      setMessageText('');
      scrollToBottom(); // Auto-scroll immediately after sending
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
        <View key={item.id} style={styles.storyStarterContainer}>
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

    if (item.type === 'received') {
      return (
        <View key={item.id} style={styles.messageContainer}>
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
        <View key={item.id} style={styles.messageContainer}>
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
                item.status === 'failed' && { color: COLORS.red },
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

  return (
    <AppSafeView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : Size20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
            {/* <AppText
              text={
                connectionStatus === 'connected' ? 'Online' :
                connectionStatus === 'connecting' ? 'Connecting...' :
                connectionStatus === 'disconnected' ? 'Reconnecting...' :
                'Connection failed'
              }
              textStyle={[
                styles.connectionStatus,
                { color: connectionStatus === 'connected' ? COLORS.violet : COLORS.textSecondary }
              ]}
            /> */}
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
              onChangeText={setMessageText}
              multiline
              maxLength={500}
              keyboardType="default"
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
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  connectionStatus: {
    fontSize: fontSize12,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    paddingTop: Size4,
  },
  headerSpacer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  messagesContent: {
    padding: Size16,
    gap: Size22,
    paddingBottom: Size20,
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
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  messageContainer: {
    gap: Size5,
  },
  timeContainer: {
    alignItems: 'flex-start',
  },
  timeContainerEnd: {
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: fontSize12,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  receivedMessageBubble: {
    backgroundColor: COLORS.recivedBackground,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderRadius: Size10,
    borderTopRightRadius: Size4 / 2,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  receivedMessageText: {
    fontSize: fontSize14,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  sentMessageBubble: {
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
  sentMessageText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight2,
    gap: Size12,
    backgroundColor: COLORS.white,
    minHeight: Size40 + Size12 * 2,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    borderRadius: Size20,
    borderWidth: 1,
    borderColor: COLORS.violet,
    paddingHorizontal: Size16,
    paddingVertical: Size10,
    minHeight: Size40,
    maxHeight: Size40 * 3,
  },
  textInput: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    textAlignVertical: 'top',
    minHeight: Size20,
    maxHeight: fontSize14 * 1.4 * 4, // Approximately 4 lines
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  sendButton: {
    backgroundColor: COLORS.transparent,
    paddingBottom: Size4,
  },
});
