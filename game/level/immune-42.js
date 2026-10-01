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
			oBloodstreamPeptideCarrier,
		],
		ZName: [oThickCapsuleMeningococcalCluster, oDenseCapsuleMeningococcalCluster, oFibrinShieldedBloodstreamCluster, oMeningococcalBloodstreamCluster, oListeriaMonocyteCarrier],
		PicArr: (function () {
			var a = oMatchedAntibodyInfusion.prototype;
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
		LevelName: "循环液面 5-2",
		LvlEName: "immune-42",
		OriginalLvlEName: 22,
		Coord: 1,
		ImmuneMod: true,
		FlagZombie: oMeningococcalBloodstreamCluster,
		FlagIcon: oMeningococcalBloodstreamCluster.prototype.PicArr[2],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
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
	},
	{
		AZ: [
			[oThickCapsuleMeningococcalCluster, 1, 6],
			[oDenseCapsuleMeningococcalCluster, 1, 7],
			[oMeningococcalBloodstreamCluster, 6, 2, [2]],
			[oFibrinShieldedBloodstreamCluster, 1, 10],
			[oListeriaMonocyteCarrier, 1, 1, [1]],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 20],
			a2: [1, 2, 3, 10, 4, 5, 9, 15],
		},
		FlagToMonitor: {},
		FlagToEnd() {
			NewImg("imgSF", oMatchedAntibodyInfusion.prototype.PicArr[0], "left:827px;top:525px;clip:rect(auto,auto,60px,auto)", EDAll, {
				onclick() {
					GetNewCard(this, oMatchedAntibodyInfusion, "immune-43");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
