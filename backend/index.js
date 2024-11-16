const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase, loginUser } = require('./models/Database'); 
const app = express();


const SECRET_KEY = 'SkibidiToilet'; 


const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },  
        SECRET_KEY,
        { expiresIn: '1h' }
    );
};


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); 

    jwt.verify(token, SECRET_KEY, (err, user) => {  
        if (err) return res.sendStatus(403);  
        req.user = user; 
        next();
    });
};

app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use(express.json());


app.get('/api/status', (req, res) => {
    res.json({ message: 'Server běží správně!' });
});


app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);


    const { data, error } = await supabase
        .from('User')
        .insert([{ username, email, password_hash: hashedPassword }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Uživatel úspěšně registrován', user: data });
});


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

   
    const result = await loginUser(username, password);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }


    const token = generateToken(result);

    res.status(200).json({
        message: 'Uživatel úspěšně přihlášen',
        id: result.id,  
        token: token    
    });
});



app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Toto je chráněný obsah.' });
});

app.post('/api/listOfServers', async (req, res) => {
    const { user_id } = req.body; 


    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('User ID:', user_id);

    try {

        
        const { data, error } = await supabase
        .rpc('get_servers_by_user', {
        user_id : user_id
        })
        if (error) console.error(error)
        else console.log(data)


        

       // console.log('Data:', data);


        if (error) {
            return res.status(400).json({ error: error.message });
        }


        res.status(200).json({ servers: data });
    } catch (err) {

        console.error('Chyba při získávání serverů:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/verify', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];  // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {

        const decoded = jwt.verify(token, SECRET_KEY);


       // console.log('Decoded token:', decoded);


        const { data, error } = await supabase
            .from('User')
            .select('username, email, password_hash')  
            .eq('username', decoded.username) 
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'User not found' });
        }


        res.status(200).json({ user: data });
    } catch (err) {
        console.error('Chyba při ověřování tokenu:', err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});


app.post('/api/listOfChannels', async (req, res) => {
    const { server_id } = req.body;  

    console.log('Server ID:', server_id);

    try {
        
        const { data, error } = await supabase
        .rpc('get_channels_by_server', {
            server_id : server_id
        })
        //if (error) console.error(error)
       // else console.log(data)
    
        //console.log('Data:', data);


        if (error) {
            return res.status(400).json({ error: error.message });
        }


        res.status(200).json({ channels: data });
    } catch (err) {

        console.error('Chyba při získávání serverů:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/listOfMessages', async (req, res) => {
    const { channel_id } = req.body;  

    console.log('channel_id:', channel_id);

    try {
      
        
        const { data, error } = await supabase
        .rpc('get_messages_by_channel', {
            channel_id : channel_id
        })
        if (error) console.error(error)
        else console.log(data)
    
        console.log('Data:', data);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ messages: data });
    } catch (err) {
       
        console.error('Chyba při získávání serverů:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
