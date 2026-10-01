oS.Init(
	{
		PName: [
			oNeutrophil,
			oVascularEntry,
			oComplementBurst,
			oEpithelialBarrier,
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: [
			"images/immune_mod/worlds/airway.png",
			"images/immune_mod/worlds/airway.png",
			"images/immune_mod/cards/apoptosis_tool.png",
		],
		backgroundImage: "images/immune_mod/worlds/airway.png",
		CanSelectCard: 0,
		LevelName: "上呼吸道 1-4 · 完整防线",
		LvlEName: "immune-4",
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
		LargeWaveFlag: { 9: $("imgFlag1") },
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		StartGame() {
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			oS.InitLawnMower();
			PrepareGrowPlants(() => {
				oP.Monitor();
				BeginCool();
				SetVisible($("dFlagMeter"), $("dTop"));
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
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 2, 1],
		],
		FlagNum: 9,
		FlagToSumNum: { a1: [3, 5, 8], a2: [1, 2, 3, 10] },
		FlagToMonitor: { 8: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				"images/immune_mod/cards/apoptosis_tool.png",
				"left:827px;top:330px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oApoptosisTool, "immune-5");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:295px;left:836px", EDAll);
		},
	}
);
