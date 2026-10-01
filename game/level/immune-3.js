oS.Init(
	{
		PName: [oNeutrophil, oVascularEntry, oComplementBurst],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			const reward = oEpithelialBarrier.prototype;
			return [
				"images/immune_mod/worlds/airway.png",
				reward.PicArr[reward.CardGif],
				reward.PicArr[reward.NormalGif],
			];
		})(),
		backgroundImage: "images/immune_mod/worlds/airway.png",
		LF: [0, 0, 1, 1, 1, 0],
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-3 · 荚膜来袭",
		LvlEName: "immune-3",
		ImmuneMod: true,
		FlagIcon: "images/immune_mod/enemies/pneumococcus_capsulated.png",
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LoadAccess(startGame) {
			ImmuneMod.applyBattleTheme();
			startGame();
		},
		LargeWaveFlag: { 8: $("imgFlag1") },
		InitLawnMower() {
			let row = 5;
			while (--row > 1) CustomSpecial(oMucociliarySweep, row, -1);
		},
		StartGame() {
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			SetVisible($("dFlagMeter"), $("dTop"));
			oS.InitLawnMower();
			PrepareGrowPlants(() => {
				oP.Monitor();
				BeginCool();
				AutoProduceSun(25);
				oSym.addTask(
					1500,
					() => {
						oP.AddZombiesFlag();
						SetVisible($("dFlagMeterContent"));
					},
					[]
				);
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 3, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 1, 1],
		],
		FlagNum: 8,
		FlagToSumNum: { a1: [3, 5, 7], a2: [1, 2, 3, 6] },
		FlagToMonitor: { 7: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/epithelial_barrier.png",
				"left:827px;top:330px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oEpithelialBarrier, "immune-4");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:295px;left:836px", EDAll);
		},
	}
);
