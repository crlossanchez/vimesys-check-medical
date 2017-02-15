'use strict';
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

module.exports = function(app, cb) {

	socket.on('error', (err) => {
		console.log(`socket error:\n${err.stack}`);
		socket.close();
	});

	socket.on('message', (msg, rinfo) => {
		console.log(rinfo.address + ":" + rinfo.port + " " + msg);
		var array = msg.toString().replace(/(\r\n|\n|\r)/gm,"").split(',');
		// 1. Type of message
		switch(parseInt(array[2])){
			// 1.1. Register data
			case 1:
				// a) Drop sensor
				if(parseInt(array[5]) === 5){
					if(array.length == 8){/*saveDataDripSensor(array)*/} 
					else { console.log('Data length '+ array.length +': invalid'); }
				}
				// b) Another sensor value
				else{ 
					console.log('Data, type of sensor ' + array[5] + ': invalid'); 
				}
				break;
			// 1.2. Creational 
			case 2:
				// a) Drop Sensor
				if(parseInt(array[5]) === 5){
					if(array.length == 8){/*creationalDripSensor(array);*/}
					else { console.error('Creational length '+ array.length +': invalid'); }
				}
				// b) Another sensor value
				else{
					console.error('Creational, type of sensor ' + array[5] + ': invalid');
				}
				break;
			// 1.3. Other message
			default:
				console.log("Type of message " + array[2] + ": invalid");
		}
	});


	socket.on('listening', () => {
		var address = socket.address();
		console.log(`socket udp listening ${address.address}:${address.port}`);
	});

	socket.bind(6000);
  	// nc -vu 0.0.0.0 6000
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  process.nextTick(cb); // Remove if you pass `cb` to an async function yourself
};
