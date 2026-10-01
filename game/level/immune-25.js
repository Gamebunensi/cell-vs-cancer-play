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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oThickCapsuleMeningococcalCluster,
			oEncapsulatedPneumococcus,
			oStaphFibrinBiofilmFront,
		],
		FlagZombie: oStaphFibrinBiofilmFront,
		PicArr: (function () {
			var a = oAntimicrobialFibrinolyticFlush.prototype;
			var b = a.PicArr;
			return ["images/immune_mod/worlds/blood.png", b[a.CardGif], b[a.NormalGif]];
		})(),
		Coord: 2,
		SunNum: 375,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 1,
		LevelName: "血流防线 3-5 · 快速侵袭",
		LvlEName: "immune-25",
		ImmuneMod: true,
		FlagIcon: oStaphFibrinBiofilmFront.prototype.PicArr[oStaphFibrinBiofilmFront.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LvlClearFunc() {
			oSym.Clear();
		},
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		LoadAccess(a) {
			NewImg("dDave", "images/immune_mod/ui/immune_guide.svg", "left:0;top:81px", EDAll);
			NewEle("DivTeach", "div", 0, 0, EDAll);
			(function (d) {
				var b = arguments.callee;
				var c = $("DivTeach");
				switch (d) {
					case 0:
						PlaySound2("crazydaveshort1");
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							1,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [1]);
								};
							},
							[]
						);
						innerText(c, "这次病原体的移动速度会明显加快。");
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
						innerText(c, "提前铺好防线，别等它们靠近健康组织才部署。");
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
						innerText(c, "用屏障和持续攻击，守住血流通路！");
						break;
					case 3:
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
		StartGameMusic: "LoonSkirmish",
		InitLawnMower() {
			let row = 7;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		StartGame() {
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
			oS.InitLawnMower();
			PrepareGrowPlants(() => {
				oP.Monitor({
					ar: [],
					f() {
						oSym.TimeStep = 4;
					},
				});
				BeginCool();
				AutoProduceSun(25);
				oSym.addTask(
					1500,
					() => {
						oP.AddZombiesFlag();
						SetVisible($("dFlagMeterContent"));
					},
					[]
				);
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 3, 5],
			[oAirwayBacterium3, 1, 9],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10, 20, 29, 30]],
			[oThickCapsuleMeningococcalCluster, 1, 10],
			[oDenseCapsuleMeningococcalCluster, 1, 13],
			[oEncapsulatedPneumococcus, 1, 5],
			[oStaphFibrinBiofilmFront, 1, 15, [15, 20]],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 3, 5, 20, 10, 15, 20],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg("imgSF", "images/immune_mod/ui/immune_medal.svg", "left:260px;top:233px", EDAll, {
				onclick() {
					ImmuneMod.loadLevel("immune-26");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:195px;left:290px", EDAll);
		},
	}
);
