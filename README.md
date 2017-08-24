# gpkg

![gpkg Logo](http://i.imgur.com/iS6Irsw.png)

a package manager that is more of a list of commands with a name. Onboarding new employees, or downloading repositories for people that aren't keen on command line can be simple as:

```
gpkg install newemployee
```

On the Database the newemployee package has the following information:

- name: newemployee
- password: empty (no one added password when it was created)
- repourl: ssh://repourlgoeshere
- command: git clone ssh://repourlgoeshere
- summary: "Downloads the tools and information needed for new developers on Project X"


-----

Just register a package with:

```
gpkg register
```

It will Prompt you with questions about the Name, Command To Run, Summary of what it does, and repourl if you are pulling a repository.


----


API:

- help - outputs the list of commands
- info - displays the overall information of the package including version Number
- install - installs the command from the DB of that package name
- register - registers a package with the database
- uninstall - uninstalls a package from the gpkg.json file and the location its installed
- unregister - unregisters a package with the database
- testdb - used to test the database connection taken from the config file
- version - checks the gpkg version
