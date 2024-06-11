const fs = require('fs/promises');
const path = require('path');

const swaggerPath = path.join('./', 'swagger.json');
const swaggerDocs = async () =>
  JSON.parse(await fs.readFile(swaggerPath, 'utf-8'));

module.exports = swaggerDocs;
