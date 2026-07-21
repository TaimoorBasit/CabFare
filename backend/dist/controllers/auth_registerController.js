import { createUser } from '../services/user';
export const postHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: 'Missing required fields' });
        const newUser = await createUser(email, password, name, req.env);
        if (!newUser)
            return res.status(400).json({ error: 'Registration failed' });
        return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Registration failed' });
    }
};
