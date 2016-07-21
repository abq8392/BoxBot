/* Connect with Slack RTM API */

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

var token = process.env.SLACK_API_TOKEN || 'xoxb-60992393669-9f0oujoIB5o4ea8AUNToEPi9';

/* Connect with Slack Web API */
var WebClient = require('@slack/client').WebClient;

var rtm = new RtmClient(token, {loglevel: 'debug'});
var web = new WebClient(token);

rtm.start();


/* Capturing the rtm.start payload */
/*
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log('Message:', message);
});
*/
/* Send message if connect success*/
/*
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
    rtm.sendMessage('TOP:success', 'C1T040G3U');
    console.log("Send by RTM");
});
*/

module.exports = function(robot){
    
    // respond every messages from the room
    robot.hear(/hello/igm, function(msg){
        msg.send('hello world!');
    });

    //respond when robot's name was called
    robot.respond(/show me the money/igm, function(msg){
        msg.reply('filled your mineral and gas!');
    });

    //function to check URL
    robot.respond(/check (.*)/, function(msg){
        var content = msg.match[1];
        if(content.indexOf('http') < 0){
            return msg.send('Not a correct URL. Do you remember to add "http" ?');
        }
        robot.http(content).get()(function(err, res, body){
            if(err)
                return msg.send(err);
            msg.send(res.statusCode+'');
        })
    });

    //function to help user express opinions in #polling channel
    robot.respond(/say (.*)/, function(msg){

        /* Send private message to bot, reply to #polling */
        if(msg.envelope.room[0] == 'D'){
            rtm.sendMessage('AnonymousUser: ' + msg.match[1], 'C1T040G3U');
        }

    });

    //function to test poll
    robot.respond(/poll (.*)/, function(msg){

        /* Send private message to bot, reply to #polling */
        if(msg.envelope.room[0] == 'D'){
            //rtm.sendMessage('AnonymousUser: ' + msg.match[1], 'C1T040G3U');
            var str_arr = msg.match[1].split(" ");
            
            var data = {
            	attachments:[
            	{
            		"fallback": "Would you recommend it to customers?",
            		"title": "Would you recommend it to customers?",
            		"callback_id": "comic_1234_xyz",
            		"color": "#3AA3E3",
            		"attachment_type": "default",
            		"actions": [
            		{
            			"name": "recommend",
            			"text": "Recommend",
            			"type": "button",
            			"value": "recommend"
            		},
            		{
            			"name": "no",
            			"text": "No",
            			"type": "button",
            			"value": "bad"
            		}
            		]
            	}
            	]
            };

            for (i = 0 ; i < str_arr.length; i++){
            	if(i == 0)
            		//rtm.sendMessage('poll: ' + str_arr[i], 'C1T040G3U', data);
            		web.chat.postMessage('C1T040G3U', str_arr[i], data, function(){});
            	//web.chat.postMessage('C1T040G3U', 'testForWebClient');

            }
        }
    });

    
}

