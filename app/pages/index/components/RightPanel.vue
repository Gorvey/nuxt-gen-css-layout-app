<script setup lang="ts">
/**
 * 右侧配置面板组件
 */

const selectionStore = useSelectionStore()
const { selectedNode } = storeToRefs(selectionStore)
</script>

<template>
  <aside class="border-l border-default bg-elevated overflow-y-auto">
    <div class="p-4">
      <!-- 无选中状态 -->
      <div
        v-if="!selectedNode"
        class="h-full flex items-center justify-center text-center text-muted py-20"
      >
        <div>
          <UIcon name="i-lucide-mouse-pointer" class="size-10 mb-3 opacity-50" />
          <p class="text-sm">选中一个节点</p>
          <p class="text-xs mt-1">查看和编辑属性</p>
        </div>
      </div>

      <!-- 属性编辑器 -->
      <div v-else>
        <!-- TODO: 添加属性编辑器 -->
        <p class="text-sm text-muted">属性编辑器</p>
      </div>
    </div>
  </aside>
</template>
