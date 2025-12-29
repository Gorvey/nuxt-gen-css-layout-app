/**
 * 代码生成 Hook
 * 将 DSL 节点树转换为 Tailwind HTML 代码
 */

import type { DSLNode, ContainerNode, ElementNode, StyleConfig, FlexLayoutConfig } from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'
import {
  getPaddingClass,
  getBorderRadiusClass,
  getBackgroundColorClass,
  getWidthClass,
  getHeightClass,
  getFlexDirectionClass,
  getFlexJustifyClass,
  getFlexAlignClass,
  getGapClass,
  getFlexGrowClass,
  getFlexShrinkClass,
  getFlexBasisClass
} from '~/constants/presets'

/**
 * 生成样式类名数组
 * @param styles - 样式配置
 * @param isInFlexContainer - 是否在 flex 容器内
 * @returns Tailwind 类名数组
 */
function generateStyleClasses(styles: StyleConfig, isInFlexContainer = false): string[] {
  const classes: string[] = []

  if (styles.width) {
    classes.push(getWidthClass(styles.width))
  }
  if (styles.height) {
    classes.push(getHeightClass(styles.height))
  }
  if (styles.padding && styles.padding !== 'none') {
    classes.push(getPaddingClass(styles.padding))
  }
  if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
    classes.push(getBackgroundColorClass(styles.backgroundColor))
  }
  if (styles.borderRadius && styles.borderRadius !== 'none') {
    classes.push(getBorderRadiusClass(styles.borderRadius))
  }

  // 如果在 flex 容器内,处理 flexItem 配置
  if (isInFlexContainer) {
    const flexItem = styles.flexItem || { grow: 0, shrink: 1, basis: 'auto' as const, width: 'full' as const }
    classes.push(getFlexGrowClass(flexItem.grow))
    classes.push(getFlexShrinkClass(flexItem.shrink))
    classes.push(getFlexBasisClass(flexItem.basis))
    // width 快捷设置,默认 full
    if (flexItem.width === 'full') {
      classes.push('w-full')
    }
  }

  return classes
}

/**
 * 生成 Flex 布局类名数组
 * @param config - Flex 布局配置
 * @returns Tailwind 类名数组
 */
function generateFlexClasses(config: FlexLayoutConfig): string[] {
  const classes: string[] = ['flex']

  classes.push(getFlexDirectionClass(config.direction))
  classes.push(getFlexJustifyClass(config.justify))
  classes.push(getFlexAlignClass(config.align))

  if (config.gap && config.gap !== 'none') {
    classes.push(getGapClass(config.gap))
  }

  return classes
}

/**
 * 生成容器节点 HTML
 * @param node - 容器节点
 * @param indent - 缩进级别
 * @param parentIsFlexContainer - 父容器是否为 flex 容器
 * @returns HTML 字符串
 */
function generateContainerHTML(node: ContainerNode, indent: number = 0, parentIsFlexContainer = false): string {
  const indentStr = '  '.repeat(indent)
  const classes: string[] = []

  if (node.layout === 'flex') {
    classes.push(...generateFlexClasses(node.layoutConfig))
  }

  classes.push(...generateStyleClasses(node.styles, parentIsFlexContainer))

  const classStr = classes.length > 0 ? ` class="${classes.join(' ')}"` : ''

  if (node.children.length === 0) {
    return `${indentStr}<div${classStr}></div>`
  }

  const childrenHTML = node.children
    .map(child => generateNodeHTML(child, indent + 1, node.layout === 'flex'))
    .join('\n')

  return `${indentStr}<div${classStr}>\n${childrenHTML}\n${indentStr}</div>`
}

/**
 * 生成元素节点 HTML
 * @param node - 元素节点
 * @param indent - 缩进级别
 * @param parentIsFlexContainer - 父容器是否为 flex 容器
 * @returns HTML 字符串
 */
function generateElementHTML(node: ElementNode, indent: number = 0, parentIsFlexContainer = false): string {
  const indentStr = '  '.repeat(indent)
  const classes = generateStyleClasses(node.styles, parentIsFlexContainer)

  switch (node.elementType) {
    case 'text': {
      const textClasses = ['text-base', 'text-gray-800', ...classes]
      return `${indentStr}<p class="${textClasses.join(' ')}">占位文本内容</p>`
    }
    case 'image': {
      const imageClasses = ['w-16', 'h-16', 'bg-gray-200', 'rounded', ...classes]
      return `${indentStr}<div class="${imageClasses.join(' ')}"></div>`
    }
    case 'button': {
      const buttonClasses = ['px-4', 'py-2', 'bg-primary-500', 'text-white', 'rounded', 'text-sm', 'inline-flex', 'items-center', 'gap-2', ...classes]
      return `${indentStr}<button class="${buttonClasses.join(' ')}">
${indentStr}  <span>按钮</span>
${indentStr}</button>`
    }
    case 'tag': {
      const tagClasses = ['px-3', 'py-1', 'bg-primary-500/10', 'text-primary-500', 'rounded-full', 'text-sm', 'inline-flex', 'items-center', 'gap-1.5', ...classes]
      return `${indentStr}<span class="${tagClasses.join(' ')}">Tag</span>`
    }
    case 'icon': {
      const iconClasses = ['flex', 'items-center', 'justify-center', ...classes]
      return `${indentStr}<div class="${iconClasses.join(' ')}">
${indentStr}  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
${indentStr}    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
${indentStr}  </svg>
${indentStr}</div>`
    }
    case 'divider': {
      const dividerClasses = ['w-full', 'h-px', 'bg-gray-200', ...classes]
      return `${indentStr}<div class="${dividerClasses.join(' ')}"></div>`
    }
    default:
      return `${indentStr}<div class="${classes.join(' ')}"></div>`
  }
}

/**
 * 生成单个节点 HTML
 * @param node - DSL 节点
 * @param indent - 缩进级别
 * @param parentIsFlexContainer - 父容器是否为 flex 容器
 * @returns HTML 字符串
 */
function generateNodeHTML(node: DSLNode, indent: number = 0, parentIsFlexContainer = false): string {
  if (isContainerNode(node)) {
    return generateContainerHTML(node, indent, parentIsFlexContainer)
  }
  return generateElementHTML(node, indent, parentIsFlexContainer)
}

/**
 * 代码生成 Hook
 * @returns 代码生成方法
 */
export function useGenerator() {
  const { nodes } = useEditor()

  /**
   * 生成 Tailwind HTML 代码
   * @returns HTML 字符串
   */
  const generateTailwind = (): string => {
    if (nodes.value.length === 0) {
      return '<!-- 没有节点 -->'
    }

    return nodes.value
      .map(node => generateNodeHTML(node as DSLNode, 0))
      .join('\n\n')
  }

  return {
    generateTailwind
  }
}
