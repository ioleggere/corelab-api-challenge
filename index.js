require("dotenv").config();
const express = require("express");

const db = require("./db");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});
 
app.get("/todos", async (req, res) => {
    const todos = await db.getTodo(); 
    res.json(todos);  
}) 

app.get("/todo/:id", async (req, res) => {
    const todo = await db.selectTodo(req.params.id);
    res.json(todo);
})

app.post("/todo", async (req, res) => {
    try {
        const newTodo = req.body;
        const id = await db.addTodo(newTodo); 
        console.log(id);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar todo ao banco de dados' });
        console.log(error);
    }  
});

app.patch("/todo/:id", async (req, res) => {
    try {
        console.log(req.body);
        await db.updateTodo(req.params.id, req.body)
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao editar todo ao banco de dados' });
        console.log(error) 
    }
})
app.delete("/todo/:id", async (req, res) => {
    try {
        await db.deleteTodo(req.params.id)
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover todo ao banco de dados' });
        console.log(error)
    }
    
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
 
