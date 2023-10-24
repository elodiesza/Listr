import { View, ScrollView, SafeAreaView, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import React from 'react';
import SettingsTitle from '../../components/SettingsTitle';
import { container } from '../../styles';

const About = () => {
    const navigation = useNavigation();

    const onAboutPressed =()=> {navigation.dispatch(CommonActions.goBack())};

    return (
        

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onAboutPressed}title={'ABOUT'}/>
            <View style={container.body}>
                <Text> This is About page</Text>
            </View>
            
        
        </SafeAreaView>

    );
};
    
export default About;