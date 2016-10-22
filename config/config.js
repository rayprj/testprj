var convict = require('convict');

// Define a schema
var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  server: {
    ip: {
      doc: "IP address to bind",
      format: 'ipaddress',
      default: '0.0.0.0'
    },
    port: {
      doc: "port to bind",
      format: 'port',
      default: 8080
    }
  },
  database: {
    host: {
      doc: "Database host name/IP",
      format: String,
      default: 'localhost'
    },
    database: {
      doc: "Database name",
      format: String,
      default: 'rayprj'
    },
    user: {
      doc: "User name",
      format: String,
      default: 'root'
    },
    password: {
      doc: "User password",
      format: String,
      default: ''
    },
    port: {
      doc: "Port",
      format: Number,
      default: 3306
    }
  }
});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;