import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { encrypt_with_pi, decrypt_with_pi, encryptWithAes, decryptWithAes } from './modules/CodeDecode.js';
import supabaseAdmin from './modules/supabaseAdmin.js';
import crypto from 'crypto'

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('REALTIME CHATAPP SERVER');
});

//messages[0]?.datetime.substring(messages[0]?.datetime.length - 6, messages[0]?.datetime.length)

app.get('/test', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('Messages')
        .select('*');
    if (error) {
        res.status(500).send({
            message: "Error to get Messages Table",
            error: error.message
        });
    }
    res.send(data);
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

app.get('/get-all-messages', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('Messages')
        .select('*');
    if (error) {
        res.status(500).send({
            message: "Error to get Messages Table",
            error: error.message
        });
    }
    data.map((item, index) => {
        data[index].message = decrypt_with_pi(decryptWithAes(item.message, item.time), item.time);
    });
    res.send(data);
});

app.post('/code-decode', async (req, res) => {
    res.send(encryptWithAes(encrypt_with_pi(req.body.message, req.body.key), req.body.key));
});

app.listen(process.env.PORT || 4444, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
