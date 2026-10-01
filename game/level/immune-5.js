oS.Init(
	{
		PName: [
			oNeutrophil,
			oVascularEntry,
			oComplementBurst,
			oEpithelialBarrier,
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			const reward = oNETTrap.prototype;
			return [
				"images/immune_mod/worlds/airway.png",
				"images/immune_mod/ui/tissue_damage.svg",
				reward.PicArr[reward.CardGif],
				reward.PicArr[reward.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/airway.png",
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-5 · 回收与受损斑",
		LvlEName: "immune-5",
		ImmuneMod: true,
		FlagIcon: "images/immune_mod/enemies/pneumococcus_capsulated.png",
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LvlClearFunc() {
			oSym.TimeStep = 10;
		},
		LargeWaveFlag: { 10: $("imgFlag1") },
		StartGameMusic: "LoonSkirmish",
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		LoadAccess(startGame) {
			ImmuneMod.applyBattleTheme();
			NewImg("dDave", "images/immune_mod/ui/immune_guide.svg", "left:0;top:81px", EDAll);
			NewEle("DivTeach", "div", 0, 0, EDAll);
			(function teach(step) {
				const panel = $("DivTeach");
				switch (step) {
					case 0:
						PlaySound2("crazydaveshort1");
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							1,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [1]);
							},
							[]
						);
						innerText(panel, "前四关守住了！现在防线要学会重新布置。");
						break;
					case 1:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [2]);
							},
							[]
						);
						innerText(panel, "你刚解锁了凋亡回收工具。");
						break;
					case 2:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [3]);
							},
							[]
						);
						innerText(panel, "先清掉组织格上三个位置不合适的中性粒细胞。");
						break;
					case 3:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [4]);
							},
							[]
						);
						innerText(panel, "选择右上角工具，再点击要回收的单位。");
						break;
					case 4:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [5]);
							},
							[]
						);
						innerText(panel, "开始整理防线！");
						break;
					default:
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						ClearChild(panel);
						oSym.addTask(
							5,
							() => {
								ClearChild($("dDave"));
								startGame(0);
							},
							[]
						);
				}
			})(0);
		},
		StartGame() {
			SetHidden($("dSunNum"));
			SetVisible($("tdShovel"), $("dTop"));
			NewEle("DivTeachBar", "div", 0, 0, EDAll);
			oP.Monitor(
				{
					ar: [0],
					f(step) {
						const grid = oGd.$;
						const chosen = oS.Chose;
						switch (step) {
							case 0:
								innerText($("DivTeachBar"), "点击凋亡回收工具！");
								NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_up.svg", "top:36px;left:250px", EDAll);
								oSym.addTask(10, arguments.callee, [++step]);
								break;
							case 1:
								chosen < 0 && (innerText($("DivTeachBar"), "再点击一个中性粒细胞，把它回收！"), ++step);
								oSym.addTask(10, arguments.callee, [step]);
								break;
							case 2:
								!(grid["2_6_1"] && grid["3_8_1"] && grid["4_7_1"])
									? (innerText($("DivTeachBar"), "继续回收，直到组织格上的三个单位全部离场！"), ++step)
									: chosen > -1 && (innerText($("DivTeachBar"), "点击这些单位完成回收！"), (step = 1));
								oSym.addTask(10, arguments.callee, [step]);
								break;
							default:
								!(grid["2_6_1"] || grid["3_8_1"] || grid["4_7_1"])
									? (function () {
											SetHidden($("DivTeachBar"), $("PointerUD"));
											SetVisible($("dSunNum"), $("dFlagMeter"), $("dTop"));
											StopMusic();
											PlayMusic((oS.LoadMusic = oS.StartGameMusic));
											oS.InitLawnMower();
											PrepareGrowPlants(() => {
												BeginCool();
												AutoProduceSun(25);
												oSym.addTask(
													2e3,
													() => {
														oP.AddZombiesFlag();
														SetVisible($("dFlagMeterContent"));
													},
													[]
												);
											});
										})()
									: oSym.addTask(10, arguments.callee, [3]);
						}
					},
				},
				() => {
					const row = Math.floor(1 + Math.random() * 5);
					const column = Math.floor(1 + Math.random() * 9);
					const left = GetX(column) - 55;
					const top = GetY(row) - 60;
					const key = row + "_" + column;
					const flag = oP.FlagZombies;
					let crater;

					switch (true) {
						case flag > 3:
							SetStyle((crater = $("imgCrater")), {
								left: left + "px",
								top: top + "px",
								zIndex: 3 * row,
							});
							delete oGd.$Crater[crater.getAttribute("S")];
							oGd.$Crater[key] = 2;
							crater.setAttribute("S", key);
							(crater = oGd.$[key + "_1"]) && crater.Die();
							break;
						case flag > 2:
							NewImg(
								"imgCrater",
								"images/immune_mod/ui/tissue_damage.svg",
								"left:" + left + "px;top:" + top + "px;z-index:" + 3 * row,
								EDAll
							).setAttribute("S", key);
							(crater = oGd.$[key + "_1"]) && crater.Die();
							oGd.$Crater[key] = 2;
					}
				}
			);
			SetVisible($("dFlagMeter"));
			CustomPlants(0, 2, 6);
			CustomPlants(0, 3, 8);
			CustomPlants(0, 4, 7);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 3, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 9: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/net_trap.png",
				"left:587px;top:270px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oNETTrap, "immune-6");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:235px;left:596px", EDAll);
		},
	}
);
