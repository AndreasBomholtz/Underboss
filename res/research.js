var research =  {
    Capacity: {
        priority: 4,
        requirement: {
            research : [
                "Cooking",
                "Cementing",
                "Steelwork"
            ]
        },
        cost: {
            cash: 250,
            food: 175,
            steel: 175,
            cement: 175
        }
    },
    Carjacking: {
        priority: 5,
        requirement: {
            research : [
                "Capacity"
            ],
            build: "Garage"
        },
        cost: {
            cash: 400,
            food: 200,
            steel: 200,
            cement: 200
        }
    },
    Cementing: {
        priority: 2,
        requirement: {
            research : [
                "Logistics"
            ],
            build: "CementFactory"
        },
        cost: {
            cash: 150,
            food: 100,
            steel: 100,
            cement: 200
        }
    },
    Construction: {
        priority: 4,
        requirement: {
            research : [
                "Maneuver"
            ]
        },
        cost: {
            cash: 400,
            food: 200,
            steel: 200,
            cement: 200
        }
    },
    Cooking: {
        priority: 2,
        requirement: {
            research : [
                "Logistics"
            ],
            build: "Restaurant"
        },
        cost: {
            cash: 150,
            food: 200,
            steel: 100,
            cement: 100
        }
    },
    Corruption: {
        priority: 5,
        requirement: {
            research : [
                "Capacity"
            ],
            build: "Hideout"
        },
        cost: {
            cash: 400,
            food: 200,
            steel: 200,
            cement: 200
        }
    },
    Logistics: {
        priority: 1,
        requirement: {
            research : [],
            build: "Library"
        },
        cost: {
            cash: 225,
            food: 150,
            steel: 300,
            cement: 150
        }
    },
    Maneuver: {
        priority: 3,
        requirement: {
            research : [
                "Spying"
            ],
            build: "Garage"
        },
        cost: {
            cash: 250,
            food: 175,
            steel: 175,
            cement: 175
        }
    },
    Mechanics: {
        priority: 4,
        requirement: {
            research : [
                "Trafficking"
            ],
            build: "Wall"
        },
        cost: {
            cash: 250,
            food: 175,
            steel: 175,
            cement: 175
        }
    },
    Medicine: {
        priority: 6,
        requirement: {
            research : [
                "Construction",
                "Corruption"
            ]
        },
        cost: {
            cash: 500,
            food: 250,
            steel: 250,
            cement: 250
        }
    },
    Muscle: {
        priority: 6,
        requirement: {
            research : [
                "Proficiency",
                "Mechanics"
            ],
            build: "GaurdPost"
        },
        cost: {
            cash: 500,
            food: 250,
            steel: 250,
            cement: 250
        }
    },
    Proficiency: {
        priority: 5,
        requirement: {
            research : [
                "Mechanics"
            ],
            build: "Workshop"
        },
        cost: {
            cash: 400,
            food: 200,
            steel: 200,
            cement: 200
        }
    },
    Spying: {
        priority: 2,
        requirement: {
            research : [
                "Logistics"
            ]
        },
        cost: {
            cash: 200,
            food: 150,
            steel: 150,
            cement: 150
        }
    },
    Steelwork: {
        priority: 2,
        requirement: {
            research : [
                "Logistics"
            ],
            build: "SteelMill"
        },
        cost: {
            cash: 150,
            food: 100,
            steel: 200,
            cement: 100
        }
    },
    Trafficking: {
        priority: 3,
        requirement: {
            research : [
                "Cooking",
                "Cementing",
                "Steelwork"
            ]
        },
        cost: {
            cash: 200,
            food: 150,
            steel: 150,
            cement: 150
        }
    },
    Barricade: {
        priority: 6,
        requirement: {
            research : [
                "Construction",
                "Medicine"
            ],
            city: "Queens"
        },
        cost: {
            cash: 5000,
            food: 2500,
            steel: 2500,
            cement: 2500
        }
    },
    Quickdraw: {
        priority: 6,
        requirement: {
            offset: 21,
            research : [
                "Construction",
                "Carjacking"
            ],
            city: "LittleItaly"
        },
        cost: {
            cash: 25313,
            food: 12656,
            steel: 12656,
            cement: 12656
        }
    },
    Bureaucracy: {
        priority: 7,
        requirement: {
            offset: 21,
            research : [
                "Muscle",
                "Medicine"
            ]
        },
        cost: {
            cash: 3052563,
            food: 1526346,
            steel: 1526281,
            cement: 1526281
        }
    },
    Blackmail: {
        priority: 7,
        requirement: {
            offset: 21,
            research : [
                "Muscle",
                "Medicine"
            ]
        },
        cost: {
            cash: 3052563,
            food: 1526346,
            steel: 1526281,
            cement: 1526281
        }
    }
};
module.exports = research;

