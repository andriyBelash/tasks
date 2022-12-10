import React from 'react'
import { useState } from "react";
import {
    Animated,
    AsyncStorage,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Image
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Tasks({ navigation, route }) {

    const { categoryName } = route.params;

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = React.useState(false)
    const [category, setCategory] = React.useState([])
    const [notes, setNotes] = useState([])

    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '/' + mm + '/' + yyyy;

    let assign = {
        id: notes.length + 1,
        label: name,
        description: description,
        time: formattedToday,
        category: categoryName,
    }
    const addNotes = async () => {
        if (name !== '') {
            const updateNotes = [...notes, assign]
            setNotes(updateNotes)
            setName('')
            setDescription('')
            await AsyncStorage.setItem('notes', JSON.stringify(updateNotes))
            setOpen(false)
        } else {
            alert('Введіть значення')
        }
    }
    const remove = async (id) => {
        let arr = notes.filter(function(item) {
            return item.id !== id
        })
        setNotes(arr);
        await AsyncStorage.setItem('notes', JSON.stringify(arr))
    };
    const findNotes = async () => {
        setLoading(true)
        try {
            const result = await AsyncStorage.getItem('notes')
            if (result !== null) setNotes(JSON.parse(result))
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false)
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

    React.useEffect(() => {
        findCategory()
        findNotes()
    }, [])

    const empty = () => {
        return (
            <View style={styles.emptyComponent}>
                <Image source={require('../assets/index.png')}/>
                <Text style={{color: 'rgba(255, 255, 255, 0.87)'}}>Натисніть + щоб додати нотатку</Text>
            </View>
        )
    }

    const ITEM_SIZE = 80 + 20 * 2 + 20

    const scrollY = React.useRef(new Animated.Value(0)).current

    return(
        <View style={styles.categories}>
            <View style={styles.top}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingBottom: 10,}}>
                    <Icon name='arrow-left-thin' size={35} color='white'/>
                </TouchableOpacity>
                <Text style={{color: 'white', fontSize: 20, paddingBottom: 20,}}>{categoryName}</Text>
            </View>
                <Animated.FlatList
                    data={notes}
                    contentContainerStyle={{paddingTop: 30, paddingBottom: 15}}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: true}
                    )}
                    renderItem={({item, index}) =>{
                        if(item.category === categoryName) {
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
                                    <TouchableOpacity style={{width: 80 + '%'}}>
                                        <Text style={{fontSize: 18, color: 'white'}}>{item.label}</Text>
                                        <Text style={{fontSize: 14, color: '#AFAFAF', marginTop: 5}}>{item.description}</Text>
                                        <Text style={{fontSize: 14, color: '#AFAFAF',  marginTop: 5}}>Створено: {item.time}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => remove(item.id)}>
                                        <Icon name='delete' size={30} color='white'/>
                                    </TouchableOpacity>
                                </Animated.View>
                            )
                        }
                    }}
                />
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
                        <Text style={{fontSize: 20, color: 'rgba(255, 255, 255, 0.87)'}}>Додати нотатку</Text>
                        <TextInput valey={name} onChangeText={name => setName(name)} placeholderTextColor="white" placeholder="Введіть назву..." style={[styles.input, {marginTop: 30}]}/>

                        <TextInput valey={description} onChangeText={description => setDescription(description)} placeholderTextColor="white" placeholder="Короткий опис..." style={[styles.input, {marginTop: 30}]}/>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => setOpen(false)} style={[styles.button]}>
                                <Text style={{color: "#8687E7", fontSize: 16}}>Відмінити</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={addNotes} style={[styles.button, {
                                backgroundColor: '#8687E7',
                                borderRadius: 4
                            }]}>
                                <Text style={{color: "#FFFFFF", fontSize: 16}}>Створити</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
            <View style={{justifyContent: "center", alignItems: "center", height: 100, borderTopColor: '#363636', borderWidth: 1}}>
                <TouchableOpacity onPress={() => setOpen(true)} style={styles.fixed}>
                    <View style={styles.line}>

                    </View>
                    <View style={styles.line1}>

                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    top: {
        height: 120,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomColor: '#363636',
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20
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
        height: 290,
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
        backgroundColor: '#363636',
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 5,
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