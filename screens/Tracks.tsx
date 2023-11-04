import { ImageBackground, View, Text, TouchableOpacity, Dimensions, Pressable, SafeAreaView, FlatList } from 'react-native';
import { colors, container, paleColor } from '../styles';
import { useEffect, useState, useRef } from 'react';
import { Feather, MaterialIcons, Entypo, Ionicons} from '@expo/vector-icons';
import NewSection from '../modal/NewSection';
import NewTask from '../modal/NewTask';
import Task from '../components/Task';
import { SwipeListView } from 'react-native-swipe-list-view';
import ProgressBar from '../components/ProgressBar';
import NewProgress from '../modal/NewProgress';
import NewTrack from '../modal/NewTrack';
import NewStatus from '../modal/NewStatus';
import Status from '../components/Status';
import Tab from '../components/Tab';
import DeleteTrack from '../modal/DeleteTrack';
import DeleteSection from '../modal/DeleteSection';
import background from '../assets/images/design/background.jpg';

const width = Dimensions.get('window').width;

function Tracks({tracks, setTracks, db, sections, setSections, tasks, setTasks, 
    progress, setProgress, statuslist, setStatuslist, statusrecords, setStatusrecords, 
    settings, selectedTrack, setSelectedTrack }) {

    const today= new Date();
    const tomorrow= new Date(today.setDate(today.getDate()+1));
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const day = today.getDate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTrackColor, setSelectedTrackColor] = useState(selectedTrack==undefined? colors.primary.default:tracks.filter(c=>c.track==selectedTrack).map(c=>c.color)[0]);
    const [newSectionVisible, setNewSectionVisible] = useState(false);
    const [newTrackVisible, setNewTrackVisible] = useState(false);
    const [newTaskVisible, setNewTaskVisible] = useState(false);
    const [deleteTrackVisible, setDeleteTrackVisible] = useState(false);
    const [deleteSectionVisible, setDeleteSectionVisible] = useState(false);
    const [newProgressVisible, setNewProgressVisible] = useState(false);
    const [newStatusVisible, setNewStatusVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('');
    const [deleteSection, setDeleteSection] = useState(-1);
    const [showArchive, setShowArchive] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [editIndex2, setEditIndex2] = useState(-1);
    const [editIndex3, setEditIndex3] = useState(-1);
    const [editIndex4, setEditIndex4] = useState(-1);
    const [editIndex5, setEditIndex5] = useState(-1);
    const [editIndex6, setEditIndex6] = useState(-1);
    const [selectedProgress, setSelectedProgress] = useState(-1);
    const [arrow, setArrow] = useState([{'index':-1, 'arrow':false}]);
    const handleClickOutside = () => {
      if (editIndex !== -1) {
        setEditIndex(-1);
      }
      else if (editIndex2 !== -1) {
        setEditIndex2(-1);
      }
      else if (editIndex3 !== -1) {
        setEditIndex3(-1);
      }
      else if (editIndex4 !== -1) {
        setEditIndex4(-1);
      }
      else if (editIndex5 !== -1) {
        setEditIndex5(-1);
      }
      else if (editIndex6 !== -1) {
        setEditIndex6(-1);
      }
      setSelectedSection('');
    };

    useEffect(() => {
        editIndex!==-1 ? (setEditIndex2(-1), setEditIndex3(-1), setEditIndex4(-1), setEditIndex5(-1), setEditIndex6(-1)) : undefined;
        editIndex2!==-1 ? (setEditIndex(-1), setEditIndex3(-1), setEditIndex4(-1), setEditIndex5(-1), setEditIndex6(-1)) : undefined;
        editIndex3!==-1 ? (setEditIndex(-1), setEditIndex2(-1), setEditIndex4(-1), setEditIndex5(-1), setEditIndex6(-1)) : undefined;
        editIndex4!==-1 ? (setEditIndex(-1), setEditIndex2(-1), setEditIndex3(-1), setEditIndex5(-1), setEditIndex6(-1)) : undefined;
        editIndex5!==-1 ? (setEditIndex(-1), setEditIndex2(-1), setEditIndex3(-1), setEditIndex4(-1), setEditIndex6(-1)) : undefined;
        editIndex6!==-1 ? (setEditIndex(-1), setEditIndex2(-1), setEditIndex3(-1), setEditIndex4(-1), setEditIndex5(-1)) : undefined;
    },[editIndex,editIndex2,editIndex3,editIndex4,editIndex5,editIndex6]);

   
    const arrowArray = () => {
        let arrowArray = [];
        const sectionLength = sections.filter(c=>c.track==selectedTrack).length;
        for (let i=0; i<sectionLength; i++) {
            arrowArray.push({'index':i, 'arrow':true});
        }
        return arrowArray;
    }


    const updateArrowAtIndex = (index, newArrowValue) => {
        setArrow(prevArrowArray => {
            return prevArrowArray.map(item => {
                if (item.index === index) {
                    return { ...item, arrow: newArrowValue };
                }
                return item;
            });
        });
    };

    useEffect(() => {
        if (selectedProgress!==-1) {
            setSelectedProgress(-1);
        }
    },[progress]);


    useEffect(() => {
        if (sections.filter(c=>c.track==selectedTrack).length>arrow.length){
            setArrow([...arrow,{'index':sections.filter(c=>c.track==selectedTrack).length-1, 'arrow':true}]);
            setIsLoading(false);
        }
        else if (deleteSection!==-1){
            setArrow(arrow.splice(deleteSection,1));
            let array = arrow;
            for (var i=deleteSection; i<arrow.length; i++) {
                array[i].index=i;
            }
            setArrow(array);
            setDeleteSection(-1);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
        }
    },[sections]);

    const openRowRef = useRef(null);
    const onRowDidOpen = (rowKey,rowMap) => {  
        openRowRef.current = rowMap[rowKey];
    };
    const closeOpenRow = () => {
        if (openRowRef.current && openRowRef.current.closeRow) {
            openRowRef.current.closeRow();
            openRowRef.current = null;
        }
    };

    useEffect(() => {
        setArrow(arrowArray());
        setSelectedTrackColor(selectedTrack==undefined? colors.primary.default:tracks.filter(c=>c.track==selectedTrack).map(c=>c.color)[0]);
        setSelectedSection(sections.filter(c=>c.track==selectedTrack).map(c=>c.section)[0]);
    }, [selectedTrack,tracks,sections]);

    const TransferDaily = (id) => {
        let existingTasks = [...tasks];
        const toTransfer = existingTasks.map(c=>c.id).findIndex(c=>c==id);
        db.transaction(tx=> {
            tx.executeSql('UPDATE tasks SET year = ?, month=?, day=? WHERE id= ?', [thisYear,thisMonth,day, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingTasks[toTransfer].year = thisYear;
                  existingTasks[toTransfer].month = thisMonth;
                  existingTasks[toTransfer].day = day;
                  setTasks(existingTasks);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
        });
        closeOpenRow();
    }

    const TransferTomorrow = (id) => {
        let existingTasks = [...tasks];
        let tmrwyear= tomorrow.getFullYear();
        let tmrwmonth= tomorrow.getMonth();
        let tmrwday= tomorrow.getDate();
        const toTransfer = existingTasks.map(c=>c.id).findIndex(c=>c==id);
        db.transaction(tx=> {
            tx.executeSql('UPDATE tasks SET year = ?, month=?, day=? WHERE id= ?', [tmrwyear,tmrwmonth,tmrwday, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingTasks[toTransfer].year = tmrwyear;
                  existingTasks[toTransfer].month = tmrwmonth;
                  existingTasks[toTransfer].day = tmrwday;
                  setTasks(existingTasks);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
        });
        closeOpenRow();
    }

    const TransferArchive = (id,reverse) => {
        let existingrecords = [...statusrecords];
        const toTransfer = existingrecords.map(c=>c.id).findIndex(c=>c==id);
        db.transaction(tx=> {
            tx.executeSql('UPDATE statusrecords SET archive=? WHERE id= ?', [reverse?false:true, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingrecords[toTransfer].archive = reverse?false:true;
                  setStatusrecords(existingrecords);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
        });
    }

    const TaskSwipeItem = ({ id }) => (
        <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
            <View style={{ width: 0.9*width -100, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: colors.primary.yellowgreen }}>
                <Pressable onPress={()=>TransferDaily(id)}>
                    <Feather name="calendar" size={25} color={'white'} />
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: colors.primary.orange }}>
                <Pressable onPress={()=>TransferTomorrow(id)}>
                    <Feather name="calendar" size={25} color={'white'} style={{position:'absolute',top: -6, right:-6}}/>
                    <Text style={{top:4,fontSize:11, color:colors.primary.white, fontWeight:'bold'}}>+1</Text>
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                    {db.transaction(tx => {
                    tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
                        (txObj, resultSet) => {
                        if (resultSet.rowsAffected > 0) {
                            let existingTasks = [...tasks].filter(c => c.id !== id);
                            setTasks(existingTasks);
                        }
                        },
                        (txObj, error) => console.log(error)
                    );
                    closeOpenRow();
                    })}
                    }>
                    <Feather name="trash-2" size={25} color={'white'} />
                </Pressable>
            </View>
        </View>
      );

    const ArchiveTaskSwipeItem = ({ id }) => (
            <View style={{ paddingRight:10, justifyContent: 'center', alignItems: 'flex-end', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                db.transaction(tx => {
                tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
                    (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let existingTasks = [...tasks].filter(c => c.id !== id);
                        setTasks(existingTasks);
                    }
                    },
                    (txObj, error) => console.log(error)
                );
                })}>
                    <Feather name="trash-2" size={25} color={'white'} />
                </Pressable>
            </View>
    );      

    const ProgressSwipeItem = ({ id }) => (
        <View style={{ paddingRight:10, justifyContent: 'center', alignItems: 'flex-end', flex: 1, backgroundColor: 'darkred' }}>
            <Pressable onPress={() => 
                db.transaction(tx => {
                    tx.executeSql('DELETE FROM progress WHERE id = ?', [id],
                        (txObj, resultSet) => {
                        if (resultSet.rowsAffected > 0) {
                            let existingProgress = [...progress].filter(c => c.id !== id);
                            setProgress(existingProgress);
                        }
                        },
                        (txObj, error) => console.log(error)
                    );
                    closeOpenRow();
                })}>
                <Feather name="trash-2" size={25} color={'white'} />
            </Pressable>
        </View>
    );

    const StatusSwipeItem = ({ id, reverse }) => (
        <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
            <View style={{ width: width - 90, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: colors.primary.yellowgreen }}>
                <Pressable onPress={()=>TransferArchive(id,reverse)}>
                    <Feather name="archive" size={25} color={'white'} />
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                db.transaction(tx => {
                tx.executeSql('DELETE FROM statusrecords WHERE id = ?', [id],
                    (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let existingrecords = [...statusrecords].filter(c => c.id !== id);
                        setStatusrecords(existingrecords);
                    }
                    },
                    (txObj, error) => console.log(error)
                );
                closeOpenRow();
                })}>
                    <Feather name="trash-2" size={25} color={'white'} />
                </Pressable>
            </View>
        </View>
      );



    return (
        <ImageBackground source={background} resizeMode="cover" style={container.container}>
            <SafeAreaView style={[container.container]}>
                <Pressable style={{flex:1,alignItems:'center',justifyContent:'flex-start'}}  onPress={handleClickOutside}>
                    <View style={[container.header,{borderBottomWidth:0}]}>
                        <Text style={{fontSize:20, fontFamily:'AvenirNextCondensed-Regular'}}>TRACKS</Text>
                    </View>
                    <View style={container.block}>
                        <View style={{ zIndex:1, bottom:-1, flexDirection:'row'}}>
                            <FlatList
                                data={[... new Set(tracks),{'id':'unlisted','track':'UNLISTED','color':colors.primary.default}]}
                                renderItem={({item,index}) =>  <Tab item={item} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>}
                                horizontal={true}
                                keyExtractor= {(item,index) => index.toString()}
                                contentContainerStyle={{flexDirection:'row-reverse'}}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={[container.listblock,{backgroundColor: paleColor(selectedTrackColor),}]}>  
                            <FlatList
                                data={sections.filter(c=>c.track==selectedTrack)} 
                                renderItem={({item,index}) => 
                                <View style={{width:0.9*width}}>
                                    <View style={[container.section,{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: paleColor(selectedTrackColor)}]}> 
                                        <Text>{item.section}</Text>
                                        <Pressable onPress={()=>updateArrowAtIndex(index,false)} style={{display:arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==true?"flex":"none",position:'absolute',right:10}}>
                                            <MaterialIcons name="keyboard-arrow-down" size={25}/>
                                        </Pressable>
                                        <Pressable onPress={()=>updateArrowAtIndex(index,true)}  style={{display:arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==false?"flex":"none",position:'absolute',right:10}}>
                                            <MaterialIcons name="keyboard-arrow-up" size={25}/>
                                        </Pressable>
                                    </View>
                                    <View style={{display: arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==true?'flex':'none'}}>
                                        <SwipeListView
                                            data={tasks.filter(c=>(c.section==item.section && c.track==selectedTrack && c.taskState!==2 ))}
                                            renderItem={({item,index}) =>
                                            <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                                            sections={sections} date={new Date(item.year,item.month,item.day)} section={item.section} task={item.task} 
                                            taskState={item.taskState} time={undefined} track={selectedTrack} id={item.id} trackScreen={true} 
                                            archive={false} recurring={0} tabcolor={selectedTrackColor}
                                            editIndex={editIndex} setEditIndex={setEditIndex} index={index} selectedSection={selectedSection} setSelectedSection={setSelectedSection}/>
                                            }
                                            renderHiddenItem={({ item }) => <TaskSwipeItem id={item.id} />} 
                                            bounces={false} 
                                            rightOpenValue={-150}
                                            disableRightSwipe={true}
                                            closeOnRowBeginSwipe={true}
                                            onRowDidOpen={onRowDidOpen}
                                            keyExtractor= {(item,index) => index.toString()}
                                        />
                                        <SwipeListView
                                            data={progress.filter(c=>(c.list==item.section && c.track==selectedTrack && c.progress!==100))}
                                            renderItem={({item,index}) =>
                                            <>
                                            { selectedProgress!==index && (
                                            <ProgressBar db={db} name={item.name} progress={progress} setProgress={setProgress} value={item.progress} 
                                            id={item.id} color={selectedTrackColor} editIndex={editIndex2} setEditIndex={setEditIndex2} index={index}
                                            section={item.list} selectedSection={selectedSection} setSelectedSection={setSelectedSection}/>
                                            )}
                                            </>
                                            }
                                            renderHiddenItem={({ item }) => <ProgressSwipeItem id={item.id} />} 
                                            bounces={false} 
                                            rightOpenValue={-50}
                                            disableRightSwipe={true}
                                            closeOnRowBeginSwipe={true}
                                            onRowDidOpen={onRowDidOpen}
                                            keyExtractor= {(item,index) => index.toString()}
                                        />
                                        <SwipeListView
                                            data={statusrecords.filter(c=>(c.section==item.section && c.track==selectedTrack && c.archive==false))}
                                            renderItem={({item,index}) =>
                                            <Status db={db} name={item.name} list={item.list} statuslist={statuslist} statusrecords={statusrecords} 
                                            setStatusrecords={setStatusrecords} number={item.number} id={item.id}
                                            editIndex={editIndex3} setEditIndex={setEditIndex3} index={index}
                                            section={item.section} selectedSection={selectedSection} setSelectedSection={setSelectedSection}/>
                                            }
                                            renderHiddenItem={({ item }) => <StatusSwipeItem id={item.id} reverse={false}/>} 
                                            bounces={false} 
                                            rightOpenValue={-100}
                                            disableRightSwipe={true}
                                            closeOnRowBeginSwipe={true}
                                            onRowDidOpen={onRowDidOpen}
                                            keyExtractor= {(item,index) => index.toString()}
                                        />
                                        <View style={{flex:1, backgroundColor: colors.primary.white, flexDirection:'row', justifyContent:'flex-end'}}>
                                            <TouchableOpacity onPress={()=>{setIsLoading(true);setDeleteSection(index);setSelectedSection(item.section);setDeleteSectionVisible(true)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                                <Feather name='trash-2' size={25} color={colors.primary.purple}  />
                                            </TouchableOpacity>  
                                            <TouchableOpacity onPress={()=>{setNewStatusVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                                <Entypo name="progress-full" size={25} color={colors.primary.purple}  />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{setNewProgressVisible(true);setSelectedSection(item.section);setSelectedProgress(progress.length)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                                <Entypo name="progress-two" size={25} color={colors.primary.purple}  />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{setNewTaskVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                                <Feather name='check-square' size={25} color={colors.primary.purple}  />
                                            </TouchableOpacity> 
                                        </View>
                                    </View>
                                    <NewTask addModalVisible={newTaskVisible} setAddModalVisible={setNewTaskVisible} db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} track={selectedTrack} section={selectedSection} pageDate={undefined} tracksScreen={true} monthly={false}/>
                                    <NewProgress addModalVisible={newProgressVisible} setAddModalVisible={setNewProgressVisible} db={db} progress={progress} setProgress={setProgress} track={selectedTrack} section={selectedSection}/>
                                    <NewStatus newStatusVisible={newStatusVisible} setNewStatusVisible={setNewStatusVisible} db={db} statuslist={statuslist} setStatuslist={setStatuslist} statusrecords={statusrecords} setStatusrecords={setStatusrecords} selectedTrack={selectedTrack} selectedSection={selectedSection}/>
                                </View>
                                }
                                keyExtractor= {(item,index) => index.toString()}
                                contentContainerStyle={{width:"100%"}}
                                showsHorizontalScrollIndicator={false}
                                bounces={false}
                            />
                            <NewSection db={db} sections={sections} setSections={setSections} track={selectedTrack} newSectionVisible={newSectionVisible} setNewSectionVisible={setNewSectionVisible}/>
                            <NewTrack db={db} tracks={tracks} setTracks={setTracks} newTrackVisible={newTrackVisible} setNewTrackVisible={setNewTrackVisible} setSelectedTrack={setSelectedTrack} setSelectedTrackColor={setSelectedTrackColor}/>
                            <View style={{width:'100%'}}>
                                <View style={[container.section,{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', borderBottomLeftRadius:20, borderBottomRightRadius:20, backgroundColor: paleColor(selectedTrackColor)}]}> 
                                    <Text>ARCHIVES</Text>
                                    <Pressable onPress={()=>setShowArchive(true)} style={{display:showArchive==false?"flex":"none",position:'absolute',right:10}}>
                                        <MaterialIcons name="keyboard-arrow-up" size={25}/>
                                    </Pressable>
                                    <Pressable onPress={()=>setShowArchive(false)}  style={{display:showArchive==true?"flex":"none",position:'absolute',right:10}}>
                                        <MaterialIcons name="keyboard-arrow-down" size={25}/>
                                    </Pressable>
                                </View>
                                <View style={{display: showArchive==true?"flex":"none",maxHeight:200,justifyContent:'flex-start'}}>
                                    <SwipeListView
                                            data={tasks.filter(c=>(c.track==selectedTrack && c.taskState==2 ))}
                                            renderItem={({item,index}) =>
                                            <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                                            sections={sections} date={undefined} section={item.section} task={item.task} 
                                            taskState={item.taskState} time={undefined} track={selectedTrack} id={item.id} trackScreen={true} archive={true}
                                            editIndex={editIndex4} setEditIndex={setEditIndex4} index={index}/>
                                            }
                                            renderHiddenItem={({ item }) => <ArchiveTaskSwipeItem id={item.id} />} 
                                            bounces={false} 
                                            rightOpenValue={-50}
                                            disableRightSwipe={true}
                                            closeOnRowBeginSwipe={true}
                                            onRowDidOpen={onRowDidOpen}
                                            keyExtractor= {(item,index) => index.toString()}
                                    />
                                    <SwipeListView
                                            data={progress.filter(c=>(c.track==selectedTrack && c.progress==100))}
                                            renderItem={({item,index}) =>
                                                <View style={{height:40,width:width*0.9,backgroundColor:colors.primary.white,flexDirection:'row'}}>
                                                    <View style={{width:width*0.9-110,justifyContent:'center',paddingLeft:10}}>
                                                        <Text>{item.name}</Text>
                                                    </View>
                                                    <FlatList
                                                    horizontal
                                                    data={[{'name':item.name,'rate':1},{'name':item.name,'rate':2},{'name':item.name,'rate':3},{'name':item.name,'rate':4},{'name':item.name,'rate':5}]}
                                                    renderItem={({ item,index }) => 
                                                        <Pressable onPress={()=>{
                                                            let existingprogress = [...progress]; 
                                                            const id=progress.filter(c=>(c.name==item.name && c.track==selectedTrack)).map(c=>c.id)[0];
                                                            const progressIndex = progress.findIndex(c=>(c.name==item.name && c.track==selectedTrack));
                                                            db.transaction(tx=> {
                                                                tx.executeSql('UPDATE progress SET rate = ? WHERE id=?', [item.rate,id],
                                                                    (txObj, resultSet) => {
                                                                    if (resultSet.rowsAffected > 0) {
                                                                        existingprogress[progressIndex].rate = item.rate;
                                                                        setProgress(existingprogress);
                                                                    }
                                                                    },
                                                                    (txObj, error) => console.log('Error updating data', error)
                                                                );
                                                            });
                                                        }} style={{justifyContent:'center'}}>
                                                            <Ionicons name="star" size={20} color={item.rate<=progress.filter(c=>(c.track==selectedTrack&&c.name==item.name)).map(c=>c.rate)[0]?selectedTrackColor:'transparent'}/>
                                                            <View style={{position:'absolute'}}>
                                                                <Ionicons name="star-outline" size={20} />
                                                            </View>
                                                        </Pressable>
                                                    }
                                                    contentContainerStyle={{width:130}}
                                                    scrollEnabled={false}
                                                    />
                                                </View>
                                            }
                                            renderHiddenItem={({ item }) => <ProgressSwipeItem id={item.id} />} 
                                            bounces={false} 
                                            rightOpenValue={-50}
                                            disableRightSwipe={true}
                                            closeOnRowBeginSwipe={true}
                                            onRowDidOpen={onRowDidOpen}
                                            keyExtractor= {(item,index) => index.toString()}
                                    />
                                    <SwipeListView
                                        data={statusrecords.filter(c=>(c.track==selectedTrack && c.archive==true))}
                                        renderItem={({item,index}) =>
                                        <Status db={db} name={item.name} list={item.list} statuslist={statuslist} statusrecords={statusrecords} 
                                        setStatusrecords={setStatusrecords} number={item.number} id={item.id}
                                        editIndex={editIndex6} setEditIndex={setEditIndex6} index={index}
                                        section={item.section} selectedSection={selectedSection} setSelectedSection={setSelectedSection}/>
                                        }
                                        renderHiddenItem={({ item,index }) => <StatusSwipeItem id={item.id} reverse={true}/>} 
                                        bounces={false} 
                                        rightOpenValue={-100}
                                        disableRightSwipe={true}
                                        closeOnRowBeginSwipe={true}
                                        onRowDidOpen={onRowDidOpen}
                                        keyExtractor= {(item,index) => index.toString()}
                                    />
                                    
                                </View>
                                <View style={{width:'100%', borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                                    <View style={{ display: selectedTrack==undefined? "none":"flex", width: "100%", height: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <View style={{display: selectedTrack=='UNLISTED'?'none':'flex',justifyContent: 'center', alignItems: 'flex-end', marginVertical: 2, marginHorizontal: 2 }}>
                                            <TouchableOpacity>
                                                <Feather onPress={()=>setDeleteTrackVisible(true)} name='trash-2' size={30} color={colors.primary.purple}  />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 2, marginHorizontal: 2 }}>
                                            <TouchableOpacity onPress={()=>{setIsLoading(true);setNewSectionVisible(true);}}>
                                                <Feather name='plus-circle' size={30} color={colors.primary.purple}  />
                                            </TouchableOpacity>
                                        </View>
                                        <DeleteTrack deleteTrackVisible={deleteTrackVisible} setDeleteTrackVisible={setDeleteTrackVisible} tracks={tracks} setTracks={setTracks} db={db} setSelectedTrack={setSelectedTrack} selectedTrack={selectedTrack} sections={sections} setSections={setSections} tasks={tasks} setTasks={setTasks}/>
                                        <DeleteSection deleteSectionVisible={deleteSectionVisible} setDeleteSectionVisible={setDeleteSectionVisible} db={db} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} sections={sections} setSections={setSections} tasks={tasks} setTasks={setTasks} selectedSection={selectedSection} setSelectedSection={setSelectedSection} progress={progress} setProgress={setProgress} statusrecords={statusrecords} setStatusrecords={setStatusrecords}/>
                                    </View>
                                </View>
                            </View>  
                        </View>
                    </View>
                </Pressable>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default Tracks;
