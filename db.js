import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


const useDatabase = () => {
  const [db,setDb] = useState(SQLite.openDatabase('todo.db'));
  const [tasks, setTasks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [sections, setSections] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [statuslist, setStatuslist] = useState([]);
  const [statusrecords, setStatusrecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mlogs, setmLogs] = useState([]);
  const [settings, setSettings] = useState([]);


  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tracks (id TEXT PRIMARY KEY, name TEXT, color TEXT, UNIQUE(name))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tracks', null,
      (txObj, resultSet2) => setTracks(resultSet2.rows._array),
      (txObj, error) => console.log('error selecting tracks')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, task TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, recurring BOOLEAN, monthly BOOLEAN, track TEXT, time TEXT, section TEXT, creationdate TEXT, completiondate TEXT, postpone INTEGER, notes TEXT, UNIQUE(task,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet3) => setTasks(resultSet3.rows._array),
      (txObj, error) => console.log('error selecting tasks')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, name TEXT, track TEXT, UNIQUE(name,track))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sections', null,
      (txObj, resultSet13) => setSections(resultSet13.rows._array),
      (txObj, error) => console.log('error selecting section')
      );
    });
 
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sliders (id TEXT PRIMARY KEY, name TEXT, track TEXT, section TEXT, sliders INTEGER, rate INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sliders', null,
      (txObj, resultSet14) => setSliders(resultSet14.rows._array),
      (txObj, error) => console.log('error selecting sliders')
      );
    });


    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS statuslist (id TEXT PRIMARY KEY, name TEXT, item TEXT, color TEXT, number INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM statuslist', null,
      (txObj, resultSet18) => setStatuslist(resultSet18.rows._array),
      (txObj, error) => console.log('error selecting statuslist')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS statusrecords (id TEXT PRIMARY KEY, name TEXT, track TEXT, section TEXT, list TEXT, number INTEGER, archive BOOLEAN, UNIQUE(name,list))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM statusrecords', null,
      (txObj, resultSet19) => setStatusrecords(resultSet19.rows._array),
      (txObj, error) => console.log('error selecting status records')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM logs', null,
      (txObj, resultSet) => setLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting logs')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, UNIQUE(year,month))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mlogs', null,
      (txObj, resultSet) => setmLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting mlogs')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, highlight TEXT, postpone BOOLEAN, started BOOLEAN, notifications BOOLEAN, expirytime INTEGER, weekstart BOOLEAN)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM settings', null,
      (txObj, resultSet) => setSettings(resultSet.rows._array),
      (txObj, error) => console.log('error selecting settings')
      );
    });
  
  },[,tasks.length, sliders.length, statuslist.length, statusrecords.length, sections.length, tracks.length, logs.length, mlogs.length]);

  return {
    tasks,
    tracks,
    db,
    sections,
    sliders,
    statuslist,
    statusrecords,
    logs,
    mlogs,
    settings,
    setTasks,
    setTracks,
    setDb,
    setSections,
    setSliders,
    setStatuslist,
    setStatusrecords,
    setLogs,
    setmLogs,
    setSettings,
  };
};

export default useDatabase;
