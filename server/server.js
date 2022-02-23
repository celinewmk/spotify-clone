const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '7ee6e0d5591a43529a41c604207bde27',
        clientSecret: '934a8cde4a2b4a34ba62f4a230899fea',
        refreshToken
    })

    // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accesToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        
        }).catch((err) => {
            res.sendStatus(400)
        })
     
})


app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '7ee6e0d5591a43529a41c604207bde27',
        clientSecret: 'b963dd7b4e62405ca7d8a13dc5f298c3'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err => {
        res.sendStatus(400)
    })
})

app.listen(3001)