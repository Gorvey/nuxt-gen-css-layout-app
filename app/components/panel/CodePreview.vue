<script setup lang="ts">
/**
 * 代码预览组件
 */
import { useClipboard } from '@vueuse/core'
import { getPaddingClass, getBorderRadiusClass, getBackgroundColorClass, getFlexDirectionClass, getFlexJustifyClass, getFlexAlignClass, getGapClass } from '~/constants/presets'

const { generateTailwind } = useGenerator()
const { nodes } = useEditor()

/** 代码复制状态 */
const { copy: copyCode, copied: codeCopied } = useClipboard()

/** 草图复制状态 */
const { copy: copySketch, copied: sketchCopied } = useClipboard()

/** 当前选中的 Tab */
const selectedTab = ref<'code' | 'sketch' | 'preview'>('preview')

/** Tab 选项 */
const tabs = [
  { key: 'preview' as const, label: '预览' },
  { key: 'code' as const, label: '代码' },
  { key: 'sketch' as const, label: '草图' },
]

/** 生成的代码 */
const code = computed(() => generateTailwind())

/**
 * 生成预览节点样式
 */
function getNodeStyles(node: any) {
  const styles: string[] = []

  // 处理 padding
  if (node.styles?.padding) {
    if (typeof node.styles.padding === 'number') {
      styles.push(`p-[${node.styles.padding}px]`)
    } else if (node.styles.padding !== 'none') {
      styles.push(getPaddingClass(node.styles.padding))
    }
  }

  // 处理 backgroundColor
  if (node.styles?.backgroundColor && node.styles.backgroundColor !== 'transparent') {
    styles.push(getBackgroundColorClass(node.styles.backgroundColor))
  }

  // 处理 borderRadius
  if (node.styles?.borderRadius) {
    if (typeof node.styles.borderRadius === 'number') {
      styles.push(`rounded-[${node.styles.borderRadius}px]`)
    } else if (node.styles.borderRadius !== 'none') {
      styles.push(getBorderRadiusClass(node.styles.borderRadius))
    }
  }

  return styles
}

/**
 * 递归渲染预览节点
 */
function renderPreviewNode(node: any, key: string) {
  if (node.type === 'container') {
    const containerStyles = getNodeStyles(node)

    // 容器布局样式
    if (node.layout === 'flex') {
      containerStyles.push('flex')
      containerStyles.push(getFlexDirectionClass(node.layoutConfig.direction))
      containerStyles.push(getFlexJustifyClass(node.layoutConfig.justify))
      containerStyles.push(getFlexAlignClass(node.layoutConfig.align))
      if (node.layoutConfig.gap !== 'none') {
        containerStyles.push(getGapClass(node.layoutConfig.gap))
      }
    }

    return h('div', {
      key,
      class: ['min-h-16 border-2 border-dashed border-default', ...containerStyles]
    }, node.children?.map((child: any, i: number) => renderPreviewNode(child, `${key}-${i}`)))
  }

  // 元素节点
  const elementStyles = getNodeStyles(node)

  if (node.elementType === 'text') {
    return h('p', { key, class: elementStyles }, '占位文本内容')
  }

  if (node.elementType === 'image') {
    return h('div', {
      key,
      class: [...elementStyles, 'w-16 h-16 bg-muted/50 rounded flex items-center justify-center']
    }, '🖼')
  }

  if (node.elementType === 'button') {
    return h('div', {
      key,
      class: [...elementStyles, 'px-4 py-2 bg-primary text-white rounded text-sm inline-flex']
    }, '按钮')
  }

  if (node.elementType === 'tag') {
    return h('div', {
      key,
      class: [...elementStyles, 'px-3 py-1 bg-primary/10 text-primary rounded-full text-sm inline-flex']
    }, 'Tag')
  }

  if (node.elementType === 'icon') {
    return h('div', {
      key,
      class: [...elementStyles, 'min-w-8 min-h-8 flex items-center justify-center']
    }, '⭐')
  }

  if (node.elementType === 'divider') {
    return h('div', {
      key,
      class: [...elementStyles, 'w-full h-px bg-border']
    })
  }

  return h('div', { key, class: elementStyles }, node.elementType)
}

