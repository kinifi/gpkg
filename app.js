#!/usr/bin/env node


///Module dependencies. ///////////////////////////////////////

var http = require('http');
var fs = require('fs');
var shell = require('shelljs');
var colors = require('colors');
var jsonfile = require('jsonfile')

//get the config file
//The config file is used for companies to specify their own database IPs
var configFile;
//the static version number
var versionNumber = "0.0.1";

//read the config file immedately
readConfig();


/////////////////////////////////////////////////////////////////////

var locationOfProcess;

function readArgs()
{

  //check to see if we should process anything
  if(process.argv.length > 2)
  {
    //set locationOfProcess
    locationOfProcess = process.argv[1];
    // console.log(process.argv[2]);

    //check what our command is
    switch (process.argv[2]) {
      case "help":
          //show the commands avalible
          help();
          break;
      case "cache":
          //take the next arg after cachelocation and store it
          cachelocation();
          break;
      case "cachelocation":
          //log the cachelocation
          console.log("cache location: " + configFile.cachelocation.green);
          break;
      case "home":
          break;
      case "info":
          break;
      case "install":
          break;
      case "list":
          break;
      case "login":
          break;
      case "register":
          break;
      case "update":
          break;
      case "uninstall":
          break;
      case "unregister":
          break;
      case "version":
          console.log("v: " + versionNumber);
          break;
  }

    // console.log(process.argv);
  }
  else {
    //run help command
    console.log("\n Error: Command Not Found");
    help();
  }

}

/////////////////////////////////////////////////////////////////////

function cachelocation () {
  //get the next arg
  var location = process.argv[3];

  if (location != undefined || location != null || location != "") {
    //check if directory exists
    if (fs.existsSync(location)) {

      //write to the json file
      configFile.cachelocation = location;
      //write to the config file
      writeConfig();
    }
    else {
      console.log("Not A Folder Path");
      return;
    }
  }
  else {
    console.log("Not A Folder Path");
  }
}

  //list all the commands
function help () {

  console.log('\n gpkg <input> [options] \n');
  console.log('       help - outputs the list of commands');
  console.log('       cache - the location of the dependencies cache on your local machine');
  console.log('       home - opens a package homepage if the URL is not empty');
  console.log('       info - outputs the gpkg.json file');
  console.log('       init - creates a gpkg.json file');
  console.log('       install - installs all dependencies listed in the gpkg.json file');
  console.log('       list - lists packages and attempts to check if newer versions exist');
  console.log('       login - authenticate to register packages');
  console.log('       register - registers a package');
  console.log('       update - updates all the installed packages');
  console.log('       uninstall - uninstalls a package');
  console.log('       unregister - unregisters a package with the database');
  console.log('       version - checks the gpkg version \n');

}

//fun the command given
function CMD(command) {
  //example:  shell.exec("git push origin master --force");
  shell.exec(command);
}

function writeConfig()
{
  //configFile Object to add
  var obj = configFile;
  jsonfile.writeFile("../config.json", obj, {spaces: 4}, function (err) {
    console.log("Saved Config")
  });
}

function readConfig()
{
  if (!fs.existsSync("../config.json")) {
    //TODO: create config file here
    console.log("config.json file next to executible does not exist");
    return;
  }
  //read the json file
  jsonfile.readFile("../config.json", function(err, obj) {
    //set to our class level variable
    configFile = obj;
    //our file is loaded now we can read the args
    readArgs();
  });
}
