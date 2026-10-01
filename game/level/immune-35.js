oS.Init(
	{
		PName: [oFollicularDendriticSignalRelay],
		ZName: [
			oAirwayBacterium,
			oAirwayBacterium2,
			oEncapsulatedPneumococcus,
			oPseudomonasBiofilmAggregate,
			oDenseCapsulePneumococcus,
			oFlagellatedVibrioCholeraeSwarm,
			oInvasiveShigellaMicrocolony,
			oToxinBurstClostridioidesCluster,
			oHypercapsulatedKlebsiellaCluster,
		],
		FlagZombie: oAirwayBacterium,
		PicArr: (function () {
			var a = oChemotacticNeutrophilPatrolRoll.prototype;
			var b = a.PicArr;
			return [
				"images/immune_mod/worlds/lymph.png",
				"images/immune_mod/ui/patrol_boundary.svg",
				b[a.CardGif],
				b[a.StaticGif],
				b[a.NormalGif],
			];
		})(),
		Coord: 1,
		backgroundImage: "images/immune_mod/worlds/lymph.png",
		LF: [0, 3, 3, 3, 3, 3],
		CanSelectCard: 0,
		DKind: 0,
		LevelName: "淋巴结窦道 4-5：趋化巡逻",
		LvlEName: "immune-35",
		OriginalLvlEName: "35",
		ImmuneMod: true,
		FlagIcon: oAirwayBacterium.prototype.PicArr[oAirwayBacterium.prototype.NormalGif],
		DisableBalloonDrops: true,
		ResourceImage: "images/immune_mod/ui/recruitment_orb.svg",
		HomeGuardClass: oHealthCore,
		HomeGuardImage: "images/immune_mod/ui/health_core.svg",
		GrowSoilImage: "images/immune_mod/ui/deploy_sparkle.svg",
		LargeWaveFlag: { 10: $("imgFlag2"), 20: $("imgFlag1") },
		StartGameMusic: "LoonSkirmish",
		StaticCard: 0,
		InitLawnMower() {
			let row = 6;
			while (--row) CustomSpecial(oMucociliarySweep, row, -1);
		},
		LoadAccess(a) {
			NewImg("dDave", "images/immune_mod/ui/immune_guide.svg", "left:0;top:81px", EDAll);
			NewEle("DivTeach", "div", 0, 0, EDAll);
			(function (d) {
				var b = arguments.callee;
				var c = $("DivTeach");
				switch (d) {
					case 0:
						PlaySound2("crazydaveshort1");
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							1,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [1]);
								};
							},
							[]
						);
						innerText(c, "好久没玩滚动巡逻了，今天来一局！");
						break;
					case 1:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [2]);
								};
							},
							[]
						);
						innerText(c, "卡片会沿传送带不断送来，看到就拿起来。");
						break;
					case 2:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [3]);
								};
							},
							[]
						);
						innerText(c, "把趋化巡逻单位放在分界线左边，它会自己冲出去！");
						break;
					case 3:
						PlaySound2("crazydavelong" + Math.floor(1 + Math.random() * 3));
						c.onclick = null;
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						oSym.addTask(
							2,
							() => {
								$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
								c.onclick = function () {
									oSym.addTask(10, b, [4]);
								};
							},
							[]
						);
						innerText(c, "守住五条通道，别让病原体溜过去！");
						break;
					case 4:
						$("dDave").src = "images/immune_mod/ui/immune_guide.svg";
						ClearChild($("DivTeach"));
						oSym.addTask(
							5,
							() => {
								ClearChild($("dDave"));
								a(0);
							},
							[]
						);
				}
			})(0);
		},
		StartGame() {
			ImmuneMod.applyBattleTheme();
			NewEle(
				0,
				"div",
				"width:22px;height:502px;margin:75px 0 0 485px;position:absolute;z-index:1;background:url(images/immune_mod/ui/patrol_boundary.svg)",
				0,
				$("tGround")
			);
			StopMusic();
			PlayMusic((oS.LoadMusic = oS.StartGameMusic));
			SetHidden($("dSunNum"));
			oS.InitLawnMower();
			PrepareGrowPlants(() => {
				oP.Monitor({
					f() {
						(function () {
							var a = ArCard.length;
							if (a < 10) {
								var c = [oChemotacticNeutrophilPatrolRoll];
								var b = Math.floor(Math.random() * c.length);
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
							oSym.addTask(500, arguments.callee, []);
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
				SetVisible($("dFlagMeter"));
			});
		},
	},
	{
		AZ: [
			[oAirwayBacterium, 2, 1],
			[oAirwayBacterium2, 2, 1],
			[oEncapsulatedPneumococcus, 1, 1],
			[oPseudomonasBiofilmAggregate, 1, 11],
			[oDenseCapsulePneumococcus, 1, 1],
			[oFlagellatedVibrioCholeraeSwarm, 1, 1],
			[oInvasiveShigellaMicrocolony, 1, 1],
			[oToxinBurstClostridioidesCluster, 1, 1],
			[oHypercapsulatedKlebsiellaCluster, 1, 17],
		],
		FlagNum: 20,
		FlagToSumNum: {
			a1: [3, 5, 9, 10, 13, 15, 19],
			a2: [4, 7, 12, 20, 13, 16, 21, 40],
		},
		FlagToMonitor: { 9: [ShowLargeWave, 0], 19: [ShowFinalWave, 0] },
		FlagToEnd() {
			NewImg(
				"imgSF",
				oOpsonophagocyticClearanceZone.prototype.PicArr[oOpsonophagocyticClearanceZone.prototype.CardGif],
				"left:627px;top:325px;clip:rect(auto,auto,60px,auto)",
				EDAll,
				{
					onclick() {
						GetNewCard(this, oOpsonophagocyticClearanceZone, "immune-36");
					},
				}
			);
			NewImg("PointerUD", "images/immune_mod/ui/guide_arrow_down.svg", "top:290px;left:636px", EDAll);
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
			var j = $("DivTeachBar");
			j && j.parentNode.removeChild(j);
			if (c > 347) {
				innerHTML(
					NewEle("DivTeachBar", "div", 0, 0, EDAll),
					"请把趋化巡逻单位部署在分界线左侧"
				);
				return false;
			}
			var i = oS.ChoseCard;
			var g = ArCard[i];
			var h = g.PName;
			var k = h.prototype;
			var d = g.DID;
			var e;
			new h().Birth(c, b, f, a, l);
			ClearChild($("MovePlant"), $("MovePlantAlpha"));
			$("dCardList").removeChild((e = $(d)));
			e = null;
			ArCard.splice(i, 1);
			oS.ChoseCard = "";
			oS.Chose = 0;
			GroundOnmousemove = function () {};
		},
		ViewPlantTitle(a) {},
	}
);