/**
 * 生成布局草图
 * 使用树形结构
 */
function generateSketch(): string {
  const { nodes } = useEditor()

  if (nodes.value.length === 0) {
    return '(空布局)'
  }

  function getLabel(node: any): string {
    if (node.type === 'container') return node.layout === 'flex' ? '[FLEX]' : '[GRID]'
    const labels: Record<string, string> = {
      text: '文本',
      image: '图片',
      button: '按钮',
      tag: '标签',
      icon: '图标',
      divider: '分割线',
    }
    return labels[node.elementType] || node.elementType
  }

  function draw(node: any, indent = 0, prefix = ''): string {
    const spaces = '  '.repeat(indent)
    let result = ''

    if (node.type === 'container') {
      result += `${spaces}${prefix}${getLabel(node)}\n`

      node.children?.forEach((child: any, i: number) => {
        const isLast = i === node.children.length - 1
        const childPrefix = isLast ? '└─' : '├─'
        result += draw(child, indent + 1, childPrefix)
      })
    } else {
      result += `${spaces}${prefix}[${getLabel(node)}]\n`
    }

    return result
  }

  let sketch = '┌── 布局结构 ──┐\n\n'

  nodes.value.forEach((node: any, i: number) => {
    const isLast = i === nodes.value.length - 1
    const prefix = nodes.value.length > 1 ? (isLast ? '└─' : '├─') : ''
    sketch += draw(node, 0, prefix)
  })

  sketch += '\n└─────────────┘'

  return sketch
}

/** 生成的草图 */
const sketch = computed(() => generateSketch())

/**
 * 复制代码
 */
function handleCopy() {
  copyCode(code.value)
}

/**
 * 复制草图
 */
function handleCopySketch() {
  copySketch(sketch.value)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Tab 切换 -->
    <div class="flex items-center gap-1 p-1 bg-muted rounded-lg shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
          selectedTab === tab.key
            ? 'bg-elevated text-default shadow-sm'
            : 'text-muted hover:text-default',
        ]"
        @click="selectedTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 预览 Tab -->
    <div v-if="selectedTab === 'preview'" class="flex-1 min-h-0 flex flex-col">
      <div class="relative flex-1 min-h-0 bg-elevated rounded-lg border border-default overflow-auto p-4">
        <div v-if="nodes.length === 0" class="flex items-center justify-center h-full text-muted">
          暂无内容
        </div>
        <component :is="() => nodes.map((node, i) => renderPreviewNode(node, `preview-${i}`))" />
      </div>
      <p class="text-xs text-muted mt-2 shrink-0">实时预览布局效果，所见即所得。</p>
    </div>

    <!-- 代码 Tab -->
    <div v-else-if="selectedTab === 'code'" class="flex-1 min-h-0 flex flex-col">
      <div class="relative flex-1 min-h-0">
        <pre
          class="absolute inset-0 bg-elevated rounded-lg p-4 overflow-auto text-sm font-mono text-default border border-default"
        ><code>{{ code }}</code></pre>

        <!-- 复制按钮 -->
        <UButton
          :icon="codeCopied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="codeCopied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          class="absolute top-2 right-2 z-10"
          @click="handleCopy"
        />
      </div>

      <p class="text-xs text-muted mt-2 shrink-0">
        生成的代码使用 Tailwind CSS 类名，可直接复制到项目中使用。
      </p>
    </div>

    <!-- 草图 Tab -->
    <div v-else-if="selectedTab === 'sketch'" class="flex-1 min-h-0 flex flex-col">
      <div class="relative flex-1 min-h-0">
        <pre
          class="absolute inset-0 bg-elevated rounded-lg p-4 overflow-auto text-sm font-mono text-default border border-default leading-relaxed"
        ><code>{{ sketch }}</code></pre>

        <!-- 复制按钮 -->
        <UButton
          :icon="sketchCopied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="sketchCopied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          class="absolute top-2 right-2 z-10"
          @click="handleCopySketch"
        />
      </div>

      <p class="text-xs text-muted mt-2 shrink-0">布局结构草图，用于快速预览层级关系。</p>
    </div>
  </div>
</template>
