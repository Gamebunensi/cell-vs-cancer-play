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
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oThickCapsuleMeningococcalCluster,
			oDenseCapsuleMeningococcalCluster,
			oEncapsulatedPneumococcus,
			oListeriaMonocyteCarrier,
		],
		FlagZombie: oListeriaMonocyteCarrier,
		PicArr: (function () {
			var a = oPlateletFibrinCaptureNet.prototype;
			var b = a.PicArr;
			return ["images/immune_mod/worlds/blood.png", b[a.CardGif], b[a.NormalGif]];
		})(),
		Coord: 2,
		SunNum: 50,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 1,
		LevelName: "血流防线 3-3",
		LvlEName: "immune-23",
		ImmuneMod: true,
		FlagIcon: oListeriaMonocyteCarrier.prototype.PicArr[oListeriaMonocyteCarrier.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		UserDefinedFlagFunc(a) {
			oP.FlagNum === oP.FlagZombies &&
				oP.SetTimeoutWaterZombie(6, 9, 3, [
					oMeningococcalBloodstreamCluster,
					oThickCapsuleMeningococcalCluster,
					oDenseCapsuleMeningococcalCluster,
				]);
		},
		StartGameMusic: "WateryGraves",
		InitLawnMower() {
			let row = 7;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 1, 1],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10, 19, 20]],
			[oThickCapsuleMeningococcalCluster, 1, 6, [10, 20]],
			[oDenseCapsuleMeningococcalCluster, 1, 6, [10, 20]],
			[oEncapsulatedPneumococcus, 1, 1],
			[oListeriaMonocyteCarrier, 1, 6, [19, 20]],
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
				oPlateletFibrinCaptureNet.prototype.PicArr[oPlateletFibrinCaptureNet.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						ImmuneMod.loadLevel("immune-24");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
		},
	}
);
