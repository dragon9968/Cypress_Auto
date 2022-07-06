# Keromatsu Angular

#### Setup Angular #####

Windows: 

Download and install [Visual Studio Code](https://code.visualstudio.com/download)
Download and install [Nodejs](https://nodejs.org/dist/v16.15.1/node-v16.15.1-x64.msi)

Linux:

`curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`
`sudo apt-get install nodejs`
`node -v`

Check node version: `node -v`
In command console or terminal, run the following commands: 

`npm install -g @angular/cli`
`ng version`

Create a new angular project: ng new <project name> E.g. `ng new myfirstproject`

? Would you like to add Angular routing? <Yes>
? Which stylesheet format would you like to use? <CSS>

Close out VS code and reopen the newly created project folder by right click on the project folder and open with VS code. 
Or you can could do it inside VS code under file -> open folder

Update all dependencies to latest versions:
`npm install -g npm-check-updates`
`ncu -u`
`npm update`
`npm install`

Start up Angular application:
`ng serve`

## For windows user, if you run into error when doing `ng serve` ##
Open powershell and run: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted 

Now open a browser and enter url [AngularApp](localhost:4200)

Debugging

Click on the icon on the left panel with the right arrow and a bug icon
if .vscode folder doesn't have the launch.json file, create it and paste the below into it.


{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "pwa-chrome",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:4200/"
    },
    {
      "name": "Firefox",
      "type": "firefox",
      "request": "launch",
      "preLaunchTask": "npm: start",
      "url": "http://localhost:4200/"
    },
    {
      "name": "ng test",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "npm: test",
      "url": "http://localhost:9876/debug.html"
    }
  ]
}


Now go to src -> app.component.ts
set a breakpoint at line 9
Go back to debug and click on the green play arrow for Firefox/Chrome
`ng serve` will start up firefox in debug mode. Once the page loads, 
do a quick refresh of the page should then trigger the breakpoint in visual studio code.

##

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
