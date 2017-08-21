#!/usr/bin/env node


///Module dependencies. ///////////////////////////////////////

var http = require('http');
var fs = require('fs');
var shell = require('shelljs');
var colors = require('colors');

/////////////////////////////////////////////////////////////////////

var locationOfProcess;

//check to see if we should process anything
if(process.argv.length > 2)
{
  //set locationOfProcess
  locationOfProcess = process.argv[1];
  console.log(process.argv[2]);


  switch (process.argv[2]) {
    case "help" || "h":
        help(); 
        break;
    case "cache" || "c":
        break;
    case "home" || "ho":
        break;
    case "info" || "i":
        break;
    case "install" || "in":
        break;
    case "list" || "li":
        break;
    case "login" || "lo":
        break;
}

  // console.log(process.argv);
}
else {
  //run help command
}


/////////////////////////////////////////////////////////////////////

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


    // var child = exec('some_long_running_process', {async:true});
    //
    // child.stdout.on('data', function(data) {
    //   /* ... do something with data ... */
    // });
    //
    // exec('some_long_running_process', function(code, stdout, stderr) {
    //   console.log('Exit code:', code);
    //   console.log('Program output:', stdout);
    //   console.log('Program stderr:', stderr);
    // });

//
// //download a file from the given url
// function download(url, dest, cb) {
//   var file = fs.createWriteStream(dest);
//   var request = http.get(url, function(response) {
//     response.pipe(file);
//     file.on('finish', function() {
//       file.close(cb);
//     });
//   });
// }
