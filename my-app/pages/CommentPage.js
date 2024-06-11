import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, FlatList } from 'react-native'
import { COMMENT_MUTATION } from '../request/mutation'
import { Feather } from '@expo/vector-icons'
import { GET_COMMENT } from '../request/query'

export default function CommentPage({ route }) {
    let { postId } = route.params
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)

    const { data, error, loading, refetch } = useQuery(GET_COMMENT, {
        variables: {
            postId
        }
    })

    useEffect(() => {
        if (data) {
            setComments(data.getPostById.Comments)
        }
    }, [data])

    const [sendComment] = useMutation(COMMENT_MUTATION, {
        onCompleted: async (data) => {
            setContent("")
            setIsSending(false)
            alert("Success comment")
        },
        onError: (err) => {
            setIsSending(false)
            alert(err.message)
        },
        refetchQueries: [{ query: GET_COMMENT, variables: { postId } }]
    })

    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList
                style={{ flexGrow: 1 }}
                data={comments}
                renderItem={({ item, index }) => (
                    <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Text style={{ fontSize: 18 }}>{item.username}: {item.content}</Text>
                    </View>
                )}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput
                    style={{ flex: 1, marginRight: 10, fontSize: 18 }}
                    placeholder="Add new comment"
                    value={content}
                    onChangeText={setContent}
                />
                <Feather
                    name="send"
                    size={24}
                    color="black"
                    onPress={() => {
                        if (content.trim() === '' || isSending) {
                            return
                        }
                        setIsSending(true)
                        sendComment({
                            variables: {
                                content,
                                postId
                            }
                        })
                    }}
                />
            </View>
        </View>
    )
}
