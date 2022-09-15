// hard code
const forbiddenNames = [ 'all' ];
const validNames     = [ 'SensorData', 'BackendData' ];

/**
 * topic name 檢查 middleware
 */
module.exports.checkTopicName = (req, res, next) => {
    const topic = req.params.topic || undefined;
    if(!topic 
       || forbiddenNames.includes(topic)
    //    || !validNames.includes(topic)  // uncomment this line for release version!!!!!
    ) {
        res.status(403).send('invalid topic name');
        return;
    }
    next();
  };