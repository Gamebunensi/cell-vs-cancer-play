/* Shared local campaign data for the home screen and battle shell. */
var ImmuneCampaign = {
	LastLevel: 42,
	StorageKey: "cell-defense.campaign.v1",
	Chapters: [
		{ name: "上呼吸道", scene: "airway", subtitle: "守住第一道黏膜屏障", color: "#54b8a2" },
		{ name: "低灌注创面", scene: "wound", subtitle: "重建补给，清除感染灶", color: "#8584c9" },
		{ name: "血流通道", scene: "blood", subtitle: "截住随血流扩散的病原体", color: "#459cb8" },
		{ name: "淋巴结窦道", scene: "lymph", subtitle: "协同识别，迎战肿瘤团块", color: "#a18ac6" },
		{ name: "循环液面", scene: "circulation", subtitle: "在流动环境中延伸防线", color: "#58aeb3" },
	],
	label(level) { return Math.ceil(level / 10) + "-" + (level % 10 || 10); },
	chapter(level) { return this.Chapters[Math.min(4, Math.floor((level - 1) / 10))]; },
	read() {
		try {
			const saved = JSON.parse(localStorage.getItem(this.StorageKey) || "{}");
			const completed = Array.isArray(saved.completed) ? [...new Set(saved.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= this.LastLevel))] : [];
			const current = Number.isInteger(saved.current) && saved.current >= 1 && saved.current <= this.LastLevel ? saved.current : 1;
			return { current, completed };
		} catch { return { current: 1, completed: [] }; }
	},
	write(progress) { try { localStorage.setItem(this.StorageKey, JSON.stringify(progress)); return true; } catch { return false; } },
	unlocked(progress = this.read()) { let level = 1; while (level < this.LastLevel && progress.completed.includes(level)) level++; return level; },
	resume() { const progress = this.read(); return Math.min(progress.current, this.unlocked(progress)); },
	visit(level) { const progress = this.read(); progress.current = level; this.write(progress); },
	complete(level) {
		const progress = this.read();
		if (!Number.isInteger(level) || level < 1 || level > this.LastLevel) return false;
		if (!progress.completed.includes(level)) progress.completed.push(level);
		progress.current = Math.min(this.LastLevel, level + 1);
		return this.write(progress);
	},
};
