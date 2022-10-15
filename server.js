const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuid } = require('uuid');
const fs = require('fs');
const { nextTick } = require('process');

// const { handleNoteSave} = require('./public/assets/js/index');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

  
app.get('/api/notes', (req, res) => {
  fs.readFile(`./db/db.json`, "utf8", (err,data) => {
  const parsedNotes = JSON.parse(data);
  res.json(parsedNotes);
})
});
 


app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text,} = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNotes = {
        title,
        text,
        id: uuid(),
      };
  
  
      // Write the string to a file
      fs.readFile(`./db/db.json`, "utf8", (err,data) => {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNotes);
        const stringifiedNotes = JSON.stringify(parsedNotes, null, 4);
  
        fs.writeFile(`./db/db.json`, stringifiedNotes, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Note for ${newNotes.title} has been written to JSON file`
            )
      );
      }
      
      );
  
      const response = {
        status: 'success',
        body: newNotes,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

  app.delete('/api/notes/:id', (req,res,next) => {
  fs.readFile(`./db/db.json`, "utf8", (err,data) => {
    let parsedNotes1 = JSON.parse(data);
    for(let i = 0; i < parsedNotes1.length; i++ ){
      if(req.params.id === parsedNotes1[i].id){
        parsedNotes1.splice(i, 1);
        }
      }
      const stringifiedNotes1 = JSON.stringify(parsedNotes1, null, 4);
      fs.writeFile(`./db/db.json`, stringifiedNotes1, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Note  has been deleted from JSON file`
            )
      );
      next();
    });
    
})

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });


   
