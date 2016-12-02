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
  },

  "proxy": {
    enabled: {
      doc: "Proxy configuration",
      format: Boolean,
      default: false
    }
  },
  "nightmare": {
    enabled: {
      doc: "Nigtmare configuration",
      format: Boolean,
      default: true
    }
  },
  "screenshotpath": {
    doc: "screenshotpath",
    format: String,
    default: "./screenshots"
  },
  "gatewayUrlLimit": {
    doc: "gatewayUrlLimit",
    format: Number,
    default: 20
  },
  "urlProessingLimit": {
    doc: "urlProessingLimit",
    format: Number,
    default: 2
  },
  "request": {
    "headers": {
      doc: "Default request configuration",
      format: Object,
      default: { 
         "cache-control": "no-cache",
         "accept-encoding": "deflate, sdch",
         "referer": "https://www.google.com/",
         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
         "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
         "upgrade-insecure-requests": "1" 
      }
    }
  }

});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;