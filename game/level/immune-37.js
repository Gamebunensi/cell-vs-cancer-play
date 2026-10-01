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
		],
		ZName: [
			oAirwayBacterium,
			oDenseCapsulePneumococcus,
			oEncapsulatedPneumococcus,
			oPseudomonasBiofilmAggregate,
			oToxinBurstClostridioidesCluster,
			oFlagellatedVibrioCholeraeSwarm,
			oLymphBorneEnvelopedVirion,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			return ["images/immune_mod/worlds/lymph.png"];
		})(),
		Coord: 2,
		SunNum: 200,
		LF: [0, 3, 3, 3, 3, 3, 3],
		backgroundImage: "images/immune_mod/worlds/lymph.png",
		CanSelectCard: 1,
		DKind: 0,
		LevelName: "淋巴结窦道 4-7：游离病毒",
		LvlEName: "immune-37",
		OriginalLvlEName: 37,
		ImmuneMod: true,
		FlagIcon: oAirwayBacterium.prototype.PicArr[oAirwayBacterium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: {
			10: $("imgFlag4"),
			20: $("imgFlag3"),
			30: $("imgFlag2"),
			40: $("imgFlag1"),
		},
		StartGameMusic: "Lg_pk",
		InitLawnMower() {
			let row = 7;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 4, 1],
			[oDenseCapsulePneumococcus, 1, 20],
			[oEncapsulatedPneumococcus, 1, 6],
			[oPseudomonasBiofilmAggregate, 1, 10, [10, 15, 20, 25, 30]],
			[oFlagellatedVibrioCholeraeSwarm, 1, 20],
			[oToxinBurstClostridioidesCluster, 1, 30, [30]],
			[oLymphBorneEnvelopedVirion, 1, 5, [5, 10, 15, 20, 25, 30]],
		],
		FlagNum: 40,
		FlagToSumNum: {
			a1: [3, 4, 5, 9, 9, 13, 15, 19, 20, 23, 25, 30],
			a2: [1, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10, 20, 30],
		},
		FlagToMonitor: {
			9: [ShowLargeWave, 0],
			19: [ShowLargeWave, 0],
			29: [ShowLargeWave, 0],
			39: [ShowFinalWave, 0],
		},
		FlagToEnd() {
			NewImg(
				"imgSF",
				oGMCSFPrimedNeutrophil.prototype.PicArr[oGMCSFPrimedNeutrophil.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oGMCSFPrimedNeutrophil, "immune-38");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
		},
	}
);
