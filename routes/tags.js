var express = require('express');
var request = require('request');
var Clarifai = require('../clarifai_node.js');
var router = express.Router();

/* POST tag page. */
router.post('/', function(req, res, next) {
  Clarifai.tagURL(req.body.url, 'image13', function (err, response) { commonResultHandler(err, response, req, res, next); });
});

function commonResultHandler( err, response, req, res, next ) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			console.log("Clarifai host is throttling this application.");				
		}
		else {
			console.log("TAG request encountered an unexpected error: ");
			console.log(err);				
		}
	}
	else {
		if( response["status_code"] === "OK" ) {
			// the request completed successfully
			if( response["results"][0]["status_code"] === "OK" ) {
				console.log( 'docid='+response.results[0].docid +
					' local_id='+response.results[0].local_id +
					' tags='+response["results"][0].result["tag"]["classes"] )
					var tagList = zip(response["results"][0].result["tag"]["classes"], response["results"][0].result["tag"]["probs"], 'tag', 'prob');
					res.render('tags', {title: 'TagCloud', tags: tagList, image: req.body.url });
			}
			else {
				console.log( 'docid='+response.results[i].docid +
					' local_id='+response.results[i].local_id + 
					' status_code='+response.results[i].status_code +
					' error = '+response.results[i]["result"]["error"] )
			}

		}
	}
}

function zip(array1, array2, name1, name2) {
	var result = [];
	for (var i = 0; i < array1.length; i++) {
		var newArray = {};
		newArray[name1] = array1[i];
		newArray[name2] = array2[i];
		result.push(newArray);
	}
	return result;
}

module.exports = router;
