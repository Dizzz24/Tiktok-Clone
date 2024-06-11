import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from '../navigations/stackNavigation';
import BottomTabNavigation from '../navigations/tabNavigation';
import { AuthContext } from '../context/contextProvider';
import { useContext } from 'react';

export default function MainStack() {
    const { isLogin } = useContext(AuthContext)

    return (
        <NavigationContainer>
            {isLogin ?
                <BottomTabNavigation /> :
                <StackNavigator />}
        </NavigationContainer>
    )
}