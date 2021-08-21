// requiring dotenv
const dotenv = require('dotenv');

//Environment Variables
dotenv.config({ path: './config.env' });
// console.log(process.env);

// requiring the app file
const app = require('./app');

//  Start SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