/*
           Logistics : {
                resources : {
                    cash : 150,
                    food : 100,
                    steel : 200,
                    cement : 100
                },
                buildings : {
                    Library : 1
                }
            },
            Cooking : {
                resources : {
                    cash : 150,
                    food : 200,
                    steel : 100,
                    cement : 100
                },
                research : {
                    Logistics : 1
                },
                buildings : {
                    Restaurant : 1
                }
            },
            Cementing : {
                resources : {
                    cash : 150,
                    food : 100,
                    steel : 100,
                    cement : 200
                },
                research : {
                    Logistics : 1
                },
                buildings : {
                    CementFactory : 1
                }
            },
            Steelwork : {
                resources : {
                    cash : 150,
                    food : 100,
                    steel : 200,
                    cement : 100
                },
                research : {
                    Logistics : 1
                },
                buildings : {
                    SteelMill : 1
                }
            },
            Trafficking : {
                resources : {
                    cash : 200,
                    food : 150,
                    steel : 150,
                    cement : 150
                },
                research : {
                    Cooking : 1,
                    Steelwork : 1,
                    Cementing : 1
                }
            },
            Spying : {
                resources : {
                    cash : 200,
                    food : 150,
                    steel : 150,
                    cement : 150
                },
                research : {
                    Logistics : 1
                }
            },
            Mechanics : {
                resources : {
                    cash : 250,
                    food : 175,
                    steel : 175,
                    cement : 175
                },
                research : {
                    Trafficking : 1
                }
            },
            Capacity : {
                resources : {
                    cash : 250,
                    food : 175,
                    steel : 175,
                    cement : 175
                },
                research : {
                    Cooking : 1,
                    Steelwork : 1,
                    Cementing : 1
                }
            },
            Maneuver : {
                resources : {
                    cash : 250,
                    food : 175,
                    steel : 175,
                    cement : 175
                },
                research : {
                    Spying : 1
                }
            },
            Proficiency : {
                resources : {
                    cash : 400,
                    food : 200,
                    steel : 200,
                    cement : 200
                },
                research : {
                    Mechanics : 1
                }
            },
            QuickDraw : {
                resources : {
                    cash : 400,
                    food : 200,
                    steel : 200,
                    cement : 200
                },
                research : {
                    Carjacking : 1,
                    Construction : 1
                },
                city : "LittleItaly"
            },
            Barricade : {
                resources : {
                    cash : 7500,
                    food : 3750,
                    steel : 3750,
                    cement : 3750
                },
                research : {
                    Medicine : 1,
                    Construction : 1
                },
                city : "Queens"
            },
            Carjacking : {
                resources : {
                    cash : 400,
                    food : 200,
                    steel : 200,
                    cement : 200
                },
                research : {
                    Capacity : 1
                }
            },
            Corruption : {
                resources : {
                    cash : 400,
                    food : 200,
                    steel : 200,
                    cement : 200
                },
                research : {
                    Capacity : 1
                },
                buildings : {
                    Hideout : 1
                }
            },
            Construction : {
                resources : {
                    cash : 400,
                    food : 200,
                    steel : 200,
                    cement : 200
                },
                research : {
                    Maneuver : 1
                }
            },
            Muscle : {
                resources : {
                    cash : 500,
                    food : 250,
                    steel : 250,
                    cement : 250
                },
                research : {
                    Mechanics : 1,
                    Proficiency : 1
                }
            },
            Medicine : {
                resources : {
                    cash : 500,
                    food : 250,
                    steel : 250,
                    cement : 250
                },
                research : {
                    Corruption : 1,
                    Construction : 1
                }
            },
            Blackmail : {
                resources : {
                    cash : 3052563,
                    food : 1526346,
                    steel : 1526281,
                    cement : 1526281
                },
                research : {
                    Medicine : 21,
                    Muscle : 21
                },
                buildings : {
                    Library : 12
                }
            },
            Bureaucracy : {
                resources : {
                    cash : 3052563,
                    food : 1526346,
                    steel : 1526281,
                    cement : 1526281
                },
                research : {
                    Medicine : 21,
                    Muscle : 21
                },
                buildings : {
                    Library : 12
                }
            }

*/
