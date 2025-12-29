<script setup lang="ts">
/**
 * 节点渲染器组件
 * 递归渲染 DSL 节点树
 */

import type { DSLNode } from '~/types/dsl'

defineProps<{
  /** 要渲染的节点 */
  node: DSLNode
}>()
</script>

<template>
  <div class="border-2 border-dashed border-default p-4">
    <!-- TODO: 实现节点渲染逻辑 -->
    <p class="text-sm text-muted">节点: {{ node.id.slice(0, 8) }}</p>
  </div>
</template>
