const express = require('express');
const bodyParser = require('body-parser');
const { createTables } = require('./src/config/db');
const eventRoutes = require('./src/routes/event-routes');
const userRoutes = require('./src/routes/user-routes');

const app = express();
const PORT = process.env.PORT || 3000;

const initializeDB = async () => {
    try {
        await createTables();
        console.log('Database initialized');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
};

initializeDB();

app.use(bodyParser.json());


app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/",(req, res) => {
    res.send("Server is running");
});
