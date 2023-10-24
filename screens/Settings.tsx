import { ImageBackground, View, Text, StyleSheet, Pressable,SafeAreaView } from 'react-native';
import { container,colors } from '../styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Settings/Account';
import About from './Settings/About';
import Help from './Settings/Help';
import Preferences from './Settings/Preferences';
import Data from './Settings/Data';
import SettingsHome from './Settings/SettingsHome';
import DeleteDB from './Settings/DeleteDB';
import Linkdata from './Settings/Linkdata';
import background from '../assets/images/design/background.jpg';

const Stack = createNativeStackNavigator();

const SettingsNavigator =({db, tasks, setTasks, tracks, setTracks, load, loadx, 
  statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs})=> {


    return (
    <Stack.Navigator screenOptions={{headerShown:false, cardStyle:{backgroundColor:'transparent'}}}> 
      <Stack.Screen name="SettingsHome" component={SettingsHome} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="About" component={About}/>
      <Stack.Screen name="Data" component={Data}/>
      <Stack.Screen name="Preferences" component={()=>Preferences({db})} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen
        name="DeleteDB"
        component={()=>DeleteDB({db, tasks, setTasks, tracks, setTracks, load, loadx,
          statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs})} />
      <Stack.Screen
        name="Linkdata"
        component={()=>Linkdata({db, tasks, setTasks, tracks, setTracks, load, loadx,
          statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs})} />

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
