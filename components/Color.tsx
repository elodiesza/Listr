import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Color = ( color ) => {
    
    return (
        <View style={[styles.color, {backgroundColor: color.color}]}/>
    );
};

const styles = StyleSheet.create({
    color: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'lightgray',
        margin: 5,
    },
});

export default Color;