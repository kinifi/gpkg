# gpkg
a package manager for games that links to repos. Modeled after Bower, Yarn and Dep

API:

- help - outputs the commands
- cache - the location of the download dependencies cache on your local machine
- home - opens a package homepage if the URL isn't empty
- info - displays the overall information of the package including version Number
- init - creates a gpkg.json file
- install - installs all dependencies listed in the gpkg.json file
  - force-latest - force the latest version on conflict
  - side - makes a folder with the newest version along side the old one to deal with manually
- list - lists packages in the gpkg.json file and attempts to check if newer versions exist
- login - authenticate with github and store credientials so we can use to register packages
- register - registers a package with the database by checking to see if a gpkg exists with that name, if no, send gpkg.json file to server
- update - updates all the installed packages to the newest version according to their version numbers in the gpkg.json file
  - force-latest - force the latest version on conflict
  - side - makes a folder with the newest version along side the old one to deal with manually
- uninstall - uninstalls a package from the gpkg.json file and the location its installed
- unregister - unregisters a package with the database
- version - checks the gpkg version
