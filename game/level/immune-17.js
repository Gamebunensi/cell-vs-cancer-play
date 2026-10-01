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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oExudateShieldedBacteria,
			oFibrinWrappedStaphCluster,
		],
		FlagZombie: oFibrinWrappedStaphCluster,
		PicArr: (function () {
			var reward = oLactoferrinNutrientRestriction.prototype;
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
		LevelName: "低灌注创面 2-7",
		LvlEName: "immune-17",
		ImmuneMod: true,
		FlagIcon: oFibrinWrappedStaphCluster.prototype.PicArr[oFibrinWrappedStaphCluster.prototype.NormalGif],
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
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oEncapsulatedPneumococcus, 3, 1],
			[oExudateShieldedBacteria, 1, 1],
			[oFibrinWrappedStaphCluster, 1, 1],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 15],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oLactoferrinNutrientRestriction.prototype.PicArr[oLactoferrinNutrientRestriction.prototype.CardGif],
				"left:587px;top:270px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oLactoferrinNutrientRestriction, "immune-18");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:235px;left:596px", EDAll);
		},
	}
);
