import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
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
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ArrowIosBackSvg, SendIcon } from '../components/svg/SvgIcons2';
import { useNavigation } from '@react-navigation/native';
import { ASYNC_VARIBLES } from '../constants/data';
import { useSelector } from 'react-redux';
import { imageUrl } from '../constants/functions';
import AppTextInput from '../components/AppTextInput';

// Message type definitions
interface Message {
  id: number;
  type: 'story_starter' | 'received' | 'sent';
  message?: string;
  time?: string;
  date?: string;
  timestamp?: number;
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
  const [_loading, setLoading] = useState(true);
  const { user } = useSelector((state: any) => state.entities.authReducer);
  // Load chat messages from AsyncStorage
  const loadChatMessages = useCallback(async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(
        ASYNC_VARIBLES.CHAT_MESSAGES,
      );
      if (savedMessages) {
        const parsedMessages: Message[] = JSON.parse(savedMessages);
        setChatData(parsedMessages);
      } else {
        // If no saved messages, initialize with story starter
        setChatData([INITIAL_STORY_STARTER]);
        await saveChatMessages([INITIAL_STORY_STARTER]);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      setChatData([INITIAL_STORY_STARTER]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save chat messages to AsyncStorage
  const saveChatMessages = async (messages: Message[]) => {
    try {
      await AsyncStorage.setItem(
        ASYNC_VARIBLES.CHAT_MESSAGES,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    loadChatMessages();
  }, [loadChatMessages]);

  // Generate current time string
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Add new message to chat
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(), // Use timestamp as unique ID
      timestamp: Date.now(),
    };

    const updatedMessages = [...chatData, newMessage];
    setChatData(updatedMessages);
    await saveChatMessages(updatedMessages);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        await addMessage({
          type: 'sent',
          message: messageText.trim(),
          time: getCurrentTime(),
        });
        setMessageText('');

        setTimeout(async () => {
          await addMessage({
            type: 'received',
            message:
              'Hi, glad to match with you! Let\'s take this forward in a good way.',
            time: getCurrentTime(),
          });
        }, 2000);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Utility functions for future use:
  // const addReceivedMessage = async (message: string) => {
  //   await addMessage({
  //     type: 'received',
  //     message,
  //     time: getCurrentTime(),
  //   })
  // }

//   const clearChatHistory = async () => {
//     const initialData = [INITIAL_STORY_STARTER];
//     setChatData(initialData);
//     await saveChatMessages(initialData);
//   };

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
              <View
                style={[styles.userImage, { backgroundColor: COLORS.primary }]}
              />
            </View>
          </View>
          <AppText
            text={`Your story started on\n${item.date}`}
            textStyle={styles.storyStarterText}
          />
        </View>
      );
    }

    if (item.type === 'received') {
      return (
        <View key={item.id} style={styles.messageContainer}>
          <View style={{ alignSelf: 'flex-end' }}>
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
            <AppText text={item.time} textStyle={styles.timeText} />
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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowIosBackSvg
              width={Size22}
              height={Size22}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <AppText text="User A" textStyle={styles.headerTitle} />
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight2,
    gap: Size12,
  },
  backButton: {
    padding: Size4,
  },
  headerTitle: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  headerSpacer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Size16,
    gap: Size22,
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
    alignItems: 'center',
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight2,
    gap: Size12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    borderRadius: Size20,
    borderWidth: 1,
    borderColor: COLORS.violet,
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    minHeight: Size40,
  },
  textInput: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    textAlignVertical: 'top',
    minHeight: Size16,
    maxHeight: fontSize14 * 1.4 * 3, // Approximately 3 lines (fontSize * lineHeight * lines)
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  sendButton: {
    backgroundColor: COLORS.transparent,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
