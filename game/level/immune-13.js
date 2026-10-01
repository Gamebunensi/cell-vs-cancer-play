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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oExudateShieldedBacteria,
		],
		FlagZombie: oExudateShieldedBacteria,
		PicArr: (function () {
			var reward = oEnzymaticDebridement.prototype;
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
		LevelName: "低灌注创面 2-3",
		LvlEName: "immune-13",
		ImmuneMod: true,
		FlagIcon: oExudateShieldedBacteria.prototype.PicArr[oExudateShieldedBacteria.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
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
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oExudateShieldedBacteria, 1, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 9: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oEnzymaticDebridement.prototype.PicArr[oEnzymaticDebridement.prototype.CardGif],
				"left:827px;top:525px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oEnzymaticDebridement, "immune-14");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
