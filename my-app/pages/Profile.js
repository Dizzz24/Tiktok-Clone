import { View, Text, Pressable, StatusBar, FlatList, ActivityIndicator } from 'react-native'
import { Avatar } from 'react-native-paper'
import { Feather, Ionicons, AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons'
import { useContext, useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import PostCard from '../components/PostCard'
import styles from "../globalStyle"
import { buttonStyles } from "../globalStyle"
import { AuthContext } from '../context/contextProvider'
import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery } from '@apollo/client'
import { GET_USER_BY_ID } from '../request/query'
import { FOLLOW_MUTATION } from '../request/mutation'

export default function Profile({ route }) {
    const userId = route.params?.userId
    const routerName = route.name
    const navigation = useNavigation()
    const [user, setUser] = useState({})
    const { setIsLogin } = useContext(AuthContext)
    const [isFollow, setIsFollow] = useState(false)

    console.log(user, "nihh")

    const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
        onCompleted: async (data) => {
            setUser(data.getUserById)
        },
        onError: async (err) => {
            await SecureStore.deleteItemAsync("access_token")
            alert(err.message)
        },
        variables: {
            userId: userId || "662f784fa11c891f75a3f089"
        }
    })

    const [handleMutation] = useMutation(FOLLOW_MUTATION, {
        onCompleted: (data) => {
            alert(data.followUser.message)
            data.followUser.message === "Success follow user" ? setIsFollow(true) : setIsFollow(false)
        },
        onError: (error) => {
            alert(error)
        },
        refetchQueries: [{ query: GET_USER_BY_ID, variables: { "followingId": user._id } }]
    })

    const handleFollow = () => {
        handleMutation({
            variables: {
                "followingId": user._id
            }
        })
    }

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("access_token")
        alert("Success logout")
        setIsLogin(false)
    }

    useEffect(() => {
        // user.find(el => {
        //     el.followers === 
        // })
        if (data) {
            setUser(data.getUserById)
        }
    }, [data])


    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 10)

        return () => clearInterval(interval)
    }, [])

    const dumy = ["a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d", "a", "s", "d"]

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" style={styles.loading} />
            ) : (
                <>
                    <StatusBar translucenxt={true} backgroundColor="black" />
                    <View style={styles.navContainer}>
                        <View style={{ width: 60 }}>
                            {routerName === "ProfileMe" ? (
                                <MaterialIcons onPress={handleLogout} name="logout" size={24} color="black" />
                            ) : (
                                <AntDesign onPress={() => navigation.goBack()} name="arrowleft" size={24} color="black" />
                            )}
                        </View>
                        <View>
                            <Text style={styles.navText}>{user?.name || "Thats You!"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            {routerName === "ProfileMe" ? (
                                <>
                                    <Ionicons name="footsteps-outline" size={20} color="black" style={{ transform: [{ scaleX: -1 }] }} />
                                    <Feather name="menu" size={24} />
                                </>
                            ) : (
                                <>
                                    <Octicons name="bell" size={20} color="black" />
                                    <Ionicons name="arrow-redo-outline" size={24} color="black" />
                                </>
                            )}
                        </View>
                    </View>

                    <View style={styles.profilecontainer}>
                        <Avatar.Icon size={95} icon={"account"} />
                        <Text style={styles.name}>@{user?.username || "Yourself"}</Text>
                        <View style={styles.counterContainer}>
                            <View style={styles.counterItemContainer}>
                                <Text style={styles.counterNumberText}>{user?.following?.length}</Text>
                                <Text style={styles.counterLabelText}>Following</Text>
                            </View>
                            <View style={styles.counterItemContainer}>
                                <Text style={styles.counterNumberText}>{user?.followers?.length}</Text>
                                <Text style={styles.counterLabelText}>Followers</Text>
                            </View>
                            <View style={styles.counterItemContainer}>
                                <Text style={styles.counterNumberText}>{user?.Posts?.Likes?.length || "5.7M"}</Text>
                                <Text style={styles.counterLabelText}>Likes</Text>
                            </View>
                        </View>
                        <View style={[styles.center, { flexDirection: "row" }]}>
                            {routerName === "Profile" ? (
                                <>
                                    <Pressable
                                        style={buttonStyles.grayOutlinedButton}
                                        onPress={() => console.log("Edit Profile")}
                                    >
                                        <Text style={buttonStyles.grayOutlinedButtonText}>Edit Profile</Text>
                                    </Pressable>
                                    <Pressable
                                        style={buttonStyles.grayOutlinedButton}
                                        onPress={() => console.log("Add Friend")}
                                    >
                                        <Text style={buttonStyles.grayOutlinedButtonText}>Add Friend</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    {isFollow ? (
                                        <View style={[styles.center, { flexDirection: "row", gap: 3 }]}>
                                            <Pressable
                                                style={buttonStyles.grayOutlinedButton}
                                                onPress={() => console.log("Send a 👋")}
                                            >
                                                <Text style={buttonStyles.grayOutlinedButtonText}>Send a 👋</Text>
                                            </Pressable>
                                            <Feather
                                                onPress={handleFollow}
                                                name="user-check"
                                                style={buttonStyles.unfollowBtn}
                                                size={16}
                                                color="black"
                                            />
                                        </View>
                                    ) : (
                                        <Pressable
                                            style={buttonStyles.filledButton}
                                            onPress={handleFollow}
                                        >
                                            <Text style={buttonStyles.filledButtonText}>Follow</Text>
                                        </Pressable>
                                    )}
                                </>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={user?.Posts || dumy}
                        renderItem={({ item, index }) => <PostCard post={item} key={index} />}
                        numColumns={3}
                    />
                </>
            )}
        </>
    )
}
