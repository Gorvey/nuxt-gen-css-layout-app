/**
 * Tailwind 预设值映射
 * 将 DSL 中的预设值转换为 Tailwind 类名
 */

import type {
  SpacingPreset,
  RadiusPreset,
  ColorPreset,
  SizePreset,
  FlexDirection,
  FlexJustify,
  FlexAlign,
  FlexGrow,
  FlexShrink,
  FlexBasis,
} from '~/types/dsl'

/** 间距预设映射 */
export const SPACING_MAP: Record<SpacingPreset, string> = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
}

/** 圆角预设映射 */
export const RADIUS_MAP: Record<RadiusPreset, string> = {
  none: 'none',
  sm: 'sm',
  md: 'lg',
  lg: 'xl',
  full: 'full',
}

/** 颜色预设映射 */
export const COLOR_MAP: Record<ColorPreset, string> = {
  transparent: 'transparent',
  white: 'white',
  gray: 'gray-100',
  primary: 'primary-500',
  secondary: 'gray-500',
}

/** 尺寸预设映射 */
export const SIZE_MAP: Record<SizePreset, string> = {
  auto: 'auto',
  full: 'full',
  '1/2': '1/2',
  '1/3': '1/3',
  '1/4': '1/4',
  xs: '8',
  sm: '16',
  md: '32',
  lg: '48',
  xl: '64',
  '2xl': '96',
}

/** Flex 方向映射 */
export const FLEX_DIRECTION_MAP: Record<FlexDirection, string> = {
  row: 'row',
  column: 'col',
}

/** Flex 主轴对齐映射 */
export const FLEX_JUSTIFY_MAP: Record<FlexJustify, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  between: 'between',
  around: 'around',
}

/** Flex 交叉轴对齐映射 */
export const FLEX_ALIGN_MAP: Record<FlexAlign, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
}

/** Flex grow 值映射 */
export const FLEX_GROW_MAP: Record<FlexGrow, string> = {
  0: '0',
  1: '1',
}

/** Flex shrink 值映射 */
export const FLEX_SHRINK_MAP: Record<FlexShrink, string> = {
  0: '0',
  1: '1',
}

/** Flex basis 值映射 */
export const FLEX_BASIS_MAP: Record<FlexBasis, string> = {
  auto: 'auto',
  full: 'full',
  '1/2': '1/2',
  '1/3': '1/3',
  '1/4': '1/4',
}

/**
 * 生成 padding 类名
 * @param value - 间距预设值
 * @returns Tailwind 类名
 */
export function getPaddingClass(value: SpacingPreset): string {
  return `p-${SPACING_MAP[value]}`
}

/**
 * 生成圆角类名
 * @param value - 圆角预设值
 * @returns Tailwind 类名
 */
export function getBorderRadiusClass(value: RadiusPreset): string {
  if (value === 'none') return 'rounded-none'
  return `rounded-${RADIUS_MAP[value]}`
}

/**
 * 生成背景颜色类名
 * @param value - 颜色预设值
 * @returns Tailwind 类名
 */
export function getBackgroundColorClass(value: ColorPreset): string {
  if (value === 'transparent') return 'bg-transparent'
  return `bg-${COLOR_MAP[value]}`
}

/**
 * 生成宽度类名
 * @param value - 尺寸预设值
 * @returns Tailwind 类名
 */
export function getWidthClass(value: SizePreset): string {
  return `w-${SIZE_MAP[value]}`
}

/**
 * 生成高度类名
 * @param value - 尺寸预设值
 * @returns Tailwind 类名
 */
export function getHeightClass(value: SizePreset): string {
  return `h-${SIZE_MAP[value]}`
}

/**
 * 生成 gap 类名
 * @param value - 间距预设值
 * @returns Tailwind 类名
 */
export function getGapClass(value: SpacingPreset): string {
  return `gap-${SPACING_MAP[value]}`
}

/**
 * 生成 Flex 方向类名
 * @param value - Flex 方向
 * @returns Tailwind 类名
 */
export function getFlexDirectionClass(value: FlexDirection): string {
  return `flex-${FLEX_DIRECTION_MAP[value]}`
}

/**
 * 生成 Flex 主轴对齐类名
 * @param value - Flex 主轴对齐
 * @returns Tailwind 类名
 */
export function getFlexJustifyClass(value: FlexJustify): string {
  return `justify-${FLEX_JUSTIFY_MAP[value]}`
}

/**
 * 生成 Flex 交叉轴对齐类名
 * @param value - Flex 交叉轴对齐
 * @returns Tailwind 类名
 */
export function getFlexAlignClass(value: FlexAlign): string {
  return `items-${FLEX_ALIGN_MAP[value]}`
}

/**
 * 生成 flex-grow 类名
 * @param value - flex-grow 值
 * @returns Tailwind 类名
 */
export function getFlexGrowClass(value: FlexGrow): string {
  return `grow-${FLEX_GROW_MAP[value]}`
}

/**
 * 生成 flex-shrink 类名
 * @param value - flex-shrink 值
 * @returns Tailwind 类名
 */
export function getFlexShrinkClass(value: FlexShrink): string {
  return `shrink-${FLEX_SHRINK_MAP[value]}`
}

/**
 * 生成 flex-basis 类名
 * @param value - flex-basis 值
 * @returns Tailwind 类名
 */
export function getFlexBasisClass(value: FlexBasis): string {
  return `basis-${FLEX_BASIS_MAP[value]}`
}
