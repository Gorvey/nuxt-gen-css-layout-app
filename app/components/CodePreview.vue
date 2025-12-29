<script setup lang="ts">
/**
 * 代码预览弹窗组件
 * 从底部弹出，展示生成的 HTML 代码
 */

const configStore = useConfigStore()
const { showCodePreview } = storeToRefs(configStore)

/**
 * 关闭代码预览面板
 */
function handleClose() {
  configStore.closeCodePreview()
}

/**
 * 复制代码到剪贴板
 */
async function handleCopy() {
  // TODO: 实现代码复制逻辑
}
</script>

<template>
  <!-- 底部弹出层 -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showCodePreview"
      class="fixed left-0 right-0 bottom-0 z-50 bg-default border-t border-default shadow-2xl"
      style="height: 500px"
    >
      <!-- 顶部工具栏 -->
      <div class="h-12 border-b border-default flex items-center justify-between px-4 bg-elevated">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-code" class="size-5 text-primary" />
          <h3 class="font-medium">代码预览</h3>
        </div>
        <div class="flex items-center gap-2">
          <!-- 复制按钮 -->
          <UButton
            icon="i-lucide-copy"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="handleCopy"
          >
            复制
          </UButton>
          <!-- 关闭按钮 -->
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="handleClose"
          />
        </div>
      </div>

      <!-- 代码内容区域 -->
      <div class="h-[calc(100%-3rem)] overflow-auto p-4 bg-muted/30">
        <!-- TODO: 添加代码展示逻辑 -->
        <pre class="text-sm text-muted-foreground"><code>&lt;!-- TODO: 生成代码 --&gt;</code></pre>
      </div>
    </div>
  </Transition>
</template>
