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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oThickCapsuleMeningococcalCluster,
			oDenseCapsuleMeningococcalCluster,
			oEncapsulatedPneumococcus,
			oExudateShieldedBacteria,
			oDenseCapsulePneumococcus,
			oInvasiveAspergillus,
			oListeriaMonocyteCarrier,
		],
		FlagZombie: oListeriaMonocyteCarrier,
		PicArr: (function () {
			var a = oAntimicrobialFibrinolyticFlush.prototype;
			var b = a.PicArr;
			return ["images/immune_mod/worlds/blood.png", "images/immune_mod/ui/immune_medal.svg", b[a.CardGif], b[a.NormalGif]];
		})(),
		Coord: 2,
		SunNum: 50,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 1,
		LevelName: "血流防线 3-4",
		LvlEName: "immune-24",
		ImmuneMod: true,
		FlagIcon: oListeriaMonocyteCarrier.prototype.PicArr[oListeriaMonocyteCarrier.prototype.NormalGif],
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
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oExudateShieldedBacteria, 1, 1],
			[oInvasiveAspergillus, 1, 1],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10, 20, 29, 30]],
			[oThickCapsuleMeningococcalCluster, 1, 6],
			[oDenseCapsuleMeningococcalCluster, 1, 6],
			[oEncapsulatedPneumococcus, 1, 1],
			[oDenseCapsulePneumococcus, 1, 1],
			[oListeriaMonocyteCarrier, 1, 7, [29, 30]],
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
			NewImg("imgSF", "images/immune_mod/ui/immune_medal.svg", "left:417px;top:233px;z-index:255", EDAll, {
				onclick() {
					ImmuneMod.loadLevel("immune-25");
				},
			});
		},
	}
);
