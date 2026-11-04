---
title: 单实例多 MCP 聚合服务：两种实现方案对比
description: 用 Nginx 反向代理或多端口服务，对照 Express 单端口内存映射，怎么在一个实例里聚合多个 MCP。
date: 2026-01-19
---

# 单实例多 MCP 聚合服务：两种实现方案对比

> **仓库**
>
> - 方案1（Nginx）：[betterhyq/honeycomb-nginx](https://github.com/betterhyq/honeycomb-nginx/)
> - 方案2（Express）：[betterhyq/honeycomb](https://github.com/betterhyq/honeycomb/)

> **你会得到什么**
>
> 弄清单实例多 MCP 聚合的两种路线：物理隔离的 Nginx 反代，以及逻辑隔离的 Express 统一服务，并按场景选型。

## 1. 引言

在 AI 应用开发中，Model Context Protocol (MCP) 作为连接 AI 工具与外部服务的标准协议，正变得越来越重要。然而，当我们需要同时运行多个 MCP 服务时，传统的单服务单端口部署方式会带来诸多问题：

- **端口管理复杂**：每个 MCP 服务需要占用独立端口，随着服务数量增长，端口分配和管理变得繁琐
- **资源浪费**：每个服务独立进程，内存和 CPU 资源消耗较大
- **部署维护困难**：需要为每个服务单独配置、监控和更新
- **客户端配置复杂**：AI 应用需要配置多个不同的服务地址和端口

为了解决这些问题，我们探索了两种**单实例多MCP聚合服务**的实现方案：**方案1（Nginx反向代理）**和**方案2（Express统一服务）**。本文将深入对比这两种方案的架构设计、实现细节、优缺点及适用场景，帮助开发者根据实际需求选择最合适的方案。

**文章价值**：

- 理解单实例多MCP聚合服务的核心设计思想
- 掌握两种不同技术栈的实现方案
- 学会根据业务场景选择合适的技术方案
- 了解 MCP 协议在实际项目中的应用实践

**适用人群**：

- Node.js 后端开发工程师
- AI 应用开发者
- 系统架构师
- 对 MCP 协议感兴趣的开发者

**前置知识**：

- JavaScript/TypeScript 基础
- Node.js 和 Express 框架
- HTTP 协议和 SSE（Server-Sent Events）
- Nginx 基础配置
- MCP 协议基本概念

## 2. 核心理论基础

### 2.1 MCP 协议简介

Model Context Protocol (MCP) 是由 Anthropic 提出的标准协议，用于 AI 应用与外部工具和服务之间的通信。MCP 支持多种传输方式，包括：

- **HTTP Stream**：基于 HTTP 的流式传输
- **SSE (Server-Sent Events)**：服务器推送事件，适合长连接场景
- **WebSocket**：双向通信协议

MCP 的核心概念包括：

- **Tools（工具）**：可被 AI 调用的功能单元，每个工具包含名称、描述、输入/输出 Schema
- **Resources（资源）**：可被 AI 访问的数据资源
- **Prompts（提示）**：预定义的提示模板

### 2.2 单实例多MCP聚合服务的核心思想

单实例多MCP聚合服务的核心思想是：**在一个进程实例中同时运行多个 MCP 服务，通过统一的入口对外提供服务，客户端通过标识符（如 Header 参数）来区分和访问不同的 MCP 服务**。

这种设计的优势：

1. **资源高效**：多个服务共享同一个进程，减少内存和 CPU 开销
2. **统一管理**：集中配置、监控和日志管理
3. **简化部署**：只需部署一个服务实例，降低运维复杂度
4. **灵活扩展**：可以动态添加、删除或更新 MCP 服务

### 2.3 两种方案的技术路线对比

| 维度         | 方案1：Nginx反向代理          | 方案2：Express统一服务 |
| ------------ | ----------------------------- | ---------------------- |
| **架构模式** | 反向代理 + 多端口服务         | 单端口 + 路由分发      |
| **服务隔离** | 物理隔离（独立端口）          | 逻辑隔离（内存映射）   |
| **路由方式** | HTTP Header (`X-Target-Port`) | HTTP Header (`MCP_ID`) |
| **服务管理** | 静态配置（config.json）       | 动态管理（数据库）     |
| **配置方式** | 文件配置                      | 可视化界面 + API       |
| **扩展性**   | 需要重启服务                  | 支持热更新             |

## 3. 方案1：Nginx 反向代理

### 3.1 架构设计

方案1采用 **Nginx 反向代理 + 多端口 MCP 服务** 的架构：

    客户端请求
        ↓
    Nginx (端口80)
        ↓ (根据 X-Target-Port header)
    后端 MCP 服务集群
        ├── 服务1 (端口8080)
        ├── 服务2 (端口8081)
        ├── 服务3 (端口8082)
        └── 服务4 (端口8083)

**核心流程**：

1. 客户端发送请求到 Nginx（端口80），在 Header 中携带 `X-Target-Port` 指定目标端口
2. Nginx 根据 `X-Target-Port` 动态路由到对应的后端 MCP 服务
3. 后端服务处理请求并返回响应

### 3.2 环境准备

**软硬件环境**：

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- Nginx >= 1.21
- Docker（可选，用于容器化部署）

**项目依赖**：

```json
{
  "dependencies": {
    "fastmcp": "^0.1.0"
  }
}
```

### 3.3 核心功能实现

#### 模块1：MCP 服务启动管理

**实现目标**：根据配置文件动态启动多个独立的 MCP 服务实例，每个服务运行在独立端口。

**核心代码**（`src/index.ts`）：

```typescript
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FastMCP } from 'fastmcp'

import config from '../config.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const start = () => {
  config.forEach(async mcpConfig => {
    // 创建 FastMCP 服务器实例
    const server = new FastMCP({
      name: mcpConfig.name,
      version: mcpConfig.version as `${number}.${number}.${number}`
    })

    // 动态导入服务模块并注册工具
    const { default: registerTools } = await import(
      path.join(__dirname, mcpConfig.entry.replace('.ts', '.mjs'))
    )
    registerTools(server)

    // 启动服务，监听指定端口
    server.start({
      transportType: 'httpStream',
      httpStream: {
        host: '0.0.0.0',
        port: mcpConfig.port // 每个服务独立端口
      }
    })
  })
}

start()
```

**代码解析**：

- 使用 `FastMCP` 框架简化 MCP 服务开发
- 通过 `config.json` 配置文件驱动，支持动态加载服务模块
- 每个服务实例独立监听不同端口，实现物理隔离
- 使用动态导入（`import()`）实现模块的按需加载

**配置文件**（`config.json`）：

```json
[
  {
    "name": "Common MCP Server",
    "version": "1.0.0",
    "entry": "servers/_common/index.ts",
    "port": 8080
  },
  {
    "name": "Temperature Conversion MCP Server",
    "version": "1.0.0",
    "entry": "servers/temperatureConversion/index.ts",
    "port": 8081
  }
]
```

#### 模块2：Nginx 反向代理配置

**实现目标**：配置 Nginx 根据 `X-Target-Port` header 动态路由请求到对应的后端服务端口。

**核心配置**（`docker/nginx.conf`）：

```nginx
http {
    # 使用 map 指令根据 X-Target-Port header 动态构建后端地址
    map $http_x_target_port $backend_upstream {
        default "http://0.0.0.0:8080";  # 默认端口
        "~^(\d+)$" "http://0.0.0.0:$1";  # 如果 X-Target-Port 是数字，使用该端口
    }

    server {
        listen 80;
        server_name _;

        location / {
            # 使用动态构建的后端地址
            proxy_pass $backend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # SSE (Server-Sent Events) 配置
            proxy_http_version 1.1;
            proxy_buffering off;  # 关闭缓冲，支持流式传输
            proxy_cache off;
            proxy_set_header Connection "keep-alive";
            proxy_read_timeout 86400s;  # 长连接超时时间
            proxy_send_timeout 60s;
        }
    }
}
```

**配置解析**：

- `map` 指令：根据 `$http_x_target_port`（Nginx 自动将 Header 中的 `-` 转换为 `_`）动态构建后端地址
- `proxy_pass $backend_upstream`：使用动态变量进行反向代理
- SSE 配置：关闭缓冲、设置长连接超时，确保流式传输正常工作

**效果验证**：

```bash
# 测试服务1（端口8080）
curl -H "X-Target-Port: 8080" http://localhost/sse

# 测试服务2（端口8081）
curl -H "X-Target-Port: 8081" http://localhost/sse
```

#### 模块3：MCP 服务工具注册

**实现目标**：在每个服务模块中注册具体的工具函数。

**示例代码**（`servers/temperatureConversion/index.ts`）：

```typescript
import { FastMCP } from 'fastmcp'
import { z } from 'zod'

export default function registerTools(server: FastMCP) {
  // 注册温度转换工具
  server.tool(
    'convert_temperature',
    '将温度在不同单位之间转换（摄氏度、华氏度、开尔文）',
    {
      temperature: z.number().describe('要转换的温度值'),
      from: z.enum(['celsius', 'fahrenheit', 'kelvin']).describe('源温度单位'),
      to: z.enum(['celsius', 'fahrenheit', 'kelvin']).describe('目标温度单位')
    },
    async ({ temperature, from, to }) => {
      // 转换逻辑
      let celsius = 0
      if (from === 'celsius') celsius = temperature
      else if (from === 'fahrenheit') celsius = ((temperature - 32) * 5) / 9
      else if (from === 'kelvin') celsius = temperature - 273.15

      let result = 0
      if (to === 'celsius') result = celsius
      else if (to === 'fahrenheit') result = (celsius * 9) / 5 + 32
      else if (to === 'kelvin') result = celsius + 273.15

      return {
        content: [
          {
            type: 'text',
            text: `${temperature}°${from} = ${result.toFixed(2)}°${to}`
          }
        ]
      }
    }
  )
}
```

### 3.4 常见问题&踩坑指南

**问题1：Nginx 502 Bad Gateway**

**现象**：客户端请求返回 502 错误

**原因**：

- 后端 MCP 服务未启动
- 端口配置错误
- Nginx 无法连接到后端服务

**解决方案**：

```bash
# 检查后端服务是否运行
lsof -i:8080
lsof -i:8081

# 检查 Nginx 配置语法
nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

**问题2：SSE 连接断开**

**现象**：SSE 连接建立后很快断开

**原因**：Nginx 默认的 `proxy_read_timeout` 过短

**解决方案**：在 Nginx 配置中增加超时时间：

```nginx
proxy_read_timeout 86400s;  # 24小时
proxy_send_timeout 60s;
```

**问题3：端口冲突**

**现象**：服务启动失败，提示端口被占用

**原因**：多个服务配置了相同端口

**解决方案**：

- 检查 `config.json` 确保每个服务端口唯一
- 使用 `lsof -i:端口号` 查找占用进程并关闭

## 4. 方案2：Express 统一服务

### 4.1 架构设计

方案2采用 **Express 单端口 + 内存映射管理** 的架构：

    客户端请求
        ↓
    Express 服务器 (端口3002)
        ↓ (根据 MCP_ID header)
    MCP 服务管理器
        ↓
    Map<configId, McpHandlers>
        ├── 服务1 (ID: 1)
        ├── 服务2 (ID: 2)
        ├── 服务3 (ID: 3)
        └── 服务4 (ID: 4)
        ↓
    SQL.js 数据库 (配置持久化)

**核心流程**：

1. 客户端发送请求到 Express 服务器（端口3002），在 Header 中携带 `MCP_ID` 指定服务ID
2. Express 路由处理器解析 `MCP_ID`，从内存映射表（`Map<configId, McpHandlers>`）中获取对应的 handlers
3. 调用对应的 MCP handler 处理请求并返回响应
4. 配置信息存储在 SQL.js 数据库中，支持动态创建、更新和删除

### 4.2 环境准备

**软硬件环境**：

- Node.js >= 24.11.1
- pnpm >= 10.25.0
- SQL.js（内置，无需额外数据库服务）

**项目依赖**：

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^5.0.0",
    "express-mcp-handler": "^1.0.0",
    "sql.js": "^1.10.0",
    "kysely": "^0.27.0"
  }
}
```

### 4.3 核心功能实现

#### 模块1：MCP 服务动态管理

**实现目标**：从数据库加载配置，动态创建 MCP 服务实例，并维护内存映射表。

**核心代码**（`packages/honeycomb-server/src/mcp.ts`）：

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { sseHandlers } from 'express-mcp-handler'
import { z } from 'zod'

/**
 * 批量创建 MCP 服务并返回 handlers 映射
 */
export async function createMcpServices(): Promise<Map<number, McpHandlers>> {
  const databaseClient = await getDatabaseClient()
  // 从数据库加载所有配置（包含关联的工具）
  const allConfigsWithTools = await databaseClient.getAllConfigsWithTools()

  const handlersMap = new Map<number, McpHandlers>()

  for (const config of allConfigsWithTools) {
    // 只创建状态为 RUNNING 的服务
    if (config.status !== StatusEnum.RUNNING) {
      continue
    }

    // 创建 MCP 服务器实例
    const server = new McpServer({
      name: config.name,
      version: config.version,
      description: config.description
    })

    // 批量注册工具
    config.tools.forEach(tool => {
      // 解析 JSON Schema 并转换为 Zod schema
      const inputSchemaObj = JSON.parse(tool.input_schema)
      const outputSchemaObj = JSON.parse(tool.output_schema)
      const inputSchema = jsonSchemaToZod(inputSchemaObj)
      const outputSchema = jsonSchemaToZod(outputSchemaObj)

      // 注册工具
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema,
          outputSchema
        },
        async ({ input }) => {
          // 执行工具回调逻辑
          // TODO: 实现实际的工具回调
          return {
            content: [{ type: 'text', text: `测试: ${JSON.stringify(input)}` }]
          }
        }
      )
    })

    // 创建 SSE handlers
    const handlers = sseHandlers(() => server, {
      onError: (error: Error, sessionId?: string) => {
        consola.error(`[SSE][${config.name}] 错误:`, error)
      }
    })

    // 使用配置ID作为key存储handlers
    handlersMap.set(config.id!, handlers)
  }

  return handlersMap
}
```

**代码解析**：

- 使用 `Map<number, McpHandlers>` 存储服务ID到handlers的映射关系
- 从数据库动态加载配置，支持运行时更新
- 只创建状态为 `RUNNING` 的服务，实现服务的启停控制
- 使用 `express-mcp-handler` 库创建 SSE handlers，简化 MCP 协议处理

#### 模块2：路由分发机制

**实现目标**：根据 `MCP_ID` header 从内存映射表中获取对应的 handlers 并处理请求。

**核心代码**（`packages/honeycomb-server/src/mcp.ts`）：

```typescript
/**
 * 创建路由处理器（根据 MCP_ID 选择对应的 handler）
 */
