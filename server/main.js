import { Meteor } from 'meteor/meteor';
import jsSHA from './sha'
import wechat from 'wechat'
import WechatAPI from 'wechat-api'

const appid = 'wx0ccf0a1041ca40b9';
const appsecret = 'd4624c36b6795d1d99dcf0547af5443d';


const api = new WechatAPI(appid, appsecret);

const config = {
  token: 'Martinzhz1994tokentest',
  appid: 'wx0ccf0a1041ca40b9',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

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

  WebApp.connectHandlers.use("/wechat", wechat(config, wechat.text(function (message, req, res, next) {
    api.getUser({openid: message.FromUserName, lang: 'en'}, (e, r) => {
      console.log(r)
      res.reply(r.nickname)
    });
      // message为文本内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125035',
      // MsgType: 'text',
      // Content: 'http',
      // MsgId: '5837397576500011341' }
    }).image(function (message, req, res, next) {
      // message为图片内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359124971',
      // MsgType: 'image',
      // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
      // MediaId: 'media_id',
      // MsgId: '5837397301622104395' }
    }).voice(function (message, req, res, next) {
      // message为音频内容
      // { ToUserName: 'gh_d3e07d51b513',
      // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
      // CreateTime: '1359125022',
      // MsgType: 'voice',
      // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
      // Format: 'amr',
      // MsgId: '5837397520665436492' }
    })

  ));
});
