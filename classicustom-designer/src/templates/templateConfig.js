export const phoneCoverTemplate = {
    id: "phone-cover",
    name: "Phone Cover",
    width: 250,
    height: 500,
    background: "/templates/phoneCover/background.png",
    placeholderImage: "/templates/phoneCover/placeholder.png",
    mask: {
        type: "rounded-rect",
        radius: 20,
        cutouts: [
            {
                type: "rect",
                x: 20,
                y: 20,
                width: 90,
                height: 120,
                radius: 10,
            },
        ],
    },
    designOptions: {
        defaultEffect: { outline: true, burnt: false },
        specialImages: {
            logo: { burnt: true },
            signature: { outline: true, strokeColor: "red" }
        }
    },
};

export const mugTemplate = {
    id: "mug",
    name: "Mug",
    width: 300,
    height: 200,
    background: "/templates/mug/background.png",
    placeholderImage: "/templates/mug/placeholder.png",
    mask: {
        type: "rect", // no rounded mask
        cutouts: [], // mugs have no cutouts
    },
};

export const tShirtTemplate = {
    id: "tshirt",
    name: "T-Shirt",
    width: 400,
    height: 500,
    background: "/templates/tshirt/background.png",
    placeholderImage: "/templates/tshirt/placeholder.png",
    mask: {
        type: "rounded-rect",
        radius: 30,
        cutouts: [], // optional neck or sleeve cutouts could go here
    },
};


