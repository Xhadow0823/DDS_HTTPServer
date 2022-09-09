const path = require('path')
const rti = require('rticonnextdds-connector')
const configFile = path.join(__dirname, 'DDSGateway.xml')

const run = async () => {
  const connector = new rti.Connector('MyParticipantLibrary::MySubParticipant', configFile)
  const input = connector.getInput('MySubscriber::MyModbusReader')
  try {
    console.log('Waiting for publications...')
    await input.waitForPublications()

    console.log('Waiting for data...')
    while (true) {  // read the dds socket semaphore first !
      await input.wait();
      input.take();
      for (const sample of input.samples.validDataIter) {
        const data = sample.getJson();  // You can obtain all the fields as a JSON object
        const { id, temperature } = data;
        const result = `Received id: ${id}, temperature: ${temperature}`;
        console.log('📡⬅ : ' + result);
      }
    }
  } catch (err) {
    console.log('Error encountered: ' + err)
  }
  connector.close()
}

run()
