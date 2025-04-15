export interface MenuItem {
    name: string;
    category: string;
    image?: string; // e.g. "/menu/xyz.jpg"
  }
  
  export const menu: MenuItem[] = [
    // Classic Rolls (All rolls come with chips)
    { name: "The Chopped Cheese", category: "Classic Rolls" },
    { name: "Veggie Chopped Cheese", category: "Classic Rolls" },
    { name: "Shrimp Roll", category: "Classic Rolls" },
    { name: "Sausage & Pepper", category: "Classic Rolls" },
  
    // A.M Eats (Includes hash brown and side of strawberries)
    { name: "Hash Stack", category: "A.M. Eats" },
    { name: "Bacon Egg N’ Cheese", category: "A.M. Eats" },
    { name: "Chicken Sausage Egg N’ Cheese", category: "A.M. Eats" },
    { name: "Veggie Sausage Egg N’ Cheese", category: "A.M. Eats" },
  
    // Subs
    { name: "The Chopped Sub", category: "Subs" },
    { name: "Veggie Chopped Sub", category: "Subs" },
    { name: "Turkey Sub Template Bundle", category: "Subs" },
  
    // Bodega Bowls
    { name: "Classic Bowl", category: "Bodega Bowls" },
    { name: "Veggie Bowl", category: "Bodega Bowls" },
    { name: "Custom Bowl", category: "Bodega Bowls" },
  
    // Salads
    { name: "Sunburst Chopped Salad", category: "Salads" },
    { name: "Classic Chopped Salad", category: "Salads" },
    { name: "Custom Salad", category: "Salads" },
  
    // Smashers
    { name: "Smashed Turkey", category: "Smashers" },
    { name: "Smashed Italy", category: "Smashers" },
  
    // Sweets
    { name: "Churros with Sauce", category: "Sweets" },
    { name: "Arroz con Leche (Regular/Strawberry)", category: "Sweets" },
  
    // Beverages
    { name: "Fresh Orange Juice (TBD)", category: "Beverages" },
    { name: "Green Naked Juice", category: "Beverages" },
    { name: "Snapple", category: "Beverages" },
    { name: "Beer and Seltzer", category: "Beverages" },
  
    // Chips
    { name: "Chips (Wide variety available)", category: "Chips" },
  
    // Sauces
    { name: "Ranch", category: "Sauces" },
    { name: "Remoulade", category: "Sauces" },
    { name: "Bodega Sauce", category: "Sauces" },
    { name: "Creamy Feta", category: "Sauces" },
    { name: "Mayo", category: "Sauces" },
    { name: "Ketchup", category: "Sauces" },
    { name: "Oil", category: "Sauces" },
    { name: "Vinegar", category: "Sauces" }
  ];
  