oS.Init(
	{
		PName: [oNeutrophil, oVascularEntry, oComplementBurst, oEpithelialBarrier, oNETTrap, oGobletCell],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3, oEncapsulatedPneumococcus, oInvasiveAspergillus],
		FlagZombie: oInvasiveAspergillus,
		PicArr: (function () {
			var a = oMacrophage.prototype;
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
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-7 吞噬耐力战",
		LvlEName: "immune-7",
		BrainsNum: 1,
		DKind: 1,
		ImmuneMod: true,
		FlagIcon: oInvasiveAspergillus.prototype.PicArr[oInvasiveAspergillus.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		LoadAccess(startAccess) {
			ImmuneMod.applyBattleTheme();
			startAccess();
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
			[oInvasiveAspergillus, 1, 1],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [1, 2, 3, 10, 4, 5, 6, 15],
		},
		FlagToMonitor: { 9: [ImmuneMod.showMajorWave, 0], 19: [ImmuneMod.showMajorWave, 0] },
		FlagToEnd() {
			NewImg("imgSF", oMacrophage.prototype.PicArr[oMacrophage.prototype.CardGif], "left:667px;top:220px;clip:rect(auto,auto,60px,auto)", EDAll, {
				onclick() {
					GetNewCard(this, oMacrophage, "immune-8");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:185px;left:676px", EDAll);
		},
	}
);
