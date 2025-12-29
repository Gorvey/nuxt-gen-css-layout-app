# CSS 布局生成器 - 项目计划

## 一、项目定位

**核心目标**：快速生成 CSS 布局代码片段，帮助前端开发者提升业务开发效率。

**关键约束**：
- 只生成布局结构，不处理业务数据
- 图片使用占位图，文本使用占位符
- 生成的是可复制的代码片段，非完整页面

**开发原则**：
- **MVP 优先**：先实现最小可用功能，再迭代增强
- **Composable 优先**：使用 Vue 3 Composable (hooks) 模式管理状态和逻辑
- **DSL 由开发者设计**：类型结构在开发过程中确定

---

## 二、MVP 功能范围

### 2.1 MVP 包含（必须实现）

| 功能 | 说明 |
|------|------|
| 三栏布局 | Header + 左侧面板 + 编辑器 + 右侧面板 |
| 容器拖拽 | Flex 容器拖入编辑器 |
| 元素拖拽 | 文本、图片元素拖入容器 |
| 节点选中 | 点击选中，显示配置 |
| 基础样式配置 | 间距、背景、边框圆角 |
| Flex 布局配置 | 方向、对齐方式 |
| 代码生成 | Tailwind 格式输出 |
| 复制代码 | 一键复制生成的代码 |

### 2.2 MVP 不包含（后续迭代）

| 功能 | 优先级 |
|------|--------|
| Grid 容器 | P1 |
| Block 容器 | P1 |
| 按钮、Tag、分割线、图标元素 | P1 |
| CSS 原生格式输出 | P1 |
| 预设模板 | P2 |
| 面板收起/展开 | P2 |
| 编辑器宽度自定义 | P2 |
| 节点悬停高亮 | P2 |
| 键盘删除节点 | P2 |
| 历史记录 Undo/Redo | P3 |
| 模板保存 | P3 |

---

## 三、技术架构

### 3.1 技术栈

- **框架**：Nuxt 4 + Vue 3
- **UI 组件**：@nuxt/ui v4
- **拖拽**：vue-draggable-plus
- **ID 生成**：nanoid
- **工具库**：@vueuse/core

### 3.2 目录结构

```
app/
├── components/
│   ├── layout/                 # 页面布局
│   │   ├── AppHeader.vue
│   │   ├── LeftPanel.vue
│   │   ├── EditorCanvas.vue
│   │   └── RightPanel.vue
│   │
│   ├── editor/                 # 编辑器
│   │   ├── NodeRenderer.vue    # 节点渲染（容器+元素）
│   │   └── DropZone.vue        # 拖放区域
│   │
│   └── panel/                  # 面板
│       ├── DraggableItem.vue   # 可拖拽项
│       └── PropertyEditor.vue  # 属性编辑器
│
├── composables/                # Hooks（核心）
│   ├── useEditor.ts            # 编辑器状态 + 节点操作
│   ├── useSelection.ts         # 选中状态
│   └── useGenerator.ts         # 代码生成
│
├── types/                      # 类型定义
│   └── dsl.ts                  # DSL 类型
│
├── constants/                  # 常量
│   └── presets.ts              # 预设值映射
│
└── pages/
    └── index.vue               # 主页面
```

### 3.3 Composable 设计

#### useEditor.ts - 编辑器核心 Hook

```typescript
/**
 * 编辑器核心状态管理
 * @returns 编辑器状态和操作方法
 */
export function useEditor() {
  // 状态
  const nodes = ref<DSLNode[]>([])

  // 方法
  const addNode = (node: DSLNode, parentId?: string) => { ... }
  const removeNode = (nodeId: string) => { ... }
  const updateNode = (nodeId: string, updates: Partial<DSLNode>) => { ... }
  const moveNode = (nodeId: string, targetParentId: string, index: number) => { ... }
  const findNode = (nodeId: string) => { ... }

  return {
    nodes: readonly(nodes),
    addNode,
    removeNode,
    updateNode,
    moveNode,
    findNode
  }
}
```

