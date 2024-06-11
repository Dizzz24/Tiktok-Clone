import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import AddPost from "../pages/AddPost";
import PostPreview from "../components/PostPreview";
import CommentPage from "../pages/CommentPage";
import SearchUserPage from "../pages/searchPage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Posts" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="OtherProfile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="PostPreview" component={PostPreview} />
        <Stack.Screen name="CommentPage" component={CommentPage} />
        <Stack.Screen name="SearchPage" component={SearchUserPage} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="ProfileMe"
            component={Profile}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="PostPreview"
            component={PostPreview}
        />
    </Stack.Navigator>
);

export default function BottomTabNavigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Post"
                component={AddPost}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="add-to-queue" size={32} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}
