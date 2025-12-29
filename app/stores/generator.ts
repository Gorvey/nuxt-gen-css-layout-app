/**
 * 代码生成 Store
 * 将 DSL 节点树转换为 HTML 代码
 */

import type { DSLNode } from '~/types/dsl'

/**
 * 代码生成 Store
 */
export const useGeneratorStore = defineStore('generator', () => {
  /**
   * 生成 HTML 代码
   * @returns HTML 字符串
   */
  const generateHTML = (): string => {
    // TODO: 实现代码生成逻辑
    return '<!-- TODO: 生成代码 -->'
  }

  return {
    generateHTML,
  }
})

/**
 * 代码生成 Store 类型导出
 */
export type GeneratorStore = ReturnType<typeof useGeneratorStore>
