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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oInvasiveAspergillus,
			oDenseCapsulePneumococcus,
		],
		FlagZombie: oDenseCapsulePneumococcus,
		PicArr: [
			"images/immune_mod/worlds/airway.png",
			"images/immune_mod/ui/pathogen_note_small.svg",
			"images/immune_mod/ui/pathogen_note.svg",
			"images/immune_mod/ui/recruitment_orb.svg",
			"images/immune_mod/ui/mucociliary_sweep.svg",
		],
		backgroundImage: "images/immune_mod/worlds/airway.png",
		CanSelectCard: 1,
		LevelName: "上呼吸道 1-9 三十波警报",
		LvlEName: "immune-9",
		BrainsNum: 1,
		DKind: 1,
		ImmuneMod: true,
		FlagIcon: oDenseCapsulePneumococcus.prototype.PicArr[oDenseCapsulePneumococcus.prototype.NormalGif],
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
		LoadAccess(startChooser) {
			ImmuneMod.prepareChooser(startChooser);
		},
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oInvasiveAspergillus, 1, 1],
			[oDenseCapsulePneumococcus, 1, 1],
		],
		FlagNum: 30,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19, 20, 23, 25, 29],
			a2: [1, 2, 3, 10, 4, 5, 6, 15, 7, 8, 9, 25],
		},
		FlagToMonitor: {
			9: [ImmuneMod.showMajorWave, 0],
			19: [ImmuneMod.showMajorWave, 0],
			29: [ImmuneMod.showMajorWave, 0],
		},
		FlagToEnd() {
			NewImg("imgSF", "images/immune_mod/ui/pathogen_note_small.svg", "left:667px;top:220px", EDAll, {
				onclick() {
					PlaySound2("winmusic");
					SetHidden($("PointerUD"));
					LoadMenu(
						"note",
						"images/immune_mod/ui/note_panel.svg",
						{
							overlayImage: "images/immune_mod/ui/pathogen_note.svg",
							callback: () => {
								ImmuneMod.loadLevel("immune-10");
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
