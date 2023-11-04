import React, { useEffect, useState } from 'react';
import { ImageBackground,View, Text,Dimensions,StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import { container, colors } from '../styles';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import background from '../assets/images/design/background.jpg';
import AnalyticsHome from './Analytics/AnalyticsHome';


const width = Dimensions.get('window').width;

function Analytics({db, tasks, statusrecords, tracks}) {
  const [isLoading, setIsLoading] = useState(false);

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(true);

  useEffect(() => {
    if (tasks.filter(c=>(c.year==year && c.month==month-1))==undefined) {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month+1))==undefined) {
      setLastMonth(true);
    }
    else{
      setLastMonth(false);
    }
  },[])

  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month-2))==""){
      setFirstMonth(true);
    }
    setLastMonth(false);
  };

  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
    if (tasks.filter(c=>(c.year==year && c.month==month+1))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };


  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }
  return (
    <ImageBackground source={background} resizeMode="cover" style={container.container}>
    <SafeAreaView style={container.container}>
      <View style={container.header}>
        <Pressable onPress={displayMonth==true? ()=>LastMonth(tasks): ()=>setYear(year-1)}>
          <Feather name='chevron-left' size={40} style={{right:30}} color={'black'}/>
        </Pressable>
        <Pressable onPress={()=>setDisplayMonth(!displayMonth)} style={{alignItems:'center'}}>
          <Text style={container.headerdate}>{displayMonth==true?moment(new Date(year,1,1)).format('YYYY'):moment(new Date(0,month,1)).format('MMMM')}</Text>
          <Text style={container.headertitle}>{displayMonth==true?moment(new Date(0,month,1)).format('MMMM'):moment(new Date(year,1,1)).format('YYYY')}</Text>
        </Pressable>
        <Pressable onPress={displayMonth==true? ()=>NextMonth(tasks): ()=>setYear(year+1)}>
          <Feather name='chevron-right' size={40} style={{left:30}} color={'black'}/>
        </Pressable>
      </View>
      <AnalyticsHome db={db} tasks={tasks} tracks={tracks} year={year} month={month}/>
    </SafeAreaView>
    </ImageBackground>
  );
}

export default Analytics;
