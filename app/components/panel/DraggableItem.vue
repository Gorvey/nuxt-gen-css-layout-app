<script setup lang="ts">
/**
 * 可拖拽项组件
 */

defineProps<{
  /** 图标名称 */
  icon: string
  /** 显示标签 */
  label: string
  /** 是否激活（用于容器切换） */
  isActive?: boolean
}>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded-lg border transition-colors"
    :class="
      isActive
        ? 'border-primary bg-primary/5 cursor-default'
        : 'border-default bg-default hover:bg-elevated cursor-grab active:cursor-grabbing'
    "
  >
    <UIcon :name="icon" class="size-5" :class="isActive ? 'text-primary' : 'text-muted'" />
    <span class="text-sm font-medium" :class="isActive ? 'text-primary' : ''">{{ label }}</span>
  </div>
</template>
