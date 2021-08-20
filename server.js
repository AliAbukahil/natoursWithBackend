// requiring the app file
const app = require('./app');
//  Start SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
