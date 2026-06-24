<div align="center">

# IBAS ApprovalProcess

**审批流程模块**

IBAS 系统的审批流程模块，提供审批模板配置、审批请求发起、多步审批流程执行、条件路由等功能，支持业务对象写入时自动触发审批。

Approval process module for the IBAS system — configurable approval templates, multi-step approval requests, conditional routing, and automatic approval triggering on business object writes.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-1.8+-orange.svg)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-3.x-red.svg)](https://maven.apache.org/)
[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](pom.xml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-贡献--contributing)

</div>

---

## 📖 目录 | Table of Contents

- [✨ 特性 | Features](#-特性--features)
- [📦 模块结构 | Modules](#-模块结构--modules)
- [🚀 快速开始 | Quick Start](#-快速开始--quick-start)
- [📋 业务对象 | Business Objects](#-业务对象--business-objects)
- [📚 相关项目 | Related Projects](#-相关项目--related-projects)
- [🤝 贡献 | Contributing](#-贡献--contributing)
- [📄 许可证 | License](#-许可证--license)

---

## ✨ 特性 | Features

- **📋 审批模板** — 可配置的审批模板（Approval Template），定义审批流程结构与步骤
- **🔢 多步审批** — 支持多步骤审批，全部步骤批准后置为批准状态，任意步骤拒绝则拒绝
- **👥 审批人配置** — 按步骤配置审批人（Step Owner），支持多人审批
- **🔀 条件路由** — 步骤条件（Step Condition）判断，根据业务数据动态路由审批路径
- **📝 审批请求** — 自动发起审批请求（Approval Request），记录审批历史
- **🔗 框架集成** — 与 BOBAS 框架的审批引擎（ApprovalProcessManager）深度集成

---

## 📦 模块结构 | Modules

| 模块 | 类型 | 说明 |
|------|------|------|
| `ibas.approvalprocess` | JAR | **核心模块** — 审批模板与请求的业务对象定义、仓储层 |
| `ibas.approvalprocess.service` | WAR | **REST 服务** — Jersey 端点（DataService、FileService） |

---

## 🚀 快速开始 | Quick Start

### 环境要求 | Prerequisites

- **JDK** 1.8+
- **Maven** 3.x
- [ibas-framework](https://github.com/color-coding/ibas-framework)（BOBAS 框架）

### 构建 | Build

```bash
# 克隆仓库
git clone https://github.com/color-coding/ibas.approvalprocess.git
cd ibas.approvalprocess

# 编译全部模块
./compile_packages.sh            # Linux / macOS
compile_packages.bat             # Windows

# 编译单个模块
mvn clean package install -Dmaven.test.skip=true -f ibas.approvalprocess/pom.xml

# 运行测试
mvn test -f ibas.approvalprocess/pom.xml

# 部署
./deploy_packages.sh
```

### Maven 依赖

```xml
<dependency>
    <groupId>org.colorcoding.apps</groupId>
    <artifactId>ibas.approvalprocess</artifactId>
    <version>0.2.0</version>
</dependency>
```

---

## 📋 业务对象 | Business Objects

| 业务对象 | 说明 |
|----------|------|
| `ApprovalTemplate` | 审批模板（定义审批流程） |
| `ApprovalTemplateStep` / `ApprovalTemplateSteps` | 审批模板步骤 |
| `ApprovalTemplateStepOwner` / `ApprovalTemplateStepOwners` | 步骤审批人 |
| `ApprovalTemplateStepCondition` / `ApprovalTemplateStepConditions` | 步骤条件（路由判断） |
| `ApprovalRequest` | 审批请求（运行时实例） |
| `ApprovalRequestStep` / `ApprovalRequestSteps` | 审批请求步骤 |
| `ApprovalRequestSubStep` / `ApprovalRequestSubSteps` | 审批请求子步骤 |

---

## 📚 相关项目 | Related Projects

| 项目 | 说明 |
|------|------|
| [ibas-framework](https://github.com/color-coding/ibas-framework) | BOBAS 业务对象框架（含审批引擎核心） |
| [ibas.initialfantasy](https://github.com/color-coding/ibas.initialfantasy) | 用户与组织管理 |

---

## 🤝 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 发起 Pull Request

---

## 📄 许可证 | License

本项目基于 [Apache License 2.0](LICENSE) 开源。
---

## 🙏 鸣谢 | Thanks

<div align="center">

**[Color-Coding Studio](http://colorcoding.org/)** · 咔啦工作室

</div>
