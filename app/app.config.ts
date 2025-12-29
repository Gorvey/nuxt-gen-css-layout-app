/*
 * @Author: Gorvey 2324850628@qq.com
 * @Date: 2025-12-29 16:16:15
 * @LastEditors: Gorvey 2324850628@qq.com
 * @LastEditTime: 2025-12-29 16:17:43
 * @FilePath: \nuxt-gen-css-layout-app\app\app.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
    tabs: {
      compoundVariants: [
        {
          orientation: 'horizontal',
          variant: 'link',
          class: {
            list: 'border-b-0 mb-0',
            indicator: 'rounded-full',
          },
        },
      ],
    },
  },
})