export function createMcpRouteHandler(
  handlersMap: Map<number, McpHandlers>,
  handlerType: 'get' | 'post'
) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 解析 MCP_ID
    const mcpIdHeader = req.headers.mcp_id || req.headers.MCP_ID
    const mcpId = mcpIdHeader
      ? parseInt(typeof mcpIdHeader === 'string' ? mcpIdHeader : mcpIdHeader[0], 10)
      : null

    if (mcpId === null || Number.isNaN(mcpId)) {
      res.status(400).json({
        error: '缺少或无效的 MCP_ID header 参数',
        message: '请在请求 Header 中添加 MCP_ID 或 mcp_id 参数（数字类型）'
      })
      return
    }

    // 从映射表中获取对应的 handlers
    const handlers = handlersMap.get(mcpId)

    if (!handlers) {
      res.status(404).json({
        error: `未找到 ID 为 ${mcpId} 的 MCP 配置`,
        message: `请检查 MCP_ID 是否正确，当前可用的 MCP ID: ${Array.from(handlersMap.keys()).join(', ')}`
      })
      return
    }

    // 调用对应的 handler（GET 或 POST）
    const targetHandler = handlerType === 'get' ? handlers.getHandler : handlers.postHandler
    targetHandler(req, res, next)
  }
}
```

**路由注册**（`packages/honeycomb-server/src/app.ts`）：

```typescript
// 注册 SSE 端点
app.get('/sse', createMcpRouteHandler(mcpHandlersMap, 'get'))
app.post('/messages', createMcpRouteHandler(mcpHandlersMap, 'post'))
```

**代码解析**：

- 通过中间件函数实现路由分发，支持 GET 和 POST 两种请求方式
- 从请求 Header 中解析 `MCP_ID`，支持大小写不敏感
- 提供详细的错误提示，包括当前可用的 MCP ID 列表
- 使用函数式编程，返回 Express 中间件函数

#### 模块3：配置管理与服务刷新

**实现目标**：提供 REST API 管理 MCP 配置，支持动态刷新服务。

**核心代码**（`packages/honeycomb-server/src/routes/configs.ts`）：

```typescript
/**
 * POST /api/config/:id/start - 启动服务
 */
