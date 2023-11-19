import { ImageBackground, Dimensions, Text, View, SafeAreaView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import TodayTasks from '../components/TodayTasks';
import { container,colors } from '../styles';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import background from '../assets/images/design/background.jpg';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Today = ({db, tasks, setTasks, tracks, setTracks, selectedTrack, setSelectedTrack,
  settings, logs, setLogs, date, setDate}) => {

  var today = new Date();

  const [isLoading, setIsLoading] = useState(false);
  const [showLauncherScreen, setShowLauncherScreen] = useState(false);


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
        <Pressable onPress={()=>setShowLauncherScreen(false)} style={{display: (showLauncherScreen)?'flex':'none',position:'absolute',width:width, height:height, zIndex:2}}>
          <View style={{width:width, height:height, backgroundColor:colors.primary.black, opacity: 0.5}}/>
          <View style={{position:'absolute',width:width, height:height, alignItems:'center', top:height-180}}>
            <Text style={{fontSize:30, color:colors.primary.white}}> Create your first task </Text>
            <Feather name='arrow-down' size={30} color={colors.primary.white}/>
          </View>
        </Pressable>
        <SafeAreaView style={container.container}>
          <View style={container.header}>
            <Pressable onPress={PreviousDay}>
              <Feather name='chevron-left' size={30} />
            </Pressable>
            <View style={{alignItems:'center', marginHorizontal:20}}>
              <Text style={[container.headertitle,{display: (date.getDate()==today.getDate() && date.getMonth()==today.getMonth() && date.getFullYear()==today.getFullYear())? 'flex':'none'}]}>
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
            tracks={tracks} 
            selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}
            date={date}
            logs={logs} setLogs={setLogs}
          />
        </SafeAreaView>
      </ImageBackground>

  );
}

export default Today;

