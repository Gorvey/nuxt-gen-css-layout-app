<script setup lang="ts">
/**
 * 属性编辑器组件
 */
import type { DSLNode, FlexItemConfig } from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'

const props = defineProps<{
  /** 当前选中的节点 */
  node: DSLNode
}>()

const { updateNodeStyles, updateLayoutConfig, findParent } = useEditor()

/** 是否为容器节点 */
const isContainer = computed(() => isContainerNode(props.node))

/** 父节点是否为 flex 容器 */
const isInFlexContainer = computed(() => {
  const parent = findParent(props.node.id)
  return parent && parent.layout === 'flex'
})

/** 选项类型定义 */
interface OptionItem {
  label: string
  value: string
  icon?: string
}

/** 间距选项 */
const spacingOptions: OptionItem[] = [
  { label: 'None', value: 'none' },
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
]

/** 圆角选项 */
const radiusOptions: OptionItem[] = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'Full', value: 'full' },
]

/** 颜色选项 */
const colorOptions: OptionItem[] = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'White', value: 'white' },
  { label: 'Gray', value: 'gray' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
]

/** Flex 方向选项 */
const directionOptions: OptionItem[] = [
  { label: 'Row', value: 'row', icon: 'i-heroicons-arrows-right-left' },
  { label: 'Column', value: 'column', icon: 'i-heroicons-arrows-up-down' },
]

/** 主轴对齐选项 */
const justifyOptions: OptionItem[] = [
  { label: 'Start', value: 'start', icon: 'i-heroicons-arrow-left' },
  { label: 'Center', value: 'center', icon: 'i-heroicons-arrows-pointing-in' },
  { label: 'End', value: 'end', icon: 'i-heroicons-arrow-right' },
  { label: 'Between', value: 'between', icon: 'i-heroicons-arrows-pointing-out' },
  { label: 'Around', value: 'around', icon: 'i-heroicons-squares-plus' },
]

/** 交叉轴对齐选项 */
const alignOptions: OptionItem[] = [
  { label: 'Start', value: 'start', icon: 'i-heroicons-arrow-up' },
  { label: 'Center', value: 'center', icon: 'i-heroicons-arrows-pointing-in' },
  { label: 'End', value: 'end', icon: 'i-heroicons-arrow-down' },
  { label: 'Stretch', value: 'stretch', icon: 'i-heroicons-arrows-pointing-out' },
]

/** Flex grow 选项 */
const flexGrowOptions: OptionItem[] = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
]

/** Flex shrink 选项 */
const flexShrinkOptions: OptionItem[] = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
]

/** Flex basis 选项 */
const flexBasisOptions: OptionItem[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Full', value: 'full' },
  { label: '1/2', value: '1/2' },
  { label: '1/3', value: '1/3' },
  { label: '1/4', value: '1/4' },
]

/** Flex 宽度选项 */
const flexWidthOptions: OptionItem[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Full', value: 'full' },
]

/**
 * 更新样式
 * @param key - 样式键
 * @param value - 样式值
 */
function handleStyleChange(key: string, value: string | number) {
  updateNodeStyles(props.node.id, { [key]: value })
}

/**
 * 获取自定义 padding 值（当不是预设值时返回数字）
 */
const customPadding = computed({
  get: () => {
    const value = props.node.styles.padding
    if (typeof value === 'number') return value
    // 如果是预设值，返回 0
    return 0
  },
  set: (value: number) => {
    handleStyleChange('padding', value)
  },
})

/**
 * 获取自定义 borderRadius 值（当不是预设值时返回数字）
 */
const customBorderRadius = computed({
  get: () => {
    const value = props.node.styles.borderRadius
    if (typeof value === 'number') return value
    return 0
  },
  set: (value: number) => {
    handleStyleChange('borderRadius', value)
  },
})

/**
 * 判断 padding 是否为自定义数字值
 */
const isCustomPadding = computed(() => typeof props.node.styles.padding === 'number')

/**
 * 判断 borderRadius 是否为自定义数字值
 */
const isCustomBorderRadius = computed(() => typeof props.node.styles.borderRadius === 'number')

/**
 * 更新布局配置
 * @param key - 配置键
 * @param value - 配置值
 */
function handleLayoutChange(key: string, value: string) {
  updateLayoutConfig(props.node.id, { [key]: value })
}

/**
 * 获取当前 flexItem 配置
 */
function getFlexItemConfig(): FlexItemConfig {
  const current = props.node.styles.flexItem
  if (!current) {
    return { grow: 0, shrink: 1, basis: 'auto', width: 'full' }
  }
  return { grow: 0, shrink: 1, basis: 'auto', width: 'full', ...current }
}

/**
 * 更新 flexItem 配置
 * @param key - 配置键
 * @param value - 配置值
 */
function handleFlexItemChange(key: keyof FlexItemConfig, value: string | number) {
  updateNodeStyles(props.node.id, {
    flexItem: { ...getFlexItemConfig(), [key]: value },
  })
}

