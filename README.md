# 细胞防线 · 免疫作战

**[点击在线游玩](https://gamebunensi.github.io/cell-vs-cancer-play/)**

部署免疫细胞，守护健康组织的网页塔防游戏原型。无需安装，从 1-1「第一处感染」开始，逐关解锁新的单位与组织战场。

本仓库是公开的 **网站发布仓库**，由私有开发仓库导出网页文件，不包含开发仓库的 Git 历史、内部文档或开发工具。网页运行所需的 JavaScript 会随站点公开。

## 当前内容

| 章节 | 关卡 | 数量 |
| --- | --- | ---: |
| 上呼吸道 | 1-1～1-10 | 10 |
| 低灌注创面 | 2-1～2-10 | 10 |
| 血流通道 | 3-1～3-10 | 10 |
| 淋巴结窦道 | 4-1～4-10 | 10 |
| 循环液面 | 5-1～5-2 | 2 |

共 **42 关**，包括新手教程、自由选卡、补给传送带、感染灶和 Boss 战。5-3 之后尚未实现，5-2 领取奖励后可重玩。

## 怎么玩

1. 点击首页「开始免疫作战」，首次进入 1-1。
2. 点击金色能量泡收集能量；点击细胞卡，再点击开放的组织格部署。
3. 留意单位费用、冷却和目标类型，搭配补给、输出与屏障。
4. 守住感染波次，点击通关奖励，继续下一关。

菜单可以暂停、查看图鉴和返回指挥中心。音频可能需要首次点击后才开始。建议使用桌面版 Edge、Chrome 或 Firefox；触屏与小屏幕适配仍在完善。

进度保存在当前浏览器的本地存储中。清除网站数据、更换浏览器或设备后，进度不会同步；本地开发版与线上版的存档也相互独立。无需登录，当前没有账号、云存档或排行榜。

## 发布方式

GitHub Pages 从本仓库 `main` 分支的根目录发布。`.nojekyll` 让 HTML、CSS、JavaScript、图片和音频按原样提供，无需运行服务器或安装依赖。

这是生成的发布副本。游戏修改应在私有开发仓库完成并验证，再导出更新本仓库。发现问题可以在本仓库 [Issues](https://github.com/Gamebunensi/cell-vs-cancer-play/issues) 中附上关卡、操作步骤和浏览器信息。

## 制作与许可

非商业原型，无广告或付费功能。免疫角色、组织场景和界面为项目内容；核心运行代码及部分通用素材继承上游网页塔防项目。项目不宣称拥有所有素材的独立权利。

保留 [完整上游声明](docs/UPSTREAM_NOTICE.html) 与 [许可证](LICENSE.md)。Plants vs. Zombies: MODDED © 2025 ROBINET13 & Clay；源移植代码作者为 JiangNanGame 与 LonelyStar。适用 PolyForm Noncommercial 1.0.0 与 Changjiang River License；PopCap / EA 的相关知识产权仍归其所有，项目与其无关联或授权背书。

## English

**[Play online](https://gamebunensi.github.io/cell-vs-cancer-play/)** — Cell Defense is a noncommercial immune-system tower-defense prototype with **42 playable stages**, starting at 1-1. Collect energy, deploy cells, survive infection waves, and unlock the next stage. Progress is stored only in your current browser; no account or cloud save is provided.

This repository contains the static website release, without the private development repository's history or internal documents. Pages serves `main` at `/`. Preserve the upstream notices and dual license when copying or hosting the game.
