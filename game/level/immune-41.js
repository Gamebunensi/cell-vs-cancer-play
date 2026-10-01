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
			oChemotacticNeutrophilPatrol,
			oIgMComplementCaptureComplex,
			oMedullarySinusMacrophage,
			oCD169SubcapsularMacrophageBarrier,
			oOpsonophagocyticClearanceZone,
			oNeutralizingAntibodyPlasmaCell,
			oGMCSFPrimedNeutrophil,
			oExpandedEnergyMicrovasculature,
			oBacteriostaticInfusion,
		],
		ZName: [oThickCapsuleMeningococcalCluster, oDenseCapsuleMeningococcalCluster, oFibrinShieldedBloodstreamCluster, oMeningococcalBloodstreamCluster],
		PicArr: (function () {
			var a = oBloodstreamPeptideCarrier.prototype;
			var b = a.PicArr;
			return [
				"images/immune_mod/worlds/circulation.png",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/immune_guide.svg",
				"images/immune_mod/ui/immune_guide.svg",
				b[a.CardGif],
				b[a.NormalGif],
				...oCirculatingStaphAggregate.prototype.PicArr,
			];
		})(),
		SunNum: 500,
		LF: [0, 2, 2, 2, 2, 2],
		backgroundImage: "images/immune_mod/worlds/circulation.png",
		CanSelectCard: 1,
		LevelName: "循环液面 5-1",
		LvlEName: "immune-41",
		OriginalLvlEName: 21,
		Coord: 1,
		ImmuneMod: true,
		FlagZombie: oMeningococcalBloodstreamCluster,
		FlagIcon: oMeningococcalBloodstreamCluster.prototype.PicArr[2],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		AudioArr: ["crazydaveshort2", "crazydavelong1", "crazydavelong2", "crazydavelong3"],
		LargeWaveFlag: {},
		InitLawnMower() {
			CustomSpecial(oMucociliarySweep, 1, -1);
			CustomSpecial(oMucociliarySweep, 2, -1);
			CustomSpecial(oMucociliarySweep, 3, -1);
			CustomSpecial(oMucociliarySweep, 4, -1);
			CustomSpecial(oMucociliarySweep, 5, -1);
		},
		UserDefinedFlagFunc(a) {
			oP.FlagNum === oP.FlagZombies && oP.SetTimeoutWaterZombie(8, 9, 1, [oCirculatingStaphAggregate]);
		},
		StartGameMusic: "jiaxing",
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
						innerText(c, "淋巴结防线守住了！下一站，循环液面。");
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
						innerText(c, "这次五条通道都是液面，先铺好血流黏附位点。");
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
						innerText(c, "双脉冲抑菌灌流能延缓细胞外细菌，给防线争取时间。");
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
						innerText(c, "当心末波的大型聚集体，单个巨噬细胞可吞不下它！");
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
						innerText(c, "守住这一关，就能获得直接部署在液面的抗菌肽载体。");
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
			[oThickCapsuleMeningococcalCluster, 1, 5],
			[oDenseCapsuleMeningococcalCluster, 1, 7],
			[oMeningococcalBloodstreamCluster, 6, 1],
			[oFibrinShieldedBloodstreamCluster, 1, 9],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 15],
		},
		FlagToMonitor: {},
		FlagToEnd() {
			NewImg("imgSF", oBloodstreamPeptideCarrier.prototype.PicArr[0], "left:827px;top:525px;clip:rect(auto,auto,60px,auto)", EDAll, {
				onclick() {
					GetNewCard(this, oBloodstreamPeptideCarrier, "immune-42");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
