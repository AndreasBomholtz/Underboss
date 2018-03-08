var buildings = {
    SteelMill: {
        buildNew: 1,
        cost: {
            cash: 600,
            food: 200,
            steel: 200,
            cement: 500
        }
    },
    Restaurant: {
        buildNew: 1,
        cost: {
            cash: 600,
            food: 200,
            steel: 500,
            cement: 200
        }
    },
    CementFactory: {
        buildNew: 1,
        cost: {
            cash: 600,
            food: 500,
            steel: 200,
            cement: 200
        }
    },
    Apartment: {
        buildNew: 6,
        cost: {
            cash: 500,
            food: 100,
            steel: 100,
            cement: 100
        }
    },
    Hideout: {
        buildNew: -1,
        cost: {
            cash: 1200,
            food: 500,
            steel: 500,
            cement: 500
        }
    },
    Mansion: {
        priority: 1,
        requirement: {
            build: {
                5: {
                    Wall: 5
                },
                7: {
                    Wall: 7
                },
                8: {
                    Wall: 8
                }
            }
        },
        cost: {
            cash: 2500,
            food: 300,
            steel: 300,
            cement: 300
        }
    },
    Library: {
        priority: 2,
        cost: {
            cash: 2500,
            food: 1500,
            steel: 200,
            cement: 200
        }
    },
    Warehouse: {
        requirement: {
            gangster:4
        },
        cost: {
            cash: 1500,
            food: 1000,
            steel: 300,
            cement: 300
        }
    },
    Garage: {
        requirement: {
            build: {
                2: {
                    Restaurant: 5
                }
            },
            gangster:9
        },
        cost: {
            cash: 2000,
            food: 300,
            steel: 1000,
            cement: 300
        }
    },
    Armory: {
        requirement: {
            gangster:3
        },
        cost: {
            cash: 3000,
            food: 300,
            steel: 300,
            cement: 1000
        }
    },
    Workshop: {
        requirement: {
            gangster:7
        },
        cost: {
            cash: 3000,
            food: 300,
            steel: 1000,
            cement: 300
        }
    },
    GuestHouse: {
        requirement: {
            gangster: 6
        },
        cost: {
            cash: 2000,
            food: 500,
            steel: 300,
            cement: 300
        }
    },
    Wall: {
        cost: {
            cash: 6000,
            food: 1000,
            steel: 1000,
            cement: 1000
        }
    },
    GuardPost: {
        requirement: {
            build: {
                0: {
                    SteelMill: 3
                }
            },
            gangster:8
        },
        cost: {
            cash: 1500,
            food: 300,
            steel: 300,
            cement: 1000
        }
    },
    Vault: {
        requirement: {
            gangster:3
        },
        cost: {
            cash: 3000,
            food: 300,
            steel: 300,
            cement: 1000
        }
    },
    FrontGate: {
        requirement: {
            gangster: 5
        },
        cost: {
            cash: 1500,
            food: 500,
            steel: 1500,
            cement: 500
        }
    },
    Exchange: {
        priority: 2,
        requirement: {
            build: {
                2: {
                    GuestHouse: 3
                }
            }
        },
        cost: {
            cash: 3000,
            food: 300,
            steel: 300,
            cement: 1000
        }
    },
    Condo: {
        skip: true
    },
    CrewBank: {
        offset: {
            cash: 146286,
            res: 38152
        },
        requirement: {
            alliance: true
        },
        cost: {
            cash: 43885,
            food: 11445,
            steel: 11445,
            cement: 11445
        }
    },
    FinanciersOffice: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 43885,
            food: 11445,
            steel: 11445,
            cement: 11445
        }
    },
    BlackMarket: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Haberdashery: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Pharmacy: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Hotel: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Gym: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Morgue: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Laundromat: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    DeputyMayorsOffice: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    FerrisWheel: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    GasStation: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Headquarters: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    Hospital: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    ClipJoint: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    },
    ShootingRange: {
        offset: {
            cash: 146286,
            res: 38152
        },
        cost: {
            cash: 438857,
            food: 114457,
            steel: 114457,
            cement: 114457
        }
    }
};
module.exports = buildings;

