const Express = require('express');
const app = Express();
const dbConnection = require('./db');
const controller = require("./controllers");

app.use(Express.json());



app.use("/log", controller.logController);
app.use("/user", controller.userController)

app.use('/test', (req, res)=> {
    res.send('this is a test message')
});

dbConnection.authenticate()
.then(()=> dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crashed due to ${err}` );
})




