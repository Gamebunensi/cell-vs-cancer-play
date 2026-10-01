oS.Init(
	{
		PName: [
			oActivatedEndothelialAdhesionSite,
			oTriLaneAntimicrobialInfusion,
			oAntimicrobialFibrinolyticFlush,
			oMechanobactericidalNanopillarArray,
			oMPOOxidativeAmplificationSite,
			oPlateletFibrinCaptureNet,
			oReinforcedEndothelialPericyteBarrier,
		],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oAirwayBacterium3,
			oMeningococcalBloodstreamCluster,
			oThickCapsuleMeningococcalCluster,
			oDenseCapsuleMeningococcalCluster,
			oEncapsulatedPneumococcus,
			oDenseCapsulePneumococcus,
			oPiliatedInvasiveMeningococcalCluster,
			oStaphFibrinBiofilmFront,
			oListeriaMonocyteCarrier,
		],
		FlagZombie: oStaphFibrinBiofilmFront,
		PicArr: (function () {
			var a = oLocalCapillaryPerfusionNetwork.prototype;
			var b = a.PicArr;
			return ["images/immune_mod/worlds/blood.png", "images/immune_mod/ui/immune_medal.svg", b[a.CardGif], b[a.NormalGif]];
		})(),
		Coord: 2,
		SunNum: 50,
		LF: [0, 1, 1, 2, 2, 1, 1],
		backgroundImage: "images/immune_mod/worlds/blood.png",
		CanSelectCard: 0,
		LevelName: "血流防线 3-10 · 灌流协同",
		LvlEName: "immune-30",
		OriginalLvlEName: 15,
		ImmuneMod: true,
		FlagIcon: oStaphFibrinBiofilmFront.prototype.PicArr[oStaphFibrinBiofilmFront.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: {
			5: $("imgFlag3"),
			10: $("imgFlag2"),
			15: $("imgFlag1"),
		},
		StaticCard: 0,
		UserDefinedFlagFunc(a) {
			oP.FlagNum === oP.FlagZombies && oP.SetTimeoutWaterZombie(6, 9, 3, [oMeningococcalBloodstreamCluster]);
		},
		StartGameMusic: "Zombieboss",
		InitLawnMower() {
			let row = 7;
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
				oP.Monitor({
					f() {
						(function () {
							var a = ArCard.length;
							if (a < 10) {
								var c = oS.PName;
								var b =
									oP.FlagZombies < 6
										? Math.floor(1 + Math.random() * 10) < 4
											? 1
											: Math.floor(Math.random() * c.length)
										: Math.floor(1 + Math.random() * 10) < 3
											? 0
											: Math.floor(Math.random() * c.length);
								var e = c[b];
								var d = e.prototype;
								var f = "dCard" + Math.random();
								ArCard[a] = { DID: f, PName: e, PixelTop: 600 };
								NewImg(
									f,
									d.PicArr[d.CardGif],
									"top:600px;width:100px;height:120px;cursor:url(images/interface/Pointer.cur),pointer;clip:rect(auto,auto,60px,auto)",
									$("dCardList"),
									{
										onmouseover(g) {
											ViewPlantTitle(GetChoseCard(f), g);
										},
										onmouseout() {
											SetHidden($("dTitle"));
										},
									onclick(g) {
										GetChoseCard(f);
										ChosePlant(g, oS.ChoseCard, f);
									},
									}
								);
							}
							oSym.addTask(600, arguments.callee, []);
						})();
						(function () {
							var b = ArCard.length;
							var a;
							var c;
							while (b--) {
								(c = (a = ArCard[b]).PixelTop) > 60 * b && ($(a.DID).style.top = (a.PixelTop = c - 1) + "px");
							}
							oSym.addTask(5, arguments.callee, []);
						})();
					},
					ar: [],
				});
				oP.AddZombiesFlag();
				SetVisible($("dFlagMeterContent"));
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 3, 1],
			[oAirwayBacterium2, 4, 1],
			[oAirwayBacterium3, 3, 1],
			[oMeningococcalBloodstreamCluster, 1, 6, [6, 7, 8, 10, 15]],
			[oThickCapsuleMeningococcalCluster, 1, 6, [5, 10, 15]],
			[oDenseCapsuleMeningococcalCluster, 1, 6, [10, 15]],
			[oEncapsulatedPneumococcus, 4, 1],
			[oDenseCapsulePneumococcus, 2, 1],
			[oPiliatedInvasiveMeningococcalCluster, 1, 10, [10, 14, 15]],
			[oStaphFibrinBiofilmFront, 1, 5, [5, 10, 15]],
			[oPiliatedInvasiveMeningococcalCluster, 1, 10, [10, 15]],
		],
		FlagNum: 15,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19, 20, 23, 25, 29],
			a2: [3, 6, 12, 20, 18, 24, 30, 40, 36, 42, 48, 60],
		},
		FlagToMonitor: {
			4: [ShowLargeWave, 0],
			9: [ShowLargeWave, 0],
			14: [ShowFinalWave, 0],
		},
		FlagToEnd() {
			NewImg(
				"imgSF",
				oLocalCapillaryPerfusionNetwork.prototype.PicArr[oLocalCapillaryPerfusionNetwork.prototype.CardGif],
				"left:667px;top:330px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oLocalCapillaryPerfusionNetwork, "immune-31");
					},
				}
			);
		},
	},
	{
		GetChoseCard(b) {
			var a = ArCard.length;
			while (a--) {
				ArCard[a].DID === b && ((oS.ChoseCard = a), (a = 0));
			}
			return oS.ChoseCard;
		},
		ChosePlant(a, b) {
			PlaySound2("seedlift");
			a = window.event || a;
			var f = ArCard[oS.ChoseCard];
			var e = a.clientX - EDAlloffsetLeft + EBody.scrollLeft || EElement.scrollLeft;
			var d = a.clientY + EBody.scrollTop || EElement.scrollTop;
			var c = f.PName.prototype;
			oS.Chose = 1;
			EditImg(
				NewImg(
					"MovePlant",
					c.PicArr[c.StaticGif],
					"left:" +
						(e - 0.5 * (c.beAttackedPointL + c.beAttackedPointR)) +
						"px;top:" +
						(d + 20 - c.height) +
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
			SetAlpha($(f.DID), 50, 0.5);
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
		GrowPlant(l, c, b, f, a) {
			var j = oS.ChoseCard;
			var g = ArCard[j];
			var i = g.PName;
			var k = i.prototype;
			var d = g.DID;
			var e;
			var h = oGd.$LF[f];
			k.CanGrow(l, f, a) &&
				(function () {
					PlaySound2(h !== 2 ? "plant" + Math.floor(1 + Math.random() * 2) : "plant_water");
					new i().Birth(c, b, f, a, l);
					oSym.addTask(20, SetNone, [
						SetStyle($("imgGrowSoil"), {
							left: c - 30 + "px",
							top: b - 40 + "px",
							zIndex: 3 * f,
							visibility: "visible",
						}),
					]);
					ClearChild($("MovePlant"), $("MovePlantAlpha"));
					$("dCardList").removeChild((e = $(d)));
					e = null;
					ArCard.splice(j, 1);
					oS.ChoseCard = "";
					oS.Chose = 0;
					GroundOnmousemove = function () {};
				})();
		},
		ViewPlantTitle(a) {},
	}
);
