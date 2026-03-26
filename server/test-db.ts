import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:280896Ab%4001733190252@db.cfvymtfxazxzwmlvgkbu.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function test() {
  try {
    await client.connect();
    console.log('CONECTADO COM SUCESSO!');
    const res = await client.query('SELECT NOW()');
    console.log('Resultado:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('ERRO DE CONEXÃO:', err.message);
    process.exit(1);
  }
}

test();
