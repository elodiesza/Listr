import * as React from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MonthlyTab from './screens/MonthlyTab';
import Settings from './screens/Settings';
import TodayTab from './screens/TodayTab';
import Tracks from './screens/Tracks';
import Feather from '@expo/vector-icons/Feather';
import { SimpleLineIcons } from '@expo/vector-icons';
import useDatabase from './db';
import { colors } from './styles';
import NewTask from './modal/NewTask';
import { useState } from 'react';

const Tab = createBottomTabNavigator();

function App() {

  const {
    tracks,
    tasks,
    load,
    db,
    sections,
    progress,
    statuslist,
    statusrecords,
    logs,
    mlogs,
    settings,
    loadx,
    setTracks,
    setTasks,
    setSections,
    setProgress,
    setStatuslist,
    setStatusrecords,
    setLogs,
    setmLogs,
    setSettings,
  } = useDatabase();

  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <View style={{backgroundColor:'transparent', flex:1}}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="TodayTab"
      screenOptions={{
        tabBarStyle: { shadowColor:colors.primary.black,shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.2,margin:10, marginBottom:20, borderRadius:20, position:'absolute', paddingBottom:-20, height:60, borderWidth:0.5,borderColor:colors.primary.gray},
      }}>
        <Tab.Screen name="Tracks" children={()=><Tracks 
        tracks={tracks} setTracks={setTracks} db={db}
        sections={sections} setSections={setSections}
        tasks={tasks} setTasks={setTasks}
        progress={progress} setProgress={setProgress}
        statuslist={statuslist} setStatuslist={setStatuslist}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        settings={settings}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <SimpleLineIcons name="notebook" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="MonthlyTab" children={()=><MonthlyTab db={db} tracks={tracks} 
          tasks={tasks} setTasks={setTasks} 
          setTracks={setTracks} 
          load={load} loadx={loadx} 
          settings={settings}
          mlogs={mlogs} setmLogs={setmLogs}
          />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center', right:20}}>
              <Feather name="calendar" size={28} />  
            </View>)}}
        />
        <Tab.Screen name="TodayTab" children={()=><TodayTab db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        load={load} loadx={loadx}
        sections={sections}
        settings={settings}
        logs={logs} setLogs={setLogs}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center', left:20}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Settings" children={()=><Settings 
        db={db} tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        load={load} loadx={loadx} 
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        statuslist={statuslist} setStatuslist={setStatuslist}
        logs={logs} setLogs={setLogs}
        settings={settings} setSettings={setSettings}
        />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="settings" size={28} />  
            </View>)}}
        />
      </Tab.Navigator>
      <Pressable onPress={() => setAddModalVisible(true)} style={{shadowColor:colors.primary.black, shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.5, borderColor: colors.primary.gray,position:'absolute', width:60, height:60, borderRadius:30, backgroundColor:colors.primary.purple, bottom:40, alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
        <Feather name="plus-circle" size={35} style={{color:colors.primary.white}}/>
      </Pressable>
      <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        track={undefined}
        section={undefined}
        pageDate={new Date()}
        tracksScreen={false}
        monthly={false}
      />
    </NavigationContainer>
    </View>
  );
}
export default App;