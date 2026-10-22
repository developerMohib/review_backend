import app from "./index.js";

const port = Number(process.env.PORT) || 4000;
async function main() {
  try {
    console.log('PostgreSQL connected succesfully with Atlas');
    app.listen(port, "0.0.0.0", () => {
  console.log(`Admin app listening on port ${port}`);
});
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

main();