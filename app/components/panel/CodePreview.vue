<script setup lang="ts">
/**
 * 代码预览组件
 */
import { useClipboard } from '@vueuse/core'

const { generateTailwind } = useGenerator()

/** 代码复制状态 */
const { copy: copyCode, copied: codeCopied } = useClipboard()

/** 草图复制状态 */
const { copy: copySketch, copied: sketchCopied } = useClipboard()

/** 当前选中的 Tab */
const selectedTab = ref<'code' | 'sketch'>('code')

/** Tab 选项 */
const tabs = [
  { key: 'code' as const, label: '代码' },
  { key: 'sketch' as const, label: '草图' }
]

/** 生成的代码 */
const code = computed(() => generateTailwind())

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
      divider: '分割线'
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
  <div class="space-y-4">
    <!-- Tab 切换 -->
    <div class="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
          selectedTab === tab.key
            ? 'bg-elevated text-default shadow-sm'
            : 'text-muted hover:text-default'
        ]"
        @click="selectedTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 代码 Tab -->
    <div v-if="selectedTab === 'code'" class="space-y-4">
      <div class="relative">
        <pre
          class="bg-elevated rounded-lg p-4 overflow-x-auto text-sm font-mono text-default border border-default"
        ><code>{{ code }}</code></pre>

        <!-- 复制按钮 -->
        <UButton
          :icon="codeCopied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="codeCopied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          class="absolute top-2 right-2"
          @click="handleCopy"
        />
      </div>

      <p class="text-xs text-muted">
        生成的代码使用 Tailwind CSS 类名，可直接复制到项目中使用。
      </p>
    </div>

    <!-- 草图 Tab -->
    <div v-else-if="selectedTab === 'sketch'" class="space-y-4">
      <div class="relative">
        <pre
          class="bg-elevated rounded-lg p-4 overflow-x-auto text-sm font-mono text-default border border-default leading-relaxed"
        ><code>{{ sketch }}</code></pre>

        <!-- 复制按钮 -->
        <UButton
          :icon="sketchCopied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="sketchCopied ? 'success' : 'neutral'"
          variant="ghost"
          size="sm"
          class="absolute top-2 right-2"
          @click="handleCopySketch"
        />
      </div>

      <p class="text-xs text-muted">
        布局结构草图，用于快速预览层级关系。
      </p>
    </div>
  </div>
</template>
