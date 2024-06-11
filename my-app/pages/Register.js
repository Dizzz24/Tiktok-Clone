import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../globalStyle';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../request/mutation';
import { ActivityIndicator } from 'react-native-paper';

export default function Register() {
    const navigation = useNavigation()

    const [input, setInput] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    const [handleRegist, { data = [], loading, error }] = useMutation(REGISTER_MUTATION, {
        onCompleted: async (data) => {
            console.log(data)
            alert("success register")
            navigation.navigate("Login")
        },
        onError: (err) => {
            alert(err.message)
        }
    })


    const [typedText, setTypedText] = useState('');
    const [animationComplete, setAnimationComplete] = useState(false);

    const handleSubmit = () => {
        console.log(input, "nihhhh")
        handleRegist({
            variables: {
                input
            }
        })
    }

    useEffect(() => {
        const words = "Create new account for explore more!";

        let index = 0;

        const intervalId = setInterval(() => {
            setTypedText(words.slice(0, index + 1));
            index++;
            if (index === words.length) {
                return
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
                        <Text style={{ color: '#075eec' }}>Register Page</Text>
                    </Text>

                    <Text style={[styles.subtitle, { fontSize: 35 }]}>
                        {typedText}
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Name</Text>

                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={name => setInput({ ...input, name })}
                            placeholder="Enter name"
                            placeholderTextColor="#6b7280"
                            style={[styles.inputControl, { height: 72 }]}
                            value={input.name} />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Username</Text>

                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={username => setInput({ ...input, username })}
                            placeholder="Enter username"
                            placeholderTextColor="#6b7280"
                            style={[styles.inputControl, { height: 72 }]}
                            value={input.username} />
                    </View>

                    <View style={styles.input}>
                        <Text style={styles.inputLabel}>Email</Text>

                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={email => setInput({ ...input, email })}
                            placeholder="Enter email"
                            placeholderTextColor="#6b7280"
                            style={[styles.inputControl, { height: 72 }]}
                            value={input.email} />
                    </View>

                    <View style={styles.formInput}>
                        <Text style={styles.inputLabel}>Password</Text>

                        <TextInput
                            autoCorrect={false}
                            onChangeText={password => setInput({ ...input, password })}
                            placeholder="********"
                            placeholderTextColor="#6b7280"
                            style={[styles.inputControl, { height: 72 }]}
                            secureTextEntry={true}
                            value={input.password} />
                    </View>

                    <View
                        style={styles.formFooterContainer}>
                        <Text style={styles.formFooter}>
                            Already have account?{' '}
                            <Text onPress={() => navigation.navigate("Login")} style={{ textDecorationLine: 'underline', color: "#075eec" }}>Sign in</Text>
                        </Text>
                    </View>

                    <View style={styles.formAction}>
                        <TouchableOpacity
                            onPress={handleSubmit}>
                            <View style={[styles.btn, { height: 72 }]}>
                                <Text style={styles.btnText}>Sign up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.formLink}>Forgot password?</Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}