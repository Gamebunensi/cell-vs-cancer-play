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
			oNeutrophilSwarmStrike,
			oTriLaneAntimicrobialInfusion,
			oPlateletFibrinCaptureNet,
			oAntimicrobialFibrinolyticFlush,
			oMechanobactericidalNanopillarArray,
			oMPOOxidativeAmplificationSite,
			oReinforcedEndothelialPericyteBarrier,
			oLocalCapillaryPerfusionNetwork,
		],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oEncapsulatedPneumococcus],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			return ["images/immune_mod/worlds/lymph.png", "images/immune_mod/ui/immune_guide.svg"];
		})(),
		Coord: 2,
		SunNum: 100,
		LF: [0, 3, 3, 3, 3, 3, 3],
		backgroundImage: "images/immune_mod/worlds/lymph.png",
		CanSelectCard: 1,
		DKind: 0,
		LevelName: "淋巴结窦道 4-1",
		LvlEName: "immune-31",
		OriginalLvlEName: 31,
		AudioArr: ["crazydavelong1", "crazydavelong3"],
		ImmuneMod: true,
		FlagIcon: oAirwayBacterium.prototype.PicArr[oAirwayBacterium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		StartGameMusic: "Lg_pk",
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
						innerText(c, "我们进入淋巴结窦道了，这里一共有六条通路。");
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
						innerText(c, "病原体正从右侧涌进来，先选好你的防线！");
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
						innerText(c, "带上局部毛细血管灌注网络，补给可别断了。");
						break;
					case 3:
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						ClearChild($("DivTeach"));
						oSym.addTask(
							5,
							() => {
								ClearChild($("dDave"));
								a(0);
								StopMusic();
								PlayMusic((oS.LoadMusic = "ChooseYourSeeds"));
							},
							[]
						);
				}
			})(0);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 6, 1],
			[oAirwayBacterium2, 1, 1],
			[oEncapsulatedPneumococcus, 3, 10],
		],
		FlagNum: 20,
		FlagToSumNum: { a1: [3, 3, 7], a2: [1, 2, 3, 8] },
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oChemotacticNeutrophilPatrol.prototype.PicArr[oChemotacticNeutrophilPatrol.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oChemotacticNeutrophilPatrol, "immune-32");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
		},
	}
);
