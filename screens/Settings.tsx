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

const SettingsNavigator =({db, tasks, setTasks, tracks, setTracks, sections, setSections,
  statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs,  setmLogs, settings, setSettings, sliders, setSliders})=> {


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
        component={()=>DeleteDB({db, tasks, setTasks, tracks, setTracks, sections, setSections,
          statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs, setmLogs, sliders, setSliders})} />
      <Stack.Screen
        name="Linkdata"
        component={()=>Linkdata({})} />

    </Stack.Navigator>
  );
}

function Settings({db, tasks, setTasks, tracks, setTracks, sections, setSections,
  statuslist, setStatuslist, statusrecords, setStatusrecords, logs, setLogs, setmLogs, settings, setSettings, sliders, setSliders}) {


  return (
    <ImageBackground source={background} resizeMode="cover" style={container.container}>
      <SafeAreaView style={container.container}>
          <View style={container.header}>
              <Text style={container.headertitle}>SETTINGS</Text>
          </View>
          <SettingsNavigator db={db} tasks={tasks} setTasks={setTasks} 
          tracks={tracks} setTracks={setTracks} sections={sections} setSections={setSections}
          statusrecords={statusrecords} setStatusrecords={setStatusrecords}
          statuslist={statuslist} setStatuslist={setStatuslist} logs={logs} setLogs={setLogs}
          setmLogs={setmLogs} sliders={sliders} setSliders={setSliders}
          />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Settings;
