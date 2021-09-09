var http = require('http');
var express = require("express");
var RED = require("node-red");

// Workaround for finding npm related used node
if (process.platform === 'win32') {
    const { execSync } = require('child_process');
    const nodeVersion = process.version.replace(/^v(.*)$/, '$1');
    const npmTxtPath = `${process.env["PROGRAMFILES(x86)"]}\\nodejs\\${nodeVersion}\\npm.txt`;
    const npmVersion = execSync(`type "${npmTxtPath}"`).toString().trim();
    process.env.PATH = `${process.env["PROGRAMFILES(x86)"]}\\npm\\${npmVersion};${process.env.PATH}`;
}
// Workaround for finding npm related used node

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/",
    httpNodeRoot: "/",
    userDir:".",
    flowFile: "flows_" + (process.env.WEBSITE_SITE_NAME || process.env.APPSETTINGS_WEBSITE_SITE_NAME ? process.env.WEBSITE_SITE_NAME || process.env.APPSETTINGS_WEBSITE_SITE_NAME : require('os').hostname()) + ".json",
    functionGlobalContext: { }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(process.env.PORT);

// Start the runtime
RED.start();
