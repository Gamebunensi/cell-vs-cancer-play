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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oThickCapsuleMeningococcalCluster,
			oDenseCapsuleMeningococcalCluster,
			oEncapsulatedPneumococcus,
			oDenseCapsulePneumococcus,
			oPiliatedInvasiveMeningococcalCluster,
			oInvasiveAspergillus,
			oStaphFibrinBiofilmFront,
		],
		FlagZombie: oStaphFibrinBiofilmFront,
		PicArr: ["images/immune_mod/worlds/blood.png", "images/immune_mod/ui/infection_alert.svg", "images/immune_mod/ui/pathogen_note.svg"],
		Coord: 2,
		SunNum: 50,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 1,
		LevelName: "血流防线 3-9",
		LvlEName: "immune-29",
		ImmuneMod: true,
		FlagIcon: oStaphFibrinBiofilmFront.prototype.PicArr[oStaphFibrinBiofilmFront.prototype.NormalGif],
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
		UserDefinedFlagFunc(a) {
			oP.FlagNum === oP.FlagZombies && oP.SetTimeoutWaterZombie(6, 9, 3, [oMeningococcalBloodstreamCluster]);
		},
		StartGameMusic: "WateryGraves",
		InitLawnMower() {
			let row = 7;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 1, 1],
			[oAirwayBacterium2, 3, 1],
			[oAirwayBacterium3, 1, 1],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10, 19, 20, 25, 30]],
			[oThickCapsuleMeningococcalCluster, 1, 6, [10, 20, 30]],
			[oDenseCapsuleMeningococcalCluster, 1, 6, [10, 20, 30]],
			[oEncapsulatedPneumococcus, 1, 1],
			[oDenseCapsulePneumococcus, 1, 1],
			[oInvasiveAspergillus, 1, 10],
			[oPiliatedInvasiveMeningococcalCluster, 1, 10, [10, 14, 15, 16, 18, 19, 20]],
			[oStaphFibrinBiofilmFront, 1, 30, [30]],
		],
		FlagNum: 30,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19, 20, 23, 25, 29],
			a2: [1, 2, 3, 10, 4, 5, 6, 15, 7, 8, 9, 25],
		},
		FlagToMonitor: {
			9: [ShowLargeWave, 0],
			19: [ShowLargeWave, 0],
			29: [ShowFinalWave, 0],
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
								ImmuneMod.loadLevel("immune-30");
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
