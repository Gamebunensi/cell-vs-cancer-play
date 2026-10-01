/* Presentation and campaign state for the immune campaign. */
(function () {
	// Keep the drawn cells, pointer hit areas and actor baselines on one grid.
	// oCoord is reset by the engine before each chapter initializes.
	ImmuneMod.initGridGeometry = function () {
		const oldC = GetC, oldXBounds = GetX1X2, oldY = GetY, oldYBounds = GetY1Y2;
		const sixRows = oS.R === 6;
		const pitch = sixRows ? 84 : 100, firstY = sixRows ? 165 : 180;
		const firstHitY = sixRows ? 72 : 76;
		GetC = x => x >= 147 && x < 147 + oS.C * 80 ? Math.floor((x - 147) / 80) + 1 : oldC(x);
		GetX1X2 = column => column >= 1 && column <= oS.C ? [147 + (column - 1) * 80, 226 + (column - 1) * 80] : oldXBounds(column);
		GetY = row => row >= 1 && row <= oS.R ? firstY + (row - 1) * pitch : oldY(row);
		GetR = y => y < firstHitY ? 0 : Math.min(oS.R, Math.floor((y - firstHitY) / pitch) + 1);
		GetY1Y2 = row => row >= 1 && row <= oS.R ? [firstHitY + (row - 1) * pitch, firstHitY + row * pitch - 1] : oldYBounds(row);
		ChosePlantY = y => { const row = GetR(y); return [GetY(row), row]; };
	};
	ImmuneMod.gridCell = function (row, column) {
		return { left: GetX(column) - 36, top: GetY(row) - (oS.R === 6 ? 90 : 98), width: 72, height: oS.R === 6 ? 76 : 86 };
	};
	const portraitSources = {
		neutrophil: "neutrophil_alpha", vascular_entry: "vascular_entry_alpha",
		epithelial_barrier: "epithelial_barrier_alpha", apoptosis_tool: "apoptosis_tool_alpha",
		neutrophil_swarm_strike: "neutrophil_swarm_strike_transparent_v2"
	};
	ImmuneMod.rewardPortrait = function (proto) {
		const card = proto.PicArr[proto.CardGif];
		if (!card.includes("/cards/") || !card.endsWith(".png")) return card;
		const name = card.split("/").pop().replace(/(?:@3x)?\.png$/, "");
		return "images/immune_mod/source/" + (portraitSources[name] || name + "_transparent") + ".png";
	};
	// Preserve the native card dimensions, with enough pixels for browser zoom.
	for (const unit of [...ImmuneMod.AlmanacPlants, ...ImmuneMod.AlmanacPathogens, oChemotacticNeutrophilPatrolRoll]) {
		const proto = unit.prototype;
		const card = proto.PicArr[proto.CardGif];
		if (card.endsWith(".png")) {
			proto.PicArr = proto.PicArr.slice();
			proto.PicArr[proto.CardGif] = card.replace(/\.png$/, "@3x.png");
		}
	}
	ImmuneMod.showNewCard = function (ele, plantClass, nextLevel) {
		StopMusic(); PlaySound2("winmusic"); oSym.Clear(); oSym.Stop();
		ClearChild(ele, $("DivA"), $("ImmuneRewardHint"), $("PointerUD"));
		SetHidden(EDAll, $("dTop"), $("dFlagMeter"), $("dMenu"));
		const proto = plantClass.prototype;
		const portrait = $("iNewPlantCard");
		portrait.src = ImmuneMod.rewardPortrait(proto);
		portrait.alt = proto.CName;
		innerText($("dNewPlantTitle"), proto.RewardOnly ? "获得守卫纪念奖章" : "获得新的免疫单位");
		innerText($("dNewPlantName"), proto.CName);
		$("dNewPlantTooltip").innerHTML = proto.Tooltip;
		innerText($("immuneRewardStats"), proto.RewardOnly ? "感染区已清除 · 守卫纪念" : "部署能量 " + proto.SunNum + "  ·  冷却 " + proto.coolTime + " 秒");
		const complete = Number(String(nextLevel).slice(7)) > ImmuneMod.LastImplementedLevel;
		const nextButton = $("btnNextLevel");
		nextButton.value = complete ? ImmuneMod.completionButtonLabel() : "下一关 →";
		nextButton.onclick = function () {
			StopSound2("winmusic"); SetHidden($("bMainMenu"));
			ImmuneMod.loadLevel(complete ? "immune-" + ImmuneMod.LastImplementedLevel : nextLevel);
		};
		SetStyle($("dNewPlant"), { visibility: "visible", zIndex: 255 });
		SetVisible($("bMainMenu"));
	};
	const applyTheme = ImmuneMod.applyBattleTheme;
	ImmuneMod.applyBattleTheme = function () {
		applyTheme();
		document.querySelectorAll(".Menu, #dOptionsMenu .BigLevel, .OptionsMenuButton, #bMainMenu, #bShowHandBook, #dHandBook .close, #dHandBookPZ .dButton div").forEach(button => {
			button.setAttribute("role", "button");
			button.tabIndex = 0;
			button.onkeydown = event => {
				if (event.key === "Enter" || event.key === " ") { event.preventDefault(); button.click(); }
			};
		});
		const level = Number(String(oS.Lvl).replace("immune-", ""));
		if (!oS.ImmuneFinished) ImmuneCampaign.visit(level);
		const progress = ImmuneCampaign.read();
		const unlocked = ImmuneCampaign.unlocked(progress);
		document.querySelectorAll("#dAdvSmallContainer .lvl").forEach((button, index) => {
			button.disabled = index + 1 > unlocked;
			button.classList.toggle("cleared", progress.completed.includes(index + 1));
			button.title = button.disabled ? "通过前一关后开放" : "进入感染区";
		});
		const ground = $("tGround");
		if (ground) ground.style.backgroundSize = "1400px 600px";
		ClearChild($("ImmuneTissueGrid"));
		if (!EDPZ || !oGd.$LF) return;
		const grid = NewEle("ImmuneTissueGrid", "div", "position:absolute;inset:0;pointer-events:none;z-index:0", {}, EDPZ);
		for (let row = 1; row <= oS.R; row++) {
			if (!oGd.$LF[row]) continue;
			for (let column = 1; column <= oS.C; column++) {
				const cell = ImmuneMod.gridCell(row, column);
				NewEle("immune-cell-" + row + "-" + column, "div", `position:absolute;left:${cell.left}px;top:${cell.top}px;width:${cell.width}px;height:${cell.height}px`,
					{ className: "immune-tissue-tile" + (oGd.$LF[row] === 2 ? " fluid" : "") }, grid);
			}
		}
		let highlighted = null;
		const clearHighlight = () => { if (highlighted) highlighted.classList.remove("active"); highlighted = null; };
		EDAll.onpointermove = event => {
			clearHighlight();
			if (oS.Chose <= 0) return;
			const bounds = EDAll.getBoundingClientRect();
			const x = (event.clientX - bounds.left) * 900 / bounds.width;
			const y = (event.clientY - bounds.top) * 600 / bounds.height;
			highlighted = $("immune-cell-" + GetR(y) + "-" + GetC(x));
			if (highlighted) highlighted.classList.add("active");
		};
		EDAll.onpointerleave = EDAll.onpointerup = clearHighlight;
	};
})();
