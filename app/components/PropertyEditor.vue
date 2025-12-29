<script setup lang="ts">
/**
 * 属性编辑器组件
 */

import type { DSLNode } from '~/types/dsl'

defineProps<{
  /** 当前选中的节点 */
  node: DSLNode
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- 节点信息 -->
    <div>
      <h3 class="text-sm font-semibold text-highlighted mb-2">节点属性</h3>
      <p class="text-xs text-muted">ID: {{ node.id.slice(0, 8) }}...</p>
    </div>

    <!-- TODO: 实现属性编辑功能 -->
  </div>
</template>
