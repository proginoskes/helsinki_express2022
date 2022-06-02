require('dotenv').config()

const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./models/persons');


morgan.token('response-body', function getId (req, res) {
    return JSON.stringify(req.body)
})

// is this legal?? do we need to make this immutable?
//let persons = require('./db.json');

// json parser for POST
app.use(express.json())

// static page server from express
app.use(express.static('build'))

// morgan for request logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-body'))

// cors for cross origin resource sharing
app.use(cors());

//utilities
// const generateID = () =>{
//     const maxID=persons.length>0
//         ? Math.max(...persons.map(n=>n.id))
//         : 0
//     return maxID+1
// }

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

app.get('/api/persons/:id', (request,response)=>{
    //console.log(persons);
    const curr_id=Number(request.params.id);
    // const person=persons.find(person=>{
    //     return person.id===curr_id;
    // });

    Person.find({id:curr_id}).then(person => {
        response.json(person)
    }).catch(()=>
        response.status(404).end()
    )

})

app.delete('/api/persons/:id', (request, response)=>{
    const id=Number(request.params.id);
    persons=persons.filter(person=>person.id!==id);
    //console.log(persons);
    response.status(204).end()
})

// add a number
app.post('/api/persons', (request, response)=>{
    const body = request.body;
    
    if(!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if(persons.some(person=>person.name==body.name)){
        return response.status(400).json({
            error: 'name already in phonebook'
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    
    Object.assign(persons, [...persons, person]);

    response.json(person)
})

const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})