export async function startConfigHandler(
  req: express.Request,
  res: express.Response,
  handlersMap: Map<number, McpHandlers>
) {
  const id = validateIdParam(req)
  const databaseClient = await getDatabaseClient()

  // 更新数据库状态为 RUNNING
  await databaseClient.updateConfig(id, {
    status: StatusEnum.RUNNING,
    last_modified: getCurrentTimeString()
  })
  await databaseClient.save()

  // 刷新 MCP 服务（重新加载所有配置）
  await refreshMcpServices(handlersMap)

  const updatedConfig = await databaseClient.getConfigWithTools(id)
  res.json(createSuccessResponse(dbToVO(updatedConfig)))
}

/**
 * 刷新 MCP 服务（重新加载所有配置）
 */
export async function refreshMcpServices(handlersMap: Map<number, McpHandlers>): Promise<void> {
  // 清空现有映射
  handlersMap.clear()

  // 重新创建所有服务
  const newHandlersMap = await createMcpServices()

  // 更新映射表
  newHandlersMap.forEach((handlers, id) => {
    handlersMap.set(id, handlers)
  })
}
```

**代码解析**：

- 通过 REST API 提供配置的 CRUD 操作
- 启动/停止服务时更新数据库状态并刷新内存映射表
- `refreshMcpServices` 函数实现服务的热更新，无需重启进程
- 使用 SQL.js 作为轻量级数据库，无需额外数据库服务

#### 模块4：JSON Schema 到 Zod 转换

**实现目标**：将数据库中存储的 JSON Schema 转换为 Zod schema，用于 MCP 工具的参数校验。

**核心代码**：

```typescript
/**
 * 将 JSON Schema 转换为 Zod schema
 */