/** 元素类型标签映射 */
const elementTypeLabels: Record<string, string> = {
  text: '文本元素',
  image: '图片元素',
  button: '按钮元素',
  tag: '标签元素',
  icon: '图标元素',
  divider: '分割线元素',
}

/** 当前元素类型标签 */
const elementTypeLabel = computed(() => {
  if (isContainer.value) return 'Flex 容器'
  const type = (props.node as any).elementType
  return elementTypeLabels[type] || '未知元素'
})
</script>

<template>
  <div class="space-y-6">
    <!-- 节点信息 -->
    <div>
      <h3 class="text-sm font-semibold text-highlighted mb-2">
        {{ isContainer ? 'Flex 容器' : elementTypeLabel }}
      </h3>
      <p class="text-xs text-muted">ID: {{ node.id.slice(0, 8) }}...</p>
    </div>

    <USeparator />

    <!-- Flex 布局配置（仅容器） -->
    <div v-if="isContainer && (node as any).layout === 'flex'" class="space-y-4">
      <h4 class="text-xs font-semibold text-muted uppercase tracking-wider">Layout Config</h4>

      <!-- 方向 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Direction</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in directionOptions" :key="option.value">
            <UButton
              :icon="option.icon"
              :variant="(node as any).layoutConfig.direction === option.value ? 'solid' : 'outline'"
              :color="(node as any).layoutConfig.direction === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleLayoutChange('direction', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- 主轴对齐 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Justify</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in justifyOptions" :key="option.value">
            <UButton
              :icon="option.icon"
              :variant="(node as any).layoutConfig.justify === option.value ? 'solid' : 'outline'"
              :color="(node as any).layoutConfig.justify === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleLayoutChange('justify', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- 交叉轴对齐 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Align</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in alignOptions" :key="option.value">
            <UButton
              :icon="option.icon"
              :variant="(node as any).layoutConfig.align === option.value ? 'solid' : 'outline'"
              :color="(node as any).layoutConfig.align === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleLayoutChange('align', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- 间距 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Gap</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in spacingOptions" :key="option.value">
            <UButton
              :variant="(node as any).layoutConfig.gap === option.value ? 'solid' : 'outline'"
              :color="(node as any).layoutConfig.gap === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleLayoutChange('gap', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>
    </div>

    <USeparator v-if="isContainer" />

    <!-- Flex 子元素配置（仅在 flex 容器内显示） -->
    <div v-if="isInFlexContainer" class="space-y-4">
      <h4 class="text-xs font-semibold text-muted uppercase tracking-wider">Flex Item Config</h4>

      <!-- flex-grow -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Flex Grow</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in flexGrowOptions" :key="option.value">
            <UButton
              :variant="getFlexItemConfig().grow === Number(option.value) ? 'solid' : 'outline'"
              :color="getFlexItemConfig().grow === Number(option.value) ? 'primary' : 'neutral'"
              size="xs"
              @click="handleFlexItemChange('grow', Number(option.value))"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- flex-shrink -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Flex Shrink</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in flexShrinkOptions" :key="option.value">
            <UButton
              :variant="getFlexItemConfig().shrink === Number(option.value) ? 'solid' : 'outline'"
              :color="getFlexItemConfig().shrink === Number(option.value) ? 'primary' : 'neutral'"
              size="xs"
              @click="handleFlexItemChange('shrink', Number(option.value))"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- flex-basis -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Flex Basis</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in flexBasisOptions" :key="option.value">
            <UButton
              :variant="getFlexItemConfig().basis === option.value ? 'solid' : 'outline'"
              :color="getFlexItemConfig().basis === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleFlexItemChange('basis', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- 宽度快捷设置 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Width</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in flexWidthOptions" :key="option.value">
            <UButton
              :variant="getFlexItemConfig().width === option.value ? 'solid' : 'outline'"
              :color="getFlexItemConfig().width === option.value ? 'primary' : 'neutral'"
              size="xs"
              @click="handleFlexItemChange('width', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>
    </div>

    <USeparator v-if="isInFlexContainer" />

    <!-- 通用样式 -->
    <div class="space-y-4">
      <h4 class="text-xs font-semibold text-muted uppercase tracking-wider">Style Config</h4>

      <!-- 内边距 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Padding (px)</label>
        <UInputNumber v-model="customPadding" :min="0" :max="200" size="sm" class="w-full" />
      </div>

      <!-- 背景颜色 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Background</label>
        <div class="flex flex-wrap gap-1">
          <template v-for="option in colorOptions" :key="option.value">
            <UButton
              :variant="
                (node.styles.backgroundColor || 'transparent') === option.value
                  ? 'solid'
                  : 'outline'
              "
              :color="
                (node.styles.backgroundColor || 'transparent') === option.value
                  ? 'primary'
                  : 'neutral'
              "
              size="xs"
              @click="handleStyleChange('backgroundColor', option.value)"
            >
              {{ option.label }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- 圆角 -->
      <div class="space-y-1.5">
        <label class="text-sm text-default">Border Radius (px)</label>
        <UInputNumber v-model="customBorderRadius" :min="0" :max="100" size="sm" class="w-full" />
      </div>
    </div>
  </div>
</template>
