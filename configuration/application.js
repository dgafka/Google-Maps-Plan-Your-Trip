//*******************************
//
// Configuration for server application
//
//*******************************
module.exports = function(app, server, express, passport, io, flash, path, less, mongoose) {

    var sessionStore = new express.session.MemoryStore();   /** Memory storage for sessions                                           */
    var sessionSecret = 'secrect_service_666';              /** Session secret, salt to secure your sessions (Change it on production)*/
    var sessionKey = 'connect.sid';                         /** Name of the cookies where express stores his session                  */

    app.configure(function(){

        //*******************************
        //
        // Express configuration
        //
        //*******************************

        var engine = require('ejs-locals-improved');     /** use ejs-locals for all ejs templates        */
        app.engine('ejs', engine);                       /** view engine ejs for templates               */
        app.set('view engine', 'ejs');                   /** Set express to use ejs as default templates */

        app.use(express.json());                         /** get information from html forms */
        app.use(express.urlencoded());                   /** get information from html forms */

        app.use(express.methodOverride());
        app.use(express.cookieParser());                 /** Cookie Parser for sessions   */
        app.use(express.session({                        /** Express session config       */
            store: sessionStore,
            key: sessionKey,
            secret: sessionSecret
        }));


        //*******************************
        //
        // Passport injection for express
        //
        //*******************************

        app.use(passport.initialize());   /** Initalize passport        */
        app.use(passport.session());      /** Persistent login sessions */



        //*******************************
        //
        // Extra configuration
        //
        //*******************************


        app.use(flash());               /** use connect-flash for flash messages stored in session */
        app.use(less({                  /** Less compiler, should compile every time server is restarted. */
        src: path.join(__dirname, '../less'),
            dest: path.join(__dirname, '../public/css'),
            prefix: '/css',
            force: true                 /** Force Less middleware to compile css every request (Change it on production) */
        }));

        app.set('views', __dirname + '/../views');     /** Views directory path  */
        app.use(app.router);                           /** Enables routing       */


        app.use(express.static(path.join(__dirname, '../public')));                            /** Serves static files  */
        app.use(express.static(path.join(__dirname, '../bower_components/jquery/dist')));      /**       --/--          */
        app.use(express.static(path.join(__dirname, '../bower_components/bootstrap/dist')));   /**       --/--          */
    });

    app.configure('development', function () {                                          /**    Error handling    */
        app.use(express.logger('dev'));
        app.use(express.errorHandler());
    });

    var routes      = require('../routes/routes')(app, passport);                        /**     Routes handler   */

    require('./passport')(passport);                                                    /** Passport configuration */
    require('./passport_socketio')(io, express, passport, {                             /** Passport socket.io authorization */
        sessionKey   :  sessionKey,
        sessionSecret:  sessionSecret,
        sessionStore :  sessionStore
    });

    mongoose.connect('mongodb://localhost/planyourtrip');                               /** Connect to mongo server                 */

    /** Server starts to listen on port 3000 */
    server.listen(3000, function() {
        console.log("Server has been started at port 3000");
    });


    var socketManagment = require('../modules/SocketsRooms');
    var socketManagmentClass = new socketManagment(io.sockets);

    var socketManagmentGoogleRoom = require('../modules/SocketsGoogleRoom');
    var socketManagmentGoogleRoomClass = new socketManagmentGoogleRoom(io.sockets);
};