const express = require("express");
const app = express();
const port = 1770;
const path = require("path");
const fs = require("fs");

app.use("/static", express.static(path.join(__dirname, "public")));


app.get("/", (req, res) =>
{
	res.sendFile(__dirname + "/index.html");
});

app.all("*", (req, res) => { // for everything else
	console.log("sussy sus", req);
    res.send("<h1><b>404 not found</h1>");
});

app.listen(port, () => {
    console.log("Running on port " + port);
});