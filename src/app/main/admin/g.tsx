"use client"
import 'react-data-grid/lib/styles.css';

import 'react-data-grid/lib/styles.css';

import { DataGrid, type Column } from 'react-data-grid';

interface Row {
  id: number;
  title: string;
}

const columns: Column<Row>[] = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' },
  { key: 'title2', name: 'Title2' },
  { key: 'title3', name: 'Title3' }
];

const rows: Row[] = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
  { id: 2, title: 'Demo' },
  { id: 3, title: 'Demo' }
];

function App2() {
  return <DataGrid columns={columns} rows={rows}  className='h-full bg-white shadow-md rounded-xl drop-shadow-lg p-4'/>;
}

export default App2;