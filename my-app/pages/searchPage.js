import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { GETUSER_BY_NAME_UNAME } from '../request/query';

export default function SearchUserPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, error, data } = useQuery(GETUSER_BY_NAME_UNAME, {
        variables: { nameOrUname: searchQuery },
        skip: searchQuery === '',
    });

    const handleSearch = () => {
        
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
                placeholder="Search user..."
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Search</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
            {error ? <Text style={{ marginTop: 20, color: 'red' }}>Error: {error.message}</Text> : null}
            {data && data.getUserByNameOrUname ? (
                <FlatList
                    data={[data.getUserByNameOrUname]}
                    renderItem={({ item }) => (
                        <View style={{ marginTop: 10 }}>
                            <Text>{item.name}</Text>
                            <Text>{item.username}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <Text style={{ marginTop: 20 }}>User not found.</Text>
            )}
        </View>
    );
}