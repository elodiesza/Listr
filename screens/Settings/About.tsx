import { View, ScrollView, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';


const About = () => {
    const navigation = useNavigation();

    const onAboutPressed =()=> {navigation.dispatch(CommonActions.goBack())};

    return (
        

        <View>
            <Text> This is Account page</Text>
            <TouchableOpacity onPress={onAboutPressed} >
                <Text> Press </Text>
            </TouchableOpacity>
        
        </View>

    );
};
    
export default About;