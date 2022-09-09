const path = require('path');
const rti = require('rticonnextdds-connector');

const ddsConfigFile = path.join(__dirname, process.env.dds_configFile);  // 必須是完整路徑

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const ddsReaderStart = async (io) => {
  try {

    const connector = new rti.Connector('MyParticipantLibrary::MySubParticipant', ddsConfigFile);
    const input = connector.getInput('MySubscriber::MyModbusReader');  // todo: 處理其他 TOPIC

    console.log('Waiting for publications...');
    await input.waitForPublications();

    console.log('Waiting for data...');
    while (true) {  // read the dds socket semaphore first !
      await input.wait();
      input.take();
      for (const sample of input.samples.validDataIter) {
        const data = sample.getJson();  // You can obtain all the fields as a JSON object
        const { id, temperature } = data;
        const result = `Received id: ${id}, temperature: ${temperature}`;
        console.log('📡⬅ : ' + result);

        io.emit('TopicData', result);

        // todo: push data to database
      }
    }

  } catch (error) {
    console.error('[ddsReaderStart] error: ', error);
  }
};

const ddsWriterStart = async (io) => {
  let toPublishQueue = new Array();
  let callbackQueue  = new Array();
  let i = 0;
  io.on('connection', (socket) => {
    socket.on('TopicDataToSend', (data, callback) => {
      console.log('📡➡: ', data);
      toPublishQueue.push(data);
      callbackQueue.push(callback);
      // callback('DONE');  // 改變Callback 時機至真的發送成功
    });

    socket.on('disconnect', () => {
      console.log('disconnect 2');
    });
  });

  const connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', ddsConfigFile)
  const output = connector.getOutput('MyPublisher::MyModbusWriter')
  try {
    // console.log('Waiting for subscriptions...')
    // await output.waitForSubscriptions()

    console.log('Waiting for data to write...');
    while (true) {  // read the dds socket semaphore first !
      if( toPublishQueue.length > 0) {
        const data = toPublishQueue.shift();
        output.instance.setString('id', String(i++));
        output.instance.setNumber('temperature', Number(data));
        output.write();
        
        const callback = callbackQueue.shift();
        callback('OK');
      }else {
        await sleep(500);
      }
    }

  } catch (error) {
    console.error('[ddsWriterStart] error: ', error);
    
    const callback = callbackQueue.shift();
    callback('ERROR');
  }
};

/**
 * dds socket server start
 * @param {Socket.io.Server} io socket.io server
 */
module.exports = async (io) => {
  ddsReaderStart(io);
  ddsWriterStart(io);
};