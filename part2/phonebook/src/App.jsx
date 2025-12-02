// App.jsx
import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

// Filter Component
const Filter = ({filter, handleFilterChange}) => (
  <div>
    <label>
      filter shown with <input value = {filter} onChange={handleFilterChange}/>
    </label>
  </div>    
)

//Person Form Component
const PersonForm =({addPerson, newName, handleNewNameChange, newNumber, handleNewNumberChange}) => (
  <form onSubmit ={addPerson}>
    <div>
      <label>
        name: <input value={newName} onChange={handleNewNameChange} />      
      </label>
    </div>

    <div>
      <label>
        number: <input value={newNumber} onChange={handleNewNumberChange} />  
      </label>
    </div>

    <button type="submit">add</button>    
  </form>
)


//Persons Component
const Persons = ({personsToShow, handleDelete}) => (
  <div>
    {personsToShow.map(({name, id, number}) => (
      <p key={id}> 
        {`${name}  ${number}  `} 
        <button onClick ={() => handleDelete (id,name)}> delete </button>
      </p>
    ))}       
  </div>
)


//App Component
const App = () => {

  // States
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState(null)
  


  //load db.json
  useEffect(() => {
    personService
      .getAll()
      //.then (initialPersons => setPersons(initialPersons))
      .then (setPersons)
  },[])

  //Notification Timing
  let timeoutId
  const showNotification = (text, type = 'success') => {
    setNotification({text, type})
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {setNotification(null)}, 3000)    
  }

  // Add new Person
  const addPerson = (event) => {
    event.preventDefault();

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    //check for empty fields
    if (!trimmedName || !trimmedNumber){
      alert (`Please enter both name and number`)
      return //exits
    }

    //check if person exist 
    const existingPerson = persons.find( //returns person Object
       person => person.name.toLowerCase().trim() === trimmedName.toLowerCase()
    )

    if (existingPerson) {     
      const confirmUpdate = window.confirm (`${existingPerson.name} is already added to the phonebook, replace the old number with the new one? ` )
      if (!confirmUpdate) return //exit

      const updatedPerson = {...existingPerson, number: trimmedNumber}
      handleUpdate (existingPerson.id, updatedPerson)
      setNewName('') 
      setNewNumber('')
      return //exit
    }

    //creates a new PersonObject
    const personObject = {name: trimmedName, number: trimmedNumber } 
    handleSave(personObject)

  }

  // Event Handler
  const handleNewNameChange = (event) => setNewName(event.target.value) 
  const handleNewNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  //Database Handler
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}`)
    if (!confirmDelete) return
    personService
      .remove(id)
      .then (() => {setPersons(prevPersons => prevPersons.filter(person => person.id !== id) )})
      .catch(() => showNotification("Could not delete — person may already be removed", "error")
)
  }

  const handleUpdate = (id, updatedPerson) => {
    personService
      .update(id, updatedPerson)
      .then( updated => {
        setPersons(prevPersons => prevPersons.map(person => person.id!==id ? person : updated) )
        showNotification(`Updated ${updatedPerson.name}`)
      })
      .catch ( () => {
        // alert (`${updatedPerson.name} was already removed from the server`)
        showNotification(`${updatedPerson.name} was already removed from the server`, 'error')
        setPersons(prevPersons => prevPersons.filter(person => person.id!==id )   )})
  }
  
  const handleSave = (personObject) =>{
    personService
      .create(personObject)
      .then(postedPersonObject =>{
        setPersons(prevPersons => prevPersons.concat(postedPersonObject))  //id added  
        showNotification(`Added ${personObject.name}`)
        //clears the fields
        setNewName('')
        setNewNumber('')
      }) 
      .catch(error => {
        // alert('Failed to add the person to the phonebook')  
        showNotification(`Failed to add ${personObject.name} to the phonebook`, 'error')
        console.error(error)
      })
  }


  //filter logic
  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification}/>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson = {addPerson}
        newName = {newName}
        handleNewNameChange = {handleNewNameChange}
        newNumber = {newNumber}
        handleNewNumberChange = {handleNewNumberChange}
      />
      <h3>Numbers</h3>      
      <Persons 
        personsToShow = {personsToShow}
        handleDelete = {handleDelete}
      />
    </div>
  )
}

export default App
