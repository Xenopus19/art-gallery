import app from "./src/app.ts";
import { PORT } from "./src/utils/config.ts";

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);