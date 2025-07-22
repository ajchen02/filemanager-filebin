import { Context, Schema } from 'koishi'
import { } from "koishi-plugin-filemanager"

export const name = 'filemanager-filebin'
export const reusable = true

export interface Config {
  endpoint: string
  seed: string
  enablePic: boolean
  enableAudio: boolean
  enableVideo: boolean
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({endpoint: Schema.string().description('图床服务的地址').default("https://filebin.net")}),
  Schema.object({seed: Schema.string().description('用作保存文件夹名称的seed值。请避免该值与其他人的重复！').required()}),
  Schema.object({
    enablePic: Schema.boolean().default(false).description('开启图床服务'),
    enableAudio: Schema.boolean().default(true).description('开启音床服务'),
    enableVideo: Schema.boolean().default(true).description('开启视频床服务')
  }).description("启用功能")
])

export const inject = ['filemanager'];

export function apply(ctx: Context, config: Config){
  // write your plugin here
  //console.log(ctx.scope)

  ctx.filemanager.img.reg('filebin', config.endpoint, async (file: Buffer, fileName: string) =>
  {
    const url = config.endpoint;
    const binNum = String(Math.floor(Date.now()/1000/60/60/24/5))

    const bin = config.seed + binNum
    const data = await ctx.filemanager.axios.post(`${url}/${bin}/${fileName}`, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      }
    });

    return `${url}/${bin}/${fileName}`;
  });

  ctx.on('dispose', () => {
    ctx.filemanager.img.unReg('filebin')
  })
}
