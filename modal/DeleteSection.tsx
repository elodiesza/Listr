import { Dimensions,TouchableWithoutFeedback,TouchableOpacity, Pressable, Text, View } from 'react-native';
import { container,colors } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function DeleteSection({deleteSectionVisible, setDeleteSectionVisible, db, selectedTrack, sections, setSections, tasks, setTasks, selectedSection, setSelectedSection, sliders, setSliders, statusrecords, setStatusrecords}) {


  function DeleteSectionDB() {
    const id= sections.filter(c=>c.name==selectedSection).map(c=>c.id)[0];
    db.transaction(tx=> {
        tx.executeSql('DELETE FROM sections WHERE id = ?', [id],
        (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingSections = [...sections].filter(c=>c.id!==id);
                setSections(existingSections);
              }
        },
        (txObj, error) => console.log(error)
        );       
    })  
    db.transaction(tx=> {
        tx.executeSql('DELETE FROM tasks WHERE track = ? AND section = ?', [selectedTrack, selectedSection],
        (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(c=>(c.section!==selectedSection || c.track!==selectedTrack));
                setTasks(existingTasks);
              }
        },
        (txObj, error) => console.log(error)
        );       
    })   
    db.transaction(tx=> {
        tx.executeSql('DELETE FROM sliders WHERE track = ? AND section = ?', [selectedTrack, selectedSection],
        (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                let existingsliders = [...sliders].filter(c=>(c.section!==selectedSection || c.track!==selectedTrack));
                setSliders(existingsliders);
              }
        },
        (txObj, error) => console.log(error)
        );       
    })
    db.transaction(tx=> {
      tx.executeSql('DELETE FROM statusrecords WHERE track = ? AND section = ?', [selectedTrack, selectedSection],
      (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
              let existingStatusrecords = [...statusrecords].filter(c=>(c.section!==selectedSection || c.track!==selectedTrack));
              setStatusrecords(existingStatusrecords);
            }
      },
      (txObj, error) => console.log(error)
      );       
  })   
    setSelectedSection('');
    setDeleteSectionVisible(false);  
  };
 
  return (
    <Modal
      isVisible={deleteSectionVisible}
      onBackdropPress={() => {
        setDeleteSectionVisible(!deleteSectionVisible);
      }}
        backdropColor='white'
        avoidKeyboard={true}
        style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => setDeleteSectionVisible(!deleteSectionVisible)} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.newModal,{alignItems:'center'}]}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <Pressable onPress={() => setDeleteSectionVisible(!deleteSectionVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20, flexWrap:'wrap'}}>Delete {selectedSection} and its tasks definitely ?</Text>
                </View>
                <Pressable onPress={()=>DeleteSectionDB()} style={[container.button,{flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, width:150, marginRight:5}]}>
                    <Text> DELETE </Text>
                </Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteSection;