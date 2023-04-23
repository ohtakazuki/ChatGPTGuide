// 必要なライブラリの読込
const { Configuration, OpenAIApi } = require("openai");

// OpenAIのAPIを呼び出すクライアントオブジェクトを作成
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 非同期処理を行うためにasync/awaitを使用
const asyncFunc = async () => {
// OpenAIのAPIを呼び出し
const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "言語モデルについて説明して"}],
});
// 結果を表示
console.log(completion.data.choices[0].message);  
}

// 上記の関数を実行
asyncFunc();