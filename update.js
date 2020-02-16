
var fs = require('fs');
const http = require('xmlhttprequest');

var history;

function httpGet(theUrl)
{
    var xmlHttp = new http.XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.onreadystatechange = function (aEvt) {
        if (xmlHttp.readyState == 4) {
          console.log("Status: ", xmlHttp.status);
        //   console.log("Response message: ", xmlHttp.responseText);
        }
      };
    xmlHttp.send();
    return xmlHttp.responseText;
}

var _promiseHistoryRequest = function () {
	return new Promise(function (resolve, reject) {
        var history = fs.readFileSync('data.json', 'utf8');
        resolve(history);
	});
};


var _promiseNewRecordRequest = function (param) {
	return new Promise(function (resolve, reject) {
        var result = httpGet('https://www.nlotto.co.kr/common.do?method=getLottoNumber&drwNo='+ param);
        resolve(result);
	});
};


function requestNewRecord(arg) {
    _promiseNewRecordRequest(arg)
        .then(function (response) {
            const last = JSON.parse(response);
            if( last && last.drwNo) {
                history.data.push(last);
                fs.writeFile("data.json", JSON.stringify(history), 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                }); 
            }
        }, function (error) {
            console.error(error);
        });
}

_promiseHistoryRequest()
        .then( function(response) {
            history = JSON.parse(response);
            last = history.data[history.data.length-1];
            requestNewRecord(last.drwNo+1);
        }
    );
