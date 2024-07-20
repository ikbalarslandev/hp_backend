import app from "./server";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
