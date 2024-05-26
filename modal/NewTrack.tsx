import { useState, useEffect } from 'react';
import { Dimensions,TouchableWithoutFeedback,TouchableOpacity, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function NewTrack({newTrackVisible, setNewTrackVisible, db, tracks, setTracks, setSelectedTrack, setSelectedTrackColor}) {


  const {control, handleSubmit, reset} = useForm();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [picked, setPicked] = useState('');

  useEffect(() => {
    if (!newTrackVisible) {
      reset();
    }
  }, [newTrackVisible, reset]);


  const addTrack = async (data) => {
    let existingtracks = [...tracks]; 
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO tracks (id,name,color) VALUES (?,?,?)',
              [ uuid.v4(),data.name, picked],
              (txtObj, trackResultSet) => {
                const newTrack = {
                  id: uuid.v4(),
                  name: data.name,
                  color: picked==undefined? colors.primary.default : picked
                };
                existingtracks.push(newTrack);
                setTracks(existingtracks); 
              }
            );
        });
    setSelectedTrack(data.name);
    setSelectedTrackColor(picked);
    setPicked('');
    setNewTrackVisible(false);
    reset();
  };


  return (
    <Modal
      isVisible={newTrackVisible}
      onBackdropPress={() => {
        setNewTrackVisible(!newTrackVisible);
        setPicked('');
      }}
        backdropColor='white'
        avoidKeyboard={true}
        style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => {setNewTrackVisible(!newTrackVisible); setPicked('');}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.newModal}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <Pressable onPress={() => setNewTrackVisible(!newTrackVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW TRACK</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Controller
                    control= {control}
                    name="name"
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                      <View style={{flexDirection:'column',flex:1}}>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          autoCapitalize = {"characters"}
                          onBlur={onBlur}
                          placeholder="NAME"
                          style={[container.textinput,{width:undefined,flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && (
                          <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                        )}
                      </View>
                    )}
                  rules={{
                    required: 'Input a Track name',
                    minLength: {
                      value: 3,
                      message: 'Name should be at least 3 characters long',
                    },
                    maxLength: {
                      value: 12,
                      message: 'Name should be max 12 characters long',
                    },
                    validate: (name) => {
                      if (name.includes('  ')) {
                        return 'Name should not contain consecutive spaces';
                      }
                      return true;
                    }
                  }}
                  />
                  <Pressable style={[container.color,{backgroundColor:picked}]} onPress={()=>setColorPickerVisible(true)} />
                  <Pressable onPress={handleSubmit(addTrack)} style={{backgroundColor: colors.primary.purple, justifyContent:'center',height:40, width:40, alignItems:'center'}}>
                    <Ionicons name='send' size={18} color={colors.primary.white}/>
                  </Pressable>
                </View>
              <ColorPicker colorPickerVisible={colorPickerVisible} setColorPickerVisible={setColorPickerVisible} picked={picked} setPicked={setPicked} />
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewTrack;
