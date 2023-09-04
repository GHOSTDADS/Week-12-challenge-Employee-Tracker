const EmpolyeeTracker = require("./lib/empolyeeTracker");
const { dbConnection } = require('./config/connection');
const chalk = require("chalk");

const empTrack = new EmpolyeeTracker();

dbConnection.connect(err => {
    if (err) throw err;
})
.then(() => {
    console.log(chalk.red("Welcome to the...\n"));
    console.log(chalk.green.bold("----------------------------------------\n"));
    console.log(chalk.green.bold("        EMPLOYEE TRACKER 300000!!!\n"));
    console.log(chalk.green.bold("----------------------------------------"));
    empTrack.run();
});
