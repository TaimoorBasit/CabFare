import { getDatabase } from '../database/db';
export const getHandler = async (req, res) => {
    const db = await getDatabase(req.env);
    return res.json(db.data?.vehicleAvailability || []);
};
export const postHandler = async (req, res) => {
    const db = await getDatabase(req.env);
    const item = req.body;
    if (!item.id)
        item.id = 'block_' + Date.now();
    db.data?.vehicleAvailability.push(item);
    await db.write();
    return res.json(item);
};
export const deleteHandler = async (req, res) => {
    const id = req.query.id;
    const db = await getDatabase(req.env);
    if (db.data) {
        db.data.vehicleAvailability = db.data.vehicleAvailability.filter(m => m.id !== id);
        await db.write();
        return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Not found' });
};
