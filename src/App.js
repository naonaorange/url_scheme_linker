/*global chrome*/
import React, { useEffect, useState } from 'react'

function App() {
  const version = '1.2';
  const [cells, setCells] = useState([
    { urlscheme: '', url: ''},
    { urlscheme: '', url: ''},
    { urlscheme: '', url: ''},
  ])

  useEffect(() => {
    load();
  }, [])


  const onChangeCell = (index, key) => (
    event
  ) => {
    const _cells = [...cells]
    _cells[index] = { ..._cells[index], [key]: event.target.value }
    setCells(_cells)
  }

  const save = () => {
    const urlscheme0 = cells[0].urlscheme;
    const urlscheme1 = cells[1].urlscheme;
    const urlscheme2 = cells[2].urlscheme;
    const url0 = cells[0].url;
    const url1 = cells[1].url;
    const url2 = cells[2].url;
    try{
      chrome.storage.local.set({
        'urlscheme0': urlscheme0, 'urlscheme1': urlscheme1, 'urlscheme2': urlscheme2,
        'url0': url0, 'url1': url1, 'url2': url2, 'version': version,
      }, () => {alert('The parameter is changed.')});
    }
    catch(e){
    }
  }

  const load = () => {
    try{
      chrome.storage.local.get(['urlscheme0', 'urlscheme1', 'urlscheme2', 'url0', 'url1', 'url2'], (value) => {
        setCells([
          { urlscheme: value.urlscheme0, url: value.url0},
          { urlscheme: value.urlscheme1, url: value.url1},
          { urlscheme: value.urlscheme2, url: value.url2}
        ]);
      });
    }
    catch(e){
    }
  }
  
  const exportToJson = async () => {
    const saveFileOptions = {
      types: [
        {accept: {"application/json": [".json"],},},
      ],
    };
    try{
      const textContent = JSON.stringify(cells);
      const handle = await window.showSaveFilePicker(saveFileOptions);
      await writeFile(handle, textContent);
    }
    catch(e){
      alert(e);
    }
  }

  const writeFile = async (fileHandle, contents) => {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  const importFromJson = async () => {
    const options = {
      types: [
        {accept: {"application/json": [".json"],},},
      ],
    };
    try{
      const [handle] = await window.showOpenFilePicker(options);
      const file = await handle.getFile();
      const text = await file.text();
      const j = JSON.parse(text);
      setCells(j);
      alert('The parameter is imported.')
    }
    catch(e){
      alert(e)
    }
  }
  

  return (
    <div>
      <h1>URL Scheme Linker Setting</h1>
      <h3>URL Scheme:</h3>
      <a>URL scheme prefix string if it meet URL pattern.</a>
      <h3>URL Pattern:</h3>
      <a>URL pattern: URL string pattern for search</a>
      <h3></h3>
      <a>*Please re-open Chrome if you save the parameter.</a>
      <h3></h3>
      <table>
        <thead>
          <tr>
            <td>{'URL Scheme'}</td>
            <td>{'URL Pattern'}</td>
          </tr>
        </thead>
        <tbody>
          {cells.map((cell, i) => (
            <tr key={i}>
              <td>
                <input onChange={onChangeCell(i, 'urlscheme')} value={cell.urlscheme} />
              </td>
              <td>
                <input onChange={onChangeCell(i, 'url')} value={cell.url} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button  onClick={() => {save()}}>Save to internal strage</button>
      <button  onClick={() => {exportToJson()}}>Export to json file</button>
      <button  onClick={() => {importFromJson()}}>Import from json file</button>
    </div>
  );
}

export default App;