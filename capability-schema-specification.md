# AI能力参数配置规范文档

## 1. 概述

本文档定义了AI能力（图片生成、视频生成等）的参数配置标准格式，基于JSON Schema规范。前端需要根据此规范解析配置并生成对应的表单UI。

## 2. 配置结构规范

### 2.1 顶层结构

```json
{
  "capability": "string",        // 能力类型：image_generation | video_generation
  "type": "object",              // 固定值：object
  "required": ["field1", ...],   // 必填字段数组
  "fields": {                    // 字段定义对象
    "field_name": { ... }
  }
}
```

### 2.2 字段定义规范

每个字段支持以下属性：

| 属性 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `type` | string | 数据类型：`string`、`number`、`boolean`、`array` | `"string"` |
| `widget` | string | UI组件类型：`textarea`、`select` 等 | `"textarea"` |
| `required` | boolean | **已废弃**，使用顶层`required`数组 | - |
| `default` | any | 默认值 | `5` |
| `placeholder` | string | 占位符文本 | `"Describe..."` |
| `description` | string | 字段说明（可选） | `"Video duration"` |
| `maxLength` | number | 字符串最大长度 | `4000` |
| `minimum` | number | 数字最小值 | `1` |
| `maximum` | number | 数字最大值 | `60` |
| `enum` | array | 枚举值列表（用于select） | `[5, 10, 15]` |
| `allowNull` | boolean | 是否允许null值 | `true` |
| `format` | string | 格式约束：`uri` 等 | `"uri"` |
| `minItems` | number | 数组最小元素数 | `1` |
| `maxItems` | number | 数组最大元素数 | `10` |
| `items` | object | 数组元素定义 | `{"type": "string"}` |

## 3. 字段类型映射规范

### 3.1 字符串类型（String）

#### 3.1.1 普通文本输入
```json
{
  "type": "string",
  "placeholder": "Enter text",
  "maxLength": 100
}
```

#### 3.1.2 多行文本（Textarea）
```json
{
  "type": "string",
  "widget": "textarea",
  "maxLength": 4000,
  "placeholder": "Describe the video you want"
}
```

#### 3.1.3 下拉选择（Select - 字符串选项）
```json
{
  "type": "string",
  "widget": "select",
  "default": "16:9",
  "enum": ["16:9", "9:16", "1:1"],
  "description": "Video aspect ratio"
}
```

#### 3.1.4 URI格式
```json
{
  "type": "string",
  "format": "uri",
  "allowNull": true,
  "description": "Image URL"
}
```

### 3.2 数字类型（Number）

#### 3.2.1 数字输入
```json
{
  "type": "number",
  "minimum": 1,
  "maximum": 60,
  "default": 5,
  "description": "Duration in seconds"
}
```

#### 3.2.2 下拉选择（Select - 数字选项）
```json
{
  "type": "number",
  "widget": "select",
  "default": 5,
  "enum": [5, 10, 15],
  "description": "Video duration in seconds"
}
```

### 3.3 布尔类型（Boolean）

```json
{
  "type": "boolean",
  "default": true,
  "description": "Generate audio"
}
```

**前端渲染建议**：开关（Switch）或复选框（Checkbox）

### 3.4 数组类型（Array）

```json
{
  "type": "array",
  "allowNull": true,
  "minItems": 1,
  "maxItems": 4,
  "description": "Reference image URLs",
  "items": {
    "type": "string",
    "format": "uri"
  }
}
```

## 4. 完整示例

### 4.1 图片生成配置示例

```json
{
  "capability": "image_generation",
  "type": "object",
  "required": ["prompt"],
  "fields": {
    "prompt": {
      "type": "string",
      "widget": "textarea",
      "maxLength": 4000,
      "placeholder": "Describe the image you want"
    },
    "aspect_ratio": {
      "type": "string",
      "widget": "select",
      "default": "1:1",
      "enum": ["1:1", "16:9", "9:16", "4:3", "3:4"],
      "description": "Image aspect ratio"
    },
    "num_outputs": {
      "type": "number",
      "minimum": 1,
      "maximum": 4,
      "default": 1,
      "description": "Number of images to generate"
    },
    "image": {
      "type": "string",
      "format": "uri",
      "allowNull": true,
      "description": "Optional reference image"
    }
  }
}
```

