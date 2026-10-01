/*
 * Immune System vs. Pathogens — non-commercial PvZ fan-mod content layer.
 * Keep this as a classic script: level files expect global constructors.
 */

var ImmuneMod = {
	LastImplementedLevel: 42,
	resolveLevel(level) {
		const value = typeof level === "number" || typeof level === "string" ? String(level) : "0";
		if (/^(?:immune-)?\d+$/.test(value)) {
			const number = Number(value.replace("immune-", ""));
			return "immune-" + (number >= 1 && number <= ImmuneMod.LastImplementedLevel ? number : 1);
		}
		return "immune-1";
	},
	completionButtonLabel() {
		const level = ImmuneMod.LastImplementedLevel;
		return "本阶段已完成 · 重玩 " + Math.ceil(level / 10) + "-" + (level % 10 || 10);
	},
	applyBattleTheme() {
		document.body.classList.add("immune-mod");
		const resourceCounter = $("dSunNum");
		const shovel = $("imgShovel");
		const shovelSlot = $("tdShovel");
		const flagIcon = oS.FlagIcon || "images/immune_mod/enemies/rhinovirus.png";
		if (resourceCounter) {
			resourceCounter.style.backgroundImage = "url(images/immune_mod/ui/resource_counter.svg)";
			resourceCounter.title = "能量";
		}
		if (shovel) {
			shovel.src = "images/immune_mod/ui/apoptosis_tool.svg";
			shovel.alt = "回收";
			shovel.title = "回收已部署单位";
		}
		if (shovelSlot) shovelSlot.title = "回收";
		if ($("dMenu0")) innerText($("dMenu0"), "速度");
		const chapters = ["上呼吸道", "低灌注创面", "血流通道", "淋巴结窦道", "循环液面"];
		const levelPicker = document.querySelector("#dAdvSmallContainer");
		if (levelPicker) {
			levelPicker.querySelector("#dAdvSmallTitle").textContent = "选择免疫主线关卡";
			levelPicker.querySelectorAll(".list").forEach((list, chapter) => {
				list.querySelector(".title").textContent = chapters[chapter];
				list.querySelectorAll(".lvl").forEach((button, index) => {
					button.textContent = (chapter + 1) + "-" + (index + 1);
					button.style.display = chapter * 10 + index < ImmuneMod.LastImplementedLevel ? "" : "none";
				});
			});
		}
		if ($("dMenu1")) innerText($("dMenu1"), "菜单");
		const flagHead = $("imgFlagHead");
		const finalFlag = $("imgFlag1");
		if (flagHead) {
			flagHead.src = flagIcon;
			flagHead.alt = "病原体波次";
		}
		if (finalFlag) {
			finalFlag.src = flagIcon;
			finalFlag.alt = "最终波次";
		}
		const midFlag = $("imgFlag2");
		if (midFlag) {
			midFlag.src = flagIcon;
			midFlag.alt = "病原体波次";
		}
	},

	prepareChooser(startChooser) {
		ImmuneMod.applyBattleTheme();
		const chooserTitle = document.querySelector("#dSelectCard .title");
		if (chooserTitle) chooserTitle.textContent = "选择你的免疫防线";
		if ($("btnReset")) $("btnReset").value = "清空";
		if ($("btnOK")) $("btnOK").value = "开始";
		if ($("bShowHandBook")) innerText($("bShowHandBook"), "免疫图鉴");
		startChooser();
	},

	prepareBattle(callback) {
		const banner = NewEle("ImmuneReadyBanner", "div", 0, { className: "immune-ready-banner", innerText: "免疫！" }, EDAll);
		oSym.addTask(
			55,
			(ele, cb) => {
				if (!ele) return cb();
				ele.innerText = "就位！";
				oSym.addTask(
					45,
					(e, done) => {
						if (!e) return done();
						e.innerText = "防御！";
						e.classList.add("go");
						oSym.addTask(
							75,
							(node, finish) => {
								ClearChild(node);
								finish();
							},
							[e, done]
						);
					},
					[ele, cb]
				);
			},
			[banner, callback]
		);
	},

	startClassicBattle() {
		StopMusic();
		ImmuneMod.applyBattleTheme();
		SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
		oS.InitLawnMower();
		ImmuneMod.prepareBattle(() => {
			oP.Monitor(oS.Monitor, oS.UserDefinedFlagFunc);
			BeginCool();
			if (oS.DKind) AutoProduceSun(25);
			oSym.addTask(
				2400,
				() => {
					oP.AddZombiesFlag();
					SetVisible($("dFlagMeterContent"));
				},
				[]
			);
		});
	},

	showMajorWave() {
		const banner = NewEle(
			"ImmuneMajorWave",
			"div",
			0,
			{ className: "immune-wave-banner", innerHTML: "<strong>大批病原体正在接近！</strong>" },
			EDAll
		);
		oSym.addTask(240, ClearChild, [banner]);
	},

	showCombatHint(anchor, text, tone) {
		if (!anchor || !EDAll) return;
		const hint = NewEle(
			"ImmuneCombatHint" + Math.random(),
			"div",
			"left:" + Math.max(115, Math.min(780, anchor.AttackedLX - 18)) + "px;top:" + Math.max(90, anchor.pixelTop - 22) + "px",
			{ className: "immune-combat-hint " + (tone || ""), innerText: text },
			EDAll
		);
		oSym.addTask(115, ClearChild, [hint]);
	},

	isAntibodyTargetable(target, requireVisible) {
		return (
			target &&
			$Z[target.id] === target &&
			target.PZ &&
			target.HP > 0 &&
			target.beAttacked &&
			target.Altitude === 1 &&
			target.AntibodyTargetable === true &&
			target.AntibodyNeutralized !== true &&
			typeof target.SurfaceEpitopeId === "string" &&
			target.SurfaceEpitopeId.length > 0 &&
			(!requireVisible || (target.AttackedRX >= 90 && target.AttackedLX <= oS.W + 40))
		);
	},

	isMatchingAntibodyTarget(target, epitopeId, requireVisible) {
		return (
			typeof epitopeId === "string" &&
			epitopeId.length > 0 &&
			ImmuneMod.isAntibodyTargetable(target, requireVisible) &&
			target.SurfaceEpitopeId === epitopeId
		);
	},

	hasMismatchedAntibodyTarget(epitopeId) {
		for (const id in $Z) {
			const target = $Z[id];
			if (
				ImmuneMod.isAntibodyTargetable(target, true) &&
				target.SurfaceEpitopeId !== epitopeId
			) {
				return true;
			}
		}
		return false;
	},

	findAntibodyTarget(epitopeId, sourceX, sourceY) {
		let bestTarget = null;
		let bestThreatX = Infinity;
		let bestDistance = Infinity;

		for (const id in $Z) {
			const target = $Z[id];
			if (!ImmuneMod.isMatchingAntibodyTarget(target, epitopeId, true)) continue;

			const center = ImmuneMod.getPathogenCenter(target);
			const distance = (center.x - sourceX) ** 2 + (center.y - sourceY) ** 2;
			if (
				target.AttackedLX < bestThreatX ||
				(target.AttackedLX === bestThreatX && distance < bestDistance)
			) {
				bestTarget = target;
				bestThreatX = target.AttackedLX;
				bestDistance = distance;
			}
		}

		return bestTarget;
	},

	getPathogenCenter(target) {
		const head = target.HeadPosition?.[target.isAttacking] || target.HeadPosition?.[0];
		return head
			? {
					x: target.X + head.x + head.width * 0.5,
					y: target.pixelTop + head.y + head.height * 0.5,
				}
			: {
					x: target.X + target.width * 0.5,
					y: target.pixelTop + target.height * 0.5,
				};
	},

	showAntibodyBinding(target, bindingIndex, markerImage) {
		if (!target?.Ele || !markerImage) return;
		NewImg(
			"ImmuneAntibodyMarker" + target.id + "_" + bindingIndex,
			markerImage,
			"left:" +
				(5 + (bindingIndex - 1) * 23) +
				"px;top:" +
				Math.max(2, target.height - 46 - ((bindingIndex - 1) % 2) * 8) +
				"px;width:30px;height:25px;z-index:" +
				(target.zIndex + 3),
			target.Ele,
			{ className: "immune-antibody-marker" }
		);
	},

	applyAntibodyBinding(target, epitopeId, markerImage) {
		if (!ImmuneMod.isMatchingAntibodyTarget(target, epitopeId, false)) return false;

		const threshold = Math.max(1, target.NeutralizationBindingThreshold || 1);
		const bindingIndex = Math.min(threshold, (target.AntibodyBindingCount || 0) + 1);
		target.AntibodyBindingCount = bindingIndex;
		target.AntibodyBoundByEpitope = epitopeId;
		ImmuneMod.showAntibodyBinding(target, bindingIndex, markerImage);
		target.EleBody?.classList.add("immune-antibody-match");
		oSym.addTask(
			35,
			(id) => {
				const liveTarget = $Z[id];
				liveTarget?.EleBody?.classList.remove("immune-antibody-match");
			},
			[target.id]
		);

		if (!target.AntibodyMatchHintShown) {
			target.AntibodyMatchHintShown = 1;
			ImmuneMod.showCombatHint(target, "匹配结合", "ready");
		}

		if (target.AntibodyEffect === "neutralize" && bindingIndex >= threshold) {
			target.AntibodyTargetable = false;
			target.AntibodyNeutralized = true;
			target.beAttacked = 0;
			target.Speed = 0;
			target.EleBody?.classList.add("immune-antibody-neutralized");
			ImmuneMod.showCombatHint(target, "中和", "ready");
			oSym.addTask(
				60,
				(id) => {
					const neutralizedTarget = $Z[id];
					if (neutralizedTarget?.AntibodyNeutralized) neutralizedTarget.DisappearDie();
				},
				[target.id]
			);
			return "neutralized";
		}

		return "bound";
	},

	applyMucus(target, duration) {
		if (!target || !$Z[target.id] || target.MucusAffectable !== true) return false;

		const until = Math.max(target.MucusCoatedUntil || 0, oSym.Now + duration);
		const slowFactor = target.MucusSlowFactor || 0.5;
		target.MucusCoated = true;
		target.MucusCoatedUntil = until;

		if (!(target.FreeFreezeTime || target.FreeSetbodyTime)) {
			target.Speed = target.OSpeed * slowFactor;
		}
		target.EleBody?.classList.add("immune-mucus-coated");

		if (!target.MucusHintShown) {
			target.MucusHintShown = 1;
			ImmuneMod.showCombatHint(
				target,
				target.MucusHintText || "黏液捕获",
				slowFactor > 0.5 ? "resistant" : "mucus"
			);
		}

		oSym.addTask(
			until - oSym.Now,
			(id, expectedUntil) => {
				const liveTarget = $Z[id];
				if (!liveTarget || liveTarget.MucusCoatedUntil !== expectedUntil) return;
				liveTarget.MucusCoated = false;
				liveTarget.MucusCoatedUntil = 0;
				liveTarget.EleBody?.classList.remove("immune-mucus-coated");
				if (!(liveTarget.FreeFreezeTime || liveTarget.FreeSetbodyTime) && liveTarget.Speed) {
					liveTarget.Speed = liveTarget.FreeSlowTime ? liveTarget.OSpeed * 0.5 : liveTarget.OSpeed;
				}
			},
			[target.id, until]
		);

		return true;
	},

	recomputePathogenSpeed(target) {
		if (!target || !$Z[target.id]) return false;
		if (
			target.FreeFreezeTime ||
			target.FreeSetbodyTime ||
			target.AntibodyNeutralized
		) {
			target.Speed = 0;
			return false;
		}

		let speedFactor = target.FreeSlowTime ? 0.5 : 1;
		if (target.MucusCoated && target.MucusCoatedUntil > oSym.Now) {
			speedFactor = Math.min(speedFactor, target.MucusSlowFactor || 0.5);
		}
		target.Speed = target.OSpeed * speedFactor;
		return true;
	},

	isGranuleTarget(target) {
		return (
			target &&
			(target.PathogenClass === "pathogen.bacteria" ||
				target.PathogenClass === "pathogen.fungus")
		);
	},

	catalyzeAntimicrobialParticle(state, bullet, x, row) {
		if (!state?.enabled || state.oxidized) return false;
		const torchSites = typeof oGd === "undefined" ? null : oGd.$Torch;
		if (!torchSites || !torchSites[row + "_" + GetC(x)]) return false;

		state.oxidized = true;
		state.damage = state.oxidativeDamage;
		if (bullet && state.oxidativeImage) bullet.src = state.oxidativeImage;
		return true;
	},

	applyAntimicrobialDamage(target, damage, direction, preferDiffuse) {
		if (!target || !ImmuneMod.isGranuleTarget(target)) return false;
		if (preferDiffuse && typeof target.getDiffuseHit === "function") {
			target.getDiffuseHit(target, damage, direction);
		} else if (typeof target.getGranuleHit === "function") {
			target.getGranuleHit(target, damage, direction);
		} else {
			target.getPea(target, damage, direction);
		}
		return true;
	},

	applyOxidativeSplash(primaryTarget, damage, width) {
		if (!primaryTarget || !damage || !width) return;
		const nearbyTargets = oZ.getArZ(
			primaryTarget.AttackedLX,
			primaryTarget.AttackedLX + width,
			primaryTarget.R
		);
		for (const target of nearbyTargets) {
			if (
				target === primaryTarget ||
				!target.beAttacked ||
				target.Altitude !== 1 ||
				!ImmuneMod.isGranuleTarget(target)
			) {
				continue;
			}
			ImmuneMod.applyAntimicrobialDamage(target, damage, 0, false);
		}
	},

	showCiliaryWave(cell) {
		if (!cell || !EDPZ) return;
		const wave = NewEle(
			"ImmuneCiliaryWave" + Math.random(),
			"div",
			"left:" + (cell.AttackedRX - 8) + "px;top:" + (cell.pixelTop + 18) + "px;z-index:" + (cell.zIndex + 4),
			{ className: "immune-ciliary-wave" },
			EDPZ
		);
		oSym.addTask(100, ClearChild, [wave]);
	},

	transportMucusTarget(target, baseDistance, lockDuration) {
		if (
			!target ||
			!$Z[target.id] ||
			!target.PZ ||
			!target.HP ||
			!target.beAttacked ||
			target.Altitude !== 1 ||
			target.WalkDirection !== 0 ||
			target.isAttacking ||
			target.FreeSetbodyTime ||
			target.FreeFreezeTime ||
			target.MucociliaryTransportable !== true ||
			target.MucusCoated !== true ||
			target.MucusCoatedUntil <= oSym.Now ||
			(target.MucociliaryPushUntil || 0) > oSym.Now
		) {
			return false;
		}

		const factor = Math.max(0, Math.min(1, target.MucociliaryTransportFactor ?? 1));
		const distance = Math.round(baseDistance * factor);
		if (!distance) return false;

		target.MucociliaryPushUntil = oSym.Now + lockDuration;
		if (target.AttackedLX + distance >= oS.W - 8) {
			target.DisappearDie();
			return "cleared";
		}

		target.X += distance;
		target.AttackedLX += distance;
		target.AttackedRX += distance;
		target.ZX = target.AttackedLX;
		if (target.Ele) target.Ele.style.left = Math.round(target.X) + "px";
		target.EleBody?.classList.add("immune-cilia-pushed");
		oSym.addTask(
			48,
			(id) => {
				const liveTarget = $Z[id];
				liveTarget?.EleBody?.classList.remove("immune-cilia-pushed");
			},
			[target.id]
		);
		return "moved";
	},

	showVictory(options) {
		const config = options || {};
		const nextButton = config.nextLevel
			? '<button type="button" onclick="ImmuneMod.loadLevel(\'' +
				config.nextLevel +
				"')\">" +
				(config.nextLabel || "进入下一关") +
				"</button>"
			: '<button type="button" onclick="ImmuneMod.restart()">再次挑战</button>';
		NewEle(
			"ImmuneVictory",
			"div",
			0,
			{
				className: "immune-result-overlay",
				innerHTML:
					'<div class="immune-result-card"><div class="immune-result-icon">✓</div><h2>防线守住了！</h2><p>' +
					(config.summary || "上呼吸道恢复平静") +
					"</p>" +
					nextButton +
					"</div>",
			},
			EDAll
		);
	},

	showDefeat() {
		NewEle(
			"ImmuneDefeat",
			"div",
			0,
			{
				className: "immune-result-overlay defeat",
				innerHTML:
					'<div class="immune-result-card"><div class="immune-result-icon">!</div><h2>病原体突破防线</h2><p>调整卡牌位置，再试一次</p><button type="button" onclick="ImmuneMod.restart()">重新开始</button></div>',
			},
			EDAll
		);
	},

	restart() {
		ImmuneMod.loadLevel(oS.Lvl || "immune-1");
	},

	loadLevel(levelId) {
		if (/^immune-\d+$/.test(levelId) && Number(levelId.slice(7)) > ImmuneMod.LastImplementedLevel) {
			const nextButton = $("btnNextLevel");
			if (nextButton) {
				nextButton.value = ImmuneMod.completionButtonLabel();
				nextButton.onclick = () => ImmuneMod.loadLevel("immune-" + ImmuneMod.LastImplementedLevel);
			}
			return false;
		}
		document.getElementById("ImmuneVictory")?.remove();
		document.getElementById("ImmuneDefeat")?.remove();
		const url = new URL(window.location.href);
		url.searchParams.set("level", levelId);
		window.history.replaceState({}, "", url);
		SelectModal(levelId);
	},
};

var ImmunePlantBase = {
	BookHandBack: "Day",
	CanSelect: 1,
	AudioArr: [],
	GetDX() {
		return -Math.floor(this.width * 0.5);
	},
	BirthStyle(self, id, wrapper, style) {
		const image = wrapper.childNodes[1];
		if (image) {
			image.style.width = self.width + "px";
			image.style.height = self.height + "px";
			image.style.objectFit = "contain";
		}
		EditEle(wrapper, { id: id }, style, EDPZ);
	},
};

var oVascularEntry = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oVascularEntry",
	CName: "供能微血管",
	width: 86,
	height: 92,
	beAttackedPointL: 12,
	beAttackedPointR: 74,
	SunNum: 50,
	coolTime: 7.5,
	HP: 300,
	PicArr: [
		"images/immune_mod/cards/vascular_entry.png",
		"images/immune_mod/units/vascular_entry.png",
		"images/immune_mod/units/vascular_entry.png",
	],
	Tooltip: "周期产生能量。需要前排保护。",
	Produce: '<font color="#28325A">输送氧气和葡萄糖，周期产生可收集的能量泡。</font><p>产能：<font color="#CC7A2D">每次 25</font></p>',
	InitTrigger() {},
	PrivateBirth(self) {
		oSym.addTask(
			800,
			function produceEnergy(id, x, y) {
				const producer = $P[id];
				if (!producer) return;
				producer.plantImage && producer.plantImage.classList.add("immune-producer-pulse");
				oSym.addTask(
					80,
					(plantId, posX, posY, callback) => {
						const liveProducer = $P[plantId];
						if (!liveProducer) return;
						AppearSun(posX, posY, 25, 0);
						liveProducer.plantImage && liveProducer.plantImage.classList.remove("immune-producer-pulse");
						oSym.addTask(2200, callback, [plantId, posX, posY]);
					},
					[id, x, y, produceEnergy]
				);
			},
			[self.id, GetX(self.C) - 38, GetY(self.R)]
		);
	},
});

var oNeutrophil = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oNeutrophil",
	CName: "中性粒细胞",
	width: 82,
	height: 84,
	beAttackedPointL: 8,
	beAttackedPointR: 72,
	SunNum: 100,
	coolTime: 7.5,
	HP: 300,
	Damage: 20,
	CanOxidativelyCatalyze: true,
	OxidativeDamage: 40,
	OxidativeSplashDamage: 13,
	OxidativeSplashWidth: 40,
	OxidativeFlightImage: "images/immune_mod/ui/oxidative_droplet.svg",
	OxidativeHitImage: "images/immune_mod/ui/oxidative_droplet_hit.svg",
	PicArr: [
		"images/immune_mod/cards/neutrophil.png",
		"images/immune_mod/units/neutrophil.png",
		"images/immune_mod/units/neutrophil.png",
		"images/immune_mod/ui/antimicrobial_droplet.svg",
		"images/immune_mod/ui/antimicrobial_droplet_hit.svg",
	],
	Tooltip: "向本路前方发射抗菌颗粒。",
	Produce: '<font color="#28325A">快速赶到感染现场的防御者。</font><p>攻击：<font color="#CC241D">同路抗菌颗粒</font></p>',
	PrivateBirth(self) {
		self.BulletEle = NewImg(
			0,
			self.PicArr[3],
			"left:" + (self.AttackedLX + 24) + "px;top:" + (self.pixelTop + 27) + "px;visibility:hidden;z-index:" + (self.zIndex + 2)
		);
	},
	PrivateDie(self) {
		self.BulletEle = null;
	},
	AttackCheck2(pathogen) {
		return pathogen.Altitude > 0 && ImmuneMod.isGranuleTarget(pathogen);
	},
	NormalAttack() {
		const attacker = this;
		const bulletId = "ImmuneGranule" + Math.random();
		const particleState = {
			enabled: attacker.CanOxidativelyCatalyze === true,
			oxidized: false,
			damage: attacker.Damage,
			oxidativeDamage: attacker.OxidativeDamage,
			splashDamage: attacker.OxidativeSplashDamage,
			splashWidth: attacker.OxidativeSplashWidth,
			oxidativeImage: attacker.OxidativeFlightImage,
			oxidativeHitImage: attacker.OxidativeHitImage,
		};
		EditEle(attacker.BulletEle.cloneNode(false), { id: bulletId }, 0, EDPZ);
		oSym.addTask(8, (id) => $(id) && SetVisible($(id)), [bulletId]);
		oSym.addTask(
			1,
			function moveGranule(id, x, row, cssLeft, state, normalHitImage) {
				const bullet = $(id);
				if (!bullet) return;
				ImmuneMod.catalyzeAntimicrobialParticle(state, bullet, x, row);
				const target = oZ.getZ0(x, row);
				if (target && target.Altitude === 1) {
					if (!ImmuneMod.isGranuleTarget(target)) {
						x += 5;
						cssLeft += 5;
						bullet.style.left = cssLeft + "px";
						oSym.addTask(1, moveGranule, [id, x, row, cssLeft, state, normalHitImage]);
						return;
					}
					ImmuneMod.applyAntimicrobialDamage(target, state.damage, 0, false);
					if (state.oxidized) {
						ImmuneMod.applyOxidativeSplash(target, state.splashDamage, state.splashWidth);
					}
					bullet.src = state.oxidized ? state.oxidativeHitImage : normalHitImage;
					bullet.style.left = cssLeft + 18 + "px";
					oSym.addTask(16, ClearChild, [bullet]);
					return;
				}
				x += 5;
				cssLeft += 5;
				if (x < oS.W) {
					bullet.style.left = cssLeft + "px";
					oSym.addTask(1, moveGranule, [id, x, row, cssLeft, state, normalHitImage]);
				} else {
					ClearChild(bullet);
				}
			},
			[
				bulletId,
				attacker.AttackedRX,
				attacker.R,
				attacker.AttackedLX + 24,
				particleState,
				attacker.PicArr[4],
			]
		);
	},
});

var oActivatedNeutrophil = InheritO(oNeutrophil, {
	EName: "oActivatedNeutrophil",
	CName: "脱颗粒中性粒细胞",
	width: 96,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 88,
	SunNum: 200,
	PicArr: [
		"images/immune_mod/cards/activated_neutrophil.png",
		"images/immune_mod/units/activated_neutrophil.png",
		"images/immune_mod/units/activated_neutrophil.png",
		"images/immune_mod/ui/granule.svg",
		"images/immune_mod/ui/granule_hit.svg",
	],
	Tooltip: "每轮连续释放两束抗菌颗粒。",
	Produce:
		'<font color="#28325A">被充分激活后，中性粒细胞会集中释放更多抗菌颗粒。</font><p>攻击：<font color="#CC241D">每轮连续两次</font></p>',
	NormalAttack1: oNeutrophil.prototype.NormalAttack,
	NormalAttack() {
		this.NormalAttack1();
		oSym.addTask(
			15,
			(id) => {
				const cell = $P[id];
				cell && cell.NormalAttack1();
			},
			[this.id]
		);
	},
});

var oDefensinEpithelium = InheritO(oNeutrophil, {
	EName: "oDefensinEpithelium",
	CName: "防御素上皮",
	width: 92,
	height: 90,
	beAttackedPointL: 6,
	beAttackedPointR: 86,
	SunNum: 0,
	coolTime: 7.5,
	Stature: -1,
	HP: 300,
	Damage: 20,
	CanOxidativelyCatalyze: false,
	PicArr: [
		"images/immune_mod/cards/defensin_epithelium.png",
		"images/immune_mod/units/defensin_epithelium.png",
		"images/immune_mod/units/defensin_epithelium.png",
		"images/immune_mod/ui/granule.svg",
		"images/immune_mod/ui/granule_hit.svg",
	],
	Tooltip: "零消耗，在较短距离内释放抗菌肽。",
	Produce:
		'<font color="#28325A">上皮细胞在表面释放防御素等抗菌肽，形成近距离化学防线。</font><p>消耗：<font color="#167C91">0</font><br>范围：<font color="#CC7A2D">短</font></p>',
	getTriggerRange(row, left, right) {
		return [[left, Math.min(right + 250, oS.W), 0]];
	},
});

var oComplementBurst = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oComplementBurst",
	CName: "补体级联",
	width: 112,
	height: 96,
	beAttackedPointL: 10,
	beAttackedPointR: 102,
	SunNum: 150,
	coolTime: 20,
	HP: 300,
	PicArr: [
		"images/immune_mod/cards/complement_burst.png",
		"images/immune_mod/units/complement_burst.png",
		"images/immune_mod/units/complement_burst.png",
	],
	Tooltip: "单次使用，迅速清除周围三行的一片细菌。",
	Produce:
		'<font color="#28325A">大量补体蛋白在局部接连启动，把附近细菌迅速标记并清除。</font><p>范围：<font color="#CC241D">周围三行</font><br>使用：<font color="#CC241D">一次性</font></p>',
	InitTrigger() {},
	getHurt() {},
	PrivateBirth(self) {
		oSym.addTask(
			40,
			(id) => {
				const burst = $P[id];
				if (!burst) return;

				let row = burst.R > 2 ? burst.R - 1 : 1;
				const endRow = burst.R < oS.R ? burst.R + 1 : oS.R;
				const left = burst.pixelLeft - 80;
				const right = burst.pixelLeft + 160;

				do {
					const targets = oZ.getArZ(left, right, row);
					for (const target of targets) {
						if (
							target.PathogenClass === "pathogen.bacteria" &&
							target.beAttacked &&
							target.Altitude < 2
						) {
							target.getExplosion();
						}
					}
				} while (row++ < endRow);

				const wrapper = $(id);
				const image = wrapper?.childNodes[1];
				burst.Die(1);
				image?.classList.add("immune-complement-burst");
				oSym.addTask(90, ClearChild, [wrapper]);
			},
			[self.id]
		);
	},
});

var oNETTrap = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oNETTrap",
	CName: "胞外诱捕网",
	width: 96,
	height: 76,
	beAttackedPointL: 10,
	beAttackedPointR: 86,
	SunNum: 25,
	coolTime: 30,
	Stature: -1,
	HP: 1e3,
	Status: 0,
	canTrigger: 0,
	PicArr: [
		"images/immune_mod/cards/net_trap.png",
		"images/immune_mod/units/net_trap.png",
		"images/immune_mod/units/net_trap.png",
	],
	Tooltip: "部署后需要时间铺开；成熟时会困住并清除第一个接触它的细菌或菌丝。",
	Produce:
		'<font color="#28325A">中性粒细胞释放 DNA 网和抗菌颗粒，先铺开，再拦住靠近的细菌或大型菌丝。</font><p>使用：<font color="#CC241D">一次性，延迟启动</font></p>',
	CanGrow(cell, row, column) {
		const key = row + "_" + column;
		const placement = oS.ArP;
		return placement
			? oGd.$LF[row] === 1
				? column > 0 &&
					column < placement.ArC[1] &&
					!(oGd.$Crater[key] || oGd.$Tombstones[key] || cell[1])
				: cell[0] && !cell[1]
			: oGd.$LF[row] === 1
				? !(column < 1 || column > 9 || oGd.$Crater[key] || oGd.$Tombstones[key] || cell[1])
				: cell[0] && !cell[1];
	},
	BirthStyle(self, id, wrapper, style, armed) {
		ImmunePlantBase.BirthStyle(self, id, wrapper, style);
		const image = wrapper.childNodes[1];
		if (armed) {
			self.Status = 1;
			self.canTrigger = 1;
			self.getHurt = self.getHurt2;
			image?.classList.add("immune-net-armed");
		} else {
			image?.classList.add("immune-net-unarmed");
		}
	},
	getHurt2(source, attackKind, damage) {
		attackKind > 2
			? (this.HP -= damage) < 1 && this.Die()
			: this.NormalAttack(this.pixelLeft, this.pixelRight, this.R);
	},
	PrivateBirth(self, armed) {
		if (armed) return;
		oSym.addTask(
			1500,
			(id) => {
				const trap = $P[id];
				if (!trap) return;
				trap.Status = 1;
				trap.canTrigger = 1;
				trap.getHurt = trap.getHurt2;
				trap.plantImage?.classList.remove("immune-net-unarmed");
				trap.plantImage?.classList.add("immune-net-armed");
			},
			[self.id]
		);
	},
	getTriggerRange(row, left, right) {
		return [[left, right, 0]];
	},
	TriggerCheck(pathogen) {
		if (
			pathogen.beAttacked &&
			pathogen.Altitude < 2 &&
			ImmuneMod.isGranuleTarget(pathogen) &&
			!oGd.$[this.R + "_" + this.C + "_2"]
		) {
			this.NormalAttack(this.pixelLeft, this.pixelRight, this.R);
		}
	},
	NormalAttack(left, right, row) {
		const trap = this;
		const wrapper = $(trap.id);
		const targets = oZ.getArZ(left, right, row);
		for (const target of targets) {
			if (ImmuneMod.isGranuleTarget(target) && target.Altitude < 2) {
				target.getThump();
			}
		}
		trap.Die(1);
		wrapper?.childNodes[1]?.classList.add("immune-net-triggered");
		oSym.addTask(160, ClearChild, [wrapper]);
	},
});

var oApoptosisTool = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oApoptosisTool",
	CName: "凋亡回收工具",
	width: 71,
	height: 70,
	beAttackedPointL: 0,
	beAttackedPointR: 71,
	SunNum: 0,
	coolTime: 0,
	PicArr: [
		"images/immune_mod/cards/apoptosis_tool.png",
		"images/immune_mod/ui/apoptosis_tool.svg",
		"images/immune_mod/ui/apoptosis_tool.svg",
	],
	Tooltip: "回收已经部署的单位，腾出格子重新布置防线。",
	Produce:
		'<font color="#28325A">选择工具后点击已部署单位，即可让它退出防线并释放格子。</font>',
	InitTrigger() {},
});

