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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oQuorumSensingConsortium,
			oQuorumResponderCluster,
		],
		FlagZombie: oQuorumSensingConsortium,
		PicArr: [
			"images/immune_mod/worlds/wound.png",
			"images/immune_mod/ui/infection_reservoir.svg",
			"images/immune_mod/ui/infection_mound.svg",
			oWideSharpDebridement.prototype.PicArr[oWideSharpDebridement.prototype.CardGif],
		],
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 1,
		DKind: 0,
		SunNum: 50,
		LevelName: "低灌注创面 2-8",
		LvlEName: "immune-18",
		ImmuneMod: true,
		FlagIcon: oQuorumSensingConsortium.prototype.PicArr[oQuorumSensingConsortium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
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
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oQuorumSensingConsortium, 1, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 15] },
		FlagToMonitor: { 9: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/wide_sharp_debridement.png",
				"left:587px;top:270px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						// Original level 18 returns to the selector with SelectModal(0).
						ImmuneMod.loadLevel("immune-19");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:235px;left:596px", EDAll);
		},
	}
);
