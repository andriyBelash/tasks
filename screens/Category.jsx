import React from 'react'
import { useState } from "react";
import {
    StyleSheet,
    Modal,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Pressable,
    ScrollView,
    AsyncStorage,
    FlatList,
    Animated,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Category({navigation, route}) {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = React.useState(false)
    const [category, setCategory] = React.useState([])

    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '/' + mm + '/' + yyyy;

    let assign = {
        id: category.length + 1,
        label: name,
        value: name.toLowerCase()
    }

    const addCategory = async () => {
        if (name !== '') {
            const updateCategory = [...category, assign]
            setCategory(updateCategory)
            setName('')
            await AsyncStorage.setItem('category', JSON.stringify(updateCategory))
            setOpen(false)
        } else {
            alert('Введіть значення')
        }

    }
    const findCategory = async () => {
        setLoading(true)
        try {
            const result = await AsyncStorage.getItem('category')
            if (result !== null) setCategory(JSON.parse(result))
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false)
        }

    }

    const remove = async (id) => {
        let arr = category.filter(function(item) {
            return item.id !== id
        })
        setCategory(arr);
        await AsyncStorage.setItem('category', JSON.stringify(arr))
    };

    React.useEffect(() => {
        findCategory()
    }, [])




    const empty = () => {
        return (
            <View style={styles.emptyComponent}>
                <Image source={require('../assets/index.png')}/>
                <Text style={{color: 'rgba(255, 255, 255, 0.87)'}}>Натисніть + щоб додати категорію</Text>
            </View>
        )
    }



    const ITEM_SIZE = 50 + 20 * 2 + 20

    const scrollY = React.useRef(new Animated.Value(0)).current

    return(
        <View style={styles.categories}>
            <View style={styles.top}>
                <Text style={{color: 'white', fontSize: 20, paddingBottom: 20,}}>Tasks</Text>
            </View>
            <Animated.FlatList
                data={category}
                ListEmptyComponent={empty}
                contentContainerStyle={{paddingTop: 30, paddingBottom: 15}}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: true}
                )}
                renderItem={({item, index}) => {
                    const scale = scrollY.interpolate({
                        inputRange: [
                            -1, 0,
                            ITEM_SIZE * index,
                            ITEM_SIZE * (index + 2),
                        ],
                        outputRange: [1,1,1,0]
                    })
                    return (
                        <Animated.View style={[styles.item, {transform:[{scale: scale}]}]}>
                            <TouchableOpacity
                                onPress={() => {
                                    /* 1. Navigate to the Details route with params */
                                    navigation.navigate('Tasks', {
                                        categoryName: item.label
                                    });
                                }}
                                style={{width: 80 + '%'}}>
                                <Text style={{fontSize: 18, color: 'white'}}>{item.label}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => remove(item.id)} >
                                <Icon name='delete-outline' size={35} color='white'/>
                            </TouchableOpacity>
                        </Animated.View>
                        )
                }}
            />
            <View style={{justifyContent: "center", alignItems: "center", height: 100, borderTopColor: '#363636', borderWidth: 1}}>
                <TouchableOpacity onPress={() => setOpen(true)} style={styles.fixed}>
                    <View style={styles.line}>

                    </View>
                    <View style={styles.line1}>

                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={open}
                onRequestClose={() => {
                    setOpen(false);
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <Text style={{fontSize: 20, color: 'rgba(255, 255, 255, 0.87)'}}>Додати категорію</Text>
                        <TextInput valey={name} onChangeText={name => setName(name)} placeholderTextColor="white" placeholder="Введіть назву..." style={[styles.input, {marginTop: 30}]}/>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => setOpen(false)} style={[styles.button]}>
                                <Text style={{color: "#8687E7", fontSize: 16}}>Відмінити</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addCategory} style={[styles.button, {
                                backgroundColor: '#8687E7',
                                borderRadius: 4
                            }]}>
                                <Text style={{color: "#FFFFFF", fontSize: 16}}>Створити</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        height: 120,
        borderWidth: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomColor: '#363636',
    },
    categories: {
        height: 100 + '%',
        backgroundColor: 'black',
        position: 'relative',
    },
    fixed: {
        width: 64,
        height: 64,
        borderRadius: 50,
        backgroundColor: '#3f4c6b',
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        // bottom: 50,
        // right: 20,


    },
    line: {
        height: 2,
        width: 18,
        backgroundColor: '#FFFFFF'
    },
    line1: {
        width: 2,
        height: 18,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
    },
    container: {
        paddingTop: 30,
        paddingBottom: 0,
    },
    modal: {
        width: 100 + '%',
        height: 100 + '%',
        backgroundColor: '#000000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    modalContainer: {
        width: 90 + '%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 220,
        backgroundColor: '#363636',
        borderRadius: 16,
        padding: 20,
    },
    input: {
        width: 100 + "%",
        height: 43,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.87)',
        color: 'rgba(255, 255, 255, 0.87)',
        paddingLeft: 20,
        paddingRight: 20,
    },
    buttons: {
        width: 100 + '%',
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: 154,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        width: 90 + '%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        backgroundColor: '#3f4c6b',
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center'
    },
    emptyComponent: {
        height: 100 + '%',
        marginTop: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
})