var oCapillarySprout = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oCapillarySprout",
	CName: "新生毛细血管芽",
	width: 78,
	height: 82,
	beAttackedPointL: 10,
	beAttackedPointR: 68,
	SunNum: 25,
	coolTime: 7.5,
	HP: 300,
	Stature: -1,
	Status: 0,
	InitialYield: 15,
	MatureYield: 25,
	FirstProduceTime: 600,
	ProduceInterval: 2400,
	MatureTime: 12000,
	PicArr: [
		"images/immune_mod/cards/capillary_sprout.png",
		"images/immune_mod/units/capillary_sprout.png",
		"images/immune_mod/units/capillary_sprout.png",
	],
	Tooltip: "早期供能较少，成熟后每次输送完整能量。",
	Produce:
		'<font color="#28325A">新生毛细血管逐步成熟，把氧和葡萄糖输送到创面。</font><p>产能：<font color="#167C91">15，成熟后 25</font></p>',
	InitTrigger() {},
	PrivateBirth(self) {
		self.Status = 0;
		oSym.addTask(
			self.FirstProduceTime,
			(id, x, y) => {
				const sprout = $P[id];
				sprout && sprout.ProduceSun(sprout, x, y);
			},
			[self.id, GetX(self.C) - 40, GetY(self.R)]
		);
		oSym.addTask(
			self.MatureTime,
			(id) => {
				const sprout = $P[id];
				if (!sprout) return;
				sprout.Status = 1;
				sprout.plantImage?.classList.add("immune-capillary-mature");
			},
			[self.id]
		);
	},
	ProduceSun(self, x, y) {
		self.plantImage?.classList.add("immune-producer-pulse");
		AppearSun(
			Math.floor(x + Math.random() * 41),
			y,
			self.Status ? self.MatureYield : self.InitialYield,
			0
		);
		oSym.addTask(
			50,
			(id) => {
				$P[id]?.plantImage?.classList.remove("immune-producer-pulse");
			},
			[self.id]
		);
		oSym.addTask(
			self.ProduceInterval,
			(id, posX, posY) => {
				const sprout = $P[id];
				sprout && sprout.ProduceSun(sprout, posX, posY);
			},
			[self.id, x, y]
		);
	},
	ProduceEnergy(self, x, y) {
		self.ProduceSun(self, x, y);
	},
});

var oHypochlorousDressing = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oHypochlorousDressing",
	CName: "次氯酸缓释敷料",
	width: 96,
	height: 82,
	beAttackedPointL: 8,
	beAttackedPointR: 88,
	SunNum: 75,
	coolTime: 7.5,
	HP: 300,
	Damage: 20,
	AttackRange: 330,
	AttackInterval: 140,
	PicArr: [
		"images/immune_mod/cards/hypochlorous_dressing.png",
		"images/immune_mod/units/hypochlorous_dressing.png",
		"images/immune_mod/units/hypochlorous_dressing.png",
	],
	Tooltip: "向同路释放短程扩散波，只损伤细菌和真菌。",
	Produce:
		'<font color="#28325A">缓慢释放次氯酸，形成局部抗菌扩散区。</font><p>范围：<font color="#167C91">同路 330 像素</font><br>目标：<font color="#CC241D">细菌、真菌</font></p>',
	getTriggerRange(row, left, right) {
		return [[left, Math.min(right + this.AttackRange, oS.W), 0]];
	},
	AttackCheck2(pathogen) {
		return (
			pathogen.PZ &&
			pathogen.beAttacked &&
			pathogen.Altitude < 2 &&
			(pathogen.PathogenClass === "pathogen.bacteria" ||
				pathogen.PathogenClass === "pathogen.fungus")
		);
	},
	CheckLoop(pathogenId, triggerIndex) {
		const plantId = this.id;
		this.NormalAttack(pathogenId);
		oSym.addTask(
			this.AttackInterval,
			(id, targetId, index) => {
				const dressing = $P[id];
				dressing && dressing.AttackCheck1(targetId, index);
			},
			[plantId, pathogenId, triggerIndex]
		);
	},
	NormalAttack() {
		const targets = oZ.getArZ(
			this.AttackedLX,
			Math.min(this.AttackedRX + this.AttackRange, oS.W),
			this.R
		);
		for (const target of targets) {
			if (
				this.AttackCheck2(target) &&
				typeof target.getDiffuseHit === "function"
			) {
				target.getDiffuseHit(target, this.Damage, 0);
			}
		}
		this.plantImage?.classList.add("immune-diffuse-pulse");
		oSym.addTask(
			55,
			(id) => {
				$P[id]?.plantImage?.classList.remove("immune-diffuse-pulse");
			},
			[this.id]
		);
	},
});

var oEnzymaticDebridement = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oEnzymaticDebridement",
	CName: "酶性清创敷料",
	width: 99,
	height: 106,
	beAttackedPointL: 12,
	beAttackedPointR: 82,
	SunNum: 75,
	coolTime: 7.5,
	HP: 300,
	canEat: 0,
	DebridementTime: 420,
	StaticRefund: 25,
	PicArr: [
		"images/immune_mod/cards/enzymatic_debridement.png",
		"images/immune_mod/units/enzymatic_debridement.png",
		"images/immune_mod/units/enzymatic_debridement.png",
	],
	Tooltip: "只能覆盖坏死组织格，完成清创后移除阻挡。",
	Produce:
		'<font color="#28325A">蛋白水解酶逐步清除坏死组织。</font><p>使用：<font color="#CC241D">一次性，只能放在坏死组织上</font></p>',
	CanGrow(cell, row, column) {
		const lane = oS.ArP;
		return lane
			? column > 0 &&
					column < lane.ArC[1] &&
					row + "_" + column in oGd.$Tombstones &&
					!cell[1]
			: row + "_" + column in oGd.$Tombstones && !cell[1];
	},
	GetDY() {
		return -30;
	},
	InitTrigger() {},
	PrivateBirth(self) {
		oSym.addTask(
			self.DebridementTime,
			(id) => {
				const dressing = $P[id];
				if (!dressing) return;
				const row = dressing.R;
				const column = dressing.C;
				const key = row + "_" + column;
				delete oGd.$Tombstones[key];
				dressing.Die();
				ClearChild($("dTombstones" + key));
				if (oS.StaticCard) {
					AppearSun(
						Math.floor(GetX(column) + Math.random() * 41),
						GetY(row),
						dressing.StaticRefund,
						0
					);
				}
			},
			[self.id]
		);
	},
});

var oLyticPhageTherapy = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oLyticPhageTherapy",
	CName: "裂解性噬菌体制剂",
	width: 76,
	height: 82,
	beAttackedPointL: 8,
	beAttackedPointR: 68,
	SunNum: 75,
	coolTime: 30,
	HP: 0,
	PhageHostId: "pseudomonas.aeruginosa",
	PicArr: [
		"images/immune_mod/cards/lytic_phage_therapy.png",
		"images/immune_mod/units/lytic_phage_therapy.png",
		"images/immune_mod/units/lytic_phage_therapy.png",
	],
	Tooltip: "只有宿主谱严格匹配的易感菌会被噬菌体转化。",
	Produce:
		'<font color="#28325A">裂解性噬菌体必须识别匹配的细菌宿主。</font><p>宿主：<font color="#167C91">铜绿假单胞菌</font><br>其他目标：<font color="#CC241D">不发生转化</font></p>',
	InitTrigger() {},
	getHurt(attacker, attackKind, damage) {
		switch (attackKind) {
			case 3:
				(this.HP -= damage) < 1 && this.Die();
				break;
			case 0: {
				const compatible =
					attacker &&
					attacker.PhageSusceptible === true &&
					typeof attacker.PhageHostId === "string" &&
					attacker.PhageHostId === this.PhageHostId;
				let converted = false;
				if (compatible && typeof attacker.becomePhageCarrier === "function") {
					converted =
						attacker.becomePhageCarrier(attacker, this.PhageHostId) !== false;
				} else if (compatible && typeof attacker.becomeFriendly === "function") {
					converted = attacker.becomeFriendly(attacker, this.PhageHostId) !== false;
				}
				if (converted) {
					attacker.EleBody?.classList.add("immune-phage-carrier");
					ImmuneMod.showCombatHint(attacker, "宿主匹配：噬菌体裂解", "ready");
				}
				this.Die();
				break;
			}
			default:
				this.Die(1);
		}
	},
});

var oSkinDendriticSentinel = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oSkinDendriticSentinel",
	CName: "皮肤树突状哨兵",
	width: 78,
	height: 92,
	beAttackedPointL: 10,
	beAttackedPointR: 68,
	SunNum: 25,
	coolTime: 7.5,
	HP: 300,
	Damage: 20,
	AttackInterval: 140,
	ProjectileStep: 5,
	ThreatRadius: 121,
	ThreatRowRadius: 1,
	SampleAlertDuration: 600,
	ThreatIds: [],
	Retreating: 0,
	Attacking: 0,
	PicArr: [
		"images/immune_mod/cards/skin_dendritic_sentinel.png",
		"images/immune_mod/units/skin_dendritic_sentinel.png",
		"images/immune_mod/units/skin_dendritic_sentinel.png",
		"images/immune_mod/ui/antigen_signal.svg",
	],
	Tooltip: "向本路发送采样报警信号；病原体逼近时回缩并停止采样。",
	Produce:
		'<font color="#28325A">树突状细胞伸出突起采集抗原，并把危险信号传回免疫防线。</font><p>采样标记联动清除：<font color="#CC241D">20</font><br>特点：<font color="#167C91">近敌回缩，信号不是抗菌颗粒</font></p>',
	getTriggerRange(row, left) {
		return [[left, oS.W, 0]];
	},
	getTriggerR(row) {
		return [
			Math.max(1, row - this.ThreatRowRadius),
			Math.min(oS.R, row + this.ThreatRowRadius),
		];
	},
	PrivateBirth(self) {
		self.ThreatIds = [];
		self.Retreating = 0;
		self.Attacking = 0;
		self.SentinelCenterX = self.AttackedLX + 9;
		self.BulletEle = NewImg(
			0,
			self.PicArr[3],
			"left:" +
				(self.AttackedLX - 28) +
				"px;top:" +
				(self.pixelTop + 34) +
				"px;visibility:hidden;z-index:" +
				(self.zIndex + 2)
		);
	},
	PrivateDie(self) {
		self.BulletEle = null;
		self.ThreatIds.length = 0;
	},
	IsNearbyThreat(pathogen) {
		return (
			pathogen &&
			pathogen.PZ &&
			pathogen.beAttacked &&
			Math.abs(pathogen.R - this.R) <= this.ThreatRowRadius &&
			Math.abs(pathogen.ZX - this.SentinelCenterX) < this.ThreatRadius
		);
	},
	TriggerCheck(pathogen) {
		if (!pathogen || !pathogen.PZ || !pathogen.beAttacked) return;
		if (this.IsNearbyThreat(pathogen)) {
			if (!this.ThreatIds.includes(pathogen.id)) {
				this.ThreatIds.push(pathogen.id);
			}
			if (!this.Retreating) {
				this.Retreating = 1;
				this.plantImage?.classList.add("immune-sentinel-retracted");
				this.ThreatCheck(this.id);
			}
			return;
		}
		if (
			pathogen.R === this.R &&
			!this.Retreating &&
			!this.Attacking &&
			pathogen.Altitude > 0 &&
			pathogen.Altitude < 3
		) {
			this.NormalAttack();
		}
	},
	ThreatCheck(id) {
		oSym.addTask(
			this.AttackInterval,
			(plantId) => {
				const sentinel = $P[plantId];
				if (!sentinel) return;
				for (let index = sentinel.ThreatIds.length - 1; index >= 0; index--) {
					const pathogen = $Z[sentinel.ThreatIds[index]];
					if (!sentinel.IsNearbyThreat(pathogen)) {
						sentinel.ThreatIds.splice(index, 1);
					}
				}
				if (sentinel.ThreatIds.length) {
					sentinel.ThreatCheck(plantId);
				} else {
					sentinel.Retreating = 0;
					sentinel.plantImage?.classList.remove("immune-sentinel-retracted");
				}
			},
			[id]
		);
	},
	ApplySamplingAlert(target) {
		if (!target || !$Z[target.id]) return false;
		target.SampleAlertUntil = Math.max(
			target.SampleAlertUntil || 0,
			oSym.Now + this.SampleAlertDuration
		);
		target.SampledByDendriticSentinel = true;
		if (typeof target.getSamplingHit === "function") {
			target.getSamplingHit(target, this.Damage, 0);
		} else if (typeof target.getHit0 === "function") {
			target.getHit0(target, this.Damage, 0);
		}
		target.EleBody?.classList.add("immune-sampling-alert");
		const expectedUntil = target.SampleAlertUntil;
		oSym.addTask(
			expectedUntil - oSym.Now,
			(id, expected) => {
				const liveTarget = $Z[id];
				if (!liveTarget || liveTarget.SampleAlertUntil !== expected) return;
				liveTarget.SampleAlertUntil = 0;
				liveTarget.SampledByDendriticSentinel = false;
				liveTarget.EleBody?.classList.remove("immune-sampling-alert");
			},
			[target.id, expectedUntil]
		);
		return true;
	},
	NormalAttack() {
		const sentinel = this;
		const signalId = "DendriticSample" + Math.random();
		EditEle(sentinel.BulletEle.cloneNode(false), { id: signalId }, 0, EDPZ);
		oSym.addTask(10, (id) => $(id) && SetVisible($(id)), [signalId]);
		oSym.addTask(
			1,
			function moveSamplingSignal(id, x, row, cssLeft, step, plantId) {
				const signal = $(id);
				const liveSentinel = $P[plantId];
				if (!signal || !liveSentinel) {
					ClearChild(signal);
					return;
				}
				const target = oZ.getZ0(x, row);
				if (target && target.PZ && target.Altitude === 1) {
					liveSentinel.ApplySamplingAlert(target);
					oSym.addTask(10, ClearChild, [signal]);
					return;
				}
				x += step;
				cssLeft += step;
				if (x < oS.W) {
					signal.style.left = cssLeft + "px";
					oSym.addTask(1, moveSamplingSignal, [id, x, row, cssLeft, step, plantId]);
				} else {
					ClearChild(signal);
				}
			},
			[
				signalId,
				sentinel.AttackedLX,
				sentinel.R,
				sentinel.AttackedLX - 28,
				sentinel.ProjectileStep,
				sentinel.id,
			]
		);
		sentinel.Attacking = 1;
		oSym.addTask(
			sentinel.AttackInterval,
			(id) => {
				const liveSentinel = $P[id];
				if (liveSentinel) liveSentinel.Attacking = 0;
			},
			[sentinel.id]
		);
	},
});

var oLactoferrinNutrientRestriction = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oLactoferrinNutrientRestriction",
	CName: "乳铁蛋白营养限制",
	width: 88,
	height: 88,
	beAttackedPointL: 8,
	beAttackedPointR: 80,
	SunNum: 75,
	coolTime: 50,
	HP: 300,
	Damage: 20,
	CastDelay: 100,
	StallDuration: 400,
	SlowDuration: 1500,
	TargetBoundary: 901,
	PicArr: [
		"images/immune_mod/cards/lactoferrin_nutrient_restriction.png",
		"images/immune_mod/units/lactoferrin_nutrient_restriction.png",
		"images/immune_mod/units/lactoferrin_nutrient_restriction.png",
	],
	Tooltip: "短暂封存铁营养，只抑制细菌和真菌，随后留下缓速期。",
	Produce:
		'<font color="#28325A">乳铁蛋白结合游离铁，使依赖铁生长的细菌和真菌暂时停滞。</font><p>效果：<font color="#167C91">400 tick 停滞，随后 1500 tick 缓速</font></p>',
	InitTrigger() {},
	TargetFilter(target) {
		return (
			target &&
			(target.PathogenClass === "pathogen.bacteria" ||
				target.PathogenClass === "pathogen.fungus")
		);
	},
	PrivateBirth(self) {
		self.getHurt = function () {};
		oSym.addTask(
			self.CastDelay,
			(id) => {
				const restriction = $P[id];
				if (!restriction) return;
				for (const targetId in $Z) {
					const target = $Z[targetId];
					if (
						target.PZ &&
						target.beAttacked &&
						target.ZX < restriction.TargetBoundary &&
						restriction.TargetFilter(target)
					) {
						restriction.applyNutrientRestriction(target);
					}
				}
				restriction.Die();
			},
			[self.id]
		);
	},
	applyNutrientRestriction(target) {
		if (!this.TargetFilter(target) || !target.PZ || !target.beAttacked) return false;
		if (typeof target.getNutrientRestrictionHit === "function") {
			target.getNutrientRestrictionHit(target, this.Damage, 0);
		} else if (typeof target.getHit0 === "function") {
			target.getHit0(target, this.Damage, 0);
		}
		const liveTarget = $Z[target.id];
		if (!liveTarget || liveTarget.HP < 1) return true;

		const stallUntil = Math.max(
			liveTarget.NutrientRestrictionUntil || 0,
			oSym.Now + this.StallDuration
		);
		liveTarget.NutrientRestrictionUntil = stallUntil;
		liveTarget.FreeFreezeTime = Math.max(liveTarget.FreeFreezeTime || 0, stallUntil);
		liveTarget.Speed = 0;
		liveTarget.EleBody?.classList.add("immune-nutrient-restricted");
		oSym.addTask(
			stallUntil - oSym.Now,
			(id, expectedStall, slowDuration) => {
				const stalledTarget = $Z[id];
				if (
					!stalledTarget ||
					stalledTarget.NutrientRestrictionUntil !== expectedStall
				) {
					return;
				}
				stalledTarget.NutrientRestrictionUntil = 0;
				if (stalledTarget.FreeFreezeTime === expectedStall) {
					stalledTarget.FreeFreezeTime = 0;
				}
				const slowUntil = Math.max(
					stalledTarget.FreeSlowTime || 0,
					oSym.Now + slowDuration
				);
				stalledTarget.NutrientSlowUntil = slowUntil;
				stalledTarget.FreeSlowTime = slowUntil;
				ImmuneMod.recomputePathogenSpeed(stalledTarget);
				stalledTarget.EleBody?.classList.remove("immune-nutrient-restricted");
				stalledTarget.EleBody?.classList.add("immune-nutrient-slowed");
				oSym.addTask(
					slowUntil - oSym.Now,
					(targetId, expectedSlow) => {
						const slowedTarget = $Z[targetId];
						if (!slowedTarget || slowedTarget.NutrientSlowUntil !== expectedSlow) return;
						slowedTarget.NutrientSlowUntil = 0;
						if (slowedTarget.FreeSlowTime === expectedSlow) {
							slowedTarget.FreeSlowTime = 0;
						}
						ImmuneMod.recomputePathogenSpeed(slowedTarget);
						slowedTarget.EleBody?.classList.remove("immune-nutrient-slowed");
					},
					[id, slowUntil]
				);
			},
			[target.id, stallUntil, this.SlowDuration]
		);
		return true;
	},
});

var oWideSharpDebridement = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oWideSharpDebridement",
	CName: "广泛锐性清创",
	width: 102,
	height: 91,
	beAttackedPointL: 10,
	beAttackedPointR: 92,
	SunNum: 125,
	coolTime: 50,
	HP: 300,
	Damage: 1800,
	CastDelay: 50,
	AreaRowRadius: 2,
	AreaHorizontalRadius: 240,
	CraterStageDuration: 9000,
	RecoveryZoneImage: "images/immune_mod/ui/debridement_recovery_zone.svg",
	PicArr: [
		"images/immune_mod/cards/wide_sharp_debridement.png",
		"images/immune_mod/units/wide_sharp_debridement.png",
		"images/immune_mod/units/wide_sharp_debridement.png",
		"images/immune_mod/ui/debridement_recovery_zone.svg",
	],
	Tooltip: "处理五行大范围的坏死组织，大幅降低其中的细菌、真菌负荷，并留下恢复区。",
	Produce:
		'<font color="#28325A">一次性移除广泛坏死组织，并大幅降低其中的细菌、真菌负荷。</font><p>范围：<font color="#CC241D">五行、左右各 240 像素</font><br>代价：<font color="#CC241D">留下恢复区</font></p>',
	InitTrigger() {},
	TargetFilter(target) {
		return (
			target &&
			(target.PathogenClass === "pathogen.bacteria" ||
				target.PathogenClass === "pathogen.fungus")
		);
	},
	PrivateBirth(self) {
		self.getHurt = function () {};
		oSym.addTask(
			self.CastDelay,
			(id) => {
				const debridement = $P[id];
				debridement && debridement.ExecuteDebridement();
			},
			[self.id]
		);
	},
	ExecuteDebridement() {
		const startRow = Math.max(1, this.R - this.AreaRowRadius);
		const endRow = Math.min(oS.R, this.R + this.AreaRowRadius);
		const left = this.pixelLeft - this.AreaHorizontalRadius;
		const right = this.pixelRight + this.AreaHorizontalRadius;
		for (let row = startRow; row <= endRow; row++) {
			const targets = oZ.getArZ(left, right, row);
			for (const target of targets) {
				if (!target.PZ || !target.beAttacked || !this.TargetFilter(target)) continue;
				if (typeof target.getDebridementHit === "function") {
					target.getDebridementHit(target, this.Damage);
				} else if (typeof target.getExplosion === "function") {
					target.getExplosion(this.Damage);
				}
			}
		}

		const id = this.id;
		const row = this.R;
		const column = GetC(this.AttackedLX);
		const key = row + "_" + column;
		const grid = oGd.$;
		const leftPx = this.pixelLeft + 3;
		const topPx = this.pixelTop + 50;
		this.Die();
		grid[key + "_0"]?.Die();
		grid[key + "_2"]?.Die();
		oGd.$Crater[key] = 2;
		this.CreateRecoveryZone(id + "_RecoveryZone", row, column, leftPx, topPx);
	},
	CreateRecoveryZone(id, row, column, left, top) {
		const key = row + "_" + column;
		const zone = NewEle(
			id,
			"div",
			"position:absolute;z-index:" +
				(3 * row - 1) +
				";width:96px;height:72px;left:" +
				left +
				"px;top:" +
				top +
				"px;background:url(" +
				this.RecoveryZoneImage +
				") center/contain no-repeat",
			{ className: "immune-debridement-recovery-zone" },
			EDPZ
		);
		oSym.addTask(
			this.CraterStageDuration,
			(node, craterKey, stageDuration) => {
				if (!oGd.$Crater[craterKey]) return;
				oGd.$Crater[craterKey] = 1;
				node?.classList.add("recovering");
				oSym.addTask(
					stageDuration,
					(recoveryNode, recoveryKey) => {
						ClearChild(recoveryNode);
						delete oGd.$Crater[recoveryKey];
					},
					[node, craterKey]
				);
			},
			[zone, key, this.CraterStageDuration]
		);
	},
});

var oActivatedEndothelialAdhesionSite = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oActivatedEndothelialAdhesionSite",
	CName: "活化血管内皮黏附位点",
	width: 79,
	height: 58,
	beAttackedPointL: 10,
	beAttackedPointR: 69,
	SunNum: 25,
	coolTime: 7.5,
	HP: 300,
	PKind: 0,
	Stature: -1,
	PicArr: [
		"images/immune_mod/cards/activated_endothelial_adhesion_site.png",
		"images/immune_mod/units/activated_endothelial_adhesion_site.png",
		"images/immune_mod/units/activated_endothelial_adhesion_site.png",
	],
	Tooltip: "只部署在血流通道，为上层免疫单位提供稳定黏附位置。",
	Produce:
		'<font color="#28325A">炎症信号使血管内皮表达黏附分子，让循环中的免疫细胞能够停靠。</font><p>位置：<font color="#167C91">仅 LF2 血流通道</font></p>',
	getShadow() {
		return "display:none";
	},
	CanGrow(cell, row, column) {
		const key = row + "_" + column;
		return !(
			column < 1 ||
			column > 9 ||
			oGd.$LF[row] !== 2 ||
			cell[0] ||
			cell[1] ||
			oGd.$Crater[key] ||
			oGd.$Tombstones[key]
		);
	},
	InitTrigger() {},
});

var oNeutrophilSwarmStrike = InheritO(
	typeof oSquash === "undefined" ? CPlants : oSquash,
	{
	...ImmunePlantBase,
	EName: "oNeutrophilSwarmStrike",
	CName: "中性粒细胞蜂拥突击",
	width: 100,
	height: 226,
	beAttackedPointR: 67,
	SunNum: 50,
	coolTime: 7.5,
	HP: 300,
	PrepareDelay: 100,
	ImpactDelay: 45,
	ImpactWidth: 100,
	ClearDelay: 185,
	TriggerDistance: 71,
	PicArr: [
		"images/immune_mod/cards/neutrophil_swarm_strike.png",
		"images/immune_mod/units/neutrophil_swarm_strike.png",
		"images/immune_mod/units/neutrophil_swarm_strike.png",
		"images/immune_mod/units/neutrophil_swarm_strike.png",
		"images/immune_mod/units/neutrophil_swarm_strike.png",
		"images/immune_mod/units/neutrophil_swarm_strike.png",
	],
	Tooltip: "短距离感知细菌或真菌后，集群扑向感染焦点并一次性压低落点内的微生物负荷。",
	Produce:
		'<font color="#28325A">附近出现微生物时，多枚中性粒细胞会沿趋化信号迅速汇聚到感染焦点。</font><p>范围：<font color="#CC241D">短距离、小范围集群清除</font><br>限制：<font color="#167C91">只识别细菌和真菌</font></p>',
	TargetFilter(target) {
		return ImmuneMod.isGranuleTarget(target);
	},
	GetDY(row, column, cells) {
		return cells[0] ? -21 : -10;
	},
	getTriggerRange(row, left, right) {
		return [[left - 50, right + 80, 0]];
	},
	getHurt(attacker, attackKind, damage) {
		if (attackKind !== 3 && this.TargetFilter(attacker)) {
			this.NormalAttack(
				this,
				attacker.id,
				attacker.ZX + attacker.Speed * 4 * (!attacker.WalkDirection ? -1 : 1) - 50
			);
			return;
		}
		(this.HP -= damage) < 1 && this.Die();
	},
	TriggerCheck(target, direction, triggerIndex) {
		const targetX = target.ZX;
		const id = this.id;
		const body = $(id)?.childNodes?.[1];
		const attacking = target.isAttacking;
		if (
			this.TargetFilter(target) &&
			target.beAttacked &&
			target.Altitude > -1 &&
			target.Altitude < 2 &&
			(attacking || (!attacking && targetX - this.AttackedRX < this.TriggerDistance))
		) {
			if (typeof oT !== "undefined") oT.$[this.R]?.splice(triggerIndex, 1);
			body?.classList.add("immune-neutrophil-swarm-committed");
			oSym.addTask(
				this.PrepareDelay,
				(plantId, targetId, landingX) => {
					const swarm = $P[plantId];
					swarm && swarm.NormalAttack(swarm, targetId, landingX);
				},
				[
					id,
					target.id,
					target.ZX + target.Speed * 4 * (!target.WalkDirection ? -1 : 1) - 50,
				]
			);
		}
	},
	NormalAttack(self, targetId, landingX) {
		const wrapper = $(self.id);
		const target = $Z[targetId];
		if (target) {
			landingX = target.ZX + target.Speed * 4 * (!target.WalkDirection ? -1 : 1) - 50;
		}
		if (wrapper) {
			if (wrapper.childNodes?.[1]) wrapper.childNodes[1].src = self.PicArr[3];
			SetStyle(wrapper, { left: landingX + "px" });
		}
		self.Die(1);
		oSym.addTask(
			self.ImpactDelay,
			(node, left, row, width, filter, clearDelay) => {
				const targets = oZ.getArZ(left, left + width, row);
				for (const pathogen of targets) {
					if (
						filter(pathogen) &&
						pathogen.PZ &&
						pathogen.Altitude > -1 &&
						pathogen.Altitude < 3
					) {
						pathogen.getThump();
					}
				}
				oSym.addTask(clearDelay, ClearChild, [node]);
			},
			[wrapper, landingX, self.R, self.ImpactWidth, self.TargetFilter, self.ClearDelay]
		);
	},
});

var oTriLaneAntimicrobialInfusion = InheritO(oNeutrophil, {
	EName: "oTriLaneAntimicrobialInfusion",
	CName: "三通道抗菌药缓释泵",
	width: 73,
	height: 80,
	beAttackedPointR: 53,
	SunNum: 325,
	coolTime: 7.5,
	HP: 300,
	Damage: 20,
	AttackInterval: 140,
	ProjectileStep: 5,
	RevealDelay: 15,
	PicArr: [
		"images/immune_mod/cards/tri_lane_antimicrobial_infusion.png",
		"images/immune_mod/units/tri_lane_antimicrobial_infusion.png",
		"images/immune_mod/units/tri_lane_antimicrobial_infusion.png",
		"images/immune_mod/ui/antimicrobial_droplet.svg",
		"images/immune_mod/ui/antimicrobial_droplet_hit.svg",
	],
	Tooltip: "同时向本通道和相邻两条通道输送抗菌药液微滴。",
	Produce:
		'<font color="#28325A">分流缓释泵把局部抗菌成分送入三条相邻微循环通道。</font><p>药敏目标反馈：<font color="#CC241D">每路 20</font><br>目标：<font color="#167C91">细菌和真菌</font></p>',
	getTriggerR(row) {
		return [row > 2 ? row - 1 : 1, row < oS.R ? Number(row) + 1 : row];
	},
	PrivateBirth(self) {
		self.BulletEleByRow = {};
		for (const row in self.oTrigger) {
			self.BulletEleByRow[row] = NewImg(
				0,
				self.PicArr[3],
				"left:" +
					(self.AttackedLX - 40) +
					"px;top:" +
					(GetY(Number(row)) - 50) +
					"px;visibility:hidden;z-index:" +
					(3 * Number(row) + 2)
			);
		}
	},
	PrivateDie(self) {
		self.BulletEleByRow = {};
	},
	AttackCheck2(target) {
		return target.Altitude === 1 && ImmuneMod.isGranuleTarget(target);
	},
	NormalAttack() {
		const infusion = this;
		infusion.plantImage?.classList.add("immune-infusion-pulse");
		oSym.addTask(
			36,
			(id) => $P[id]?.plantImage?.classList.remove("immune-infusion-pulse"),
			[infusion.id]
		);
		for (const row in infusion.oTrigger) {
			const template = infusion.BulletEleByRow[row];
			if (!template) continue;
			const bulletId = "TriLaneInfusion" + Math.random();
			const particleState = {
				enabled: infusion.CanOxidativelyCatalyze === true,
				oxidized: false,
				damage: infusion.Damage,
				oxidativeDamage: infusion.OxidativeDamage,
				splashDamage: infusion.OxidativeSplashDamage,
				splashWidth: infusion.OxidativeSplashWidth,
				oxidativeImage: infusion.OxidativeFlightImage,
				oxidativeHitImage: infusion.OxidativeHitImage,
			};
			EditEle(template.cloneNode(false), { id: bulletId }, 0, EDPZ);
			oSym.addTask(infusion.RevealDelay, (id) => $(id) && SetVisible($(id)), [bulletId]);
			oSym.addTask(
				1,
				function moveInfusionParticle(id, x, targetRow, cssLeft, step, state, normalHitImage) {
					const bullet = $(id);
					if (!bullet) return;
					ImmuneMod.catalyzeAntimicrobialParticle(state, bullet, x, targetRow);
					const target = oZ.getZ0(x, targetRow);
					if (target && target.Altitude === 1 && ImmuneMod.isGranuleTarget(target)) {
						ImmuneMod.applyAntimicrobialDamage(target, state.damage, 0, true);
						if (state.oxidized) {
							ImmuneMod.applyOxidativeSplash(target, state.splashDamage, state.splashWidth);
						}
						bullet.src = state.oxidized ? state.oxidativeHitImage : normalHitImage;
						bullet.style.left = cssLeft + 28 + "px";
						oSym.addTask(10, ClearChild, [bullet]);
						return;
					}
					x += step;
					cssLeft += step;
					if (x < oS.W) {
						bullet.style.left = cssLeft + "px";
						oSym.addTask(1, moveInfusionParticle, [
							id,
							x,
							targetRow,
							cssLeft,
							step,
							state,
							normalHitImage,
						]);
					} else {
						ClearChild(bullet);
					}
				},
				[
					bulletId,
					infusion.AttackedLX,
					Number(row),
					infusion.AttackedLX - 40,
					infusion.ProjectileStep,
					particleState,
					infusion.PicArr[4],
				]
			);
		}
	},
});

