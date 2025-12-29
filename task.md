# CSS 布局生成器 - MVP 任务清单

> 聚焦最小可用功能，快速交付可运行版本

---

## 阶段一：基础设施

### 1.1 类型与常量

- [x] 创建 `app/types/dsl.ts` - DSL 类型定义
- [x] 创建 `app/constants/presets.ts` - Tailwind 预设值映射

---

## 阶段二：核心 Hooks

### 2.1 useEditor - 编辑器状态

- [x] 创建 `app/composables/useEditor.ts`
  - [x] nodes 状态（DSL 树）
  - [x] addNode 方法
  - [x] removeNode 方法
  - [x] updateNode 方法
  - [x] findNode 方法

### 2.2 useSelection - 选中状态

- [x] 创建 `app/composables/useSelection.ts`
  - [x] selectedId 状态
  - [x] selectedNode 计算属性
  - [x] select / deselect 方法

### 2.3 useGenerator - 代码生成

- [x] 创建 `app/composables/useGenerator.ts`
  - [x] generateTailwind 方法

---

## 阶段三：页面框架

### 3.1 主页面

- [x] 修改 `app/pages/index.vue` - 三栏布局

### 3.2 布局组件

- [x] 创建 `app/components/layout/AppHeader.vue`
  - [x] Logo
  - [x] 生成代码按钮
- [x] 创建 `app/components/layout/LeftPanel.vue`
  - [x] 容器区域（Flex）
  - [x] 元素区域（文本、图片）
- [x] 创建 `app/components/layout/EditorCanvas.vue`
  - [x] 空状态提示
  - [x] 节点渲染区域
- [x] 创建 `app/components/layout/RightPanel.vue`
  - [x] 无选中提示
  - [x] 属性编辑区域

---

## 阶段四：拖拽功能

### 4.1 左侧面板拖拽源

- [x] 创建 `app/components/panel/DraggableItem.vue`
  - [x] 可拖拽项（图标 + 名称）

### 4.2 编辑器拖放

- [x] 实现从左侧拖入编辑器创建节点
- [x] 实现容器内子节点排序
- [x] 实现容器嵌套

---

## 阶段五：节点渲染

### 5.1 节点渲染器

- [x] 创建 `app/components/editor/NodeRenderer.vue`
  - [x] 容器渲染（应用 Flex 样式）
  - [x] 元素渲染（文本占位/图片占位）
  - [x] 选中状态边框
  - [x] 点击选中事件

---

## 阶段六：属性编辑

### 6.1 属性编辑器

- [x] 创建 `app/components/panel/PropertyEditor.vue`
  - [x] 通用样式：padding、borderRadius、backgroundColor
  - [x] Flex 配置：direction、justify、align、gap

---

## 阶段七：代码生成

### 7.1 生成弹窗

- [x] 创建代码预览弹窗（使用 UModal）
  - [x] Tailwind 代码展示
  - [x] 复制按钮

---

## 执行顺序

```
阶段一 → 阶段二 → 阶段三 → 阶段四 → 阶段五 → 阶段六 → 阶段七
  │         │         │         │         │         │         │
  └ 类型    └ Hooks   └ 布局    └ 拖拽    └ 渲染    └ 编辑    └ 生成
```

**关键依赖**：

- 阶段二依赖阶段一（类型定义）
- 阶段四、五、六依赖阶段二（Hooks）
- 阶段七依赖阶段二（useGenerator）

---

## 任务统计

| 阶段     | 任务数 | 状态            |
| -------- | ------ | --------------- |
| 阶段一   | 2      | ✅ 完成         |
| 阶段二   | 3      | ✅ 完成         |
| 阶段三   | 5      | ✅ 完成         |
| 阶段四   | 4      | ✅ 完成         |
| 阶段五   | 1      | ✅ 完成         |
| 阶段六   | 1      | ✅ 完成         |
| 阶段七   | 1      | ✅ 完成         |
| **总计** | **17** | **✅ MVP 完成** |

---

## 后续迭代（P1）

完成 MVP 后的下一批任务：

- [ ] Grid 容器支持
- [ ] Block 容器支持
- [ ] 按钮元素
- [ ] Tag 元素
- [ ] 分割线元素
- [ ] 图标元素
- [ ] CSS 原生格式输出
- [ ] 节点删除（键盘 Delete）
- [ ] 节点悬停高亮
