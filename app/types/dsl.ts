/**
 * DSL 类型定义
 * 用于描述布局编辑器中的节点结构
 */

/** 节点基础类型 */
export type NodeType = 'container' | 'element'

/** 容器布局类型 */
export type ContainerLayout = 'flex' | 'grid' | 'block'

/** 元素类型 */
export type ElementType = 'text' | 'image' | 'button' | 'tag' | 'divider' | 'icon'

/** 预设尺寸值 */
export type SizePreset = 'auto' | 'full' | '1/2' | '1/3' | '1/4' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** 预设间距值 */
export type SpacingPreset = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** 预设圆角值 */
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'full'

/** 预设颜色值 */
export type ColorPreset = 'transparent' | 'white' | 'gray' | 'primary' | 'secondary'

/** Flex 方向 */
export type FlexDirection = 'row' | 'column'

/** Flex grow 值 */
export type FlexGrow = 0 | 1

/** Flex shrink 值 */
export type FlexShrink = 0 | 1

/** Flex basis 值 */
export type FlexBasis = 'auto' | 'full' | '1/2' | '1/3' | '1/4'

/** Flex 主轴对齐 */
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around'

/** Flex 交叉轴对齐 */
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch'

/**
 * 通用样式配置
 */
export interface StyleConfig {
  /** 宽度 */
  width?: SizePreset
  /** 高度 */
  height?: SizePreset
  /** 内边距 */
  padding?: SpacingPreset
  /** 外边距 */
  margin?: SpacingPreset
  /** 背景颜色 */
  backgroundColor?: ColorPreset
  /** 圆角 */
  borderRadius?: RadiusPreset
  /** Flex 子项配置 */
  flexItem?: FlexItemConfig
}

/**
 * Flex 子项配置
 * 用于 flex 容器内的子元素
 */
export interface FlexItemConfig {
  /** flex-grow */
  grow: FlexGrow
  /** flex-shrink */
  shrink: FlexShrink
  /** flex-basis */
  basis: FlexBasis
  /** 宽度快捷设置 */
  width?: 'auto' | 'full'
}

/**
 * Flex 布局配置
 */
export interface FlexLayoutConfig {
  /** 方向 */
  direction: FlexDirection
  /** 主轴对齐 */
  justify: FlexJustify
  /** 交叉轴对齐 */
  align: FlexAlign
  /** 间距 */
  gap: SpacingPreset
}

/**
 * 容器节点
 */
export interface ContainerNode {
  /** 节点 ID */
  id: string
  /** 节点类型 */
  type: 'container'
  /** 布局类型 */
  layout: ContainerLayout
  /** 布局配置 */
  layoutConfig: FlexLayoutConfig
  /** 样式配置 */
  styles: StyleConfig
  /** 子节点 */
  children: DSLNode[]
}

/**
 * 元素节点
 */
export interface ElementNode {
  /** 节点 ID */
  id: string
  /** 节点类型 */
  type: 'element'
  /** 元素类型 */
  elementType: ElementType
  /** 样式配置 */
  styles: StyleConfig
}

/** DSL 节点联合类型 */
export type DSLNode = ContainerNode | ElementNode

/**
 * 判断是否为容器节点
 * @param node - DSL 节点
 * @returns 是否为容器节点
 */
export function isContainerNode(node: DSLNode): node is ContainerNode {
  return node.type === 'container'
}

/**
 * 判断是否为元素节点
 * @param node - DSL 节点
 * @returns 是否为元素节点
 */
export function isElementNode(node: DSLNode): node is ElementNode {
  return node.type === 'element'
}