var oPlateletFibrinCaptureNet = InheritO(
	typeof oTangleKlep === "undefined" ? CPlants : oTangleKlep,
	{
	...ImmunePlantBase,
	EName: "oPlateletFibrinCaptureNet",
	CName: "血小板-纤维蛋白捕获网",
	width: 90,
	height: 72,
	beAttackedPointL: 15,
	beAttackedPointR: 80,
	coolTime: 30,
	SunNum: 25,
	HP: 300,
	CaptureDelay: 50,
	PicArr: [
		"images/immune_mod/cards/platelet_fibrin_capture_net.png",
		"images/immune_mod/units/platelet_fibrin_capture_net.png",
		"images/immune_mod/units/platelet_fibrin_capture_net.png",
		"images/immune_mod/units/platelet_fibrin_capture_net.png",
	],
	Tooltip: "只可直接部署在血流通道；接触后固定一个细菌或真菌，随后捕获复合物离场。",
	Produce:
		'<font color="#28325A">血小板提供黏附核心，纤维蛋白丝把一团血流中的微生物固定下来，并交给下游防线清除。</font><p>用途：<font color="#CC241D">单次捕获</font><br>位置：<font color="#167C91">仅血流通道</font></p>',
	TargetFilter(target) {
		return ImmuneMod.isGranuleTarget(target);
	},
	GetDY() {
		return 5;
	},
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		return !(
			oGd.$LF[row] !== 2 ||
			column < 1 ||
			column > 9 ||
			oGd.$Crater[key] ||
			cells[0] ||
			cells[1] ||
			oGd.$Tombstones[key]
		);
	},
	getShadow() {
		return "display:none";
	},
	getTriggerRange(row, left, right) {
		return [[left, right, 0]];
	},
	BirthStyle(self, id, wrapper, style) {
		if (wrapper.childNodes?.[1]) wrapper.childNodes[1].src = self.PicArr[2];
		ImmunePlantBase.BirthStyle(self, id, wrapper, style);
	},
	getHurt(attacker, attackKind, damage) {
		if (attackKind !== 3 && this.TargetFilter(attacker)) {
			this.canTrigger = 0;
			this.NormalAttack(this, attacker);
			return;
		}
		(this.HP -= damage) < 1 && this.Die();
	},
	TriggerCheck(target) {
		if (
			target.AttackedLX < GetX(9) &&
			target.beAttacked &&
			this.TargetFilter(target)
		) {
			this.canTrigger = 0;
			this.NormalAttack(this, target);
		}
	},
	NormalAttack(net, target) {
		net.getHurt = function () {};
		target.getHurt = function () {};
		target.beAttacked = 0;
		target.isAttacking = 1;
		net.plantImage?.classList.add("immune-fibrin-net-committed");
		target.EleBody?.classList.add("immune-fibrin-net-captured");
		oSym.addTask(
			net.CaptureDelay,
			(netId, targetId) => {
				const liveNet = $P[netId];
				const liveTarget = $Z[targetId];
				if (liveTarget) liveTarget.DisappearDie();
				if (liveNet) liveNet.Die();
			},
			[net.id, target.id]
		);
	},
});

var oAntimicrobialFibrinolyticFlush = InheritO(
	typeof oJalapeno === "undefined" ? CPlants : oJalapeno,
	{
	...ImmunePlantBase,
	EName: "oAntimicrobialFibrinolyticFlush",
	CName: "抗菌-纤溶联合灌流",
	width: 68,
	height: 89,
	beAttackedPointR: 48,
	SunNum: 125,
	coolTime: 20,
	HP: 300,
	CastDelay: 40,
	VisualDuration: 135,
	PicArr: [
		"images/immune_mod/cards/antimicrobial_fibrinolytic_flush.png",
		"images/immune_mod/units/antimicrobial_fibrinolytic_flush.png",
		"images/immune_mod/units/antimicrobial_fibrinolytic_flush.png",
		"images/immune_mod/ui/antimicrobial_fibrinolytic_flush_wave.svg",
	],
	Tooltip: "在游戏中移出整条通道的细菌和真菌，并冲开纤维蛋白-生物膜障碍。",
	Produce:
		'<font color="#28325A">抗菌成分与纤溶成分沿一条灌流通道联合推进；这是复合处理流程的游戏抽象，不是一种万能药。</font><p>范围：<font color="#CC241D">整行</font><br>附加：<font color="#167C91">清除纤维蛋白-生物膜轨迹</font></p>',
	TargetFilter(target) {
		return ImmuneMod.isGranuleTarget(target);
	},
	InitTrigger() {},
	getHurt() {},
	PrivateBirth(self) {
		oSym.addTask(
			self.CastDelay,
			(id) => {
				const flush = $P[id];
				if (!flush) return;
				const row = flush.R;
				const targets = oZ.getArZ(100, oS.W, row);
				for (const target of targets) {
					if (flush.TargetFilter(target)) target.getExplosion();
				}
				const wrapper = $(id);
				const ice = oGd.$Ice[row];
				const craters = oGd.$Crater;
				flush.Die(1);
				if (wrapper?.childNodes?.[1]) {
					wrapper.childNodes[1].src = flush.PicArr[3];
					SetStyle(wrapper.childNodes[1], {
						width: "755px",
						height: "131px",
						left: 120 - flush.pixelLeft + "px",
						top: "-42px",
					});
					wrapper.childNodes[1].classList?.add("immune-fibrinolytic-flush-wave");
					oSym.addTask(flush.VisualDuration, ClearChild, [wrapper]);
				}
				ClearChild($("dIceCar" + row));
				if (ice) {
					for (let column = ice[1]; column < 11; column++) {
						delete craters[row + "_" + column];
					}
				}
			},
			[self.id]
		);
	},
});

var oGobletCell = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oGobletCell",
	CName: "杯状细胞",
	width: 88,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 78,
	SunNum: 175,
	coolTime: 7.5,
	InitialCoolTime: 0,
	HP: 300,
	AttackInterval: 140,
	MucusDuration: 1000,
	PicArr: [
		"images/immune_mod/cards/goblet_cell.png",
		"images/immune_mod/units/goblet_cell.png",
		"images/immune_mod/units/goblet_cell.png",
		"images/immune_mod/ui/mucus_drop.svg",
		"images/immune_mod/ui/mucus_hit.svg",
	],
	Tooltip: "在本路铺出黏液泡，捕获并延缓腔面上的游离病原体。",
	Produce:
		'<font color="#28325A">分泌黏蛋白，在气道表面形成捕获层。</font><p>特点：<font color="#167C91">只减速，不造成伤害</font></p>',
	PrivateBirth(self) {
		self.BulletEle = NewImg(
			0,
			self.PicArr[3],
			"left:" +
				(self.AttackedLX + 22) +
				"px;top:" +
				(self.pixelTop + 54) +
				"px;visibility:hidden;z-index:" +
				(self.zIndex + 2)
		);
	},
	PrivateDie(self) {
		self.BulletEle = null;
	},
	AttackCheck2(pathogen) {
		return (
			pathogen.PZ &&
			pathogen.beAttacked &&
			pathogen.Altitude === 1 &&
			pathogen.MucusAffectable === true
		);
	},
	CheckLoop(pathogenId, triggerIndex) {
		const plantId = this.id;
		this.NormalAttack(pathogenId);
		oSym.addTask(
			this.AttackInterval,
			(id, targetId, index) => {
				const plant = $P[id];
				plant && plant.AttackCheck1(targetId, index);
			},
			[plantId, pathogenId, triggerIndex]
		);
	},
	NormalAttack() {
		const attacker = this;
		const dropId = "ImmuneMucus" + Math.random();
		EditEle(attacker.BulletEle.cloneNode(false), { id: dropId }, 0, EDPZ);
		attacker.plantImage?.classList.add("immune-goblet-release");
		oSym.addTask(8, (id) => $(id) && SetVisible($(id)), [dropId]);
		oSym.addTask(
			45,
			(id) => {
				const plant = $P[id];
				plant?.plantImage?.classList.remove("immune-goblet-release");
			},
			[attacker.id]
		);
		oSym.addTask(
			1,
			function moveMucus(id, x, row, duration, cssLeft) {
				const drop = $(id);
				if (!drop) return;
				const target = oZ.getZ0(x, row);
				if (target && target.Altitude === 1 && target.MucusAffectable === true) {
					if (ImmuneMod.applyMucus(target, duration)) {
						drop.src = "images/immune_mod/ui/mucus_hit.svg";
						drop.style.width = "52px";
						drop.style.height = "52px";
						drop.style.left = cssLeft + 8 + "px";
						drop.style.top = target.pixelTop + Math.max(24, target.height - 58) + "px";
						oSym.addTask(24, ClearChild, [drop]);
						return;
					}
				}
				x += 5;
				cssLeft += 5;
				if (x < oS.W) {
					drop.style.left = cssLeft + "px";
					oSym.addTask(1, moveMucus, [id, x, row, duration, cssLeft]);
				} else {
					ClearChild(drop);
				}
			},
			[dropId, attacker.AttackedRX, attacker.R, attacker.MucusDuration, attacker.AttackedLX + 22]
		);
	},
});

var oCiliatedEpithelium = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oCiliatedEpithelium",
	CName: "纤毛上皮",
	width: 88,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 78,
	SunNum: 125,
	coolTime: 10,
	InitialCoolTime: 0,
	HP: 500,
	FirstSweepDelay: 200,
	SweepInterval: 600,
	PushDistance: 80,
	TransportLock: 300,
	PicArr: [
		"images/immune_mod/cards/ciliated_epithelium.png",
		"images/immune_mod/units/ciliated_epithelium.png",
		"images/immune_mod/units/ciliated_epithelium.png",
		"images/immune_mod/ui/ciliary_wave.svg",
	],
	Tooltip: "周期清运本路已被黏液捕获的游离目标；没有黏液时不会推动。",
	Produce:
		'<font color="#28325A">纤毛协同摆动，把黏液层和其中的捕获物送向清除方向。</font><p>条件：<font color="#167C91">必须先有黏液标记</font></p>',
	InitTrigger() {},
	PrivateBirth(self) {
		oSym.addTask(
			self.FirstSweepDelay,
			function ciliaryLoop(id) {
				const cell = $P[id];
				if (!cell) return;
				cell.SweepLane();
				$P[id] === cell && oSym.addTask(cell.SweepInterval, ciliaryLoop, [id]);
			},
			[self.id]
		);
	},
	SweepLane() {
		const row = this.R;
		const now = oSym.Now;
		const targets = oZ.getArZ(0, oS.W + 120, row).slice();
		let changed = false;

		this.plantImage?.classList.add("immune-ciliated-sweep");
		ImmuneMod.showCiliaryWave(this);
		oSym.addTask(
			80,
			(id) => {
				const cell = $P[id];
				cell?.plantImage?.classList.remove("immune-ciliated-sweep");
			},
			[this.id]
		);

		for (const target of targets) {
			if (
				$Z[target.id] !== target ||
				!target.PZ ||
				!target.HP ||
				!target.beAttacked ||
				target.Altitude !== 1 ||
				target.WalkDirection !== 0 ||
				target.isAttacking ||
				target.FreeSetbodyTime ||
				target.FreeFreezeTime ||
				target.MucusCoated !== true ||
				target.MucusCoatedUntil <= now ||
				target.MucociliaryTransportable !== true ||
				(target.MucociliaryPushUntil || 0) > now
			) {
				continue;
			}

			if (ImmuneMod.transportMucusTarget(target, this.PushDistance, this.TransportLock)) {
				changed = true;
			}
		}

		if (changed) {
			const lane = oZ.$[row];
			if (lane) {
				lane.sort((left, right) => left.AttackedLX - right.AttackedLX);
				lane.RefreshTime = oSym.Now;
			}
			if (oZ.$R?.[row]) oZ.$R[row].RefreshTime = -1;
			if (!this.CiliaryHintShown) {
				this.CiliaryHintShown = 1;
				ImmuneMod.showCombatHint(this, "纤毛清运", "mucus");
			}
		}
	},
});

var PlasmaCellBase = {
	width: 94,
	height: 96,
	beAttackedPointL: 7,
	beAttackedPointR: 86,
	SunNum: 200,
	coolTime: 12,
	InitialCoolTime: 0,
	HP: 300,
	FirstAttackDelay: 100,
	AttackInterval: 200,
	AntibodySpeed: 10,
	AntibodyStep: 2,
	AntibodyHitRadius: 18,
	AntibodyMaxLife: 400,
	InitTrigger() {},
	PrivateBirth(self) {
		oSym.addTask(
			self.FirstAttackDelay,
			function plasmaLoop(id) {
				const cell = $P[id];
				if (!cell) return;

				const sourceX = cell.pixelLeft + cell.width * 0.5;
				const sourceY = cell.pixelTop + cell.height * 0.42;
				const target = ImmuneMod.findAntibodyTarget(
					cell.AntibodyEpitopeId,
					sourceX,
					sourceY
				);
				if (target) {
					cell.NormalAttack(target.id);
				} else if (
					!cell.MismatchHintShown &&
					ImmuneMod.hasMismatchedAntibodyTarget(cell.AntibodyEpitopeId)
				) {
					cell.MismatchHintShown = 1;
					cell.plantImage?.classList.add("immune-antibody-mismatch");
					ImmuneMod.showCombatHint(cell, "表位未匹配", "blocked");
					oSym.addTask(
						55,
						(plantId) => {
							const liveCell = $P[plantId];
							liveCell?.plantImage?.classList.remove("immune-antibody-mismatch");
						},
						[id]
					);
				}

				$P[id] === cell && oSym.addTask(cell.AttackInterval, plasmaLoop, [id]);
			},
			[self.id]
		);
	},
	NormalAttack(targetId) {
		const cell = this;
		const target = $Z[targetId];
		if (!ImmuneMod.isMatchingAntibodyTarget(target, cell.AntibodyEpitopeId, false)) return;

		let x = cell.pixelLeft + cell.width * 0.5;
		let y = cell.pixelTop + cell.height * 0.42;
		const bulletId = "ImmuneAntibody" + Math.random();
		const bullet = NewImg(
			bulletId,
			cell.PicArr[3],
			"left:" +
				(x - 24) +
				"px;top:" +
				(y - 20) +
				"px;width:48px;height:40px;z-index:" +
				(cell.zIndex + 5),
			EDPZ,
			{ className: "immune-antibody-projectile" }
		);
		const bornAt = oSym.Now;

		cell.plantImage?.classList.add("immune-plasma-release");
		oSym.addTask(
			45,
			(id) => {
				const liveCell = $P[id];
				liveCell?.plantImage?.classList.remove("immune-plasma-release");
			},
			[cell.id]
		);

		oSym.addTask(
			cell.AntibodyStep,
			function flyAntibody(
				id,
				lockedTargetId,
				epitopeId,
				markerImage,
				speed,
				step,
				hitRadius,
				startedAt,
				maxLife,
				currentX,
				currentY
			) {
				const liveBullet = $(id);
				if (!liveBullet || oSym.Now - startedAt > maxLife) {
					liveBullet && ClearChild(liveBullet);
					return;
				}

				const liveTarget = $Z[lockedTargetId];
				if (!ImmuneMod.isMatchingAntibodyTarget(liveTarget, epitopeId, false)) {
					ClearChild(liveBullet);
					return;
				}

				const center = ImmuneMod.getPathogenCenter(liveTarget);
				const dx = center.x - currentX;
				const dy = center.y - currentY;
				const distance = Math.hypot(dx, dy);
				if (!Number.isFinite(distance)) {
					ClearChild(liveBullet);
					return;
				}

				if (distance <= hitRadius + speed) {
					const result = ImmuneMod.applyAntibodyBinding(
						liveTarget,
						epitopeId,
						markerImage
					);
					if (!result) {
						ClearChild(liveBullet);
						return;
					}
					liveBullet.classList.add("immune-antibody-impact");
					liveBullet.style.left = center.x - 25 + "px";
					liveBullet.style.top = center.y - 21 + "px";
					liveBullet.style.width = "50px";
					liveBullet.style.height = "42px";
					liveBullet.style.transform = "none";
					oSym.addTask(22, ClearChild, [liveBullet]);
					return;
				}

				currentX += (dx / distance) * speed;
				currentY += (dy / distance) * speed;
				liveBullet.style.left = currentX - 24 + "px";
				liveBullet.style.top = currentY - 20 + "px";
				liveBullet.style.transform =
					"rotate(" + ((Math.atan2(dy, dx) * 180) / Math.PI + 90) + "deg)";
				oSym.addTask(step, flyAntibody, [
					id,
					lockedTargetId,
					epitopeId,
					markerImage,
					speed,
					step,
					hitRadius,
					startedAt,
					maxLife,
					currentX,
					currentY,
				]);
			},
			[
				bulletId,
				targetId,
				cell.AntibodyEpitopeId,
				cell.PicArr[3],
				cell.AntibodySpeed,
				cell.AntibodyStep,
				cell.AntibodyHitRadius,
				bornAt,
				cell.AntibodyMaxLife,
				x,
				y,
			]
		);
	},
};

var oPlasmaCellTriangle = InheritO(CPlants, {
	...ImmunePlantBase,
	...PlasmaCellBase,
	EName: "oPlasmaCellTriangle",
	CName: "浆细胞·三角型",
	AntibodyEpitopeId: "rv.triangle",
	PicArr: [
		"images/immune_mod/cards/plasma_triangle.png",
		"images/immune_mod/units/plasma_triangle.png",
		"images/immune_mod/units/plasma_triangle.png",
		"images/immune_mod/ui/antibody_triangle.svg",
	],
	Tooltip: "向五条路线持续释放只匹配三角表位的抗体。",
	Produce:
		'<font color="#28325A">固定的浆细胞克隆，持续分泌三角型抗体。</font><p>范围：<font color="#167C91">跨五路追踪匹配表位</font></p>',
});

var oPlasmaCellRing = InheritO(CPlants, {
	...ImmunePlantBase,
	...PlasmaCellBase,
	EName: "oPlasmaCellRing",
	CName: "浆细胞·环型",
	AntibodyEpitopeId: "rv.ring",
	PicArr: [
		"images/immune_mod/cards/plasma_ring.png",
		"images/immune_mod/units/plasma_ring.png",
		"images/immune_mod/units/plasma_ring.png",
		"images/immune_mod/ui/antibody_ring.svg",
	],
	Tooltip: "向五条路线持续释放只匹配环形表位的抗体。",
	Produce:
		'<font color="#28325A">固定的浆细胞克隆，持续分泌环型抗体。</font><p>范围：<font color="#CC7A2D">跨五路追踪匹配表位</font></p>',
});

var oMacrophage = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oMacrophage",
	CName: "组织巨噬细胞",
	width: 96,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 84,
	SunNum: 150,
	coolTime: 7.5,
	HP: 300,
	PicArr: [
		"images/immune_mod/cards/macrophage.png",
		"images/immune_mod/units/macrophage.png",
		"images/immune_mod/units/macrophage.png",
		"images/immune_mod/units/macrophage.png",
		"images/immune_mod/units/macrophage.png",
	],
	Tooltip: "近距离包裹并吞噬一个易识别的病原体；处理期间不能再次攻击。",
	Produce:
		'<font color="#28325A">伸出伪足，在近距离包围并吞噬病原体。</font><p>特点：<font color="#CC241D">一次吞噬，随后进入处理期</font></p>',
	getTriggerRange(row, attackedLeft, attackedRight) {
		return [[this.pixelLeft, attackedRight + 80, 0]];
	},
	isCapsuleProtected(pathogen) {
		return pathogen.CapsuleBlocksPhagocytosis && pathogen.OrnHP > 0 && !pathogen.Opsonized;
	},
	AttackCheck2(pathogen) {
		return (
			pathogen.PZ &&
			pathogen.beAttacked &&
			pathogen.Altitude === 1 &&
			pathogen.Phagocytosable === true &&
			!this.isCapsuleProtected(pathogen)
		);
	},
	TriggerCheck(pathogen) {
		if (this.isCapsuleProtected(pathogen)) {
			if (!pathogen.CapsuleHintUntil || pathogen.CapsuleHintUntil < oSym.Now) {
				pathogen.CapsuleHintUntil = oSym.Now + 260;
				ImmuneMod.showCombatHint(pathogen, "荚膜阻碍识别", "blocked");
			}
			return;
		}
		this.AttackCheck2(pathogen) && ((this.canTrigger = 0), this.NormalAttack(this.id, pathogen.id));
	},
	NormalAttack(macrophageId, pathogenId) {
		const macrophage = $P[macrophageId];
		if (!macrophage) return;
		macrophage.plantImage?.classList.remove("immune-macrophage-digest");
		macrophage.plantImage?.classList.add("immune-macrophage-engulf");

		oSym.addTask(
			70,
			(cellId, targetId) => {
				oSym.addTask(
					18,
					(liveCellId, liveTargetId) => {
						const liveCell = $P[liveCellId];
						const livePathogen = $Z[liveTargetId];
						if (!liveCell) return;

						if (livePathogen && liveCell.AttackCheck2(livePathogen) && livePathogen.getRaven(liveCellId, livePathogen)) {
							liveCell.plantImage?.classList.remove("immune-macrophage-engulf");
							liveCell.plantImage?.classList.add("immune-macrophage-digest");
							oSym.addTask(
								4200,
								(id) => {
									const readyCell = $P[id];
									if (!readyCell) return;
									readyCell.canTrigger = 1;
									readyCell.plantImage?.classList.remove("immune-macrophage-digest");
								},
								[liveCellId]
							);
							return;
						}

						liveCell.canTrigger = 1;
						liveCell.plantImage?.classList.remove("immune-macrophage-engulf");
					},
					[cellId, targetId]
				);
			},
			[macrophageId, pathogenId]
		);
	},
});

var oEpithelialBarrier = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oEpithelialBarrier",
	CName: "紧密连接上皮",
	width: 82,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 74,
	SunNum: 50,
	coolTime: 15.5,
	HP: 4000,
	PicArr: [
		"images/immune_mod/cards/epithelial_barrier.png",
		"images/immune_mod/units/epithelial_barrier.png",
		"images/immune_mod/units/epithelial_barrier.png",
	],
	Tooltip: "高耐久屏障，为后排争取时间。",
	Produce: '<font color="#28325A">相邻上皮细胞用紧密连接组成屏障。</font><p>耐久：<font color="#CC241D">高</font></p>',
	InitTrigger() {},
});

var oMucociliarySweep = InheritO(CPlants, {
	EName: "oMucociliarySweep",
	CName: "纤毛清扫波",
	width: 92,
	height: 64,
	beAttackedPointL: 0,
	beAttackedPointR: 92,
	SunNum: 0,
	PicArr: ["images/immune_mod/ui/mucociliary_sweep.svg", "images/immune_mod/ui/mucociliary_sweep.svg"],
	AudioArr: [],
	NormalGif: 0,
	canEat: 0,
	Stature: 1,
	getShadow() {
		return "display:none";
	},
	getTriggerRange(a, b, c) {
		return [[b, c, 0]];
	},
	TriggerCheck(pathogen) {
		pathogen.beAttacked && pathogen.Altitude > 0 && ((this.canTrigger = 0), this.NormalAttack(this));
	},
	BoomDie() {},
	NormalAttack(self) {
		const moveClean = function (cleaner, endX, left, right, row, element) {
			const targets = oZ.getArZ(left, right, row);
			let index = targets.length;
			while (index--) targets[index].getCrushed(cleaner) && targets[index].CrushDie();
			if (left > endX) return cleaner.Die();
			cleaner.pixelRight += 10;
			cleaner.AttackedLX = left += 10;
			cleaner.AttackedRX = right += 10;
			element.style.left = (cleaner.pixelLeft += 10) + "px";
			oSym.addTask(1, moveClean, [cleaner, endX, left, right, row, element]);
		};
		moveClean(self, oS.W, self.AttackedLX, self.AttackedRX, self.R, $(self.id));
	},
});

var oHealthCore = InheritO(CPlants, {
	EName: "oHealthCore",
	CName: "健康防线",
	width: 46,
	height: 46,
	beAttackedPointL: 0,
	beAttackedPointR: 46,
	SunNum: 0,
	HP: 1,
	PicArr: ["images/immune_mod/ui/health_core.svg"],
	Tooltip: "不能让病原体越过这里。",
	NormalGif: 0,
	InitTrigger() {},
	PrivateBirth(self) {
		self.PrivateDie = function () {
			GameOver();
		};
	},
	GetDX() {
		return -40;
	},
});

var oRhinovirus = InheritO(OrnNoneZombies, {
	EName: "oRhinovirus",
	CName: "鼻病毒",
	StandGif: 9,
	width: 94,
	height: 102,
	beAttackedPointL: 8,
	beAttackedPointR: 84,
	HP: 180,
	BreakPoint: 1,
	Lvl: 1,
	OSpeed: 1.7,
	Speed: 1.7,
	Attack: 55,
	PathogenClass: "pathogen.virus.free",
	Phagocytosable: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 1,
	AudioArr: [],
	HeadPosition: [
		{ x: 34, y: 22, width: 18, height: 18 },
		{ x: 34, y: 22, width: 18, height: 18 },
	],
	PicArr: [
		"images/immune_mod/cards/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
		"images/immune_mod/enemies/rhinovirus.png",
	],
	Tooltip: "低耐久、速度较快的呼吸道病毒。",
	Produce: '<font color="#28325A">常见的上呼吸道病毒。</font><p>特点：<font color="#CC241D">低耐久、速度较快</font></p>',
	GetDX() {
		return -52;
	},
	GetDY() {
		return -4;
	},
	getShadow() {
		return "display:none";
	},
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	NormalAttack(pathogenId, plantId) {
		oSym.addTask(
			90,
			(pId, defenderId) => {
				const pathogen = $Z[pId];
				const defender = $P[defenderId];
				if (pathogen && pathogen.beAttacked && defender) {
					defender.getHurt(pathogen, pathogen.AKind, pathogen.Attack);
					pathogen.JudgeAttack();
				}
			},
			[pathogenId, plantId]
		);
	},
});

