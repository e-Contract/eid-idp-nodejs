/*
 * eID Identity Provider project.
 *
 * Copyright 2015-2022 e-Contract.be BV. All rights reserved.
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
