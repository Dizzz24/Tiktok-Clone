import { useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import { useMutation } from '@apollo/client'
import { ADDPOST_MUTATION } from '../request/mutation'
import { ActivityIndicator } from 'react-native-paper'
import styles from '../globalStyle'
import { useNavigation } from '@react-navigation/native'

export default function AddPost() {
    const navigation = useNavigation()
    const [addPost, { loading }] = useMutation(ADDPOST_MUTATION, {
        onCompleted: async (data) => {
            alert("Success add data")
            setInput({ content: '', tags: [], imgUrl: '' })
            navigation.navigate("Home")
        },
        onError: (err) => {
            alert(err.message)
        }
    })

    const [input, setInput] = useState({
        content: '',
        tags: [],
        imgUrl: '',
    })

    const handleSubmit = () => {
        addPost({
            variables: {
                input
            }
        })
    }

    const handleChangeTags = (tags) => {
        const tagArray = tags.split(' ').filter(tag => tag.trim() !== '')
        setInput({ ...input, tags: tagArray })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.form} behavior="padding">
                {loading && <ActivityIndicator size="large" style={styles.loading} />}
                <Text style={[styles.titleForm, { textAlign: "center" }]}>Add Post</Text>
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>Content</Text>
                    <TextInput
                        multiline
                        onChangeText={content => setInput({ ...input, content: content })}
                        placeholder="Enter your post content"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={input.content} />
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>Tags</Text>
                    <TextInput
                        onChangeText={handleChangeTags}
                        placeholder="Enter tags"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={input.tags.join(' ')} // Join tags array with space
                    />
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>Image URL</Text>
                    <TextInput
                        onChangeText={imgUrl => setInput({ ...input, imgUrl: imgUrl })}
                        placeholder="Enter image URL"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={input.imgUrl} />
                </View>
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={[styles.btn, { marginTop: 15 }]}>
                        <Text style={styles.btnText}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
