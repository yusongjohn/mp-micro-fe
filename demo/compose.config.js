const path = require('path');
module.exports = {
    apps: [
        { // 不提供 namespace 就是主应用，其他为子应用（必须提供namespace）
            name: 'a',
            projectDir: path.resolve(__dirname, 'miniprogramA'),
            // ignore
            // 如何支持独立分包
        },
        {
            name: 'b',
            projectDir: path.resolve(__dirname, 'miniprogramB'),
            namespace: 'b',
            // ignore
            // 如何支持独立分包
        },
        {
            name: 'c',
            projectDir: path.resolve(__dirname, 'miniprogramC'),
            namespace: 'c',
        }
    ],
    workspace: __dirname,
};
