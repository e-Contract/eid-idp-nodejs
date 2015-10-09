"use strict";
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;

app.use(bodyParser.urlencoded({extended: false}));

var session = require('express-session');
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new SamlStrategy(
        {
            path: "/login/callback",
            entryPoint: "https://www.e-contract.be/eid-idp/protocol/saml2/post/auth",
            cert: "MIIFLTCCBBWgAwIBAgIHS2X8ooaaSzANBgkqhkiG9w0BAQsFADCBtDELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxGjAYBgNVBAoTEUdvRGFkZHkuY29tLCBJbmMuMS0wKwYDVQQLEyRodHRwOi8vY2VydHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8xMzAxBgNVBAMTKkdvIERhZGR5IFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBHMjAeFw0xNDA0MTEwNDI4MzJaFw0xNzA0MTEwNDI4MzJaMD8xITAfBgNVBAsTGERvbWFpbiBDb250cm9sIFZhbGlkYXRlZDEaMBgGA1UEAxMRd3d3LmUtY29udHJhY3QuYmUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC4KtCOOfoeW4HxyKxjRNf0DtXYyI60D/CrB3zoiWlvbNhbQuQeui5HSzDbo90FgOMQE7OGlaC+TInePOVlmPaMjBn1ZvkmI8q1Y2QBu3Rf8gEIMFQorsPKUx69YiUEy94sguSFPmxvCevbREHhPvAL6xfAEZuJyGlGIppkTOZ+AIT8+1HpT5MFX78CxwbIm5GR6mzMCONk+gEd1GdcSOBsXckWDmMVEKoat6OKYF/twuP2cHqqD9WXOkUL347n7q5jUbbuJlcMa1Io9GNoLK5RYMWhIMjqp4gLT2xg2QVd6kqtQX9xzvypYn7wpkysg4zZ3hRr1sCU18nHsBreuR6/AgMBAAGjggG2MIIBsjAPBgNVHRMBAf8EBTADAQEAMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCBaAwNgYDVR0fBC8wLTAroCmgJ4YlaHR0cDovL2NybC5nb2RhZGR5LmNvbS9nZGlnMnMxLTQwLmNybDBTBgNVHSAETDBKMEgGC2CGSAGG/W0BBxcBMDkwNwYIKwYBBQUHAgEWK2h0dHA6Ly9jZXJ0aWZpY2F0ZXMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8wdgYIKwYBBQUHAQEEajBoMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5nb2RhZGR5LmNvbS8wQAYIKwYBBQUHMAKGNGh0dHA6Ly9jZXJ0aWZpY2F0ZXMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS9nZGlnMi5jcnQwHwYDVR0jBBgwFoAUQMK9J47MNIMwojPX+2yz8LQsgM4wKwYDVR0RBCQwIoIRd3d3LmUtY29udHJhY3QuYmWCDWUtY29udHJhY3QuYmUwHQYDVR0OBBYEFKlGMfaulaBUuzpcxgjLT5hJtJjaMA0GCSqGSIb3DQEBCwUAA4IBAQClS6PGpIgNL4OTAxfi3TNnplf6KdJFqMgeYFot9gGrJui2Mw6LI6DrVNscrlqEKvoluUYLRTS3M0b1DPT7t3pniOkDVWj/hYwjapIePVwcYq3j/SpVwd0IPbD+tDcvYhZya2GWLlDbxREG09677U6pQUomQCpkAyL6/9rd8nZIp5sjEAn06U50L1tQdHYbYp11pyJgaIYy+/cnPhoPuYxddZj5U1tU0F6ZirlF0RheRiY48ZsRBNM2lfl+InsxwmrSI/dZ+zqD2S395obTtiI+SG6irUHcHOY1P45fmqXDXDWzx9ES/WN5hy5Kyeypjp3k4gJbKzq9FWI2ufX11759"
        },
function (profile, done) {
    console.log("profile: " + profile);
    console.log(profile);
    return done(null, profile.nameID);
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('/login',
        passport.authenticate('saml',
                {
                    successRedirect: '/protected',
                    failureRedirect: '/'
                }
        ));

app.post('/login/callback',
        passport.authenticate('saml',
                {
                    successRedirect: '/protected',
                    failureRedirect: '/'
                }
        ));

app.post("/logout",
        function (req, res) {
            req.logout();
            res.redirect("/");
        }
);

app.all("/protected/*", function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    } else {
        console.log("authenticated user: ", req.user);
        next();
    }
});

app.use(express.static(__dirname + "/public"));
app.use("/protected", express.static(__dirname + "/protected"));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