### 4.2 视频生成配置示例

```json
{
  "capability": "video_generation",
  "type": "object",
  "required": ["prompt"],
  "fields": {
    "prompt": {
      "type": "string",
      "widget": "textarea",
      "maxLength": 2000,
      "placeholder": "Describe the video you want"
    },
    "duration": {
      "type": "number",
      "widget": "select",
      "default": 5,
      "enum": [5, 10, 15],
      "description": "Video duration in seconds"
    },
    "aspect_ratio": {
      "type": "string",
      "widget": "select",
      "default": "16:9",
      "enum": ["16:9", "9:16", "1:1"],
      "description": "Video aspect ratio"
    },
    "resolution": {
      "type": "string",
      "widget": "select",
      "default": "720p",
      "enum": ["480p", "720p", "1080p"],
      "description": "Video resolution"
    },
    "start_image": {
      "type": "string",
      "format": "uri",
      "allowNull": true,
      "description": "Optional first frame image"
    },
    "end_image": {
      "type": "string",
      "format": "uri",
      "allowNull": true,
      "description": "Optional last frame image"
    },
    "audio_enabled": {
      "type": "boolean",
      "default": true,
      "description": "Generate synchronized audio"
    },
    "input_images": {
      "type": "array",
      "allowNull": true,
      "minItems": 1,
      "maxItems": 4,
      "description": "Reference image URLs",
      "items": {
        "type": "string",
        "format": "uri"
      }
    }
  }
}
```

## 5. 前端实现指南

### 5.1 表单渲染逻辑

```javascript
// 伪代码示例
function renderField(fieldName, fieldConfig) {
  const { type, widget, enum: enumValues, ...rest } = fieldConfig;
  
  // 1. 字符串类型
  if (type === 'string') {
    if (widget === 'textarea') {
      return <Textarea {...rest} />;
    }
    if (widget === 'select') {
      return <Select options={enumValues} {...rest} />;
    }
    if (rest.format === 'uri') {
      return <FileUpload {...rest} />;
    }
    return <Input {...rest} />;
  }
  
  // 2. 数字类型
  if (type === 'number') {
    if (widget === 'select') {
      return <Select options={enumValues} {...rest} />;
    }
    return <NumberInput min={rest.minimum} max={rest.maximum} {...rest} />;
  }
  
  // 3. 布尔类型
  if (type === 'boolean') {
    return <Switch {...rest} />;
  }
  
  // 4. 数组类型
  if (type === 'array') {
    return <MultiFileUpload 
      minItems={rest.minItems} 
      maxItems={rest.maxItems} 
      {...rest} 
    />;
  }
}
```

### 5.2 必填字段验证

```javascript
function validateForm(formData, schema) {
  const { required, fields } = schema;
  
  // 检查必填字段
  for (const fieldName of required) {
    if (!formData[fieldName]) {
      return { valid: false, error: `${fieldName} is required` };
    }
  }
  
  // 检查字段约束
  for (const [fieldName, value] of Object.entries(formData)) {
    const fieldConfig = fields[fieldName];
    if (!fieldConfig) continue;
    
    // 字符串长度验证
    if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
      return { valid: false, error: `${fieldName} exceeds max length` };
    }
    
    // 数字范围验证
    if (fieldConfig.minimum !== undefined && value < fieldConfig.minimum) {
      return { valid: false, error: `${fieldName} below minimum` };
    }
    if (fieldConfig.maximum !== undefined && value > fieldConfig.maximum) {
      return { valid: false, error: `${fieldName} exceeds maximum` };
    }
    
    // 枚举值验证
    if (fieldConfig.enum && !fieldConfig.enum.includes(value)) {
      return { valid: false, error: `${fieldName} invalid value` };
    }
  }
  
  return { valid: true };
}
```

### 5.3 数据提交格式

提交时，只需要提交字段值，不需要包含配置信息：

```javascript
// ✅ 正确的提交格式
{
  "prompt": "A beautiful sunset",
  "duration": 5,
  "aspect_ratio": "16:9",
  "resolution": "1080p",
  "audio_enabled": true
}

// ❌ 错误的提交格式（不要包含配置）
{
  "prompt": {
    "value": "A beautiful sunset",
    "type": "string"
  }
}
```

## 6. 支持的枚举值参考

