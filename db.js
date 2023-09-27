async function connect() {
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require("pg");
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    const client = await pool.connect();

    const res = await client.query("select now()");

    console.log(res.rows[0])

    client.release();
    global.connection = pool;
    return pool.connect();
}

connect();

async function getTodo() {
    const req = await connect();
    const res = await req.query("SELECT * FROM todos");
    return res.rows;
}



async function addTodo(todo) {
    const req = await connect();
    const sql = "INSERT INTO todos(title, content, itsfav, color) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [todo.title, todo.content, todo.itsfav, todo.color];
    const result = await req.query(sql, values);
    const insertedId = result.rows[0].id;
    return insertedId;
}

async function selectTodo(id) {
    const req = await connect();
    const res = await req.query("SELECT * FROM todos WHERE ID = $1", [id])
    return res.rows;
}

async function updateTodo(id, todo) {
    const req = await connect();
    const sql = "UPDATE todos SET title=$1, content=$2, itsfav=$3, color=$4 WHERE id=$5";
    const values = [todo.title, todo.content, todo.itsfav, todo.color, id];
    await req.query(sql, values);
}

async function deleteTodo(id) {
    const req = await connect();
    const sql = "DELETE FROM todos WHERE id=$1";
    const values = [id];  
    await req.query(sql, values);
}  
 
module.exports = {
    getTodo,
    selectTodo,
    addTodo,
    updateTodo,
    deleteTodo
}