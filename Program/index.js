// 必要なライブラリの読込
const OpenAI = require('openai');

// OpenAIのAPIを呼び出すクライアントオブジェクトを作成
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 非同期処理を行うためにasync/awaitを使用
async function main() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "言語モデルについて説明して" }],
        model: "gpt-3.5-turbo",
    });
    // 結果を表示
    console.log(completion.choices[0].message);
}

// 上記の関数を実行
main();