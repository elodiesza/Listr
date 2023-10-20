import { ImageBackground, FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import TodayTasks from '../components/TodayTasks';
import { container } from '../styles';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import background from '../assets/images/design/background.jpg';


const TodayTab = ({db, tasks, setTasks, tracks, setTracks, load, loadx,
  sections, statusrecords, setStatusrecords, statuslist, setStatuslist}) => {

  var today = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(today);

  const NextDay = () => {
    setDate(new Date(date.setDate(date.getDate()+1)));
  };

  const PreviousDay = () => {
    setDate(new Date(date.setDate(date.getDate()-1)));
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
        <Pressable onPress={PreviousDay}>
          <Feather name='chevron-left' size={30} />
        </Pressable>
        <View style={{alignItems:'center', marginHorizontal:20}}>
          <Text style={container.headertitle}>
            TODAY
          </Text>
          <Text style={container.headerdate}>
            {moment(date).format('dddd, DD MMMM YYYY')}
          </Text>
        </View>
        <Pressable onPress={NextDay}>
          <Feather name='chevron-right' size={30}/>
        </Pressable>
      </View>
      <TodayTasks db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} load={load} 
        loadx={loadx} date={date}
        sections={sections}
      />
      </SafeAreaView>
      </ImageBackground>

  );
}

export default TodayTab;
