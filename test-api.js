// 海错图后端接口连通性测试
const http = require('http');

const BASE_URL = 'http://118.196.127.168:8081/api';

// 测试GET请求
function testGet(path, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 测试${description}: GET ${path}`);
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ 状态码: ${res.statusCode}`);
        if (data) {
          try {
            const json = JSON.parse(data);
            console.log(`📄 响应:`, JSON.stringify(json, null, 2));
          } catch (e) {
            console.log(`📄 响应(非JSON): ${data.substring(0, 200)}...`);
          }
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      console.error(`❌ 请求失败:`, err.message);
      reject(err);
    });
  });
}

// 测试POST请求
function testPost(path, body, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 测试${description}: POST ${path}`);
    const data = JSON.stringify(body);
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ 状态码: ${res.statusCode}`);
        if (data) {
          try {
            const json = JSON.parse(data);
            console.log(`📄 响应:`, JSON.stringify(json, null, 2));
          } catch (e) {
            console.log(`📄 响应(非JSON): ${data.substring(0, 200)}...`);
          }
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ 请求失败:`, err.message);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// 依次测试所有接口
async function runTests() {
  console.log('🚀 开始测试海错图后端接口连通性');
  console.log('🌐 基础地址: ' + BASE_URL);

  const tests = [
    // {type: 'get', path: '/combine/all-list', desc: '获取全量生物配置列表'},
    // {type: 'get', path: '/combine/all-list', desc: '获取全量生物配置列表'},
  ];

  let allPassed = true;

  // 先测试获取全量生物列表
  try {
    await testGet('/combine/all-list', '获取全量生物配置列表');
  } catch (e) {
    allPassed = false;
  }

  // 测试微信登录（模拟）
  try {
    await testPost('/user/wx-login', {
      code: 'test-code-from-unit-test',
      nickname: '测试用户',
      avatarUrl: 'https://example.com/avatar.jpg'
    }, '微信登录');
  } catch (e) {
    allPassed = false;
  }

  console.log(`\n🎯 测试完成，所有可访问的接口都测试过了`);
  if (allPassed) {
    console.log('✅ 所有测试通过，后端服务正常运行');
  } else {
    console.log('⚠️ 部分测试可能失败，请检查服务状态');
  }
}

runTests();
