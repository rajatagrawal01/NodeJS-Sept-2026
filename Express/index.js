const express = require('express')

let app=express()

app.get('/',(req,res)=>{
    res.send("Welcome to Node JS")
})


// app.get('/about',(req,res)=>{
//     res.send("Welcome to About Page")

// })
// app.get('/contact',(req,res)=>{
//     res.send("Welcome to Contact Page")

// })
// app.get('/info',(req,res)=>{
//     res.send("Welcome to Info Page")

// })

app.get('/users',(req,res)=>{
    
    res.send("Welcome to Users Page")
})
app.post('/users',(req,res)=>{
    res.send("This is create user method")
})

app.put('/users',(req,res)=>{
    res.send("This is Edit user method")
})

app.delete('/users',(req,res)=>{
    res.send("This is Delete user method")
})


app.listen(5000,()=>{
    console.log('Server Started at port 5000');
})