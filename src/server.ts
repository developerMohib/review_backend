import app from "./index.js";

const port = 4000;
async function main() {
  try {
    console.log('PostgreSQL connected succesfully with Atlas');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

main();