function jsonSchemaToZod(schemaObj: Record<string, any>): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const [key, value] of Object.entries(schemaObj)) {
    if (typeof value === 'object' && value !== null) {
      const fieldSchema = value as { type?: string; description?: string }
      let zodType: z.ZodTypeAny

      // 根据 JSON Schema 的 type 创建对应的 Zod 类型
      switch (fieldSchema.type) {
        case 'string':
          zodType = z.string()
          break
        case 'number':
          zodType = z.number()
          break
        case 'integer':
          zodType = z.number().int()
          break
        case 'boolean':
          zodType = z.boolean()
          break
        case 'array':
          zodType = z.array(z.any())
          break
        case 'object':
          zodType = z.object({})
          break
        default:
          zodType = z.any()
      }

      // 如果有 description，添加描述
      if (fieldSchema.description) {
        zodType = zodType.describe(fieldSchema.description)
      }

      shape[key] = zodType
    } else {
      shape[key] = z.any()
    }
  }

  return z.object(shape)
}
```

**代码解析**：

- 支持常见的 JSON Schema 类型到 Zod 类型的转换
- 保留字段描述信息，提升 API 文档质量
- 对于不支持的类型，使用 `z.any()` 作为兜底

### 4.4 常见问题&踩坑指南

**问题1：MCP\_ID 未找到**

**现象**：返回 404 错误，提示未找到对应的 MCP 配置

**原因**：

- 服务未启动（状态不是 RUNNING）
- MCP\_ID 输入错误
- 服务被删除但客户端仍在使用旧ID

**解决方案**：

```bash
# 通过 API 查询所有可用的服务
curl http://localhost:3002/api/configs