var oAirwayBacterium = InheritO(OrnNoneZombies, {
	EName: "oAirwayBacterium",
	CName: "无荚膜链球菌群",
	StandGif: 9,
	width: 96,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 86,
	HP: 270,
	BreakPoint: 1,
	Lvl: 1,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 1,
	AudioArr: [],
	HeadPosition: [
		{ x: 34, y: 24, width: 18, height: 18 },
		{ x: 34, y: 24, width: 18, height: 18 },
	],
	PicArr: [
		"images/immune_mod/cards/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
		"images/immune_mod/enemies/airway_bacterium.png",
	],
	Tooltip: "没有荚膜保护的普通细菌群，容易被抗菌颗粒击中。",
	Produce:
		'<font color="#28325A">表面没有荚膜遮挡，进入气道后直接暴露在防线面前。</font><p>韧性：<font color="#CC241D">低</font><br>特点：<font color="#167C91">可被中性粒细胞颗粒清除</font></p>',
	GetDX() {
		return -52;
	},
	GetDY() {
		return -2;
	},
	getShadow() {
		return "display:none";
	},
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	getPea(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	NormalAttack: oRhinovirus.prototype.NormalAttack,
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oAirwayBacterium2 = InheritO(oAirwayBacterium, {
	EName: "oAirwayBacterium2",
});

var oAirwayBacterium3 = InheritO(oAirwayBacterium, {
	EName: "oAirwayBacterium3",
});

var oTriangleRhinovirus = InheritO(oRhinovirus, {
	EName: "oTriangleRhinovirus",
	CName: "鼻病毒·三角型",
	SurfaceEpitopeId: "rv.triangle",
	AntibodyTargetable: true,
	AntibodyEffect: "neutralize",
	NeutralizationBindingThreshold: 3,
	Tooltip: "表面带三角型表位，只会被匹配的三角型抗体锁定。",
	Produce:
		'<font color="#28325A">带三角型表位的游离鼻病毒。</font><p>特点：<font color="#167C91">需要匹配抗体完成中和</font></p>',
});

var oRingRhinovirus = InheritO(oRhinovirus, {
	EName: "oRingRhinovirus",
	CName: "鼻病毒·环型",
	width: 96,
	height: 104,
	beAttackedPointL: 7,
	beAttackedPointR: 89,
	SurfaceEpitopeId: "rv.ring",
	AntibodyTargetable: true,
	AntibodyEffect: "neutralize",
	NeutralizationBindingThreshold: 3,
	PicArr: [
		"images/immune_mod/cards/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
		"images/immune_mod/enemies/rhinovirus_ring.png",
	],
	Tooltip: "表面带环型表位，只会被匹配的环型抗体锁定。",
	Produce:
		'<font color="#28325A">与三角型具有相同推进数值，但表面表位不同。</font><p>特点：<font color="#CC7A2D">需要环型抗体完成中和</font></p>',
});

var oEncapsulatedPneumococcus = InheritO(OrnIZombies, {
	EName: "oEncapsulatedPneumococcus",
	CName: "荚膜肺炎链球菌群",
	StandGif: 11,
	width: 96,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 86,
	HP: 270,
	OrnHP: 370,
	BreakPoint: 1,
	Lvl: 2,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 1,
	CapsuleBlocksPhagocytosis: true,
	AudioArr: [],
	HeadPosition: [
		{ x: 34, y: 24, width: 18, height: 18 },
		{ x: 34, y: 24, width: 18, height: 18 },
	],
	PicArr: [
		"images/immune_mod/cards/pneumococcus.png",
		"images/immune_mod/enemies/pneumococcus_capsulated.png",
		"images/immune_mod/enemies/pneumococcus_capsulated.png",
		"images/immune_mod/enemies/pneumococcus_capsulated.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_capsulated.png",
	],
	Tooltip: "外层荚膜会降低清除效率，并阻碍巨噬细胞直接吞噬。",
	Produce:
		'<font color="#28325A">带有明显荚膜的肺炎链球菌群。</font><p>特点：<font color="#CC241D">完整荚膜阻碍吞噬</font></p>',
	GetDX() {
		return -52;
	},
	GetDY() {
		return -2;
	},
	getShadow() {
		return "display:none";
	},
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	getPea(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getGranuleHit(self, damage, direction) {
		const hadCapsule = self.OrnHP > 0;
		self.getHit0(self, damage, direction);
		if (hadCapsule && self.OrnHP <= 0 && self.HP > 0) {
			ImmuneMod.showCombatHint(self, "吞噬机会出现！", "ready");
		}
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getRaven() {
		if (this.CapsuleBlocksPhagocytosis && this.OrnHP > 0 && !this.Opsonized) {
			ImmuneMod.showCombatHint(this, "荚膜阻碍识别", "blocked");
			return 0;
		}
		this.DisappearDie();
		return 1;
	},
	NormalAttack: oRhinovirus.prototype.NormalAttack,
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oDenseCapsulePneumococcus = InheritO(oEncapsulatedPneumococcus, {
	EName: "oDenseCapsulePneumococcus",
	CName: "高荚膜肺炎链球菌群",
	width: 104,
	height: 100,
	beAttackedPointL: 8,
	beAttackedPointR: 96,
	OrnHP: 1100,
	Lvl: 3,
	SunNum: 125,
	PicArr: [
		"images/immune_mod/cards/dense_capsule_pneumococcus.png",
		"images/immune_mod/enemies/dense_capsule_pneumococcus.png",
		"images/immune_mod/enemies/dense_capsule_pneumococcus.png",
		"images/immune_mod/enemies/dense_capsule_pneumococcus.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/pneumococcus_exposed.png",
		"images/immune_mod/enemies/dense_capsule_pneumococcus.png",
	],
	Tooltip: "厚重的多糖荚膜形成独立保护层；破膜后才暴露普通菌群。",
	Produce:
		'<font color="#28325A">高表达的多糖荚膜让吞噬细胞难以抓牢菌体。</font><p>保护：<font color="#CC241D">厚荚膜层</font><br>弱点：<font color="#167C91">破膜后可被吞噬</font></p>',
});

var oInvasiveAspergillus = InheritO(oAirwayBacterium, {
	EName: "oInvasiveAspergillus",
	CName: "侵袭性烟曲霉菌丝",
	width: 108,
	height: 96,
	beAttackedPointL: 5,
	beAttackedPointR: 103,
	HP: 270,
	Lvl: 2,
	SunNum: 75,
	OSpeed: 3.2,
	Speed: 3.2,
	Attack: 100,
	PathogenClass: "pathogen.fungus",
	Phagocytosable: false,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: false,
	BreachUsed: 0,
	PicArr: [
		"images/immune_mod/cards/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
		"images/immune_mod/enemies/invasive_aspergillus.png",
	],
	Tooltip: "高速接近，并且只会穿过遇到的第一层紧密连接上皮。",
	Produce:
		'<font color="#28325A">萌发后的菌丝尖端能够侵入上皮，但不能一口跨过免疫细胞。</font><p>特点：<font color="#CC241D">一次性突破上皮屏障</font><br>突破后：<font color="#167C91">速度降低</font></p>',
	canBreach(defender) {
		return (
			!this.BreachUsed &&
			defender &&
			defender.EName === "oEpithelialBarrier"
		);
	},
	JudgeAttack() {
		const pathogen = this;
		const x = pathogen.ZX;
		const rowKey = pathogen.R + "_";
		const column = GetC(x);
		const grid = oGd.$;
		const contact =
			pathogen.JudgeLR(pathogen, rowKey, column, x, grid) ||
			pathogen.JudgeSR(pathogen, rowKey, column, x, grid);

		if (!contact) {
			if (pathogen.isAttacking) {
				pathogen.isAttacking = 0;
				pathogen.EleBody.src = pathogen.PicArr[pathogen.NormalGif];
			}
			return;
		}

		const defender = $P[contact[1]];
		if (pathogen.canBreach(defender)) {
			pathogen.BreachBarrier(pathogen.id, defender.id);
			return;
		}

		if (!pathogen.isAttacking) {
			pathogen.isAttacking = 1;
			pathogen.EleBody.src = pathogen.PicArr[pathogen.AttackGif];
		}
		oRhinovirus.prototype.NormalAttack(pathogen.id, contact[1]);
	},
	BreachBarrier(pathogenId, defenderId) {
		const pathogen = $Z[pathogenId];
		const defender = $P[defenderId];
		if (!pathogen || !defender || !pathogen.canBreach(defender)) return;

		pathogen.BreachUsed = 1;
		pathogen.isAttacking = 1;
		pathogen.Altitude = 2;
		SetHidden(pathogen.EleShadow);
		pathogen.EleBody?.classList.add("immune-aspergillus-breach");
		ImmuneMod.showCombatHint(pathogen, "菌丝突破上皮", "resistant");

		const fallbackRight = pathogen.AttackedLX - 70;
		oSym.addTask(
			100,
			(id, targetId, fallback) => {
				const livePathogen = $Z[id];
				if (!livePathogen) return;
				const liveDefender = $P[targetId];
				const landingRight =
					liveDefender && liveDefender.EName === "oEpithelialBarrier"
						? liveDefender.AttackedLX - 6
						: fallback;

				livePathogen.AttackedRX = landingRight;
				livePathogen.X = landingRight - livePathogen.beAttackedPointR;
				livePathogen.AttackedLX =
					livePathogen.X + livePathogen.beAttackedPointL;
				livePathogen.ZX = livePathogen.AttackedLX;
				livePathogen.Ele.style.left = Math.round(livePathogen.X) + "px";
				livePathogen.OSpeed = livePathogen.Speed = 1.6;
				livePathogen.Altitude = 1;
				livePathogen.isAttacking = 0;
				livePathogen.EleBody?.classList.remove("immune-aspergillus-breach");
				SetVisible(livePathogen.EleShadow);
				livePathogen.JudgeAttack();
			},
			[pathogenId, defenderId, fallbackRight]
		);
	},
	getRaven() {
		ImmuneMod.showCombatHint(this, "菌丝过大，无法直接吞噬", "blocked");
		return 0;
	},
	getCrushed() {
		return this.Altitude === 1;
	},
});

var oGlidingMycoplasma = InheritO(OrnNoneZombies, {
	EName: "oGlidingMycoplasma",
	CName: "滑行肺炎支原体",
	StandGif: 9,
	width: 96,
	height: 96,
	beAttackedPointL: 4,
	beAttackedPointR: 92,
	HP: 140,
	BreakPoint: 1,
	Lvl: 1,
	OSpeed: 2.25,
	Speed: 2.25,
	Attack: 45,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.8,
	MucusHintText: "贴附滑行：减速较少",
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 0.5,
	CellWall: false,
	AudioArr: [],
	HeadPosition: [
		{ x: 25, y: 28, width: 18, height: 18 },
		{ x: 25, y: 28, width: 18, height: 18 },
	],
	PicArr: [
		"images/immune_mod/cards/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
		"images/immune_mod/enemies/gliding_mycoplasma.png",
	],
	Tooltip: "无细胞壁、靠贴附器官滑行；推进快，受黏液影响较小。",
	Produce:
		'<font color="#28325A">会贴附呼吸道表面并滑行的无细胞壁细菌。</font><p>特点：<font color="#CC7A2D">高速，部分抵抗黏液减速</font></p>',
	GetDX() {
		return -52;
	},
	GetDY() {
		return -3;
	},
	getShadow() {
		return "display:none";
	},
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	getPea(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	NormalAttack: oRhinovirus.prototype.NormalAttack,
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oDispersingBiofilmAggregate = InheritO(OrnIZombies, {
	EName: "oDispersingBiofilmAggregate",
	CName: "铜绿假单胞菌生物膜聚集体",
	StandGif: 11,
	width: 108,
	height: 100,
	beAttackedPointL: 7,
	beAttackedPointR: 101,
	HP: 270,
	OrnHP: 150,
	BreakPoint: 1,
	Lvl: 2,
	OSpeed: 1.6,
	Speed: 1.6,
	LostPaperSpeed: 4.8,
	LostBiofilmSpeed: 4.8,
	DispersedSprite: "images/immune_mod/enemies/planktonic_pseudomonas.png",
	BiofilmDispersalDuration: 150,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 0.5,
	PhageSusceptible: true,
	PhageHostId: "pseudomonas.aeruginosa",
	AudioArr: [],
	HeadPosition: [
		{ x: 38, y: 26, width: 18, height: 18 },
		{ x: 38, y: 26, width: 18, height: 18 },
	],
	PicArr: [
		"images/immune_mod/cards/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
		"images/immune_mod/enemies/dispersing_biofilm_aggregate.png",
	],
	Tooltip: "生物膜基质被打散后短暂停顿，随后菌群高速扩散。",
	Produce:
		'<font color="#28325A">铜绿假单胞菌以胞外基质聚集成生物膜。</font><p>基质：<font color="#CC241D">150</font><br>散开后：<font color="#CC241D">速度 4.8</font></p>',
	GetDX() {
		return -58;
	},
	GetDY() {
		return -4;
	},
	getShadow() {
		return "display:none";
	},
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	TakeBiofilmHit(self, damage, direction, channel) {
		const hadMatrix = self.OrnHP > 0;
		const layerHit =
			OrnIZombies.prototype[channel] || OrnIZombies.prototype.getHit0;
		if (typeof layerHit === "function") {
			layerHit(self, damage, direction);
		} else {
			const remainingMatrix = (self.OrnHP -= damage);
			if (remainingMatrix < 1) {
				self.HP += remainingMatrix;
				self.Ornaments = 0;
			}
		}

		if (hadMatrix && self.OrnHP <= 0 && self.HP > 0) {
			self.BeginBiofilmDispersal(self);
		}
	},
	getHit(self, damage, direction) {
		self.TakeBiofilmHit(self, damage, direction, "getHit");
	},
	getHit0(self, damage, direction) {
		self.TakeBiofilmHit(self, damage, direction, "getHit0");
	},
	getHit1(self, damage, direction) {
		self.TakeBiofilmHit(self, damage, direction, "getHit1");
	},
	getHit2(self, damage, direction) {
		self.TakeBiofilmHit(self, damage, direction, "getHit2");
	},
	getHit3(self, damage, direction) {
		self.TakeBiofilmHit(self, damage, direction, "getHit3");
	},
	getPea(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	BeginBiofilmDispersal(self) {
		if (self.BiofilmDispersed || self.BiofilmTransitionUntil) return;
		const transitionUntil = oSym.Now + self.BiofilmDispersalDuration;
		self.BiofilmTransitionUntil = transitionUntil;
		self.Speed = 0;
		self.EleBody?.classList.add("immune-biofilm-dispersing");
		ImmuneMod.showCombatHint(self, "生物膜破裂：菌群正在散开", "resistant");
		oSym.addTask(
			self.BiofilmDispersalDuration,
			(id, expectedUntil) => {
				const aggregate = $Z[id];
				if (
					!aggregate ||
					aggregate.BiofilmTransitionUntil !== expectedUntil
				) {
					return;
				}
				aggregate.BiofilmTransitionUntil = 0;
				aggregate.BiofilmDispersed = true;
				aggregate.OSpeed = aggregate.LostBiofilmSpeed;
				ImmuneMod.recomputePathogenSpeed(aggregate);
				if (aggregate.EleBody) {
					aggregate.EleBody.src = aggregate.DispersedSprite;
				}
				aggregate.EleBody?.classList.remove("immune-biofilm-dispersing");
				aggregate.EleBody?.classList.add("immune-biofilm-dispersed");
				ImmuneMod.showCombatHint(aggregate, "游离菌群加速", "resistant");
				aggregate.JudgeAttack?.();
			},
			[self.id, transitionUntil]
		);
	},
	becomePhageCarrier(self, hostId) {
		if (
			self.PhageSusceptible !== true ||
			self.PhageHostId !== hostId
		) {
			return false;
		}
		self.PhageCarrier = true;
		return self.becomeFriendly(self, hostId);
	},
	becomeFriendly(self, hostId) {
		if (self.PhageHostId !== hostId) return false;
		if (self.PZ && typeof self.bedevil === "function") {
			self.bedevil(self);
		} else {
			self.PZ = 0;
			self.WalkDirection = 1;
		}
		self.EleBody?.classList.add("immune-phage-carrier");
		return self.PZ === 0;
	},
	NormalAttack: oRhinovirus.prototype.NormalAttack,
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oExudateShieldedBacteria = InheritO(oEncapsulatedPneumococcus, {
	EName: "oExudateShieldedBacteria",
	CName: "渗出物遮蔽菌群",
	width: 108,
	height: 100,
	beAttackedPointL: 7,
	beAttackedPointR: 101,
	HP: 270,
	OrnHP: 1100,
	BreakPoint: 1,
	Lvl: 3,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	DiffuseBypassesShield: true,
	PicArr: [
		"images/immune_mod/cards/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
		"images/immune_mod/enemies/exudate_shielded_bacteria.png",
	],
	Tooltip: "厚重渗出物阻挡普通颗粒，但扩散型抗菌成分可直接伤及菌体。",
	Produce:
		'<font color="#28325A">富含蛋白的创面渗出物形成厚重遮蔽层。</font><p>遮蔽层：<font color="#CC241D">1100</font><br>弱点：<font color="#167C91">次氯酸扩散伤害直达本体</font></p>',
	getPea(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		const bodyHit = OrnNoneZombies.prototype.getHit;
		if (typeof bodyHit === "function") {
			bodyHit(self, damage, direction);
			return;
		}
		self.HP -= damage;
		if (self.HP < self.BreakPoint) self.NormalDie?.();
	},
});

var oFibrinWrappedStaphCluster = InheritO(oEncapsulatedPneumococcus, {
	EName: "oFibrinWrappedStaphCluster",
	CName: "纤维蛋白包裹的金黄色葡萄球菌簇",
	width: 112,
	height: 104,
	beAttackedPointL: 8,
	beAttackedPointR: 104,
	HP: 270,
	OrnHP: 1400,
	BreakPoint: 1,
	Lvl: 3,
	SunNum: 175,
	OSpeed: 3.2,
	Speed: 3.2,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 0.5,
	PicArr: [
		"images/immune_mod/cards/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
		"images/immune_mod/enemies/fibrin_wrapped_staph_cluster.png",
	],
	Tooltip: "纤维蛋白形成厚重外层，显著阻挡巨噬细胞吞噬；游戏中需先破除外层。",
	Produce:
		'<font color="#28325A">金黄色葡萄球菌借助凝血形成纤维蛋白包裹层。</font><p>本体：<font color="#CC241D">270</font><br>包裹层：<font color="#CC241D">1400</font></p>',
});

var oQuorumResponderCluster = InheritO(oAirwayBacterium, {
	EName: "oQuorumResponderCluster",
	CName: "群体感应响应菌簇",
	StandGif: 9,
	width: 96,
	height: 96,
	beAttackedPointL: 8,
	beAttackedPointR: 88,
	HP: 270,
	BreakPoint: 1,
	Lvl: 1,
	SunNum: 50,
	coolTime: 0,
	CanSelect: 0,
	OSpeed: 3.5,
	Speed: 3.5,
	Attack: 100,
	AttackInterval: 100,
	QuorumStopDuration: 200,
	QuorumMoveDuration: 220,
	QuorumStep: 1,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: true,
	MucociliaryTransportFactor: 0.5,
	PhageSusceptible: true,
	PhageHostId: "pseudomonas.aeruginosa",
	PicArr: [
		"images/immune_mod/cards/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
		"images/immune_mod/enemies/quorum_responder_cluster.png",
	],
	Tooltip: "散在菌群收到群体感应信号后进入同步移动和停顿节拍。",
	Produce:
		'<font color="#28325A">环境中原本散在的铜绿假单胞菌接收信号并向菌群聚集。</font><p>状态：<font color="#167C91">同步响应，不是凭空复制</font></p>',
	CustomBirth(row, x, delay, id, topOffset) {
		const responder = this;
		const baseline = GetY(row) + responder.GetDY();
		const top = baseline - responder.height;
		responder.AttackedRX =
			(responder.X =
				(responder.ZX = responder.AttackedLX =
					x - (responder.beAttackedPointR - responder.beAttackedPointL) * 0.5) -
				responder.beAttackedPointL) + responder.beAttackedPointR;
		responder.R = row;
		responder.pixelTop = top;
		responder.zIndex = 3 * row + 1;
		if (delay) responder.FreeSetbodyTime = oSym.Now;
		return responder.getHTML(
			(responder.id = id),
			responder.X,
			top,
			responder.zIndex,
			"none",
			topOffset || 0,
			responder.height + "px",
			responder.PicArr[responder.StandGif]
		);
	},
	BirthCallBack(self) {
		const baseBirth = OrnNoneZombies.prototype.BirthCallBack;
		if (typeof baseBirth === "function") baseBirth(self);
		self.QuorumStep = 0;
		self.QuorumPhaseToken = 0;
	},
	DetachFromQuorum(self) {
		const leader = self.QuorumLeaderId && $Z[self.QuorumLeaderId];
		if (leader?.FormationSlots) {
			const slot = leader.FormationSlots[self.FormationIndex];
			if (slot?.id === self.id) slot.id = "";
		}
		self.QuorumLeaderId = "";
		self.FormationIndex = -1;
	},
	RecomputeResponseSpeed(self) {
		const leader = self.QuorumLeaderId && $Z[self.QuorumLeaderId];
		if (leader && typeof leader.RecomputeGroupSpeed === "function") {
			leader.RecomputeGroupSpeed(leader);
			return self.Speed;
		}
		if (
			!self.QuorumStep ||
			self.isAttacking ||
			self.FreeFreezeTime ||
			self.FreeSetbodyTime
		) {
			self.Speed = 0;
			return 0;
		}
		let factor = self.FreeSlowTime ? 0.5 : 1;
		if (self.MucusCoated && self.MucusCoatedUntil > oSym.Now) {
			factor = Math.min(factor, self.MucusSlowFactor || 0.5);
		}
		return (self.Speed = self.OSpeed * factor);
	},
	ChangeChkActsTo0(self, id, body) {
		self.QuorumStep = 0;
		self.Speed = 0;
		body?.classList.add("immune-quorum-rest");
		const token = ++self.QuorumPhaseToken;
		if (self.QuorumLeaderId) return;
		oSym.addTask(
			self.QuorumStopDuration,
			(targetId, expectedToken) => {
				const responder = $Z[targetId];
				if (responder && responder.QuorumPhaseToken === expectedToken) {
					responder.ChangeChkActsTo1(responder, targetId, responder.EleBody);
				}
			},
			[id, token]
		);
	},
	ChangeChkActsTo1(self, id, body) {
		self.QuorumStep = 1;
		body?.classList.remove("immune-quorum-rest");
		self.RecomputeResponseSpeed(self);
		const token = ++self.QuorumPhaseToken;
		if (self.QuorumLeaderId || !self.PZ) return;
		oSym.addTask(
			self.QuorumMoveDuration,
			(targetId, expectedToken) => {
				const responder = $Z[targetId];
				if (responder && responder.QuorumPhaseToken === expectedToken) {
					responder.ChangeChkActsTo0(responder, targetId, responder.EleBody);
				}
			},
			[id, token]
		);
	},
	ChkActs(self, row, rowList, index) {
		self.RecomputeResponseSpeed(self);
		const baseActs = OrnNoneZombies.prototype.ChkActs;
		return typeof baseActs === "function"
			? baseActs(self, row, rowList, index)
			: 1;
	},
	getSlow(self, id, duration) {
		const until = Math.max(self.FreeSlowTime || 0, oSym.Now + duration);
		self.FreeSlowTime = until;
		self.Attack = 50;
		self.RecomputeResponseSpeed(self);
		oSym.addTask(
			until - oSym.Now,
			(targetId, expectedUntil) => {
				const responder = $Z[targetId];
				if (!responder || responder.FreeSlowTime !== expectedUntil) return;
				responder.FreeSlowTime = 0;
				responder.Attack = 100;
				responder.RecomputeResponseSpeed(responder);
			},
			[id, until]
		);
	},
	getFreeze(self, id) {
		if (self.beAttacked) self.getHit0(self, 20, 0);
		if (!$Z[id]) return;
		const frozenUntil = oSym.Now + 400;
		self.FreeFreezeTime = frozenUntil;
		self.RecomputeResponseSpeed(self);
		oSym.addTask(
			400,
			(targetId, expectedUntil) => {
				const responder = $Z[targetId];
				if (!responder || responder.FreeFreezeTime !== expectedUntil) return;
				responder.FreeFreezeTime = 0;
				responder.getSlow(responder, targetId, 1500);
			},
			[id, frozenUntil]
		);
	},
	NormalAttack(pathogenId, plantId) {
		oSym.addTask(
			this.AttackInterval,
			(id, targetId) => {
				const responder = $Z[id];
				const defender = $P[targetId];
				if (
					responder &&
					responder.beAttacked &&
					!responder.FreeFreezeTime &&
					!responder.FreeSetbodyTime &&
					defender
				) {
					defender.getHurt(responder, responder.AKind, responder.Attack);
					responder.JudgeAttack();
				}
			},
			[pathogenId, plantId]
		);
	},
	becomePhageCarrier(self, hostId) {
		if (self.PhageSusceptible !== true || self.PhageHostId !== hostId) return false;
		self.PhageCarrier = true;
		return self.becomeFriendly(self, hostId);
	},
	becomeFriendly(self, hostId) {
		if (self.PhageHostId !== hostId) return false;
		self.DetachFromQuorum(self);
		if (self.PZ && typeof self.bedevil === "function") self.bedevil(self);
		else {
			self.PZ = 0;
			self.WalkDirection = 1;
		}
		self.EleBody?.classList.add("immune-phage-carrier");
		return self.PZ === 0;
	},
	Die() {
		this.DetachFromQuorum(this);
		const baseDie = OrnNoneZombies.prototype.Die;
		if (typeof baseDie === "function") baseDie.call(this);
	},
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	DisappearDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oQuorumSensingConsortium = InheritO(oAirwayBacterium, {
	EName: "oQuorumSensingConsortium",
	CName: "群体感应菌群",
	StandGif: 9,
	width: 116,
	height: 108,
	beAttackedPointL: 12,
	beAttackedPointR: 104,
	HP: 500,
	BreakPoint: 1,
	Lvl: 3,
	SunNum: 350,
	coolTime: 0,
	OSpeed: 7.2,
	Speed: 7.2,
	EntrySpeed: 7.2,
	CruiseSpeed: 3.5,
	Attack: 100,
	AttackInterval: 100,
	EntryDuration: 320,
	QuorumStopDuration: 200,
	QuorumMoveDuration: 220,
	SummonFrameDelay: 10,
	RecruitDelay: 100,
	RecruitRevealDelay: 110,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: false,
	MucusAffectable: true,
	MucusSlowFactor: 0.5,
	MucociliaryTransportable: false,
	PhageSusceptible: true,
	PhageHostId: "pseudomonas.aeruginosa",
	RecruitedFromDispersedPool: true,
	FormationSlots: [],
	PicArr: [
		"images/immune_mod/cards/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
		"images/immune_mod/enemies/quorum_sensing_consortium.png",
	],
	Tooltip: "释放群体感应信号，把环境中散在的响应菌召集到四个编队位置。",
	Produce:
		'<font color="#28325A">信号分子达到阈值后，散在铜绿假单胞菌改变行为并向菌群聚集。</font><p>特点：<font color="#CC241D">四位召集、全组同步</font><br>说明：<font color="#167C91">响应菌原已存在于环境中</font></p>',
	BirthCallBack(self) {
		const baseBirth = OrnNoneZombies.prototype.BirthCallBack;
		if (typeof baseBirth === "function") baseBirth(self);
		self.FormationSlots = self.BuildFormationSlots(self);
		self.FormationCycleToken = 0;
		self.SummonToken = 0;
		self.QuorumStep = -1;
		self.ConsortiumActivated = false;
		self.Summoning = false;
		const delay = (self.delayT || 0) + self.EntryDuration;
		oSym.addTask(
			delay,
			(id) => {
				const consortium = $Z[id];
				consortium && consortium.ActivateConsortium(consortium);
			},
			[self.id]
		);
	},
	BuildFormationSlots(self) {
		const slots = [0, 0, 0, 0];
		const laneTypes = oGd.$LF || [];
		if (self.R > 1 && laneTypes[self.R - 1] && laneTypes[self.R - 1] !== 2) {
			slots[0] = { id: "", row: self.R - 1, xOffset: 0 };
		}
		slots[1] = { id: "", row: self.R, xOffset: 100 };
		if (
			self.R < oS.R &&
			laneTypes[self.R + 1] &&
			laneTypes[self.R + 1] !== 2
		) {
			slots[2] = { id: "", row: self.R + 1, xOffset: 0 };
		}
		slots[3] = { id: "", row: self.R, xOffset: -60 };
		return slots;
	},
	ActivateConsortium(self) {
		if (self.ConsortiumActivated || !$Z[self.id]) return;
		self.ConsortiumActivated = true;
		self.OSpeed = self.CruiseSpeed;
		self.Speed = self.CruiseSpeed;
		self.EleBody?.classList.add("immune-quorum-activated");
		self.Summon(self, self.id);
	},
	NormalAttack(pathogenId, plantId) {
		if (!this.ConsortiumActivated) {
			this.ActivateConsortium(this);
			return;
		}
		oSym.addTask(
			this.AttackInterval,
			(id, targetId) => {
				const consortium = $Z[id];
				const defender = $P[targetId];
				if (
					consortium &&
					consortium.beAttacked &&
					!consortium.FreeFreezeTime &&
					!consortium.FreeSetbodyTime &&
					defender
				) {
					defender.getHurt(consortium, consortium.AKind, consortium.Attack);
					consortium.JudgeAttack();
				}
			},
			[pathogenId, plantId]
		);
	},
	GetFormationMembers(self) {
		const members = [self];
		for (const slot of self.FormationSlots) {
			if (!slot?.id) continue;
			const responder = $Z[slot.id];
			if (responder?.beAttacked) members.push(responder);
			else slot.id = "";
		}
		return members;
	},
	RecomputeGroupSpeed(self) {
		if (!self.ConsortiumActivated) return self.Speed;
		const members = self.GetFormationMembers(self);
		let speed = self.CruiseSpeed;
		if (!self.QuorumStep || self.Summoning) {
			speed = 0;
		} else {
			let factor = 1;
			for (const member of members) {
				if (
					member.isAttacking ||
					member.FreeFreezeTime ||
					member.FreeSetbodyTime
				) {
					speed = 0;
					break;
				}
				if (member.FreeSlowTime) factor = Math.min(factor, 0.5);
				if (member.MucusCoated && member.MucusCoatedUntil > oSym.Now) {
					factor = Math.min(factor, member.MucusSlowFactor || 0.5);
				}
			}
			if (speed) speed *= factor;
		}
		for (const member of members) member.Speed = speed;
		return speed;
	},
	SetFormationPhase(self, moving) {
		self.QuorumStep = moving ? 1 : 0;
		for (const slot of self.FormationSlots) {
			const responder = slot?.id && $Z[slot.id];
			if (!responder) continue;
			responder.QuorumStep = self.QuorumStep;
			responder.QuorumPhaseToken++;
			responder.EleBody?.classList.toggle("immune-quorum-rest", !moving);
		}
		self.EleBody?.classList.toggle("immune-quorum-rest", !moving);
		self.RecomputeGroupSpeed(self);
	},
	StartRestPhase(self) {
		if (!$Z[self.id] || !self.PZ) return;
		self.SetFormationPhase(self, 0);
		const token = ++self.FormationCycleToken;
		oSym.addTask(
			self.QuorumStopDuration,
			(id, expectedToken) => {
				const consortium = $Z[id];
				if (consortium && consortium.FormationCycleToken === expectedToken) {
					consortium.StartMovingPhase(consortium);
				}
			},
			[self.id, token]
		);
	},
	StartMovingPhase(self) {
		if (!$Z[self.id] || !self.PZ) return;
		self.SetFormationPhase(self, 1);
		const token = ++self.FormationCycleToken;
		oSym.addTask(
			self.QuorumMoveDuration,
			(id, expectedToken) => {
				const consortium = $Z[id];
				if (consortium && consortium.FormationCycleToken === expectedToken) {
					consortium.CheckFormation(consortium);
				}
			},
			[self.id, token]
		);
	},
	CheckFormation(self) {
		let missing = false;
		for (const slot of self.FormationSlots) {
			if (!slot) continue;
			if (!slot.id || !$Z[slot.id] || !$Z[slot.id].beAttacked) {
				slot.id = "";
				missing = true;
			}
		}
		missing ? self.Summon(self, self.id) : self.StartRestPhase(self);
	},
	Summon(self, id) {
		if (self.Summoning || !$Z[id] || !self.PZ) return;
		self.Summoning = true;
		self.SetFormationPhase(self, 0);
		const summonToken = ++self.SummonToken;
		self.EleBody?.classList.add("immune-quorum-signaling");
		ImmuneMod.showCombatHint(self, "散在菌群响应信号并开始聚集", "resistant");
		oSym.addTask(
			self.SummonFrameDelay,
			(leaderId, expectedToken) => {
				const leader = $Z[leaderId];
				if (!leader || leader.SummonToken !== expectedToken) return;
				oSym.addTask(
					leader.SummonFrameDelay,
					(activeLeaderId, activeToken) => {
						const activeLeader = $Z[activeLeaderId];
						if (!activeLeader || activeLeader.SummonToken !== activeToken) return;
						const html = [];
						const responders = [];
						const mounds = [];
						for (let index = 0; index < activeLeader.FormationSlots.length; index++) {
							const slot = activeLeader.FormationSlots[index];
							if (!slot || (slot.id && $Z[slot.id])) continue;
							const responder = new oQuorumResponderCluster();
							const responderId = "Z_" + Math.random();
							slot.id = responderId;
							responder.QuorumLeaderId = activeLeader.id;
							responder.FormationIndex = index;
							responder.QuorumStep = 0;
							responders.push(responder);
							html.push(
								responder.CustomBirth(
									slot.row,
									activeLeader.ZX + slot.xOffset,
									activeLeader.RecruitDelay,
									responderId
								)
							);
							mounds.push(
								NewImg(
									"",
									"images/immune_mod/enemies/quorum_responder_cluster.png",
									"left:" +
										(activeLeader.ZX + slot.xOffset - 44) +
										"px;top:" +
										(GetY(slot.row) - 70) +
										"px;z-index:" +
										(3 * slot.row + 2),
									EDPZ
								)
							);
						}
						if (responders.length) {
							oSym.addTask(
								activeLeader.RecruitRevealDelay,
								(ownerId, revealToken, markup, units) => {
									const owner = $Z[ownerId];
									if (owner && owner.SummonToken === revealToken) {
										oP.AppearUP(markup, units, units.length);
									}
								},
								[activeLeader.id, activeToken, html, responders]
							);
						}
						oSym.addTask(
							activeLeader.QuorumStopDuration,
							(ownerId, finishToken, moundImages) => {
								for (const mound of moundImages) ClearChild(mound);
								const owner = $Z[ownerId];
								if (!owner || owner.SummonToken !== finishToken) return;
								owner.Summoning = false;
								owner.EleBody?.classList.remove("immune-quorum-signaling");
								owner.StartMovingPhase(owner);
							},
							[activeLeader.id, activeToken, mounds]
						);
					},
					[leader.id, expectedToken]
				);
			},
			[self.id, summonToken]
		);
	},
	ChkActs(self, row, rowList, index) {
		self.RecomputeGroupSpeed(self);
		const baseActs = OrnNoneZombies.prototype.ChkActs;
		return typeof baseActs === "function"
			? baseActs(self, row, rowList, index)
			: 1;
	},
	getSnowPea(self, damage, direction) {
		if (!self.ConsortiumActivated) {
			self.PlaySlowballAudio();
			return;
		}
		const snowHit = OrnNoneZombies.prototype.getSnowPea;
		if (typeof snowHit === "function") snowHit(self, damage, direction);
		self.RecomputeGroupSpeed(self);
	},
	DetachFormation(self) {
		self.FormationCycleToken++;
		self.SummonToken++;
		self.Summoning = false;
		for (const slot of self.FormationSlots || []) {
			const responder = slot?.id && $Z[slot.id];
			if (responder) {
				responder.QuorumLeaderId = "";
				responder.FormationIndex = -1;
				responder.ChangeChkActsTo1(responder, responder.id, responder.EleBody);
			}
			if (slot) slot.id = "";
		}
	},
	bedevil(self) {
		self.DetachFormation(self);
		const baseBedevil = OrnNoneZombies.prototype.bedevil;
		if (typeof baseBedevil === "function") baseBedevil(self);
		else {
			self.PZ = 0;
			self.WalkDirection = 1;
		}
	},
	becomePhageCarrier(self, hostId) {
		if (self.PhageSusceptible !== true || self.PhageHostId !== hostId) return false;
		self.PhageCarrier = true;
		return self.becomeFriendly(self, hostId);
	},
	becomeFriendly(self, hostId) {
		if (self.PhageHostId !== hostId) return false;
		self.bedevil(self);
		self.EleBody?.classList.add("immune-phage-carrier");
		return self.PZ === 0;
	},
	Die() {
		this.DetachFormation(this);
		const baseDie = OrnNoneZombies.prototype.Die;
		if (typeof baseDie === "function") baseDie.call(this);
	},
	GoingDie() {
		this.Die();
	},
	NormalDie() {
		this.Die();
	},
	ExplosionDie() {
		this.Die();
	},
	DisappearDie() {
		this.Die();
	},
	CrushDie() {
		this.Die();
	},
});

var oMeningococcalBloodstreamCluster = InheritO(
	typeof oDuckyTubeZombie1 === "undefined"
		? OrnNoneZombies
		: oDuckyTubeZombie1,
	{
	EName: "oMeningococcalBloodstreamCluster",
	CName: "血流脑膜炎球菌簇",
	width: 166,
	height: 144,
	beAttackedPointL: 82,
	beAttackedPointR: 130,
	StandGif: 4,
	AttackGif: 5,
	HeadGif: 6,
	DieGif: 7,
	WalkGif0: 2,
	WalkGif1: 3,
	HP: 270,
	BreakPoint: 90,
	Lvl: 1,
	SunNum: 50,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: false,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	BloodstreamOnly: true,
	SurfaceEpitopeId: "meningococcal.fhbp.model-A",
	AntibodyTargetable: true,
	PicArr: [
		"images/immune_mod/cards/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
	],
	Tooltip: "带有常规荚膜、只能沿血流通道推进的脑膜炎奈瑟菌簇。",
	Produce:
		'<font color="#28325A">进入血流的脑膜炎奈瑟菌依靠多糖荚膜提高生存机会，并随循环移动。</font><p>本体：<font color="#CC241D">270</font><br>位置：<font color="#167C91">仅血流通道</font></p>',
	CanPass(row, laneType) {
		return laneType === 2;
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
});

var oThickCapsuleMeningococcalCluster = InheritO(
	typeof oDuckyTubeZombie2 === "undefined"
		? oMeningococcalBloodstreamCluster
		: oDuckyTubeZombie2,
	{
	EName: "oThickCapsuleMeningococcalCluster",
	CName: "厚荚膜血流脑膜炎球菌簇",
	HP: 270,
	OrnHP: 370,
	BreakPoint: 90,
	Lvl: 2,
	SunNum: 75,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	CanDisplay: 0,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: true,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	BloodstreamOnly: true,
	SurfaceEpitopeId: "meningococcal.fhbp.model-A",
	AntibodyTargetable: true,
	PicArr: [
		"images/immune_mod/cards/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/thick_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
	],
	Tooltip: "370 点独立荚膜层会先承受攻击，并在完整时阻挡直接吞噬。",
	Produce:
		'<font color="#28325A">较厚的多糖荚膜帮助脑膜炎球菌逃避免疫识别。</font><p>本体：<font color="#CC241D">270</font><br>荚膜：<font color="#CC241D">370</font></p>',
	CanPass(row, laneType) {
		return laneType === 2;
	},
	getRaven() {
		if (this.CapsuleBlocksPhagocytosis && this.OrnHP > 0 && !this.Opsonized) {
			ImmuneMod.showCombatHint(this, "荚膜阻挡吞噬", "blocked");
			return 0;
		}
		this.DisappearDie();
		return 1;
	},
	getGranuleHit(self, damage, direction) {
		const hadCapsule = self.OrnHP > 0;
		self.getHit0(self, damage, direction);
		if (hadCapsule && self.OrnHP <= 0 && self.HP > 0) {
			ImmuneMod.showCombatHint(self, "荚膜已破", "ready");
		}
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
});

var oDenseCapsuleMeningococcalCluster = InheritO(
	typeof oDuckyTubeZombie3 === "undefined"
		? oThickCapsuleMeningococcalCluster
		: oDuckyTubeZombie3,
	{
	EName: "oDenseCapsuleMeningococcalCluster",
	CName: "致密荚膜血流脑膜炎球菌簇",
	HP: 270,
	OrnHP: 1100,
	BreakPoint: 90,
	Lvl: 3,
	SunNum: 125,
	OSpeed: 1.6,
	Speed: 1.6,
	Attack: 100,
	CanDisplay: 0,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: true,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	BloodstreamOnly: true,
	SurfaceEpitopeId: "meningococcal.fhbp.model-A",
	AntibodyTargetable: true,
	PicArr: [
		"images/immune_mod/cards/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/dense_capsule_meningococcal_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
		"images/immune_mod/enemies/meningococcal_bloodstream_cluster.png",
	],
	Tooltip: "1100 点致密荚膜层形成高强度保护，破膜后才暴露普通菌簇。",
	Produce:
		'<font color="#28325A">高表达的致密多糖荚膜让血流中的菌簇更难被清除。</font><p>本体：<font color="#CC241D">270</font><br>致密荚膜：<font color="#CC241D">1100</font></p>',
	CanPass(row, laneType) {
		return laneType === 2;
	},
	getRaven: oThickCapsuleMeningococcalCluster.prototype.getRaven,
	getGranuleHit: oThickCapsuleMeningococcalCluster.prototype.getGranuleHit,
	getDiffuseHit: oThickCapsuleMeningococcalCluster.prototype.getDiffuseHit,
});

var oListeriaMonocyteCarrier = InheritO(
	typeof oSnorkelZombie === "undefined" ? OrnNoneZombies : oSnorkelZombie,
	{
	EName: "oListeriaMonocyteCarrier",
	CName: "单核细胞内李斯特菌载体",
	width: 143,
	height: 200,
	beAttackedPointL: 40,
	beAttackedPointR: 100,
	StandGif: 4,
	AlmanacGif: 4,
	AttackGif: 5,
	HeadGif: 6,
	DieGif: 7,
	WalkGif0: 2,
	WalkGif1: 3,
	HP: 270,
	BreakPoint: 90,
	Lvl: 1,
	SunNum: 75,
	OSpeed: 3.2,
	Speed: 3.2,
	Attack: 100,
	AttackInterval: 100,
	Altitude: 1,
	JumpTime: 40,
	HideTransitionDelay: 160,
	HiddenSpeed: 2,
	HiddenAltitude: 0,
	AttackAltitude: 1,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	BloodstreamOnly: true,
	IntracellularCarrier: true,
	CarrierCellType: "monocyte",
	PicArr: [
		"images/immune_mod/cards/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
		"images/immune_mod/enemies/listeria_monocyte_carrier.png",
	],
	Tooltip: "处于单核细胞内时避开普通细胞外攻击；接触防线后暴露并攻击。",
	Produce:
		'<font color="#28325A">李斯特菌可在部分单核细胞内获得暂时庇护，躲开体液中的直接攻击；这不代表对免疫系统完全不可见。</font><p>胞内：<font color="#167C91">普通攻击难以命中</font><br>接敌：<font color="#CC241D">暴露并攻击</font></p>',
	CanPass(row, laneType) {
		return laneType === 2;
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
});

var oStaphFibrinBiofilmFront = InheritO(
	typeof oZomboni === "undefined" ? OrnNoneZombies : oZomboni,
	{
	EName: "oStaphFibrinBiofilmFront",
	CName: "金葡菌纤维蛋白生物膜前锋",
	HP: 1350,
	BreakPoint: 200,
	Lvl: 3,
	SunNum: 350,
	width: 464,
	height: 364,
	GetDTop: 104,
	beAttackedPointL: 140,
	beAttackedPointR: 290,
	StandGif: 2,
	AlmanacGif: 2,
	DieGif: 6,
	BoomDieGif: 7,
	OSpeed: 2.5,
	Speed: 2.5,
	AKind: 2,
	Attack: 50,
	TrailCleanupDelay: 3000,
	TrackDomPrefix: "dIceCar",
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: false,
	CapsuleBlocksPhagocytosis: true,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	FibrinBiofilmFront: true,
	GetDY() {
		return 0;
	},
	PicArr: [
		"images/immune_mod/cards/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/enemies/staph_fibrin_biofilm_front.png",
		"images/immune_mod/ui/fibrin_biofilm_track.svg",
		"images/immune_mod/ui/fibrin_biofilm_track_cap.svg",
	],
	Tooltip: "碾过部署位并留下暂时不可部署的纤维蛋白-生物膜障碍；不表现为车辆或冰道。",
	Produce:
		'<font color="#28325A">金黄色葡萄球菌借助纤维蛋白形成向前扩展的生物膜团块。</font><p>本体：<font color="#CC241D">1350</font><br>特殊：<font color="#CC241D">碾压并留下纤维蛋白-生物膜轨迹</font></p>',
	ApplyFrontDamage(self, damage) {
		const hp = (self.HP -= damage);
		if (hp < self.BreakPoint) {
			self.GoingDie();
			self.getHit = self.getHit0 = self.getHit1 = self.getHit2 = self.getHit3 = function () {};
			return;
		}
		if (self.EleBody) {
			if (hp < 391) self.EleBody.src = self.PicArr[4];
			else if (hp < 871) self.EleBody.src = self.PicArr[3];
		}
		if (typeof self.SetAlpha === "function") {
			self.SetAlpha(self, self.EleBody, 50, 0.5);
			oSym.addTask(
				10,
				(id) => {
					const front = $Z[id];
					front && front.SetAlpha(front, front.EleBody, 100, 1);
				},
				[self.id]
			);
		}
	},
	getHit(self, damage) {
		self.ApplyFrontDamage(self, damage);
	},
	getHit0(self, damage) {
		self.ApplyFrontDamage(self, damage);
	},
	getHit1(self, damage) {
		self.ApplyFrontDamage(self, damage);
	},
	getHit2(self, damage) {
		self.ApplyFrontDamage(self, damage);
	},
	getHit3(self, damage) {
		self.ApplyFrontDamage(self, damage);
	},
	getPea(self, damage) {
		self.getHit0(self, damage);
	},
	getFirePea(self, damage) {
		self.getHit0(self, damage);
	},
	getSnowPea(self, damage) {
		self.getHit0(self, damage);
	},
	getFreeze(self) {
		self.getHit0(self, 20);
	},
	getFirePeaSputtering() {},
	getGranuleHit(self, damage) {
		self.getHit0(self, damage);
	},
	getDiffuseHit(self, damage) {
		self.getHit0(self, damage);
	},
	getRaven() {
		ImmuneMod.showCombatHint(this, "大型生物膜无法直接吞噬", "blocked");
		return 0;
	},
	BirthCallBack(self) {
		const delay = self.delayT;
		const id = self.id;
		const wrapper = (self.Ele = $(id));
		const row = self.R;
		const tracks = oGd.$Ice;
		self.EleShadow = wrapper.firstChild;
		self.EleBody = wrapper.childNodes[1];
		if (!tracks[row]) {
			const track = NewEle(
				self.TrackDomPrefix + row,
				"div",
				"position:absolute;z-index:1;left:145px;top:" +
					(GetY(row) - 65) +
					"px;width:800px;height:72px",
				{ className: "immune-fibrin-biofilm-track" },
				EDPZ
			);
			NewImg(
				"",
				"images/interface/blank.png",
				"position:absolute;clip:rect(0,auto,auto,800px);width:800px;height:72px;left:5px;background:url(" +
					self.PicArr[8] +
					") repeat-x",
				track
			);
			NewImg(
				"",
				self.PicArr[9],
				"position:absolute;display:none;left:0",
				track
			);
			tracks[row] = [1, 11, self.AttackedLX];
		} else {
			++tracks[row][0];
		}
		if (delay) {
			oSym.addTask(
				delay,
				(targetId, element) => {
					const front = $Z[targetId];
					if (!front) return;
					front.FreeSetbodyTime = 0;
					typeof SetBlock === "function" && SetBlock(element);
				},
				[id, wrapper]
			);
		} else if (typeof SetBlock === "function") {
			SetBlock(wrapper);
		}
	},
	flatTire() {
		const front = this;
		front.EleBody.src = front.PicArr[5];
		front.beAttacked = 0;
		front.HP = 0;
		front.getHit0 = front.getHit1 = front.getHit2 = front.getHit3 = function () {};
		front.ChkActs = front.ChkActs1 = function () {};
		oSym.addTask(
			290,
			(id) => {
				const liveFront = $Z[id];
				liveFront && liveFront.NormalDie();
			},
			[front.id]
		);
	},
	JudgeIce() {
		const row = this.R;
		const track = $(this.TrackDomPrefix + row);
		const state = oGd.$Ice[row];
		if (!state) return;
		track?.childNodes[1] && typeof SetBlock === "function" && SetBlock(track.childNodes[1]);
		if (--state[0] <= 0) {
			oSym.addTask(
				this.TrailCleanupDelay,
				(node, targetRow) => {
					const current = oGd.$Ice[targetRow];
					if (!current || current[0] > 0 || !node) return;
					ClearChild(node);
					let column = current[1];
					while (column < 11) {
						delete oGd.$Crater[targetRow + "_" + column++];
					}
					delete oGd.$Ice[targetRow];
				},
				[track, row]
			);
		}
	},
	ChkActs:
		typeof oZomboni === "undefined"
			? function () {
					return 1;
				}
			: oZomboni.prototype.ChkActs,
});

var oMechanobactericidalNanopillarArray = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oMechanobactericidalNanopillarArray",
	CName: "仿生杀菌微柱阵列",
	width: 85,
	height: 48,
	beAttackedPointL: 10,
	beAttackedPointR: 75,
	SunNum: 100,
	Stature: -1,
	canEat: 0,
	Attack: 20,
	ContactDamage: 20,
	TargetLockDuration: 100,
	AttackResetDelay: 60,
	ArZ: null,
	PicArr: [
		"images/immune_mod/cards/mechanobactericidal_nanopillar_array.png",
		"images/immune_mod/units/mechanobactericidal_nanopillar_array.png",
		"images/immune_mod/units/mechanobactericidal_nanopillar_array.png",
		"images/immune_mod/units/mechanobactericidal_nanopillar_array_attack.png",
	],
	Tooltip: "只对踩过阵列表面的细菌和真菌造成接触损伤，并可破坏大型生物膜前锋。",
	Produce:
		'<font color="#28325A">仿生微柱利用表面机械应力破坏接触它的细菌与真菌，不会把病毒或癌细胞误表现为可被同一机制刺破。</font><p>伤害：<font color="#CC241D">20</font><br>位置：<font color="#167C91">地表部署</font></p>',
	TargetFilter(target) {
		return (
			target &&
			target.Altitude === 1 &&
			target.beAttacked &&
			ImmuneMod.isGranuleTarget(target)
		);
	},
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		const placement = oS.ArP;
		return placement
			? column > 0 &&
				column < placement.ArC[1] &&
				oGd.$LF[row] === 1 &&
				!(cells[1] || cells[0])
			: !(
					column < 1 ||
					column > 9 ||
					oGd.$LF[row] - 1 ||
					cells[1] ||
					cells[0] ||
					oGd.$Crater[key] ||
					oGd.$Tombstones[key]
				);
	},
	PrivateBirth(self) {
		self.ArZ = Object.create(null);
	},
	getHurt(attacker, attackKind, damage) {
		switch (attackKind) {
			case 2:
				if (typeof attacker?.flatTire === "function") {
					attacker.flatTire();
				}
				this.Die();
				break;
			case 1:
				if (this.TargetFilter(attacker) && typeof attacker.getHit2 === "function") {
					attacker.getHit2(attacker, this.ContactDamage, 0);
				}
				this.Die();
				break;
			default:
				(this.HP -= damage) < 1 && this.Die();
		}
	},
	NormalAttack(targetId) {
		const target = $Z[targetId];
		if (!this.TargetFilter(target) || typeof target.getHit2 !== "function") return;
		target.getHit2(target, this.ContactDamage, 0);

		const id = this.id;
		const body = $(id)?.childNodes?.[1];
		if (body) body.src = this.PicArr[3];
		this.AttackState = (this.AttackState || 0) + 1;
		oSym.addTask(
			this.AttackResetDelay,
			(plantId) => {
				const plant = $P[plantId];
				if (!plant) return;
				plant.AttackState--;
				if (plant.AttackState <= 0) {
					plant.AttackState = 0;
					const liveBody = $(plantId)?.childNodes?.[1];
					if (liveBody) liveBody.src = plant.PicArr[2];
				}
			},
			[id]
		);
	},
	GetDY() {
		return -2;
	},
	getTriggerRange() {
		return [[this.pixelLeft - 80, this.pixelRight + 80, 0]];
	},
	TriggerCheck(target) {
		const targetId = target.id;
		const locks = this.ArZ || (this.ArZ = Object.create(null));
		const targetLeft = target.AttackedLX;
		const targetRight = target.AttackedRX;
		const fieldLeft = this.AttackedLX;
		const fieldRight = this.AttackedRX;
		if (
			target.PZ &&
			!locks[targetId] &&
			((targetLeft <= fieldRight && targetLeft >= fieldLeft) ||
				(targetRight <= fieldRight && targetRight >= fieldLeft) ||
				(targetLeft <= fieldLeft && targetRight >= fieldRight)) &&
			this.AttackCheck2(target)
		) {
			locks[targetId] = 1;
			this.NormalAttack(targetId);
			oSym.addTask(
				this.TargetLockDuration,
				(plantId, pathogenId) => {
					const plant = $P[plantId];
					plant?.ArZ && delete plant.ArZ[pathogenId];
				},
				[this.id, targetId]
			);
		}
	},
	AttackCheck2(target) {
		return target.Altitude === 1 && target.beAttacked && this.TargetFilter(target);
	},
});

var oMPOOxidativeAmplificationSite = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oMPOOxidativeAmplificationSite",
	CName: "髓过氧化物酶氧化放大位点",
	width: 73,
	height: 83,
	beAttackedPointL: 20,
	beAttackedPointR: 53,
	SunNum: 175,
	Damage: 40,
	SplashDamage: 13,
	SplashWidth: 40,
	CanOxidativelyAmplify: true,
	PicArr: [
		"images/immune_mod/cards/mpo_oxidative_amplification_site.png",
		"images/immune_mod/units/mpo_oxidative_amplification_site.png",
		"images/immune_mod/units/mpo_oxidative_amplification_site.png",
		"images/immune_mod/ui/oxidative_droplet.svg",
		"images/immune_mod/ui/oxidative_droplet.svg",
		"images/immune_mod/ui/oxidative_droplet_hit.svg",
		"images/immune_mod/ui/oxidative_droplet_hit.svg",
		"images/immune_mod/units/mpo_oxidative_amplification_site.png",
	],
	Tooltip: "抗菌颗粒穿过后只增幅一次，直接伤害提升到 40，并产生 13 点小范围氧化溅射。",
	Produce:
		'<font color="#28325A">髓过氧化物酶在局部将中性粒细胞的抗菌颗粒放大为更强的氧化杀菌反应。</font><p>增幅：<font color="#CC241D">20 → 40</font><br>溅射：<font color="#CC7A2D">13</font></p>',
	PrivateBirth(self) {
		const sites = oGd.$Torch || (oGd.$Torch = {});
		sites[self.R + "_" + self.C] = self.id;
		oS.HaveFog && oGd.GatherFog(self.R, self.C, 1, 1, 0);
	},
	InitTrigger() {},
	PrivateDie(self) {
		const key = self.R + "_" + self.C;
		if (oGd.$Torch?.[key] === self.id) delete oGd.$Torch[key];
		oS.HaveFog && oGd.GatherFog(self.R, self.C, 1, 1, 1);
	},
});

var oReinforcedEndothelialPericyteBarrier = InheritO(oEpithelialBarrier, {
	...ImmunePlantBase,
	EName: "oReinforcedEndothelialPericyteBarrier",
	CName: "加固型内皮-周细胞屏障",
	width: 83,
	height: 119,
	beAttackedPointL: 20,
	beAttackedPointR: 63,
	SunNum: 125,
	HP: 8000,
	coolTime: 24.5,
	Stature: 1,
	HurtStatus: 0,
	PicArr: [
		"images/immune_mod/cards/reinforced_endothelial_pericyte_barrier.png",
		"images/immune_mod/units/reinforced_endothelial_pericyte_barrier.png",
		"images/immune_mod/units/reinforced_endothelial_pericyte_barrier.png",
		"images/immune_mod/units/reinforced_endothelial_pericyte_barrier_damage1.png",
		"images/immune_mod/units/reinforced_endothelial_pericyte_barrier_damage2.png",
	],
	Tooltip: "极高耐久的高屏障，能阻止一次性跨越单位从其上方越过。",
	Produce:
		'<font color="#28325A">周细胞、基底膜与内皮紧密连接共同形成更厚实的血管屏障。</font><p>耐久：<font color="#CC241D">极高</font><br>特点：<font color="#167C91">不可被跨越</font></p>',
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		const upperPlant = cells[1];
		const placement = oS.ArP;
		return placement
			? oGd.$LF[row] === 1
				? column > 0 &&
					column < placement.ArC[1] &&
					!(oGd.$Crater[key] || oGd.$Tombstones[key] || upperPlant)
				: cells[0] && !upperPlant
			: upperPlant && upperPlant.EName === this.EName
				? 1
				: oGd.$LF[row] === 1
					? !(
							column < 1 ||
							column > 9 ||
							oGd.$Crater[key] ||
							oGd.$Tombstones[key] ||
							upperPlant
						)
					: cells[0] && !upperPlant;
	},
	getHurt(attacker, attackKind, damage) {
		if (attackKind % 3) {
			this.Die(1);
			return;
		}
		this.HP -= damage;
		if (this.HP < 1) {
			this.Die();
			return;
		}
		const body = $(this.id)?.childNodes?.[1];
		if (this.HP < 2667) {
			if (this.HurtStatus < 2) {
				this.HurtStatus = 2;
				if (body) body.src = this.PicArr[4];
			}
		} else if (this.HP < 5333 && this.HurtStatus < 1) {
			this.HurtStatus = 1;
			if (body) body.src = this.PicArr[3];
		}
	},
});

var oMicrovascularPerfusionNode = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oMicrovascularPerfusionNode",
	CName: "微血管灌注支点",
	width: 72,
	height: 68,
	beAttackedPointL: 20,
	beAttackedPointR: 52,
	SunNum: 0,
	canEat: 0,
	CanDisplay: 0,
	CanSelect: 0,
	PKind: 0,
	Stature: -1,
	PicArr: [
		"images/immune_mod/cards/local_capillary_perfusion_network.png",
		"images/immune_mod/units/microvascular_perfusion_node.png",
		"images/immune_mod/units/microvascular_perfusion_node.png",
	],
	Tooltip: "",
	Produce: "",
	GetDY() {
		return -15;
	},
	getShadow() {
		return "display:none";
	},
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		const laneType = oGd.$LF[row];
		const outOfBounds = column < 1 || column > 9;
		return laneType % 2
			? laneType < 3
				? !(
						outOfBounds ||
						cells[1] ||
						cells[2] ||
						cells[0] ||
						oGd.$Crater[key] ||
						oGd.$Tombstones[key]
					)
				: !(outOfBounds || cells[0] || oGd.$Crater[key])
			: false;
	},
	InitTrigger() {},
});

var oLocalCapillaryPerfusionNetwork = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oLocalCapillaryPerfusionNetwork",
	CName: "局部毛细血管灌注网",
	width: 115,
	height: 102,
	beAttackedPointL: 20,
	beAttackedPointR: 53,
	SunNum: 25,
	HP: 300,
	coolTime: 7.5,
	PicArr: [
		"images/immune_mod/cards/local_capillary_perfusion_network.png",
		"images/immune_mod/units/local_capillary_perfusion_network.png",
		"images/immune_mod/units/local_capillary_perfusion_network.png",
	],
	Tooltip: "部署后在周围空位建立微血管灌注支点，为后续组织关卡提供局部灌注基础。",
	Produce:
		'<font color="#28325A">局部毛细血管网把氧和葡萄糖送到邻近组织，并在可用空位形成灌注支点。</font><p>范围：<font color="#CC241D">周围 3×3</font></p>',
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		const laneType = oGd.$LF[row];
		const outOfBounds = column < 1 || column > 9;
		return laneType % 2
			? laneType < 3
				? !(
						outOfBounds ||
						cells[1] ||
						cells[2] ||
						cells[0] ||
						oGd.$Crater[key] ||
						oGd.$Tombstones[key]
					)
				: !(outOfBounds || cells[0] || oGd.$Crater[key])
			: false;
	},
	NormalAttack() {},
	PrivateBirth(self) {
		const maxRow = oS.R;
		const maxColumn = oS.C;
		const laneTypes = oGd.$LF;
		const grid = oGd.$;
		for (let row = self.R - 1; row <= self.R + 1; row++) {
			if (row < 1 || row > maxRow) continue;
			const laneType = laneTypes[row];
			for (let column = self.C - 1; column <= self.C + 1; column++) {
				if (
					column < 1 ||
					column > maxColumn ||
					(laneType !== 1 && laneType !== 3)
				) {
					continue;
				}
				const key = row + "_" + column + "_";
				if (!(grid[key + 0] || grid[key + 1] || grid[key + 2])) {
					CustomSpecial(oMicrovascularPerfusionNode, row, column);
				}
			}
		}
	},
});

var oPiliatedInvasiveMeningococcalCluster = InheritO(
	typeof oDolphinRiderZombie === "undefined"
		? oMeningococcalBloodstreamCluster
		: oDolphinRiderZombie,
	{
	EName: "oPiliatedInvasiveMeningococcalCluster",
	CName: "菌毛侵袭脑膜炎球菌簇",
	HP: 270,
	Lvl: 2,
	BreakPoint: 167,
	width: 282,
	height: 210,
	GetDTop: 0,
	Altitude: 1,
	haveDolphin: 1,
	JumpTime: 45,
	TraversalPrepareDelay: 240,
	TraversalResolveDelay: 50,
	LandingDelay: 170,
	ChargeSpeed: 10.8,
	PostTraversalSpeed: 1.6,
	beAttackedPointL: 110,
	beAttackedPointR: 190,
	SunNum: 350,
	OSpeed: 3.2,
	Speed: 3.2,
	Attack: 100,
	StandGif: 4,
	AttackGif: 5,
	HeadGif: 6,
	DieGif: 7,
	WalkGif0: 2,
	WalkGif1: 3,
	AlmanacGif: 4,
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: false,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	BloodstreamOnly: true,
	AudioArr: [],
	PicArr: [
		"images/immune_mod/cards/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/interface/blank.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster_exposed.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster_exposed.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster_exposed.png",
		"images/immune_mod/enemies/piliated_invasive_meningococcal_cluster_exposed.png",
	],
	Tooltip: "借助Ⅳ型菌毛高速跨过遇到的第一层普通防线；高屏障会截停这次侵袭。",
	Produce:
		'<font color="#28325A">脑膜炎奈瑟菌的Ⅳ型菌毛参与黏附、微菌落形成和跨越内皮屏障；游戏中对应一次高速跨越。</font><p>位置：<font color="#167C91">仅血流通道</font><br>特点：<font color="#CC241D">跨过首个普通单位后减速</font></p>',
	CanPass(row, laneType) {
		return laneType === 2;
	},
	getShadow() {
		return "left:105px;top:175px";
	},
	GetDX() {
		return -137;
	},
	GetDY() {
		return 0;
	},
	BirthCallBack(self) {
		const delay = self.delayT;
		const id = self.id;
		const wrapper = (self.Ele = $(id));
		if (!wrapper) return;
		const entryX = self.AttackedLX;
		self.EleShadow = wrapper.firstChild;
		self.EleBody = wrapper.childNodes[1];
		if (entryX > GetX(9)) {
			self.ChkActs = self.ChkActsL1;
			self.WalkStatus = 0;
		} else if (entryX < GetX(0)) {
			self.ChkActs = self.ChkActsL3;
			self.WalkStatus = 0;
		} else {
			self.ChkActs = self.ChkActsL2;
			self.WalkStatus = 1;
			self.EleBody.src = self.PicArr[(self.NormalGif = self.WalkGif1)];
			SetHidden(self.EleShadow);
		}
		if (delay) {
			oSym.addTask(
				delay,
				(pathogenId, element) => {
					const pathogen = $Z[pathogenId];
					if (!pathogen) return;
					pathogen.FreeSetbodyTime = 0;
					typeof SetBlock === "function" && SetBlock(element);
				},
				[id, wrapper]
			);
		} else if (typeof SetBlock === "function") {
			SetBlock(wrapper);
		}
	},
	Jump(self) {
		if (!self.beAttacked) return;
		self.Altitude = 2;
		SetHidden(self.EleShadow);
		self.EleBody.src = self.PicArr[8];
		oSym.addTask(
			self.TraversalPrepareDelay,
			(pathogenId, expected) => {
				const pathogen = $Z[pathogenId];
				if (!pathogen || !expected.beAttacked) return;
				pathogen.WalkStatus = 1;
				pathogen.Altitude = 1;
				pathogen.OSpeed = pathogen.Speed = pathogen.ChargeSpeed;
				const left = (pathogen.X -= 140);
				SetStyle(pathogen.Ele, { left: left + "px" });
				pathogen.AttackedLX = left + (pathogen.beAttackedPointL = 185);
				pathogen.AttackedRX = left + (pathogen.beAttackedPointR = 265);
				pathogen.EleBody.src = pathogen.PicArr[(pathogen.NormalGif = pathogen.WalkGif1)];
				pathogen.ChkActs = pathogen.ChkActsL2;
			},
			[self.id, self]
		);
		self.ChkActs = function () {
			return 1;
		};
	},
	ChkActsL1(self) {
		if (self.JumpTime <= 0) {
			self.Jump(self);
			return 1;
		}
		if (!(self.FreeFreezeTime || self.FreeSetbodyTime)) {
			const step = self.Speed;
			self.AttackedRX -= step;
			self.ZX = self.AttackedLX -= step;
			self.Ele.style.left = Math.floor((self.X -= step)) + "px";
			self.JumpTime--;
		}
		return 1;
	},
	getCrushed(plant) {
		this.NormalAttack(this.id, plant.id, plant.AttackedLX);
		this.getCrushed = function () {
			return false;
		};
		if (plant.Stature > 0) {
			oSym.addTask(
				this.TraversalResolveDelay,
				(pathogenId) => {
					const pathogen = $Z[pathogenId];
					pathogen && pathogen.CrushDie();
				},
				[this.id]
			);
		}
		return false;
	},
	getRaven(plantId) {
		const plant = $P[plantId];
		if (!this.isAttacking && plant) {
			this.NormalAttack(this.id, plantId, plant.AttackedLX);
		}
		return 0;
	},
	JudgeAttack() {
		const pathogen = this;
		const contactX = pathogen.ZX;
		const rowKey = pathogen.R + "_";
		const column = GetC(contactX);
		const grid = oGd.$;
		for (let testColumn = column - 2; testColumn <= column; testColumn++) {
			if (testColumn > 9) continue;
			for (let layer = 2; layer > -1; layer--) {
				const plant = grid[rowKey + testColumn + "_" + layer];
				if (
					!plant ||
					plant.AttackedRX < contactX ||
					plant.AttackedLX >= contactX
				) {
					continue;
				}
				pathogen.JudgeAttack = CZombies.prototype.JudgeAttack;
				if (plant.EName === "oBrains") {
					pathogen.NormalAttack = CZombies.prototype.NormalAttack;
					pathogen.NormalAttack(pathogen.id, plant.id);
				} else {
					pathogen.NormalAttack(pathogen.id, plant.id, plant.AttackedLX);
				}
				return;
			}
		}
	},
	AttackZombie2(self, targetId) {
		const target = $Z[targetId];
		target && self.NormalAttack(self.id, targetId, target.AttackedLX);
	},
	NormalAttack(pathogenId, plantId, landingX) {
		const pathogen = $Z[pathogenId];
		if (!pathogen) return;
		const element = pathogen.Ele;
		const shadow = pathogen.EleShadow;
		const body = pathogen.EleBody;
		body.src = pathogen.PicArr[9];
		SetHidden(shadow);
		pathogen.isAttacking = 1;
		pathogen.Altitude = 2;
		pathogen.haveDolphin = 0;
		pathogen.getFreeze = function () {
			pathogen.getSnow(pathogen, 20, 0);
		};
		oSym.addTask(
			pathogen.TraversalResolveDelay,
			(id, targetPlantId, targetX, wrapper, targetBody) => {
				const livePathogen = $Z[id];
				if (!livePathogen) return;
				const finishTraversal = function () {
					targetBody.src = livePathogen.PicArr[10];
					livePathogen.isAttacking = 0;
					livePathogen.Altitude = 1;
					livePathogen.OSpeed = livePathogen.Speed = livePathogen.PostTraversalSpeed;
					livePathogen.WalkGif0 = 11;
					livePathogen.NormalGif = livePathogen.WalkGif1 = 10;
					livePathogen.LostHeadGif = livePathogen.DieGif = 12;
					const base =
						typeof CZombies === "undefined"
							? OrnNoneZombies.prototype
							: CZombies.prototype;
					livePathogen.NormalAttack = base.NormalAttack;
					livePathogen.getCrushed = base.getCrushed;
					livePathogen.getFreeze = base.getFreeze;
					livePathogen.getRaven = base.getRaven;
					livePathogen.AttackZombie2 = base.AttackZombie2;
				};
				const plant = $P[targetPlantId];
				if (plant && plant.Stature > 0) {
					const contactRight = plant.AttackedRX;
					livePathogen.AttackedLX = livePathogen.ZX = contactRight;
					livePathogen.X = contactRight - (livePathogen.beAttackedPointL = 45);
					livePathogen.AttackedRX = livePathogen.X + (livePathogen.beAttackedPointR = 100);
					SetStyle(wrapper, { left: livePathogen.X + "px" });
					livePathogen.EleShadow.style.left = "45px";
					finishTraversal();
				} else {
					livePathogen.AttackedRX = targetX;
					livePathogen.X = targetX - (livePathogen.beAttackedPointR = 100);
					livePathogen.ZX = livePathogen.AttackedLX =
						livePathogen.X + (livePathogen.beAttackedPointL = 45);
					SetStyle(wrapper, { left: livePathogen.X + "px" });
					livePathogen.EleShadow.style.left = "45px";
					targetBody.src = livePathogen.PicArr[13];
					oSym.addTask(
						livePathogen.LandingDelay,
						(liveId) => {
							$Z[liveId] && finishTraversal();
						},
						[id]
					);
				}
			},
			[pathogenId, plantId, landingX, element, body]
		);
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	GoingDie() {
		const pathogen = this;
		const images = pathogen.PicArr;
		pathogen.EleBody.src = images[pathogen.haveDolphin ? 7 : 12];
		if (typeof pathogen.GoingDieHead === "function") {
			pathogen.GoingDieHead(pathogen.id, images, pathogen);
		}
		pathogen.beAttacked = 0;
		pathogen.FreeFreezeTime = pathogen.FreeSetbodyTime = pathogen.FreeSlowTime = 0;
		pathogen.AutoReduceHP(pathogen.id);
	},
});

/*
 * Stage 11 keeps the original levels 31-35 unit contracts.  The source plant
 * constructors are ES modules and are not available when this classic script
 * is evaluated, so their small state machines live here instead of depending
 * on the module-local originals.
 */
var StageElevenDirectTissueCanGrow = function (cells, row, column) {
	const key = row + "_" + column;
	const laneType = oGd.$LF[row];
	const outOfBounds = column < 1 || column > 9;
	return laneType % 2
		? laneType < 3
			? !(
					outOfBounds ||
					cells[1] ||
					cells[2] ||
					cells[0] ||
					oGd.$Crater[key] ||
					oGd.$Tombstones[key]
				)
			: !(outOfBounds || cells[0] || oGd.$Crater[key])
		: 0;
};

var StageElevenIsHostilePathogen = function (target, maxAltitude) {
	return !!(
		target &&
		target.PZ &&
		target.beAttacked &&
		(typeof target.HP !== "number" || target.HP > 0) &&
		target.PathogenClass !== "pathogen.cancer" &&
		target.PathogenClass !== "host.cancer" &&
		target.Altitude <= (maxAltitude ?? 1)
	);
};

var StageElevenIsTherapeuticallyOpsonizedTumor = function (target) {
	return !!(
		target &&
		target.PZ &&
		target.beAttacked &&
		(typeof target.HP !== "number" || target.HP > 0) &&
		target.Altitude <= 1 &&
		(target.PathogenClass === "pathogen.cancer" ||
			target.PathogenClass === "host.cancer") &&
		target.TherapeuticAntibodyCoated === true &&
		target.TumorPhagocytosisTarget === true
	);
};

var StageElevenIsGranulePathogen = function (target) {
	return StageElevenIsHostilePathogen(target, 1) && ImmuneMod.isGranuleTarget(target);
};

var oChemotacticNeutrophilPatrol = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oChemotacticNeutrophilPatrol",
	CName: "趋化巡逻中性粒细胞",
	width: 71,
	height: 71,
	beAttackedPointL: 10,
	beAttackedPointR: 61,
	SunNum: 75,
	HP: 4e3,
	canEat: 0,
	CanAttack: 1,
	PicArr: [
		"images/immune_mod/cards/chemotactic_neutrophil_patrol.png",
		"images/immune_mod/units/chemotactic_neutrophil_patrol.png",
		"images/immune_mod/units/chemotactic_neutrophil_patrol.png",
	],
	Tooltip: "沿组织通道持续向前巡逻；撞上可清除的细菌或真菌后会转向邻近通道。",
	Produce:
		'<font color="#28325A">中性粒细胞沿趋化信号巡逻，并在接触微生物后改变迁移方向。</font><p>耐久：<font color="#CC241D">4000</font><br>特点：<font color="#167C91">碰撞清除并折返</font></p>',
	CanGrow: StageElevenDirectTissueCanGrow,
	InitTrigger() {},
	getHurt() {},
	NormalAttack: null,
	TargetFilter(target) {
		return StageElevenIsGranulePathogen(target);
	},
	PrivateBirth(self) {
		const wrapper = $(self.id);
		const moveRoll = function (
			patrol,
			boardWidth,
			attackedLeft,
			attackedRight,
			pixelLeft,
			element,
			verticalDirection,
			topBoundary,
			bottomBoundary
		) {
			const oldRow = patrol.R;
			const oldColumn = patrol.C;
			let target;
			let targetId;
			let nextRow;
			let nextColumn;
			let changedCell = false;

			if (
				patrol.CanAttack &&
				(target = oZ.getZ0(attackedRight, oldRow)) &&
				patrol.TargetFilter(target) &&
				typeof target.getCrushed === "function" &&
				target.getCrushed(patrol)
			) {
				targetId = target.id;
				switch (target.Ornaments) {
					case 0:
						target.NormalDie();
						break;
					case 1:
						target.getHit0(target, Math.min(target.OrnHP, 900), 0);
						break;
					default:
						patrol.side
							? target.Normaldie()
							: target.CheckOrnHP(
									target,
									targetId,
									target.OrnHP,
									400,
									target.PicArr,
									0,
									0,
									0
								);
				}

				patrol.CanAttack = 0;
				switch (oldRow) {
					case oS.R:
						verticalDirection = -1;
						break;
					case 1:
						verticalDirection = 1;
						break;
					default:
						switch (verticalDirection) {
							case 1:
								verticalDirection = -1;
								break;
							case -1:
								verticalDirection = 1;
								break;
							default:
								verticalDirection = Math.random() > 0.5 ? 1 : -1;
						}
				}
				oSym.addTask(1, moveRoll, [
					patrol,
					boardWidth,
					patrol.AttackedLX + 20,
					patrol.AttackedRX + 20,
					patrol.pixelLeft + 20,
					element,
					verticalDirection,
					topBoundary,
					bottomBoundary,
				]);
				return;
			}

			switch (verticalDirection) {
				case 1:
					patrol.pixelBottom + 2 > bottomBoundary && (verticalDirection = -1);
					break;
				case -1:
					patrol.pixelBottom - 2 < topBoundary && (verticalDirection = 1);
			}

			if (attackedLeft > boardWidth) {
				patrol.Die();
				return;
			}

			nextColumn = GetC((patrol.pixelRight += 2));
			patrol.AttackedLX = attackedLeft += 2;
			patrol.AttackedRX = attackedRight += 2;
			nextRow = GetR((patrol.pixelBottom += verticalDirection * 2));
			SetStyle(element, {
				left: (patrol.pixelLeft = pixelLeft += 2) + "px",
				top: (patrol.pixelTop += verticalDirection * 2) + "px",
			});

			if (nextRow !== oldRow) {
				patrol.R = nextRow;
				changedCell = true;
				if (!patrol.CanAttack) patrol.CanAttack = 1;
			}
			if (nextColumn !== oldColumn) {
				patrol.C = nextColumn;
				changedCell = true;
			}
			if (changedCell) {
				oGd.del({ R: oldRow, C: oldColumn, PKind: 1 });
				oGd.add(patrol, nextRow + "_" + nextColumn + "_1");
			}
			oSym.addTask(1, moveRoll, [
				patrol,
				boardWidth,
				patrol.AttackedLX,
				patrol.AttackedRX,
				patrol.pixelLeft,
				element,
				verticalDirection,
				topBoundary,
				bottomBoundary,
			]);
		};

		moveRoll(
			self,
			oS.W,
			self.AttackedLX,
			self.AttackedRX,
			self.pixelLeft,
			wrapper,
			0,
			GetY1Y2(1)[0],
			600
		);
	},
});

var oIgMComplementCaptureComplex = InheritO(oPlateletFibrinCaptureNet, {
	...ImmunePlantBase,
	EName: "oIgMComplementCaptureComplex",
	CName: "IgM-补体凝集捕获",
	width: 75,
	height: 226,
	beAttackedPointL: 20,
	beAttackedPointR: 80,
	SunNum: 50,
	coolTime: 7.5,
	HP: 300,
	NormalGif: 1,
	CaptureDelay: 50,
	PicArr: [
		"images/immune_mod/cards/igm_complement_capture_complex.png",
		"images/immune_mod/units/igm_complement_capture_complex.png",
		"images/immune_mod/units/igm_complement_capture_complex.png",
		"images/immune_mod/ui/igm_capture_lattice.svg",
		"images/immune_mod/ui/igm_capture_lattice.svg",
	],
	Tooltip: "接触后凝集并固定一个细菌或真菌，50 tick 后捕获复合物共同离场。",
	Produce:
		'<font color="#28325A">IgM 的多价结合与补体沉积共同形成局部凝集捕获。</font><p>用途：<font color="#CC241D">单次捕获</font><br>位置：<font color="#167C91">组织通道可直接部署</font></p>',
	CanGrow: StageElevenDirectTissueCanGrow,
	GetDY() {
		return 5;
	},
	getShadow: CPlants.prototype.getShadow,
	BirthStyle(self, id, wrapper, style) {
		if (wrapper.childNodes?.[1]) wrapper.childNodes[1].src = self.PicArr[2];
		ImmunePlantBase.BirthStyle(self, id, wrapper, style);
	},
	TargetFilter(target) {
		return StageElevenIsGranulePathogen(target);
	},
	NormalAttack(complex, target) {
		complex.getHurt = function () {};
		target.getHurt = function () {};
		target.beAttacked = 0;
		target.isAttacking = 1;
		if (target.Ele) {
			NewImg(
				0,
				complex.PicArr[3],
				"left:" +
					target.beAttackedPointL +
					"px;top:" +
					(target.height - 67) +
					"px",
				target.Ele
			);
		}
		oSym.addTask(
			complex.CaptureDelay,
			(complexId, targetId, splashImage) => {
				const liveComplex = $P[complexId];
				const liveTarget = $Z[targetId];
				if (liveTarget && EDPZ) {
					const splash = NewImg(
						"ImmuneIgMCapture" + Math.random(),
						splashImage,
						"left:" +
							(liveTarget.AttackedLX - 10) +
							"px;top:" +
							(liveTarget.pixelTop + liveTarget.height - 88) +
							"px;width:97px;height:88px;z-index:" +
							(liveTarget.zIndex + 2),
						EDPZ
					);
					oSym.addTask(70, ClearChild, [splash]);
				}
				if (liveTarget) liveTarget.DisappearDie();
				if (liveComplex) liveComplex.Die();
			},
			[complex.id, target.id, complex.PicArr[4]]
		);
	},
});

var oMedullarySinusMacrophage = InheritO(oDefensinEpithelium, {
	...ImmunePlantBase,
	EName: "oMedullarySinusMacrophage",
	CName: "髓窦巨噬细胞",
	Sleep: 0,
	width: 100,
	height: 100,
	beAttackedPointL: 15,
	beAttackedPointR: 25,
	SunNum: 25,
	coolTime: 7.5,
	HP: 300,
	Stature: -1,
	Damage: 20,
	CanOxidativelyCatalyze: false,
	ProjectileRevealDelay: 15,
	ProjectileStep: 5,
	ProjectileHitDelay: 10,
	PicArr: [
		"images/immune_mod/cards/medullary_sinus_macrophage.png",
		"images/immune_mod/units/medullary_sinus_macrophage.png",
		"images/immune_mod/units/medullary_sinus_macrophage.png",
		"images/immune_mod/units/medullary_sinus_macrophage.png",
		"images/immune_mod/ui/phagocytic_particle.svg",
		"images/immune_mod/ui/phagocytic_particle_hit.svg",
	],
	Tooltip: "在前方 250 像素内发射短程吞噬信号颗粒。",
	Produce:
		'<font color="#28325A">髓窦巨噬细胞截留随淋巴进入的微生物，并在短距离内快速响应。</font><p>伤害：<font color="#CC241D">20</font><br>范围：<font color="#167C91">短</font></p>',
	CanGrow: StageElevenDirectTissueCanGrow,
	BirthStyle(self, id, wrapper, style) {
		ImmunePlantBase.BirthStyle(self, id, wrapper, style);
	},
	TargetFilter(target) {
		return (
			StageElevenIsGranulePathogen(target) ||
			StageElevenIsTherapeuticallyOpsonizedTumor(target)
		);
	},
	AttackCheck2(target) {
		return this.TargetFilter(target);
	},
	getTriggerRange(row, left, right) {
		return [[left, Math.min(right + 250, oS.W), 0]];
	},
	PrivateBirth(self) {
		self.BulletEle = NewImg(
			0,
			self.PicArr[4],
			"left:" +
				(self.AttackedLX - 46) +
				"px;top:" +
				(self.pixelTop + 40) +
				"px;visibility:hidden;z-index:" +
				(self.zIndex + 2)
		);
	},
	PrivateDie(self) {
		self.BulletEle = null;
	},
	NormalAttack() {
		const macrophage = this;
		const bulletId = "ImmuneMedullaryParticle" + Math.random();
		const startX = macrophage.AttackedLX;
		const bullet = EditEle(
			macrophage.BulletEle.cloneNode(false),
			{ id: bulletId },
			0,
			EDPZ
		);
		oSym.addTask(
			macrophage.ProjectileRevealDelay,
			(id) => {
				const liveBullet = $(id);
				if (liveBullet) SetVisible(liveBullet);
			},
			[bulletId]
		);

		const moveParticle = function (id, element, x, row, cssLeft, shooter) {
			if (!element || !shooter) {
				ClearChild(element);
				return;
			}
			const target = oZ.getZ0(x, row);
			if (shooter.TargetFilter(target)) {
				if (typeof target.getPea === "function") {
					target.getPea(target, shooter.Damage, 0);
				}
				SetStyle(element, { left: cssLeft + 38 + "px" }).src =
					shooter.PicArr[5];
				oSym.addTask(shooter.ProjectileHitDelay, ClearChild, [element]);
				return;
			}
			x += shooter.ProjectileStep;
			cssLeft += shooter.ProjectileStep;
			if (x < oS.W) {
				element.style.left = cssLeft + "px";
				oSym.addTask(1, moveParticle, [id, element, x, row, cssLeft, shooter]);
			} else {
				ClearChild(element);
			}
		};

		oSym.addTask(1, moveParticle, [
			bulletId,
			bullet,
			startX,
			macrophage.R,
			startX - 46,
			macrophage,
		]);
	},
});

var oCD169SubcapsularMacrophageBarrier = InheritO(
	oReinforcedEndothelialPericyteBarrier,
	{
		...ImmunePlantBase,
		EName: "oCD169SubcapsularMacrophageBarrier",
		CName: "CD169⁺被膜下窦屏障",
		width: 155,
		height: 130,
		beAttackedPointL: 63,
		beAttackedPointR: 75,
		SunNum: 150,
		coolTime: 7.5,
		HP: 11e3,
		Stature: 1,
		canEat: 1,
		Attack: 40,
		TargetLockDuration: 100,
		ArZ: null,
		PicArr: [
			"images/immune_mod/cards/cd169_subcapsular_macrophage_barrier.png",
			"images/immune_mod/units/cd169_subcapsular_macrophage_barrier.png",
			"images/immune_mod/units/cd169_subcapsular_macrophage_barrier_damaged.png",
		],
		Tooltip: "11000 点高耐久屏障；接触它或啃咬它的病原体会受到 40 点反击伤害。",
		Produce:
			'<font color="#28325A">CD169⁺ 被膜下窦巨噬细胞形成高密度截留屏障。</font><p>耐久：<font color="#CC241D">11000</font><br>接触反击：<font color="#167C91">40</font></p>',
		CanGrow: CPlants.prototype.CanGrow,
		InitTrigger: CPlants.prototype.InitTrigger,
		PrivateBirth(self) {
			self.ArZ = Object.create(null);
		},
		TargetFilter(target) {
			return StageElevenIsHostilePathogen(target, 1);
		},
		getHurt(attacker, attackKind, damage) {
			if (attackKind === 2 && typeof attacker?.flatTire === "function") {
				attacker.flatTire();
			} else if (
				attackKind === 1 &&
				this.TargetFilter(attacker) &&
				typeof attacker.getHit2 === "function"
			) {
				attacker.getHit2(attacker, this.Attack, 0);
			}

			const remainingHP = (this.HP -= damage);
			if (remainingHP < 1) {
				this.Die();
				return;
			}
			const body = $(this.id)?.childNodes?.[1];
			if (remainingHP < 101) {
				if (body) body.src = this.PicArr[2];
			} else if (remainingHP < 201 && body) {
				body.src = this.PicArr[2];
			}
		},
		NormalAttack(targetId) {
			const target = $Z[targetId];
			if (this.TargetFilter(target) && typeof target.getHit2 === "function") {
				target.getHit2(target, this.Attack, 0);
			}
		},
		getTriggerRange() {
			return [[this.pixelLeft - 80, this.pixelRight + 80, 0]];
		},
		TriggerCheck(target) {
			const targetId = target.id;
			const locks = this.ArZ || (this.ArZ = Object.create(null));
			const targetLeft = target.AttackedLX;
			const targetRight = target.AttackedRX;
			const fieldLeft = this.AttackedLX;
			const fieldRight = this.AttackedRX;
			if (
				target.PZ &&
				!locks[targetId] &&
				((targetLeft <= fieldRight && targetLeft >= fieldLeft) ||
					(targetRight <= fieldRight && targetRight >= fieldLeft) ||
					(targetLeft <= fieldLeft && targetRight >= fieldRight)) &&
				this.AttackCheck2(target)
			) {
				locks[targetId] = 1;
				this.NormalAttack(targetId);
				oSym.addTask(
					this.TargetLockDuration,
					(plantId, pathogenId) => {
						const barrier = $P[plantId];
						if (barrier?.ArZ) delete barrier.ArZ[pathogenId];
					},
					[this.id, targetId]
				);
			}
		},
		AttackCheck2(target) {
			return this.TargetFilter(target);
		},
	}
);

var oFollicularDendriticSignalRelay = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oFollicularDendriticSignalRelay",
	CName: "滤泡树突状细胞信号中继",
	CanDisplay: 0,
	CanSelect: 0,
	width: 77,
	height: 70,
	beAttackedPointL: 20,
	beAttackedPointR: 57,
	SunNum: 125,
	HP: 300,
	Damage: 20,
	ArFlyTime: null,
	ArHitX: null,
	PicArr: [
		"images/immune_mod/units/follicular_dendritic_signal_relay.png",
		"images/immune_mod/units/follicular_dendritic_signal_relay.png",
		"images/immune_mod/units/follicular_dendritic_signal_relay.png",
		"images/immune_mod/units/follicular_dendritic_signal_relay.png",
	],
	Tooltip: "",
	Produce: "",
	GetDY(row, column, cells) {
		return cells[0] ? -17 : -10;
	},
	TargetFilter(target) {
		return !!(
			target &&
			target.PZ &&
			target.beAttacked &&
			(typeof target.HP !== "number" || target.HP > 0)
		);
	},
	getTriggerRange(row, left, right) {
		const ownRow = this.R;
		const ownY = GetY(ownRow);
		const boardWidth = oS.W;
		const flyTimes =
			this.ArFlyTime || (this.ArFlyTime = Object.create(null));
		const hitPositions = this.ArHitX || (this.ArHitX = Object.create(null));
		const centerX = 0.5 * (left + right);
		let verticalDistance;

		switch (true) {
			case row < ownRow:
				verticalDistance = ownY - GetY(row);
				flyTimes[row] = [verticalDistance / 5, verticalDistance / 3];
				hitPositions[row] = [
					centerX,
					centerX + (verticalDistance / 3) * 4,
				];
				return [[100, boardWidth, 0]];
			case row === ownRow:
				return [[100, left + 25, 4]];
			default:
				verticalDistance = GetY(row) - ownY;
				flyTimes[row] = [verticalDistance / 5, verticalDistance / 3];
				hitPositions[row] = [
					centerX,
					centerX + (verticalDistance / 3) * 4,
				];
				return [[100, boardWidth, 0]];
		}
	},
	AttackCheck2(target) {
		if (!this.TargetFilter(target)) return false;
		const row = target.R;
		if (row === this.R) return target.Altitude > 0;

		const flyTimes = this.ArFlyTime?.[row];
		const hitPositions = this.ArHitX?.[row];
		if (!flyTimes || !hitPositions) return false;

		let index = 0;
		const targetLeft = target.AttackedLX;
		const targetRight = target.AttackedRX;
		const walkFactor = target.WalkDirection ? -1 : 1;
		const speed = target.Speed;
		while (index < flyTimes.length) {
			const movement = speed * flyTimes[index] * walkFactor * 0.1;
			const projectedLeft = Math.floor(targetLeft - movement);
			const projectedRight = Math.floor(targetRight - movement);
			const firstHitX = hitPositions[0];
			const secondHitX = hitPositions[1];
			if (
				(projectedLeft + 20 < firstHitX && projectedRight - 20 > firstHitX) ||
				(projectedLeft < secondHitX && projectedRight > secondHitX)
			) {
				return target.Altitude > 0;
			}
			index++;
		}
		return false;
	},
	getTriggerR() {
		return [1, oS.R];
	},
	PrivateBirth(self) {
		self.ArFlyTime = self.ArFlyTime || Object.create(null);
		self.ArHitX = self.ArHitX || Object.create(null);
		const centerX = self.pixelLeft + 38;
		self.BulletEle = NewImg(
			0,
			self.PicArr[3],
			"left:" +
				(centerX - 15) +
				"px;top:" +
				(self.pixelTop + 20) +
				"px;z-index:" +
				(self.zIndex + 2)
		);
	},
	PrivateDie(self) {
		self.BulletEle = null;
	},
	getHurt(attacker, attackKind, damage) {
		if (attackKind !== 3) this.NormalAttack();
		(this.HP -= damage) < 1 && this.Die();
	},
	NormalAttack() {
		const relay = this;
		const centerX = relay.pixelLeft + 38;
		const cssLeft = centerX - 15;
		const cssTop = relay.pixelTop + 20;
		const row = relay.R;
		const rightEdge = centerX + 15;
		const hitTarget = function (target, direction, projectile) {
			if (
				relay.TargetFilter(target) &&
				target.Altitude === 1 &&
				typeof target.getPea === "function"
			) {
				target.getPea(target, relay.Damage, direction);
				ClearChild(projectile);
				return false;
			}
			return true;
		};
		const makeProjectile = function (id) {
			const projectile = EditEle(
				relay.BulletEle.cloneNode(false),
				{ id: id },
				0,
				EDPZ
			);
			oSym.addTask(
				15,
				(projectileId) => {
					const liveProjectile = $(projectileId);
					if (liveProjectile) SetVisible(liveProjectile);
				},
				[id]
			);
			return projectile;
		};

		{
			const projectileId = "ImmuneRelaySignal" + Math.random();
			const projectile = makeProjectile(projectileId);
			oSym.addTask(
				1,
				function moveLeft(x, targetRow, left, element) {
					if (!hitTarget(oZ.getZ1(x, targetRow), 4, element)) return;
					x -= 5;
					left -= 5;
					if (x < 100) {
						ClearChild(element);
					} else {
						element.style.left = left + "px";
						oSym.addTask(1, moveLeft, [x, targetRow, left, element]);
					}
				},
				[centerX, row, cssLeft, projectile]
			);
		}

		{
			const projectileId = "ImmuneRelaySignal" + Math.random();
			const projectile = makeProjectile(projectileId);
			oSym.addTask(
				1,
				function moveUp(left, right, targetRow, top, element) {
					if (!hitTarget(oZ.getRangeLeftZ(left, right, targetRow), 6, element)) {
						return;
					}
					top -= 5;
					if (top < -15) {
						ClearChild(element);
					} else {
						element.style.top = top + "px";
						oSym.addTask(1, moveUp, [
							left,
							right,
							GetR(top + 15),
							top,
							element,
						]);
					}
				},
				[cssLeft, rightEdge, row, cssTop, projectile]
			);
		}

		{
			const projectileId = "ImmuneRelaySignal" + Math.random();
			const projectile = makeProjectile(projectileId);
			oSym.addTask(
				1,
				function moveDown(left, right, targetRow, top, element) {
					if (!hitTarget(oZ.getRangeLeftZ(left, right, targetRow), 2, element)) {
						return;
					}
					top += 5;
					if (top > 600) {
						ClearChild(element);
					} else {
						element.style.top = top + "px";
						oSym.addTask(1, moveDown, [
							left,
							right,
							GetR(top + 15),
							top,
							element,
						]);
					}
				},
				[cssLeft, rightEdge, row, cssTop, projectile]
			);
		}

		{
			const projectileId = "ImmuneRelaySignal" + Math.random();
			const projectile = makeProjectile(projectileId);
			oSym.addTask(
				1,
				function moveUpperRight(x, targetRow, left, top, element) {
					if (!hitTarget(oZ.getZ0(x, targetRow), 7, element)) return;
					x += 4;
					left += 4;
					top -= 3;
					if (x > 900 || top < -15) {
						ClearChild(element);
					} else {
						SetStyle(element, { left: left + "px", top: top + "px" });
						oSym.addTask(1, moveUpperRight, [
							x,
							GetR(top + 15),
							left,
							top,
							element,
						]);
					}
				},
				[centerX, row, cssLeft, cssTop, projectile]
			);
		}

		{
			const projectileId = "ImmuneRelaySignal" + Math.random();
			const projectile = makeProjectile(projectileId);
			oSym.addTask(
				1,
				function moveLowerRight(x, targetRow, left, top, element) {
					if (!hitTarget(oZ.getZ0(x, targetRow), 1, element)) return;
					x += 4;
					left += 4;
					top += 3;
					if (x > 900 || top > 600) {
						ClearChild(element);
					} else {
						SetStyle(element, { left: left + "px", top: top + "px" });
						oSym.addTask(1, moveLowerRight, [
							x,
							GetR(top + 15),
							left,
							top,
							element,
						]);
					}
				},
				[centerX, row, cssLeft, cssTop, projectile]
			);
		}
	},
});

var oChemotacticNeutrophilPatrolRoll = InheritO(
	oChemotacticNeutrophilPatrol,
	{
		EName: "oChemotacticNeutrophilPatrolRoll",
		CName: "趋化巡逻波",
		CanDisplay: 0,
		CanSelect: 0,
		SunNum: 75,
		coolTime: 50,
		HP: 0,
		Stature: 1,
		canEat: 0,
		PicArr: [
			"images/immune_mod/cards/chemotactic_neutrophil_patrol.png",
			"images/immune_mod/units/chemotactic_neutrophil_patrol_roll.png",
			"images/immune_mod/units/chemotactic_neutrophil_patrol_roll.png",
		],
		Tooltip: "",
		Produce: "",
		CanGrow() {
			return true;
		},
		PrivateBirth(self) {
			const wrapper = $(self.id);
			const movePatrolWave = function (
				patrol,
				boardWidth,
				attackedLeft,
				attackedRight,
				row,
				element
			) {
				const targets = oZ.getArZ(attackedLeft, attackedRight, row);
				for (let index = targets.length - 1; index >= 0; index--) {
					const target = targets[index];
					if (
						patrol.TargetFilter(target) &&
						typeof target.getCrushed === "function" &&
						target.getCrushed(patrol)
					) {
						target.CrushDie();
					}
				}

				if (attackedLeft > boardWidth) {
					patrol.Die();
					return;
				}

				const oldColumn = patrol.C;
				const nextColumn = GetC((patrol.pixelRight += 2));
				patrol.AttackedLX = attackedLeft += 2;
				patrol.AttackedRX = attackedRight += 2;
				element.style.left = (patrol.pixelLeft += 2) + "px";
				if (nextColumn !== oldColumn) {
					patrol.C = nextColumn;
					oGd.del({ R: row, C: oldColumn, PKind: 1 });
					oGd.add(patrol, row + "_" + nextColumn + "_1");
				}
				oSym.addTask(1, movePatrolWave, [
					patrol,
					boardWidth,
					attackedLeft,
					attackedRight,
					row,
					element,
				]);
			};
			movePatrolWave(
				self,
				oS.W,
				self.AttackedLX,
				self.AttackedRX,
				self.R,
				wrapper
			);
		},
	}
);

var oOpsonophagocyticClearanceZone = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oOpsonophagocyticClearanceZone",
	CName: "调理吞噬清除区",
	width: 83,
	height: 119,
	beAttackedPointL: 20,
	beAttackedPointR: 63,
	SunNum: 300,
	coolTime: 15,
	HP: 300,
	Damage: 130,
	PicArr: [
		"images/immune_mod/cards/opsonophagocytic_clearance_zone.png",
		"images/immune_mod/units/opsonophagocytic_clearance_zone.png",
		"images/immune_mod/units/opsonophagocytic_clearance_zone.png",
		"images/immune_mod/units/opsonophagocytic_clearance_zone.png",
		"images/immune_mod/units/opsonophagocytic_clearance_zone.png",
		"images/immune_mod/ui/opsonophagocytic_pulse.svg",
	],
	Tooltip: "对自身周围三行、左右各 120 像素内的敌对病原体造成 130 点伤害。",
	Produce:
		'<font color="#28325A">抗体和补体调理后，吞噬细胞在局部形成高效率清除区。</font><p>伤害：<font color="#CC241D">130</font><br>范围：<font color="#167C91">周围三行</font></p>',
	CanGrow: StageElevenDirectTissueCanGrow,
	BirthStyle(self, id, wrapper, style) {
		ImmunePlantBase.BirthStyle(self, id, wrapper, style);
	},
	TargetFilter(target) {
		return (
			StageElevenIsHostilePathogen(target, 1) ||
			StageElevenIsTherapeuticallyOpsonizedTumor(target)
		);
	},
	PrivateBirth(self) {
		NewEle(
			self.id + "_Bullet",
			"div",
			"position:absolute;visibility:hidden;width:210px;height:200px;left:" +
				(self.pixelLeft - 60) +
				"px;top:" +
				(self.pixelTop - 65) +
				"px;background:url(" +
				self.PicArr[5] +
				");background-size:contain;background-repeat:no-repeat;z-index:" +
				(self.zIndex + 1),
			0,
			EDPZ
		);
	},
	PrivateDie(self) {
		ClearChild($(self.id + "_Bullet"));
	},
	getTriggerRange() {
		const centerX = GetX(this.C);
		this.MinX = centerX - 120;
		this.MaxX = centerX + 120;
		return [[this.MinX, this.MaxX, 0]];
	},
	getTriggerR(row) {
		this.MinR = row > 2 ? row - 1 : 1;
		this.MaxR = row < oS.R ? Number(row) + 1 : row;
		return [this.MinR, this.MaxR];
	},
	AttackCheck2(target) {
		return this.TargetFilter(target);
	},
	NormalAttack() {
		const zone = this;
		for (let row = zone.MinR; row <= zone.MaxR; row++) {
			const targets = oZ.getArZ(zone.MinX, zone.MaxX, row);
			for (let index = targets.length - 1; index >= 0; index--) {
				const target = targets[index];
				if (zone.TargetFilter(target) && typeof target.getHit1 === "function") {
					target.getHit1(target, zone.Damage);
				}
			}
		}

		const wrapper = $(zone.id);
		const effect = $(zone.id + "_Bullet");
		if (wrapper?.childNodes?.[1]) wrapper.childNodes[1].src = zone.PicArr[4];
		if (effect) SetVisible(effect);
		oSym.addTask(
			108,
			(id) => {
				const liveZone = $P[id];
				if (!liveZone) return;
				const liveWrapper = $(id);
				if (liveWrapper?.childNodes?.[1]) {
					liveWrapper.childNodes[1].src = liveZone.PicArr[2];
				}
				const liveEffect = $(id + "_Bullet");
				if (liveEffect) SetHidden(liveEffect);
			},
			[zone.id]
		);
	},
});

var StageElevenBacteriumTraits = {
	PathogenClass: "pathogen.bacteria",
	Phagocytosable: true,
	CapsuleBlocksPhagocytosis: false,
	MucusAffectable: false,
	MucociliaryTransportable: false,
	AudioArr: [],
	PlayNormalballAudio() {},
	PlayFireballAudio() {},
	PlaySlowballAudio() {},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
};

var oPseudomonasBiofilmAggregate = InheritO(OrnNoneZombies, {
	...StageElevenBacteriumTraits,
	EName: "oPseudomonasBiofilmAggregate",
	CName: "铜绿假单胞菌生物膜团",
	HP: 1300,
	BreakPoint: 90,
	Lvl: 4,
	SunNum: 50,
	StandGif: 9,
	AlmanacGif: 9,
	OSpeed: 0.5,
	Speed: 0.5,
	Attack: 100,
	width: 216,
	height: 164,
	beAttackedPointL: 60,
	beAttackedPointR: 130,
	Phagocytosable: false,
	BiofilmProtected: true,
	PicArr: [
		"images/immune_mod/cards/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
		"images/immune_mod/units/pseudomonas_biofilm_aggregate.png",
	],
	Tooltip: "1300 点高耐久、低速推进；可被趋化巡逻中性粒细胞的碰撞机制直接处理。",
	Produce:
		'<font color="#28325A">铜绿假单胞菌以胞外基质形成致密生物膜团。</font><p>韧性：<font color="#CC241D">很高</font><br>速度：<font color="#167C91">慢</font></p>',
});

var oFlagellatedVibrioCholeraeSwarm = InheritO(OrnNoneZombies, {
	...StageElevenBacteriumTraits,
	EName: "oFlagellatedVibrioCholeraeSwarm",
	CName: "鞭毛型霍乱弧菌群",
	HP: 270,
	BreakPoint: 90,
	Lvl: 4,
	SunNum: 50,
	StandGif: 9,
	AlmanacGif: 9,
	OSpeed: 3.2,
	Speed: 3.2,
	Attack: 100,
	width: 166,
	height: 144,
	beAttackedPointL: 82,
	beAttackedPointR: 156,
	PicArr: [
		"images/immune_mod/cards/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
		"images/immune_mod/units/flagellated_vibrio_cholerae_swarm.png",
	],
	Tooltip: "低耐久但以 3.2 的高速推进。",
	Produce:
		'<font color="#28325A">极性鞭毛为霍乱弧菌提供快速定向运动能力。</font><p>韧性：<font color="#CC241D">低</font><br>速度：<font color="#CC241D">快</font></p>',
});

var oInvasiveShigellaMicrocolony = InheritO(OrnNoneZombies, {
	...StageElevenBacteriumTraits,
	EName: "oInvasiveShigellaMicrocolony",
	CName: "志贺菌侵袭微团",
	HP: 275,
	BreakPoint: 90,
	Lvl: 4,
	SunNum: 50,
	StandGif: 9,
	AlmanacGif: 9,
	OSpeed: 1.2,
	Speed: 1.4,
	Attack: 120,
	width: 166,
	height: 144,
	beAttackedPointL: 82,
	beAttackedPointR: 156,
	InvasiveMicrocolony: true,
	PicArr: [
		"images/immune_mod/cards/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
		"images/immune_mod/units/invasive_shigella_microcolony.png",
	],
	Tooltip: "基础速度参数为 1.2，但入场速度保留原机制的 1.4；接触伤害为 120。",
	Produce:
		'<font color="#28325A">志贺菌通过上皮侵袭和细胞间传播建立局部微团。</font><p>攻击：<font color="#CC241D">120</font><br>特点：<font color="#167C91">速度参数不对称</font></p>',
});

var oToxinBurstClostridioidesCluster = InheritO(OrnNoneZombies, {
	...StageElevenBacteriumTraits,
	EName: "oToxinBurstClostridioidesCluster",
	CName: "艰难梭菌毒素爆发簇",
	SunNum: 100,
	HP: 270,
	BreakPoint: 90,
	Lvl: 3,
	Status: 1,
	width: 196,
	height: 181,
	beAttackedPointL: 120,
	beAttackedPointR: 170,
	StandGif: 5,
	NormalGif: 6,
	AlmanacGif: 5,
	DieGif: 3,
	BoomDieGif: 4,
	HeadGif: 11,
	LostHeadGif: 9,
	LostHeadAttackGif: 10,
	AttackGif: 2,
	OSpeed: 3.6,
	Speed: 3.6,
	ToxinCounterReleased: 0,
	PicArr: [
		"images/immune_mod/cards/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/ui/toxin_charge.svg",
		"images/immune_mod/ui/toxin_burst_wave.svg",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
		"images/immune_mod/units/toxin_burst_clostridioides_cluster.png",
	],
	Tooltip: "在随机时刻停止移动并进入不可受伤的毒素释放过程，140 tick 后清除周围 3×3 防御单位。",
	Produce:
		'<font color="#28325A">艰难梭菌毒素在局部突然积累并造成范围组织损伤。</font><p>速度：<font color="#CC241D">快</font><br>特殊：<font color="#CC241D">随机毒素爆发</font></p>',
	RandomOpenBox(id) {
		oSym.addTask(
			Math.floor(Math.random() * 100) > 4
				? Math.floor(1325 + Math.random() * 976)
				: Math.floor(450 + Math.random() * 301),
			(pathogenId) => {
				const pathogen = $Z[pathogenId];
				if (pathogen?.beAttacked) pathogen.OpenBox(pathogenId);
			},
			[id]
		);
	},
	ActivateToxinCounter(self) {
		self.ToxinCounterReleased = 0;
		self.Status = 1;
		oGd.$ToxinBurstClostridioides =
			(oGd.$ToxinBurstClostridioides || 0) + 1;
	},
	ReleaseToxinCounter() {
		if (this.Status && !this.ToxinCounterReleased) {
			oGd.$ToxinBurstClostridioides = Math.max(
				0,
				(oGd.$ToxinBurstClostridioides || 0) - 1
			);
			this.ToxinCounterReleased = 1;
		}
		this.Status = 0;
	},
	OpenBox(id) {
		const pathogen = $Z[id];
		if (!pathogen) return;
		if (pathogen.EleBody) pathogen.EleBody.src = pathogen.PicArr[7];
		pathogen.ChkActs = pathogen.ChkActs1 = function () {
			return 1;
		};
		pathogen.JudgeAttack = function () {
			const self = this;
			const contactX = self.ZX;
			const rowKey = self.R + "_";
			const column = GetC(contactX);
			const grid = oGd.$;
			const target =
				self.JudgeLR(self, rowKey, column, contactX, grid) ||
				self.JudgeSR(self, rowKey, column, contactX, grid);
			if (target) {
				if (!self.isAttacking) {
					self.isAttacking = 1;
					if (self.EleBody) self.EleBody.src = self.PicArr[self.AttackGif];
				}
				self.NormalAttack(target[0], target[1]);
			} else if (self.isAttacking) {
				self.isAttacking = 0;
			}
		};
		pathogen.JudgeAttackH = function () {
			const self = this;
			const target = oZ.getZ0(self.ZX, self.R);
			const selfId = self.id;
			if (
				target &&
				target.beAttacked &&
				target.AttackedLX < oS.W &&
				target.Altitude === 1
			) {
				if (!self.isAttacking) {
					self.isAttacking = 1;
					if (self.EleBody) self.EleBody.src = self.PicArr[self.AttackGif];
					self.AttackZombie(selfId, target.id);
					if (!target.isAttacking) target.AttackZombie2(target, target.id, selfId);
				} else {
					self.AttackZombie(selfId, target.id, 1);
				}
			} else if (self.isAttacking) {
				self.isAttacking = 0;
			}
		};

		pathogen.getPea =
			pathogen.getSnowPea =
			pathogen.getFirePeaSputtering =
			pathogen.getFirePea =
			pathogen.getHit =
			pathogen.getHit0 =
			pathogen.getHit1 =
			pathogen.getHit2 =
			pathogen.getHit3 =
			pathogen.ChangeR =
			pathogen.bedevil =
				function () {};

		oSym.addTask(
			50,
			(pathogenId) => {
				const livePathogen = $Z[pathogenId];
				if (!livePathogen) return;
				livePathogen.ReleaseToxinCounter();
				oSym.addTask(
					90,
					(liveId) => {
						const burstingPathogen = $Z[liveId];
						if (!burstingPathogen) return;
						const burstImage = NewImg(
							"ImmuneToxinBurst" + Math.random(),
							burstingPathogen.PicArr[8],
							"width:306px;height:300px;left:" +
								(burstingPathogen.X - 16) +
								"px;top:" +
								(burstingPathogen.pixelTop - 90) +
								"px;z-index:20",
							EDPZ
						);
						oSym.addTask(70, ClearChild, [burstImage]);

						if (burstingPathogen.PZ) {
							const minRow = Math.max(1, burstingPathogen.R - 1);
							const maxRow = Math.min(oS.R, burstingPathogen.R + 1);
							const centerColumn = GetC(burstingPathogen.ZX);
							const minColumn = Math.max(1, centerColumn - 1);
							const maxColumn = Math.min(oS.C, centerColumn + 1);
							for (let row = minRow; row <= maxRow; row++) {
								for (let column = minColumn; column <= maxColumn; column++) {
									const key = row + "_" + column + "_";
									for (let layer = 0; layer < 4; layer++) {
										const defender = oGd.$[key + layer];
										if (defender && typeof defender.BoomDie === "function") {
											defender.BoomDie();
										}
									}
								}
							}
						} else {
							const left = burstingPathogen.ZX - 120;
							const right = burstingPathogen.ZX + 120;
							const minRow = Math.max(1, burstingPathogen.R - 1);
							const maxRow = Math.min(oS.R, burstingPathogen.R + 1);
							for (let row = minRow; row <= maxRow; row++) {
								const targets = oZ.getArZ(left, right, row);
								for (let index = targets.length - 1; index >= 0; index--) {
									const target = targets[index];
									if (
										target !== burstingPathogen &&
										target.PZ &&
										typeof target.ExplosionDie === "function"
									) {
										target.ExplosionDie();
									}
								}
							}
						}
						burstingPathogen.DisappearDie();
					},
					[pathogenId]
				);
			},
			[id]
		);
	},
	getShadow(self) {
		return (
			"left:" +
			(self.beAttackedPointL - 8) +
			"px;top:" +
			(self.height - 32) +
			"px"
		);
	},
	BirthCallBack(self) {
		const delay = self.delayT;
		const id = self.id;
		const wrapper = (self.Ele = $(id));
		if (!wrapper) return;
		self.EleShadow = wrapper.firstChild;
		self.EleBody = wrapper.childNodes[1];
		const activate = function (pathogenId, element) {
			const pathogen = $Z[pathogenId];
			if (!pathogen) return;
			pathogen.ActivateToxinCounter(pathogen);
			pathogen.FreeSetbodyTime = 0;
			if (typeof SetBlock === "function") SetBlock(element);
			pathogen.RandomOpenBox(pathogenId);
		};
		if (delay) {
			oSym.addTask(delay, activate, [id, wrapper]);
		} else {
			activate(id, wrapper);
		}
	},
	getGranuleHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
	NormalDie() {
		this.ReleaseToxinCounter();
		if (this.EleBody) this.EleBody.src = this.PicArr[this.DieGif];
		oSym.addTask(250, ClearChild, [this.Ele]);
		this.HP = 0;
		delete $Z[this.id];
		if (this.PZ) oP.MonPrgs();
	},
	ExplosionDie() {
		this.ReleaseToxinCounter();
		if (this.EleBody) this.EleBody.src = this.PicArr[this.BoomDieGif];
		oSym.addTask(300, ClearChild, [this.Ele]);
		this.HP = 0;
		delete $Z[this.id];
		if (this.PZ) oP.MonPrgs();
	},
	DisappearDie() {
		this.ReleaseToxinCounter();
		ClearChild(this.Ele);
		this.HP = 0;
		delete $Z[this.id];
		if (this.PZ) oP.MonPrgs();
	},
	CrushDie() {
		this.ReleaseToxinCounter();
		if (typeof this.GoingDieHead === "function") {
			this.GoingDieHead(this.id, this.PicArr, this);
		}
		ClearChild(this.Ele);
		this.HP = 0;
		delete $Z[this.id];
		if (this.PZ) oP.MonPrgs();
	},
});

var oHypercapsulatedKlebsiellaCluster = InheritO(OrnIZombies, {
	...StageElevenBacteriumTraits,
	EName: "oHypercapsulatedKlebsiellaCluster",
	CName: "高荚膜肺炎克雷伯菌簇",
	HP: 270,
	OrnHP: 2800,
	BreakPoint: 90,
	Lvl: 3,
	SunNum: 175,
	StandGif: 11,
	AlmanacGif: 11,
	NormalGif: 2,
	AttackGif: 3,
	LostHeadGif: 4,
	LostHeadAttackGif: 5,
	HeadGif: 6,
	DieGif: 7,
	BoomDieGif: 8,
	OrnLostNormalGif: 9,
	OrnLostAttackGif: 10,
	width: 154,
	height: 160,
	beAttackedPointL: 40,
	beAttackedPointR: 134,
	OSpeed: 3.3,
	Speed: 3.3,
	Attack: 100,
	CapsuleBlocksPhagocytosis: true,
	PicArr: [
		"images/immune_mod/cards/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
		"images/immune_mod/units/hypercapsulated_klebsiella_cluster.png",
	],
	Tooltip: "270 点本体外有 2800 点独立高荚膜层；完整荚膜会阻挡直接吞噬。",
	Produce:
		'<font color="#28325A">肺炎克雷伯菌的高黏液表型产生极厚多糖荚膜。</font><p>本体：<font color="#CC241D">270</font><br>荚膜：<font color="#CC241D">2800</font></p>',
	getShadow(self) {
		return (
			"left:" +
			(self.beAttackedPointL + 15) +
			"px;top:" +
			(self.height - 22) +
			"px"
		);
	},
	getRaven() {
		if (this.CapsuleBlocksPhagocytosis && this.OrnHP > 0 && !this.Opsonized) {
			ImmuneMod.showCombatHint(this, "高荚膜阻挡吞噬", "blocked");
			return 0;
		}
		this.DisappearDie();
		return 1;
	},
	getGranuleHit(self, damage, direction) {
		const hadCapsule = self.OrnHP > 0;
		self.getHit0(self, damage, direction);
		if (hadCapsule && self.OrnHP <= 0 && self.HP > 0) {
			ImmuneMod.showCombatHint(self, "高荚膜已破", "ready");
		}
	},
	getDiffuseHit(self, damage, direction) {
		self.getHit0(self, damage, direction);
	},
});

// Stage 12 keeps the original Cactus slot: one lane, ground fire by default,
// and an alternate flight path while a matching suspended target is present.
var oNeutralizingAntibodyPlasmaCell = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oNeutralizingAntibodyPlasmaCell",
	CName: "多克隆浆细胞抗体区",
	width: 122,
	height: 157,
	beAttackedPointL: 10,
	beAttackedPointR: 80,
	SunNum: 125,
	HP: 300,
	Status: 0,
	Damage: 30,
	GroundDamage: 30,
	AirDamage: 20,
	CompressedClonePool: true,
	AntibodyEpitopeId: "lymph_enveloped_virus",
	PicArr: [
		"images/immune_mod/cards/neutralizing_antibody_plasma_cell.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell_elevated.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell_elevated.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell_elevated.png",
		"images/immune_mod/units/neutralizing_antibody_plasma_cell.png",
		"images/immune_mod/ui/neutralizing_antibody.svg",
	],
	Tooltip: "多克隆既有抗体库在组织层与淋巴流悬浮层之间切换弹道。",
	Produce:
		'<font color="#28325A">本单位把多个抗原匹配浆细胞克隆压缩为一个玩法单位；它不会临场生成新抗体，而是让既有抗体库改走组织层或淋巴流悬浮层。</font><p>组织层：<font color="#CC241D">30</font><br>悬浮层：<font color="#167C91">20，并击落匹配靶标</font><br>边界：<font color="#7A5A35">不跨路，也不攻击未调理癌团或细胞内目标</font></p>',
	CanGroundAntibodyHit(target) {
		if (
			target.IntracellularCarrier === true ||
			target.IntracellularProtected === true ||
			target.Intracellular === true
		) {
			return false;
		}
		if (
			target.PathogenClass === "host.cancer" ||
			target.PathogenClass === "pathogen.cancer"
		) {
			return !!(
				target.AntiCD20Opsonized ||
				target.TherapeuticAntibodyCoated ||
				target.AntibodyBoundByEpitope
			);
		}
		return true;
	},
	getShadow() {
		return "left:3px;top:132px";
	},
	PrivateBirth(self) {
		self.ES = self.Elongation;
	},
	TriggerCheck(target, triggerRange) {
		this.ES() && ((this.canTrigger = 0), this.CheckLoop(target.id, triggerRange));
	},
	CheckLoop(targetId, triggerRange) {
		const id = this.id;
		this.NormalAttack(targetId);
		this.ES();
		this.Status === 0 &&
			oSym.addTask(
				140,
				(plantId, pathogenId, range) => {
					const cell = $P[plantId];
					cell && cell.ES() && cell.AttackCheck1(pathogenId, range);
				},
				[id, targetId, triggerRange]
			);
	},
	CheckLoop2(targetId, triggerRange) {
		const id = this.id;
		this.NormalAttack(targetId);
		this.ES();
		this.Status &&
			oSym.addTask(
				150,
				(plantId, pathogenId, range) => {
					const cell = $P[plantId];
					cell && cell.ES() && cell.AttackCheck12(pathogenId, range);
				},
				[id, targetId, triggerRange]
			);
	},
	AttackCheck1(targetId) {
		const cell = this;
		const target = $Z[targetId];
		const rowRanges = target && cell.oTrigger[target.R];
		if (target && target.PZ && rowRanges) {
			const x = target.ZX;
			for (let index = rowRanges.length - 1; index >= 0; index--) {
				const range = rowRanges[index];
				if (range[0] <= x && range[1] >= x && target.Altitude > 0) {
					cell.CheckLoop(targetId, range[2]);
					return;
				}
			}
		}
		cell.canTrigger = 1;
	},
	AttackCheck12(targetId, triggerRange) {
		this.CheckLoop(targetId, triggerRange);
	},
	Elongation() {
		const cell = this;
		const id = cell.id;
		if (!(oGd.$Balloon?.[cell.R] > 0)) return true;
		cell.canTrigger = 0;
		cell.Status = 1;
		const wrapper = $(id);
		if (wrapper?.childNodes?.[1]) wrapper.childNodes[1].src = cell.PicArr[6];
		oSym.addTask(
			1,
			(plantId) => {
				const liveCell = $P[plantId];
				if (!liveCell) return;
				liveCell.NormalGif = 3;
				const liveWrapper = $(plantId);
				if (liveWrapper?.childNodes?.[1]) {
					liveWrapper.childNodes[1].src = liveCell.PicArr[3];
				}
				let swap = liveCell.CheckLoop;
				liveCell.CheckLoop = liveCell.CheckLoop2;
				liveCell.CheckLoop2 = swap;
				swap = liveCell.NormalAttack;
				liveCell.NormalAttack = liveCell.NormalAttack2;
				liveCell.NormalAttack2 = swap;
				liveCell.ES = liveCell.Shorten;
				liveCell.canTrigger = 1;
			},
			[id]
		);
		return false;
	},
	Shorten() {
		const cell = this;
		const id = cell.id;
		if (oGd.$Balloon?.[cell.R] > 0) return true;
		cell.canTrigger = 0;
		cell.Status = 0;
		const wrapper = $(id);
		if (wrapper?.childNodes?.[1]) wrapper.childNodes[1].src = cell.PicArr[7];
		oSym.addTask(
			1,
			(plantId) => {
				const liveCell = $P[plantId];
				if (!liveCell) return;
				liveCell.NormalGif = 2;
				const liveWrapper = $(plantId);
				if (liveWrapper?.childNodes?.[1]) {
					liveWrapper.childNodes[1].src = liveCell.PicArr[2];
				}
				let swap = liveCell.CheckLoop;
				liveCell.CheckLoop = liveCell.CheckLoop2;
				liveCell.CheckLoop2 = swap;
				swap = liveCell.NormalAttack;
				liveCell.NormalAttack = liveCell.NormalAttack2;
				liveCell.NormalAttack2 = swap;
				liveCell.ES = liveCell.Elongation;
				liveCell.canTrigger = 1;
			},
			[id]
		);
		return false;
	},
	NormalAttack() {
		const cell = this;
		const bulletId = "ImmuneTissueAntibody" + Math.random();
		const wrapper = $(cell.id);
		if (wrapper?.childNodes?.[1]) wrapper.childNodes[1].src = cell.PicArr[4];
		oSym.addTask(
			40,
			(id) => {
				const liveWrapper = $(id);
				if (liveWrapper?.childNodes?.[1]) liveWrapper.childNodes[1].src = cell.PicArr[2];
			},
			[cell.id]
		);
		NewImg(
			bulletId,
			cell.PicArr[8],
			"left:" +
				(cell.AttackedRX + 25) +
				"px;top:" +
				(cell.pixelTop + 103) +
				"px;visibility:hidden;z-index:" +
				(cell.zIndex + 2),
			EDPZ
		);
		oSym.addTask(30, (id) => $(id) && SetVisible($(id)), [bulletId]);
		oSym.addTask(
			1,
			function moveTissueAntibody(id, element, direction, x, row, cssLeft, damage) {
				const target = oZ["getZ" + direction](x, row);
				if (
					target &&
					target.Altitude === 1 &&
					cell.CanGroundAntibodyHit(target)
				) {
					target.getPea(target, damage, direction);
					ClearChild(element);
					return;
				}
				const step = direction ? -5 : 5;
				x += step;
				cssLeft += step;
				if (x < oS.W && x > 100) {
					if (element) element.style.left = cssLeft + "px";
					oSym.addTask(1, moveTissueAntibody, [id, element, direction, x, row, cssLeft, damage]);
				} else {
					ClearChild(element);
				}
			},
			[bulletId, $(bulletId), 0, cell.AttackedLX, cell.R, cell.AttackedLX - 40, cell.GroundDamage]
		);
	},
	NormalAttack2() {
		const cell = this;
		const bulletId = "ImmuneLymphAntibody" + Math.random();
		const wrapper = $(cell.id);
		if (wrapper?.childNodes?.[1]) wrapper.childNodes[1].src = cell.PicArr[5];
		oSym.addTask(
			50,
			(id) => {
				const liveWrapper = $(id);
				if (liveWrapper?.childNodes?.[1]) liveWrapper.childNodes[1].src = cell.PicArr[3];
			},
			[cell.id]
		);
		NewImg(
			bulletId,
			cell.PicArr[8],
			"left:" +
				(cell.AttackedRX + 125) +
				"px;top:" +
				(cell.pixelTop + 33) +
				"px;visibility:hidden;z-index:" +
				(cell.zIndex + 2),
			EDPZ
		);
		oSym.addTask(20, (id) => $(id) && SetVisible($(id)), [bulletId]);
		oSym.addTask(
			1,
			function moveLymphAntibody(
				id,
				element,
				direction,
				x,
				row,
				cssLeft,
				damage,
				epitopeId
			) {
				const target = oZ["getZ" + direction](x, row);
				const matchingAirTarget =
					target &&
					target.Altitude === 3 &&
					(target.AntibodyAirTarget === true || target.EpitopeId === epitopeId);
				if (matchingAirTarget) {
					target.getHit0(target, damage, direction);
					typeof target.Drop === "function" && target.Drop();
					ClearChild(element);
					return;
				}
				const step = direction ? -5 : 5;
				x += step;
				cssLeft += step;
				if (x < oS.W && x > 100) {
					if (element) element.style.left = cssLeft + "px";
					oSym.addTask(1, moveLymphAntibody, [
						id,
						element,
						direction,
						x,
						row,
						cssLeft,
						damage,
						epitopeId,
					]);
				} else {
					ClearChild(element);
				}
			},
			[
				bulletId,
				$(bulletId),
				0,
				cell.AttackedLX,
				cell.R,
				cell.AttackedLX - 40,
				cell.AirDamage,
				cell.AntibodyEpitopeId,
			]
		);
	},
});

