<script setup lang="ts">
/**
 * 编辑器宽度控制组件
 * 提供断点按钮组和自定义宽度输入框
 */

import type { Breakpoint } from '~/stores/config'

const configStore = useConfigStore()
const { editorWidth, currentBreakpoint } = storeToRefs(configStore)

/** 宽度输入值 */
const widthInput = computed({
  get: () => editorWidth.value.toString(),
  set: (value: string) => {
    const num = parseInt(value, 10)
    if (!Number.isNaN(num) && num > 0) {
      configStore.setEditorWidth(num)
      // 清除断点选中状态（因为现在是自定义宽度）
      if (num !== 375 && num !== 768 && num !== 1920) {
        currentBreakpoint.value = 'pc' // 保持默认值
      }
    }
  },
})

/**
 * 断点按钮配置
 */
const breakpointButtons: { key: Breakpoint; label: string; icon: string; width: number }[] = [
  { key: 'phone', label: '手机', icon: 'i-lucide-smartphone', width: 375 },
  { key: 'tablet', label: '平板', icon: 'i-lucide-tablet', width: 768 },
  { key: 'pc', label: '桌面', icon: 'i-lucide-monitor', width: 1920 },
]

/**
 * 判断是否为当前断点
 * @param key - 断点键
 */
const isCurrentBreakpoint = (key: Breakpoint): boolean => {
  return currentBreakpoint.value === key && editorWidth.value === BREAKPOINT_WIDTHS[key]
}

/**
 * 处理断点点击
 * @param key - 断点键
 */
const handleBreakpointClick = (key: Breakpoint) => {
  configStore.setBreakpoint(key)
}
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- 断点按钮组 -->
    <div class="flex items-center bg-muted rounded-lg p-1">
      <UButton
        v-for="btn in breakpointButtons"
        :key="btn.key"
        :icon="btn.icon"
        :variant="isCurrentBreakpoint(btn.key) ? 'solid' : 'ghost'"
        :color="isCurrentBreakpoint(btn.key) ? 'primary' : 'neutral'"
        size="xs"
        @click="handleBreakpointClick(btn.key)"
      >
        {{ btn.label }}
      </UButton>
    </div>

    <!-- 宽度输入框 -->
    <div class="flex items-center gap-1">
      <UInput
        v-model="widthInput"
        type="number"
        size="xs"
        class="w-24"
        :min="320"
        :max="3840"
      />
      <span class="text-xs text-muted-foreground">px</span>
    </div>
  </div>
</template>
