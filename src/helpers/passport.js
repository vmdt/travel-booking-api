const GoogleStrategy = require('passport-google-oauth20').Strategy;

const UserModel = require('../models/user.model');
const { AuthFailureError } = require('../utils/error.response');
const config = require('../config');

class PassportConfig {
    constructor(passport) {
        this.passport = passport;
        this.passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        this.passport.deserializeUser(async (id, done) => {
            const user = await UserModel.findById(id);
            if (!user)
                throw new AuthFailureError('Unauthenticated');

            done(null, user);
        });
    }

    google() {
        this.passport.use(
            new GoogleStrategy({
                clientID: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/v1/auth/google/callback'
            }, 
            async function(accessToken, refreshToken, profile, done) {
                try {
                    let user = await UserModel.findOne({ googleId: profile.id });
                    if (!user) {
                        user = await UserModel.create({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            emailVerified: profile.emails[0].verified ? true : false,
                            typeAuth: 'google',
                            profilePicture: profile.photos[0].value
                        });
                    }
                    done(null, user);
                } catch (error) {
                    done(error);     
                }
            })
        );
    }
}

module.exports = PassportConfig;