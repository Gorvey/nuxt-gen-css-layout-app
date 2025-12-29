/*
 * @Author: Gorvey 2324850628@qq.com
 * @Date: 2025-12-29 17:24:50
 * @LastEditors: Gorvey 2324850628@qq.com
 * @LastEditTime: 2025-12-29 17:26:23
 * @FilePath: \nuxt-gen-css-layout-app\app\constants\buildin-components.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 左侧面板可拖拽项定义 */
export const DRAGGABLE_CONTAINERS = [
  { type: 'flex' as const, label: 'Flex', icon: 'i-lucide-layout-grid' },
  { type: 'block' as const, label: 'Div', icon: 'i-lucide-layout-grid' },
] as const

export const DRAGGABLE_ELEMENTS = [
  { type: 'text' as const, label: '文本', icon: 'i-lucide-type' },
  { type: 'image' as const, label: '图片', icon: 'i-lucide-image' },
  { type: 'button' as const, label: '按钮', icon: 'i-lucide-square' },
  { type: 'tag' as const, label: '标签', icon: 'i-lucide-tag' },
  { type: 'icon' as const, label: '图标', icon: 'i-lucide-star' },
  { type: 'divider' as const, label: '分割线', icon: 'i-lucide-minus' },
] as const
