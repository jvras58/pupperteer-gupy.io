const app = require('./app');
const { port } = require('./src/config/config');

app.listen(port, () => {
    console.log(`O servidor está em execução: http://localhost:${port}`);
});
