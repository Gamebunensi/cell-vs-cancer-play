oS.Init(
	{
		PName: [oNeutrophil],
		ZName: [oAirwayBacterium],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			const reward = oVascularEntry.prototype;
			return [
				"images/immune_mod/worlds/airway.png",
				"images/immune_mod/worlds/airway.png",
				reward.PicArr[reward.CardGif],
				reward.PicArr[reward.NormalGif],
			];
		})(),
		SunNum: 150,
		backgroundImage: "images/immune_mod/worlds/airway.png",
		LF: [0, 0, 0, 1, 0, 0],
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-1 · 第一处感染",
		LvlEName: "immune-1",
		AudioArr: ["dirt_rise"],
		ImmuneMod: true,
		FlagIcon: "images/immune_mod/enemies/airway_bacterium.png",
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LoadAccess(startGame) {
			ImmuneMod.applyBattleTheme();
			startGame();
		},
		InitLawnMower() {
			CustomSpecial(oMucociliarySweep, 3, -1);
		},
		LargeWaveFlag: { 5: $("imgFlag1") },
		StartGame() {
			NewImg("imgSF", "images/immune_mod/ui/tutorial_skip.svg", "left:1px;top:75px", EDAll, {
				onclick() {
					ImmuneMod.loadLevel("immune-3");
				},
			});
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			NewEle("DivTeachBar", "div", 0, 0, EDAll);
			oS.InitLawnMower();
			oP.Monitor({
				ar: [0],
				f(step) {
					let column = oS.C + 1;
					const chosen = oS.Chose;
					switch (step) {
						case 0:
							innerText($("DivTeachBar"), "点击卡片，拿起中性粒细胞！");
							NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_up.svg", "top:60px;left:50px", EDAll);
							oSym.addTask(10, arguments.callee, [++step]);
							break;
						case 1:
							(chosen > 0 || Object.keys(oGd.$).some(key => /^3_\d+_1$/.test(key))) &&
								(innerText($("DivTeachBar"), "点击开放的组织格，部署中性粒细胞！"),
								EditImg($("PointerUD"), "", "images/immune_mod/ui/guide_arrow_down.svg", {
									left: "170px",
									top: "270px",
								}),
								++step);
							oSym.addTask(10, arguments.callee, [step]);
							break;
						case 2: {
							const grid = oGd.$;
							while (--column) {
								if (grid["3_" + column + "_1"]) {
									SetHidden($("PointerUD"));
									innerText($("DivTeachBar"), "收集落下的能量泡！");
									AutoProduceSun(25);
									oSym.addTask(10, arguments.callee, [++step]);
									return;
								}
							}
							!chosen && (ClearChild($("PointerUD")), (step = 0));
							oSym.addTask(10, arguments.callee, [step]);
							break;
						}
						case 3:
							oS.SunNum > 99 &&
								(innerText($("DivTeachBar"), "能量够了，再部署一个中性粒细胞！"),
								EditImg($("PointerUD"), "", "images/immune_mod/ui/guide_arrow_up.svg", {
									left: "50px",
									top: "60px",
									visibility: "visible",
								}),
								++step);
							oSym.addTask(10, arguments.callee, [step]);
							break;
						default: {
							let count = 0;
							const grid = oGd.$;
							while (--column) grid["3_" + column + "_1"] && ++count;
							count >= 2
								? (SetHidden($("PointerUD")),
									innerText($("DivTeachBar"), "别让细菌穿过健康防线！"),
									oP.AddZombiesFlag(),
									oSym.addTask(500, SetNone, [$("DivTeachBar")]))
								: oSym.addTask(10, arguments.callee, [4]);
						}
					}
				},
			});
			BeginCool();
			SetVisible($("dFlagMeter"), $("dTop"));
		},
	},
	{
		AZ: [[oAirwayBacterium, 5, 1]],
		FlagNum: 5,
		FlagToSumNum: { a1: [3], a2: [1, 2] },
		FlagToMonitor: { 4: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/vascular_entry.png",
				"left:667px;top:330px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oVascularEntry, "immune-2");
					},
				}
			);
			EditImg($("PointerUD"), 0, "images/immune_mod/ui/guide_arrow_down.svg", {
				left: "676px",
				top: "295px",
				visibility: "visible",
			});
		},
	}
);
