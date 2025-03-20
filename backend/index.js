const express =   require('express');
const bodyParser = require('body-parser');
// require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const entRouter = require('./routes/ent');
const mentorRouter = require('./routes/mentor');

app.use("/mentor", mentorRouter);
app.use("/ent", entRouter);


module.exports = app;
const PORT = 5000;
// server.on('request', app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});