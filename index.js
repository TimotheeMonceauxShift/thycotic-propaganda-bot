require('dotenv').config();
const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api'); 

const app = express();

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slackWebClient = new WebClient(process.env.SLACK_TOKEN);
const router = express.Router();
router.use('/events', slackEvents.requestListener());

const texts = [
    'Thycotic has got to be the best tool ever invented',
    'Fun fact: Thycotic works better than you do',
    'Thycotic is the best thing to have ever happened to us',
    "Every day's sunny when you're using Thycotic",
    "Thank you Thycotic for making the world a safer place",
    "Tell your mom about Thycotic"
];
const getText = () => texts[Math.floor(Math.random()*texts.length)];

const handleEvent = (event) => {
    if (event.bot_id === undefined && 
        (event.text.toLowerCase().indexOf('thycotic') >= 0
        || event.text.toLowerCase().indexOf('thycoshit') >= 0))
        return slackWebClient.chat.postMessage({
            text: getText(),
            channel: event.channel
        });
}

slackEvents.on('message', handleEvent);

router.get('/', (req, res) => {res.send("Hello, world!")});

app.use('/', router);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8000, () => console.log('READY!'));