const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados (será criado arquivo localmente se não existir)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        inicializarBanco();
    }
});

function inicializarBanco() {
    const query = `
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        )
    `;

    db.run(query, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela "items" pronta.');
        }
    });

    // Inserir um dado de exemplo se a tabela estiver vazia (opcional)
    const checkEmpty = "SELECT count(*) as count FROM items";
    db.get(checkEmpty, (err, row) => {
        if (!err && row.count === 0) {
            const insert = "INSERT INTO items (name, description) VALUES (?, ?)";
            db.run(insert, ["Exemplo Inicial", "Este é um dado inserido automaticamente."]);
            console.log('Dado de exemplo inserido.');
        }
    });
}

module.exports = db;
