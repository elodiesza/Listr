import { useState, useEffect } from 'react';
import { Dimensions, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function NewStatus({newStatusVisible, setNewStatusVisible, db, statuslist, setStatuslist, statusrecords, setStatusrecords, selectedTab, selectedSection}) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
  
  const { control: control1, handleSubmit: handleSubmit1, reset: reset1 } = useForm();
  const { control: control2, handleSubmit: handleSubmit2, reset: reset2 } = useForm();

  const [itemlist, setItemlist] = useState([{ colorPickerVisible: false, picked: '', value: undefined }]);
  const [selectedStatus, setSelectedStatus] = useState('');
  

  const ListOfStatuses = () => {
    let list = [];
    for (let i = 0; i < [...new Set(statuslist.map(c=>c.name))].length; i++) {
      list.push([[...new Set(statuslist.map(c=>c.name))][i]," : "+statuslist.filter(c=>c.name==[...new Set(statuslist.map(c=>c.name))][i]).map(c=>" "+c.item)]);
    }
    return list;
  }

  const AddItemtolist = () => {
    setItemlist((prevList) => [...prevList, { colorPickerVisible: false, picked: '' }]);
  };

  const RemoveItemfromlist = (index) => {
    setItemlist((prevList) => (prevList.filter((_, i) => i !== index)));
  };

  useEffect(() => {
    if (!newStatusVisible) {
      reset1();
    }
  }, [newStatusVisible, reset1]);

  const addStatus = async (data) => {
    let existingstatuslist = [...statuslist]; 
      for (let i = 0; i < itemlist.length; i++) {
        const newID=uuid.v4();
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO statuslist (id,name, item, color, number) VALUES (?,?,?,?,?)',
              [ newID,data.name, itemlist[i].value, itemlist[i].picked, i],
              (txtObj, stateResultSet) => {
                const newStatus = {
                  id: newID,
                  name: data.name,
                  item: itemlist[i].value,
                  color: itemlist[i].picked,
                  number: i,
                };
                existingstatuslist.push(newStatus);
                setStatuslist(existingstatuslist); 
              }
            );
        });
      }
    setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);
    setSelectedStatus(data.name);
  };
  const addStatusrecord = async (data) => {
    let existingstatusrecords = [...statusrecords];
    const selectedList = selectedStatus;
        const newID=uuid.v4();
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO statusrecords (id,name, track, section, list, number,archive) VALUES (?,?,?,?,?,?,?)',
              [ newID,data.newrecord, selectedTab, selectedSection, selectedList, 0,false],
              (txtObj, stateResultSet) => {
                const newStatus = {
                  id: newID,
                  name: data.newrecord,
                  track: selectedTab,
                  section: selectedSection,
                  list: selectedList,
                  number: 0,
                  archive: false,
                };
                existingstatusrecords.push(newStatus);
                setStatusrecords(existingstatusrecords); 
              }
            );
        });
      setNewStatusVisible(false);
      setSelectedStatus(selectedList)
  };

  const ItemList = ({item,index}) => {
    const itemData = itemlist[index]; 
    const { colorPickerVisible, picked } = itemData;
    return (
      <View style={{width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
        <View style={{flexDirection:'row', width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
          <Pressable onPress={() => RemoveItemfromlist(index)} style={{ display: itemlist.length === 1 ? 'none' : 'flex' }}>
            <Feather name='minus-circle' size={30} color={colors.primary.purple} style={{ marginRight: 5, bottom: 5 }} />
          </Pressable>
          
          <Controller
          control= {control1}
          name={`item${index + 1}`}
          render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
              <>
          <TextInput
              value={item.value}
              onChangeText={(text) => {
                const updatedItems = [...itemlist];
                updatedItems[index] = { ...item, value: text };
                setItemlist(updatedItems);
                onChange(text);
              }}
              autoCapitalize = {"characters"}
              onBlur={onBlur}
              placeholder={"STATE "+index}
              style={[container.textinput,{flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
          />
          {error && (
              <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
          )}
          </>
      )}
      rules={{
          required: 'Input a state',
          minLength: {
          value: 3,
          message: 'Task should be at least 3 characters long',
          },
          maxLength: {
          value: 14,
          message: 'Task should be max 14 characters long',
          },
          validate: (name) => {
          if (name.includes('  ')) {
              return 'Name should not contain consecutive spaces';
          }
          return true;
          }
      }}
      />
        <Pressable onPress={() => {
          setItemlist((prevList) =>
            prevList.map((item, i) =>
              i === index ? { ...item, colorPickerVisible: !item.colorPickerVisible } : item
            )
          );
        }}  style={{ justifyContent:'center' }}>
          <View style={[container.color,{backgroundColor:picked}]} />
        </Pressable>
        <ColorPicker
          colorPickerVisible={colorPickerVisible}
          setColorPickerVisible={(visible) => {setItemlist((prevList) =>
              prevList.map((item, i) =>i === index ? { ...item, colorPickerVisible: visible } : item));}}
          picked={picked}
          setPicked={(value) => {setItemlist((prevList) =>
              prevList.map((item, i) =>i === index ? { ...item, picked: value } : item));}}
        />
      </View>  
      <Pressable onPress={AddItemtolist} style={{display:index+1==itemlist.length?'flex':'none'}}>
        <Feather name='plus-circle' color={colors.primary.purple} size={30} style={{marginRight:5, marginTop: 5}}/>
      </Pressable>
    </View> 
    );
  };


  return (
    <Modal
      isVisible={newStatusVisible}
      onBackdropPress={() => {
        setNewStatusVisible(!newStatusVisible);
        setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);
      }}
      backdropColor='white'
      avoidKeyboard={true}
      style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => {setNewStatusVisible(!newStatusVisible);setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={[container.newModal,{height:undefined, paddingBottom:40}]}>
                <View style={{width:width,height:40, zIndex:2}}>
                  <View style={{position:'absolute'}}>
                    <SelectList 
                    setSelected={(val) => setSelectedStatus(val=="CREATE A NEW STATUS"?val:val[0])} 
                    data={[...ListOfStatuses(),{value:"CREATE A NEW STATUS"}]} 
                    save="value"
                    placeholder='select a status list'
                    boxStyles={{backgroundColor:colors.primary.white, width:width, height:40}}
                    dropdownStyles={{backgroundColor:colors.primary.white,borderRadius:5}}
                    dropdownTextStyles={{fontSize:10}}
                    maxHeight={200}
                    />  
                  </View>
                </View>
                <View style={{display: selectedStatus!=="CREATE A NEW STATUS"? "none":"flex", width:'100%', justifyContent:'center', alignItems:'flex-start'}}>
                  <Text style={{marginTop:10}}>NEW STATUS LIST NAME</Text>
                  <Controller
                    control= {control1}
                    name="name"
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize = {"characters"}
                        onBlur={onBlur}
                        placeholder="NAME"
                        style={[container.textinput,{width:width,borderColor: error ? 'red' : '#e8e8e8'}]}
                      />
                      {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                      )}
                    </>
                    )}
                    rules={{
                      required: 'Input a satus',
                      minLength: {
                        value: 3,
                        message: 'Task should be at least 3 characters long',
                      },
                      maxLength: {
                        value: 14,
                        message: 'Task should be max 14 characters long',
                      },
                      validate: (name) => {
                        if (name.includes('  ')) {
                          return 'Name should not contain consecutive spaces';
                        }
                        return true;
                      }
                    }}
                  />
                  <Text>INPUT ALL STATUSES IN ORDER</Text>
                  <FlatList
                      data={itemlist}
                      renderItem={({item,index})=>ItemList({item,index})}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
                  />
                  <Pressable onPress={handleSubmit1(addStatus)} style={[container.button,{}]}>
                    <Text>CREATE NEW STATUS LIST</Text>
                  </Pressable>
                </View>
                <Text>NEW RECORD NAME</Text>
                <View style={{flexDirection:'row'}}>
                  <Controller
                    control= {control2}
                    name="newrecord"
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize = {"characters"}
                        onBlur={onBlur}
                        placeholder="NAME"
                        style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8'}]}
                      />
                      {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                      )}
                    </>
                    )}
                    rules={{
                      required: 'Input a satus',
                      minLength: {
                        value: 3,
                        message: 'Task should be at least 3 characters long',
                      },
                      maxLength: {
                        value: 14,
                        message: 'Task should be max 14 characters long',
                      },
                      validate: (name) => {
                        if (name.includes('  ')) {
                          return 'Name should not contain consecutive spaces';
                        }
                        return true;
                      }
                    }}
                  />
                  <Pressable onPress={handleSubmit2(addStatusrecord)} style={{justifyContent:'center',height:40, flex:1, alignItems:'center'}}>
                    <Feather name='plus-circle' color={colors.primary.purple} size={20}/>
                  </Pressable>
                </View>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewStatus;
