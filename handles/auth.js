var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	LocalStrategy = require('passport-local').Strategy,
	User = require('./db_user_model.js');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        	if (user)done(err, user)
        });
    });
    
    passport.use(new GoogleStrategy({

        clientID: '742599687881-a50o5bnkep1f8u8dh59ot2ohtbgapqp8.apps.googleusercontent.com',
    	clientSecret: 'cf2gvC2etlTjKQ5NzbxoUAbb',
    	callbackURL: "zairza-shubham21.rhcloud.com/auth/google/callback"

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'Gid' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();
                    // set all of the relevant information
                    try{
                    newUser.Gid   = profile.id;
                    newUser.token = token;
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    newUser.IsActivated = false ; //let admins decide who to allow
                    newUser.password = newUser.generateHash('123456') 
                	}
                	catch(err){console.error(err);
                		console.log(profile);
                	}
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
	

	// login by password
	passport.use('login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false);

                if (!user.validPassword(password))
                    return done(null, false);

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

};
 