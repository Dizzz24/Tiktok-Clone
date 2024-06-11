import { useContext, useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import * as SecureStore from "expo-secure-store"

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../globalStyle';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../request/mutation';
import { AuthContext } from '../context/contextProvider';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '../stores/auth/authSlice';

export default function Login() {
    const { setIsLogin } = useContext(AuthContext)
    const dispatch = useDispatch()
    const [handleLogin, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: async (data) => {
            await SecureStore.setItemAsync("access_token", data.login.access_token)
            setIsLogin(true)
            alert("Success Login")
        },
        onError: (err) => {
            alert(err.message)
        }
    })

    const [input, setInput] = useState({
        username: '',
        password: '',
    });

    const navigation = useNavigation()

    const [typedText, setTypedText] = useState('');
    const [animationComplete, setAnimationComplete] = useState(false);

    const handleSubmit = () => {
        handleLogin({
            variables: {
                input
            }
        })
    }

    useEffect(() => {
        const words = "Welcome back to TICK TOCK!";

        let index = 0;

        const intervalId = setInterval(() => {
            setTypedText(words.slice(0, index + 1));
            index++;
            if (index === words.length) {
                setTimeout(() => {
                    index = 0
                }, 2000);
            };
        }, 120);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (animationComplete) {
            setTypedText('');
            setAnimationComplete(false);
        }
    }, [animationComplete]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading && <ActivityIndicator size="large" style={styles.loading} />}
                <View style={styles.header}>
                    <Text style={styles.titleForm}>
                        <Text style={{ color: '#075eec' }}>Login Page</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        {typedText}
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Username</Text>

                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={username => setInput({ ...input, username })}
                            placeholder="Your username"
                            placeholderTextColor="#6b7280"
                            style={styles.inputControl}
                            value={input.username} />
                    </View>

                    <View style={styles.formInput}>
                        <Text style={styles.inputLabel}>Password</Text>

                        <TextInput
                            autoCorrect={false}
                            onChangeText={password => setInput({ ...input, password })}
                            placeholder="********"
                            placeholderTextColor="#6b7280"
                            style={styles.inputControl}
                            secureTextEntry={true}
                            value={input.password} />
                    </View>

                    <View
                        style={styles.formFooterContainer}>
                        <Text style={styles.formFooter}>
                            Don't have an account?{' '}
                            <Text onPress={() => navigation.navigate("Register")} style={{ textDecorationLine: 'underline', color: "#075eec" }}>Sign up</Text>
                        </Text>
                    </View>

                    <View style={styles.formAction}>
                        <TouchableOpacity
                            onPress={handleSubmit}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>Sign in</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.formLink}>Forgot password?</Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}