const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

const authRouter = require('./routes/authRouter');
const boardsRouter = require('./routes/boardsRouter');
const columnsRouter = require('./routes/columnsRouter');
const cardsRouter = require('./routes/cardsRouter');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//routers
app.use('/users', authRouter);
app.use('/boards', boardsRouter);
app.use('/columns', columnsRouter);
app.use('/cards', cardsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
