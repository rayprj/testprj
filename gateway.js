const utils = require('./utils');
const CronJob = require('cron').CronJob;

const spawnSync = require('child_process').spawnSync;

function Gateway() {

	this.isConnected = function() {
		const ps = spawnSync('ifconfig'); 
		return (ps.stdout.toString().indexOf('tun0') !== -1);
	};

	this.disconnect = function() {
		spawnSync('./openvpn-disconnect.sh', ['admin123']);
	};

	this.disconnectPerm = function() {
		spawnSync('./openvpn-disconnect-perm.sh', ['admin123']);
	}

	this.reconnect = function() {

		var ps = spawnSync('openvpn', ['--config', '/etc/openvpn/India.Maharashtra.Mumbai.TCP.ovpn']); 
		return (ps.stdout.toString().indexOf('Initialization Sequence Completed') !== -1);
		
	}
}

var v = new Gateway();
module.exports = v;



