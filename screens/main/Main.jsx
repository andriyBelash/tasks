import React, {useState} from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Category from '../Category';
import Tasks from "../Tasks";

const Stack = createNativeStackNavigator();


export default function App() {

    return (
        <Stack.Navigator initialRouteName="Category">
            <Stack.Screen name="Category" options={{headerShown: false, animation: 'none'}} component={Category} />
            <Stack.Screen name="Tasks" options={{headerShown: false, animation: 'none'}} component={Tasks} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
