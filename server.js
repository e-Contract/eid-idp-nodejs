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

function certCallback(callback) {
    console.log("cert callback");
    callback(null, "MIIFPzCCBCegAwIBAgIJALvvTI5tCPI9MA0GCSqGSIb3DQEBCwUAMIG0MQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJpem9uYTETMBEGA1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20sIEluYy4xLTArBgNVBAsTJGh0dHA6Ly9jZXJ0cy5nb2RhZGR5LmNvbS9yZXBvc2l0b3J5LzEzMDEGA1UEAxMqR28gRGFkZHkgU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0eSAtIEcyMB4XDTE3MDMyMTEwMTAwMFoXDTIwMDMyMTEwMTAwMFowPzEhMB8GA1UECxMYRG9tYWluIENvbnRyb2wgVmFsaWRhdGVkMRowGAYDVQQDExFlaWQuZS1jb250cmFjdC5iZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMQTQADLkd61VyXdLM/jPuQC/nLL/pK18kFc9h3vkxnpOvhnHZGOUwtSGY2/p32xO7rkfLZzaVxFQYm314cP2NFTMMI1puPCMmyICbNpcnIvG2eek+G1eFz4KrNPg+kuMvKdek5RjKPxDi6ZWCdgqxL2zf5q5QfkhypSe3gLNOv2u4AUmWjN/HLEu1R+N+J7X4sIYvJxh26FI4PyzvkkY7TG2vVcOYJ53J1579dARaecBaa6SpuwOBZbHKPnTmik3kP3DHIVifPunEYh6aAghbOYEYQai7TQZsJPHNesvOqaS9Z4nGmkza28Ublc1pvzWeNR4gushVUzFSuW4hJRD4MCAwEAAaOCAcYwggHCMAwGA1UdEwEB/wQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMA4GA1UdDwEB/wQEAwIFoDA3BgNVHR8EMDAuMCygKqAohiZodHRwOi8vY3JsLmdvZGFkZHkuY29tL2dkaWcyczEtNDQ2LmNybDBdBgNVHSAEVjBUMEgGC2CGSAGG/W0BBxcBMDkwNwYIKwYBBQUHAgEWK2h0dHA6Ly9jZXJ0aWZpY2F0ZXMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8wCAYGZ4EMAQIBMHYGCCsGAQUFBwEBBGowaDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZ29kYWRkeS5jb20vMEAGCCsGAQUFBzAChjRodHRwOi8vY2VydGlmaWNhdGVzLmdvZGFkZHkuY29tL3JlcG9zaXRvcnkvZ2RpZzIuY3J0MB8GA1UdIwQYMBaAFEDCvSeOzDSDMKIz1/tss/C0LIDOMDMGA1UdEQQsMCqCEWVpZC5lLWNvbnRyYWN0LmJlghV3d3cuZWlkLmUtY29udHJhY3QuYmUwHQYDVR0OBBYEFD0IkfGG5ISacK+WD+nzNWo2XSKbMA0GCSqGSIb3DQEBCwUAA4IBAQAYkprXeAN5A6mIjm+hKI3pgvzsX3SKCaAcnBqhy4KtbWp81iOvWs1biDR1b9L/hzeNjCSNJ8kPJljApkcSAj4qjSj9GtRUCxgfxY5hT4SJiRyETwejhAptiiwAc//Zn8jZHV7qbnc73oqLTQMADUcalpdmbGR+kmexqFh9DwpDRrZ4AZxS658eZLD14821wtc72gH2yzd7Q8NlVJQYYKocWqqaso99A9ajD4lKPYWLW3Dfx86HBZTQ5PIo+l2mgpi+tTbZJQc92//kz8x4jzdpdgrykhDQlrct4lQXc4rUkb4kD+hOPuFTXB1rCXkIRO5/uuf0AXgHY1r3Jb6kAxeO");
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new SamlStrategy(
        {
            path: "/login/callback",
            entryPoint: "https://www.e-contract.be/eid-idp/protocol/saml2/post/auth",
            cert: certCallback,
            acceptedClockSkewMs: 1000
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

