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
		],
		ZName: [
			oAirwayBacterium,
			oEncapsulatedPneumococcus,
			oToxinBurstClostridioidesCluster,
			oFlagellatedVibrioCholeraeSwarm,
			oLymphBorneEnvelopedVirion,
			oPseudomonasBiofilmAggregate,
			oInvasiveShigellaMicrocolony,
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
		LevelName: "淋巴结窦道 4-9：血管扩增",
		LvlEName: "immune-39",
		OriginalLvlEName: 39,
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
			50: $("imgFlag1"),
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
			[oEncapsulatedPneumococcus, 2, 1],
			[oFlagellatedVibrioCholeraeSwarm, 2, 5, [5, 10, 15, 20, 25, 30, 45, 50]],
			[oToxinBurstClostridioidesCluster, 1, 10, [10, 30, 45, 50]],
			[oLymphBorneEnvelopedVirion, 2, 7, [7, 10, 15, 20, 25, 30, 45, 50]],
			[oPseudomonasBiofilmAggregate, 3, 20, [20, 25, 30, 45, 50]],
			[oInvasiveShigellaMicrocolony, 1, 1],
		],
		FlagNum: 50,
		FlagToSumNum: {
			a1: [3, 4, 5, 9, 9, 13, 15, 19, 20, 23, 25, 30, 50],
			a2: [1, 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 10, 20, 30, 45],
		},
		FlagToMonitor: {
			9: [ShowLargeWave, 0],
			19: [ShowLargeWave, 0],
			29: [ShowLargeWave, 0],
			49: [ShowFinalWave, 0],
		},
		FlagToEnd() {
			NewImg("imgSF", "images/immune_mod/ui/infection_alert.svg", "left:667px;top:220px", EDAll, {
				onclick() {
					PlaySound2("winmusic");
					SetHidden($("PointerUD"));
					LoadMenu(
						"note",
						"images/immune_mod/ui/note_panel.svg",
						{
							overlayImage: "images/immune_mod/ui/pathogen_note.svg",
							callback: () => {
								ImmuneMod.loadLevel("immune-40");
							},
						},
						this
					);
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:185px;left:676px", EDAll);
		},
	}
);
