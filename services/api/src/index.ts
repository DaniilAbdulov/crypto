import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get('/health', (_, res) => {
  console.log(`health check`);

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port`, PORT);
});
