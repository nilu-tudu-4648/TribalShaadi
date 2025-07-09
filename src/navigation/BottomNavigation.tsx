import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import AccountScreen from '../screen/AccountScreen';
import ChatScreen from '../screen/ChatScreen';
import InterestScreen from '../screen/InterestScreen';
import { HomeIcon, HeartIcon, ChatIcon, AccountIcon } from '../components/svg/SvgIcons';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#A385E0';
const INACTIVE_COLOR = '#000';

const getTabBarIcon = (route: any, focused: boolean) => {
  const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
  switch (route.name) {
    case 'Home':
      return <HomeIcon color={iconColor} width={28} height={28} />;
    case 'Interests':
      return <HeartIcon color={iconColor} width={28} height={28} />;
    case 'Chat':
      return <ChatIcon color={iconColor} width={28} height={28} />;
    case 'Account':
      return <AccountIcon color={iconColor} width={28} height={28} />;
    default:
      return null;
  }
};

function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color: _color, size: _size }) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { height: 70, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Interests" component={InterestScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default BottomNavigation;