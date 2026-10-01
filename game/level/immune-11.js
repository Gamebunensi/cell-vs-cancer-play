oS.Init(
	{
		PName: [
			oNeutrophil,
			oVascularEntry,
			oComplementBurst,
			oEpithelialBarrier,
			oNETTrap,
			oGobletCell,
			oMacrophage,
			oActivatedNeutrophil,
			oDefensinEpithelium,
		],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3, oDispersingBiofilmAggregate],
		FlagZombie: oDispersingBiofilmAggregate,
		PicArr: (function () {
			var reward = oCapillarySprout.prototype;
			var pictures = reward.PicArr;
			return [
				"images/immune_mod/worlds/wound.png",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/infection_reservoir.svg",
				"images/immune_mod/ui/infection_mound.svg",
				pictures[reward.CardGif],
				pictures[reward.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 50,
		LevelName: "低灌注创面 2-1",
		LvlEName: "immune-11",
		AudioArr: ["crazydaveshort1", "crazydavelong1", "crazydavelong2", "crazydavelong3"],
		ImmuneMod: true,
		FlagIcon: oDispersingBiofilmAggregate.prototype.PicArr[oDispersingBiofilmAggregate.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
		Monitor: { f: AppearTombstones, ar: [7, 9, 4] },
		UserDefinedFlagFunc() {
			oP.FlagNum === oP.FlagZombies && oP.SetTimeoutTomZombie([oAirwayBacterium]);
		},
		StartGameMusic: "Moongrains",
		LoadAccess(startChooser) {
			ImmuneMod.applyBattleTheme();
			NewImg("dDave", "images/immune_mod/ui/immune_guide.svg", "left:0;top:81px", EDAll);
			NewEle("DivTeach", "div", 0, 0, EDAll);
			(function teach(step) {
				var panel = $("DivTeach");
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
						innerText(panel, "创面周围的血流变慢了。");
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
						innerText(panel, "病原体可不会因此停下来。");
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
						innerText(panel, "这里的供能节奏和之前不一样。");
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
						innerText(panel, "外部不会自动送来能量泡。");
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
						innerText(panel, "不过供能微血管仍会持续补给。");
						break;
					case 5:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [6]);
							},
							[]
						);
						innerText(panel, "好在防御素上皮已经准备好了。");
						break;
					case 6:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						panel.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								panel.onclick = () => oSym.addTask(10, teach, [7]);
							},
							[]
						);
						innerText(panel, "它部署很快，多铺几个就能稳住前段。");
						break;
					case 7:
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						ClearChild($("DivTeach"));
						oSym.addTask(
							5,
							() => {
								ClearChild($("dDave"));
								startChooser(0);
							},
							[]
						);
				}
			})(0);
		},
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oDispersingBiofilmAggregate, 2, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 15] },
		FlagToMonitor: { 9: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oCapillarySprout.prototype.PicArr[oCapillarySprout.prototype.CardGif],
				"left:667px;top:220px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						ImmuneMod.loadLevel("immune-12");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:185px;left:676px", EDAll);
		},
	}
);
