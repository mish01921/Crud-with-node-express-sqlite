const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;

const db = new sqlite3.Database("db.sqlite")

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS  personData(id INTEGER PRIMARY KEY, fullName TEXT, address TEXT, phoneNumber TEXT, email TEXT) ");
});

app.use(bodyParser.json());
//read 
app.get('/personData', (req, res) => {
    db.serialize(() => {
        db.all('SELECT * FROM personData', [], (err, rows) => {
            res.json(rows);
        });
    })
})
//for seraching with id
app.get("/personData/:id", (req, res) => {
        db.all("SELECT * FROM personData where id = ?", [req.params.id],(err, rows) =>{
            res.json({
              "message":"success",
              "data":rows
        })
     })
})

//create new person
app.post ("/personData", (req, res) => {
    const {fullName, address, phoneNumber, email} = req.body;
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO personData(fullName, address, phoneNumber, email) VALUES(?,?,?,?) ")
        stmt.run(fullName,address,phoneNumber,email);
        stmt.finalize();
        res.send(req.body);
    });
});

//updated  with id 
app.patch('/personData/:id', (req, res) => {
    const { fullName, address, phoneNumber,email } = req.body;
    const { id } = req.params;
    db.serialize(() => {
        const stmt = db.prepare('UPDATE personData SET fullName = ?, address = ?, phoneNumber = ?, email = ? where id = ?');
        stmt.run(fullName, address,phoneNumber,email, id);
        stmt.finalize();
        res.json(req.body);
    })
})

//deleted  with id 
app.delete("/personData/:id", (req,res) => {
    const { id } = req.params;
    db.serialize(() => {
        const stmt = db.prepare('DELETE FROM personData WHERE id = ?');
        stmt.run(id);
        stmt.finalize();
        res.json(req.body);
    })
  })
// for starting port 
app.listen(port, () => {
    console.log(`Port working ${port}`)
})