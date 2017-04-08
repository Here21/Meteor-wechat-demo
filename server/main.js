import { Meteor } from 'meteor/meteor';
import jsSHA from './sha'

Meteor.startup(() => {
  // code to run on server at startup
  WebApp.connectHandlers.use("/validateToken", function(req, res, next) {

    const query = req.query;
    console.log("*** URL:" + req.url);
    console.log(query);
    const signature = query.signature;
    console.log(signature)
    const echostr = query.echostr;
    const timestamp = query['timestamp'];
    const nonce = query.nonce;
    let oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "Martinzhz1994tokentest";//这里是你在微信开发者中心页面里填的token
    oriArray.sort();
    let original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature );
    //var scyptoString = sha1(original);

    let shaObj2 = new jsSHA(original, 'TEXT');
    scyptoString = shaObj2.getHash('SHA-1', 'HEX');
    if(signature == scyptoString){
      res.end(echostr);
      console.log("Confirm and send echo back");
    }else {
      res.end("false");
      console.log("Failed!");
    }
  });
});
