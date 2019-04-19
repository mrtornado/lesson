const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const jwt = require('jsonwebtoken')
const app = express();
app.use(cors())
app.use(parser())
const MY_SECRET_KEY = "VahE71VdtBlyPVY35gDasfsdagdfsghse"

users = [
    {
        authData: {
            username: "userkey1",
            password: "passwordkey1"
        },
        secret_information: "This is my secret information. userkey1"
    },
    {
        authData: {
            username: "testuser",
            password: "testpassword"
        },
        secret_information: "My facebook password: hellonodejs"
    },
    {
        authData: {
            username: "user3",
            password: "password3"
        }
    }
]

app.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	var loginResult = users.some((element) => {
		return element.authData.username === username &&
			   element.authData.password === password;
	})
	if (loginResult) {
		var data = {
			username: req.body.username
		}
		var token = jwt.sign(data, MY_SECRET_KEY);
		res.json({status: 200, token})
	} else {
		res.sendStatus(401);
	}
})


app.post('/get_secret_information', (req, res) => {
    console.log(req.body);
	jwt.verify(req.body.jeton, MY_SECRET_KEY, (err, payload) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var user = users.find((x) => {
                return x.authData.username === payload.username
            })
            if (user.secret_information) {
                res.json({status: 200, message: user.secret_information})
            } else {
                res.json({status: 200, message: "without secret information"})
            }
        }
    })
})



app.listen(4000,  () => console.log("Serverul a pornit pe portul 4000"));