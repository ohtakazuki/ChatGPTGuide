// 必要なライブラリの読込
const { WebClient } = require('@slack/web-api');
const { Configuration, OpenAIApi } = require("openai");

// Slack及びOpenAIのAPIを呼び出すクライアントオブジェクトを作成
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openaiClient = new OpenAIApi(openaiConfig);

// メインの関数
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Slackのurl_verification（初回認証）要求: 認証コードを返す
    const body = eval(req.body);
    if (body.challenge) {
        context.res = {
            body: body.challenge
        };
        return;
    }

    context.log('2:');
    // Slackからのリトライ要求: 重複メッセージ送信を防ぐため何もしない
    if (req.headers['x-slack-retry-num']) {
        return { statusCode: 200, body: JSON.stringify({ message: "No need to resend" }) };
    }

    context.log('3:');
    // メンションされた場合のみ応答
    if (body.event.type === 'app_mention') {
        try {
            context.log(body);
            // メッセージからメンションを除去
            const text = body.event.text.replace(/<@[^>]+>/g, '');
            context.log(text);

            // OpenAI APIが回答を生成
            const openaiResponse = await createCompletion(text);

            // Slackにメッセージを送信
            const thread_ts = body.event.thread_ts || body.event.ts;
            await postMessage(body.event.channel, openaiResponse, thread_ts);

            // 呼び出し元への戻り値を返す
            return { statusCode: 200, body: JSON.stringify({ message: openaiResponse }) };
        } catch (error) {
            console.error(error);
        }
    }
};

// OpenAI APIが回答を生成
async function createCompletion(text) {
    try {
        const response = await openaiClient.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: text }],
        });
        console.log('openaiResponse: ', response);
        // 生成した回答のみを返す
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}

// Slackにメッセージを送信
async function postMessage(channel, text, thread_ts) {
    try {
        let payload = {
            channel: channel,
            text: text,
            thread_ts: thread_ts
        };
        // Slackにメッセージを送信
        const response = await slackClient.chat.postMessage(payload);
        console.log('slackResponse: ', response);
    } catch (err) {
        console.error(err);
    }
}