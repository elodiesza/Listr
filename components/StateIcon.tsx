import React from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StateIcon = ( { taskState} ) => {


    return (

        <MaterialCommunityIcons name={taskState===0 ? 'checkbox-blank-outline' : (
            taskState===1 ? 'checkbox-intermediate' : (
                taskState===2 ? 'checkbox-blank' :
                'arrow-right-bold-box-outline')
          )} size={35} />

    );
};

export default StateIcon;