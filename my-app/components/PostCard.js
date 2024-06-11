import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Image, Pressable, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import styles from "../globalStyle"


export default function PostCard({ post }) {
    const navigation = useNavigation()
    const randomView = Math.floor(Math.random() * 500 + 1)

    const handleNavigate = () => {
        navigation.navigate("PostPreview")
        console.log("masukkk")
    }

    return (
        <>
            <Pressable onPress={handleNavigate} style={styles.previewCard}>
                <Image source={{ uri: post?.imgUrl?.includes("https") ? post.imgUrl : "https://images.pexels.com/photos/4029925/pexels-photo-4029925.jpeg" }} width={190} height={300} />
            </Pressable>
        </>
    )
}