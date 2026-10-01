const progress = ImmuneCampaign.read();
const unlocked = ImmuneCampaign.unlocked(progress);
const resume = ImmuneCampaign.resume();
const resumeLink = document.getElementById("resumeGame");
resumeLink.href = `game/?level=immune-${resume}`;
resumeLink.firstChild.textContent = progress.completed.length ? "继续免疫作战 " : "开始免疫作战 ";
document.getElementById("resumeCaption").textContent = `${ImmuneCampaign.label(resume)} · ${ImmuneCampaign.chapter(resume).name} / 进度自动保存`;
document.getElementById("campaignProgress").textContent = `已完成 ${progress.completed.length} / ${ImmuneCampaign.LastLevel}`;
ImmuneCampaign.Chapters.forEach((chapter, index) => {
	const section = document.createElement("article");
	section.className = "chapter";
	section.style.setProperty("--chapter-color", chapter.color);
	const first = index * 10 + 1;
	section.innerHTML = `<div class="chapter-cover" style="background-image:url(game/images/immune_mod/worlds/${chapter.scene}.png)"><span>0${index + 1}</span><p>${first <= unlocked ? "防御区域" : "未探索区域"}</p></div><div class="chapter-info"><h3>${chapter.name}</h3><p>${chapter.subtitle}</p><div class="level-nodes"></div></div>`;
	const nodes = section.querySelector(".level-nodes");
	for (let level = first; level <= Math.min(first + 9, ImmuneCampaign.LastLevel); level++) {
		const link = document.createElement(level <= unlocked ? "a" : "span");
		const cleared = progress.completed.includes(level);
		link.className = "level-node" + (cleared ? " cleared" : level === unlocked ? " current" : level > unlocked ? " locked" : "");
		link.textContent = ImmuneCampaign.label(level);
		link.title = cleared ? "已守住 · 可重玩" : level <= unlocked ? "进入感染区" : "完成前一关后开放";
		if (level <= unlocked) link.href = `game/?level=immune-${level}`;
		else link.setAttribute("aria-label", `${link.textContent}，完成前一关后开放`);
		nodes.appendChild(link);
	}
	document.getElementById("chapterMap").appendChild(section);
});
for (const [trigger, id] of [["howToOpen", "howTo"], ["creditsOpen", "credits"]]) {
	const dialog = document.getElementById(id);
	document.getElementById(trigger).addEventListener("click", () => dialog.showModal());
	dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
	dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
}
