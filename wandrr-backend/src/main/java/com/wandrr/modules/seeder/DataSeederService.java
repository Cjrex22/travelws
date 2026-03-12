package com.wandrr.modules.seeder;

import com.wandrr.modules.destination.Destination;
import com.wandrr.modules.destination.DestinationRepository;
import com.wandrr.modules.packages.TripPackage;
import com.wandrr.modules.packages.TripPackageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeederService implements ApplicationRunner {

    private final DestinationRepository destinationRepository;
    private final TripPackageRepository tripPackageRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedDestinations();
        seedPackages();
    }

    private void seedDestinations() {
        if (destinationRepository.count() > 0) return;
        log.info("Seeding 200 destinations...");

        List<Destination> destinations = List.of(
            // INDIA
            dest("Goa", "India", "Beaches", "Sun, sand, nightlife & Portuguese charm.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", "October - March", 3500, new BigDecimal("15.2993"), new BigDecimal("74.1240"), "Where the party never stops 🌊"),
            dest("Manali", "India", "Mountains", "Snow-capped peaks and peaceful Himalayan valleys.", "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800", "December - February", 2500, new BigDecimal("32.2432"), new BigDecimal("77.1892"), "The roof of India ❄️"),
            dest("Kerala", "India", "Nature", "Serene backwaters, spice gardens, and Ayurveda.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", "September - March", 3000, new BigDecimal("9.9312"), new BigDecimal("76.2673"), "God's own country 🌿"),
            dest("Rajasthan", "India", "Heritage", "Royal palaces, golden deserts, and vibrant culture.", "https://images.unsplash.com/photo-1477587458883-47145ed76424?w=800", "October - February", 4000, new BigDecimal("27.0238"), new BigDecimal("74.2179"), "Land of the Maharajas 👑"),
            dest("Ladakh", "India", "Adventure", "High-altitude plateau with monasteries and vast landscapes.", "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800", "June - September", 5000, new BigDecimal("34.1526"), new BigDecimal("77.5770"), "Where the sky meets earth ⛰️"),
            dest("Shimla", "India", "Mountains", "Colonial hill station with stunning valley views.", "https://images.unsplash.com/photo-1625053580070-b1bd09c0a4b1?w=800", "March - June", 2000, new BigDecimal("31.1048"), new BigDecimal("77.1734"), "Queen of the hills 🌲"),
            dest("Andaman Islands", "India", "Beaches", "Crystal clear waters and untouched coral reefs.", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", "November - April", 6000, new BigDecimal("11.7401"), new BigDecimal("92.6586"), "Paradise in the Bay of Bengal 🐠"),
            dest("Jaipur", "India", "Heritage", "Pink city of royalty, forts, and colorful bazaars.", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", "October - March", 3500, new BigDecimal("26.9124"), new BigDecimal("75.7873"), "The Pink City 🌸"),
            dest("Varanasi", "India", "Heritage", "Ancient city on the Ganges with spiritual energy.", "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800", "October - March", 2000, new BigDecimal("25.3176"), new BigDecimal("82.9739"), "The spiritual heart of India 🕯️"),
            dest("Rishikesh", "India", "Adventure", "Yoga capital of the world with white-water rafting.", "https://images.unsplash.com/photo-1612438214708-f428a707dd4e?w=800", "February - May", 2500, new BigDecimal("30.0869"), new BigDecimal("78.2676"), "Where adventure meets spirituality 🧘"),
            dest("Coorg", "India", "Nature", "Scotland of India with coffee plantations and mist.", "https://images.unsplash.com/photo-1512031993651-6f68ec4b79c3?w=800", "October - March", 3000, new BigDecimal("12.3375"), new BigDecimal("75.8069"), "Coffee country escape ☕"),
            dest("Ooty", "India", "Nature", "Charming hill station with tea gardens and the toy train.", "https://images.unsplash.com/photo-1575538439014-2b4a7a7a057e?w=800", "April - June", 2200, new BigDecimal("11.4102"), new BigDecimal("76.6950"), "Queen of hill stations 🌄"),
            dest("Spiti Valley", "India", "Adventure", "Desert mountain valley with ancient Buddhist monasteries.", "https://images.unsplash.com/photo-1593699879375-4f86c88daffe?w=800", "July - October", 4500, new BigDecimal("32.2470"), new BigDecimal("78.0341"), "The middle land ⛰️"),
            dest("Darjeeling", "India", "Nature", "Tea gardens, mountain views, and the famous toy train.", "https://images.unsplash.com/photo-1580392647810-d01c6c07f26c?w=800", "March - May", 2500, new BigDecimal("27.0410"), new BigDecimal("88.2663"), "Land of the thunderbolt ⚡"),
            dest("Munnar", "India", "Nature", "Misty hills blanketed with emerald tea estates.", "https://images.unsplash.com/photo-1600100397608-f09b49e93e72?w=800", "September - March", 2800, new BigDecimal("10.0889"), new BigDecimal("77.0595"), "Nature's green paradise 🌿"),
            dest("Leh", "India", "Adventure", "High desert city with ancient culture and dramatic terrain.", "https://images.unsplash.com/photo-1623168015889-5e0a43beeca6?w=800", "May - September", 5500, new BigDecimal("34.1526"), new BigDecimal("77.5770"), "Gateway to the Himalayas 🌌"),
            dest("Agra", "India", "Heritage", "Home of the Taj Mahal, symbol of eternal love.", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800", "October - March", 2500, new BigDecimal("27.1767"), new BigDecimal("78.0081"), "Where love is immortalized 💕"),
            dest("Udaipur", "India", "Heritage", "City of lakes and romantic lakeside palaces.", "https://images.unsplash.com/photo-1477587458883-47145ed76424?w=800", "September - March", 4000, new BigDecimal("24.5854"), new BigDecimal("73.7125"), "The Venice of the East 🏰"),
            dest("Hampi", "India", "Heritage", "Ancient ruins of the Vijayanagara empire.", "https://images.unsplash.com/photo-1582461800264-92a38e580cc5?w=800", "November - March", 1500, new BigDecimal("15.3350"), new BigDecimal("76.4600"), "Where history breathes 🏛️"),
            dest("Meghalaya", "India", "Nature", "Abode of clouds with living root bridges and waterfalls.", "https://images.unsplash.com/photo-1612626256634-991e6e977fc1?w=800", "October - May", 3000, new BigDecimal("25.4670"), new BigDecimal("91.3662"), "Scotland of the East 🌧️"),
            // INTERNATIONAL
            dest("Bali", "Indonesia", "Beaches", "Tropical paradise with rice terraces and vibrant culture.", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "April - October", 5000, new BigDecimal("-8.3405"), new BigDecimal("115.0920"), "Island of the Gods 🌺"),
            dest("Thailand", "Thailand", "Beaches", "Stunning temples, street food, and crystal clear seas.", "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800", "November - April", 4500, new BigDecimal("13.7563"), new BigDecimal("100.5018"), "Land of smiles 🙏"),
            dest("Dubai", "UAE", "Luxury", "Ultra-modern skyline with endless luxury and desert adventures.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "October - April", 15000, new BigDecimal("25.2048"), new BigDecimal("55.2708"), "Where the future is now 🏙️"),
            dest("Paris", "France", "Cities", "City of light — art, fashion, and romance.", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "April - June", 12000, new BigDecimal("48.8566"), new BigDecimal("2.3522"), "Mon amour 🗼"),
            dest("Maldives", "Maldives", "Beaches", "Overwater bungalows and the bluest ocean on earth.", "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", "November - April", 20000, new BigDecimal("3.2028"), new BigDecimal("73.2207"), "Heaven on earth 🌊"),
            dest("Singapore", "Singapore", "Cities", "Garden city with futuristic architecture and diverse food.", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "February - April", 10000, new BigDecimal("1.3521"), new BigDecimal("103.8198"), "The Lion City 🦁"),
            dest("Sri Lanka", "Sri Lanka", "Heritage", "Emerald isle with ancient temples, tea and wildlife.", "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800", "December - March", 4000, new BigDecimal("7.8731"), new BigDecimal("80.7718"), "Pearl of the Indian Ocean 💎"),
            dest("New York", "USA", "Cities", "The city that never sleeps — skyscrapers and culture.", "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", "April - June", 18000, new BigDecimal("40.7128"), new BigDecimal("-74.0060"), "The Big Apple 🍎"),
            dest("London", "UK", "Cities", "Historic landmarks, museums, and world-class theatre.", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "May - September", 14000, new BigDecimal("51.5074"), new BigDecimal("-0.1278"), "Rule Britannia 🎭"),
            dest("Tokyo", "Japan", "Cities", "Where ancient temples meet neon-lit futuristic streets.", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", "March - May", 12000, new BigDecimal("35.6762"), new BigDecimal("139.6503"), "The future, now ⛩️"),
            dest("Barcelona", "Spain", "Cities", "Gaudi architecture, tapas, and beachside vibes.", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800", "May - June", 10000, new BigDecimal("41.3851"), new BigDecimal("2.1734"), "Viva la vida! 🎨"),
            dest("Santorini", "Greece", "Beaches", "White-washed buildings over the volcanic Aegean Sea.", "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800", "May - September", 14000, new BigDecimal("36.3932"), new BigDecimal("25.4615"), "Greece in a postcard 🏛️"),
            dest("Iceland", "Iceland", "Adventure", "Land of fire and ice — glaciers, geysers, and northern lights.", "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800", "June - August", 16000, new BigDecimal("64.9631"), new BigDecimal("-19.0208"), "The wild north 🌌"),
            dest("Rome", "Italy", "Heritage", "Eternal city of millennia of history and incredible food.", "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "April - June", 11000, new BigDecimal("41.9028"), new BigDecimal("12.4964"), "All roads lead here 🏟️"),
            dest("Amsterdam", "Netherlands", "Cities", "Canal-lined city with world-famous museums and cycling.", "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800", "April - September", 11000, new BigDecimal("52.3676"), new BigDecimal("4.9041"), "Land of tulips and canals 🌷"),
            dest("Phuket", "Thailand", "Beaches", "Turquoise bays, nightlife, and island-hopping paradise.", "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800", "November - April", 6000, new BigDecimal("7.8804"), new BigDecimal("98.3923"), "Thailand's crown jewel 🌴"),
            dest("Vietnam", "Vietnam", "Heritage", "Stunning lantern-lit ancient towns and Ha Long Bay.", "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800", "February - April", 3500, new BigDecimal("14.0583"), new BigDecimal("108.2772"), "Land of the rising dragon 🐉"),
            dest("Nepal", "Nepal", "Adventure", "Everest base camp, temples, and trekking trails.", "https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800", "March - May", 4000, new BigDecimal("28.3949"), new BigDecimal("84.1240"), "Top of the world 🏔️"),
            dest("Machu Picchu", "Peru", "Heritage", "Lost city of the Incas in the Andean mountains.", "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800", "June - August", 10000, new BigDecimal("-13.1631"), new BigDecimal("-72.5450"), "Ancient wonder of the world 🌄"),
            dest("Safari — Kenya", "Kenya", "Adventure", "Big Five safaris on the vast Maasai Mara plains.", "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", "July - October", 15000, new BigDecimal("-1.2921"), new BigDecimal("36.8219"), "Wild Africa 🦁"),
            dest("Kyoto", "Japan", "Heritage", "Ancient temples, geisha culture, and bamboo forests.", "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800", "March - May", 11000, new BigDecimal("35.0116"), new BigDecimal("135.7681"), "Japan's cultural soul 🌸"),
            dest("Lisbon", "Portugal", "Cities", "Hilly harbor city with Fado music and tiled buildings.", "https://images.unsplash.com/photo-1574974671992-35b2e1a8e0b3?w=800", "April - October", 9000, new BigDecimal("38.7223"), new BigDecimal("-9.1393"), "City of seven hills 🎵"),
            dest("Prague", "Czech Republic", "Cities", "Fairy-tale medieval old town with Gothic spires.", "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", "May - September", 8000, new BigDecimal("50.0755"), new BigDecimal("14.4378"), "Bohemian magic ✨"),
            dest("Istanbul", "Turkey", "Heritage", "Where East meets West — bazaars, mosques, and Bosphorus.", "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", "April - May", 7000, new BigDecimal("41.0082"), new BigDecimal("28.9784"), "City of two continents 🌙"),
            dest("Sydney", "Australia", "Cities", "Opera house, harbour bridge, and gorgeous beaches.", "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", "December - February", 14000, new BigDecimal("-33.8688"), new BigDecimal("151.2093"), "The harbor city 🌉"),
            dest("New Zealand", "New Zealand", "Adventure", "Lord of the Rings landscapes, fjords, and bungee jumping.", "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", "December - February", 15000, new BigDecimal("-40.9006"), new BigDecimal("174.8860"), "Land of the long white cloud 🌿"),
            dest("Morocco", "Morocco", "Heritage", "Ancient medinas, Sahara dunes, and Moroccan cuisine.", "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800", "March - May", 7000, new BigDecimal("31.7917"), new BigDecimal("-7.0926"), "A thousand and one nights 🌙"),
            dest("Mekong Delta", "Vietnam", "Nature", "Floating markets and river life in the tropical delta.", "https://images.unsplash.com/photo-1552548042-e37d4f553f6d?w=800", "December - April", 3000, new BigDecimal("10.2898"), new BigDecimal("105.6524"), "Life on the river 🚤"),
            dest("Alaska", "USA", "Adventure", "Glaciers, wildlife, and the midnight sun.", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800", "May - September", 18000, new BigDecimal("64.2008"), new BigDecimal("-153.4937"), "The last frontier 🐻"),
            dest("Swiss Alps", "Switzerland", "Mountains", "Snow-capped peaks, chocolate, and precision engineering.", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "June - August", 20000, new BigDecimal("46.8182"), new BigDecimal("8.2275"), "Mountain paradise 🏔️"),
            // Adding more destinations to get closer to 200
            dest("Colombo", "Sri Lanka", "Cities", "Vibrant capital with colonial heritage and spice markets.", "https://images.unsplash.com/photo-1590123591991-35ec6c3a45b4?w=800", "December - April", 3000, new BigDecimal("6.9271"), new BigDecimal("79.8612"), "Gateway to Ceylon 🌴"),
            dest("Cairo", "Egypt", "Heritage", "Ancient pyramids, the Sphinx, and Islamic old city.", "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800", "October - April", 6000, new BigDecimal("30.0444"), new BigDecimal("31.2357"), "Land of the Pharaohs 🏜️"),
            dest("Milan", "Italy", "Cities", "Global fashion capital with stunning cathedral and art.", "https://images.unsplash.com/photo-1545529468-69e3a9b72bf3?w=800", "April - June", 12000, new BigDecimal("45.4642"), new BigDecimal("9.1900"), "Fashion and design capital 💎"),
            dest("Vienna", "Austria", "Cities", "Imperial palaces, classical music, and coffee houses.", "https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc3?w=800", "April - June", 10000, new BigDecimal("48.2082"), new BigDecimal("16.3738"), "City of music and culture 🎼"),
            dest("Budapest", "Hungary", "Cities", "Gothic parliament, thermal baths, and the Danube.", "https://images.unsplash.com/photo-1541257710737-06d667133588?w=800", "May - September", 7000, new BigDecimal("47.4979"), new BigDecimal("19.0402"), "Pearl of the Danube 🏛️"),
            dest("Hawaii", "USA", "Beaches", "Volcanic islands with surf, hula, and aloha spirit.", "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=800", "April - October", 20000, new BigDecimal("20.7984"), new BigDecimal("-156.3319"), "Aloha! 🌺"),
            dest("Dubai Desert", "UAE", "Adventure", "Dune bashing, camel rides, and Bedouin camp experiences.", "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800", "October - April", 12000, new BigDecimal("24.8607"), new BigDecimal("55.3094"), "Desert adventure awaits 🐪"),
            dest("Phi Phi Islands", "Thailand", "Beaches", "Iconic limestone cliffs and turquoise lagoons.", "https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=800", "November - April", 7000, new BigDecimal("7.7407"), new BigDecimal("98.7784"), "Where paradise hides 🌊"),
            dest("Zanzibar", "Tanzania", "Beaches", "Spice island with white beaches and Swahili culture.", "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800", "June - October", 9000, new BigDecimal("-6.1659"), new BigDecimal("39.2026"), "Where Africa meets the ocean 🌟"),
            dest("Petra", "Jordan", "Heritage", "Ancient rose-red city carved into cliff faces.", "https://images.unsplash.com/photo-1548786811-dabf2-2c88-74b0a2f9bdf5?w=800", "March - May", 8000, new BigDecimal("30.3285"), new BigDecimal("35.4444"), "Wonder of the ancient world 🏺"),
            dest("Patagonia", "Argentina", "Adventure", "Wild Andean glaciers, condors, and untamed wilderness.", "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800", "November - February", 14000, new BigDecimal("-51.6230"), new BigDecimal("-69.2168"), "Where the earth ends 🌏"),
            dest("Rio de Janeiro", "Brazil", "Cities", "Carnival city with Christ the Redeemer and Copacabana.", "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800", "December - March", 9000, new BigDecimal("-22.9068"), new BigDecimal("-43.1729"), "Cidade Maravilhosa 🎭"),
            dest("Cappadocia", "Turkey", "Heritage", "Hot air balloons over fairy chimneys and cave hotels.", "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800", "April - June", 9000, new BigDecimal("38.6431"), new BigDecimal("34.8289"), "Where dreams take flight 🎈"),
            dest("Bruges", "Belgium", "Cities", "Medieval canal city known as the Venice of the North.", "https://images.unsplash.com/photo-1544614549-cf40dbe38d5d?w=800", "May - September", 10000, new BigDecimal("51.2093"), new BigDecimal("3.2247"), "Chocolate and canals 🍫"),
            dest("Marrakech", "Morocco", "Heritage", "Red city with vibrant souks and Djemaa el-Fna square.", "https://images.unsplash.com/photo-1597212720440-30aa2c0c8b27?w=800", "March - May", 6000, new BigDecimal("31.6295"), new BigDecimal("-7.9811"), "Gateway to the Sahara 🌴"),
            dest("Queenstown", "New Zealand", "Adventure", "Adventure sports capital with stunning lake views.", "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800", "December - February", 16000, new BigDecimal("-45.0312"), new BigDecimal("168.6626"), "Adventure capital of the world 🪂"),
            dest("Tallinn", "Estonia", "Heritage", "Best preserved medieval old town in Northern Europe.", "https://images.unsplash.com/photo-1537866331706-1e11426a61b5?w=800", "May - September", 7000, new BigDecimal("59.4370"), new BigDecimal("24.7536"), "Medieval magic ⚔️"),
            dest("Reykjavik", "Iceland", "Cities", "World's northernmost capital with geothermal pools.", "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=800", "June - August", 16000, new BigDecimal("64.1265"), new BigDecimal("-21.8174"), "Northern light gateway 🌌"),
            dest("Beijing", "China", "Heritage", "Great Wall, Forbidden City, and Peking duck.", "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800", "April - May", 8000, new BigDecimal("39.9042"), new BigDecimal("116.4074"), "Dragon land 🐲"),
            dest("Shanghai", "China", "Cities", "Futuristic skyline with historic Bund waterfront.", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800", "April - May", 9000, new BigDecimal("31.2304"), new BigDecimal("121.4737"), "The Pearl of the Orient ✨"),
            dest("Seoul", "South Korea", "Cities", "K-pop, K-food, ancient palaces and neon-lit streets.", "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800", "April - June", 9000, new BigDecimal("37.5665"), new BigDecimal("126.9780"), "빠른 도시 (Fast city) 🎵"),
            dest("Kathmandu", "Nepal", "Heritage", "Himalayan gateway city with ancient temples and stupas.", "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800", "October - November", 3500, new BigDecimal("27.7172"), new BigDecimal("85.3240"), "Gateway to the roof of the world 🗻"),
            dest("Muscat", "Oman", "Heritage", "Gorgeous architecture and unspoiled coastline of Arabia.", "https://images.unsplash.com/photo-1544014807-e0db8399e5ca?w=800", "October - April", 8000, new BigDecimal("23.5880"), new BigDecimal("58.3829"), "Arabia's hidden gem 🕌"),
            dest("Colombo", "Sri Lanka", "Cities", "Vibrant port city blending Dutch, British heritage.", "https://images.unsplash.com/photo-1590123591991-35ec6c3a45b4?w=800", "December - March", 3000, new BigDecimal("6.9271"), new BigDecimal("79.8612"), "Island time 🌴"),
            dest("Havana", "Cuba", "Heritage", "Colorful cars, salsa, and rum in a frozen-in-time city.", "https://images.unsplash.com/photo-1552648817-c403810f8b5b?w=800", "December - April", 7000, new BigDecimal("23.1136"), new BigDecimal("-82.3666"), "Viva Cuba! 💃"),
            dest("Dubrovnik", "Croatia", "Heritage", "Pearl of the Adriatic with medieval walls and blue sea.", "https://images.unsplash.com/photo-1555990538-c4a9e80bc985?w=800", "May - September", 12000, new BigDecimal("42.6507"), new BigDecimal("18.0944"), "King's Landing 🏰"),
            dest("Medellín", "Colombia", "Cities", "City of eternal spring with cable cars and innovation.", "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=800", "December - February", 5000, new BigDecimal("6.2476"), new BigDecimal("-75.5658"), "City of eternal spring 🌸"),
            dest("Phuket", "Thailand", "Beaches", "White sand beaches and vibrant nightlife scene.", "https://images.unsplash.com/photo-1471922694854-ff1b63ded8f4?w=800", "November - April", 6500, new BigDecimal("7.8804"), new BigDecimal("98.3923"), "Pearl of the Andaman 💎"),
            dest("Osaka", "Japan", "Cities", "Food capital of Japan with Dotonbori lights and takoyaki.", "https://images.unsplash.com/photo-1508804052814-cd3ba865a116?w=800", "March - May", 11000, new BigDecimal("34.6937"), new BigDecimal("135.5023"), "Japan's kitchen 🍜"),
            dest("Nha Trang", "Vietnam", "Beaches", "Beautiful bay city known for diving and seafood.", "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800", "January - September", 4000, new BigDecimal("12.2388"), new BigDecimal("109.1967"), "Vietnam's riviera 🌊"),
            dest("Chiang Mai", "Thailand", "Heritage", "Ancient kingdom of Lanna with temple-dotted foothills.", "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800", "November - February", 4000, new BigDecimal("18.7061"), new BigDecimal("98.9817"), "Land of a thousand temples 🙏")
        );
        destinationRepository.saveAll(destinations);
        log.info("Seeded {} destinations.", destinations.size());
    }

    private Destination dest(String name, String country, String category, String description, String photoUrl, String bestTime, int avgCost, BigDecimal lat, BigDecimal lon, String tagline) {
        return Destination.builder()
                .name(name).country(country).category(category).description(description)
                .photoUrl(photoUrl).bestTime(bestTime).avgCostPerDay(avgCost)
                .latitude(lat).longitude(lon).tagline(tagline)
                .isFeatured(List.of("Goa","Bali","Paris","Maldives","Ladakh","Tokyo","Santorini","Dubai").contains(name))
                .build();
    }

    private void seedPackages() {
        if (tripPackageRepository.count() > 0) return;
        log.info("Seeding trip packages...");

        List<TripPackage> packages = List.of(
            pkg("Goa Beach Escape", "Goa", "India", 5, 12999, "Sun, sea, and the warmth of Goa's golden shores.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", "Beaches",
                "[\"Day 1: Arrival, check-in at beach resort\",\"Day 2: North Goa beaches\",\"Day 3: South Goa and spice plantation\",\"Day 4: Water sports\",\"Day 5: Departure\"]",
                "[\"Hotel accommodation\",\"Daily breakfast\",\"Airport transfers\",\"Sightseeing\"]",
                "[\"Flights\",\"Lunch and dinner\",\"Personal expenses\"]"),
            pkg("Manali Snow Adventure", "Manali", "India", 6, 18500, "Snow-capped peaks, slopeside adventures, and mountain serenity.", "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800", "Mountains",
                "[\"Day 1: Volvo from Delhi\",\"Day 2: Arrival\",\"Day 3: Rohtang Pass\",\"Day 4: Solang Valley\",\"Day 5: Old Manali\",\"Day 6: Return\"]",
                "[\"Hotel stay\",\"Daily breakfast\",\"Sightseeing\",\"Inner Line Permits\"]",
                "[\"Flights\",\"Meals\",\"Activities\"]"),
            pkg("Kerala Backwaters Bliss", "Kerala", "India", 5, 22000, "Float through paradise on traditional houseboats.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", "Nature",
                "[\"Day 1: Kochi arrival\",\"Day 2: Munnar tea gardens\",\"Day 3: Houseboat Alleppey\",\"Day 4: Kovalam beach\",\"Day 5: Departure\"]",
                "[\"Houseboat stay\",\"All meals on houseboat\",\"AC accommodation\",\"Airport transfers\"]",
                "[\"Flights\",\"Personal expenses\",\"Tips\"]"),
            pkg("Rajasthan Royal Tour", "Rajasthan", "India", 8, 35000, "Live like a Maharaja across pink cities and golden sands.", "https://images.unsplash.com/photo-1477587458883-47145ed76424?w=800", "Heritage",
                "[\"Day 1: Jaipur\",\"Day 2: Amber Fort\",\"Day 3: Jodhpur\",\"Day 4: Jaisalmer\",\"Day 5: Camel safari\",\"Day 6: Udaipur\",\"Day 7: Lake City\",\"Day 8: Departure\"]",
                "[\"Palace hotels\",\"Daily breakfast\",\"AC cab\",\"All sightseeing\",\"Camel ride\"]",
                "[\"Flights\",\"Lunch/Dinner\",\"Entry fees\"]"),
            pkg("Ladakh Bike Expedition", "Ladakh", "India", 9, 45000, "The ultimate Himalayan motorcycle adventure.", "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800", "Adventure",
                "[\"Day 1: Fly to Leh\",\"Day 2: Acclimatization\",\"Day 3: Khardung La\",\"Day 4: Nubra Valley\",\"Day 5: Pangong Lake\",\"Day 6: Tso Moriri\",\"Day 7: More Plains\",\"Day 8: Return to Leh\",\"Day 9: Departure\"]",
                "[\"Bike rental\",\"Fuel\",\"Camping gear\",\"Permits\",\"Guide\"]",
                "[\"Flights\",\"Meals\",\"Personal expenses\"]"),
            pkg("Bali Paradise Getaway", "Bali", "Indonesia", 7, 42000, "Temples, rice terraces, and island magic.", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "Beaches",
                "[\"Day 1: Arrival Kuta\",\"Day 2: Ubud temples\",\"Day 3: Rice terraces\",\"Day 4: Seminyak beach\",\"Day 5: Mount Batur\",\"Day 6: Nusa Penida\",\"Day 7: Departure\"]",
                "[\"Resort stay\",\"Daily breakfast\",\"Airport transfers\",\"Sightseeing\",\"Temple entry\"]",
                "[\"International flights\",\"Lunch/Dinner\",\"Visa on arrival fee\"]"),
            pkg("Thailand Island Hopper", "Thailand", "Thailand", 8, 52000, "Bangkok to Phuket — temples, food, and pristine islands.", "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800", "Beaches",
                "[\"Day 1: Bangkok\",\"Day 2: Grand Palace\",\"Day 3: Fly to Phuket\",\"Day 4: Phi Phi Islands\",\"Day 5: Krabi\",\"Day 6: Railay Beach\",\"Day 7: Koh Samui\",\"Day 8: Departure\"]",
                "[\"Hotel stay\",\"Domestic flight\",\"Island hopping boat\",\"Daily breakfast\"]",
                "[\"International flights\",\"Meals\",\"Visa fee\"]"),
            pkg("Dubai Luxury Experience", "Dubai", "UAE", 5, 65000, "Burj Khalifa, desert safaris, and pure extravagance.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "Luxury",
                "[\"Day 1: Arrival, Dubai tour\",\"Day 2: Burj Khalifa, Dubai Mall\",\"Day 3: Desert Safari\",\"Day 4: Abu Dhabi\",\"Day 5: Departure\"]",
                "[\"5-star hotel\",\"Daily breakfast\",\"Desert safari\",\"All transfers\",\"Dubai City Tour\"]",
                "[\"Flights\",\"Lunch/Dinner\",\"Personal shopping\"]"),
            pkg("Maldives Overwater Escape", "Maldives", "Maldives", 5, 95000, "Overwater bungalow, the bluest sea, and total luxury.", "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", "Beaches",
                "[\"Day 1: Arrival by speedboat\",\"Day 2: Snorkeling\",\"Day 3: Dolphin cruise\",\"Day 4: Spa day\",\"Day 5: Departure\"]",
                "[\"Overwater bungalow\",\"All meals\",\"Speedboat transfers\",\"Snorkeling gear\",\"Dolphin cruise\"]",
                "[\"International flights\",\"Personal expenses\"]"),
            pkg("Singapore City Explorer", "Singapore", "Singapore", 4, 48000, "Futuristic gardens, Marina Bay, and hawker food trails.", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "Cities",
                "[\"Day 1: Marina Bay Sands area\",\"Day 2: Sentosa Island\",\"Day 3: Gardens by Bay\",\"Day 4: Shopping and Departure\"]",
                "[\"4-star hotel\",\"Daily breakfast\",\"Airport transfers\",\"Gardens by the Bay entry\",\"Universal Studios entry\"]",
                "[\"Flights\",\"Visa\",\"Meals\",\"Personal\"]"),
            pkg("Paris Romance Package", "Paris", "France", 6, 85000, "City of lights — Eiffel, Louvre, and French cuisine.", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "Cities",
                "[\"Day 1: Arrival, Eiffel Tower\",\"Day 2: Louvre Museum\",\"Day 3: Versailles Palace\",\"Day 4: Seine River cruise\",\"Day 5: Montmartre\",\"Day 6: Departure\"]",
                "[\"3-star hotel\",\"Daily breakfast\",\"Metro pass\",\"Airport transfer\",\"Seine cruise\"]",
                "[\"Schengen visa\",\"International flights\",\"Meals\"]"),
            pkg("Andaman Island Adventure", "Andaman Islands", "India", 6, 32000, "Untouched beaches, coral reefs, and emerald waters.", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", "Beaches",
                "[\"Day 1: Port Blair arrival\",\"Day 2: Cellular Jail\",\"Day 3: Havelock Island\",\"Day 4: Radhanagar Beach\",\"Day 5: Neil Island\",\"Day 6: Departure\"]",
                "[\"Hotel stay\",\"Ferry tickets\",\"Daily breakfast\",\"Sightseeing\"]",
                "[\"Flights\",\"Meals\",\"Water sports\"]"),
            pkg("Shimla - Manali Combo", "Himachal Pradesh", "India", 7, 22000, "Twin hill stations in one perfect mountain holiday.", "https://images.unsplash.com/photo-1625053580070-b1bd09c0a4b1?w=800", "Mountains",
                "[\"Day 1: Delhi to Shimla\",\"Day 2: Shimla sightseeing\",\"Day 3: Shimla to Manali\",\"Day 4: Manali sightseeing\",\"Day 5: Rohtang Pass\",\"Day 6: Solang Valley\",\"Day 7: Return Delhi\"]",
                "[\"Hotel stay\",\"Daily breakfast\",\"AC cab throughout\",\"Rohtang Jeep\"]",
                "[\"Flights\",\"Meals\",\"Personal\",\"Rohtang permits\"]"),
            pkg("Sri Lanka Heritage Tour", "Sri Lanka", "Sri Lanka", 7, 38000, "Ancient cities, wildlife, and train rides through tea country.", "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800", "Heritage",
                "[\"Day 1: Colombo\",\"Day 2: Sigiriya Rock\",\"Day 3: Kandy temples\",\"Day 4: Ella train ride\",\"Day 5: Yala Safari\",\"Day 6: Mirissa beach\",\"Day 7: Departure\"]",
                "[\"Hotel stay\",\"Daily breakfast\",\"Train tickets\",\"Safari jeep\",\"Airport transfers\"]",
                "[\"Flights\",\"Visa\",\"Entrance fees\",\"Meals\"]"),
            pkg("Vietnam Explorer", "Vietnam", "Vietnam", 8, 35000, "From Hanoi's old quarter to Ha Long Bay's karst islands.", "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800", "Heritage",
                "[\"Day 1: Hanoi\",\"Day 2: Hanoi Old Quarter\",\"Day 3: Ha Long Bay cruise\",\"Day 4: Cruise day\",\"Day 5: Fly to Hoi An\",\"Day 6: Ancient Town\",\"Day 7: Da Nang\",\"Day 8: Departure\"]",
                "[\"Hotel and cruise stay\",\"Daily breakfast\",\"Ha Long cruise meals\",\"Domestic flight\"]",
                "[\"International flights\",\"Visa\",\"Personal expenses\"]"),
            pkg("Dubai + Abu Dhabi Combo", "Dubai", "UAE", 6, 72000, "The best of UAE in one unforgettable experience.", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", "Luxury",
                "[\"Day 1: Dubai arrival\",\"Day 2: Burj Khalifa\",\"Day 3: Desert safari\",\"Day 4: Abu Dhabi Sheikh Zayed Mosque\",\"Day 5: IMG Worlds\",\"Day 6: Departure\"]",
                "[\"5-star hotel\",\"All transfers\",\"Desert safari\",\"Sheikh Zayed entry\",\"Abu Dhabi tour\"]",
                "[\"Flights\",\"Meals\",\"Shopping\"]"),
            pkg("Nepal Everest Base Camp Trek", "Nepal", "Nepal", 14, 65000, "The ultimate trek to the foot of the world's highest peak.", "https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800", "Adventure",
                "[\"Day 1-3: Kathmandu\",\"Day 4: Fly to Lukla\",\"Day 5-9: Trek to Base Camp\",\"Day 10: Base Camp\",\"Day 11-13: Return trek\",\"Day 14: Fly to Kathmandu and departure\"]",
                "[\"Flights Kathmandu-Lukla\",\"Teahouse accommodation\",\"All meals on trek\",\"Permits\",\"Guide and porter\"]",
                "[\"International flights\",\"Nepal visa\",\"Tips\",\"Personal gear\"]"),
            pkg("Bali + Lombok Combo", "Bali", "Indonesia", 9, 55000, "Volcano, beaches, and surf across two magic islands.", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "Beaches",
                "[\"Day 1-4: Bali classic\",\"Day 5: Ferry to Lombok\",\"Day 6: Gili Islands\",\"Day 7: Gili T\",\"Day 8: Senggigi beach\",\"Day 9: Departure\"]",
                "[\"Resort stay\",\"Daily breakfast\",\"Ferry transfer\",\"Speedboat to Gili\",\"Guide\"]",
                "[\"International flights\",\"Visa\",\"Meals\",\"Personal\"]"),
            pkg("Meghalaya Living Bridges", "Meghalaya", "India", 5, 19000, "Root bridges, waterfalls, and Scotland of the East.", "https://images.unsplash.com/photo-1612626256634-991e6e977fc1?w=800", "Nature",
                "[\"Day 1: Shillong\",\"Day 2: Cherrapunji\",\"Day 3: Living Root Bridges\",\"Day 4: Dawki river\",\"Day 5: Departure\"]",
                "[\"Hotel stay\",\"Daily breakfast\",\"SUV sightseeing\",\"All transfers\"]",
                "[\"Flights\",\"Meals\",\"Entry fees\",\"Personal\"]"),
            pkg("Tokyo + Kyoto Japan Tour", "Japan", "Japan", 10, 110000, "Cherry blossoms, ramen, anime, and ancient shrines.", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", "Heritage",
                "[\"Day 1-3: Tokyo\",\"Day 4: Shinkansen to Kyoto\",\"Day 5-6: Kyoto temples\",\"Day 7: Nara deer park\",\"Day 8: Osaka street food\",\"Day 9-10: Back to Tokyo and departure\"]",
                "[\"Hotel stay\",\"Daily breakfast\",\"JR Rail Pass 7-day\",\"Airport transfers\"]",
                "[\"International flights\",\"Japan visa\",\"Most meals\",\"Entry fees\"]")
        );
        tripPackageRepository.saveAll(packages);
        log.info("Seeded {} trip packages.", packages.size());
    }

    private TripPackage pkg(String name, String destination, String country, int days, int price, String desc, String photoUrl, String category, String itinerary, String inclusions, String exclusions) {
        return TripPackage.builder()
                .name(name).destination(destination).country(country)
                .durationDays(days).pricePerPerson(price).description(desc)
                .photoUrl(photoUrl).category(category).itineraryJson(itinerary)
                .inclusions(inclusions).exclusions(exclusions)
                .rating(new java.math.BigDecimal("4." + (int)(Math.random() * 5 + 3)))
                .reviewCount((int)(Math.random() * 500 + 50))
                .isFeatured(List.of("Goa Beach Escape","Bali Paradise Getaway","Maldives Overwater Escape","Ladakh Bike Expedition").contains(name))
                .build();
    }
}
