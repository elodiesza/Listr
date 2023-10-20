
{/*import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';

//import * as XLSX from 'xlsx/xlsx';
const XLSX = require('xlsx/xlsx');

// Load the Excel file
const workbook = XLSX.readFile('./Book1.xlsx');

// Choose the sheet you want to work with (assuming it's the first sheet)
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet data into JSON format
const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Extract headers (column names) from the first row of the sheet
const headers = jsonData[0];

// Transform the data into an array of objects
const dataArray = [];
for (let i = 1; i < jsonData.length; i++) {
  const rowData = {};
  for (let j = 1; j < headers.length; j++) { // Start from 1 to skip the first 'undefined' column
    rowData[headers[j]] = jsonData[i][j];
  }
  dataArray.push(rowData);
}

// Export the dataArray

//const data= dataArray[0];
//export default data;

//const rowIndex = 3; // Index of the row (0-based)
//const columnIndex = 20; // Index of the column (0-based)

//console.log(columnNames[0] + ' : ' + row[columnNames[0]]);
//console.log(columnNames[1] + ' : ' + row[columnNames[1]]);
//console.log(columnNames[2] + ' : ' + row[columnNames[2]]);
//console.log(columnName + ' : ' + value);

function dbValue(data, rowIndex, columnIndex) {
  if (data.length > rowIndex) {
    const row = data[rowIndex];
    const columnNames = Object.keys(row);
  
    if (columnNames.length > columnIndex) {
      const columnName = columnNames[columnIndex];
      const value = row[columnName];
      return value;
    } else {
      console.log("Column index is out of bounds.");
    }
  } else {
    console.log("Row index is out of bounds.");
  }
}

module.exports = {
  dataArray,
  dbValue,
};

console.log(dbValue(dataArray, 3, 1)+Object.keys(dataArray[0])[1]+dataArray.length);

//from column 20 to 54 = habits
{/*}
const db = SQLite.openDatabase('example.db');
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [habits, setHabits] = useState([]);


  useEffect(() => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, type INTEGER, track INTEGER, place INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM habits ORDER BY place,day;', null,
      (txObj, resultSet) => setHabits(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    let existinghabits = [...habits]; 
    for (let i = 20; i < 55; i++) {
      var newPlace = [... new Set(existinghabits.map(c => c.name))].length;
      for (var j=1; i<dataArray.length; j++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO habits (id,name, year, month, day, state, type, track, place) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)',
              [ uuid.v4(),Object.keys(dataArray[j])[i], dbValue(dataArray, j, 1), dbValue(dataArray, j, 2), dbValue(dataArray, j, 3), 0, type, 0, newPlace],
              (txtObj,) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  state: 0,
                  type: type,
                  track: 0,
                  place: newPlace,
                };
                existinghabits.push(newState);
                setHabits(existinghabits); // Update the state with the new array of habits
                loadx(!load);
              }
            );
        });
      }
    }
  });

*/}

const XLSX = require('xlsx'); // Make sure you have the 'xlsx' library installed

const readExcelFile = async () => {
  try {
    const workbook = XLSX.readFile('../../assets/data/Book1.xlsx');
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    return excelData;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

module.exports = readExcelFile;