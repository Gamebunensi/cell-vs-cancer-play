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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oDispersingBiofilmAggregate,
			oDenseCapsulePneumococcus,
		],
		FlagZombie: oDenseCapsulePneumococcus,
		PicArr: (function () {
			var reward = oHypochlorousDressing.prototype;
			var pictures = reward.PicArr;
			return [
				"images/immune_mod/worlds/wound.png",
				"images/immune_mod/ui/infection_reservoir.svg",
				"images/immune_mod/ui/infection_mound.svg",
				pictures[reward.CardGif],
				pictures[reward.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 50,
		LevelName: "低灌注创面 2-2",
		LvlEName: "immune-12",
		ImmuneMod: true,
		FlagIcon: oDenseCapsulePneumococcus.prototype.PicArr[oDenseCapsulePneumococcus.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		Monitor: { f: AppearTombstones, ar: [7, 9, 4] },
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
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oDispersingBiofilmAggregate, 1, 1],
			[oDenseCapsulePneumococcus, 1, 1],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 20],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oHypochlorousDressing.prototype.PicArr[oHypochlorousDressing.prototype.CardGif],
				"left:587px;top:270px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						ImmuneMod.loadLevel("immune-13");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:235px;left:596px", EDAll);
		},
	}
);
