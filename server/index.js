import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import code_decode_Message from './modules/CodeDecode.js';
import supabaseAdmin from './modules/supabaseAdmin.js';

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

app.post('/code-decode', (req, res) => {
    res.send(code_decode_Message(req.body.message));
});

app.listen(process.env.PORT || 4444, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
