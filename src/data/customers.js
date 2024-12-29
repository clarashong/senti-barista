export const customers = [
    {
        id: 1,
        name: "Sarah",
        order: "I need something that tastes like sunshine!",
        taste: {sweetness: 80, saltiness: 0, sourness: 20, bitterness: 0, umami: 0},
        likes: ["passion fruit"],
        dislikes: ["coffee"],
        theme: ["orange juice", "mango", "honey", "pineapple"],
        offTheme: ["matcha"],
        decoration: [],
        feedback: {
            positive: ["This is exactly what I wanted!", "So refreshing!"],
            negative: ["This is too bitter", "Not sweet enough"]
        },
    },
    {
        id: 2,
        name: "Mike",
        order: "I need something strong to keep me awake!",
        taste: {sweetness: 10, saltiness: 30, sourness: 0, bitterness: 40, umami: 20},
        likes: ["espresso"],
        dislikes: ["strawberry"],
        theme: ["coffee", "espresso", "tea"],
        offTheme: ["lavender"],
        decoration: [],
        feedback: {
            positive: ["Perfect strength!", "Just what I needed"],
            negative: ["Too weak", "Not enough coffee"]
        },
    }
];