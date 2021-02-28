/**
 * @desc 深度循环遍历，检索指定目录下所有 .js .ts 文件，并 push 到指定数组；
 * @param directory - 指定目录
 * @param filePathArr - 指定数组
 */
import * as path from "https://deno.land/std/path/mod.ts";
const deepLoopTraversal = async (directory: string, filePathArr: any[]) => {
  const promiseList: Promise<any>[] = [];
  for await (const dirEntry of Deno.readDir(directory)) {
    const filename = dirEntry.name
    const filePath = path.join(directory, filename);
    const stats = Deno.statSync(filePath);
    if (stats.isDirectory) {
      promiseList.push(deepLoopTraversal(filePath, filePathArr));
    } else {
      const isFile = stats.isFile;
      const extname = isFile ? path.extname(filePath) : '';
      if (extname === '.js' || extname === '.ts') {
        filePathArr.push(filePath)
      }
    }
  }
  if (promiseList.length) {
    await Promise.all(promiseList);
  }
}

const main = async () => {
  const filePathArr: Array<string> = []
  await deepLoopTraversal(Deno.cwd(),  filePathArr)
  console.log(`您指定的目录下，是 .js 或 .ts 文件，有以下内容：`)
  console.log(filePathArr)
}

main()