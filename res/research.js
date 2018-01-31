var research =  {
	"Capacity": {
		"priority": 4,
		"requirement": {
			"research" : [
				"Cooking",
				"Cementing",
				"Steelwork"
			]
		},
		'cost': {
			'cash': 250,
			'food': 175,
			'steel': 175,
			'cement': 175
		}
	},
    "Carjacking": {
		"priority": 5,
		"requirement": {
			"research" : [
				"Capacity"
			],
			"build": "Garage"
		},
		'cost': {
			'cash': 400,
			'food': 200,
			'steel': 200,
			'cement': 200
		}
	},
    "Cementing": {
		"priority": 2,
		"requirement": {
			"research" : [
				"Logistics"
			],
			"build": "CementFactory"
		},
		'cost': {
			'cash': 150,
			'food': 100,
			'steel': 100,
			'cement': 200
		}
	},
    "Construction": {
		"priority": 4,
		"requirement": {
			"research" : [
				"Maneuver"
			]
		},
		'cost': {
			'cash': 400,
			'food': 200,
			'steel': 200,
			'cement': 200
		}
	},
    "Cooking": {
		"priority": 2,
		"requirement": {
			"research" : [
				"Logistics"
			],
			"build": "Restaurant"
		},
		'cost': {
			'cash': 150,
			'food': 200,
			'steel': 100,
			'cement': 100
		}
	},
    "Corruption": {
		"priority": 5,
		"requirement": {
			"research" : [
				"Capacity"
			],
			"build": "Hideout"
		},
		'cost': {
			'cash': 400,
			'food': 200,
			'steel': 200,
			'cement': 200
		}
	},
    "Logistics": {
		"priority": 1,
		"requirement": {
			"research" : [],
			"build": "Library"
		},
		'cost': {
			'cash': 225,
			'food': 150,
			'steel': 300,
			'cement': 150
		}
	},
    "Maneuver": {
		"priority": 3,
		"requirement": {
			"research" : [
				"Spying"
			],
			"build": "Garage"
		},
		'cost': {
			'cash': 250,
			'food': 175,
			'steel': 175,
			'cement': 175
		}
	},
    "Mechanics": {
		"priority": 4,
		"requirement": {
			"research" : [
				"Trafficking"
			],
            "build": "Wall"
		},
		'cost': {
			'cash': 250,
			'food': 175,
			'steel': 175,
			'cement': 175
		}
	},
    "Medicine": {
		"priority": 6,
		"requirement": {
			"research" : [
				"Construction",
				"Corruption"
			]
		},
		'cost': {
			'cash': 500,
			'food': 250,
			'steel': 250,
			'cement': 250
		}
	},
    "Muscle": {
		"priority": 6,
		"requirement": {
			"research" : [
				"Proficiency",
				"Mechanics"
			],
			"Build": "GaurdPost"
		},
		'cost': {
			'cash': 500,
			'food': 250,
			'steel': 250,
			'cement': 250
		}
	},
    "Proficiency": {
		"priority": 5,
		"requirement": {
			"research" : [
				"Mechanics"
			],
			"build": "Workshop"
		},
		'cost': {
			'cash': 400,
			'food': 200,
			'steel': 200,
			'cement': 200
		}
	},
    "Spying": {
		"priority": 2,
		"requirement": {
			"research" : [
				"Logistics"
			]
		},
		'cost': {
			'cash': 200,
			'food': 150,
			'steel': 150,
			'cement': 150
		}
	},
    "Steelwork": {
		"priority": 2,
		"requirement": {
			"research" : [
				"Logistics"
			],
			"build": "SteelMill"
		},
		'cost': {
			'cash': 150,
			'food': 100,
			'steel': 200,
			'cement': 100
		}
	},
    "Trafficking": {
		"priority": 3,
		"requirement": {
			"research" : [
				"Cooking",
				"Cementing",
				"Steelwork"
			]
		},
		'cost': {
			'cash': 200,
			'food': 150,
			'steel': 150,
			'cement': 150
		}
	}
};
