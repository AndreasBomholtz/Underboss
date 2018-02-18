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
                    Wall:7
                },
                8: {
                    Wall:8
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
                    Restaurant:5
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
            gangster:6
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
                    SteelMill:3
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
    CrewBank: {
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
        cost: {
            cash: 43885,
            food: 11445,
            steel: 11445,
            cement: 11445
        }
    },
    Condo: {
        skip: true
    }
};
module.exports = buildings;
