var attackUnits = {
    'Thug': {
		'type': 'Basic',
		'city': 'All',
		'trainable': true,
        'cost': {
            'cash': 750,
            'food': 281,
            'steel': 563,
            'cement': 281,
            'influence': 10
        },
        'bailout':2250
    },
    'Arsonist': {
		'type': 'Basic',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 1
            },
            'build': {
                'Hideout': 2
            }
        },
        'cost': {
            'cash': 1100,
            'food': 825,
            'steel': 413,
            'cement': 413,
            'influence': 10
        },
        'bailout': 3300
    },
    'Demolitionist': {
		'type': 'Intermediate',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Proficiency': 4
            },
            'build': {
                'Garage': 3,
                'Hideout': 3
            }
        },
        'cost': {
            'cash': 1700,
            'food': 638,
            'steel': 1274,
            'cement': 638,
            'influence': 20
        },
        'bailout':5100
    },
    'Bruiser': {
		'type': 'Intermediate',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 6
            },
            'build': {
                'Workshop': 3,
                'Hideout': 4
            }
        },
        'cost': {
            'cash': 2700,
            'food': 2025,
            'steel': 1013,
            'cement': 1013,
            'influence': 20
        },

        'bailout':8100
    },
    'Hitman': {
		'type': 'Advanced',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 7,
                'Proficiency': 7
            },
            'build': {
                'Hideout': 6,
                'Workshop': 5,
                'Garage':5
            }
        }
    },
    'Enforcer': {
		'type': 'Advanced',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Proficiency': 8
            },
            'build': {
                'Garage': 6,
                'Hideout': 7
            }
        },'bailout':17100
    },
    'TommyGunner': {
		'type': 'Expert',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 10
            },
            'build': {
                'Workshop': 6,
                'Hideout': 8
            }
        }
    },
    'Professional': {
		'type': 'Expert',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Proficiency': 12
            },
            'build': {
                'Garage': 9,
                'Hideout': 9
            }
        }
    },
    'Sniper': {
		'type': 'Elite',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 14,
                'Proficiency': 14
            },
            'build': {
                'Hideout': 9,
                'Workshop': 9,
                'Garage': 9
            }
        },
        'bailout': 46800
    },
    'Butcher': {
		'type': 'Elite',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 16,
                'Cooking': 17
            },
            'build': {
                'Workshop': 9,
                'Hideout': 9
            }
        }
    },
    'BlackWidow': {
		'type': 'Femme Fatale',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Corruption': 17
            },
            'build': {
                'Hideout': 9,
                'Workshop': 9
            }
        },
        'bailout': 56628
    },
    'Assassin': {
		'type': 'Femme Fatale',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Proficiency': 17
            },
            'build': {
                'Hideout': 9,
                'Garage': 9
            }
        },
        'bailout':56628
    },

    'Courier': {
		'type': 'Normal',
		'city': 'All',
		'trainable': true,
        'cost': {
            'cash': 500,
            'food': 188,
            'steel': 188,
            'cement': 375,
            'influence': 10
        }
    },
    'DeliveryTruck': {
		'type': 'Normal',
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Mechanics': 6,
                'Capacity': 8
            },
            'build': {
                'Hideout': 5,
                'Garage': 2
            }
        }
    },
    'Freighttrain': {
    },

    'Heavyweight': {
		'type': 'Pulitori',
		'city': 'LittleItaly',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Smuggler': {
		'type': 'Pulitori',
		'city': 'GreenwichVillage',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Undertaker': {
		'type': 'Pulitori',
		'city': 'Brooklyn',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Doctor': {
		'type': 'Pulitori',
		'city': 'ParkAvenue',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Loanshark': {
		'type': 'Pulitori',
		'city': 'AtlanticCity',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Hatchetman': {
		'type': 'Pulitori',
		'city': 'Chinatown',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Triggerman': {
		'type': 'Pulitori',
		'city': 'Captial',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },
    'Bartender': {
		'type': 'Pulitori',
		'city': 'Harlem',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 12,
                'Muscle': 12
            },
            'build': {
                'Hideout': 9
            }
        },
        'bailout':62292
    },

    'CrookedCop': {
		'type': 'Johnney Law',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'Captain': {
		'type': 'Johnney Law',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'DRC': {
		'type': 'Johnney Law',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'PIG': {
		'type': 'Johnney Law',
		'city': 'ParkAvenue',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'Highbinder': {
		'type': 'Johnney Law',
		'city': 'Chinatown',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'Gman': {
		'type': 'Johnney Law',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },
    'Bookie': {
		'type': 'Johnney Law',
		'city': 'Harlem',
		'trainable': true,
		'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
            'build': {
                'Hideout': 10,
				'Workshop': 10,
				'Garage': 10
            }
        },
        'bailout':68520
    },

    'MisterSnip': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MisterHaul': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MisterFixit': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MissesNeat': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MisterSplit': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MisterKippy': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },
    'MisterPao': {
		'type': 'Clean-up Crew',
        'bailout':75000
    },

    'Hitsquad': {
		'trainable': false
    },
    'Deathsquad': {
		'trainable': false
    },
    'Deliverybomber': {
		'trainable': false
    },
    'Medicalcourier': {
		'trainable': false
    },

    'Frontman': {
		'trainable': false
    },
    'Skinner': {
		'trainable': false
    },
    'Bassist': {
		'trainable': false
    },

    'Clyde': {
		'trainable': false
    },
    'Bonnie': {
		'trainable': false
    },
    'Romeo': {
		'trainable': false
    },
    'Maneater': {
		'trainable': false
    },
    'Carbomber': {
		'trainable': false
    }
};
