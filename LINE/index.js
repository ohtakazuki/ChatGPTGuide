// 必要なライブラリの読込
const line = require('@line/bot-sdk');
const OpenAI = require('openai');

// Line及びOpenAIのAPIを呼び出すクライアントオブジェクトを作成
const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_SECRET,
};
const lineClient = new line.Client(lineConfig);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// メインの関数
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.message || (req.body && req.body.events)) {
        if (req.body && req.body.events[0]) {
            // OpenAI APIが回答を生成
            const openaiResponse = await createCompletion(req.body.events[0].message.text);

            // Lineにメッセージを送信
            message = {
                type: "text",
                text: openaiResponse
            }
            console.log(message);
            if (req.body.events[0].replyToken) {
                lineClient.replyMessage(req.body.events[0].replyToken, message);
            }
        }
        else {
            context.res = {
                status: 200,
                body: "You said" + req.query.message
            };
        }
    }
    else {
        context.res = {
            status: 200,
            body: "Please check the query string in the request body"
        };
    };
};

// OpenAI APIが回答を生成
async function createCompletion(text) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: text }],
            model: "gpt-3.5-turbo",
        });    
        console.log('openaiResponse: ', completion);
        // 生成した回答のみを返す
        return completion.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}
