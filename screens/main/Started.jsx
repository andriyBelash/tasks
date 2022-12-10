import React from 'react'
import {useState} from 'react'
import {StyleSheet, Animated, Text, View, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import {StatusBar} from "expo-status-bar";


const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

export default function Started({navigation}) {

    const scale = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }, [])

    const [hidden, setHidden] = useState(false);
    const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
    const [statusBarTransition, setStatusBarTransition] = useState(TRANSITIONS[0]);

    const changeStatusBarVisibility = () => setHidden(!hidden);

    const changeStatusBarStyle = () => {
        const styleId = STYLES.indexOf(statusBarStyle) + 1;
        if (styleId === STYLES.length) {
            setStatusBarStyle(STYLES[0]);
        } else {
            setStatusBarStyle(STYLES[styleId]);
        }
    };

    const changeStatusBarTransition = () => {
        const transition = TRANSITIONS.indexOf(statusBarTransition) + 1;
        if (transition === TRANSITIONS.length) {
            setStatusBarTransition(TRANSITIONS[0]);
        } else {
            setStatusBarTransition(TRANSITIONS[transition]);
        }
    };

    return(
        <View style={{height: 100 + '%', backgroundColor: 'black', justifyContent:'center',alignItems:'center'}}>
            <StatusBar
            animated={true}
            backgroundColor="#000000"
            barStyle={statusBarStyle}
            showHideTransition={statusBarTransition}
            hidden={hidden} />
            <Animated.Image style={{marginTop: 150, transform: [{scale: scale}]}} source={require('../../assets/image.png')}/>
            <Text style={{fontSize: 28, color: 'rgba(255, 255, 255, 0.87)', marginTop: 50}}>Організуйте свої завдання</Text>
            <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.87)', marginTop: 50, textAlign: 'center'}}>Ви можете організувати свої щоденні завдання, додавши їх в окремі категорії</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
                <Text style={{color: "#FFFFFF", fontSize: 16}}>Розпочати</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        backgroundColor: '#8875FF',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 90 + '%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 50
    }
})

