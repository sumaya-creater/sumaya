const express = require("express");
const Sqlite = require("sqlite3");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const db = new Sqlite.Database("./database/attendanceList.db", (err) => {
  if (err) {
    console.log("failed to create db", err);
  } else {
    console.log("database is connected successfully");
  }
});

db.run(`
    CREATE TABLE IF NOT EXISTS attendanceList( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, location TEXT NOT NULL, age INTEGER NOT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
    `);

db.run(`
      CREATE TABLE IF NOT EXISTS studentGrade( id INTEGER , subjectSelected TEXT NOT NULL, TypeSelected TEXT NOT NULL, point INTEGER NOT NULL,maxPoint INTEGER NOT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
      `);


app.get("/", (req, res) => {
  db.all(`SELECT * FROM attendanceList ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }

    const response = res.json(rows);
    console.log("this is the response", response);
    return response;
  });
});
app.get("/grade/:id", (req, res) => {
  const id = req.params.id
  db.all(`SELECT * FROM studentGrade WHERE id = ? ORDER BY created_at DESC`,[id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }

    const response = res.json(rows);
    console.log("this is the response", response);
    return response;
  });
});

app.get("/student/:id", (req, res) => {
  const studentId = req.params.id

  db.all(`SELECT * FROM attendanceList WHERE id = ?`,[studentId], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500);
    }

    const response = res.json(rows);
    console.log("this is the response", response);
    return response;
  });
});

app.post("/api/save", (req, res) => {
  const { userName, userLocation, userAge } = req.body;
  //   console.log("this is the username;", { userName, userEmail, userPassword });

  if (!userName | !userLocation | !userAge) {
    return console.log("all field is required");
  }

  const query = `INSERT INTO attendanceList (userName,location,age) VALUES (?,?,?)`;

  db.run(query, [userName, userLocation, userAge], (err) => {
    if (err) {
      return console.log("there is an error saving data", err);
    }
    res.json({ success: true });
  });
});
app.post("/api/save-grade", (req, res) => {

  const {id, subjectSelected, TypeSelected, point,maxPoint } = req.body;
    console.log("this is the subject;", { subjectSelected, TypeSelected, point,maxPoint });

  if (!id |!subjectSelected | !TypeSelected | !point | !maxPoint) {
    return console.log("all field is required");
  }

  const query = `INSERT INTO studentGrade (id,subjectSelected, TypeSelected, point,maxPoint) VALUES (?,?,?,?,?)`;

  db.run(query, [id, subjectSelected, TypeSelected, point,maxPoint], (err) => {
    if (err) {
      return console.log("there is an error saving data", err);
    }
    res.json({ success: true });
  });
});

app.delete(`/api/delete/:id`,(req,res)=>{
  const studentId = req.params.id

  if(!studentId){
    console.log('missing id');
    return
    
  }
  db.run(
    `DELETE FROM attendanceList WHERE id = ?`,[studentId],(err)=>{
      console.log('ERROR',err);
      return
      
    }
  )
  db.run(
    `DELETE FROM studentGrade WHERE id = ?`,[studentId],(err)=>{
      console.log('ERROR',err);
      return
      
    }
  )
  res.json({success:true})
})
app.put(`/api/update/:id`,(req,res)=>{
  const studentId = req.params.id
  const { userName, userLocation, userAge } = req.body;
  if(!studentId){
    console.log('missing id');
    return
    
  }
  db.run(
    `UPDATE attendanceList SET userName = ?,location = ?,age= ? WHERE id = ?`,[userName,userLocation,userAge,studentId],(err)=>{
      console.log('ERROR',err);
      return
      
    }
  )
  res.json({success:true})
})



app.listen(port,'0.0.0.0', () => {
  console.log(`server is running on `);
});
