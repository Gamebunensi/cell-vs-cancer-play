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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oExudateShieldedBacteria,
			oInvasiveAspergillus,
		],
		FlagZombie: oExudateShieldedBacteria,
		PicArr: [
			"images/immune_mod/worlds/wound.png",
			"images/immune_mod/ui/immune_medal.svg",
			"images/immune_mod/ui/infection_reservoir.svg",
			"images/immune_mod/ui/infection_mound.svg",
		],
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 50,
		LevelName: "低灌注创面 2-4",
		LvlEName: "immune-14",
		ImmuneMod: true,
		FlagIcon: oExudateShieldedBacteria.prototype.PicArr[oExudateShieldedBacteria.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		Monitor: { f: AppearTombstones, ar: [6, 9, 7] },
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
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oInvasiveAspergillus, 1, 1],
			[oExudateShieldedBacteria, 1, 1],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 15],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg("imgSF", "images/immune_mod/ui/immune_medal.svg", "left:827px;top:525px;clip:rect(auto,auto,60px,auto)", EDAll, {
				onclick() {
					ImmuneMod.loadLevel("immune-15");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
