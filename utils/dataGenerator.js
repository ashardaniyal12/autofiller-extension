/**
 * Utility for generating realistic international dummy data
 */

const DataGenerator = {
  // Names by country
  countryData: {
    Germany: {
      maleNames: [
        "Leon", "Paul", "Ben", "Elias", "Jonas", "Luis", "Noah", "Felix", "Maximilian", 
        "Henry", "Luca", "Finn", "Lukas", "Emil", "Anton", "David", "Julian", "Alexander",
        "Moritz", "Niklas", "Daniel", "Sebastian", "Simon", "Adrian", "Christian"
      ],
      femaleNames: [
        "Emma", "Mia", "Hannah", "Emilia", "Sofia", "Lina", "Anna", "Marie", "Lena",
        "Mila", "Clara", "Lea", "Ella", "Leonie", "Amelie", "Charlotte", "Sophie",
        "Helena", "Julia", "Laura", "Katharina", "Sarah", "Nora", "Victoria", "Johanna"
      ],
      surnames: [
        "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", 
        "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = "";
        passport += letters.charAt(Math.floor(Math.random() * letters.length));
        for (let i = 0; i < 8; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    France: {
      maleNames: [
        "Lucas", "Gabriel", "Léo", "Louis", "Raphaël", "Jules", "Adam", "Hugo", "Arthur",
        "Nathan", "Liam", "Ethan", "Paul", "Sacha", "Noah", "Thomas", "Mathis", "Théo",
        "Antoine", "Maxime", "Victor", "Alexandre", "Nicolas", "Baptiste", "Romain"
      ],
      femaleNames: [
        "Emma", "Jade", "Louise", "Alice", "Chloé", "Lina", "Léa", "Rose", "Anna",
        "Mila", "Julia", "Inès", "Camille", "Zoé", "Manon", "Sarah", "Lucie", "Clara",
        "Juliette", "Charlotte", "Margaux", "Mathilde", "Céline", "Audrey", "Elodie"
      ],
      surnames: [
        "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", 
        "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Leroy", "Roux"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = "";
        for (let i = 0; i < 2; i++) {
          passport += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 7; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    "United Kingdom": {
      maleNames: [
        "Oliver", "George", "Harry", "Noah", "Jack", "Charlie", "Leo", "Jacob", "Freddie",
        "Alfie", "Oscar", "Arthur", "Henry", "Thomas", "William", "James", "Edward",
        "Alexander", "Benjamin", "Daniel", "Samuel", "Joseph", "Max", "Isaac", "Dylan"
      ],
      femaleNames: [
        "Olivia", "Amelia", "Isla", "Ava", "Emily", "Isabella", "Mia", "Poppy", "Ella",
        "Lily", "Sophia", "Charlotte", "Grace", "Evie", "Sophie", "Florence", "Alice",
        "Jessica", "Lucy", "Scarlett", "Ruby", "Freya", "Phoebe", "Chloe", "Elizabeth"
      ],
      surnames: [
        "Smith", "Jones", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", 
        "Thomas", "Roberts", "Johnson", "Lewis", "Walker", "Robinson", "Wood"
      ],
      passportFormat: () => {
        const digits = "0123456789";
        let passport = "";
        for (let i = 0; i < 9; i++) {
          passport += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return passport;
      }
    },
    "United States": {
      maleNames: [
        "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph",
        "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark",
        "Donald", "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin", "Brian",
        "George", "Timothy"
      ],
      femaleNames: [
        "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan",
        "Jessica", "Sarah", "Karen", "Nancy", "Lisa", "Betty", "Margaret", "Sandra",
        "Ashley", "Dorothy", "Kimberly", "Emily", "Michelle", "Amanda", "Melissa",
        "Stephanie", "Rebecca", "Laura"
      ],
      surnames: [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
        "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris"
      ],
      passportFormat: () => {
        let passport = "";
        for (let i = 0; i < 9; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    Italy: {
      maleNames: [
        "Leonardo", "Francesco", "Alessandro", "Lorenzo", "Mattia", "Andrea", "Gabriele",
        "Matteo", "Tommaso", "Riccardo", "Edoardo", "Giuseppe", "Antonio", "Federico",
        "Marco", "Giovanni", "Pietro", "Nicola", "Davide", "Salvatore", "Paolo", "Luca",
        "Alberto", "Roberto", "Stefano"
      ],
      femaleNames: [
        "Sofia", "Aurora", "Giulia", "Emma", "Ginevra", "Alice", "Beatrice", "Anna",
        "Ludovica", "Victoria", "Chiara", "Martina", "Greta", "Gaia", "Camilla",
        "Valentina", "Francesca", "Elisa", "Laura", "Sara", "Alessia", "Elena",
        "Caterina", "Maria", "Viola"
      ],
      surnames: [
        "Rossi", "Ferrari", "Russo", "Bianchi", "Romano", "Gallo", "Costa", "Fontana",
        "Conti", "Esposito", "Ricci", "Bruno", "De Luca", "Moretti", "Marino"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = "";
        for (let i = 0; i < 2; i++) {
          passport += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 7; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    Brazil: {
      maleNames: [
        "Miguel", "Arthur", "Heitor", "Davi", "Lorenzo", "Théo", "Pedro", "Gabriel",
        "Bernardo", "Samuel", "João", "Lucas", "Felipe", "Gustavo", "Rafael", "Enzo",
        "Matheus", "Vicente", "Eduardo", "Vitor", "Daniel", "Henrique", "Murilo",
        "Leonardo", "Benício"
      ],
      femaleNames: [
        "Helena", "Alice", "Laura", "Manuela", "Sophia", "Isabella", "Valentina",
        "Heloísa", "Júlia", "Luiza", "Maria", "Cecília", "Eloá", "Giovanna", "Beatriz",
        "Ana", "Mariana", "Vitória", "Lara", "Lívia", "Clara", "Lorena", "Antonella",
        "Melissa", "Rafaela"
      ],
      surnames: [
        "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Lima", "Almeida", "Ferreira", 
        "Rodrigues", "Costa", "Gomes", "Martins", "Carvalho", "Araujo", "Melo"
      ],
      passportFormat: () => {
        let passport = "FD"; // Brazilian passports often start with FD
        for (let i = 0; i < 6; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    Australia: {
      maleNames: [
        "Oliver", "William", "Jack", "Noah", "Thomas", "Leo", "Henry", "Charlie",
        "James", "Liam", "Lucas", "Alexander", "Ethan", "Mason", "Harrison", "Xavier",
        "Hunter", "Archer", "Cooper", "Austin", "Phoenix", "Jordan", "Tyler", "Ryan",
        "Blake"
      ],
      femaleNames: [
        "Charlotte", "Olivia", "Ava", "Amelia", "Mia", "Isla", "Grace", "Sophia",
        "Chloe", "Emily", "Ella", "Zoe", "Ruby", "Lily", "Sophie", "Willow", "Ivy",
        "Hazel", "Audrey", "Lucy", "Sienna", "Georgia", "Aurora", "Maya", "Abigail"
      ],
      surnames: [
        "Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White", 
        "Martin", "Anderson", "Thompson", "Nguyen", "Lee", "Ryan", "Chen"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = letters.charAt(Math.floor(Math.random() * letters.length));
        for (let i = 0; i < 7; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    Morocco: {
      maleNames: [
        "Mohammed", "Youssef", "Adam", "Amine", "Omar", "Hamza", "Ali", "Ibrahim",
        "Ahmed", "Mehdi", "Karim", "Bilal", "Hassan", "Ismail", "Zakaria", "Amir",
        "Samir", "Nabil", "Rachid", "Jamal", "Tarik", "Younes", "Khalil", "Walid",
        "Mustafa"
      ],
      femaleNames: [
        "Fatima", "Maryam", "Sara", "Nour", "Amira", "Malak", "Lina", "Yasmine",
        "Aya", "Salma", "Layla", "Ghita", "Rim", "Imane", "Houda", "Aisha", "Samira",
        "Leila", "Kenza", "Naima", "Hafsa", "Asma", "Zineb", "Dounia", "Safae"
      ],
      surnames: [
        "Alami", "Idrissi", "Saidi", "Benjelloun", "Tazi", "Fassi", "Chraibi", "Bennani",
        "Berrada", "Amrani", "Tahiri", "Alaoui", "Belhaj", "Moussaoui", "Lahlou"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = "";
        for (let i = 0; i < 2; i++) {
          passport += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 7; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    Algeria: {
      maleNames: [
        "Mohamed", "Ahmed", "Youcef", "Abdelkader", "Karim", "Amine", "Sofiane", "Bilal",
        "Hamza", "Mourad", "Said", "Rachid", "Omar", "Malik", "Riad", "Nassim",
        "Farid", "Hakim", "Lotfi", "Nadir", "Salim", "Yazid", "Djamel", "Fethi",
        "Redouane"
      ],
      femaleNames: [
        "Amira", "Sarah", "Yasmine", "Meriem", "Lina", "Fatima", "Imane", "Sabrina",
        "Nadia", "Samira", "Leila", "Asma", "Karima", "Lamia", "Rania", "Dalila",
        "Farida", "Hakima", "Nabila", "Souad", "Wafa", "Djamila", "Fatiha", "Malika",
        "Safia"
      ],
      surnames: [
        "Bouaziz", "Benali", "Khelifi", "Bouzid", "Messaoudi", "Hamidi", "Saidi", "Benaissa",
        "Zerrouki", "Mansouri", "Boudjema", "Hadj", "Benchaabane", "Belkacem", "Meziane"
      ],
      passportFormat: () => {
        let passport = "";
        for (let i = 0; i < 9; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    },
    "South Africa": {
      maleNames: [
        "Lethabo", "Tumelo", "Thabo", "Sibusiso", "Bandile", "Themba", "Lungelo",
        "Nkosi", "Mandla", "Khaya", "Siyabonga", "Wandile", "Mpho", "Thabiso", "Jabu",
        "Blessing", "Bongani", "Dumisani", "Kabelo", "Katlego", "Lesego", "Mduduzi",
        "Nkosinathi", "Senzo", "Vusi"
      ],
      femaleNames: [
        "Nomvula", "Thandi", "Precious", "Nokuthula", "Zanele", "Lindiwe", "Thembi",
        "Nonhlanhla", "Busisiwe", "Ntombi", "Palesa", "Lerato", "Nomfundo", "Zandile",
        "Ayanda", "Bongiwe", "Dineo", "Khethiwe", "Lungile", "Mbali", "Nompumelelo",
        "Nosipho", "Siphokazi", "Thandeka", "Zodwa"
      ],
      surnames: [
        "Nkosi", "Ndlovu", "Khumalo", "Dlamini", "Sithole", "Mkhize", "Buthelezi", "Zulu",
        "Tshabalala", "Mahlangu", "Maseko", "Zwane", "Mabaso", "Ngcobo", "Mokoena"
      ],
      passportFormat: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let passport = "";
        for (let i = 0; i < 2; i++) {
          passport += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 7; i++) {
          passport += Math.floor(Math.random() * 10).toString();
        }
        return passport;
      }
    }
  },
  
  // List of available countries
  countries: [
    "Germany", "France", "United Kingdom", "United States", "Italy", 
    "Brazil", "Australia", "Morocco", "Algeria", "South Africa"
  ],
  
  // Spanish country name mappings for reference
  countryNamesSpanish: {
    'Germany': 'Alemania',
    'France': 'Francia',
    'United Kingdom': 'Reino Unido',
    'United States': 'Estados Unidos',
    'Italy': 'Italia',
    'Brazil': 'Brasil',
    'Australia': 'Australia',
    'Morocco': 'Marruecos',
    'Algeria': 'Argelia',
    'South Africa': 'Sudáfrica'
  },

  // Keep track of used birth dates to ensure uniqueness
  _usedBirthDates: new Set(),

  // Generate a random birth date between min and max ages
  // Default is between 18 and 80 years ago
  generateBirthDate(minAge = 18, maxAge = 80) {
    const today = new Date();
    
    // Ensure min and max ages are valid
    minAge = Math.max(18, Math.min(minAge, 100)); // Minimum 18, maximum 100
    maxAge = Math.max(minAge, Math.min(maxAge, 100)); // Ensure maxAge >= minAge
    
    // Calculate date ranges
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    
    let birthDate;
    let dateString;
    let attempts = 0;
    const maxAttempts = 10; // Reduced max attempts to match Set size limit
    
    // Keep generating until we find a unique date or reach max attempts
    do {
      const randomTimestamp = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
      birthDate = new Date(randomTimestamp);
      
      // Format as DD/MM/YYYY
      const day = birthDate.getDate().toString().padStart(2, '0');
      const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
      const year = birthDate.getFullYear();
      
      dateString = `${day}/${month}/${year}`;
      attempts++;
      
      // If we've tried too many times, clear the set of used dates
      if (attempts >= maxAttempts) {
        this._usedBirthDates.clear();
        attempts = 0;
      }
    } while (this._usedBirthDates.has(dateString) && attempts < maxAttempts);
    
    // Add the new date to our set of used dates
    this._usedBirthDates.add(dateString);
    
    // Clear the set after 10 entries to keep memory usage minimal
    if (this._usedBirthDates.size >= 10) {
      this._usedBirthDates.clear();
    }
    
    return dateString;
  },

  // Generate a complete profile
  generateProfile(gender = null, country = null, minAge = 18, maxAge = 80) {
    // If no gender specified, randomly choose one
    if (!gender) {
      gender = Math.random() < 0.5 ? 'Male' : 'Female';
    }
    
    // If no country specified, randomly choose one
    if (!country) {
      const countries = Object.keys(this.countryData);
      country = countries[Math.floor(Math.random() * countries.length)];
    }
    
    const countryData = this.countryData[country];
    if (!countryData) {
      console.error(`No data available for country: ${country}`);
      return null;
    }

    // Generate document number first to ensure it's ready
    const idNumber = countryData.passportFormat();
    
    // Generate name
    const names = gender === 'Male' ? countryData.maleNames : countryData.femaleNames;
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Generate surnames
    const surname1 = countryData.surnames[Math.floor(Math.random() * countryData.surnames.length)];
    
    // 30% chance of having a second surname
    const hasSecondSurname = Math.random() < 0.3;
    let surname2 = null;
    
    if (hasSecondSurname) {
      do {
        surname2 = countryData.surnames[Math.floor(Math.random() * countryData.surnames.length)];
      } while (surname2 === surname1);
    }

    // Generate birth date
    const birthDate = this.generateBirthDate(minAge, maxAge);
    
    // Create and return the complete profile with all fields pre-generated
    const profile = {
      name: name,
      firstSurname: surname1,
      secondSurname: surname2 || "",
      idType: 'Passport',
      idNumber: idNumber, // Use the pre-generated ID number
      birthDate: birthDate,
      gender: gender === 'Male' ? 'Hombre' : 'Mujer',
      nationality: country
    };

    // Return the complete profile
    return profile;
  }
};

// Export the generator for use in other scripts
window.DataGenerator = DataGenerator; 