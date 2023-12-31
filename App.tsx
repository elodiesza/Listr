import * as React from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Monthly from './screens/Monthly';
import Settings from './screens/Settings';
import Today from './screens/Today';
import Tracks from './screens/Tracks';
import Feather from '@expo/vector-icons/Feather';
import { SimpleLineIcons } from '@expo/vector-icons';
import useDatabase from './db';
import { colors } from './styles';
import NewTask from './modal/NewTask';
import NewTrack from './modal/NewTrack';
import { useState, useEffect } from 'react';

const Tab = createBottomTabNavigator();

function App() {

  const {
    tracks,
    tasks,
    db,
    sections,
    sliders,
    statuslist,
    statusrecords,
    logs,
    mlogs,
    settings,
    setTracks,
    setTasks,
    setSections,
    setSliders,
    setStatuslist,
    setStatusrecords,
    setLogs,
    setmLogs,
    setSettings,
  } = useDatabase();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTrackVisible, setNewTrackVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState('Today');
  const [selectedTrack, setSelectedTrack] = useState(selectedTab=='Tracks'?'UNLISTED':'all');
  const [selectedTrackColor, setSelectedTrackColor] = useState(selectedTrack==undefined? colors.primary.default:tracks.filter(c=>c.name==selectedTrack).map(c=>c.color)[0]);

  const [date, setDate] = useState(new Date());
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();


  const number = tasks.filter(c=>(c.year==year && c.month==month && c.day==day && c.state==0)).length;

  useEffect(() => {
    setSelectedTrack(selectedTab=='Tracks'?'UNLISTED':'all');
  }, [selectedTab])


  return (
    <View style={{backgroundColor:'transparent', flex:1}}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today"
      screenListeners={({ navigation, route }) => ({
        focus: e => {
          setSelectedTab(route.name);
        },
      })}
      screenOptions={{
        tabBarStyle: { shadowColor:colors.primary.black,shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.2,margin:10, marginBottom:20, borderRadius:20, position:'absolute', paddingBottom:-20, height:60, borderWidth:0.5,borderColor:colors.primary.gray},
      }}>
        <Tab.Screen name="Tracks" children={()=><Tracks 
        tracks={tracks} setTracks={setTracks} db={db}
        sections={sections} setSections={setSections}
        tasks={tasks} setTasks={setTasks}
        sliders={sliders} setSliders={setSliders}
        statuslist={statuslist} setStatuslist={setStatuslist}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        settings={settings} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <SimpleLineIcons name="notebook" size={28}/>  
          </View>)
        }}
        
        />
        <Tab.Screen name="Monthly" children={()=><Monthly db={db} tracks={tracks} 
          tasks={tasks} setTasks={setTasks} 
          setTracks={setTracks} 
          settings={settings}
          mlogs={mlogs} setmLogs={setmLogs}
          date={date} setDate={setDate}
          />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', right:20}}>
              <Feather name="calendar" size={28}/>  
            </View>)}}
        />
        <Tab.Screen name="Today" children={()=><Today db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}
        settings={settings}
        logs={logs} setLogs={setLogs}
        date={date} setDate={setDate}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center', left:20}}>
             <Feather name="sun" size={28}/>  
          </View>),
          tabBarBadge: number,
          tabBarBadgeStyle: {backgroundColor:colors.primary.purple, color:colors.primary.white, paddingTop:1, fontSize:9, fontWeight:'bold', bottom:10, left:30, width:20, height:20, borderRadius:10, alignItems:'center', justifyContent:'center', position:'absolute'},
        }}
        />
        <Tab.Screen name="Settings" children={()=><Settings 
        db={db} tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} sections={sections} setSections={setSections}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        statuslist={statuslist} setStatuslist={setStatuslist}
        logs={logs} setLogs={setLogs}
        settings={settings} setSettings={setSettings}
        sliders={sliders} setSliders={setSliders}
        />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="settings" size={28}/>  
            </View>)}}
        />
      </Tab.Navigator>
      <Pressable onPress={() => selectedTab=='Tracks'? setNewTrackVisible(true):setAddModalVisible(true)} style={{shadowColor:colors.primary.black, shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.5, borderColor: colors.primary.gray,position:'absolute', width:60, height:60, borderRadius:30, backgroundColor:colors.primary.purple, bottom:40, alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
        <Feather name="plus-circle" size={35} style={{color:colors.primary.white}}/>
      </Pressable>
      <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        track={selectedTrack}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        section={undefined}
        pageDate={date}
        tracksScreen={selectedTab=='Tracks'?true:false}
        monthly={selectedTab=='Monthly'?true:false}
      />
      <NewTrack 
        db={db} 
        tracks={tracks} 
        setTracks={setTracks} 
        newTrackVisible={newTrackVisible} 
        setNewTrackVisible={setNewTrackVisible} 
        setSelectedTrack={setSelectedTrack} 
        setSelectedTrackColor={setSelectedTrackColor}
      />
    </NavigationContainer>
    </View>
  );
}
export default App;