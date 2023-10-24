import { Dimensions,TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function DeleteDBvalid({deleteVisible, setDeleteVisible, db, setSections, setTasks, setTracks, setProgress, setStatusrecords, setStatuslist, setLogs, selectedData}) {


  function Delete() {
    if (selectedData=='tasks') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tasks', null,
      (txObj, resultSet) => setTasks([]),
      (txObj, error) => console.log('error selecting tasks')
      )})
    }
    else if (selectedData=='sections') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS sections', null,
      (txObj, resultSet) => setSections([]),
      (txObj, error) => console.log('error selecting sections')
      )})
    } 
    else if (selectedData=='tracks') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tracks', null,
      (txObj, resultSet) => setTracks([]),
      (txObj, error) => console.log('error selecting tracks')
      )})
    }
    else if (selectedData=='statusrecords') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statusrecords', null,
      (txObj, resultSet) => setStatusrecords([]),
      (txObj, error) => console.log('error selecting status records')
      )})
    }
    else if (selectedData=='statuslist') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statuslist', null,
      (txObj, resultSet) => setStatuslist([]),
      (txObj, error) => console.log('error selecting status list')
      )})
    }
    else if (selectedData=='progress') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS progress', null,
      (txObj, resultSet) => setProgress([]),
      (txObj, error) => console.log('error selecting progress')
      )})
    }
    else if (selectedData=='logs') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS logs', null,
      (txObj, resultSet) => setLogs([]),
      (txObj, error) => console.log('error selecting logs')
      )})
    }
    setDeleteVisible(false);
  };
 

  return (
    <Modal
      isVisible={deleteVisible}
      onBackdropPress={() => {
        setDeleteVisible(false);
      }}
        backdropColor='white'
        avoidKeyboard={true}
        style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => setDeleteVisible(false)} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.newModal,{alignItems:'center'}]}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <Pressable onPress={() => setDeleteVisible(false)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20, flexWrap:'wrap'}}>Delete {selectedData} data definitely ?</Text>
                </View>
                <Pressable onPress={()=>Delete()} style={[container.button,{flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, width:150, marginRight:5}]}>
                    <Text> DELETE </Text>
                </Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteDBvalid;