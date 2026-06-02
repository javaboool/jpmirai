# JP-Mirai MVP Phase 1 — 执行进度

> 自动生成。每个 Task 完成后更新。
> 计划文件：`docs/plans/2026-05-31-mvp-phase1.md`

## 进度总览

```
整体进度: 2 / 14 tasks completed (14%)

[████░░░░░░░░░░░░░░░░░░░░░░░░░░] 14%
```

---

## Task 依赖图

```
Task 1: Scaffold
├── Task 2: Payload CMS
│   └── Task 4: UI Components ──── Task 5: Home Page ──── Task 6: List+Detail Pages
├── Task 3: i18n
│   ├── Task 4: UI Components (同上)
│   └── Task 7: Clerk Auth
│       └── Task 8: Consult Page
│           ├── Task 9: LiveKit Video
│           │   └── Task 10: Socket.io Signaling
│           │       ├── Task 11: Staff Dashboard
│           │       │   └── Task 14: Polish + PWA ◄─┐
│           │       └── Task 13: Real-Time Chat ──►──┤
│           └── Task 12: Email API ──────────────────┘
```

---

## 各 Task 详情

| # | Task | 负责 Agent | 状态 | 预计耗时 | 备注 |
|---|------|-----------|------|---------|------|
| 1 | Project Scaffold | implementer-1 | ✅ e74ec1d | 1h | 完成 |
| 2 | Payload CMS Setup | implementer-2 | ✅ 57f0103 | 2h | 完成，含 access control fix |
| 3 | Internationalization | implementer-3 | 🔒 blocked(1) | 1.5h | 需 Task 1 完成 |
| 4 | Core UI Components | implementer-4 | 🔒 blocked(2,3) | 2h | 需 Task 2+3 完成 |
| 5 | Home Page | implementer-5 | 🔒 blocked(4) | 1.5h | 需 Task 4 完成 |
| 6 | List + Detail Pages | implementer-6 | 🔒 blocked(5) | 2h | 需 Task 5 完成 |
| 7 | Clerk Auth | implementer-7 | 🔒 blocked(3) | 1h | 需 Task 3 完成 |
| 8 | Consultation Page | implementer-8 | 🔒 blocked(4,7) | 1.5h | 需 Task 4+7 完成 |
| 9 | LiveKit Video Call | implementer-9 | 🔒 blocked(8) | 2.5h | 需 Task 8 完成 |
| 10 | Socket.io Notifications | implementer-10 | 🔒 blocked(9) | 2h | 需 Task 9 完成 |
| 11 | Staff Dashboard | implementer-11 | 🔒 blocked(10) | 1.5h | 需 Task 10 完成 |
| 12 | Email API Route | implementer-12 | 🔒 blocked(8) | 0.5h | 需 Task 8 完成 |
| 13 | Real-Time Chat | implementer-13 | 🔒 blocked(10) | 1.5h | 需 Task 10 完成 |
| 14 | Polish + PWA | implementer-14 | 🔒 blocked(11,12,13) | 1h | 最后执行 |

**总计预估：22h**

---

## 各 Task 执行记录

### Task 1: Project Scaffold
- **Agent:** implementer-1 + spec-reviewer-1 + quality-reviewer-1
- **状态:** ⬜ 待开始
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `package.json`
  - `next.config.ts`
  - `tsconfig.json`
  - `.env.local`
  - `src/app/layout.tsx`
  - `src/app/globals.css`
- **Review 结果:** —
- **备注:** —

---

### Task 2: Payload CMS Setup
- **Agent:** implementer-2 + spec-reviewer-2 + quality-reviewer-2
- **状态:** 🔒 blocked by Task 1
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `payload.config.ts`
  - `src/collections/News.ts`
  - `src/collections/Messages.ts`
  - `src/collections/Notices.ts`
  - `src/collections/Media.ts`
  - `src/collections/Users.ts`
  - `src/app/(payload)/admin/...`
  - `src/app/(payload)/api/...`
- **Review 结果:** —
- **备注:** Payload v3 + PostgreSQL，Admin panel at /admin

---

### Task 3: Internationalization
- **Agent:** implementer-3 + spec-reviewer-3 + quality-reviewer-3
- **状态:** 🔒 blocked by Task 1
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/i18n/routing.ts`
  - `src/i18n/navigation.ts`
  - `src/middleware.ts`
  - `messages/ja.json`
  - `messages/en.json`
  - `messages/zh.json`
  - `src/app/[locale]/layout.tsx`
- **Review 结果:** —
- **备注:** 3 locales: ja/en/zh，default: ja

---

### Task 4: Core UI Components
- **Agent:** implementer-4 + spec-reviewer-4 + quality-reviewer-4
- **状态:** 🔒 blocked by Task 2+3
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/ui/ContentCard.tsx`
  - `src/components/ui/HeroBanner.tsx`
  - `src/components/ui/SectionHeader.tsx`
- **Review 结果:** —
- **备注:** 模仿 jp-mirai 蓝色系风格

---

### Task 5: Home Page
- **Agent:** implementer-5 + spec-reviewer-5 + quality-reviewer-5
- **状态:** 🔒 blocked by Task 4
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/[locale]/page.tsx`
  - `src/lib/payload.ts`
- **Review 结果:** —
- **备注:** 3模块×4卡片，Server Component，从Payload取数据

---

### Task 6: List + Detail Pages
- **Agent:** implementer-6 + spec-reviewer-6 + quality-reviewer-6
- **状态:** 🔒 blocked by Task 5
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/[locale]/news/page.tsx`
  - `src/app/[locale]/news/[slug]/page.tsx`
  - `src/app/[locale]/messages/page.tsx`
  - `src/app/[locale]/messages/[slug]/page.tsx`
  - `src/app/[locale]/notices/page.tsx`
  - `src/app/[locale]/notices/[slug]/page.tsx`
  - `src/components/ui/RichTextRenderer.tsx`
- **Review 结果:** —
- **备注:** 6个页面，RichText via Payload Lexical

---

### Task 7: Clerk Auth
- **Agent:** implementer-7 + spec-reviewer-7 + quality-reviewer-7
- **状态:** 🔒 blocked by Task 3
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/[locale]/sign-in/[[...sign-in]]/page.tsx`
  - `src/app/[locale]/sign-up/[[...sign-up]]/page.tsx`
- **Review 结果:** —
- **备注:** role via publicMetadata: user/staff/admin

---

### Task 8: Consultation Page
- **Agent:** implementer-8 + spec-reviewer-8 + quality-reviewer-8
- **状态:** 🔒 blocked by Task 4+7
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/[locale]/consult/page.tsx`
  - `src/components/consult/ConsultButtons.tsx`
  - `src/components/consult/EmailForm.tsx`
  - `src/components/consult/ChatPanel.tsx` (stub)
- **Review 结果:** —
- **备注:** 3大按钮：Chat/Email/Video

---

### Task 9: LiveKit Video Call
- **Agent:** implementer-9 + spec-reviewer-9 + quality-reviewer-9
- **状态:** 🔒 blocked by Task 8
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/api/livekit/token/route.ts`
  - `src/app/[locale]/consult/video/page.tsx`
  - `src/components/video/VideoCallRoom.tsx`
  - `src/components/video/CallDialing.tsx`
- **Review 结果:** —
- **备注:** idle→dialing→connected 状态机，需 LIVEKIT_API_KEY

---

### Task 10: Socket.io Notifications
- **Agent:** implementer-10 + spec-reviewer-10 + quality-reviewer-10
- **状态:** 🔒 blocked by Task 9
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/server/socket.ts`
  - `src/components/staff/IncomingCallAlert.tsx`
  - `public/sounds/ringtone.mp3`
- **Review 结果:** —
- **备注:** 独立 Express+Socket.io 服务 port 3001

---

### Task 11: Staff Dashboard
- **Agent:** implementer-11 + spec-reviewer-11 + quality-reviewer-11
- **状态:** 🔒 blocked by Task 10
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/[locale]/staff/page.tsx`
  - `src/app/[locale]/staff/call/page.tsx`
  - `src/components/staff/StaffLayout.tsx`
- **Review 结果:** —
- **备注:** role guard，接听后跳转 /staff/call?token=...

---

### Task 12: Email API Route
- **Agent:** implementer-12 + spec-reviewer-12 + quality-reviewer-12
- **状态:** 🔒 blocked by Task 8
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/app/api/email/route.ts`
- **Review 结果:** —
- **备注:** nodemailer SMTP，需 SMTP_USER/SMTP_PASS env

---

### Task 13: Real-Time Chat
- **Agent:** implementer-13 + spec-reviewer-13 + quality-reviewer-13
- **状态:** 🔒 blocked by Task 10
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `src/components/consult/ChatPanel.tsx` (replace stub)
- **Review 结果:** —
- **备注:** Socket.io join:chat/chat:message，气泡 UI

---

### Task 14: Polish + PWA
- **Agent:** implementer-14 + spec-reviewer-14 + quality-reviewer-14
- **状态:** 🔒 blocked by Task 11+12+13
- **开始时间:** —
- **完成时间:** —
- **输出文件:**
  - `public/manifest.json`
  - `src/app/[locale]/not-found.tsx`
  - `src/app/[locale]/loading.tsx`
- **Review 结果:** —
- **备注:** 最终 smoke test + PWA installable

---

## Agent 角色说明

每个 Task 派 3 个 agent：

| Agent 类型 | 职责 |
|-----------|------|
| **implementer-N** | 读计划 → 写代码 → 运行测试 → 自我 review → commit |
| **spec-reviewer-N** | 对照计划验证代码是否符合 spec，不多不少 |
| **quality-reviewer-N** | 检查代码质量：可读性、性能、安全、重复逻辑 |

spec review 通过 → 才进行 quality review。两者都通过 → task 标记 completed。

---

## 环境变量检查清单

在开始 Task 7/9/10 之前，确认以下 env 已填入 `.env.local`：

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — 来自 clerk.com dashboard
- [ ] `CLERK_SECRET_KEY` — 来自 clerk.com dashboard
- [ ] `LIVEKIT_API_KEY` — 来自 livekit.io dashboard
- [ ] `LIVEKIT_API_SECRET` — 来自 livekit.io dashboard
- [ ] `NEXT_PUBLIC_LIVEKIT_URL` — 格式: `wss://xxx.livekit.cloud`
- [ ] `DATABASE_URI` — 本地: `postgresql://postgres:password@localhost:5432/jpmirai`
- [ ] `PAYLOAD_SECRET` — 任意随机字符串
- [ ] `SMTP_USER` / `SMTP_PASS` — Gmail App Password（Task 12 前）

---

*最后更新: 2026-05-31*
