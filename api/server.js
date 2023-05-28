const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");


function getData(req) {
    const executor = (resolve, reject) => {
        const data = [];
        req.on("data", chunk => data.push(...chunk));
        req.on("end", () => {
            try {
                const uint8Array = new Uint8Array(data);
                resolve(uint8Array);
            } catch (error) {
                reject(error);
            }
        });
    }
    return new Promise(executor);
}


async function read_file_text(req, res) {
    const data = await getData(req);
    const text = new TextDecoder().decode(data);
    const json = JSON.parse(text);
    const filePath = path.normalize(json["path"]);
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
        if (err) {
            res.statusCode = 400;
            res.end();
            throw err;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(data);
    });
}


async function read_file_blob(req, res) {
    const data = await getData(req);
    const text = new TextDecoder().decode(data);
    const json = JSON.parse(text);
    const filePath = path.normalize(json["path"]);
    fs.readFile(filePath, { encoding: "binary" }, (err, data) => {
        if (err) {
            res.statusCode = 400;
            res.end();
            throw err;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/octet-stream");
        res.end(file);
    });
}


// 请求监听器
function requestListener(req, res) {
    // 路由
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case "/api/fs/read_file_text": {
            read_file_text(req, res);
        } break;

        case "/api/fs/read_file_blob": {
            read_file_blob(req, res);
        } break;

        default: {
            res.end();
        } break;
    }
}


const server = http.createServer();
server.on("request", requestListener);
server.listen(0);


// const BetterQQNT_API_HOST = server.address().address;
const BetterQQNT_API_HOST = "localhost";
const BetterQQNT_API_PORT = server.address().port;


// 导出
module.exports = {
    BetterQQNT_API_HOST,
    BetterQQNT_API_PORT
}