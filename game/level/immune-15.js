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
			oCapillarySprout,
			oHypochlorousDressing,
		],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3, oExudateShieldedBacteria],
		FlagZombie: oExudateShieldedBacteria,
		PicArr: (function () {
			var support = oHypochlorousDressing.prototype;
			var pictures = support.PicArr;
			return [
				"images/immune_mod/worlds/wound.png",
				"images/immune_mod/ui/infection_reservoir.svg",
				"images/immune_mod/ui/infection_mound.svg",
				pictures[support.CardGif],
				pictures[support.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 375,
		LevelName: "低灌注创面 2-5",
		LvlEName: "immune-15",
		ImmuneMod: true,
		FlagIcon: oExudateShieldedBacteria.prototype.PicArr[oExudateShieldedBacteria.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
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
						innerText(panel, "低灌注创面里，安静往往只是表面。");
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
						innerText(panel, "这些感染灶下面藏着成群的细菌。");
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
						innerText(panel, "别松懈，它们会随时从感染灶里涌出来。");
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
						innerText(panel, "先用部署快的防线抢住空位。");
						break;
					case 4:
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
		Monitor: { f: AppearTombstones, ar: [7, 9, 12] },
		UserDefinedFlagFunc() {
			var flag = oP.FlagZombies;
			switch (true) {
				case flag > 8:
					oP.SetTimeoutTomZombie([oAirwayBacterium]);
					break;
				case flag > 5:
					oP.SetTimeoutTomZombie([oAirwayBacterium]);
			}
		},
		StartGameMusic: "Moongrains",
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oExudateShieldedBacteria, 1, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 9: [ShowLargeWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oLyticPhageTherapy.prototype.PicArr[oLyticPhageTherapy.prototype.CardGif],
				"left:827px;top:525px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oLyticPhageTherapy, "immune-16");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
