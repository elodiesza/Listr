import React from 'react'
import { Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart'
import {colors} from '../styles';


const PieChartView = ({ series, pieWidth, color }) => {
 

  return (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center', margin:10}}>
          <PieChart
            widthAndHeight={pieWidth}
            series={series}
            sliceColor={[colors.primary.gray,color]}
            coverRadius={0.70}
            coverFill={colors.primary.white}
          />
        </View>
  );
};
export default PieChartView;

