import { useState, useEffect } from 'react'
import Service from './service'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='added'>
      {message}
    </div>
  ) 
}

const PersonForm = (props) => {
  return (
      <form onSubmit={props.onSubmit}>
          <div>
              name: <input value={props.newName} onChange={props.handleNewPerson} />
          </div>
          <div>
              number: <input value={props.newNumber} onChange={props.handleNewNumber}
              />
          </div>
          
          <div>
              <button type='submit'>add</button>
          </div>
      </form>
  )
}

const Persons = (props) => {
  const data = Array.from(props.listOfPersons)
  return (
    <div>
      <ul>      
    {data.map(person => <li key={person.name}> {person.name} {person.number} 
                <button onClick={() => props.handleDelete(person)}> Delete </button>  </li>)}

      </ul> 
    </div>
  )
}

const Filter = (props) => {
	return (
		<div>
			Search By Name: <input value = {props.value} onChange = {props.onChange} />
		</div>
	)
}

const App = () => {
  const [persons, setPersons] = useState([ ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName ] = useState("")
	const [filter, setFilter ] = useState(false)
  const [Message, setMessage] = useState(null) 

  useEffect(() => {
    Service
      .getAll()
			.then(response => {setPersons(response)})
		}, [])


  const addPerson = (event) => {
    event.preventDefault() 
    const data = Array.from(persons)

    if (data.findIndex((person) => person.name === newName) !== -1) { 
      if (window.confirm(`${newName} is already in the phonebook, do you want to update their number?`)){
        const foundPerson = persons.find( person => person.name === newName);
        const changedPerson = {... foundPerson, number: newNumber}

        Service
          .update(foundPerson._id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map( person => person._id !== foundPerson._id ? person: returnedPerson ))
            setMessage( `updated ${returnedPerson.name} `)
            setTimeout(() => {
              setMessage(null);
          }, 3000);
          });     
    }
    return
  }
      
    const personsObject = {
      name: newName,
      number: newNumber
    }

    Service
      .create(personsObject )
      .then((newperson) => {
      setPersons([...persons, newperson])
      setNewName('')
      setNewNumber('')
      setMessage( `added ${newperson.name} `)
      setTimeout(() => {
        setMessage(null);
    }, 3000);
    })
    .catch(error => {
      setMessage(`${error.response.data.error}`)
    });
  
  }
  

 const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) =>{
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
		setSearchName(event.target.value)
		setFilter(true)
	}

  const filterText = (text) => {
		const result = persons.filter(person => person.name.toLowerCase().split(" ").join("").indexOf(text.toLowerCase()) !== -1)	
		return result
	}

  const listOfPersons = filter ? filterText(searchName): persons

  const handleDelete = (deletedPerson)=>{
    if (window.confirm(`Do you want to delete ${deletedPerson.name} ?`)){
      Service 
      .deletePerson(deletedPerson._id)
      .then(
        setPersons(persons.filter((person) => person['_id'] !== deletedPerson['_id']))
      )
      
      setFilter('') 
  }}

  return(
    <div>
      <Notification message={Message} />
      <h2>Phonebook</h2>
      <div>
				<Filter  value = {searchName} onChange = {handleSearch} />
			</div>
              
      <h2>Add New Contact</h2>
     <PersonForm onSubmit={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleNewNumber={handleNewNumber}
                handleNewPerson = {handleNewPerson}
 
        />
      
      <h2>Phone Numbers:</h2>
    <Persons 
        listOfPersons={listOfPersons} name = {newName} number={newNumber} handleDelete ={handleDelete}>
    </Persons>
      <div>debug: {newName}</div>
    </div>
    )
  
}


export default App