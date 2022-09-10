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

    // console.log('[ddsReaderStart] Waiting for publications...');
    await input.waitForPublications();

    console.log('[ddsReaderStart] Waiting for data...');
    while (true) {
      await input.wait();
      input.take();
      for (const sample of input.samples.validDataIter) {
        let result = "";
        try {
          const data = sample.getJson();  // You can obtain all the fields as a JSON object
          const { id, temperature } = data;
          result = `Received id: ${id}, temperature: ${temperature}`;
        } catch (error) {
          console.log('[ddsReaderStart] error: ', error);  continue;
        } finally {
          console.log('📡⬅ : ' + result);
          io.emit('TopicData', result);  // todo: => "TopicData: {Topic}"
          // todo: push data to database
        }
      }
    }
  } catch (error) {
    console.error('[ddsReaderStart] error: ', error);
  }
  console.log('[ddsReaderStart] ddsReader is down!');
};

const ddsWriterStart = async (io) => {
  let toPublishQueue = new Array();
  let callbackQueue  = new Array();
  let i = 0;
  io.on('connection', (socket) => {
    socket.on('TopicDataToSend', (data, callback) => {  // todo: => "TopicDataToSend: {Topic}"
      console.log('📡➡: ', data);  // todo: 改時機?
      toPublishQueue.push(data);
      callbackQueue.push(callback);  // 發送成功或失敗時才呼叫
    });

    socket.on('disconnect', () => {  // 斷線後解除監聽
      socket.off('TopicDataToSend', () => { /* do nothing */ });
      console.log('disconnect 2');
    });
  });

  const connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', ddsConfigFile)
  const output = connector.getOutput('MyPublisher::MyModbusWriter')
  try {
    // console.log('[ddsWriterStart] Waiting for subscriptions...')
    // await output.waitForSubscriptions()

    console.log('[ddsWriterStart] Waiting for data to write...');
    while (true) {
      if( toPublishQueue.length > 0) {
        const data = toPublishQueue.shift();
        let outputErrorMsg = "";
        try {
          output.instance.setString('id', String(i++));
          output.instance.setNumber('temperature', Number(data));
          output.write();
        } catch (error) {
          outputErrorMsg = 'ERROR: ' + error;
          console.log('[ddsWriterStart] error: ', error);
        } finally {
          const socketCallback = callbackQueue.shift();
          socketCallback(outputErrorMsg? outputErrorMsg : 'OK');
        }
      }else {
        await sleep(500);
      }
    }
  } catch (error) {
    console.error('[ddsWriterStart] error: ', error);
    
    const socketCallback = callbackQueue.shift();
    socketCallback('ERROR: ' + error);
    // todo: emit the error 
  }
  console.log('[ddsWriterStart] ddsWriter is down!');
};

/**
 * dds socket server start
 * @param {Socket.io.Server} io socket.io server
 */
module.exports = async (io) => {
  ddsReaderStart(io);
  ddsWriterStart(io);
};