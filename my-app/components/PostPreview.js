import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { FontAwesome6, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native"
import styles from "../globalStyle"
import { setIsLogin } from '../stores/auth/authSlice';
import * as SecureStore from "expo-secure-store"


export default function PostPreview({ post }) {
    const randomSave = Math.floor(Math.random() * 3000 + 1)
    const randomShare = Math.floor(Math.random() * 3000 + 1)
    const [isLike, setIsLike] = useState(false)
    const [isSave, setIsSave] = useState(false)
    const [isShare, setIsShare] = useState(false)
    const [isFollow, setIsFollow] = useState(false)
    const [saveCont, setSaveCount] = useState(randomSave)
    const [shareCont, setShareCount] = useState(randomShare)

    const navigation = useNavigation()

    const handleNavigate = (goTo) => {
        if (goTo === "comment") {
            navigation.navigate("CommentPage", { postId: post._id })
        } else {
            navigation.navigate("OtherProfile", {
                userId: post.Author._id
            })
        }
    }

    const handleSave = (value) => {
        setIsSave(!isSave)
        setSaveCount(saveCont + value)
    }

    const handleShare = (value) => {
        setIsShare(!isShare)
        setShareCount(shareCont + value)
    }


    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("access_token")
        alert("Success logout")
        setIsLogin(false)
    }

    return (
        <>
            <ImageBackground
                source={{ uri: post?.imgUrl?.includes("https") ? post.imgUrl : "https://images.pexels.com/photos/4029925/pexels-photo-4029925.jpeg" }}
                style={[styles.postItem]} >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={[StyleSheet.absoluteFillObject, styles.overlay]}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{post?.Author?.username || "heyyoo"}</Text>
                    <Text style={styles.content}>{post?.content || "yoloo"}</Text>
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.center}>
                        <Pressable onPress={handleNavigate} style={styles.profileButton}>
                        </Pressable>
                        {isFollow ? <MaterialCommunityIcons onPress={() => setIsFollow(false)} name="minus-circle" size={28} color="red" style={{ marginTop: -14, backgroundColor: "white", borderRadius: 30 }} /> : <MaterialIcons onPress={() => setIsFollow(true)} name="add-circle" size={28} color="red" style={{ marginTop: -14, backgroundColor: "white", borderRadius: 30 }} />}
                    </View>
                    <View style={[styles.center, { gap: 2 }]}>
                        {isLike ? (
                            <>
                                <AntDesign onPress={() => setIsLike(false)} name="heart" size={40} color="red" />
                            </>
                        ) : (
                            <AntDesign onPress={() => setIsLike(true)} name="heart" size={40} color="white" />
                        )}
                        <Text style={styles.count}>{post.Likes?.length || 0}</Text>
                    </View>
                    <Pressable style={[styles.center, { gap: 2 }]} onPress={() => handleNavigate("comment")}>
                        <FontAwesome name="commenting" size={40} color="white" />
                        <Text style={styles.count}>{post?.Comments?.length || 0}</Text>
                    </Pressable>
                    <View style={[styles.center, { gap: 2 }]}>
                        {isSave ? (
                            <FontAwesome onPress={() => handleSave(-1)} name="bookmark" size={40} color="yellow" />
                        ) : (
                            <FontAwesome onPress={() => handleSave(1)} name="bookmark" size={40} color="white" />
                        )}
                        <Text style={styles.count}>{saveCont}</Text>
                    </View>
                    <View style={[styles.center, { gap: 2 }]} >
                        {isShare ? <Ionicons name="arrow-redo" size={40} onPress={() => handleShare(-1)} color="white" /> : <Ionicons name="arrow-redo" size={40} onPress={() => handleShare(1)} color="white" />}
                        <Text style={styles.count}>{shareCont}</Text>
                    </View>
                    <Pressable onPress={handleLogout}>
                        <FontAwesome6 name="tiktok" size={32} color="white" style={{ backgroundColor: "#333", padding: 8, borderRadius: 5 }} />
                    </Pressable>
                </View>
            </ImageBackground>
        </>
    );
}