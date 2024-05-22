// 必要なライブラリの読込
const OpenAI = require('openai');

// OpenAIのAPIを呼び出すクライアントオブジェクトを作成
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "あなたは犬になりきって会話してください。かわいくて人懐っこい犬です。" },
                { role: "user", content: text }],
            model: "gpt-3.5-turbo",
            temperature: 1
        });    
        console.log('openaiResponse: ', completion);
        // 生成した回答のみを返す
        return completion.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}
