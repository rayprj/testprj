const request = require('request');
const fs = require('fs');
const processors = require('./libs/post-process-scripts');
const Promise = require('promise');
const db      = require('./database/manager');
const config  = require('./config/config.js');
const utils = require('./utils');
var proxyEnv = process.env.PROXY_ENV || '';

function requestCallBack(urlId,error, response, body) {
    if (!error && response.statusCode == 200) {
        
        //console.log(response.headers);
        //console.log(body);
        //pick
        processData(body);
    }
    else{
        console.log(error, response, body);
    }
}

function processData(body){
    processors.wwwbestbuycom.processData(body);
}

function sendRequest(url,requestCallBack){
    var options = {
        url: url,
        ca: fs.readFileSync("./crawlera-ca.crt"),
        requestCert: true,
        rejectUnauthorized: true
    };

    var new_req = request.defaults({
        'proxy': 'http://'+proxyEnv+':@proxy.crawlera.com:8010'
    });    

    new_req(options, requestCallBack);
}


function initPostScripts(){
    "use strict";
    utils.db.getPostProccessConfigs().then(function(processConfigs){
        utils.db.getUrlContents('0').then(function(urlData){
            
            for(let i=0;i<urlData.length;i++){
                let urlRow = urlData[i];
                let domain = urlRow.domain.replace(/\./g,"");
                //console.log(processors[domain][urlRow.type])
                if(processConfigs[domain]){
                    for(let type in processConfigs[domain]){
                        let url = processConfigs[domain][type].url;
                        let html = urlRow.content;
                        //console.log(domain,type,url)
                        if(processors[domain] && processors[domain][type]){

                            processors[domain][type]['preProcessData'](html,url).then(function(serviceUrl){
                                
                                sendRequest(serviceUrl,function(error, response, body){
                                    if (!error && response.statusCode == 200) {
                                        processors[domain][type]['processData'](body).then(function(data){
                                            processors[domain][type]['postProcessData'](data,urlRow);
                                        });
                                    }
                                    else{
                                        //console.log(error, response, body);
                                    }
                                });
                            });
                        }
                    }                
                }
                 
            }
            
        })
    })
}

initPostScripts();
