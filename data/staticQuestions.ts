
import { QuestionItem, Difficulty } from '../types';

// Helper to create ID
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export const STATIC_QUESTIONS: { [topicId: string]: { [key in Difficulty]: QuestionItem[] } } = {
  space: {
    [Difficulty.EASY]: [
      { id: id('s-e'), emojis: '👽', count: 1, sentencePart1: '_______', sentencePart2: 'a green alien.', correctAnswer: 'There is', explanation: 'Solo hay un alienígena (singular).' },
      { id: id('s-e'), emojis: '🚀🚀', count: 2, sentencePart1: '_______', sentencePart2: 'two fast rockets.', correctAnswer: 'There are', explanation: 'Hay dos cohetes (plural).' },
      { id: id('s-e'), emojis: '⭐', count: 1, sentencePart1: '_______', sentencePart2: 'a shining star.', correctAnswer: 'There is', explanation: 'Solo una estrella (singular).' },
      { id: id('s-e'), emojis: '🪐🪐🪐', count: 3, sentencePart1: '_______', sentencePart2: 'three planets.', correctAnswer: 'There are', explanation: 'Hay tres planetas (plural).' },
      { id: id('s-e'), emojis: '👩‍🚀', count: 1, sentencePart1: '_______', sentencePart2: 'an astronaut.', correctAnswer: 'There is', explanation: 'Solo un astronauta (singular).' },
    ],
    [Difficulty.MEDIUM]: [
      { id: id('s-m'), emojis: '🌑', count: 1, sentencePart1: '_______', sentencePart2: 'a dark moon behind the clouds.', correctAnswer: 'There is', explanation: 'Usamos "There is" para objetos singulares.' },
      { id: id('s-m'), emojis: '⭐⭐⭐⭐', count: 4, sentencePart1: '_______', sentencePart2: 'bright stars in the sky.', correctAnswer: 'There are', explanation: 'Estrellas es contable y plural.' },
      { id: id('s-m'), emojis: '🛰️', count: 1, sentencePart1: '_______', sentencePart2: 'a satellite orbiting Earth.', correctAnswer: 'There is', explanation: 'Singular, un solo satélite.' },
      { id: id('s-m'), emojis: '☄️☄️', count: 2, sentencePart1: '_______', sentencePart2: 'two comets flying fast.', correctAnswer: 'There are', explanation: 'Plural, dos cometas.' },
      { id: id('s-m'), emojis: '🛸', count: 1, sentencePart1: '_______', sentencePart2: 'a mysterious UFO nearby.', correctAnswer: 'There is', explanation: 'Singular, un OVNI.' },
    ],
    [Difficulty.HARD]: [
      { id: id('s-h'), emojis: '🌌🌌', count: 1, sentencePart1: '_______', sentencePart2: 'infinite space around us.', correctAnswer: 'There is', explanation: '"Space" (espacio) es incontable aquí.' },
      { id: id('s-h'), emojis: '👽👽👽', count: 3, sentencePart1: '_______', sentencePart2: 'some aliens on Mars.', correctAnswer: 'There are', explanation: '"Aliens" es plural contable.' },
      { id: id('s-h'), emojis: '🧊🧊', count: 1, sentencePart1: '_______', sentencePart2: 'some ice on the comet.', correctAnswer: 'There is', explanation: '"Ice" (hielo) es un sustantivo incontable.' },
      { id: id('s-h'), emojis: '👨‍🚀👩‍🚀', count: 2, sentencePart1: '_______', sentencePart2: 'people on the space station.', correctAnswer: 'There are', explanation: '"People" es un plural irregular (de person).' },
      { id: id('s-h'), emojis: '💨', count: 1, sentencePart1: '_______', sentencePart2: 'no air in space.', correctAnswer: 'There is', explanation: '"Air" (aire) es incontable.' },
    ]
  },
  jungle: {
    [Difficulty.EASY]: [
      { id: id('j-e'), emojis: '🦁', count: 1, sentencePart1: '_______', sentencePart2: 'a big lion.', correctAnswer: 'There is', explanation: 'Un solo león (singular).' },
      { id: id('j-e'), emojis: '🐵🐵', count: 2, sentencePart1: '_______', sentencePart2: 'two funny monkeys.', correctAnswer: 'There are', explanation: 'Dos monos (plural).' },
      { id: id('j-e'), emojis: '🐍', count: 1, sentencePart1: '_______', sentencePart2: 'a long snake.', correctAnswer: 'There is', explanation: 'Una sola serpiente (singular).' },
      { id: id('j-e'), emojis: '🦜🦜🦜', count: 3, sentencePart1: '_______', sentencePart2: 'three colorful birds.', correctAnswer: 'There are', explanation: 'Tres pájaros (plural).' },
      { id: id('j-e'), emojis: '🌴', count: 1, sentencePart1: '_______', sentencePart2: 'a tall tree.', correctAnswer: 'There is', explanation: 'Un árbol (singular).' },
    ],
    [Difficulty.MEDIUM]: [
      { id: id('j-m'), emojis: '🐘', count: 1, sentencePart1: '_______', sentencePart2: 'a huge elephant near the river.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('j-m'), emojis: '🐅🐅', count: 2, sentencePart1: '_______', sentencePart2: 'dangerous tigers in the grass.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('j-m'), emojis: '🐊', count: 1, sentencePart1: '_______', sentencePart2: 'a crocodile in the water.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('j-m'), emojis: '🦋🦋🦋', count: 3, sentencePart1: '_______', sentencePart2: 'blue butterflies flying.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('j-m'), emojis: '🦍', count: 1, sentencePart1: '_______', sentencePart2: 'a strong gorilla eating.', correctAnswer: 'There is', explanation: 'Singular.' },
    ],
    [Difficulty.HARD]: [
      { id: id('j-h'), emojis: '💧💧💧', count: 1, sentencePart1: '_______', sentencePart2: 'fresh water in the river.', correctAnswer: 'There is', explanation: '"Water" es incontable.' },
      { id: id('j-h'), emojis: '🐁🐁🐁', count: 3, sentencePart1: '_______', sentencePart2: 'three mice hiding.', correctAnswer: 'There are', explanation: '"Mice" es el plural irregular de "mouse".' },
      { id: id('j-h'), emojis: '🌿🌿', count: 1, sentencePart1: '_______', sentencePart2: 'a lot of grass.', correctAnswer: 'There is', explanation: '"Grass" (pasto) suele ser incontable.' },
      { id: id('j-h'), emojis: '🦷🦷', count: 2, sentencePart1: '_______', sentencePart2: 'sharp teeth in the lion\'s mouth.', correctAnswer: 'There are', explanation: '"Teeth" es el plural irregular de "tooth".' },
      { id: id('j-h'), emojis: '🌧️', count: 1, sentencePart1: '_______', sentencePart2: 'heavy rain today.', correctAnswer: 'There is', explanation: '"Rain" (lluvia) es incontable.' },
    ]
  },
  school: {
    [Difficulty.EASY]: [
      { id: id('sch-e'), emojis: '✏️', count: 1, sentencePart1: '_______', sentencePart2: 'a yellow pencil.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('sch-e'), emojis: '📚📚', count: 2, sentencePart1: '_______', sentencePart2: 'two books.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('sch-e'), emojis: '🍎', count: 1, sentencePart1: '_______', sentencePart2: 'an apple for the teacher.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('sch-e'), emojis: '✂️✂️✂️', count: 3, sentencePart1: '_______', sentencePart2: 'three scissors.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('sch-e'), emojis: '🎒', count: 1, sentencePart1: '_______', sentencePart2: 'a red backpack.', correctAnswer: 'There is', explanation: 'Singular.' },
    ],
    [Difficulty.MEDIUM]: [
      { id: id('sch-m'), emojis: '📏', count: 1, sentencePart1: '_______', sentencePart2: 'a long ruler on the desk.', correctAnswer: 'There is', explanation: 'Singular con preposición.' },
      { id: id('sch-m'), emojis: '🖍️🖍️', count: 2, sentencePart1: '_______', sentencePart2: 'colorful crayons in the box.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('sch-m'), emojis: '💻', count: 1, sentencePart1: '_______', sentencePart2: 'a new laptop for class.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('sch-m'), emojis: '👦👦', count: 2, sentencePart1: '_______', sentencePart2: 'two students studying.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('sch-m'), emojis: '🏫', count: 1, sentencePart1: '_______', sentencePart2: 'a big school near my house.', correctAnswer: 'There is', explanation: 'Singular.' },
    ],
    [Difficulty.HARD]: [
      { id: id('sch-h'), emojis: '🧒🧒🧒', count: 3, sentencePart1: '_______', sentencePart2: 'many children in the yard.', correctAnswer: 'There are', explanation: '"Children" es el plural irregular de "child".' },
      { id: id('sch-h'), emojis: '📝', count: 1, sentencePart1: '_______', sentencePart2: 'homework to do.', correctAnswer: 'There is', explanation: '"Homework" es incontable (nunca digas homeworks).' },
      { id: id('sch-h'), emojis: '👣👣', count: 2, sentencePart1: '_______', sentencePart2: 'muddy feet in the hall.', correctAnswer: 'There are', explanation: '"Feet" es el plural irregular de "foot".' },
      { id: id('sch-h'), emojis: 'ℹ️', count: 1, sentencePart1: '_______', sentencePart2: 'information on the board.', correctAnswer: 'There is', explanation: '"Information" es incontable.' },
      { id: id('sch-h'), emojis: '👩‍🏫👨‍🏫', count: 2, sentencePart1: '_______', sentencePart2: 'nice people in this school.', correctAnswer: 'There are', explanation: '"People" siempre es plural.' },
    ]
  },
  food: {
    [Difficulty.EASY]: [
      { id: id('f-e'), emojis: '🍔', count: 1, sentencePart1: '_______', sentencePart2: 'a tasty burger.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('f-e'), emojis: '🍟🍟', count: 2, sentencePart1: '_______', sentencePart2: 'two french fries.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('f-e'), emojis: '🍕', count: 1, sentencePart1: '_______', sentencePart2: 'a slice of pizza.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('f-e'), emojis: '🍪🍪🍪', count: 3, sentencePart1: '_______', sentencePart2: 'three cookies.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('f-e'), emojis: '🍦', count: 1, sentencePart1: '_______', sentencePart2: 'an ice cream.', correctAnswer: 'There is', explanation: 'Singular.' },
    ],
    [Difficulty.MEDIUM]: [
      { id: id('f-m'), emojis: '🥪', count: 1, sentencePart1: '_______', sentencePart2: 'a sandwich on the plate.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('f-m'), emojis: '🌮🌮', count: 2, sentencePart1: '_______', sentencePart2: 'spicy tacos for dinner.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('f-m'), emojis: '🎂', count: 1, sentencePart1: '_______', sentencePart2: 'a chocolate cake.', correctAnswer: 'There is', explanation: 'Singular.' },
      { id: id('f-m'), emojis: '🍓🍓🍓', count: 3, sentencePart1: '_______', sentencePart2: 'sweet strawberries.', correctAnswer: 'There are', explanation: 'Plural.' },
      { id: id('f-m'), emojis: '🍩', count: 1, sentencePart1: '_______', sentencePart2: 'a glazed donut.', correctAnswer: 'There is', explanation: 'Singular.' },
    ],
    [Difficulty.HARD]: [
      { id: id('f-h'), emojis: '🥛', count: 1, sentencePart1: '_______', sentencePart2: 'some milk in the glass.', correctAnswer: 'There is', explanation: '"Milk" (leche) es incontable.' },
      { id: id('f-h'), emojis: '🧀🧀', count: 1, sentencePart1: '_______', sentencePart2: 'a lot of cheese.', correctAnswer: 'There is', explanation: '"Cheese" (queso) es incontable.' },
      { id: id('f-h'), emojis: '🍬🍬', count: 2, sentencePart1: '_______', sentencePart2: 'some candy in the bag.', correctAnswer: 'There is', explanation: '"Candy" a veces se usa como incontable en general, o "sweets" para plural.' },
      { id: id('f-h'), emojis: '🍞🍞', count: 1, sentencePart1: '_______', sentencePart2: 'fresh bread.', correctAnswer: 'There is', explanation: '"Bread" (pan) es incontable.' },
      { id: id('f-h'), emojis: '🧂', count: 1, sentencePart1: '_______', sentencePart2: 'salt on the table.', correctAnswer: 'There is', explanation: '"Salt" es incontable.' },
    ]
  }
};