var oGMCSFPrimedNeutrophil = InheritO(oNeutrophil, {
	...ImmunePlantBase,
	EName: "oGMCSFPrimedNeutrophil",
	CName: "GM-CSF预激中性粒细胞",
	width: 88,
	height: 84,
	beAttackedPointL: 20,
	beAttackedPointR: 68,
	SunNum: 250,
	HP: 300,
	PicArr: [
		"images/immune_mod/cards/gmcsf_primed_neutrophil.png",
		"images/immune_mod/units/gmcsf_primed_neutrophil.png",
		"images/immune_mod/units/gmcsf_primed_neutrophil.png",
		"images/immune_mod/ui/granule.svg",
		"images/immune_mod/ui/granule_hit.svg",
	],
	Tooltip: "只能覆盖脱颗粒中性粒细胞，每轮以15 tick间隔释放四发抗菌颗粒。",
	Produce:
		'<font color="#28325A">GM-CSF预激提高既有中性粒细胞的连续抗菌输出。</font><p>连发：<font color="#CC241D">0 / 15 / 30 / 45 tick</font><br>前置：<font color="#167C91">脱颗粒中性粒细胞</font><br>边界：<font color="#7A5A35">不获得天然泛杀癌细胞能力</font></p>',
	CanGrow(cells) {
		const baseCell = cells[1];
		return !!(baseCell && baseCell.EName === "oActivatedNeutrophil");
	},
	NormalAttack1: oNeutrophil.prototype.NormalAttack,
	NormalAttack() {
		this.NormalAttack1();
		const repeatAttack = function (plantId, remaining) {
			const cell = $P[plantId];
			cell && cell.NormalAttack1();
			--remaining && oSym.addTask(15, repeatAttack, [plantId, remaining]);
		};
		oSym.addTask(15, repeatAttack, [this.id, 3]);
	},
});

