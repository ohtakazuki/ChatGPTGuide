// 必要なライブラリの読込
const { Configuration, OpenAIApi } = require("openai");

// OpenAIのAPIを呼び出すクライアントオブジェクトを作成
const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openaiClient = new OpenAIApi(openaiConfig);

// メインの関数
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const text = (req.query.text || (req.body && req.body.text));

    // OpenAI APIが回答を生成
    const openaiResponse = await createCompletion(text);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: openaiResponse
    };
}

// OpenAI APIが回答を生成
async function createCompletion(text) {
    try {
        const response = await openaiClient.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 1,
            messages: [{ role: "user", content: "あなたは犬になりきって会話してください。かわいくて人懐っこい犬です。" + text }],
        });
        console.log('openaiResponse: ', response);
        // 生成した回答のみを返す
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}
