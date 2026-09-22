const http = require('http');
const fs= require('fs');
const path = require('path');

console.log(__dirname);
console.log(__filename);

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        
        fs.readFile(path.join(__dirname,"index.html"),(err,data)=>{
            if(err){
                res.writeHead(500);
                res.end("Error loading data");               
            }
            else{
                res.writeHead(200,{"content-type":'text/html'});
                res.end(data)
            }
        })
    }
    else if(req.url=="/contact"){
        fs.readFile(path.join(__dirname,"contact.html"),(err,data)=>{
            if(err){
                res.writeHead(500);
                res.end("Error loading data")
            }
            else{
                res.writeHead(200,{"content-type":'text/html'});
                res.end(data)
            }
        })
    }
    else{
        res.writeHead(400);
        res.end("Page not found")
    }
})

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
