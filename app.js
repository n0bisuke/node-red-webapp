var http = require('http');
var express = require("express");
var RED = require("node-red");

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
