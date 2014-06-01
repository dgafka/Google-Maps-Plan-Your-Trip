//*******************************
//
// Modules initalization
//
//*******************************
var express             = require('express');                       /** Express framework (heart of application)            */
var app                 = express();                                /** Server configuration (express + http + socket.io)   */
var http                = require('http');                          /** http module                                         */
var server              = http.createServer(app);                   /** creates express application using http              */
var io                  = require('socket.io').listen(server);      /** hook socket.io to an http server                    */
var passport            = require('passport');                      /** Passport for authorization                          */
var path                = require('path');                          /** Handles joining path (to libaries for example) to use them in application */
var less                = require('less-middleware');               /** Less compiler                                       */
var flash 	            = require('connect-flash');                 /** Session Flash support                               */


require('./configuration/application')(app, server, express, passport, io, flash, path, less);
