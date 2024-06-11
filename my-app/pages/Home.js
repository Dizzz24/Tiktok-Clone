import React, { useEffect } from 'react'
import { FlatList, View, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import PostPreview from '../components/PostPreview'
import styles from '../globalStyle'
import { useQuery } from '@apollo/client'
import { GET_POSTS } from '../request/query'
import { useDispatch, useSelector } from 'react-redux'
import { setError, setPosts } from '../stores/posts/postSlice'


const { height } = Dimensions.get("window") 

export default function Home() {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.data.posts)
    const { loading, error, refetch } = useQuery(GET_POSTS, {
        onCompleted: async (data) => {
            dispatch(setPosts(data.getPosts))
        },
        onError: (err) => {
            alert(err.message)
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetch()
            } catch (error) {
                console.error('Error fetching data: ', error)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <StatusBar translucenxt={true} backgroundColor="black" />
            <View style={styles.postContainer}>
                {loading ? <ActivityIndicator size="large" style={styles.loading} /> :
                    <FlatList
                        data={posts}
                        renderItem={({ item, index }) => <PostPreview post={item} key={index} />}
                        snapToInterval={height}
                        decelerationRate="fast"
                        pagingEnabled={true}
                        showsVerticalScrollIndicator={false}
                    />}
            </View>
        </>
    )
}