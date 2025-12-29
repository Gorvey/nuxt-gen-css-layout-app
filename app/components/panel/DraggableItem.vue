<script setup lang="ts">
/**
 * 可拖拽项组件
 */

defineProps<{
  /** 图标名称 */
  icon: string
  /** 显示标签 */
  label: string
}>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded-lg border border-default bg-default hover:bg-elevated cursor-grab active:cursor-grabbing transition-colors"
  >
    <UIcon :name="icon" class="size-5 text-muted" />
    <span class="text-sm font-medium">{{ label }}</span>
  </div>
</template>
