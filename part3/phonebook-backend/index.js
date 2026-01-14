//index.js

require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const path = require('path') // 3.11 
const app = express()
const PORT = process.env.PORT || 3001; //for render


// --- CONNECTING TO MONGODB ---
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => 
    {    console.log('connected to MongoDB')  })
  .catch((error) => 
    {   console.log('error connecting to MongoDB:', error.message)  })


// --- MIDDLEWARE ---
app.use(express.json())
app.use(express.static('dist')) // 3.11


//3.7: Phonebook backend step 7
// app.use(morgan('tiny')) // overwritten by 3.8


//3.8: Phonebook backend step 8
morgan.token('body', (request) => { // custom token
  return JSON.stringify(request.body)
})

app.use(    // morgan with body logging
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


// requestlogger
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)


// // --- DATA ---
// let persons = [
//   { id: "1", name: "Arto Hellas", number: "040-123456" },
//   { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: "3", name: "Dan Abramov", number: "12-43-234345" },
//   { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
// ]


// // 3.1: Phonebook backend step 1
// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

// 3.1: Phonebook backend (modified for 3.9)
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then (persons => { response.json(persons)  })
})


// // 3.2: Phonebook backend step 2
// app.get('/info', (request, response) => {
//   const numberOfEntries = persons.length
//   const currentTime = new Date()
//   response.send
//   (`<div>
//       <p>Phonebook has info for ${numberOfEntries} people</p>
//       <p>${currentTime}</p>
//     </div>`)
// })


// 3.2: Phonebook backend step 2 (modified for 3.9)
app.get('/info', (request, response) => {
    Person.find({})
        .then (persons => {
            const numberOfEntries = persons.length
            const currentTime = new Date()
            response.send
            (`<div>
                <p>Phonebook has info for ${numberOfEntries} people</p>
                <p>${currentTime}</p>
            </div>`)
        })
        .catch (error => {
            response.status(400).json({error: `info not found` })
        })
})



// //3.3: Phonebook backend step 3
// app.get('/api/persons/:id', (request, response) => {
//     const id = request.params.id;
//     const person = persons.find(person => person.id === id)
//     if (person)     {   response.json(person)   } 
//     else            {   response.status(404).end()  }      
// })


// 3.3: Phonebook backend step 3 (modified for 3.9)
app.get(`/api/persons/:id`, (request, response) => {
    Person.findById(request.params.id)
        .then (person => {
            if (person)     {   response.json(person)  }
            else            {   response.status(404).end()  }
        })
        .catch (error => {
            response.status(400).json({error: `malformatted id` })
        })
})



// //3.4: Phonebook backend step 4
// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id;

//     persons = persons.filter(person => person.id !== id)
//     console.log(persons)
//     response.status(204).end()
// })

//3.4: Phonebook backend step 4 (modified for 3.9)
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove (request.params.id)
        .then (result => {
            if (result) response.status(204).end()
            else        response.status(404).end()    
        })   
        .catch( error => 
            response.status(400).json({ error: `malformatted id` })    
        )
})


// //3.5-3.6: Phonebook backend step 5 & 6
// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     // 1. name or number missing
//     if (!body.name || !body.number) {
//        return response.status(400).json({error: 'name or number missing'})
//     }

//     // 2. name must be unique
//     const nameExist = persons.find(person => person.name === body.name)

//     if (nameExist) {
//         return response.status(400).json({error: 'name must be unique'})
//     }

//     const person = {
//         id: Math.floor(Math.random() * 10000).toString(), 
//         name: body.name, 
//         number: body.number
//     }

//     persons = persons.concat(person)
//     response.json(person)

// })


//3.5-3.6: Phonebook backend step 5 & 6 (modified for 3.9)
app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
        name: body.name, 
        number: body.number        
    })

    person.save()
        .then( savedPerson => 
            response.json(savedPerson)  
        )
        .catch( error => 
            response.status(400).json({ error: error.message })    
        )
})
//  --- Catch All endpoint
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})


// --- UNKNOWN ENDPOINT MIDDLEWARE ---
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})