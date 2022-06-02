require('dotenv').config()

const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./models/person');

morgan.token('response-body', function getId (req, res) {
    return JSON.stringify(req.body)
})


// json parser for POST
app.use(express.json())

// static page server from express
app.use(express.static('build'))

// morgan for request logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-body'))

// cors for cross origin resource sharing
app.use(cors());

//app.use(requestLogger)

// unknown endpoitn middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint

// error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }


// REST funcs
app.get('/', (request, response) => {
    response.send('<h1>Welcome to Phonebook Server</h1>')
})
app.get('/info', (request, response) => {
    Person.find({}).then(persons =>{
        response.send(
            `
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>
            `
        )
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    //console.log(persons);
    //response.json(persons)
})

app.get('/api/persons/:id', (request,response, next)=>{

    Person.findById(request.params.id).then(person => {
        if(person){
            response.json(person);
        }else{
            response.status(404).end();
        }
    }).catch((error)=>next(error));

})

app.delete('/api/persons/:id', (request, response, next)=>{
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error=>next(error));
})

// add a number
app.post('/api/persons', (request, response)=>{
    const body = request.body;
    
    if(body.name === undefined){
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(body.number===undefined){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body. number
    });

    person.save().then(savedPerson =>{
        response.json(savedPerson);
    });

})

// update a number
app.put('/api/persons/:id', (request,response,next)=>{
    const body = response.body;

    const person ={
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));

})

// this has to be the last loaded middleware.
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})