### 6.1 图片生成枚举值

#### aspect_ratio（宽高比）
```
'1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21', '3:2', '2:3', 
'5:4', '4:5', '2:1', '1:2', '16:10', '10:16', '3:1', '1:3', 
'portrait', 'landscape', 'auto', 'original', 'custom'
```

#### resolution（分辨率）
```
'480p', '540p', '720p', '1080p', '2k', '4k', '1K', '2K', '3K', '4K',
'512P', '1280*720', '720*1280', '1920*1080', '1080*1920',
'832*480', '480*832', 'original', '0.5 MP', '1 MP', '2 MP', '4 MP',
'standard', 'pro', 'std', 'high'
```

#### quality（质量）
```
'standard', 'hd', 'low', 'medium', 'high', 'auto', 'pro', 'std'
```

#### output_format（输出格式）
```
'png', 'jpg', 'jpeg', 'webp'
```

### 6.2 视频生成枚举值

#### aspect_ratio（宽高比）
```
'1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '9:21', '3:2', '2:3',
'5:4', '4:5', '2:1', '1:2', '16:10', '10:16', '3:1', '1:3',
'portrait', 'landscape', 'auto'
```

#### resolution（分辨率）
```
'480p', '540p', '720p', '1080p', '2k', '4k', '512P',
'1280*720', '720*1280', '1920*1080', '1080*1920',
'832*480', '480*832', 'standard', 'pro', 'std', 'high'
```

#### output_format（输出格式）
```
'mp4', 'webm', 'gif', 'mov'
```

#### fps（帧率）
```
24, 30, 60
```

## 7. 常见字段命名规范

| 后端字段名 | 前端显示名称 | 说明 |
|-----------|------------|------|
| `prompt` | Prompt / 提示词 | 文本描述 |
| `negative_prompt` | Negative Prompt / 负面提示词 | 排除内容 |
| `aspect_ratio` | Aspect Ratio / 宽高比 | 画面比例 |
| `resolution` | Resolution / 分辨率 | 输出质量 |
| `duration` | Duration / 时长 | 视频长度（秒） |
| `num_outputs` | Number of Outputs / 生成数量 | 生成个数 |
| `start_image` | Start Image / 起始图片 | 首帧图片 |
| `end_image` | End Image / 结束图片 | 末帧图片 |
| `image` | Image / 图片 | 参考图片 |
| `video` | Video / 视频 | 参考视频 |
| `audio_enabled` | Generate Audio / 生成音频 | 是否生成音频 |
| `audio_enabled` | **已废弃**，使用 `audio_enabled` | - |
| `input_images` | Reference Images / 参考图片 | 多张参考图 |
| `quality` | Quality / 质量 | 输出质量 |
| `seed` | Seed / 随机种子 | 可复现性 |

## 8. 注意事项

### 8.1 废弃的写法

❌ **不要使用**：
```json
{
  "prompt": {
    "type": "textarea",  // 错误：type应该是string
    "required": true     // 错误：应该在顶层required数组中
  },
  "duration": {
    "type": "select",    // 错误：type应该是number
    "options": [5, 10]   // 错误：应该用enum
  },
  "image": {
    "type": "text",      // 错误：应该是string
    "nullable": true     // 错误：应该用allowNull
  }
}
```

✅ **正确的写法**：
```json
{
  "type": "object",
  "required": ["prompt"],
  "fields": {
    "prompt": {
      "type": "string",
      "widget": "textarea"
    },
    "duration": {
      "type": "number",
      "widget": "select",
      "enum": [5, 10]
    },
    "image": {
      "type": "string",
      "format": "uri",
      "allowNull": true
    }
  }
}
```

### 8.2 字段命名统一

- 使用 `start_image` 而非 `first_image`
- 使用 `end_image` 而非 `last_image`

### 8.3 类型约束

- `type: "string"` + `widget: "select"` → 字符串选项的下拉框
- `type: "number"` + `widget: "select"` → 数字选项的下拉框
- `type: "number"` + `minimum/maximum` → 数字范围输入
- `type: "string"` + `format: "uri"` → 文件上传/URL输入

## 9. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2026-03-25 | 初始版本，定义基础规范 |

---

**文档维护者**：AI-Web 开发团队  
**最后更新**：2026-03-25
