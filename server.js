/*
 * eID Identity Provider project.
 *
 * Copyright 2015-2025 e-Contract.be BV. All rights reserved.
 * e-Contract.be BV proprietary/confidential. Use is subject to license terms.
 */

"use strict";

import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import passportSaml from "@node-saml/passport-saml";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
var SamlStrategy = passportSaml.Strategy;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true
}));

function certCallback(callback) {
    console.log("cert callback");
    // The certificate can be retrieved from https://www.e-contract.be/eid-idp/
    callback(null, "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");
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new SamlStrategy(
    {
        path: "/login/callback",
        entryPoint: "https://www.e-contract.be/eid-idp/protocol/saml2/post/auth",
        cert: certCallback,
        acceptedClockSkewMs: 1000,
        issuer: "passport-saml",
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

app.get("/login",
    passport.authenticate("saml",
        {
            successRedirect: "/protected",
            failureRedirect: "/"
        }
    ));

app.post("/login/callback",
    passport.authenticate("saml",
        {
            successRedirect: "/protected",
            failureRedirect: "/"
        }
    ));

app.post("/logout",
    function (req, res) {
        req.logout(null, function () {
            res.redirect("/");
        });
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
    console.log("Example app listening at http://%s:%s", host, port);
});
