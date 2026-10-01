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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oEncapsulatedPneumococcus,
			oPseudomonasBiofilmAggregate,
			oDenseCapsulePneumococcus,
			oFlagellatedVibrioCholeraeSwarm,
			oInvasiveShigellaMicrocolony,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			return ["images/immune_mod/worlds/lymph.png"];
		})(),
		Coord: 2,
		SunNum: 125,
		LF: [0, 3, 3, 3, 3, 3, 3],
		backgroundImage: "images/immune_mod/worlds/lymph.png",
		CanSelectCard: 1,
		DKind: 0,
		LevelName: "淋巴结窦道 4-4",
		LvlEName: "immune-34",
		OriginalLvlEName: 33,
		ImmuneMod: true,
		FlagIcon: oAirwayBacterium.prototype.PicArr[oAirwayBacterium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: {
			10: $("imgFlag3"),
			20: $("imgFlag2"),
			30: $("imgFlag1"),
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
			[oAirwayBacterium2, 1, 1],
			[oEncapsulatedPneumococcus, 1, 4],
			[oPseudomonasBiofilmAggregate, 1, 10],
			[oDenseCapsulePneumococcus, 1, 15],
			[oFlagellatedVibrioCholeraeSwarm, 1, 2],
			[oInvasiveShigellaMicrocolony, 1, 2],
		],
		FlagNum: 30,
		FlagToSumNum: {
			a1: [3, 4, 5, 9, 13, 15, 19, 20, 23, 25],
			a2: [1, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10],
		},
		FlagToMonitor: {
			9: [ShowLargeWave, 0],
			19: [ShowLargeWave, 0],
			29: [ShowFinalWave, 0],
		},
		FlagToEnd() {
			NewImg(
				"imgSF",
				oCD169SubcapsularMacrophageBarrier.prototype.PicArr[oCD169SubcapsularMacrophageBarrier.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oCD169SubcapsularMacrophageBarrier, "immune-35");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
		},
	}
);
