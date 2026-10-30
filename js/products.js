const listedProducts = [
  {
    id: "black-blue-set",
    name: "Black-blue-set",
    image: "assets/Screenshot%202026-10-30%20185459.png",
    type: ["rent", "sale"],
    category: "women",
    priceNote: "Ask for price",
    available: true
  },
  {
    id: "pink-yellow-set",
    name: "Pink & yellow set",
    image: "assets/Screenshot%202026-10-30%20185436.png",
    type: ["rent", "sale"],
    category: "women",
    priceNote: "Ask for price",
    available: true
  },
  {
    id: "sky-blue-white-set",
    name: "Sky-blue & white set",
    image: "assets/Screenshot%202026-10-30%20190841.png",
    type: ["rent", "sale"],
    category: "women",
    priceNote: "Ask for price",
    available: true
  },
  {
    id: "pink-green-set",
    name: "Pink & green set",
    image: "assets/Screenshot%202026-10-30%20185237.png",
    type: ["rent", "sale"],
    category: "couple",
    priceNote: "Ask for price",
    available: true
  },
  {
    id: "kids-vest-7-8",
    name: "Kids vest 7-8 years",
    image: "assets/Screenshot%202026-10-30%20190715.png",
    type: ["rent", "sale"],
    category: "kids",
    priceNote: "Ask for price",
    available: true
  },
  {
    id: "kids-vest-1-2",
    name: "Kids vest 1-2 years",
    image: "assets/Screenshot%202026-10-30%20190702.png",
    type: ["rent", "sale"],
    category: "kids",
    priceNote: "Ask for price",
    available: true
  }
];

const collectionPhotos = [
  { image: "assets/Screenshot%202026-10-30%20185128.png", name: "Lavender & white set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185200.png", name: "Black & yellow women's set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185258.png", name: "Pink & teal set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185356.png", name: "Silver & blue necklace set", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20185448.png", name: "Pink blouse & yellow set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185523.png", name: "Black & green women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185557.png", name: "Blue & white women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185710.png", name: "Black & yellow women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185751.png", name: "Blue & lavender twinning sets", category: "couple" },
  { image: "assets/Screenshot%202026-10-30%20185818.png", name: "Turquoise & white women's set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185840.png", name: "Blue & white women's set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20185920.png", name: "Blue & white traditional attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190011.png", name: "Peach & gold accessory set", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20190030.png", name: "Red & cream traditional set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190053.png", name: "Lime green & white set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190116.png", name: "Embroidered black neckties", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20190132.png", name: "Multicolor beaded necklaces", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20190203.png", name: "Traditional beaded necklaces", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20190240.png", name: "Red & white shawl with necklace", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20190319.png", name: "Turquoise & white women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190438.png", name: "Yellow & white women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190521.png", name: "Red traditional set with accessories", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190600.png", name: "Blue & white traditional set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190623.png", name: "Yellow & red traditional set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190643.png", name: "Red & black embroidered vest", category: "men" },
  { image: "assets/Screenshot%202026-10-30%20190734.png", name: "Black & yellow set with jewelry", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190757.png", name: "Blue & white women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190818.png", name: "Red & black women's attire", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190915.png", name: "Traditional sets in assorted colors", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190926.png", name: "Red, green & cream traditional sets", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20190957.png", name: "Embroidered vest, size 39", category: "men" },
  { image: "assets/Screenshot%202026-10-30%20191018.png", name: "Baby's red embroidered vest", category: "kids" },
  { image: "assets/Screenshot%202026-10-30%20191045.png", name: "Peach & cream set", category: "women" },
  { image: "assets/Screenshot%202026-10-30%20191114.png", name: "Red tassel earrings", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20191125.png", name: "Orange tassel earrings", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20191145.png", name: "Red & black embroidered neckties", category: "accessories" },
  { image: "assets/Screenshot%202026-10-30%20191157.png", name: "Red & white shawl with black tie", category: "accessories" }
];

window.KABUI_PRODUCTS = [
  ...listedProducts,
  ...collectionPhotos.map(({ image, name, category }, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      id: `collection-photo-${number}`,
      name,
      image,
      type: ["rent", "sale"],
      category,
      priceNote: "Ask for price",
      available: true
    };
  })
];
