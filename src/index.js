const { promisify } = require('node:util');
const mysql = require('mysql');

const fastify = require('fastify')({
  logger: true,
});

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'fc_challenge',
});

const query = promisify(pool.query).bind(pool);

fastify.get('/', async (_, reply) => {
  try {
    rows = await query("INSERT INTO people(name) VALUES('Gabriel Fernandes');");
    fastify.log.info({ rows }, 'insertion was successful!');
    rows = await query('SELECT * FROM people;');
    fastify.log.info({ rows }, 'all records selection');
    reply
      .type('text/html')
      .code(200)
      .send(
        '<h1>Full Cycle Rocks!</h1>\n<ul>' +
          rows.reduce((prev, curr) => (prev += `<li>${curr.Name}</li>`), '') +
          '<ul>'
      );
  } catch (error) {
    fastify.log.error(error, 'failed to insert data');
    reply
      .type('application/json')
      .code(500)
      .send({ error: { message: err.message } });
  }
});

fastify.listen({ host: '0.0.0.0', port: 3000 }, async (err, address) => {
  await query(
    'CREATE TABLE IF NOT EXISTS people(ID int NOT NULL AUTO_INCREMENT, Name varchar(255), PRIMARY KEY (ID));'
  );
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
