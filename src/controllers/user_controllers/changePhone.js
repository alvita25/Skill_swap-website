const db = require('../../db/connection.js')

const changePhone = async (req, res) => {
    const uid = req.session.userId;
    const phone = req.body.inputPhone;

    try {
        await db.query('update users set phone=? where user_id=?', [phone, uid]);
        return res.status(200).json({ message: 'successfully updated' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Server error' });
    }
}

module.exports = { changePhone };