/*
            SafeHouse : {
                resources : {
                    cash : 438857,
                    food : 114457,
                    steel : 114457,
                    cement : 114457
                },
                maxlevel : 23
            },
            Apartment : {
                resources : {
                    cash : 500,
                    food : 100,
                    steel : 100,
                    cement : 100
                },
                maxlevel : 23
            },
            CementFactory : {
                resources : {
                    cash : 600,
                    food : 500,
                    steel : 200,
                    cement : 200
                },
                maxlevel : 23
            },
            Library : {
                resources : {
                    cash : 2500,
                    food : 1500,
                    steel : 200,
                    cement : 200
                },
                maxlevel : 23
            },
            FrontGate : {
                resources : {
                    cash : 1500,
                    food : 500,
                    steel : 1500,
                    cement : 500
                },
                level : 5,
                maxlevel : 23
            },
            Garage : {
                resources : {
                    cash : 2000,
                    food : 300,
                    steel : 1000,
                    cement : 300
                },
                level : 9,
                maxlevel : 23
            },
            GuardPost : {
                resources : {
                    cash : 1500,
                    food : 300,
                    steel : 300,
                    cement : 1000
                },
                level : 8,
                maxlevel : 23
            },
            Warehouse : {
                resources : {
                    cash : 1500,
                    food : 1000,
                    steel : 300,
                    cement : 300
                },
                level : 4,
                maxlevel : 23
            },
            SteelMill : {
                resources : {
                    cash : 600,
                    food : 200,
                    steel : 200,
                    cement : 500
                },
                maxlevel : 23
            },
            Mansion : {
                resources : {
                    cash : 2500,
                    food : 300,
                    steel : 300,
                    cement : 300
                },
                maxlevel : 23
            },
            Vault : {
                resources : {
                    cash : 3000,
                    food : 300,
                    steel : 300,
                    cement : 1000
                },
                maxlevel : 23
            },
            Restaurant : {
                resources : {
                    cash : 600,
                    food : 200,
                    steel : 500,
                    cement : 200
                },
                maxlevel : 23
            },
            FinanciersOffice : {
                resources : {
                    cash : 600,
                    food : 200,
                    steel : 500,
                    cement : 200
                },
                maxlevel : 18,
                city : "Queens"

            },
            CrewBank : {
                resources : {
                    cash : 600,
                    food : 200,
                    steel : 500,
                    cement : 200
                },
                maxlevel : 18,
                city : "Queens"
            },
            GuestHouse : {
                resources : {
                    cash : 2000,
                    food : 500,
                    steel : 300,
                    cement : 300
                },
                level : 6,
                maxlevel : 23
            },
            Hideout : {
                resources : {
                    cash : 1200,
                    food : 500,
                    steel : 500,
                    cement : 500
                },
                maxlevel : 23
            },
            Wall : {
                resources : {
                    cash : 6000,
                    food : 1000,
                    steel : 1000,
                    cement : 6000
                },
                maxlevel : 23
            },
            Workshop : {
                resources : {
                    cash : 3000,
                    food : 300,
                    steel : 1000,
                    cement : 300
                },
                level : 7,
                maxlevel : 23
            },
            Armory : {
                resources : {
                    cash : 3000,
                    food : 300,
                    steel : 300,
                    cement : 1000
                },
                level : 3,
                maxlevel : 23
            },
            Exchange : {
                resources : {
                    cash : 3000,
                    food : 300,
                    steel : 300,
                    cement : 1000
                },
                maxlevel : 18
            },
            TheFoxyLadyClub : {
                level : 23
            },
            DonasDepartmentStore : {},
            CliveTheater : {
                level : 5
            },
            LarrysAutoBody : {
                level : 11
            },
            GreenwichVillageCourtHouse : {
                buildings : {
                    Mansion : {
                        level : 7
                    }
                }
            },
            GreenwichVillageChurch : {
                buildings : {
                    Mansion : {
                        level : 3
                    }
                }
            },
            GreenwichVillageDocks : {
                buildings : {
                    Mansion : {
                        level : 5
                    }
                }
            },
            GreenwichVillageStation : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BrooklynFirehouse : {
                buildings : {
                    Mansion : {
                        level : 3
                    }
                }
            },
            BrooklynFactory : {
                buildings : {
                    Mansion : {
                        level : 5
                    }
                }
            },
            BrooklynCemetery : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BrooklynBridge : {
                buildings : {
                    Mansion : {
                        level : 7
                    }
                }
            },
            Morgue : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Pharmacy : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Gym : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Hospital : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BlackMarket : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Laundromat : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            ShootingRange : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Haberdashery : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Headquarters : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            LawFirm : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BoxingOne : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 15,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BoxingTwo : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 15,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BoxingThree : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 15,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BoxingFour : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 15,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            BoxingFive : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 15,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            DeputyMayorsOffice : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            ChowsSeafoodPalace : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            CarElevator : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            LineLaboratories : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            GarbageCenter : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            AngiesMaids : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            CrewBankBranch : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            KreuserHomeRepair : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            }
            ,StStevensChurch : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },TheDenTaproom : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            AngiesMaidsInc : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            GardenCenter : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 21,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Chandelier : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Condo : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Mailbox : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Rug : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Staircase : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            ClipJoint : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            CaptainsBar : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            CoffeeCart : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            DepartureDoors : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            FlightGates : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            FlightSchool : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Hangar : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            SkyLounge : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            Tower : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 20,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            PawnShop : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            FerrisWheel : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },EvergrayCemetary : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            LoadingDock : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            GunLocker : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },GasStation : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 23,
                research : {},
                units : {},
                buildings : {},
                items : {}
            },
            PoolHall : {
                resources : {
                    cash : 0,
                    food : 0,
                    steel : 0,
                    cement : 0,
                    influence : 0
                },
                level : 0,
                maxlevel : 21,
                research : {},
                units : {},
                buildings : {},
                items : {}
            }

*/
