var defenseUnits = {
    "BarbedWire": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 4
            },
            'build': {
                'GuardPost': 2,
                'Wall': 2
            }
        },
        'cost': {
            'cash': 1700,
            'food': 638,
            'steel': 638,
            'cement': 1275
        }
    },
    "BoobyTrap": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 8
            },
			'build': {
                'GuardPost': 4,
                'Wall': 4
            }
        },
        'cost': {
            'cash': 1700,
            'food': 638,
            'steel': 638,
            'cement': 1275
        }
    },
    "GuardDog": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 12
            },
			'build': {
                'GuardPost': 6,
                'Wall': 6
            }
        }
    },
    "ArmedGuard": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 14
            },
			'build': {
                'GuardPost': 7,
                'Wall': 7
            }
        }
    },
    "Bodyguard": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 16
            },
			'build': {
                'GuardPost': 8,
                'Wall': 8
            }
        }
    },
    "UnnamedDefender": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Logistics': 18
            },
			'build': {
                'GuardPost': 9,
                'Wall': 9
            }
        }
    },
    "Moneyman": {
		'city': 'All',
		'trainable': true,
        'requirement': {
            'research': {
                'Medicine': 16,
                'Muscle': 16
            },
			'build': {
                'Hideout': 10,
                'GuardPost': 10,
                'Wall': 10
            }
        }
    },

	"LeatherHead": {
		'trainable': false
	},
	"Mastermind": {
		'trainable': false
	},
	"DonCompanion": {
		'trainable': false
	}
};
