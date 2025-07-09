const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const User = db.User;

// Define the Local Strategy for email/password login
passport.use(new LocalStrategy({
    usernameField: 'email' // We are using email as the username
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isValid = await user.validPassword(password);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize User: Determines which data of the user object should be stored in the session.
// We store the user ID.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize User: Retrieves the user data from the database based on the ID stored in the session.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});