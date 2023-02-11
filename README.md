# feature
- function(){return "this"} // 真正的globalThis，做不到完全隔离

# future
- [ ] 目前实现的方式是，每个应用只能2M （如果一个子应用进一步拆分为多个子应用，那应该如何解决全局变量共享问题）
- [ ] 独立分包方式接入

# unit test framework
- [ ] TODO
- test framework: [mocha](https://mochajs.org/)
- coverage framework: [nyc](https://istanbul.js.org/)
