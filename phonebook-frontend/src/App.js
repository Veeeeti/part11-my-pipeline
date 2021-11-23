import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons.js'
import './index.css'


const Filter = (props) => {
  return(
    <div>filter shown with <input value={props.newSearch} onChange={props.handleSearch}></input></div>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.addName}>
        <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
        <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = (props) => {
  return(
    <ul>
      {props.filtered.map((filt,i) => <li key={i}>{filt.name} {filt.number} 
      <button onClick={() => {
        if (window.confirm(`Delete ${filt.name}`)) {
          personsService
          .remove(filt.id)
          .catch(e => {props.setErrorMessage(`Note ${e.content} was already removed from server.`)
            setTimeout(() => {props.setErrorMessage(null)},5000)
          }
          )}
         }
        }>
        Delete
      </button></li>)}
    </ul>
  )
}

const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  return(
    <div className={props.style}>
      {props.message}
    </div>
  )
}

const App = () => {

  const [ persons, setPersons] = useState([]) 

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')

  const [ newSearch, setNewSearch] = useState('')
  const [ filtered, setFiltered ] = useState([])

  const [ errorMessage, setErrorMessage ] = useState('')
  const [ positiveMessage, setPositiveMessage ] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        console.log('response typeof', typeof response)
        console.log('response.data typeof', typeof response.data)
        setPersons(JSON.parse(response))
      }).catch(e => console.log(e))
  }, [ persons, newSearch ])
  

  const addName = (event) => {
    event.preventDefault()

    const newPersons = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService.update(persons.find(person => person.name === newPersons.name).id,newPersons)
      }
    } else {
      personsService
        .create(newPersons)
        .then(response => {
            setPersons(persons.concat(response.data))
            setNewName('')
            setNewNumber('')
        })
      setPositiveMessage(`Added ${newPersons.name}`)
      setTimeout(() => {setPositiveMessage(null)},5000)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  
  const handleSearch = (event) => {
    console.log('handleSearch',event.target.value)
    setNewSearch(event.target.value)
    if (newSearch.toString === '') {
      setFiltered(persons) 
    } else {
      setFiltered(persons.filter((person) => person.name.toLowerCase().includes(newSearch.toLowerCase())))
      console.log('filt',filtered)
    }
  }

  useEffect(() => {
    console.log('typeof persons:',typeof persons)
    console.log('persons:',persons)
    setFiltered(persons.filter((person) => person.name.toLowerCase().includes(newSearch.toLowerCase())))
  }, [ newSearch, persons ])

  const handleDelete = (props) => {
    if (window.confirm(`Delete`)) {
      console.log('window.confirm confirmed')
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={positiveMessage} style="positive"/>
      <Notification message={errorMessage} style="error"/>
      <Filter newSearch={newSearch} handleSearch={handleSearch}/>
      <h2>add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filtered={filtered} handleDelete={handleDelete} setErrorMessage={setErrorMessage}/>
    </div>
  )

}

export default App;
