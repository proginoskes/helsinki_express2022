const mongoose = require('mongoose')

// function definitions //////////
const printRecord = (rec) => {
    console.log(`${rec.name}: ${rec.number}`)
}

const processQuery = (args) => {
    if(args.length === 3){
        console.log('~~~all records~~~')
        mongoose
            .connect(url)
            .then(
                Person.find({}).then(result=>{
                    result.forEach(person=>{
                        printRecord(person)
                    })
                    mongoose.connection.close()
                })
            )
    }else if(args.length === 4){
        const query_name = args[3]
    
        
        mongoose
            .connect(url)
            .then(
                Person.find({name:query_name}).then(result=>{
                    result.forEach(person=>{
                        printRecord(person)
                    })
                    mongoose.connection.close()
                })
            )
    }else if(args.length === 5){
        const new_name = args[3]
        const new_number = args[4]
    
        mongoose
            .connect(url)
            .then(()=>{
                console.log('connected to database')
                
                const person = new Person({
                    name: new_name,
                    number: new_number
                })
        
                return person.save()
            })
            .then((response)=>{
                console.log('added record')
                printRecord(response)
                return mongoose.connection.close()
            })
            .catch((err)=>console.log(err))
    }
}
// end of function definitions //////////

if(process.argv.length < 3){
    console.log('Please provide password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://proginoskes:${password}@proginohelsinki.zn6w1nb.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

processQuery(process.argv)

