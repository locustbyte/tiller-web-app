### Tiller Web Application README ###

### What is this repository for? ###

* The repository holds the source code for the Tiller web application which acts a as a Front-end web interface for the Tiller data api
* Version 0.0.1

### How do I get set up? ###

* Open terminal and checkout the repository
* Navigate to the root directory of the repository
* The application uses npm and bower to manage packages and gulp to build the dist directory
* NPM is built to install everthing, run gulp and run tests
* Just do "npm install" - this will build the dependancies, install bower components and run gulp

### Running the application ###

* Now we have everything set up we can start the application by running "npm start". This will start a web server locally, intall npm and bower, run gulp and finally run gulp watch so that you can develop the front-end

### Contribution guidelines ###

* The application uses unit tests and end-to-end tests emplying a test driven methodology with continuous integration in mind

### Unit tests ###

* Unit tests are written in AngularJS 
* Each file in a route/view has an accompanying file wihich is named <filename>_test.js
* Karma/Jasmine run the tests automatically and keep track of changes for you
* Just run "npm test" in another terminal window and you'll have a fully automated test process

### End to end tests ###

* End-to-end tests are run with protractor - further details to be confirmed

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

### Where are the wireframes ###

* http://iocgfn.axshare.com

* You will need to ask for access to Basecamp, Confluence, Jira etc


