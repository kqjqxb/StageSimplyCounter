export default [
    {
        id: 1,
        title: "Horseshoe Falls",
        description: "Horseshoe Falls is the largest and most powerful Niagara Falls, located on the Canadian side. It got its name due to its semicircular shape, resembling a horseshoe. A huge mass of water falls down at a speed of more than 65 km/h, creating a roar that can be heard 30 km away.",
        coordinates: {
            latitude: 43.0799,
            longitude: -79.0752
        },
        facts: [
            {
                factId: 1,
                fact: 'In 1848, Niagara Falls froze, completely blocking the flow of water. About 3,160 tons of water fall down every second.',
            },
            {
                factId: 2,
                fact: 'In 1969, the Americans stopped the waterfall for one day to study its erosion.',
            },
            {
                factId: 3,
                fact: 'In 1901, 63-year-old Annie Taylor became the first person to go down the falls in a barrel and survive.',
            },
        ],
        category: 'What to do?',
        categoryElements: [
            {
                elementId: 1,
                element: 'Take the Maid of the Mist, a boat tour that takes place at the base of the falls.'
            },
            {
                elementId: 2,
                element: 'Climb the Skylon Tower to see the falls from above.'
            },
            {
                elementId: 3,
                element: 'In the evening, see the light show, when the falls are illuminated in different colors.'
            }
        ],
        image: require('../assets/images/placesImages/place1.png'),
    }, 
    {
        id: 2,
        title: "Cave of the Winds",
        description: "Cave of the Winds is a unique excursion during which tourists can walk directly under the waterfall through wooden platforms. The water falls with enormous force, creating a hurricane effect at a speed of 110 km/h.",
        coordinates: {
            latitude: 43.0830,
            longitude: -79.0666
        },
        facts: [
            {
                factId: 1,
                fact: 'Once there was a natural cave here, but in the 1920s it was destroyed by rockfalls.',
            },
            {
                factId: 2,
                fact: 'Tour participants receive yellow raincoats, because the water falls directly on people!',
            },
            {
                factId: 3,
                fact: 'In the 19th century, the excursion was available only to the most courageous tourists.',
            },
        ],
        category: 'What is worth doing?',
        categoryElements: [
            {
                elementId: 1,
                element: 'Feel the power of the waterfall on the "Hurricane Deck" - a platform where water falls literally a meter from you.'
            },
            {
                elementId: 2,
                element: 'Take a picture of the rainbow that appears during sunny weather.'
            },
            {
                elementId: 3,
                element: 'Visit this place at night, when the lighting adds a mystical atmosphere.'
            }
        ],
        image: require('../assets/images/placesImages/place2.png'),
    },
    {
        id: 3,
        title: "Journey Behind the Falls",
        description: "Journey Behind the Falls is a tour that takes tourists through the tunnels behind the Horseshoe Falls. The entrance is located in the center of the Table Rock Welcome Center.",
        coordinates: {
            latitude: 43.0776,
            longitude: -79.0790
        },
        facts: [
            {
                factId: 1,
                fact: 'The tunnels were dug in the 19th century, but they were constantly expanded.',
            },
            {
                factId: 2,
                fact: 'Tourists can feel the vibration of the ground when the water falls from a height of 51 meters.',
            },
            {
                factId: 3,
                fact: 'In winter, part of the water turns into ice sculptures.',
            },
        ],
        category: 'What to do?',
        categoryElements: [
            {
                elementId: 1,
                element: 'Go to the observation balcony to take unique photos of the waterfall up close.'
            },
            {
                elementId: 2,
                element: 'Visit this place in the morning, when there are fewer people.'
            },
            {
                elementId: 3,
                element: 'In autumn, see the red and yellow maples, which add even more effect.'
            }
        ],
        image: require('../assets/images/placesImages/place3.png'),
    }, 
    {
        id: 4,
        title: "Skylon Tower (Observation Tower)",
        description: "Skylon Tower is the best place to see Niagara from above. The tower has a panoramic terrace and a revolving restaurant, from where you can see the falls, the river and the city.",
        coordinates: {
            latitude: 43.0815,
            longitude: -79.0780
        },
        facts: [
            {
                factId: 1,
                fact: 'The construction of the tower was completed in 1965.',
            },
            {
                factId: 2,
                fact: 'The elevator to the top rises in just 52 seconds.',
            },
            {
                factId: 3,
                fact: 'You can order a romantic dinner at the restaurant with a view of the falls.',
            },
        ],
        category: 'What is worth doing?',
        categoryElements: [
            {
                elementId: 1,
                element: 'Visit the observation deck at sunset.'
            },
            {
                elementId: 2,
                element: 'Have dinner in the revolving restaurant.'
            },
            {
                elementId: 3,
                element: 'See fireworks over the falls in the summer.'
            }
        ],
        image: require('../assets/images/placesImages/place4.png'),
    },
    {
        id: 5,
        title: "Maid of the Mist (Legendary Boat Tour)",
        description: "Maid of the Mist is the most popular boat tour in Niagara. The boat sails so close to the falls that passengers are literally in a mist from the water.",
        coordinates: {
            latitude: 43.0828,
            longitude: -79.0718
        },
        facts: [
            {
                factId: 1,
                fact: 'The first boats appeared here in 1846.',
            },
            {
                factId: 2,
                fact: 'Passengers are given blue raincoats, because the water floods everything around.',
            },
            {
                factId: 3,
                fact: 'The boat is used in many films and music videos.',
            },
        ],
        category: 'What to do?',
        categoryElements: [
            {
                elementId: 1,
                element: 'Take a camera in a waterproof case.'
            },
            {
                elementId: 2,
                element: 'Prepare for a wet adventure.'
            },
            {
                elementId: 3,
                element: 'Book tickets in advance, because the tour is very popular.'
            }
        ],
        image: require('../assets/images/placesImages/place5.png'),
    }, 
]