var oExpandedEnergyMicrovasculature = InheritO(oVascularEntry, {
	...ImmunePlantBase,
	EName: "oExpandedEnergyMicrovasculature",
	CName: "扩增型供能微血管丛",
	width: 83,
	height: 84,
	beAttackedPointL: 20,
	beAttackedPointR: 63,
	SunNum: 150,
	HP: 300,
	PicArr: [
		"images/immune_mod/cards/expanded_energy_microvasculature.png",
		"images/immune_mod/units/expanded_energy_microvasculature.png",
		"images/immune_mod/units/expanded_energy_microvasculature.png",
		"images/immune_mod/units/expanded_energy_microvasculature.png",
	],
	Tooltip: "只能覆盖供能微血管，每个周期同时生成两个25点能量泡。",
	Produce:
		'<font color="#28325A">扩增后的微血管床把氧气与葡萄糖分成两股稳定供能。</font><p>首次：<font color="#CC241D">500 + 100 tick</font><br>产能：<font color="#167C91">25 × 2</font><br>周期：<font color="#CC7A2D">2400 tick</font></p>',
	CanGrow(cells) {
		const baseVessel = cells[1];
		return !!(baseVessel && baseVessel.EName === "oVascularEntry");
	},
	ChangePosition(wrapper, active) {
		const image = wrapper?.childNodes?.[1];
		if (!image) return;
		image.classList?.toggle("immune-producer-pulse", !!active);
	},
	PrivateBirth(self) {
		const firstX = GetX(self.C) - 40;
		const secondX = GetX(self.C) - 20;
		const y = GetY(self.R);
		const produceLoop = function (plantId, x1, x2, sunY, recurse) {
			if (!$P[plantId]) return;
			self.ChangePosition($(plantId), 0);
			oSym.addTask(
				100,
				(id, first, second, posY, callback) => {
					if (!$P[id]) return;
					AppearSun(Math.floor(first + Math.random() * 21), posY, 25, 0);
					AppearSun(Math.floor(second + Math.random() * 21), posY, 25, 0);
					oSym.addTask(
						100,
						(liveId) => {
							$P[liveId] && self.ChangePosition($(liveId), 0);
						},
						[id]
					);
					oSym.addTask(2400, callback, [id, first, second, posY, callback]);
				},
				[plantId, x1, x2, sunY, recurse]
			);
		};
		oSym.addTask(500, produceLoop, [self.id, firstX, secondX, y, produceLoop]);
	},
});

