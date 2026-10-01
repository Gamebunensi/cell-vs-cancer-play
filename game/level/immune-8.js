oS.Init(
	{
		PName: [oNeutrophil, oVascularEntry, oComplementBurst, oEpithelialBarrier, oNETTrap, oGobletCell, oMacrophage],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3, oEncapsulatedPneumococcus, oDenseCapsulePneumococcus],
		FlagZombie: oDenseCapsulePneumococcus,
		PicArr: (function () {
			var a = oActivatedNeutrophil.prototype;
			var b = a.PicArr;
			return [
				"images/immune_mod/worlds/airway.png",
				b[a.CardGif],
				b[a.NormalGif],
				"images/immune_mod/ui/recruitment_orb.svg",
				"images/immune_mod/ui/mucociliary_sweep.svg",
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/airway.png",
		CanSelectCard: 1,
		LevelName: "上呼吸道 1-8 厚荚膜来袭",
		LvlEName: "immune-8",
		BrainsNum: 1,
		DKind: 1,
		ImmuneMod: true,
		FlagIcon: oDenseCapsulePneumococcus.prototype.PicArr[oDenseCapsulePneumococcus.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag1") },
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
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 2, 1],
			[oDenseCapsulePneumococcus, 1, 1],
		],
		FlagNum: 10,
		FlagToSumNum: { a1: [3, 5, 9], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 9: [ImmuneMod.showMajorWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oActivatedNeutrophil.prototype.PicArr[oActivatedNeutrophil.prototype.CardGif],
				"left:827px;top:525px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oActivatedNeutrophil, "immune-9");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
