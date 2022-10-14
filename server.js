const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuid } = require('uuid');
const fs = require('fs');

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
  
      // Convert the data to a string so we can save it
      // const reviewString = JSON.stringify(newNotes);
  
      // Write the string to a file
      fs.readFile(`./db/db.json`, "utf8", (err,data) => {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNotes);
        const stringifiedNotes = JSON.stringify(parsedNotes, null, 4);
  
        fs.writeFile(`./db/db.json`, stringifiedNotes, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Review for ${newNotes.title} has been written to JSON file`
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
      res.status(500).json('Error in posting review');
    }
  });

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