var oLymphBorneEnvelopedVirion = InheritO(
	typeof oJY === "undefined" ? OrnNoneZombies : oJY,
	{
		EName: "oLymphBorneEnvelopedVirion",
		CName: "淋巴流游离包膜病毒颗粒簇",
		HP: 1,
		Ornaments: 1,
		OrnHP: 1,
		StandGif: 2,
		AlmanacGif: 2,
		CardGif: 0,
		NormalGif: 2,
		AttackGif: 3,
		DieGif: 7,
		BoomDieGif: 8,
		OrnLostNormalGif: 9,
		OrnLostAttackGif: 3,
		width: 207,
		height: 197,
		beAttackedPointL: 30,
		beAttackedPointR: 85,
		OSpeed: 3.2,
		Speed: 3.2,
		Altitude: 3,
		EpitopeId: "lymph_enveloped_virus",
		AntibodyAirTarget: true,
		PathogenClass: "pathogen.virus.free",
		Phagocytosable: true,
		MucusAffectable: false,
		MucociliaryTransportable: false,
		OriginalBalloonCounterAnomaly: true,
		BalloonCounterCompatibilityFix: true,
		OriginalBalloonCounterAnomalyNote:
			"Original oJY omitted the NormalDie decrement; the immune live path releases the row counter exactly once.",
		PicArr: [
			"images/immune_mod/cards/lymph_borne_enveloped_virion.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion_neutralized.png",
			"images/immune_mod/enemies/lymph_borne_enveloped_virion.png",
		],
		Tooltip: "以3.2速度悬浮于淋巴流；匹配抗体击落后120 tick落入组织层并降至1.6速度。",
		Produce:
			'<font color="#28325A">游离包膜病毒颗粒随淋巴流悬浮移动，组织层攻击难以直接命中。</font><p>悬浮：<font color="#CC241D">高度3，速度3.2</font><br>击落：<font color="#167C91">120 tick后高度1，速度1.6</font></p>',
		GetDX() {
			return -10;
		},
		getShadow(self) {
			return "left:" + self.beAttackedPointL + "px;top:" + (self.height - 22) + "px";
		},
		BirthCallBack(self) {
			const delay = self.delayT;
			const id = self.id;
			const wrapper = (self.Ele = $(id));
			self.EleShadow = wrapper.firstChild;
			self.EleBody = wrapper.childNodes[1];
			const registerBalloon = function (pathogenId, element) {
				const virion = $Z[pathogenId];
				if (!virion) return;
				virion.FreeSetbodyTime = 0;
				SetBlock(element);
				const counters = oGd.$Balloon || (oGd.$Balloon = {});
				counters[virion.R] === undefined
					? (counters[virion.R] = 1)
					: ++counters[virion.R];
				virion.BalloonCounterRow = virion.R;
				virion.BalloonCounterReleased = false;
			};
			if (delay) {
				oSym.addTask(delay, registerBalloon, [id, wrapper]);
			} else {
				registerBalloon(id, wrapper);
			}
		},
		ChkActs(self, row, rowArray, index) {
			let active = 1;
			if (!(self.FreeFreezeTime || self.FreeSetbodyTime)) {
				const attackedRight = (self.AttackedRX -= self.Speed);
				if (attackedRight < -50) {
					rowArray.splice(index, 1);
					self.DisappearDie();
					active = 0;
				} else {
					if (attackedRight < 100 && !self.PointZombie) {
						self.PointZombie = 1;
						if (!oS.CardKind) {
							StopMusic();
							PlaySound2("losemusic", false);
						}
						self.ChangeR({
							R: row,
							ar: [oS.R - 1],
							CustomTop: 400 - self.height + self.GetDY(),
						});
					}
					self.ZX = self.AttackedLX -= self.Speed;
					self.Ele.style.left = Math.floor((self.X -= self.Speed)) + "px";
				}
			}
			return active;
		},
		ReleaseBalloonCounter() {
			if (this.BalloonCounterReleased || this.BalloonCounterRow === undefined) return;
			const counters = oGd.$Balloon || (oGd.$Balloon = {});
			const row = this.BalloonCounterRow;
			counters[row] = Math.max(0, (counters[row] || 0) - 1);
			this.BalloonCounterReleased = true;
		},
		Drop() {
			const virion = this;
			virion.EleBody.src = virion.PicArr[10];
			virion.ChkActs = function () {
				return 1;
			};
			virion.Altitude = 4;
			virion.ReleaseBalloonCounter();
			oSym.addTask(
				120,
				(id) => {
					const liveVirion = $Z[id];
					if (!liveVirion) return;
					liveVirion.BoomDieGif = 11;
					liveVirion.Altitude = 1;
					liveVirion.OSpeed = liveVirion.Speed = 1.6;
					liveVirion.getFreeze = OrnIZombies.prototype.getFreeze;
					liveVirion.EleBody.src = liveVirion.PicArr[9];
					liveVirion.ChkActs = OrnIZombies.prototype.ChkActs;
					liveVirion.ExplosionDie = function () {
						this.EleBody.src = this.PicArr[this.BoomDieGif];
						oSym.addTask(200, ClearChild, [this.Ele]);
						this.HP = 0;
						delete $Z[this.id];
						this.PZ && oP.MonPrgs();
					};
					liveVirion.DisappearDie = function () {
						ClearChild(this.Ele);
						this.HP = 0;
						delete $Z[this.id];
						this.PZ && oP.MonPrgs();
					};
					liveVirion.CrushDie = function () {
						typeof this.GoingDieHead === "function" &&
							this.GoingDieHead(this.id, this.PicArr, this);
						ClearChild(this.Ele);
						this.HP = 0;
						delete $Z[this.id];
						this.PZ && oP.MonPrgs();
					};
				},
				[virion.id]
			);
		},
		getFreeze(self, id) {
			self.Attack = 50;
			self.Speed = 0.5 * self.OSpeed;
			oSym.addTask(
				1500,
				(pathogenId, expiresAt) => {
					const virion = $Z[pathogenId];
					if (virion && virion.FreeSlowTime === expiresAt) {
						virion.FreeSlowTime = 0;
						virion.Attack = 100;
						virion.Speed = virion.OSpeed;
					}
				},
				[id, (self.FreeSlowTime = oSym.Now + 1500)]
			);
		},
		NormalDie() {
			const virion = this;
			if (virion.EleBody) virion.EleBody.src = virion.PicArr[virion.DieGif];
			oSym.addTask(250, ClearChild, [virion.Ele]);
			virion.HP = 0;
			delete $Z[virion.id];
			virion.PZ && oP.MonPrgs();
			virion.ReleaseBalloonCounter();
		},
		ExplosionDie() {
			const virion = this;
			if (virion.EleBody) virion.EleBody.src = virion.PicArr[virion.BoomDieGif];
			oSym.addTask(200, ClearChild, [virion.Ele]);
			virion.HP = 0;
			delete $Z[virion.id];
			virion.PZ && oP.MonPrgs();
			virion.ReleaseBalloonCounter();
		},
		DisappearDie() {
			ClearChild(this.Ele);
			this.HP = 0;
			delete $Z[this.id];
			this.PZ && oP.MonPrgs();
			this.ReleaseBalloonCounter();
		},
		CrushDie() {
			this.DisappearDie();
		},
	}
);

