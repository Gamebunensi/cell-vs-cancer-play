oS.Init(
	{
		PName: [
			oHypochlorousDressing,
			oLyticPhageTherapy,
			oEnzymaticDebridement,
			oWideSharpDebridement,
			oSkinDendriticSentinel,
			oDefensinEpithelium,
			oLactoferrinNutrientRestriction,
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oEncapsulatedPneumococcus,
			oQuorumSensingConsortium,
			oExudateShieldedBacteria,
			oFibrinWrappedStaphCluster,
			oQuorumResponderCluster,
			oDenseCapsulePneumococcus,
		],
		FlagZombie: oQuorumSensingConsortium,
		PicArr: [
			"images/immune_mod/worlds/wound.png",
			"images/immune_mod/ui/immune_medal.svg",
			"images/immune_mod/ui/infection_reservoir.svg",
			"images/immune_mod/ui/infection_mound.svg",
		],
		backgroundImage: "images/immune_mod/worlds/wound.png",
		CanSelectCard: 0,
		DKind: 0,
		LevelName: "低灌注创面 2-10",
		LvlEName: "immune-20",
		ImmuneMod: true,
		FlagIcon: oQuorumSensingConsortium.prototype.PicArr[oQuorumSensingConsortium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag3"), 20: $("imgFlag1") },
		StaticCard: 0,
		StartGameMusic: "Zombieboss",
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		StartGame() {
			ImmuneMod.applyBattleTheme();
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			SetVisible($("tdShovel"), $("dFlagMeter"), $("dTop"));
			SetHidden($("dSunNum"));
			oS.InitLawnMower();
			PrepareGrowPlants(() => {
				oP.Monitor(
					{
						f() {
							(function () {
								var cardCount = ArCard.length;
								if (cardCount < 10) {
									var cardPool = oS.PName;
									var cardIndex = Math.floor(Math.random() * cardPool.length);
									var plantClass = cardPool[cardIndex];
									var prototype = plantClass.prototype;
									var cardId = "dCard" + Math.random();
									ArCard[cardCount] = {
										DID: cardId,
										PName: plantClass,
										PixelTop: 600,
									};
									NewImg(
										cardId,
										prototype.PicArr[prototype.CardGif],
										"top:600px;width:100px;height:120px;cursor:url(images/interface/Pointer.cur),pointer;clip:rect(auto,auto,60px,auto)",
										$("dCardList"),
										{
											onmouseover(event) {
												ViewPlantTitle(GetChoseCard(cardId), event);
											},
											onmouseout() {
												SetHidden($("dTitle"));
											},
										onclick(event) {
											GetChoseCard(cardId);
											ChosePlant(event, oS.ChoseCard, cardId);
										},
										}
									);
								}
								oSym.addTask(600, arguments.callee, []);
							})();
							(function () {
								var cardCount = ArCard.length;
								var card;
								var cardTop;
								while (cardCount--) {
									(cardTop = (card = ArCard[cardCount]).PixelTop) > 60 * cardCount &&
										($(card.DID).style.top = (card.PixelTop = cardTop - 1) + "px");
								}
								oSym.addTask(5, arguments.callee, []);
							})();
							AppearTombstones(4, 9, 13);
						},
						ar: [],
					},
					() => {
						oP.FlagNum === oP.FlagZombies &&
							oP.SetTimeoutTomZombie([oAirwayBacterium, oEncapsulatedPneumococcus, oDenseCapsulePneumococcus]);
					}
				);
				oP.AddZombiesFlag();
				SetVisible($("dFlagMeterContent"));
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 4, 1],
			[oAirwayBacterium2, 2, 1],
			[oAirwayBacterium3, 2, 1],
			[oEncapsulatedPneumococcus, 5, 3],
			[oExudateShieldedBacteria, 1, 2],
			[oFibrinWrappedStaphCluster, 1, 5],
			[oQuorumSensingConsortium, 1, 10],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [3, 6, 12, 20, 24, 36, 48, 60],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oActivatedEndothelialAdhesionSite.prototype.PicArr[oActivatedEndothelialAdhesionSite.prototype.CardGif],
				"left:667px;top:330px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oActivatedEndothelialAdhesionSite, "immune-21");
					},
				}
			);
		},
	},
	{
		GetChoseCard(cardId) {
			var cardIndex = ArCard.length;
			while (cardIndex--) {
				ArCard[cardIndex].DID === cardId && ((oS.ChoseCard = cardIndex), (cardIndex = 0));
			}
			return oS.ChoseCard;
		},
		ChosePlant(event, chosenCard) {
			PlaySound2("seedlift");
			event = window.event || event;
			var card = ArCard[oS.ChoseCard];
			var mouseX = event.clientX - EDAlloffsetLeft + EBody.scrollLeft || EElement.scrollLeft;
			var mouseY = event.clientY + EBody.scrollTop || EElement.scrollTop;
			var prototype = card.PName.prototype;
			oS.Chose = 1;
			EditImg(
				NewImg(
					"MovePlant",
					prototype.PicArr[prototype.StaticGif],
					"left:" +
						(mouseX - 0.5 * (prototype.beAttackedPointL + prototype.beAttackedPointR)) +
						"px;top:" +
						(mouseY + 20 - prototype.height) +
						"px;z-index:254",
					EDAll
				).cloneNode(false),
				"MovePlantAlpha",
				"",
				{
					visibility: "hidden",
					filter: "alpha(opacity=40)",
					opacity: 0.4,
					zIndex: 30,
				},
				EDAll
			);
			SetAlpha($(card.DID), 50, 0.5);
			SetHidden($("dTitle"));
			GroundOnmousemove = GroundOnmousemove1;
		},
		CancelPlant() {
			ClearChild($("MovePlant"), $("MovePlantAlpha"));
			oS.Chose = 0;
			SetAlpha($(ArCard[oS.ChoseCard].DID), 100, 1);
			oS.ChoseCard = "";
			GroundOnmousemove = function () {};
		},
		GrowPlant(grid, x, y, row, column) {
			var chosenIndex = oS.ChoseCard;
			var card = ArCard[chosenIndex];
			var plantClass = card.PName;
			var prototype = plantClass.prototype;
			var cardId = card.DID;
			var removedCard;
			var laneType = oGd.$LF[row];
			prototype.CanGrow(grid, row, column) &&
				(function () {
					PlaySound2(laneType !== 2 ? "plant" + Math.floor(1 + Math.random() * 2) : "plant_water");
					new plantClass().Birth(x, y, row, column, grid);
					oSym.addTask(20, SetNone, [
						SetStyle($("imgGrowSoil"), {
							left: x - 30 + "px",
							top: y - 40 + "px",
							zIndex: 3 * row,
							visibility: "visible",
						}),
					]);
					ClearChild($("MovePlant"), $("MovePlantAlpha"));
					$("dCardList").removeChild((removedCard = $(cardId)));
					removedCard = null;
					ArCard.splice(chosenIndex, 1);
					oS.ChoseCard = "";
					oS.Chose = 0;
					GroundOnmousemove = function () {};
				})();
		},
		ViewPlantTitle(cardIndex) {},
	}
);
