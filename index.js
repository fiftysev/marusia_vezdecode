import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/123", (req, res) => {
  return res.status(200).json("test");
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
