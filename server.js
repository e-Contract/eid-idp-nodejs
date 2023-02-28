/*
 * eID Identity Provider project.
 *
 * Copyright 2015-2023 e-Contract.be BV. All rights reserved.
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
