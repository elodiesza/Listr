import React from 'react';
import { View, Text } from 'react-native';

const IsLoading = ({isLoading}) => {


    return (
        <View style={{backgroundColor:'lightgray', marginLeft:50,display: isLoading? 'flex':'none', position: 'absolute', width: 300, height:200, marginTop: 300, alignContent:'center', justifyContent:'center'}}>
            <Text style={{textAlign:'center'}}> Is Loading...</Text>
        </View>
    )


};

export default IsLoading;
