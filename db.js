import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


const useDatabase = () => {
  const [db,setDb] = useState(SQLite.openDatabase('todo.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState([]);
  const [statuslist, setStatuslist] = useState([]);
  const [statusrecords, setStatusrecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mlogs, setmLogs] = useState([]);
  const [settings, setSettings] = useState([]);


  useEffect(() => {
    setIsLoading(true);

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tracks (id TEXT PRIMARY KEY, track TEXT, color TEXT, UNIQUE(track))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tracks', null,
      (txObj, resultSet2) => setTracks(resultSet2.rows._array),
      (txObj, error) => console.log('error selecting tracks')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, monthly BOOLEAN, track TEXT, time TEXT, section TEXT, UNIQUE(task,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet3) => setTasks(resultSet3.rows._array),
      (txObj, error) => console.log('error selecting tasks')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, section TEXT, track TEXT, UNIQUE(section,track))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sections', null,
      (txObj, resultSet13) => setSections(resultSet13.rows._array),
      (txObj, error) => console.log('error selecting section')
      );
    });
 
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, name TEXT, track TEXT, list TEXT, progress INTEGER, rate INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM progress', null,
      (txObj, resultSet14) => setProgress(resultSet14.rows._array),
      (txObj, error) => console.log('error selecting progress')
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
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

    setIsLoading(false);
  
  },[load]);

  return {
    isLoading,
    tasks,
    tracks,
    load,
    db,
    sections,
    progress,
    statuslist,
    statusrecords,
    logs,
    mlogs,
    settings,
    loadx,
    setTasks,
    setTracks,
    setDb,
    setIsLoading,
    setSections,
    setProgress,
    setStatuslist,
    setStatusrecords,
    setLogs,
    setmLogs,
    setSettings,
  };
};

export default useDatabase;
