import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import encryptMessage from '../modules/encrypt.js';
import decryptMessage from '../modules/decrypt.js';
import supabaseAdmin from '../modules/supabaseAdmin.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('REALTIME CHATAPP SERVER');
});

app.get('/get-all-users', async (req, res) => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        res.status(500).send
            ({
                message: 'Internal Server Error',
                error: error.message
            });
    }
    res.send(data);
});

app.post('/encrypt', (req, res) => {
    res.send(encryptMessage(req.body.message));
});

app.post('/decrypt', (req, res) => {
    res.send(decryptMessage(req.body.message));
});


// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

app.use('/.netlify/functions/index', app);
module.exports.handler = serverless(app);