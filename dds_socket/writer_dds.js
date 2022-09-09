const sleep = require('sleep')
const path = require('path')
const rti = require('rticonnextdds-connector')
const configFile = path.join(__dirname, 'DDSGateway.xml')

const run = async () => {
  const connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', configFile)
  const output = connector.getOutput('MyPublisher::MyModbusWriter')
  try {
    console.log('Waiting for subscriptions...')
    // await output.waitForSubscriptions()

    console.log('Writing...')
    for (let i = 0; i < 500; i++) {
      
      // output.instance.setNumber('temperature', 37);
      // output.instance.setString('id', '1234');
      let n = Number(Math.floor(Math.random() * 40)), s = String(Math.floor(Math.random() * 1000));
      output.instance.setNumber('temperature', Number(Math.floor(Math.random() * 40)));
      output.instance.setString('id', String(i))
      output.write();

      sleep.msleep(500)
    }

    console.log('Exiting...')
    // Wait for all subscriptions to receive the data before exiting
    await output.wait()
  } catch (err) {
    console.log('Error encountered: ' + err)
  }
  connector.close()
}

run()
