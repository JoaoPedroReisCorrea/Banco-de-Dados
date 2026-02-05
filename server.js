const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Aceitar requisições de outras origens (frontend)
app.use(express.json()); // Processar JSON no corpo das requisições

// Rotas da API

// GET - Listar todos os itens
app.get('/api/items', (req, res) => {
    const sql = "SELECT * FROM items";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// POST - Criar novo item
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400).json({ error: "O campo 'name' é obrigatório." });
        return;
    }

    const sql = "INSERT INTO items (name, description) VALUES (?, ?)";
    const params = [name, description || ""];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: {
                id: this.lastID,
                name,
                description: description || ""
            }
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Teste a API em: http://localhost:${PORT}/api/items`);
});
