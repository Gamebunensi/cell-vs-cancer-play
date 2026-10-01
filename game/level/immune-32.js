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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oEncapsulatedPneumococcus,
			oPseudomonasBiofilmAggregate,
			oDenseCapsulePneumococcus,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			return ["images/immune_mod/worlds/lymph.png"];
		})(),
		Coord: 2,
		SunNum: 100,
		LF: [0, 3, 3, 3, 3, 3, 3],
		backgroundImage: "images/immune_mod/worlds/lymph.png",
		CanSelectCard: 1,
		DKind: 0,
		LevelName: "淋巴结窦道 4-2",
		LvlEName: "immune-32",
		OriginalLvlEName: 32,
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
			[oEncapsulatedPneumococcus, 2, 12],
			[oPseudomonasBiofilmAggregate, 1, 5],
			[oDenseCapsulePneumococcus, 1, 15],
		],
		FlagNum: 30,
		FlagToSumNum: {
			a1: [3, 3, 9, 10, 13, 15],
			a2: [1, 2, 3, 3, 4, 5, 6, 15],
		},
		FlagToMonitor: {
			9: [ShowLargeWave, 0],
			19: [ShowLargeWave, 0],
			29: [ShowFinalWave, 0],
		},
		FlagToEnd() {
			NewImg(
				"imgSF",
				oIgMComplementCaptureComplex.prototype.PicArr[oIgMComplementCaptureComplex.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oIgMComplementCaptureComplex, "immune-33");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
		},
	}
);