# 检查服务状态
# 确保服务状态为 "running"
```

**问题2：服务刷新后连接断开**

**现象**：调用刷新 API 后，现有的 SSE 连接断开

**原因**：`refreshMcpServices` 会清空并重建所有服务实例，导致现有连接失效

**解决方案**：

- 这是预期行为，客户端需要重新建立连接
- 可以在刷新前通知客户端，或实现连接迁移机制

**问题3：数据库文件权限问题**

**现象**：SQL.js 数据库文件无法写入

**原因**：文件权限不足或文件被锁定

**解决方案**：

```bash
# 检查文件权限
ls -l mcp.db

# 修改文件权限
chmod 644 mcp.db
```

## 5. 两种方案对比

### 5.1 架构对比

| 维度           | 方案1：Nginx反向代理            | 方案2：Express统一服务         |
| -------------- | ------------------------------- | ------------------------------ |
| **服务隔离**   | 物理隔离（独立端口、独立进程）  | 逻辑隔离（同一进程、内存映射） |
| **资源消耗**   | 较高（多进程）                  | 较低（单进程）                 |
| **扩展性**     | 需要修改配置并重启              | 支持热更新，无需重启           |
| **配置管理**   | 静态文件（config.json）         | 动态数据库（SQL.js）           |
| **运维复杂度** | 中等（需要管理Nginx和多个服务） | 较低（单一服务）               |

### 5.2 性能对比

**方案1优势**：

- 服务之间完全隔离，单个服务崩溃不影响其他服务
- Nginx 作为成熟的反向代理，性能稳定可靠
- 可以针对不同服务进行独立的性能调优

**方案2优势**：

- 单进程架构，内存占用更少
- 无需经过 Nginx 转发，减少网络跳数
- 服务创建和销毁更快（内存操作 vs 进程管理）

### 5.3 适用场景

**方案1适用于**：

- 需要严格服务隔离的场景
- 已有 Nginx 基础设施的项目
- 服务数量相对固定，不频繁变更
- 需要独立监控和日志的场景

**方案2适用于**：

- 需要动态管理服务的场景
- 资源受限的环境（如边缘计算）
- 需要可视化配置管理的场景
- 快速迭代和开发测试环境

### 5.4 技术选型建议

**选择方案1，如果**：

- ✅ 你的团队熟悉 Nginx 配置
- ✅ 需要生产级的高可用性
- ✅ 服务数量较少且相对稳定
- ✅ 需要独立的服务监控和日志

**选择方案2，如果**：

- ✅ 需要频繁添加/删除服务
- ✅ 希望提供用户友好的配置界面
- ✅ 资源受限，需要优化内存使用
- ✅ 快速开发和迭代

## 6. 进阶优化与扩展

### 6.1 性能优化方向

**方案1优化**：

- **连接池管理**：配置 Nginx upstream 连接池，复用后端连接
- **负载均衡**：为同一服务配置多个后端实例，实现负载均衡
- **缓存策略**：对静态资源或频繁查询的结果进行缓存

**方案2优化**：

- **懒加载服务**：按需创建服务实例，减少启动时间
- **服务预热**：在服务启动时预加载常用服务
- **连接复用**：实现 SSE 连接池，减少连接建立开销

### 6.2 扩展应用场景

**场景1：服务版本管理**

- 支持同一服务的多个版本并存
- 通过 Header 参数（如 `MCP-Version`）选择版本
- 实现灰度发布和版本回滚

**场景2：服务监控和告警**

- 集成 Prometheus 监控指标
- 实现服务健康检查接口
- 配置告警规则（如服务响应时间、错误率）

**场景3：多租户支持**

- 为不同租户隔离服务实例和配置
- 通过租户ID（Tenant ID）进行路由
- 实现资源配额和限流

### 6.3 生产环境注意事项

**安全性**：

- 实现请求认证和授权（如 JWT Token）
- 对 Header 参数进行校验和过滤，防止注入攻击
- 配置 HTTPS，加密传输数据

**高可用性**：

- 实现服务健康检查，自动剔除异常服务
- 配置服务重启策略和故障恢复机制
- 实现配置备份和恢复

**可观测性**：

- 集成结构化日志（如 Winston、Pino）
- 实现分布式追踪（如 OpenTelemetry）
- 配置告警和通知机制

## 7. 总结与展望

### 7.1 核心内容总结

本文深入对比了两种单实例多MCP聚合服务的实现方案：

1. **方案1（Nginx反向代理）**：采用物理隔离的方式，每个 MCP 服务运行在独立端口，通过 Nginx 反向代理统一对外提供服务。适合需要严格服务隔离、服务数量相对固定的场景。

2. **方案2（Express统一服务）**：采用逻辑隔离的方式，所有 MCP 服务运行在同一进程，通过内存映射表管理，支持动态创建和销毁。适合需要频繁变更服务、资源受限的场景。

两种方案各有优劣，开发者应根据实际业务需求、团队技术栈和运维能力进行选择。

### 7.2 技术局限性

**方案1局限性**：

- 需要额外的 Nginx 组件，增加系统复杂度
- 服务数量受端口数量限制（理论上最多65535个）
- 配置变更需要重启服务，不够灵活

**方案2局限性**：

- 单进程架构，单个服务崩溃可能影响整体稳定性
- 内存映射表需要手动管理，容易出现内存泄漏
- SQL.js 数据库不适合高并发写入场景

### 7.3 未来探索方向

1. **混合方案**：结合两种方案的优点，实现分层的服务管理（如按服务类型分组，组内使用方案2，组间使用方案1）

2. **服务网格集成**：将 MCP 服务接入 Istio 等服务网格，实现更强大的流量管理、安全策略和可观测性

3. **云原生部署**：支持 Kubernetes 部署，实现自动扩缩容、服务发现和配置管理

4. **协议扩展**：支持更多 MCP 传输方式（如 WebSocket、gRPC），提升性能和灵活性

5. **工具市场**：构建 MCP 工具市场，支持工具的发布、分享和版本管理

## 8. 参考资料

1. **MCP 协议官方文档**
   - [Model Context Protocol Specification](https://modelcontextprotocol.io/)
   - [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)

2. **技术文档**
   - [FastMCP 框架文档](https://github.com/jlowin/fastmcp)
   - [Express 官方文档](https://expressjs.com/)
   - [Nginx 反向代理配置指南](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)

3. **相关项目**
   - [Honeycomb 项目源码](https://github.com/betterhyq/honeycomb)
   - [express-mcp-handler](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/packages/express-mcp-handler)

4. **SSE 协议**
   - [Server-Sent Events 规范](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
   - [SSE 最佳实践](https://www.html5rocks.com/en/tutorials/eventsource/basics/)
