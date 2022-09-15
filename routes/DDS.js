const router = require('express').Router();

const { DBSync, checkTopicName } = require('../middlewares');
const topic = require('../controllers').topic;

/* todo: 
use auth check middleware
*/      

router.get('/all', DBSync, (req, res) => {
    topic.findAllAll({
        // nothing
    }).then(data => {
        res.json(data);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

router.get('/:topic', checkTopicName, DBSync, (req, res) => {
    const topicName = req.params.topic;
    const limit = req.query.limit;
    // never happen...
    if(!topicName) {
        res.status(400).send('topic name is required');
    }
    topic.findAll({
        name: topicName,
        limit: limit
    }).then(data => {
        res.json(data);
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

router.post('/:topic', checkTopicName, DBSync, (req, res) => {
    // rule 1: topic name cant be 'all'
    const data = req.body.data;
    topic.newOne({
        name: req.params.topic,
        data: data
    }).then(() => {
        res.send('OK');
    }).catch(error => {
        console.error(error);
        res.status(500).send(error);
    });
});

router.delete('/:topic', checkTopicName, DBSync, (req, res) => {
    const topicName = req.params.topic;
    topic.drop({
        name: topicName
    }).then(() => {
        res.send('OK');
    }).catch(error => {
        res.status(500).send(error);
    });
});

router.delete('/all', DBSync, (req, res) => {
    topic.drop({
        // nothing
    }).then(() => {
        res.send('OK');
    }).catch(error => {
        res.status(500).send(error);
    });
});


/** DDS 路由 */
module.exports = router;