const nps = require('path')

/**
 * enhanced-resolve 插件，为了支持 resolve 不同兼容 path；如下
 *
 * foo.js
 *   dir/
 *     index.js
 *     index.dev.js
 *     index.prod.js
 * 在 foo.js 中，require('./dir'), 将会根据 suffixList 的匹配顺序，依次进行命中，如 suffixList = ['.dev', '']
 * 则 require('./dir') 则会解析成 require('./dir/index.dev.js')
 *
 * **一般用于构建不同的静态产物**
 */
export interface SuffixResolvePluginOptions {
  suffixList?: string[]
  dir?: string
  verbose?: boolean
  include?: (filename: string) => boolean
}

export class SuffixResolvePlugin {
  protected suffixList: SuffixResolvePluginOptions['suffixList']
  protected dir: SuffixResolvePluginOptions['dir']
  protected verbose: SuffixResolvePluginOptions['verbose']
  protected include: SuffixResolvePluginOptions['include']
  protected cache: Map<any, any>
  constructor({ suffixList, dir = process.cwd(), verbose = false, include }: SuffixResolvePluginOptions = {}) {
    this.suffixList = suffixList || []
    this.dir = dir
    this.verbose = verbose
    this.include =
      include ||
      ((req) => {
        return !/node_modules/.test(req) && req.startsWith(this.dir)
      })

    this.cache = new Map()

    if (this.verbose) {
      console.log('[SuffixAliasResolvePlugin]', {
        suffixList: this.suffixList,
        dir: this.dir
      })
    }
  }

  get name() {
    // @ts-ignore
    return this.constructor.displayName || this.constructor.name
  }

  apply(resolver) {
    resolver.getHook('existingFile').tapAsync(this.name, (ctx, _, cb) => {
      const req = ctx.path
      const fs = resolver.fileSystem
      const SUFFIX_LIST = this.suffixList

      // 跳过已经被 alias 的文件
      if (
        ctx.context &&
        ctx.context.issuer &&
        (this.cache.get(ctx.context.issuer) ||
          SUFFIX_LIST.filter(Boolean).some((suffix) =>
            ctx.context.issuer.endsWith(suffix + nps.extname(ctx.context.issuer))
          ))
      ) {
        this.verbose && console.log('[SuffixAliasResolvePlugin]', 'Skip', req, 'in', ctx.context.issuer)
        return cb()
      }

      if (!this.include(req)) {
        return cb()
      }

      const extname = nps.extname(req)
      const name = nps.basename(req, extname)
      const dirname = nps.dirname(req)

      const filelist = SUFFIX_LIST.map((suffix) => {
        return { filename: nps.join(dirname, `${name}${suffix}${extname}`), suffix }
      })
      const validFile = filelist.find(({ filename }) => {
        try {
          return fs.statSync(filename).isFile()
        } catch (err) {
          if (err.code === 'ENOENT') {
            return false
          }
          throw err
        }
      })

      if (validFile && validFile.suffix) {
        this.verbose && console.log('[SuffixAliasResolvePlugin]', 'Resolve from', req, 'to', validFile.filename)
        this.cache.set(validFile.filename, true)
        ctx.path = validFile.filename
      }
      cb()
    })
  }
}
