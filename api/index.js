const express = require('express');
const cors = require('cors'); // 引入 cors 中间件
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // 加载 .env 文件中的环境变量
// console.log('Environment variables:', process.env.MY_API_KEYS); // 调试输出

const app = express();
const port = process.env.PORT || 3000;

// 使用 cors 中间件允许跨域请求
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 使用 express.static 中间件来提供静态文件
// app.use(express.static(path.join(__dirname, '../public')));//不再使用public文件夹
app.use('/css', express.static(path.join(__dirname, '../css'), {
  maxAge: '1d' // 缓存css 1天
}));

app.use('/js', express.static(path.join(__dirname, '../js'), {
  maxAge: '1d' // 缓存js 1天
}));

app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/data', express.static(path.join(__dirname, '../data')));
//定义根目录
app.use(express.static(path.join(__dirname, '..')));

//使用compression中间件减小文件体积
const compression = require('compression');
app.use(compression());

// 定义一个路由，用于返回 API 密钥
app.get('/settings', (req, res) => {
  const settings_values = process.env.MY_API_KEYS;// API 密钥从环境变量读取
  // 检查请求头中的 'X-Requested-With' 字段，判断是否为 XMLHttpRequest 请求 (通常是 fetch 发出的)
  if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
    // 如果是 AJAX 请求 (fetch), 返回 API key
    if (settings_values) {
      res.json({ settings_values });
      // console.log(settings_values);//vs终端中打印信息
    } else {
      res.status(500).json({ error: 'API_KEY 未设置' });
    }
  } else {
    // 如果不是 AJAX 请求 (例如直接在浏览器中访问)，返回空白
    res.status(204).send(); // 204 No Content, 不返回任何内容
  }
});

app.get('/', (req, res) => {//或者app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
  console.log(`\n服务器运行在http://localhost:${port}`);
});


module.exports = app;