const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const port = 9000;

app.get("/user", (req, res) => {
    fs.readFile("./data.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.parse(data));
        }
    });
});

// get user by auth token
app.get("/user/data", verifyToken, (req, res) => {
    jwt.verify(req.token, "secret", (err, auth) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                auth,
            });
        }
    });
});

// login user and get token
app.post("/user/data", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    let userAll = [];

    const userData = fs.readFileSync("./data.json");
    userAll = JSON.parse(userData);
    const user = userAll.find(
        (item) => item.username == username && item.password == password
    );

    if (user) {
        jwt.sign({ user }, "secret", (err, token) => {
            res.json({
                user,
                token,
            });
        });
    } else {
        res.status(403).json({
            message: "USERNAME ATAU PASSWORD SALAH",
        });
    }
});

// verify token
function verifyToken(req, res, next) {
    const header = req.headers["auth"];
    if (typeof header !== undefined) {
        req.token = header;
        next();
    } else {
        res.status(403);
    }
}

app.listen(port, () => console.log(`server is listening on port ${port}`));