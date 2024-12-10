const db = require('../../db/connection.js');

const getParticipatingClasses = async (req, res) => {
    const uid = req.params.userId;

    try {
        // get class id's of the classes the user is participating in 
        const [classid] = await db.query('select class_id from participants where user_id=?', [uid]);
        if (classid.length === 0) {
            return res.json({ message: 'no classes found' });
        }
        // get class id's from object to array
        const classIds = classid.map(obj => obj.class_id);
        // get class information the user is participating in 
        const [classes] = await db.query('select s.name,c.start_time,c.end_time,c.date from class_timings c join skills s on s.skill_id=c.skill_id where class_id in (?)', [classIds]);
        return res.json({ message: 'successful', classes: classes });
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Server error' });
    }
}

module.exports = { getParticipatingClasses };