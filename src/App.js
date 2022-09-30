import React, { useEffect, useState } from 'react';
import './App.css';
import Alert from './Alert';
import List from './List'
import 'bootstrap/dist/css/bootstrap.css';


const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if(list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({show: false, msg:'', type:''})


  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name) {
      // display alert here
      showAlert(true,'danger','Please enter value')
    } else if(name && isEditing) {
      setList(list.map(item => {
        if(item.id === editID) {
          return {...item, title:name}
        }
        return item
      }))
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true,'success','Item successfully edited')
    } else {
      showAlert(true,'success','Added new item')
      const newItem = {id: new Date().getTime().toString(), title: name}
      setList([...list,newItem])
      setName('')
    }
  }

  const showAlert = (show=false, type='', msg='') => {
    setAlert({show,type,msg})
  }

  // remove fnct

  const removeItem = (id) => {
    const newList = list.filter(item => item.id !== id)
    setList(newList)
    showAlert(true, 'danger', 'Successfully deleted the item')
  }

  // edit fnct
  const editItem = (id) => {
    const specificItem = list.find(item => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }


  // clear all fnct
  const clearAll = () => {
    setList([])
    showAlert(true,'danger','List cleared')
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
        <h3>grocery bud</h3>
        <div className='form-ctrl'>
          <input type='text' className='grocery' placeholder='e.g. milk' value={name} onChange={(e) => setName(e.target.value)}/>
          <button type='submit' className='btn btn-primary btn-sm'>{isEditing ? 'edit' : 'add'}</button>
        </div>
      </form>
        {list.length > 0 && (
      <div className='grocery-container'>
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className='clear-btn' onClick={() => clearAll()}>clear all</button>
      </div>
        )}
    </section>
  );
}

export default App;
