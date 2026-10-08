const express = require("express");


const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    console.log("Middleware 1 executed");
    console.log("Method",req.method);
    
    // res.send("You are returned")
    next()
})

app.use((req,res,next)=>{
    console.log("Middleware 2 executed");
    req.className="ReactJS"
    next()
})

app.get('/',(req,res)=>{
    console.log(req.className);
    res.send(`Welcome to our page`)
})

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});