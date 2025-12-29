<script setup lang="ts">
/**
 * 顶部导航组件
 */

defineProps<{
  /** 代码预览浮层开关状态 */
  codePanelOpen: boolean
}>()

defineEmits<{
  /** 更新代码预览浮层开关状态 */
  'update:codePanelOpen': [value: boolean]
}>()

const { canvasWidth, setWidth } = useCanvasWidth()
</script>

<template>
  <header
    class="h-14 shrink-0 border-b border-default bg-default flex items-center justify-between px-4"
  >
    <!-- 左侧 Logo -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-layout-grid" class="size-6 text-primary" />
      <span class="font-semibold text-lg">CSS 布局生成器</span>
    </div>

    <!-- 中间宽度滑块 -->
    <div class="flex items-center gap-3">
      <UIcon name="i-lucide-frame" class="size-4 text-muted" />
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted w-8">{{ canvasWidth }}%</span>
        <USlider
          :model-value="canvasWidth"
          @update:model-value="setWidth"
          :min="50"
          :max="100"
          :step="5"
          class="w-32"
        />
      </div>
    </div>

    <!-- 右侧操作 -->
    <div class="flex items-center gap-2">
      <UColorModeButton />
      <UButton
        :icon="codePanelOpen ? 'i-lucide-eye-off' : 'i-lucide-code'"
        :label="codePanelOpen ? '隐藏代码' : '代码预览'"
        :color="codePanelOpen ? 'primary' : 'neutral'"
        @click="$emit('update:codePanelOpen', !codePanelOpen)"
      />
    </div>
  </header>
</template>
