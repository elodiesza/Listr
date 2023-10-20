import { ImageBackground, View, Text, StyleSheet, Pressable,SafeAreaView } from 'react-native';
import { container,colors } from '../styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Settings/Account';
import About from './Settings/About';
import Help from './Settings/Help';
import Customization from './Settings/Customization';
import Data from './Settings/Data';
import SettingsHome from './Settings/SettingsHome';
import DeleteDB from './Settings/DeleteDB';
import background from '../assets/images/design/background.jpg';

const Stack = createNativeStackNavigator();

const SettingsNavigator =({db, tasks, setTasks, tracks, setTracks, load, loadx, 
  statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs, highlight,setHighlight})=> {


    return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsHome" component={SettingsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
      <Stack.Screen name="Data" component={Data} options={{ headerShown: false }} />
      <Stack.Screen name="Customization" component={()=>Customization({db})} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <Stack.Screen
        name="DeleteDB"
        component={()=>DeleteDB({db, tasks, setTasks, tracks, setTracks, load, loadx,
          statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs})} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Settings({db, tasks, setTasks, tracks, setTracks,load, loadx, 
  statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs}) {


  return (
    <ImageBackground source={background} resizeMode="cover" style={container.container}>
      <SafeAreaView style={container.container}>
          <View style={container.header}>
              <Text style={container.headertitle}>SETTINGS</Text>
          </View>
          <SettingsNavigator db={db} tasks={tasks} setTasks={setTasks} 
          tracks={tracks} setTracks={setTracks} 
          load={load} loadx={loadx} 
          statusrecords={statusrecords} setStatusrecords={setStatusrecords}
          statuslist={statuslist} setStatuslist={setStatuslist} logs={logs} setLogs={setLogs}
          />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Settings;
