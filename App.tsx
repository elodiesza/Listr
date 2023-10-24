import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MonthlyTab from './screens/MonthlyTab';
import Settings from './screens/Settings';
import TodayTab from './screens/TodayTab';
import Analytics from './screens/Analytics';
import Tracks from './screens/Tracks';
import Feather from '@expo/vector-icons/Feather';
import { SimpleLineIcons } from '@expo/vector-icons';
import useDatabase from './db';
import { colors } from './styles';
const Tab = createBottomTabNavigator();

export default function App() {

  const {
    isLoading,
    tracks,
    tasks,
    load,
    db,
    sections,
    progress,
    statuslist,
    statusrecords,
    logs,
    settings,
    loadx,
    setTracks,
    setTasks,
    setDb,
    setIsLoading,
    setSections,
    setProgress,
    setStatuslist,
    setStatusrecords,
    setLogs,
    setSettings,
  } = useDatabase();



  return (
    <View style={{backgroundColor:'transparent', flex:1}}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="TodayTab"
      screenOptions={{
        tabBarStyle: { shadowColor:colors.primary.black,shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.2,margin:10, marginBottom:20, borderRadius:20, position:'absolute', paddingBottom:-20, height:60, borderWidth:0.5,borderColor:colors.primary.gray},
      }}>
        <Tab.Screen name="Analytics" children={()=><Analytics db={db}
        tasks={tasks} tracks={tracks} statusrecords={statusrecords}
        />}
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} />  
            </View>)}}
        />
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
        <Tab.Screen name="TodayTab" children={()=><TodayTab db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        load={load} loadx={loadx}
        sections={sections}
        settings={settings}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="MonthlyTab" children={()=><MonthlyTab db={db} tracks={tracks} 
        tasks={tasks} setTasks={setTasks} 
       setTracks={setTracks} 
        load={load} loadx={loadx} 
        settings={settings}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather name="calendar" size={28} />  
          </View>)}}
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
    </NavigationContainer>
    </View>
  );
}
