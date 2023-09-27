import { readFile } from 'fs';
import { Surreal } from 'surrealdb.js';

const db = new Surreal('http://localhost:8000');

const migrate = async () => {
    //read migrations.surql file
    readFile('./database/migrations.surql', 'utf8', async (err, data) => {
        if (err) throw err;
        //POST /signin SurrealDB migration script
        //sign is as root:root
        //the database is supposed to run at :8000
    });

    console.log('Connecting...');
    await db.connect('http://127.0.0.1:8000/rpc');
    console.log('Connected!');

    await db.signin({
        user: 'root',
        pass: 'root',
    });

    await db.use({ ns: 'mc', db: 'mc' });
};

//run migrations
migrate();
