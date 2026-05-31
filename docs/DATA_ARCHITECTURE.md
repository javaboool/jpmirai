# 数据存放规范

## 原则

最小 `.env`：只放「启动前必须有」的 bootstrap 密钥。
其余配置存 PostgreSQL（通过 Payload CMS Admin 面板管理，不需要改代码）。

---

## `.env.local` / `.env.production` — 只放这 4 类

> 这些是「鸡和蛋」问题：没有它们，应用根本启动不了，所以只能放文件里。

```
# 1. 数据库连接（Payload 启动时第一件事就要连）
DATABASE_URI=postgresql://user:pass@host:5432/jpmirai

# 2. Payload 加密盐（JWT 签名用，改了所有 session 失效）
PAYLOAD_SECRET=random-64-char-string

# 3. Clerk（Next.js middleware 在 DB 可用之前就跑了）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# 4. 应用 URL（构建时 next-intl 需要）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**以上共 7 个环境变量。其他全部存 DB。**

---

## PostgreSQL（通过 Payload CMS 管理）

### 1. `settings` collection — 运行时配置

> 路径：Payload Admin → Settings
> 单条记录（singleton），可热更新，无需重启

| 字段 | 类型 | 说明 |
|------|------|------|
| `livekit_api_key` | text | LiveKit API Key |
| `livekit_api_secret` | text | LiveKit API Secret（加密存储） |
| `livekit_url` | text | wss://xxx.livekit.cloud |
| `smtp_host` | text | SMTP 服务器 |
| `smtp_port` | number | 默认 587 |
| `smtp_user` | text | 发件邮箱 |
| `smtp_pass` | text | SMTP 密码（加密存储） |
| `staff_email` | text | 接收相談邮件的收件箱 |
| `socket_port` | number | Socket.io 端口，默认 3001 |
| `max_call_participants` | number | 最大通话人数，默认 4 |

**如何修改：** 登录 `/admin` → Collections → Settings → 编辑保存，立即生效。

---

### 2. `user_profiles` collection — 用户扩展数据

> Clerk 只存认证。业务相关用户数据存这里。

| 字段 | 类型 | 说明 |
|------|------|------|
| `clerk_user_id` | text (unique) | Clerk 的 userId，外键 |
| `name` | text | 显示名 |
| `preferred_locale` | select | ja/en/zh |
| `phone` | text | 联系电话 |
| `nationality` | text | 国籍 |
| `company` | text | 工作单位 |
| `role` | select | user/staff/admin（与 Clerk publicMetadata 同步） |
| `notes` | textarea | Staff 备注（用户看不到） |
| `created_at` | date | 自动 |

**同步机制：** Clerk webhook → `/api/webhooks/clerk` → 写入/更新此表。

---

### 3. `consultation_logs` collection — 相談记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `user` | relation → user_profiles | 发起方 |
| `staff` | relation → user_profiles | 接待 Staff |
| `type` | select | chat/email/video |
| `status` | select | pending/active/closed |
| `started_at` | date | |
| `ended_at` | date | |
| `livekit_room` | text | 房间名（video 用） |
| `transcript` | richText | Chat 记录摘要 |

---

## 文件目录结构

```
JpMirai/
├── .env.local              ← 7个 bootstrap 密钥（本地开发）
├── .env.production         ← 同上（生产，不提交 git）
├── .env.example            ← 模板，提交 git，值全部为空
├── docs/
│   ├── DATA_ARCHITECTURE.md  ← 本文件
│   ├── PROGRESS.md           ← 执行进度
│   └── plans/
│       └── 2026-05-31-mvp-phase1.md
├── src/
│   ├── collections/
│   │   ├── Settings.ts       ← 运行时配置 collection
│   │   ├── UserProfiles.ts   ← 用户扩展数据
│   │   ├── ConsultationLogs.ts
│   │   ├── News.ts
│   │   ├── Messages.ts
│   │   ├── Notices.ts
│   │   ├── Media.ts
│   │   └── Users.ts          ← Payload 内部 Auth 用户（Admin 登录）
│   └── lib/
│       └── settings.ts       ← 从 DB 读取 Settings 的 helper
```

---

## 读取 Settings 的 helper（`src/lib/settings.ts`）

```typescript
import { getPayloadClient } from './payload'

let cache: Record<string, string> | null = null

export async function getSettings(): Promise<Record<string, string>> {
  if (cache) return cache
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'settings', limit: 1 })
  cache = docs[0] || {}
  return cache
}

export function clearSettingsCache() {
  cache = null
}
```

API route 调用示例：

```typescript
const settings = await getSettings()
const at = new AccessToken(settings.livekit_api_key, settings.livekit_api_secret, ...)
```

---

## .gitignore 规则

```
.env.local
.env.production
.env*.local
```

`.env.example` 必须提交 git，内容：

```
DATABASE_URI=
PAYLOAD_SECRET=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
