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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oQuorumSensingConsortium,
			oExudateShieldedBacteria,
			oQuorumResponderCluster,
			oDenseCapsulePneumococcus,
		],
		FlagZombie: oQuorumSensingConsortium,
		PicArr: [
			"images/immune_mod/worlds/wound.png",
			"images/immune_mod/ui/infection_reservoir.svg",
			"images/immune_mod/ui/infection_mound.svg",
			"images/immune_mod/ui/infection_alert.svg",
			"images/immune_mod/ui/pathogen_note.svg",
		],
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 50,
		LevelName: "低灌注创面 2-9",
		LvlEName: "immune-19",
		ImmuneMod: true,
		FlagIcon: oQuorumSensingConsortium.prototype.PicArr[oQuorumSensingConsortium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		Monitor: { f: AppearTombstones, ar: [5, 9, 11] },
		UserDefinedFlagFunc() {
			oP.FlagNum === oP.FlagZombies &&
				oP.SetTimeoutTomZombie([oAirwayBacterium, oEncapsulatedPneumococcus, oDenseCapsulePneumococcus]);
		},
		StartGameMusic: "Moongrains",
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 1, 1],
			[oAirwayBacterium3, 1, 1],
			[oEncapsulatedPneumococcus, 3, 1],
			[oExudateShieldedBacteria, 1, 1],
			[oQuorumSensingConsortium, 1, 1],
		],
		// Preserve the source level's intentional 10-wave/20-wave metadata mismatch.
		FlagNum: 10,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 15],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg("imgSF", "images/immune_mod/ui/infection_alert.svg", "left:667px;top:220px", EDAll, {
				onclick() {
					SetHidden($("PointerUD"));
					PlaySound2("winmusic");
					LoadMenu(
						"note",
						"images/immune_mod/ui/note_panel.svg",
						{
							overlayImage: "images/immune_mod/ui/pathogen_note.svg",
							callback: () => {
								ImmuneMod.loadLevel("immune-20");
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