var oLymphomaImmunosuppressiveMass = InheritO(
	typeof oLGBOSS === "undefined"
		? typeof oZomboni === "undefined"
			? OrnNoneZombies
			: oZomboni
		: oLGBOSS,
	{
		EName: "oLymphomaImmunosuppressiveMass",
		CName: "Boss·弥漫性大B细胞淋巴瘤团块",
		HP: 6000,
		BreakPoint: 200,
		DyingThreshold: 1000,
		Lvl: 3,
		SunNum: 350,
		width: 464,
		height: 377,
		GetDTop: 104,
		beAttackedPointL: 140,
		beAttackedPointR: 300,
		StandGif: 2,
		AlmanacGif: 2,
		CardGif: 0,
		NormalGif: 2,
		DieGif: 6,
		BoomDieGif: 6,
		OSpeed: 2.5,
		Speed: 2.5,
		AKind: 2,
		Attack: 50,
		Altitude: 1,
		AudioArr: [],
		TrailCleanupDelay: 3000,
		TrackDomPrefix: "dIceCar",
		PathogenClass: "host.cancer",
		EnginePathogenClass: "pathogen.cancer",
		BiologicalClass: "host.cancer",
		CancerCellType: "b_cell_lymphoma",
		CancerSubtype: "DLBCL",
		AntiCD20Opsonized: true,
		TherapeuticAntibodyCoated: true,
		TumorPhagocytosisTarget: true,
		Phagocytosable: false,
		MucusAffectable: false,
		MucociliaryTransportable: false,
		PicArr: [
			"images/immune_mod/cards/lymphoma_immunosuppressive_mass.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass_damaged_1.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass_damaged_2.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass_defeated.png",
			"images/immune_mod/enemies/lymphoma_immunosuppressive_mass_defeated.png",
			"images/immune_mod/ui/immunosuppressive_track.svg",
			"images/immune_mod/ui/immunosuppressive_track_cap.svg",
		],
		Tooltip: "6000耐久的B细胞淋巴瘤团；已接受抗CD20样治疗性抗体调理标记。",
		Produce:
			'<font color="#28325A">巨大的B细胞淋巴瘤团沿组织推进并形成免疫抑制轨迹。关卡状态把它设定为已接受抗CD20样治疗性抗体包被，因此髓窦巨噬细胞与调理吞噬清除区可以识别。</font><p>耐久：<font color="#CC241D">6000</font><br>损伤外观：<font color="#CC7A2D">低于5000 / 3000</font><br>濒死：<font color="#167C91">低于1000</font></p>',
		GetDY() {
			return 0;
		},
		getShadow(self) {
			return "left:" + (self.beAttackedPointL - 10) + "px;top:" + (self.height - 22) + "px";
		},
		ApplyMassDamage(self, damage) {
			const hp = (self.HP -= damage);
			if (hp < 1000) {
				self.GoingDie();
				self.getHit0 = self.getHit1 = self.getHit2 = self.getHit3 = function () {};
				return;
			}
			if (self.EleBody) {
				if (hp < 3000) self.EleBody.src = self.PicArr[4];
				else if (hp < 5000) self.EleBody.src = self.PicArr[3];
			}
			const flash =
				typeof self.SetAlpha === "function"
					? self.SetAlpha.bind(self)
					: typeof SetAlpha === "function"
						? SetAlpha
						: null;
			if (flash) {
				flash(self, self.EleBody, 50, 0.5);
				oSym.addTask(
					10,
					(id) => {
						const mass = $Z[id];
						if (!mass) return;
						if (typeof mass.SetAlpha === "function") {
							mass.SetAlpha(mass, mass.EleBody, 100, 1);
						} else if (typeof SetAlpha === "function") {
							SetAlpha(mass, mass.EleBody, 100, 1);
						}
					},
					[self.id]
				);
			}
		},
		getHit(self, damage) {
			self.ApplyMassDamage(self, damage);
		},
		getHit0(self, damage) {
			self.ApplyMassDamage(self, damage);
		},
		getHit1(self, damage) {
			self.ApplyMassDamage(self, damage);
		},
		getHit2(self, damage) {
			self.ApplyMassDamage(self, damage);
		},
		getHit3(self, damage) {
			self.ApplyMassDamage(self, damage);
		},
		getPea(self, damage) {
			self.getHit0(self, damage);
		},
		getFirePea(self, damage) {
			self.getHit0(self, damage);
		},
		getSnowPea(self, damage) {
			self.getHit0(self, damage);
		},
		getFirePeaSputtering() {},
		getFreeze(self) {
			self.getHit0(self, 20);
		},
		BirthCallBack(self) {
			const delay = self.delayT;
			const id = self.id;
			const wrapper = (self.Ele = $(id));
			const row = self.R;
			const tracks = oGd.$Ice || (oGd.$Ice = {});
			self.EleShadow = wrapper.firstChild;
			self.EleBody = wrapper.childNodes[1];
			if (!tracks[row]) {
				const track = NewEle(
					self.TrackDomPrefix + row,
					"div",
					"position:absolute;z-index:1;left:145px;top:" +
						(GetY(row) - 65) +
						"px;width:800px;height:205px",
					{ className: "immune-immunosuppressive-track" },
					EDPZ
				);
				NewImg(
					"",
					"images/interface/blank.png",
					"position:absolute;clip:rect(0,auto,auto,800px);width:800px;height:205px;left:0px;background:url(" +
						self.PicArr[7] +
						") repeat-x",
					track
				);
				NewImg(
					"",
					self.PicArr[8],
					"position:absolute;display:none;left:0",
					track
				);
				tracks[row] = [1, 11, self.AttackedLX];
			} else {
				++tracks[row][0];
			}
			if (delay) {
				oSym.addTask(
					delay,
					(pathogenId, element) => {
						const mass = $Z[pathogenId];
						if (!mass) return;
						mass.FreeSetbodyTime = 0;
						SetBlock(element);
					},
					[id, wrapper]
				);
			} else {
				SetBlock(wrapper);
			}
		},
		ChkActs(self, row, rowArray, index) {
			const state = oGd.$Ice[row];
			const track = $(self.TrackDomPrefix + row);
			self.JudgeAttack();
			const attackedRight = (self.AttackedRX -= self.Speed);
			let active = 1;
			if (attackedRight < -50) {
				rowArray.splice(index, 1);
				self.DisappearDie();
				active = 0;
			} else {
				if (attackedRight < 100 && !self.PointZombie) {
					self.PointZombie = 1;
					if (!oS.CardKind) {
						StopMusic();
						PlaySound2("losemusic", false);
					}
					self.ChangeR({
						R: row,
						ar: [oS.R - 1],
						CustomTop: 400 - self.height + self.GetDY(),
					});
				}
				self.ZX = self.AttackedLX -= self.Speed;
				self.Ele.style.left = Math.floor((self.X -= self.Speed)) + "px";
			}
			const trailHead = self.X + 250;
			const clipLeft = self.X + 100;
			const column = GetC(trailHead);
			if (column > -1 && column < state[1]) {
				oGd.$Crater[row + "_" + column] = 1;
				state[1] = column;
			}
			if (trailHead > 120 && trailHead < state[2]) {
				state[2] = trailHead;
				track.firstChild.style.clip = "rect(0,auto,auto," + clipLeft + "px)";
				track.childNodes[1].style.left = Math.max(0, clipLeft) + "px";
			}
			GetC(self.AttackedLX) > 5 && (self.OSpeed = self.Speed -= 0.005);
			return active;
		},
		ChkActs1(self, row, rowArray, index) {
			self.JudgeAttack();
			if ((self.AttackedLX += self.Speed) > oS.W) {
				rowArray.splice(index, 1);
				self.DisappearDie();
				return 0;
			}
			self.ZX = self.AttackedRX += self.Speed;
			self.Ele.style.left = Math.ceil((self.X += self.Speed)) + "px";
			return 1;
		},
		GoingDie() {
			this.beAttacked = 0;
			typeof this.AutoReduceHP === "function" && this.AutoReduceHP(this.id);
		},
		NormalDie() {
			const mass = this;
			if (mass.EleBody) mass.EleBody.src = mass.PicArr[mass.DieGif];
			oSym.addTask(70, ClearChild, [mass.Ele]);
			mass.HP = 0;
			delete $Z[mass.id];
			mass.JudgeIce();
			mass.PZ && oP.MonPrgs();
		},
		DisappearDie() {
			const mass = this;
			ClearChild(mass.Ele);
			mass.HP = 0;
			delete $Z[mass.id];
			mass.JudgeIce();
			mass.PZ && oP.MonPrgs();
		},
		ExplosionDie() {
			const mass = this;
			if (mass.EleBody) mass.EleBody.src = mass.PicArr[mass.BoomDieGif];
			oSym.addTask(300, ClearChild, [mass.Ele]);
			mass.HP = 0;
			delete $Z[mass.id];
			mass.JudgeIce();
			mass.PZ && oP.MonPrgs();
		},
		CrushDie() {
			this.NormalDie();
		},
		JudgeIce() {
			const row = this.R;
			const track = $(this.TrackDomPrefix + row);
			const state = oGd.$Ice[row];
			if (!state) return;
			track?.childNodes?.[1] && SetBlock(track.childNodes[1]);
			if (--state[0] <= 0) {
				oSym.addTask(
					this.TrailCleanupDelay,
					(node, targetRow) => {
						const current = oGd.$Ice[targetRow];
						if (!current || current[0] > 0 || !node) return;
						ClearChild(node);
						let column = current[1];
						while (column < 11) {
							delete oGd.$Crater[targetRow + "_" + column++];
						}
						delete oGd.$Ice[targetRow];
					},
					[track, row]
				);
			}
		},
		flatTire() {
			const mass = this;
			if (mass.EleBody) mass.EleBody.src = mass.PicArr[5];
			mass.beAttacked = 0;
			mass.HP = 0;
			mass.getHit0 = mass.getHit1 = mass.getHit2 = mass.getHit3 = function () {};
			mass.ChkActs = mass.ChkActs1 = function () {};
			oSym.addTask(
				290,
				(id) => {
					const liveMass = $Z[id];
					liveMass && liveMass.NormalDie();
				},
				[mass.id]
			);
		},
		JudgeAttack() {
			const x = this.ZX;
			const rowPrefix = this.R + "_";
			const column = GetC(x);
			const plants = oGd.$;
			const target =
				this.JudgeLR(this, rowPrefix, column, x, plants) ||
				this.JudgeSR(this, rowPrefix, column, x, plants);
			target && this.NormalAttack(target[0], target[1]);
		},
		JudgeLR(self, rowPrefix, column, x, plants) {
			if (column > 10 || column < 1) return false;
			const keyPrefix = rowPrefix + --column + "_";
			for (let layer = 2; layer >= 0; layer--) {
				const plant = plants[keyPrefix + layer];
				if (plant) {
					return plant.AttackedRX >= x && plant.AttackedLX <= x
						? [self.id, plant.id]
						: false;
				}
			}
		},
		JudgeSR(self, rowPrefix, column, x, plants) {
			if (column > 9) return false;
			const keyPrefix = rowPrefix + column + "_";
			for (let layer = 2; layer >= 0; layer--) {
				const plant = plants[keyPrefix + layer];
				if (plant) {
					return plant.AttackedRX >= x && plant.AttackedLX <= x
						? [self.id, plant.id]
						: false;
				}
			}
		},
		NormalAttack(pathogenId, plantId) {
			const mass = $Z[pathogenId];
			const plant = $P[plantId];
			plant && plant.getHurt(mass, 2, mass.Attack);
		},
		getThump() {
			this.NormalDie();
		},
	}
);

var oImmuneMemoryMedal = InheritO(
	typeof oGoldenPrize === "undefined" ? CPlants : oGoldenPrize,
	{
		EName: "oImmuneMemoryMedal",
		CName: "淋巴结守卫奖章",
		CanDisplay: 0,
		CanSelect: 0,
		RewardOnly: true,
		PicArr: [
			"images/immune_mod/ui/lymph_node_guardian_medal.png",
			"images/immune_mod/ui/lymph_node_guardian_medal.png",
		],
		Tooltip: "关卡奖励专用，不进入可部署卡池。",
		Produce:
			'<font color="#28325A">完成淋巴结守卫战的纪念奖章。</font><p>类型：<font color="#167C91">奖励专用</font></p>',
	}
);

// Stage 13 keeps water-lane placement and the original two-pulse timings.
var oBacteriostaticInfusion = InheritO(oNeutrophil, {
	EName: "oBacteriostaticInfusion",
	CName: "双脉冲抑菌灌流",
	SunNum: 250,
	CanOxidativelyCatalyze: false,
	SlowDuration: 1000,
	PicArr: [
		"images/immune_mod/cards/bacteriostatic_infusion.png",
		"images/immune_mod/units/bacteriostatic_infusion.png",
		"images/immune_mod/units/bacteriostatic_infusion.png",
		"images/immune_mod/ui/antimicrobial_droplet.svg",
		"images/immune_mod/ui/antimicrobial_droplet_hit.svg",
	],
	Tooltip: "每轮两次抑菌灌流，延缓本路细胞外细菌；水路需先铺黏附位点。",
	Produce: '<font color="#28325A">用双脉冲递送抑菌成分。</font><p>节奏：<font color="#167C91">0／15 tick，两次 20 点</font><br>效果：1000 tick 半速；这是药敏模型的游戏抽象，不能处理胞内目标、病毒或癌细胞。</p>',
	AttackCheck2(target) {
		return !!(target && target.PZ && target.beAttacked && target.HP > 0 && target.Altitude === 1 &&
			target.PathogenClass === "pathogen.bacteria" && !target.IntracellularCarrier && !target.IntracellularProtected && !target.Intracellular);
	},
	ApplyInfusion(target) {
		if ($Z[target.id] !== target || !this.AttackCheck2(target)) return false;
		ImmuneMod.applyAntimicrobialDamage(target, this.Damage, 0, false);
		if ($Z[target.id] !== target || target.HP <= 0) return true;
		const until = Math.max(target.FreeSlowTime || 0, oSym.Now + this.SlowDuration);
		target.FreeSlowTime = until;
		ImmuneMod.recomputePathogenSpeed(target);
		target.EleBody?.classList.add("immune-nutrient-slowed");
		oSym.addTask(until - oSym.Now, () => {
			if ($Z[target.id] !== target || target.FreeSlowTime !== until) return;
			target.FreeSlowTime = 0;
			ImmuneMod.recomputePathogenSpeed(target);
			target.EleBody?.classList.remove("immune-nutrient-slowed");
		}, []);
		return true;
	},
	NormalAttack1() {
		const station = this;
		const bulletId = "ImmuneInfusion" + Math.random();
		const bullet = EditEle(station.BulletEle.cloneNode(false), { id: bulletId }, 0, EDPZ);
		oSym.addTask(8, () => $(bulletId) && SetVisible(bullet), []);
		(function move(x, cssLeft) {
			if (!$(bulletId)) return;
			const target = oZ.getZ0(x, station.R);
			if (target && station.ApplyInfusion(target)) {
				bullet.src = station.PicArr[4];
				oSym.addTask(16, ClearChild, [bullet]);
			} else if (x + 5 < oS.W) {
				bullet.style.left = cssLeft + 5 + "px";
				oSym.addTask(1, move, [x + 5, cssLeft + 5]);
			} else ClearChild(bullet);
		})(station.AttackedRX, station.AttackedLX + 24);
	},
	NormalAttack() {
		const station = this;
		station.NormalAttack1();
		oSym.addTask(15, () => $P[station.id] === station && station.NormalAttack1(), []);
	},
});

var oBloodstreamPeptideCarrier = InheritO(oDefensinEpithelium, {
	EName: "oBloodstreamPeptideCarrier",
	CName: "液面抗菌肽载体",
	width: 48,
	height: 99,
	beAttackedPointL: 10,
	beAttackedPointR: 40,
	coolTime: 30,
	Sleep: 0,
	BookHandBack: "NightPool",
	PicArr: [
		"images/immune_mod/cards/bloodstream_peptide_carrier.png",
		"images/immune_mod/units/bloodstream_peptide_carrier.png",
		"images/immune_mod/units/bloodstream_peptide_carrier.png",
		"images/immune_mod/ui/antimicrobial_droplet.svg",
		"images/immune_mod/ui/antimicrobial_droplet_hit.svg",
	],
	Tooltip: "0 费、短程抗菌肽；可直接部署在空液面，30 秒补充一张。",
	Produce: '<font color="#28325A">工程化载体在局部递送抗菌肽。</font><p>射程：250 像素；伤害：20；仅细菌与真菌。液面部署是游戏抽象，不表示可以随意全身给药。</p>',
	getShadow() { return "display:none"; },
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		return !(column < 1 || column > 9 || oGd.$LF[row] !== 2 || cells[0] || cells[1] || oGd.$Crater[key] || oGd.$Tombstones[key]);
	},
});

var oMatchedAntibodyInfusion = InheritO(CPlants, {
	...ImmunePlantBase,
	EName: "oMatchedAntibodyInfusion",
	CName: "匹配抗体灌流位点",
	width: 190,
	height: 90,
	beAttackedPointL: 20,
	beAttackedPointR: 100,
	SunNum: 225,
	coolTime: 50,
	HP: 300,
	AntibodyEpitopeId: "meningococcal.fhbp.model-A",
	AttackInterval: 230,
	AntibodyMaxLife: 400,
	PicArr: [
		"images/immune_mod/cards/matched_antibody_infusion.png",
		"images/immune_mod/units/matched_antibody_infusion.png",
		"images/immune_mod/units/matched_antibody_infusion.png",
		"images/immune_mod/ui/antibody_fhbp.svg",
	],
	Tooltip: "覆盖血流黏附位点，跨路递送匹配抗体；不同表位与胞内目标不命中。",
	Produce: '<font color="#28325A">递送匹配模型 fHbp 表位的抗体，并与补体联动。</font><p>225 费；50 秒冷却；每轮两次跨路追踪。保护层仍需逐步处理，不能覆盖所有菌株。</p>',
	getShadow() { return "display:none"; },
	getTriggerRange() { return [[0, oS.W, 0]]; },
	getTriggerR() { return [1, oS.R]; },
	CanGrow(cells, row, column) {
		const key = row + "_" + column;
		return !!(column >= 1 && column <= 9 && oGd.$LF[row] === 2 && !oGd.$Crater[key] && !oGd.$Tombstones[key] &&
			!cells[1] && cells[0]?.EName === "oActivatedEndothelialAdhesionSite");
	},
	PrivateBirth(station) {
		const base = oGd.$[station.R + "_" + station.C + "_0"];
		if (base?.EName === "oActivatedEndothelialAdhesionSite") base.Die();
	},
	AttackCheck2(target) {
		return !!(ImmuneMod.isMatchingAntibodyTarget(target, this.AntibodyEpitopeId, true) &&
			target.PathogenClass === "pathogen.bacteria" && !target.IntracellularCarrier && !target.IntracellularProtected && !target.Intracellular);
	},
	FindMatchingTarget() {
		let nearest = null;
		let distance = Infinity;
		for (const id in $Z) {
			const target = $Z[id];
			if (!this.AttackCheck2(target)) continue;
			const length = Math.hypot((target.R - this.R) * 100, target.X - GetX(this.C)) + Math.abs(target.R - this.R) * 3;
			if (length < distance) { nearest = target; distance = length; }
		}
		return nearest;
	},
	CheckLoop() {
		const station = this;
		station.NormalAttack();
		oSym.addTask(90, () => $P[station.id] === station && station.NormalAttack(), []);
		oSym.addTask(station.AttackInterval, () => {
			if ($P[station.id] !== station) return;
			station.FindMatchingTarget() ? station.CheckLoop() : (station.canTrigger = 1);
		}, []);
	},
	HitMatchingTarget(target) {
		if (!this.AttackCheck2(target)) return false;
		target.AntibodyBoundByEpitope = this.AntibodyEpitopeId;
		ImmuneMod.showAntibodyBinding(target, 1, this.PicArr[3]);
		return ImmuneMod.applyAntimicrobialDamage(target, 20, 0, false);
	},
	NormalAttack() {
		const station = this;
		const target = station.FindMatchingTarget();
		if (!target) return;
		oSym.addTask(85, () => {
			if ($P[station.id] !== station || $Z[target.id] !== target || !station.AttackCheck2(target)) return;
			const bornAt = oSym.Now;
			const bulletId = "ImmuneMatchedAntibody" + Math.random();
			let x = station.pixelLeft + 80, y = station.pixelTop + 10;
			const bullet = NewImg(bulletId, station.PicArr[3], "left:" + x + "px;top:" + y + "px;width:32px;height:28px;z-index:" + (station.zIndex + 3), EDPZ);
			(function fly() {
				if (!$(bulletId)) return;
				if ($Z[target.id] !== target || !station.AttackCheck2(target) || oSym.Now - bornAt > station.AntibodyMaxLife) {
					ClearChild(bullet); return;
				}
				const center = ImmuneMod.getPathogenCenter(target);
				const dx = center.x - x, dy = center.y - y, length = Math.hypot(dx, dy);
				if (!Number.isFinite(length)) { ClearChild(bullet); return; }
				if (length <= 20) { station.HitMatchingTarget(target); ClearChild(bullet); return; }
				x += dx / length * 10; y += dy / length * 10;
				bullet.style.left = x + "px"; bullet.style.top = y + "px";
				oSym.addTask(2, fly, []);
			})();
		}, []);
	},
});

var oFibrinShieldedBloodstreamCluster = InheritO(
	typeof oDuckyTubeZombie4 === "undefined" ? oDenseCapsuleMeningococcalCluster : oDuckyTubeZombie4,
	{
		EName: "oFibrinShieldedBloodstreamCluster",
		CName: "纤维蛋白遮蔽血流菌簇",
		HP: 270,
		OrnHP: 1100,
		CanDisplay: 1,
		PathogenClass: "pathogen.bacteria",
		Phagocytosable: true,
		CapsuleBlocksPhagocytosis: true,
		MucusAffectable: false,
		MucociliaryTransportable: false,
		BloodstreamOnly: true,
		AntibodyTargetable: false,
		SurfaceEpitopeId: "staph.fibrin.model",
		DiffuseBypassesShield: true,
		PicArr: [
			"images/immune_mod/cards/fibrin_shielded_bloodstream_cluster.png",
			...Array(5).fill("images/immune_mod/enemies/fibrin_shielded_bloodstream_cluster.png"),
			...Array(5).fill("images/immune_mod/enemies/fibrin_shielded_bloodstream_cluster_exposed.png"),
		],
		Tooltip: "纤维蛋白遮蔽普通颗粒；扩散伤害可直达菌体。",
		Produce: '<font color="#28325A">菌簇藏在纤维蛋白保护环境中。</font><p>本体 270；外层 1100；仅沿液面推进。蛋白网不是金属装甲。</p>',
		CanPass: oMeningococcalBloodstreamCluster.prototype.CanPass,
		getRaven: oThickCapsuleMeningococcalCluster.prototype.getRaven,
		getGranuleHit: oExudateShieldedBacteria.prototype.getGranuleHit,
		getDiffuseHit: oExudateShieldedBacteria.prototype.getDiffuseHit,
	}
);

var oCirculatingStaphAggregate = InheritO(
	typeof oWarshipsZombie === "undefined" ? oMeningococcalBloodstreamCluster : oWarshipsZombie,
	{
		EName: "oCirculatingStaphAggregate",
		CName: "循环金葡菌大型聚集体",
		HP: "5000",
		OSpeed: 0.1,
		Speed: 0.1,
		Attack: 550,
		width: 464,
		height: 364,
		beAttackedPointL: 140,
		beAttackedPointR: 290,
		PathogenClass: "pathogen.bacteria",
		Phagocytosable: false,
		MucusAffectable: false,
		MucociliaryTransportable: false,
		BloodstreamOnly: true,
		AntibodyTargetable: false,
		SurfaceEpitopeId: "staph.fibrin.model",
		PicArr: [
			"images/immune_mod/cards/circulating_staph_aggregate.png",
			...Array(7).fill("images/immune_mod/enemies/circulating_staph_aggregate.png"),
		],
		Tooltip: "末波出现的大型聚集体；缓慢推进，但接触压力很高。",
		Produce: '<font color="#28325A">多团金葡菌被纤维蛋白网聚在一起。</font><p>耐久 5000；速度 0.1；接触 550；大型聚集体不能被单个巨噬细胞直接吞下。数值不代表疾病严重度。</p>',
		CanPass: oMeningococcalBloodstreamCluster.prototype.CanPass,
		getGranuleHit: oMeningococcalBloodstreamCluster.prototype.getGranuleHit,
		getDiffuseHit: oMeningococcalBloodstreamCluster.prototype.getDiffuseHit,
		getRaven() { return 0; },
	}
);

ImmuneMod.AlmanacPlants = [
	oNeutrophil,
	oVascularEntry,
	oCapillarySprout,
	oComplementBurst,
	oEpithelialBarrier,
	oNETTrap,
	oHypochlorousDressing,
	oEnzymaticDebridement,
	oLyticPhageTherapy,
	oSkinDendriticSentinel,
	oLactoferrinNutrientRestriction,
	oWideSharpDebridement,
	oActivatedEndothelialAdhesionSite,
	oNeutrophilSwarmStrike,
	oTriLaneAntimicrobialInfusion,
	oMechanobactericidalNanopillarArray,
	oMPOOxidativeAmplificationSite,
	oReinforcedEndothelialPericyteBarrier,
	oPlateletFibrinCaptureNet,
	oAntimicrobialFibrinolyticFlush,
	oGobletCell,
	oMacrophage,
	oActivatedNeutrophil,
	oDefensinEpithelium,
	oCiliatedEpithelium,
	oPlasmaCellTriangle,
	oPlasmaCellRing,
	oLocalCapillaryPerfusionNetwork,
	oChemotacticNeutrophilPatrol,
	oIgMComplementCaptureComplex,
	oMedullarySinusMacrophage,
	oCD169SubcapsularMacrophageBarrier,
	oOpsonophagocyticClearanceZone,
	oNeutralizingAntibodyPlasmaCell,
	oGMCSFPrimedNeutrophil,
	oExpandedEnergyMicrovasculature,
	oBacteriostaticInfusion,
	oBloodstreamPeptideCarrier,
	oMatchedAntibodyInfusion,
];

ImmuneMod.AlmanacPathogens = [
	oAirwayBacterium,
	oRhinovirus,
	oEncapsulatedPneumococcus,
	oDenseCapsulePneumococcus,
	oInvasiveAspergillus,
	oGlidingMycoplasma,
	oDispersingBiofilmAggregate,
	oExudateShieldedBacteria,
	oFibrinWrappedStaphCluster,
	oQuorumResponderCluster,
	oQuorumSensingConsortium,
	oMeningococcalBloodstreamCluster,
	oThickCapsuleMeningococcalCluster,
	oDenseCapsuleMeningococcalCluster,
	oListeriaMonocyteCarrier,
	oStaphFibrinBiofilmFront,
	oPiliatedInvasiveMeningococcalCluster,
	oTriangleRhinovirus,
	oRingRhinovirus,
	oPseudomonasBiofilmAggregate,
	oFlagellatedVibrioCholeraeSwarm,
	oInvasiveShigellaMicrocolony,
	oToxinBurstClostridioidesCluster,
	oHypercapsulatedKlebsiellaCluster,
	oLymphBorneEnvelopedVirion,
	oLymphomaImmunosuppressiveMass,
	oFibrinShieldedBloodstreamCluster,
	oCirculatingStaphAggregate,
];
