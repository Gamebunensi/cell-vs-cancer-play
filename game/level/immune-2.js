oS.Init(
	{
		PName: [oNeutrophil, oVascularEntry],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			const reward = oComplementBurst.prototype;
			return [
				"images/immune_mod/worlds/airway.png",
				"images/immune_mod/worlds/airway.png",
				reward.PicArr[reward.CardGif],
				reward.PicArr[reward.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/airway.png",
		LF: [0, 0, 1, 1, 1, 0],
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-2 · 建立供能",
		LvlEName: "immune-2",
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
		LargeWaveFlag: { 6: $("imgFlag1") },
		InitLawnMower() {
			let row = 5;
			while (--row > 1) CustomSpecial(oMucociliarySweep, row, -1);
		},
		StartGame() {
			NewImg("imgSF", "images/immune_mod/ui/tutorial_skip.svg", "left:1px;top:150px", EDAll, {
				onclick() {
					ImmuneMod.loadLevel("immune-3");
				},
			});
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			oS.InitLawnMower();
			SetVisible($("dFlagMeter"), $("dTop"));
			PrepareGrowPlants(() => {
				NewEle("DivTeachBar", "div", 0, 0, EDAll);
				oP.Monitor({
					ar: [0],
					f(step) {
						switch (step) {
							case 0:
								innerText($("DivTeachBar"), "供能微血管是防线最重要的补给！");
								NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_up.svg", "top:120px;left:50px", EDAll);
								oSym.addTask(10, arguments.callee, [++step]);
								break;
							case 1: {
								const grid = oGd.$;
								for (const key in grid) {
									if (grid[key].EName === "oVascularEntry") {
										innerText($("DivTeachBar"), "先试着部署至少 3 个供能微血管！");
										oSym
											.addTask(10, arguments.callee, [++step])
											.addTask(
												2500,
												() => {
													oP.AddZombiesFlag();
													SetVisible($("dFlagMeterContent"));
												},
												[]
											);
										return;
									}
								}
								oSym.addTask(10, arguments.callee, [step]);
								break;
							}
							case 2: {
								let count = 0;
								const grid = oGd.$;
								for (const key in grid) grid[key].EName === "oVascularEntry" && ++count;
								count > 1 &&
									(innerHTML($("DivTeachBar"), "补给线越稳定，后续免疫细胞越容易持续部署！"), ++step);
								oSym.addTask(10, arguments.callee, [step]);
								break;
							}
							default: {
								let count = 0;
								const grid = oGd.$;
								for (const key in grid) grid[key].EName === "oVascularEntry" && ++count;
								count > 2
									? (innerHTML($("DivTeachBar"), "供能微血管会周期送来新的能量。"),
										SetStyle($("PointerUD"), { left: "50px", top: "60px" }),
										oSym.addTask(500, SetNone, [$("PointerUD"), $("DivTeachBar")]))
									: oSym.addTask(10, arguments.callee, [3]);
							}
						}
						return step;
					},
				});
				BeginCool();
				AutoProduceSun(25);
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 6, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
		],
		FlagNum: 6,
		FlagToSumNum: { a1: [3, 4], a2: [1, 2, 3] },
		FlagToMonitor: { 5: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/complement_burst.png",
				"left:827px;top:220px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oComplementBurst, "immune-3");
					},
				}
			);
			EditImg($("PointerUD"), 0, "images/immune_mod/ui/guide_arrow_down.svg", {
				left: "836px",
				top: "185px",
				display: "block",
			});
		},
	}
);
