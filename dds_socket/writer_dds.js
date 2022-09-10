// const sleep = require('sleep')
const path = require('path')
const rti = require('rticonnextdds-connector')
const configFile = path.join(__dirname, 'DDSGateway.xml')

function Sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const run = async () => {
  const connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', configFile)
  const output = connector.getOutput('MyPublisher::MyModbusWriter')
  try {
    console.log('Waiting for subscriptions...')
    // await output.waitForSubscriptions()

    console.log('Writing...')
    for (let i = 0; i < 500; i++) {
      output.instance.setNumber('temperature', Number(Math.floor(Math.random() * 40)));
      output.instance.setString('id', String(i))
      output.write();

      await Sleep(500)
    }

    console.log('Exiting...')
    // Wait for all subscriptions to receive the data before exiting
    await output.wait()
  } catch (err) {
    console.log('Error encountered: ' + err)
  }
  connector.close()
}

const run2 = async () => {
  const connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', configFile)
  const output = connector.getOutput('MyPublisher::MyBackendWriter')
  try {
    console.log('2Waiting for subscriptions...')
    // await output.waitForSubscriptions()

    console.log('2Writing...')
    for (let i = 0; i < 500; i++) {
      output.instance.setNumber('motor_speed', Number(Math.floor(Math.random() * 40)));
      output.instance.setString('id', String(i))
      output.write();

      await Sleep(500)
    }

    console.log('2Exiting...')
    // Wait for all subscriptions to receive the data before exiting
    await output.wait()
  } catch (err) {
    console.log('2Error encountered: ' + err)
  }
  connector.close()
};


  run();
  run2();