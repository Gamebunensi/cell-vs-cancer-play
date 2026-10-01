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
			oEnzymaticDebridement,
			oLyticPhageTherapy,
			oSkinDendriticSentinel,
			oLactoferrinNutrientRestriction,
			oWideSharpDebridement,
			oActivatedEndothelialAdhesionSite,
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oEncapsulatedPneumococcus,
		],
		FlagZombie: oMeningococcalBloodstreamCluster,
		PicArr: (function () {
			var a = oNeutrophilSwarmStrike.prototype;
			var b = a.PicArr;
			return [
				"images/immune_mod/worlds/blood.png",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/immune_guide.svg",
				b[a.CardGif],
				b[a.NormalGif],
			];
		})(),
		Coord: 2,
		SunNum: 50,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 1,
		LevelName: "血流防线 3-1 · 液面部署",
		LvlEName: "immune-21",
		AudioArr: ["crazydaveshort2", "crazydavelong1", "crazydavelong2", "crazydavelong3"],
		ImmuneMod: true,
		FlagIcon: oMeningococcalBloodstreamCluster.prototype.PicArr[oMeningococcalBloodstreamCluster.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
		StartGameMusic: "WateryGraves",
		InitLawnMower() {
			let row = 7;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		LoadAccess(a) {
			NewImg("dDave", "images/immune_mod/ui/immune_guide.svg", "left:0;top:81px", EDAll);
			NewEle("DivTeach", "div", 0, 0, EDAll);
			(function (d) {
				var b = arguments.callee;
				var c = $("DivTeach");
				switch (d) {
					case 0:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [1]);
								};
							},
							[]
						);
						innerText(c, "感染进入血流了，我们要守住新的血管防线。");
						break;
					case 1:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [2]);
								};
							},
							[]
						);
						innerText(c, "中央两条通道是液面，部署方式和组织格不同。");
						break;
					case 2:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [3]);
								};
							},
							[]
						);
						innerText(c, "先放置活化血管内皮黏附位点，再部署普通细胞。");
						break;
					case 3:
						PlaySound2("crazydaveshort2");
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							1,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [4]);
								};
							},
							[]
						);
						innerText(c, "留意脑膜炎球菌的荚膜，单个攻击单位可能挡不住它。");
						break;
					case 4:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [5]);
								};
							},
							[]
						);
						innerText(c, "带好供能微血管，一起稳住六条通路！");
						break;
					case 5:
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						ClearChild($("DivTeach"));
						oSym.addTask(
							5,
							() => {
								ClearChild($("dDave"));
								a(0);
							},
							[]
						);
				}
			})(0);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 3, 1],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10]],
			[oEncapsulatedPneumococcus, 2, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 9: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oNeutrophilSwarmStrike.prototype.PicArr[oNeutrophilSwarmStrike.prototype.CardGif],
				"left:827px;top:525px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						ImmuneMod.loadLevel("immune-22");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
