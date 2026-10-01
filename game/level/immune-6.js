oS.Init(
	{
		PName: [oNeutrophil, oVascularEntry, oComplementBurst, oEpithelialBarrier, oNETTrap],
		ZName: [oAirwayBacterium, oAirwayBacterium2, oAirwayBacterium3, oEncapsulatedPneumococcus, oInvasiveAspergillus],
		FlagZombie: oInvasiveAspergillus,
		PicArr: (function () {
			var a = oGobletCell.prototype;
			var b = a.PicArr;
			return [
				"images/immune_mod/worlds/airway.png",
				"images/immune_mod/ui/tissue_damage.svg",
				b[a.CardGif],
				b[a.NormalGif],
				"images/immune_mod/ui/recruitment_orb.svg",
				"images/immune_mod/ui/mucociliary_sweep.svg",
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/airway.png",
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-6 黏液新防线",
		LvlEName: "immune-6",
		BrainsNum: 1,
		DKind: 1,
		ImmuneMod: true,
		FlagIcon: oInvasiveAspergillus.prototype.PicArr[oInvasiveAspergillus.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 9: $("imgFlag1") },
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
		FlagNum: 9,
		FlagToSumNum: { a1: [3, 5, 8], a2: [1, 2, 3, 9] },
		FlagToMonitor: { 8: [ImmuneMod.showMajorWave, 0] },
		FlagToEnd() {
			NewImg("imgSF", oGobletCell.prototype.PicArr[oGobletCell.prototype.CardGif], "left:827px;top:525px;clip:rect(auto,auto,60px,auto)", EDAll, {
				onclick() {
					GetNewCard(this, oGobletCell, "immune-7");
				},
			});
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:490px;left:836px", EDAll);
		},
	}
);
