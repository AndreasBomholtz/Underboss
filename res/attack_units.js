var attackUnits = {
    Thug: {
        type: 'Basic',
        city: 'All',
        trainable: true,
        cost: {
            cash: 750,
            food: 281,
            steel: 563,
            cement: 281,
            influence: 10
        },
        bailout:2250
    },
    Arsonist: {
        type: 'Basic',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Logistics: 1
            },
            build: {
                Hideout: 2
            }
        },
        cost: {
            cash: 1100,
            food: 825,
            steel: 413,
            cement: 413,
            influence: 10
        },
        bailout: 3300
    },
    Demolitionist: {
        type: 'Intermediate',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Proficiency: 4
            },
            build: {
                Garage: 3,
                Hideout: 3
            }
        },
        cost: {
            cash: 1700,
            food: 638,
            steel: 1274,
            cement: 638,
            influence: 20
        },
        bailout:5100
    },
    Bruiser: {
        type: 'Intermediate',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 6
            },
            build: {
                Workshop: 3,
                Hideout: 4
            }
        },
        cost: {
            cash: 2700,
            food: 2025,
            steel: 1013,
            cement: 1013,
            influence: 20
        },
        bailout:8100
    },
    Hitman: {
        type: 'Advanced',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 7,
                Proficiency: 7
            },
            build: {
                Hideout: 6,
                Workshop: 5,
                Garage:5
            }
        },
        cost: {
            cash: 3800,
            food: 1900,
            steel: 1900,
            cement: 1900,
            influence: 30
        },
        bailout: 11172
    },
    Enforcer: {
        type: 'Advanced',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Proficiency: 8
            },
            build: {
                Garage: 6,
                Hideout: 7
            }
        },
        cost: {
            cash: 5700,
            food: 2138,
            steel: 4250,
            cement: 2138,
            influence: 30
        },
        bailout:17100
    },
    TommyGunner: {
        type: 'Expert',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 10
            },
            build: {
                Workshop: 6,
                Hideout: 8
            }
        },
        cost: {
            cash: 8500,
            food: 6375,
            steel: 3188,
            cement: 3188,
            influence: 40
        },
        bailout: 25500
    },
    Professional: {
        type: 'Expert',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Proficiency: 12
            },
            build: {
                Garage: 9,
                Hideout: 9
            }
        },
        cost: {
            cash: 13000,
            food: 4875,
            steel: 9750,
            cement: 4875,
            influence: 40
        },
        bailout: 39000
    },
    Sniper: {
        type: 'Elite',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 14,
                Proficiency: 14
            },
            build: {
                Hideout: 9,
                Workshop: 9,
                Garage: 9
            }
        },
        cost: {
            cash: 15600,
            food: 7800,
            steel: 7800,
            cement: 7800,
            influence: 40
        },
        bailout: 46800
    },
    Butcher: {
        type: 'Elite',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 16,
                Cooking: 17
            },
            build: {
                Workshop: 9,
                Hideout: 9
            }
        },
        cost: {
            cash: 17160,
            food: 12870,
            steel: 6435,
            cement: 6435,
            influence: 35
        },
        bailout: 51480
    },
    BlackWidow: {
        type: 'Femme Fatale',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Corruption: 17
            },
            build: {
                Hideout: 9,
                Workshop: 9
            }
        },
        cost: {
            cash: 18876,
            food: 14157,
            steel: 7079,
            cement: 7079,
            influence: 35
        },
        bailout: 56628
    },
    Assassin: {
        type: 'Femme Fatale',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Proficiency: 17
            },
            build: {
                Hideout: 9,
                Garage: 9
            }
        },
        cost: {
            cash: 18876,
            food: 7079,
            steel: 14157,
            cement: 7079,
            influence: 35
        },
        bailout:56628
    },
    Courier: {
        type: 'Normal',
        city: 'All',
        trainable: true,
        cost: {
            cash: 500,
            food: 188,
            steel: 188,
            cement: 375,
            influence: 10
        }
    },
    DeliveryTruck: {
        type: 'Normal',
        city: 'All',
        trainable: true,
        requirement: {
            research: {
                Mechanics: 6,
                Capacity: 8
            },
            build: {
                Hideout: 5,
                Garage: 2
            }
        },
        cost: {
            cash: 3800,
            food: 1425,
            steel: 1425,
            cement: 2850,
            influence: 15
        }
    },
    Heavyweight: {
        type: 'Pulitori',
        city: 'LittleItaly',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Foreman: {
        type: 'Pulitori',
        city: 'Queens',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Smuggler: {
        type: 'Pulitori',
        city: 'GreenwichVillage',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Undertaker: {
        type: 'Pulitori',
        city: 'Brooklyn',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Doctor: {
        type: 'Pulitori',
        city: 'ParkAve',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Loanshark: {
        type: 'Pulitori',
        city: 'AtlanticCity',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    HatchetMan: {
        type: 'Pulitori',
        city: 'Chinatown',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    TriggerMan: {
        type: 'Pulitori',
        city: 'Capital',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Bartender: {
        type: 'Pulitori',
        city: 'Harlem',
        trainable: true,
        requirement: {
            research: {
                Medicine: 12,
                Muscle: 12
            },
            build: {
                Hideout: 9
            }
        },
        bailout:62292
    },
    Hardliner: {
        type: 'Johnney Law',
        trainable: true,
        city: 'Queens',
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    CrookedCop: {
        type: 'Johnney Law',
        trainable: true,
        city: 'GreenwichVillage',
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    Captain: {
        type: 'Johnney Law',
        trainable: true,
        city: 'LittleItaly',
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    DRC: {
        type: 'Johnney Law',
        city: 'Brooklyn',
        trainable: true,
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    PIG: {
        type: 'Johnney Law',
        city: 'ParkAve',
        trainable: true,
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    Highbinder: {
        type: 'Johnney Law',
        city: 'Chinatown',
        trainable: true,
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    Gman: {
        type: 'Johnney Law',
        trainable: true,
        city: 'AtlanticCity',
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    Bookie: {
        type: 'Johnney Law',
        city: 'Harlem',
        trainable: true,
        requirement: {
            research: {
                Medicine: 16,
                Muscle: 16
            },
            build: {
                Hideout: 10,
                Workshop: 10,
                Garage: 10
            }
        },
        bailout:68250
    },
    MisterSnip: {
        type: 'Clean-up Crew',
        bailout:64388
    },
    MisterHaul: {
        type: 'Clean-up Crew',
        bailout:64482
    },
    MisterFixit: {
        type: 'Clean-up Crew',
        bailout:64388
    },
    MissesNeat: {
        type: 'Clean-up Crew',
        bailout:100530
    },
    MisusPatch: {
        type: 'Clean-up Crew',
        bailout:100530
    },
    MisterSplit: {
        type: 'Clean-up Crew',
        bailout:53478
    },
    MisterKippy: {
        type: 'Clean-up Crew',
        bailout:64388
    },
    MisterPao: {
        type: 'Clean-up Crew',
        bailout:64482
    },

    Freighttrain: {
        trainable: false
    },
    Hitsquad: {
        trainable: false
    },
    Deathsquad: {
        trainable: false
    },
    Deliverybomber: {
        trainable: false
    },
    Medicalcourier: {
        trainable: false
    },

    Frontman: {
        trainable: false,
        bailout: 103020
    },
    Skinner: {
        trainable: false,
        bailout: 103020
    },
    Bassist: {
        trainable: false,
        bailout: 103020
    },

    Clyde: {
        trainable: false,
        bailout: 128775
    },
    Bonnie: {
        trainable: false,
        bailout: 128775
    },
    Romeo: {
        trainable: false,
        bailout: 103020
    },
    Maneater: {
        trainable: false,
        bailout: 103020
    },
    Carbomber: {
        trainable: false,
        bailout: 103020
    },
    Bootlegger: {
        bailout: 141653
    },
    Gravedigger: {
        bailout: 141653
    },
    SquadLeader: {
        bailout:154530
    },
    CollasMen: {
        bailout:150795
    },
    GateawayDriver: {
        bailout: 125663
    },
    JazzMan: {
        bailout: 100530
    }
};
module.exports = attackUnits;

/*
            Thug : {
                resources : {
                    cash : 750,
                    food : 281,
                    steel : 563,
                    cement : 281,
                    influence : 10
                },
                bail : 2250
            },
            Courier : {
                resources : {
                    cash : 500,
                    food : 188,
                    steel : 188,
                    cement : 375,
                    influence : 10
                }
            },
            Arsonist : {
                resources : {
                    cash : 1100,
                    food : 825,
                    steel : 413,
                    cement : 413,
                    influence : 10
                },
                bail : 5100,
                research : {
                    Logistics : 1
                },
                buildings : {
                    Hideout : 2
                }
            },
            Bruiser : {
                resources : {
                    cash : 2700,
                    food : 2025,
                    steel : 1013,
                    cement : 1013,
                    influence : 20
                },
                bail : 8100,
                research : {
                    Corruption : 6
                },
                buildings : {
                    Workshop : 3,
                    Hideout : 4
                }
            },
            Demolitionist : {
                resources : {
                    cash : 1700,
                    food : 638,
                    steel : 1275,
                    cement : 638,
                    influence : 20
                },
                bail : 5100,
                research : {
                    Proficiency : 4
                },
                buildings : {
                    Garage : 3,
                    Hideout : 3
                }
            },
            DeliveryTruck : {
                resources : {
                    cash : 3800,
                    food : 1425,
                    steel : 1425,
                    cement : 2850,
                    influence : 15
                },
                research : {
                    Capacity : 8,
                    Mechanics : 6
                },
                buildings : {
                    Garage : 2,
                    Hideout : 5
                }
            },
            Hitman : {
                resources : {
                    cash : 3800,
                    food : 1900,
                    steel : 1900,
                    cement : 1900,
                    influence : 30
                },
                bail : 11400,
                research : {
                    Proficiency : 7,
                    Corruption : 7
                },
                buildings : {
                    Garage : 5,
                    Hideout : 6,
                    Workshop : 5
                }
            },
            TommyGunner : {
                resources : {
                    cash : 8500,
                    food : 6375,
                    steel : 3188,
                    cement : 3188,
                    influence : 40
                },
                bail : 25500,
                research : {
                    Corruption : 10
                },
                buildings : {
                    Hideout : 8,
                    Workshop : 6
                }
            },
            Enforcer : {
                resources : {
                    cash : 5700,
                    food : 2138,
                    steel : 4250,
                    cement : 2138,
                    influence : 30
                },
                bail : 17100,
                research : {
                    Proficiency : 8
                },
                buildings : {
                    Garage : 6,
                    Hideout : 7
                }
            },
            Professional : {
                resources : {
                    cash : 13000,
                    food : 4875,
                    steel : 9750,
                    cement : 4875,
                    influence : 40
                },
                bail : 39000,
                research : {
                    Proficiency : 12
                },
                buildings : {
                    Garage : 9,
                    Hideout : 9
                }
            },
            BarbedWire : {
                resources : {
                    cash : 1700,
                    food : 638,
                    steel : 638,
                    cement : 1275
                },
                def : true,
                research : {
                    Logistics : 4
                },
                buildings : {
                    GuardPost : 2,
                    Wall : 2
                }
            },
            BoobyTrap : {
                resources : {
                    cash : 2700,
                    food : 1013,
                    steel : 1013,
                    cement : 2025
                },
                def : true,
                research : {
                    Logistics : 8
                },
                buildings : {
                    GuardPost : 4,
                    Wall : 4
                }
            },
            GuardDog : {
                resources : {
                    cash : 3800,
                    food : 1425,
                    steel : 1425,
                    cement : 2850
                },
                def : true,
                research : {
                    Logistics : 12
                },
                buildings : {
                    GuardPost : 6,
                    Wall : 6
                }
            },
            ArmedGuard : {
                resources : {
                    cash : 5700,
                    food : 2138,
                    steel : 2138,
                    cement : 4275
                },
                def : true,
                research : {
                    Logistics : 14
                },
                buildings : {
                    GuardPost : 7,
                    Wall : 7
                }
            },
            Sniper : {
                resources : {
                    cash : 15600,
                    food : 7800,
                    steel : 7800,
                    cement : 7800,
                    influence : 40
                },
                bail : 46800,
                research : {
                    Corruption : 14,
                    Proficiency : 14
                },
                buildings : {
                    Hideout : 9,
                    Workshop : 9,
                    Garage : 9
                }
            },
            Butcher : {
                resources : {
                    cash : 17160,
                    food : 12870,
                    steel : 6435,
                    cement : 6435,
                    influence : 35
                },
                bail : 51480,
                research : {
                    Corruption : 16,
                    Cooking : 17
                },
                buildings : {
                    Hideout : 9,
                    Workshop : 9
                }
            },
            Bodyguard : {
                resources : {
                    cash : 17160,
                    food : 6435,
                    steel : 6435,
                    cement : 12870
                },
                def : true,
                research : {
                    Logistics : 16
                },
                buildings : {
                    GuardPost : 8,
                    Wall : 8
                }
            },
            MoneyMan : {
                resources : {
                    cash : 23000,
                    food : 15000,
                    steel : 15000,
                    cement : 15000,
                    influence : 35
                },
                def : true,
                research : {
                    Medicine : 14,
                    Muscle : 14,
                    Logistics : 18
                },
                buildings : {
                    GuardPost : 10,
                    Hideout : 10,
                    Wall : 10
                },
                items : {
                    Kickback : 1
                },
                city : "Capital"
            },
            UnnamedDefender : {
                resources : {
                    cash : 18876,
                    food : 7079,
                    steel : 7079,
                    cement : 14157
                },
                def : true,
                research : {
                    Logistics : 18
                },
                buildings : {
                    GuardPost : 9,
                    Wall : 9
                }
            },
            BlackWidow : {
                resources : {
                    cash : 18875,
                    food : 14157,
                    steel : 7079,
                    cement : 7079,
                    influence : 35
                },
                bail : 56628,
                research : {
                    Corruption : 17
                },
                buildings : {
                    Hideout : 9,
                    Workshop : 9
                }
            },
            Assassin : {
                resources : {
                    cash : 18876,
                    food : 7079,
                    steel : 14157,
                    cement : 7079,
                    influence : 35
                },
                bail : 56628,
                research : {
                    Proficiency : 17
                },
                buildings : {
                    Garage : 9,
                    Hideout : 9
                }
            },
            Smuggler : {
                resources : {
                    cash : 20764,
                    food : 15573,
                    steel : 7786,
                    cement : 7786,
                    influence : 35
                },
                bail : 62292,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "GreenwichVillage"
            },
            Undertaker : {
                resources : {
                    cash : 20764,
                    food : 7785,
                    steel : 15573,
                    cement : 7785,
                    influence : 35
                },
                bail : 62292,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "Brooklyn"
            },
            Doctor : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 35
                },
                bail : 62292,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "ParkAve"
            },
            Loanshark : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 35
                },
                bail : 62292,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Favor : 1
                },
                city : "AtlanticCity"
            },
            HatchetMan : {
                resources : {
                    cash : 20764,
                    food : 7786,
                    steel : 7786,
                    cement : 15573,
                    influence : 35
                },
                bail : 62292,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Garage : 9,
                    Hideout : 9,
                    Workshop : 9
                },
                items : {
                    Favor : 1
                },
                city : "Chinatown"
            },
            TriggerMan : {
                resources : {
                    cash : 18876,
                    food : 14157,
                    steel : 7079,
                    cement : 7079,
                    influence : 35
                },
                bail : 56628,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "Capital"
            },
            CrookedCop : {
                resources : {
                    cash : 22840,
                    food : 17130,
                    steel : 8565,
                    cement : 8565,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Kickback : 1
                },
                city : "GreenwichVillage"
            },
            DRC : {
                resources : {
                    cash : 22840,
                    food : 8565,
                    steel : 17130,
                    cement : 8565,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10
                },
                items : {
                    Kickback : 1
                },
                city : "Brooklyn"
            },
            Heawyweight : {
                resources : {
                    cash : 22000,
                    food : 16050,
                    steel : 8250,
                    cement : 8250,
                    influence : 40
                },
                bail : 52628,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "LittleItaly"
            },
            Captain : {
                resources : {
                    cash : 22840,
                    food : 8565,
                    steel : 17130,
                    cement : 8565,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Workshop : 10,
                    Hideout : 10
                },
                items : {
                    Kickback : 1
                },
                city : "LittleItaly"
            },
            MissesNeat : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    AngiesMaids : 7
                },
                items : {
                    Appointment : 1
                },
                city : "LittleItaly"
            },
            MissusPatch : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    KreuserHomeRepair : 7
                },
                items : {
                    Appointment : 1
                },
                city : "Queens"
            },
            PIG : {
                resources : {
                    cash : 22840,
                    food : 8565,
                    steel : 8565,
                    cement : 17130,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Kickback : 1
                },
                city : "ParkAve"
            },
            GMan : {
                resources : {
                    cash : 22840,
                    food : 8565,
                    steel : 8565,
                    cement : 17130,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Kickback : 1
                },
                city : "AtlanticCity"
            },
            Highbinder : {
                resources : {
                    cash : 22840,
                    food : 8565,
                    steel : 17130,
                    cement : 8565,
                    influence : 35
                },
                bail : 68250,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Kickback : 1
                },
                city : "Chinatown"
            },
            Bartender : {
                resources : {
                    influence : 17500
                },
                bail : 64500,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                city : "Harlem"
            },
            Bookie : {
                resources : {
                    influence : 17500
                },
                bail : 69000,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Appointment : 1
                },
                city : "Harlem"
            },
            MisterFixit : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    GasStation : 7
                },
                items : {
                    Appointment : 1
                },
                city : "Harlem"
            },
            MisterPao : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    ChowsSeafoodPalace : 7
                },
                items : {
                    Appointment : 1
                },
                city : "Chinatown"
            },
            MisterSplit : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    CarElevator : 7
                },
                items : {
                    Appointment : 1
                },
                city : "ParkAve"
            },
            MisterHaul : {
                resources : {
                    cash : 25000,
                    food : 9500,
                    steel : 20000,
                    cement : 9500,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    GarbageCenter : 7
                },
                items : {
                    Appointment : 1
                },
                city : "Brooklyn"
            },MisterSnip : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    GardenCenter : 7
                },
                items : {
                    Appointment : 1
                },
                city : "GreenwichVillage"
            },Foreman : {
                resources : {
                    cash : 22000,
                    food : 16050,
                    steel : 8250,
                    cement : 8250,
                    influence : 40
                },
                bail : 52628,
                research : {
                    Medicine : 12,
                    Muscle : 12
                },
                buildings : {
                    Hideout : 9
                },
                items : {
                    Favor : 1
                },
                city : "Queens"
            },Hardliner : {
                resources : {
                    influence : 17500
                },
                bail : 69000,
                research : {
                    Medicine : 16,
                    Muscle : 16
                },
                buildings : {
                    Garage : 10,
                    Hideout : 10,
                    Workshop : 10
                },
                items : {
                    Appointment : 1
                },
                city : "Queens"
            },Bootlegger : {
                resources : {
                    influence : 65
                },
                bail : 69000,
                research : {
                    Blackmail : 5,
                    Bureaucracy : 5
                },
                buildings : {
                    LoadingDock : 7,
                    Hideout : 16,
                    Workshop : 16
                },
                units : {
                    Smuggler : 1
                },
                items : {
                    Promotion : 1
                },
                city : "GreenwichVillage"
            },Gravedigger : {
                resources : {
                    influence : 65
                },
                bail : 69000,
                research : {
                    Blackmail : 5,
                    Bureaucracy : 5
                },
                buildings : {
                    EvergrayCemetary : 7,
                    Hideout : 16,
                    Workshop : 16
                },
                units : {
                    Undertaker: 1
                },
                items : {
                    Promotion : 1
                },
                city : "Brooklyn"
            },
            MisterKippy : {
                resources : {
                    cash : 20764,
                    food : 20764,
                    steel : 7786,
                    cement : 7786,
                    influence : 40
                },
                bail : 75000,
                research : {
                    Medicine : 20,
                    Muscle : 20
                },
                buildings : {
                    Garage : 11,
                    Hideout : 11,
                    FerrisWheel : 7
                },
                items : {
                    Appointment : 1
                },
                city : "AtlanticCity"
            }
        }, qa = {
            Demolitionist : {
                buildings : {
                    Hangar : 1
                },
                units : {
                    Thug : 3
                },
                city : "DoriaAirport"
            },
            Bruiser : {
                buildings : {
                    Hangar : 2
                },
                units : {
                    Thug : 2,
                    Arsonist : 2
                },
                city : "DoriaAirport"
            },
            Hitman : {
                buildings : {
                    Hangar : 3
                },
                units : {
                    Thug : 2,
                    Demolitionist : 1,
                    Bruiser : 1
                },
                city : "DoriaAirport"
            },
            Enforcer : {
                buildings : {
                    Hangar : 4
                },
                units : {
                    Thug : 3,
                    Demolitionist : 3,
                    Bruiser : 1
                },
                city : "DoriaAirport"
            },
            TommyGunner : {
                buildings : {
                    Hangar : 5
                },
                units : {
                    Thug : 3,
                    Bruiser : 3,
                    Hitman : 2
                },
                city : "DoriaAirport"
            },
            Professional : {
                buildings : {
                    Hangar : 6
                },
                units : {
                    Thug : 5,
                    Demolitionist : 3,
                    Enforcer : 3
                },
                city : "DoriaAirport"
            },
            Sniper : {
                buildings : {
                    Hangar : 7
                },
                units : {
                    Thug : 3,
                    Hitman : 5,
                    Enforcer : 2,
                    TommyGunner : 1
                },
                city : "DoriaAirport"
            },
            Butcher : {
                buildings : {
                    Hangar : 7
                },
                units : {
                    Thug : 3,
                    Bruiser : 4,
                    TommyGunner : 5
                },
                city : "DoriaAirport"
            },
            BlackWidow : {
                buildings : {
                    Hangar : 8
                },
                units : {
                    Thug : 6,
                    TommyGunner : 3,
                    Butcher : 1
                },
                city : "DoriaAirport"
            },
            Assassin : {
                buildings : {
                    Hangar : 8
                },
                units : {
                    Thug : 6,
                    Demolitionist : 5,
                    Enforcer : 3,
                    Professional : 3
                },
                city : "DoriaAirport"
            },
            Smuggler : {
                buildings : {
                    Hangar : 9
                },
                units : {
                    Thug : 6,

                    TommyGunner : 2,
                    Butcher : 2
                },
                city : "DoriaAirport"
            },
            TriggerMan : {
                buildings : {
                    Hangar : 9
                },
                units : {
                    Thug : 6,
                    Assassin : 1,
                    Professional : 1
                },
                city : "DoriaAirport"
            },
            Undertaker : {
                buildings : {
                    Hangar : 10
                },
                units : {
                    Thug : 6,
                    Enforcer : 4,
                    Professional : 5
                },
                city : "DoriaAirport"
            },
            Doctor : {
                buildings : {
                    Hangar : 11
                },
                units : {
                    Thug : 6,
                    Bruiser : 2,
                    TommyGunner : 2,
                    Butcher : 2
                },
                city : "DoriaAirport"
            },
            Loanshark : {
                buildings : {
                    Hangar : 12
                },
                units : {
                    Thug : 6,
                    Professional : 3,
                    Sniper : 2
                },
                city : "DoriaAirport"
            },
            HatchetMan : {
                buildings : {
                    Hangar : 13
                },
                units : {
                    Thug : 6,
                    Sniper : 4
                },
                city : "DoriaAirport"
            },
            CrookedCop : {
                buildings : {
                    Hangar : 14
                },
                units : {
                    Thug : 6,
                    Smuggler : 1,
                    BlackWidow : 1
                },
                city : "DoriaAirport"
            },
            DRC : {
                buildings : {
                    Hangar : 15
                },
                units : {
                    Thug : 6,
                    Assassin : 1,
                    Undertaker : 1
                },
                city : "DoriaAirport"
            },
            PIG : {
                buildings : {
                    Hangar : 16
                },
                units : {
                    Thug : 6,
                    Doctor : 1,
                    BlackWidow : 1
                },
                city : "DoriaAirport"
            },
            GMan : {
                buildings : {
                    Hangar : 17
                },
                units : {
                    Thug : 6,
                    Assassin : 1,
                    Loanshark : 1
                },
                city : "DoriaAirport"
            },
            Highbinder : {
                buildings : {
                    Hangar : 18
                },
                units : {
                    Thug : 6,
                    Assassin : 1,
                    HatchetMan : 1
                },
                city : "DoriaAirport"
            },
            DeathSquad : {
                buildings : {
                    Hangar : 19
                },
                units : {
                    Thug : 8,
                    Highbinder : 1,
                    CrookedCop : 1,
                    DRC : 1,
                    PIG : 1,
                    GMan : 1
                },
                city : "DoriaAirport"
            },
            DeliveryBomber : {
                buildings : {
                    Hangar : 20
                },
                units : {
                    Thug : 8,
                    Highbinder : 1,
                    CrookedCop : 1,
                    DRC : 1,
                    PIG : 1,
                    GMan : 1
                },
                city : "DoriaAirport"
            },
            MedicalCourier : {
                buildings : {
                    Hangar : 20
                },
                units : {
                    Thug : 8,
                    Highbinder : 1,
                    CrookedCop : 1,
                    DRC : 1,
                    PIG : 1,
                    GMan : 1
                },
                city : "DoriaAirport"
            },
            BoobyTrap : {
                buildings : {
                    Tower : 1
                },
                units : {
                    BarbedWire : 1
                },
                city : "DoriaAirport"
            },
            GuardDog : {
                buildings : {
                    Tower : 2
                },
                units : {
                    BarbedWire : 1,
                    BoobyTrap : 1
                },
                city : "DoriaAirport"
            },
            ArmedGuard : {
                buildings : {
                    Tower : 5
                },
                units : {
                    BarbedWire : 2,
                    GuardDog : 1
                },
                city : "DoriaAirport"
            },
            Bodyguard : {
                buildings : {
                    Tower : 8
                },
                units : {
                    BarbedWire : 10,
                    BoobyTrap : 10,
                    GuardDog : 5,
                    ArmedGuard : 5
                },
                city : "DoriaAirport"
            },
            UnnamedDefender : {
                buildings : {
                    Tower : 11
                },
                units : {
                    BarbedWire : 10,
                    BoobyTrap : 2,
                    GuardDog : 2,
                    ArmedGuard : 2,
                    Bodyguard : 1
                },
                city : "DoriaAirport"
            },
            BrassMan : {
                buildings : {
                    Tower : 16
                },
                def : true,
                units : {
                    BarbedWire : 15,
                    JohnDoe : 4
                },
                city : "DoriaAirport"
            },
            LeatherHead : {
                buildings : {
                    Tower : 17
                },
                def : true,
                units : {
                    BarbedWire : 15,
                    JohnDoe : 5
                },
                city : "DoriaAirport"
            }
*/