#### useSelection.ts - 选中状态 Hook

```typescript
/**
 * 节点选中状态管理
 * @returns 选中状态和操作方法
 */
export function useSelection() {
  const selectedId = ref<string | null>(null)
  const selectedNode = computed(() => { ... })

  const select = (nodeId: string) => { ... }
  const deselect = () => { ... }

  return {
    selectedId: readonly(selectedId),
    selectedNode,
    select,
    deselect
  }
}
```

#### useGenerator.ts - 代码生成 Hook

```typescript
/**
 * 代码生成逻辑
 * @returns 生成方法
 */
export function useGenerator() {
  const generateTailwind = (nodes: DSLNode[]) => { ... }

  return {
    generateTailwind
  }
}
```

---

## 四、页面布局

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                     [生成代码]        │
├────────────┬────────────────────────────┬───────────────────┤
│ 左侧面板    │       编辑器区域           │    右侧面板        │
│            │                            │                   │
│ 容器       │                            │  （选中节点时）    │
│ ├ Flex     │     [拖放区域]             │                   │
│            │                            │  样式配置          │
│ 元素       │                            │  - 间距            │
│ ├ 文本     │                            │  - 背景            │
│ └ 图片     │                            │  - 圆角            │
│            │                            │                   │
│            │                            │  布局配置          │
│            │                            │  - 方向            │
│            │                            │  - 对齐            │
└────────────┴────────────────────────────┴───────────────────┘
```

---

## 五、交互流程

### 5.1 核心流程

```
1. 从左侧拖拽 Flex 容器到编辑器
   └─> 创建容器节点，显示空容器占位

2. 从左侧拖拽元素（文本/图片）到容器内
   └─> 元素添加到容器 children

3. 点击节点
   └─> 选中节点，右侧显示配置面板

4. 修改配置
   └─> 实时更新节点样式

5. 点击「生成代码」
   └─> 弹窗显示 Tailwind 代码，可复制
```

### 5.2 拖拽规则（MVP）

- 容器只能拖入编辑器根区域或其他容器内
- 元素只能拖入容器内
- 同级节点支持排序

---

## 六、代码生成策略（MVP）

### 6.1 Tailwind 输出格式

输入 DSL：
```json
{
  "type": "container",
  "layout": "flex",
  "layoutConfig": { "direction": "row", "gap": "md" },
  "children": [
    { "type": "element", "elementType": "image" },
    { "type": "element", "elementType": "text" }
  ]
}
```

输出 HTML：
```html
<div class="flex flex-row gap-4">
  <div class="w-16 h-16 bg-gray-200 rounded"></div>
  <div class="text-base text-gray-800">占位文本</div>
</div>
```

### 6.2 预设值映射表（MVP）

| 属性 | 预设值 | Tailwind 类 |
|------|--------|-------------|
| gap | sm | gap-2 |
| gap | md | gap-4 |
| gap | lg | gap-6 |
| padding | sm | p-2 |
| padding | md | p-4 |
| padding | lg | p-6 |
| borderRadius | sm | rounded |
| borderRadius | md | rounded-lg |
| borderRadius | lg | rounded-xl |

---

## 七、验收标准（MVP）

1. 能拖拽 Flex 容器到编辑器
2. 能拖拽文本/图片元素到容器内
3. 能点击选中节点并在右侧配置
4. 能修改间距、背景、圆角、Flex 方向/对齐
5. 能生成 Tailwind 代码并复制

---

## 八、后续迭代路线

```
MVP ─────────────────────────────────────────────────────────>
 │
 ├─ P1: Grid/Block 容器、更多元素类型、CSS 原生输出
 │
 ├─ P2: 预设模板、面板收起、交互优化
 │
 └─ P3: Undo/Redo、模板保存
```
