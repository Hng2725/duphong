import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Bật CORS
app.use(cors());

// Middleware để parse JSON body
app.use(express.json());

// Sử dụng router
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
