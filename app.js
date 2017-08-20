#!/usr/bin/env node


///Module dependencies. ///////////////////////////////////////

var http = require('http');
var fs = require('fs');
var shell = require("shelljs");

/////////////////////////////////////////////////////////////////////

var locationOfProcess;

//check to see if we should process anything
if(process.argv.length > 2)
{
  //set locationOfProcess
  locationOfProcess = process.argv[2];

  console.log(process.argv);
}
else {
  //run help command
}



//
// process.argv.forEach(function (val, index, array) {
//   // console.log(index + ': ' + val);
//   if(index >= 2)
//   {
//       console.log(index, val);
//   }
//
//
// });

/////////////////////////////////////////////////////////////////////

//fun the command given
function CMD(command) {
  //example:  shell.exec("git push origin master --force");
  shell.exec(command);
}

function test {
      var child = exec('some_long_running_process', {async:true});
    child.stdout.on('data', function(data) {
      /* ... do something with data ... */
    });

    exec('some_long_running_process', function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
}

//download a file from the given url
function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}
