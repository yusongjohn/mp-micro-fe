const path = require('path');
module.exports = {
    apps: [
        { // 不提供 namespace 就是主应用，其他为子应用（必须提供namespace）
            projectDir: path.resolve(__dirname, 'miniprogramA'),
            // ignore
        },
        {
            projectDir: path.resolve(__dirname, 'miniprogramB'),
            namespace: 'b',
            // ignore
        },
        {
            projectDir: path.resolve(__dirname, 'miniprogramC'),
            namespace: 'c',
            // ignore
        }
    ],
    workspace: __dirname,
};
