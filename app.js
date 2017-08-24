#!/usr/bin/env node


///Module dependencies. ///////////////////////////////////////

var http = require('http');
var fs = require('fs');
var shell = require('shelljs');
var colors = require('colors');
var jsonfile = require('jsonfile');
var prompt = require('prompt');

//redis object
var redis = require('redis');
var client;


/////////////////////////////////////////////////

//get the config file
//The config file is used for companies to specify their own database IPs
var configFile;
//the static version number
var versionNumber = "0.0.1";

//Step 1
//read the config file immedately
readConfig();


/////////////////////////////////////////////////////////////////////

//the location of the process so we can add repos to the current location
var locationOfProcess;

//read the arguments
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
          info();
          break;
      case "install":
          install();
          break;
      case "list":
          break;
      case "login":
          break;
      case "register":
          //prompt the user with questions so they can add repo info to the database
          register();
          break;
      case "update":
          break;
      case "uninstall":
          //find the gpkg.json file and remove the name dependency
          break;
      case "unregister":
          break;
      case "testdb":
          testDBConnection();
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

function install()
{
  connectToRedisServer(function() {
    //get the package name
    var packageName = process.argv[3];
    client.hgetall(packageName, function(err, object) {
      console.log(object.command);
    });
    // // check if the package exists at all
    // client.get(packageName, function(err, reply) {
    //     if(err || data === null) {
    //       console.log("err or null! ");
    //       console.log(err);
    //     } else {
    //         return data;
    //     }
    //   // if (reply === 1) {
    //   //     //package exists!
    //   //     console.log('exists');
    //   // } else if(reply == 0) {
    //   //     console.log("Package Name: ".red + packageName + " Does Not Exist In DB.".red);
    //   //     client.quit();
    //   //     return;
    //   // } else {
    //   //   console.log(err);
    //   //   client.quit();
    //   //   return;
    //   // }
    // });
  });



    // //check if the next parameter is -c or -cache for installing at the cache location
    // var cacheParameter = process.argv[4];
    // if (cacheParameter == "--cache" || cacheParameter == "-c") {
    //   //check if the user has specificed a cache location
    //   if (fs.existsSync(configFile.cachelocation)) {
    //     //cache location exists. call git command to that location and not the location we are in
    //
    //   } else {
    //     //log that the cache location doesn't exist or wasn't set properly
    //     console.log("cache location is not set properly: " + configFile.cachelocation " was taken from the config file.");
    //     client.quit();
    //   }
    // }
}

function info()
{
  connectToRedisServer(function() {
    //get the package name
    var packageName = process.argv[3];
    client.hgetall(packageName, function(err, object) {
      console.log("Package Name: " + object.name +
                  "\n Summary: " + object.summary);
      client.quit();
    });
  });

}


//call to connect to the server and use the client class level variable
//only do this when using commands that need to connect to the server
// fun = the function we are going to call
function connectToRedisServer(fun)
{
  // //change to env variable
  client = redis.createClient(configFile.port, configFile.ipaddress);
  // //we need to send it our password
  // //change to env variable later
  // client.auth(PASSWORD);
  //called when the client successfully connects
  client.on('connect', function() {
      console.log('DB Connected'.green);
      //check if we passed a function or not
      if(fun != null) {
        //call the passed function
        fun();
      }
  });

  //called when client gets an error
  client.on("error", function (err) {
      console.log("Error " + err);
  });

  client.on("end", function (err) {
      console.log("Connection Ended".red);
  });
}

function testDBConnection()
{
  connectToRedisServer();
  client.quit();
}


//register a repo with a database
function register () {

  //the schema for the questions needed in the database
  var schema = {
    properties: {
      name: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        message: 'Does this package need a password? [Leave Blank If No]',
        hidden: true
      },
      repourl: {
        message: 'Repository URL or SSH. This will be the command run by gpkg.'
      },
      command: {
        message: 'What is the command to run to download this package? [Example: git clone GITURLHERE]'
      },
      summary: {
        message: 'Give a small 150 character summary on the package.'
      }
    }
  };

  // Start the prompt
  prompt.start();

  // Get two properties from the user: email, password
  prompt.get(schema, function (err, result) {

    //send the values from the prompt to the method that will send it to the database
    sendNewPackageInfo(result.name, result.password, result.repourl, result.command, result.summary);

  });



}

function sendNewPackageInfo(name, password, repourl, command, summary)
{
  //sending a function to test
  connectToRedisServer(function(){

    //check if packagename exists already
    client.exists(name, function(err, reply) {
      if (reply === 1) {
          console.log(name + ' exists already.');
          //disconnect the connection with the database
          client.quit();
      } else if(reply == 0) {
        //add the package and its details
        client.hmset(name, {
          'name': name,
          'password': '',
          'repourl': repourl,
          'command': command,
          'summary': summary
        });

        console.log("Added To Database");

        client.quit();
      }
      else {
        //we have an error
        console.log("Error: " + err);
        client.quit();
        return;
      }
    });

  });
}

//set the cache location
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
function RunExternal(command) {
  //example:  shell.exec("git push origin master --force");
  exec(command, function(code, stdout, stderr) {
    shell.echo('Exit code:', code);
    shell.echo('output:', stdout);
    shell.echo('stderr:', stderr);
  });
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
    //Step 2
    readArgs();
  });
}
