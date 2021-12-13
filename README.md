# suffix-resolve-plugin

[![Build status](https://img.shields.io/travis/余聪/suffix-resolve-plugin/master.svg?style=flat-square)](https://travis-ci.com/余聪/suffix-resolve-plugin)
[![Test coverage](https://img.shields.io/codecov/c/github/余聪/suffix-resolve-plugin.svg?style=flat-square)](https://codecov.io/github/余聪/suffix-resolve-plugin?branch=master)
[![NPM version](https://img.shields.io/npm/v/suffix-resolve-plugin.svg?style=flat-square)](https://www.npmjs.com/package/suffix-resolve-plugin)
[![NPM Downloads](https://img.shields.io/npm/dm/suffix-resolve-plugin.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/suffix-resolve-plugin)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> enhanced-resolve 插件，为了支持 resolve 不同优先级后缀路径

如下：

```text
foo.js
dir/
  index.js
  index.dev.js
  index.prod.js
```

在 foo.js 中，require('./dir'), 将会根据 suffixList 的匹配顺序，依次进行命中，如 suffixList = ['.dev', '']
则 require('./dir') 则会解析成 require('./dir/index.dev.js')

## Installation

```bash
npm install suffix-resolve-plugin
# or use yarn
yarn add suffix-resolve-plugin
```

## Usage

```javascript
import { SuffixResolvePlugin } from 'suffix-resolve-plugin'

webpackConfig = {
  resolve: {
    plugins: [
      new SuffixResolvePlugin({
        suffixList: ['.dev', ''],
        dir: contextPath
      })
    ]
  }
}
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong@yuanfudao.com">yucong@yuanfudao.com</a>.

## License

MIT - [余聪](https://github.com/余聪) 🐟
