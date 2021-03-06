'use strict';


angular.module('triviaApp.services', [])
    .factory('StringService', [function () {

        return {

            areIdentical: function (stringA, stringB) {

                stringA = stringA || '';
                stringB = stringB || '';


                function _sameLength(stringA, stringB) {
                    return  stringA.length == stringB.length;
                }

                function _sameLetters(stringA, stringB) {

                    var l = Math.min(stringA.length, stringB.length);

                    for (var i = 0; i < l; i++) {
                        if (stringA.charAt(i) !== stringB.charAt(i)) {
                            return false;
                        }
                    }
                    return true;
                }

                if (_sameLength(stringA, stringB) && _sameLetters(stringA, stringB)) {
                    return true;
                }

                return false;
            }
        }
    }])
    .service('UserService', [function () {

        var user = {
                id: null,
                firstName: null,
                lastName: null,
                displayName: 'Guest',
                sessionId: '',
                lastLogin: null,
                score: 0
            },

            loggedIn = false;


        function _getUser() {
            return user;
        }

        function _setUser(userObj) {

            _setUserId(userObj.id);
            _setUserDisplayName(userObj.display_name);
            _setUserSessionId(userObj.session_id);
            _setUserFirstName(userObj.first_name);
            _setUserLastName(userObj.last_name);
            _setUserLastLoginDate(userObj.last_login);
            _setLogInStatus(true);
        }

        function _unsetUser() {
            user = {
                id: null,
                firstName: null,
                lastName: null,
                displayName: 'Guest',
                sessionId: '',
                lastLogin: null,
                score: 0
            };

            _setLogInStatus(false);
        }

        function _setUserId(userId) {

            user.id = userId;
        }

        function _getUserId() {

            return user.id;
        }

        function _setUserDisplayName(userDisplayName) {

            user.displayName = userDisplayName;
        }

        function _setUserSessionId(userSessionId) {

            user.sessionId = userSessionId;
        }

        function _setUserFirstName(userFirstName) {

            user.firstName = userFirstName;
        }

        function _setUserLastName(userLastName) {

            user.lastName = userLastName;
        }

        function _setUserLastLoginDate(userLastLoginDate) {

            user.lastLogin = userLastLoginDate;
        }

        function _isLoggedIn() {

            return loggedIn;
        }

        function _setLogInStatus(status) {

            loggedIn = status;
        }

        function _setUserScore(scoreInt) {

            user.score = scoreInt;
        }

        function _getUserScore() {

            return user.score;
        }


        return {

            getUser: function () {

                return _getUser();
            },

            setUser: function (user) {

                _setUser(user);
            },

            unsetUser: function () {

                _unsetUser();
            },

            isLoggedIn: function () {

                return _isLoggedIn();
            },

            setUserScore: function (scoreInt) {

                _setUserScore(scoreInt);
                return _getUserScore();
            }
        }
    }])
    .service('MovieService', ['DreamFactory', '$q', function (DreamFactory, $q) {

        var selectedMovie = {};
        var searchTerms = ["20,000 Leagues Under the Sea", "2001: A Space Odyssey", "7 Faces of Dr. Lao", "7th Heaven", "8 Mile", "The Abyss", "The Accidental Tourist", "The Accountant", "The Accused", "Adaptation.", "Adventures of Don Juan", "The Adventures of Priscilla, Queen of the Desert", "The Adventures of Robin Hood", "Affliction", "The African Queen", "The Age of Innocence", "Air Force", "Airport", "Aladdin", "The Alamo", "The Alaskan Eskimo", "Albert Schweitzer", "Alexander's Ragtime Band", "Alice in Wonderland", "Alice Doesn't Live Here Anymore", "Alien", "Aliens", "All About Eve", "All About My Mother", "All Quiet on the Western Front", "All That Jazz", "All That Money Can Buy", "The Devil and Daniel Webster", "All the King's Men", "All the President's Men", "Almost Famous", "Ama Girls", "Amadeus", "Amarcord", "America, America", "American Beauty", "American Dream", "An American in Paris", "An American Werewolf in London", "Amour", "Amphibious Fighters", "Anastasia", "Anchors Aweigh", "The Anderson Platoon", "Angel and Big Joe", "Anna & Bella", "Anna and the King of Siam", "Anna Karenina", "Anne Frank Remembered", "Anne of the Thousand Days", "Annie Get Your Gun", "Annie Hall", "Anthony Adverse", "Antonia's Line", "The Apartment", "Apocalypse Now", "Apollo 13", "The Appointments of Dennis Jennings", "Aquatic House Party", "Argo", "Arise, My Love", "Around the World in 80 Days", "Arthur", "Arthur Rubinstein - The Love of Life", "Artie Shaw: Time Is All You've Got", "The Artist", "As Good as It Gets", "The Assault", "Atonement", "Avatar", "The Aviator", "The Awful Truth", "Babe", "Babel", "Babette's Feast", "The Bachelor and the Bobby-Soxer", "Back to the Future", "The Bad and the Beautiful", "Bad Girl", "Balance", "The Barbarian Invasions", "The Barefoot Contessa", "Barry Lyndon", "Batman", "The Battle of Midway", "Battleground", "The Bicycle Thief", "Bear Country", "A Beautiful Mind", "Beauty and the Beast", "Becket", "Bedknobs and Broomsticks", "Beetlejuice", "Beginners", "Being There", "Belle Epoque", "The Bells of St. Mary's", "Ben-Hur", "Benjy", "The Bespoke Overcoat", "Best Boy", "The Best Years of Our Lives", "Beyond the Line of Duty", "The Big Broadcast of 1938", "The Big Country", "The Big House", "Big Mama", "Bill and Coo", "Bird", "Birds Anonymous", "The Bishop's Wife", "Black and White in Color", "Black Fox", "Black Hawk Down", "Black Narcissus", "Black Orpheus", "The Black Stallion", "Black Swan", "The Black Swan", "The Blind Side", "Blithe Spirit", "Blood and Sand", "The Blood of Yingzhou District", "Blood on the Sun", "Blossoms in the Dust", "Blue Sky", "Board and Care", "Bob's Birthday", "Body and Soul", "The Bolero", "Bonnie and Clyde", "Bored of Education", "Born Free", "Born into Brothels", "Born on the Fourth of July", "Born Yesterday", "Bound for Glory", "The Bourne Ultimatum", "Bowling for Columbine", "The Box", "A Boy and His Dog", "Boys and Girls", "Boys Don't Cry", "Boys Town", "Bram Stoker's Dracula", "Brave", "The Brave One", "Braveheart", "Breakfast at Tiffany's", "Breaking Away", "Breaking the Sound Barrier", "Breathing Lessons: The Life and Work of Mark O'Brien", "The Bridge of San Luis Rey", "The Bridge on the River Kwai", "The Bridges at Toko-Ri", "Broadway Melody of 1936", "The Broadway Melody", "Brokeback Mountain", "Broken Lance", "Broken Rainbow", "The Buddy Holly Story", "Bugsy", "Bullets Over Broadway", "Bullitt", "Bunny", "Burnt by the Sun", "Busy Little Bears", "Butch Cassidy and the Sundance Kid", "BUtterfield 8", "Butterflies Are Free", "Cabaret", "Cactus Flower", "Calamity Jane", "California Suite", "Call Me Madam", "Camelot", "The Candidate", "Capote", "Captain Carey, U.S.A.", "Captains Courageous", "Casablanca", "Casals Conducts: 1964", "Cat Ballou", "The Cat Concerto", "Cavalcade", "Chagall", "The Champ", "Champion", "A Chance to Live", "Character", "Charade", "The Charge of the Light Brigade", "Chariots of Fire", "Charly", "Chernobyl Heart", "Chicago", "The Chicken", "Children of a Lesser God", "Chinatown", "A Christmas Carol", "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", "The Chubbchubbs!", "Churchill's Island", "The Cider House Rules", "Cimarron", "Cinema Paradiso", "The Circus", "Citizen Kane", "City of Wax", "City Slickers", "Cleopatra", "Cleopatra", "Climbing the Matterhorn", "Close Encounters of the Third Kind", "Close Harmony", "A Close Shave", "Closed Mondays", "Closely Watched Trains", "Coal Miner's Daughter", "Cocoon", "Cold Mountain", "The Color of Money", "Come and Get It", "Come Back, Little Sheba", "Coming Home", "Common Threads: Stories from the Quilt", "The Constant Gardener", "Cool Hand Luke", "Coquette", "The Counterfeiters", "The Country Cousin", "The Country Girl", "The Cove", "Cover Girl", "The Cowboy and the Lady", "Crac", "Crash", "Crash Dive", "Crashing the Water Barrier", "Crazy Heart", "Creature Comforts", "Cries and Whispers", "The Critic", "Cromwell", "Crouching Tiger, Hidden Dragon", "The Crunch Bird", "The Crying Game", "Curfew", "The Curious Case of Benjamin Button", "Cyrano de Bergerac", "Cyrano de Bergerac", "Czechoslovakia 1968", "A Damsel in Distress", "Dances with Wolves", "Dangerous", "Dangerous Liaisons", "Dangerous Moves", "The Danish Poet", "The Dark Angel", "The Dark Knight", "Darling", "The Dawn Patrol", "Day for Night", "Day of the Painter", "Daybreak in Udi", "Days of Heaven", "Days of Waiting", "Days of Wine and Roses", "Dead Man Walking", "Dead Poets Society", "Deadly Deception: General Electric, Nuclear Weapons and Our Environment", "Dear Diary", "Death Becomes Her", "Death on the Nile", "December 7th", "Declaration of Independence", "The Deer Hunter", "Defending Our Lives", "The Defiant Ones", "The Departed", "Departures", "Der Fuehrer's Face", "Dersu Uzala", "The Descendants", "Desert Victory", "Design for Death", "Designing Woman", "Destination Moon", "The Diary of Anne Frank", "Dick Tracy", "Dirty Dancing", "The Dirty Dozen", "The Discreet Charm of the Bourgeoisie", "Disraeli", "The Divine Lady", "Divorce, Italian Style", "The Divorcee", "Django Unchained", "Doctor Dolittle", "Doctor Zhivago", "Dodsworth", "Dog Day Afternoon", "The Dollar Bottom", "Don't", "The Dot and the Line", "A Double Life", "The Dove", "Dr. Jekyll and Mr. Hyde", "Dr. Seuss' How the Grinch Stole Christmas", "Dreamgirls", "Driving Miss Daisy", "The Duchess", "Dumbo", "Dylan Thomas", "E.T.: The Extra-Terrestrial", "Earthquake", "East of Eden", "Easter Parade", "Ed Wood", "Educating Peter", "Election Night", "The Eleanor Roosevelt Story", "Elizabeth", "Elizabeth: The Golden Age", "Elmer Gantry", "Emma", "The End of the Game", "The Enemy Below", "The English Patient", "Erin Brockovich", "Ersatz", "Eskimo", "Eternal Sunshine of the Spotless Mind", "Every Child", "Evita", "Exodus", "The Exorcist", "The Face of Lincoln", "Facing Your Danger", "The Facts of Life", "Fame", "Fanny & Alexander", "Fantasia", "The Fantastic Flying Books of Mr. Morris Lessmore", "Fantastic Voyage", "A Farewell to Arms", "Fargo", "The Farmer's Daughter", "Father and Daughter", "Father Goose", "Federico Fellini's 8½", "Fellini's Casanova", "Ferdinand the Bull", "Fiddler on the Roof", "The Fighter", "The Fighting Lady", "Finding Nemo", "Finding Neverland", "First Steps", "A Fish Called Wanda", "The Fisher King", "Flamenco at 5:15", "Flashdance", "The Flight of the Gossamer Condor", "Flowers and Trees", "The Fly", "The Fly", "The Fog of War", "Forbidden Games", "A Force in Readiness", "For Scent-imental Reasons", "For the Birds", "For Whom the Bell Tolls", "Forrest Gump", "The Fortune Cookie", "Frank Film", "Franz Kafka's It's a Wonderful Life", "A Free Soul", "Freeheld", "The French Connection", "Frenchman's Creek", "Frida", "From Here to Eternity", "From Mao to Mozart: Isaac Stern in China", "The Fugitive", "The Full Monty", "Funny Girl", "A Funny Thing Happened on the Way to the Forum", "Gandhi", "The Garden of Allah", "The Garden of the Finzi-Continis", "Gaslight", "Gate of Hell", "Gay Divorcee, The", "Genocide", "Gentleman's Agreement", "Gerald McBoing-Boing", "Geri's Game", "Get Out Your Handkerchiefs", "Ghost", "The Ghost and the Darkness", "Giant", "Gigi", "Girl, Interrupted", "The Girl with the Dragon Tattoo", "Giuseppina", "Give Me Liberty", "Gladiator", "Glass", "The Glenn Miller Story", "Glory", "The Godfather", "The Godfather Part II", "God of Love", "Gods and Monsters", "Going My Way", "Gold Diggers of 1935", "The Golden Compass", "The Golden Fish", "Goldfinger", "Gone with the Wind", "The Good Earth", "Good Will Hunting", "The Goodbye Girl", "Goodbye, Miss Turlock", "Goodbye, Mr. Chips", "Goodfellas", "Gosford Park", "The Graduate", "Grand Canyon", "Grand Hotel", "Grand Prix", "Grandad of Races", "The Grapes of Wrath", "Gravity Is My Enemy", "Great", "The Great American Cowboy", "The Great Caruso", "Great Expectations", "The Great Gatsby", "The Great Lie", "The Great McGinty", "The Great Race", "The Great Waltz", "The Great Ziegfeld", "The Greatest Show on Earth", "A Greek Tragedy", "Green Dolphin Street", "Guess Who's Coming to Dinner", "The Guns of Navarone", "Hamlet", "Hannah and Her Sisters", "Happy Feet", "Harlan County, USA", "Harry and the Hendersons", "Harry and Tonto", "Harvey", "The Harvey Girls", "Harvie Krumpet", "He Makes Me Feel Like Dancin'", "Hearts and Minds", "Heaven Can Wait", "Heavenly Music", "The Heiress", "Helen Keller in Her Story", "Hello, Dolly!", "Hello, Frisco, Hello", "The Hellstrom Chronicle", "The Help", "Henry V", "Henry V", "A Herb Alpert and the Tijuana Brass Double Feature", "Here Comes Mr. Jordan", "Here Comes the Groom", "Heureux Anniversaire", "The High and the Mighty", "High Noon", "The Hindenburg", "Hitler Lives", "The Hole", "A Hole in the Head", "Holiday Inn", "The Horse with the Flying Tail", "The Hospital", "Hotel Terminus: The Life and Times of Klaus Barbie", "The Hours", "The House I Live In", "The House on 92nd Street", "How Green Was My Valley", "How the West Was Won", "How to Sleep", "Howards End", "Hud", "Hugo", "The Human Comedy", "The Hunt for Red October", "The Hurricane", "The Hurt Locker", "Hustle & Flow", "The Hustler", "I Am a Promise: The Children of Stanton Elementary School", "I Want to Live!", "I Wanted Wings", "I Won't Play", "If You Love This Planet", "Il Postino", "I'll Cry Tomorrow", "I'll Find a Way", "In Beaver Valley", "In Old Arizona", "In Old Chicago", "In the Heat of the Night", "In the Region of Ice", "In the Shadow of the Stars", "Inception", "An Inconvenient Truth", "The Incredibles", "Independence Day", "Indiana Jones and the Last Crusade", "Indiana Jones and the Temple of Doom", "Indochine", "The Informer", "Inglourious Basterds", "Innerspace", "Inside Job", "Interrupted Melody", "Interviews with My Lai Veterans", "Into the Arms of Strangers: Stories of the Kindertransport", "The Invaders", "Investigation of a Citizen Above Suspicion", "Iris", "Irma la Douce", "The Iron Lady", "Is It Always Right to Be Right?", "It Happened One Night", "It's a Mad Mad Mad Mad World", "It's Tough to Be a Bird", "Jacques-Yves Cousteau's World Without Sun", "Jaws", "The Jazz Singer", "Jerry Maguire", "Jezebel", "JFK", "Joan of Arc", "Johann Mouse", "Johnny Belinda", "Johnny Eager", "The Johnstown Flood", "The Joker Is Wild", "The Jolson Story", "Journey Into Self", "Journey of Hope", "Judgment at Nuremberg", "Julia", "Julius Caesar", "Juno", "Jurassic Park", "Just Another Missing Kid", "Karl Hess: Toward Liberty", "Kentucky", "Key Largo", "The Killing Fields", "The King and I", "King Gimp", "King Kong", "King Kong", "King of Jazz", "King Solomon's Mines", "The King's Speech", "Kiss of the Spider Woman", "Kitty Foyle", "Klute", "Knighty Knight Bugs", "Kolya", "Kon-Tiki", "Krakatoa", "Kramer vs. Kramer", "L.A. Confidential", "La Cucaracha", "La Dolce Vita", "La Vie en rose", "Lady Be Good", "The Last Command", "The Last Days", "The Last Emperor", "The Last King of Scotland", "The Last of the Mohicans", "The Last Picture Show", "Laura", "The Lavender Hill Mob", "Lawrence of Arabia", "Le Mozart des Pickpockets", "Leave Her to Heaven", "Leaving Las Vegas", "Legends of the Fall", "Leisure", "Lemony Snicket's A Series of Unfortunate Events", "Lend a Paw", "Les Girls", "Les Miserables", "Let It Be", "A Letter to Three Wives", "Letters from Iwo Jima", "Lieberman in Love", "Life Is Beautiful", "The Life of Emile Zola", "Life of Pi", "Light in the Window", "Lili", "Lilies of the Field", "Limelight", "Lincoln", "The Lion in Winter", "The Lion King", "The Little Kidnappers", "The Little Mermaid", "Little Miss Sunshine", "A Little Night Music", "The Little Orphan", "A Little Romance", "Little Women", "Little Women", "The Lives of a Bengal Lancer", "The Lives of Others", "The Living Desert", "Logan's Run", "Logorama", "The Long Way Home", "The Longest Day", "The Lord of the Rings: The Fellowship of the Ring", "The Lord of the Rings: The Return of the King", "The Lord of the Rings: The Two Towers", "Lost Horizon", "Lost in Translation", "The Lost Weekend", "Love Is a Many-Splendored Thing", "Love Me or Leave Me", "Love Story", "Lovers and Other Strangers", "The Lunch Date", "Lust for Life", "Madame Rosa", "The Madness of King George", "The Magic Machines", "Magoo's Puddle Jumper", "Main Street on the March!", "A Man and a Woman", "A Man for All Seasons", "Man on Wire", "The Man Who Knew Too Much", "The Man Who Planted Trees", "The Man Who Skied Down Everest", "Manhattan Melodrama", "Manipulation", "March of the Penguins", "Marie Antoinette", "Marie-Louise", "Marjoe", "Marooned", "Marty", "Mary Poppins", "M* A* S* H", "Mask", "Master and Commander: The Far Side of the World", "The Matrix", "Maya Lin: A Strong Clear Vision", "Mediterraneo", "Melvin and Howard", "Memoirs of a Geisha", "Men Against the Arctic", "Men in Black", "Mephisto", "The Merry Widow", "Michael Clayton", "Midnight Cowboy", "Midnight Express", "Midnight in Paris", "A Midsummer Night's Dream", "Mighty Aphrodite", "Mighty Joe Young", "Mighty Times: The Children's March", "The Milagro Beanfield War", "Mildred Pierce", "Milk", "The Milky Way", "Million Dollar Baby", "Min and Bill", "Miracle on 34th Street", "The Miracle Worker", "Misery", "Missing", "The Mission", "Mississippi Burning", "Mister Roberts", "Molly's Pilgrim", "Mona Lisa Descending a Staircase", "Monsieur Vincent", "Monster", "Monster's Ball", "Monsters, Inc.", "The Moon and the Son: An Imagined Conversation", "Moonbird", "Moonstruck", "The More the Merrier", "Morning Glory", "Moscow Does Not Believe in Tears", "Mother Wore Tights", "The Motorcycle Diaries", "Moulin Rouge", "Moulin Rouge!", "Mouse Trouble", "Le Mozart des pickpockets", "Mr. Deeds Goes to Town", "Mr. Smith Goes to Washington", "Mrs. Doubtfire", "Mrs. Miniver", "Munro", "The Muppets", "Murder on a Sunday Morning", "Murder on the Orient Express", "The Music Box", "Music by Prudence", "The Music Man", "Mutiny on the Bounty", "My Cousin Vinny", "My Fair Lady", "My Gal Sal", "My Left Foot", "My Mother Dreams the Satan's Disciples in New York", "My Uncle", "Mystic River", "The Naked City", "Nashville", "National Velvet", "Nature's Half Acre", "Naughty Marietta", "Neighbours", "Neptune's Daughter", "Network", "Never on Sunday", "The New Tenants", "Nicholas and Alexandra", "The Night of the Iguana", "Nights of Cabiria", "Nine from Little Rock", "No Country for Old Men", "No Man's Land", "None But the Lonely Heart", "Norma Rae", "Norman Rockwell's World... An American Dream", "North West Mounted Police", "A Note of Triumph: The Golden Age of Norman Corwin", "Now, Voyager", "Nowhere in Africa", "Number Our Days", "The Nutty Professor", "An Occurrence at Owl Creek Bridge", "Of Pups and Puzzles", "An Officer and a Gentleman", "The Official Story", "Oklahoma!", "The Old Man and the Sea", "The Old Man and the Sea", "The Old Mill", "Oliver!", "The Omen", "Omnibus", "On Golden Pond", "On the Town", "On the Waterfront", "Once", "One Day in September", "One Flew over the Cuckoo's Nest", "One Hundred Men and a Girl", "One Night of Love", "One Survivor Remembers", "One Way Passage", "One-Eyed Men Are Kings", "Ordinary People", "Out of Africa", "Overture to The Merry Wives of Windsor", "The Paleface", "The Panama Deception", "Panic in the Streets", "Pan's Labyrinth", "Papa's Delicate Condition", "The Paper Chase", "Paper Moon", "A Passage to India", "A Patch of Blue", "The Patriot", "Patton", "Paul Robeson: Tribute to an Artist", "Pearl Harbor", "Pelle the Conqueror", "Penny Wisdom", "The Personals", "Peter & the Wolf", "Phantom of the Opera", "Philadelphia", "The Philadelphia Story", "The Pianist", "The Piano", "Picnic", "The Picture of Dorian Gray", "Pillow Talk", "The Pink Phink", "Pinocchio", "Pirates of the Caribbean: Dead Man's Chest", "A Place in the Sun", "A Place to Stand, A Place to Grow", "Places in the Heart", "Planet of the Apes", "Platoon", "Plymouth Adventure", "Pocahontas", "Pollock", "Porgy and Bess", "Pollyanna", "Portrait of Jennie", "The Poseidon Adventure", "Precious Images", "Pride and Prejudice", "The Pride of the Yankees", "The Prime of Miss Jean Brodie", "The Prince of Egypt", "Princess O'Rourke", "Princeton: A Search for Answers", "The Private Life of Henry VIII", "The Private Life of the Gannets", "Prizzi's Honor", "The Producers", "Project Hope", "The Public Pays", "Pulp Fiction", "Purple Rain", "Pygmalion", "The Queen", "Quest", "Quest for Fire", "Quicker 'N a Wink", "Quiero ser (I want to be ...)", "The Quiet Man", "Quiet Please!", "Raging Bull", "Raiders of the Lost Ark", "Rain Man", "The Rains Came", "Ran", "Rango", "Rashomon", "Ratatouille", "Ray", "Ray's Male Heterosexual Dance Hall", "The Razor's Edge", "The Reader", "Reap the Wild Wind", "Rebecca", "The Red Balloon", "The Red Shoes", "The Red Violin", "Reds", "The Redwoods", "Restoration", "The Resurrection of Broncho Billy", "Reversal of Fortune", "The Right Stuff", "The River", "A River Runs Through It", "Road to Perdition", "The Robe", "Robert Frost: A Lover's Quarrel with the World", "Robert Kennedy Remembered", "RoboCop", "Rocky", "Roman Holiday", "Romeo and Juliet", "Room at the Top", "A Room with a View", "The Rose Tattoo", "Rosemary's Baby", "'Round Midnight", "Ryan", "Ryan's Daughter", "Sabrina", "Samson and Delilah", "Samurai, The Legend of Musashi", "San Francisco", "The Sand Castle", "The Sandpiper", "Save the Tiger", "Saving Face", "Saving Private Ryan", "Sayonara", "Scared Straight!", "Scent of a Woman", "Schindler's List", "Schwarzfahrer", "The Scoundrel", "The Sea Around Us", "The Sea Inside", "Seal Island", "The Search", "Searching for Sugar Man", "Seawards the Great Ships", "The Secret in Their Eyes", "The Secret Land", "Seeds of Destiny", "Sense and Sensibility", "Sentinels of Silence", "Separate Tables", "A Separation", "Serengeti Shall Not Die", "Sergeant York", "Session Man", "Seven Brides for Seven Brothers", "Seven Days to Noon", "The Seventh Veil", "Shaft", "Shakespeare in Love", "Shampoo", "Shane", "Shanghai Express", "She Wore a Yellow Ribbon", "Shine", "Ship of Fools", "A Shocking Accident", "Shoeshine", "The Shop on Main Street", "The Shore", "Shrek", "Sideways", "The Silence of the Lambs", "The Silent World", "Silver Linings Playbook", "The Sin of Madelon Claudet", "Since You Went Away", "Six Shooter", "Skippy", "Sky Above and Mud Beneath", "Skyfall", "Sleepy Hollow", "Sling Blade", "Slumdog Millionaire", "The Snake Pit", "Snow White and the Seven Dwarfs", "So Much for So Little", "So This Is Harris!", "The Social Network", "The Solid Gold Cadillac", "Some Like It Hot", "Somebody Up There Likes Me", "The Song of Bernadette", "Song of the South", "Song Without End", "Sons and Lovers", "Sons of Liberty", "Sophie's Choice", "Sound of Music, The", "South Pacific", "Spartacus", "Spawn of the North", "Speaking of Animals and Their Families"]

        function _setSelectedMovie(movieObj) {

            selectedMovie = movieObj;
        }

        function _getSelectedMovie() {

            return selectedMovie;
        }

        function _generateSearchTerm() {

            return searchTerms[Math.floor((Math.random() * searchTerms.length))];
        }

        function _getMovie() {

            var defer = $q.defer();


            DreamFactory.api.movies.getMovies({"q": _generateSearchTerm()},

                function (data) {
                    defer.resolve(data);
                },
                function (data) {

                    defer.reject(data);
                });

            return defer.promise;


        }

        function _selectMovie(moviesObj) {

            var movie = {};

            if (moviesObj.total > 1) {
                movie = moviesObj.movies[0];
            }

            return movie;
        }

        function _formatAndCreateJsonObj(jsonStr) {

            var a = jsonStr.replace(/\\n/gm, '')
                .replace(/\"/, '')
                .replace(/\\/gm, '')
                .replace(/\s\"/g, " '")
                .replace(/\"\s/g, "' ")
                .replace(/\"\./g, "' ")
                .replace(/\w\"\"/g, "'\"" )
                .replace(/\"(?=[^"]*$)/, '');

            try {
                return angular.fromJson(a);
            }
            catch(e) {
                return false;
            }
        }


        return {

            getMovie: function () {

                var defer = $q.defer();


                _getMovie().then(function (result) {

                    result = _formatAndCreateJsonObj(result);

                    if (!result) {

                        defer.reject(result);

                    }else if (result.total == 0) {

                        defer.reject(result);

                    } else if (result.total > 1) {

                        _setSelectedMovie(_selectMovie(result));
                        defer.resolve(_getSelectedMovie());


                    } else {

                        _setSelectedMovie(result.movies[0]);
                        defer.resolve(_getSelectedMovie());
                    }
                }, function (reason) {

                    defer.reject(reason);
                });


                return defer.promise;
            }
        }
    }])
    .service('MakeQuestion', [function () {


        function _getReleaseDate(movieObj) {

            return movieObj.year.toString();
        }

        function _getTitle(movieObj) {

            return movieObj.title
        }

        function _getRandomRole(movieObj) {

            var role = movieObj.abridged_cast[Math.floor((Math.random() * movieObj.abridged_cast.length))];

            if (!role) {

                return false;
            }

            return role;
        }

        function _getActors(movieObj) {

            var actors = [];

            angular.forEach(movieObj.abridged_cast, function (v, i) {

                actors.push(v);

            });

            return actors;
        }


        return {

            questionBuilder: function (movieObj) {

                var question = Math.floor((Math.random() * 3));

                switch (question) {

                    case 0:
                        return this.getReleaseDateQuestion(movieObj);

                    case 1:
                        return this.getTitleQuestion(movieObj) ? this.getTitleQuestion(movieObj) : this.getReleaseDateQuestion(movieObj);

                    case 2:

                        return this.getCharacterQuestion(movieObj) ? this.getCharacterQuestion(movieObj) : this.getReleaseDateQuestion(movieObj);
                    default:

                        return this.getReleaseDateQuestion(movieObj);
                }

            },


            getReleaseDateQuestion: function (movieObj) {

                return {
                    question: 'In what year was "' + _getTitle(movieObj) + '" released?',
                    answer: _getReleaseDate(movieObj)
                }

            },

            getTitleQuestion: function (movieObj) {

                var _question = "What movie starred ",
                    actors = _getActors(movieObj);

                if (actors.length == 0) {
                    return false;
                }

                if (actors.length == 1) {

                    _question += actors[0].name + '?';
                } else {
                    angular.forEach(actors, function (actor, i) {

                        if (i != (actors.length - 1)) {

                            _question += actor.name + ', '
                        } else {

                            _question += 'and ' + actor.name + '?';
                        }
                    });
                }

                return {
                    question: _question,
                    answer: _getTitle(movieObj)
                }
            },

            getCharacterQuestion: function (movieObj) {

                var role = _getRandomRole(movieObj);

                if (!role.characters) {
                    return false;
                }

                return {
                    question: 'Who played ' + role.characters[0] + ' in ' + _getReleaseDate(movieObj) + '\'s "' + _getTitle(movieObj) + '"?',
                    answer: role.name
                }

            }

        }
    }])
    .service('ScoreKeeper', ['$q', 'DreamFactory', function ($q, DreamFactory) {

        var total = 0,
            itemValue = 10;

        function _incrementTotal() {
            total += itemValue;
        }

        function _decrementTotal() {
            total -= itemValue;
        }

        function _setItemValue(itemValueInt) {
            itemValue = itemValueInt
        }

        function _getItemValue() {
            return itemValue;
        }

        function _getTotal() {
            return total;
        }

        function _setTotal(totalInt) {
            total = totalInt;
        }

        function _createRecord(recordData) {

            var defer = $q.defer();

            DreamFactory.api.db.createRecord(recordData,
                function (data) {

                    defer.resolve(data);
                },
                function (data) {

                    defer.reject(data);
                });

            return defer.promise;
        }


        function _updateRecord(recordData) {

            var defer = $q.defer();

            DreamFactory.api.db.updateRecord(recordData,
                function (data) {

                    defer.resolve(data);
                },
                function (data) {

                    defer.reject(data);
                })

            return defer.promise;
        }




        function _getRecord(recordData) {

            var defer = $q.defer();

            DreamFactory.api.db.getRecord(recordData,
                function (data) {

                    if (typeof data == 'string') {
                        defer.reject(data);
                    } else {
                        defer.resolve(data);

                    }
                },
                function (data) {


                    defer.reject(data)
                });

            return defer.promise;

        }


        return {

            incrementScore: function () {

                _incrementTotal();
                return this.getScore();
            },

            decrementScore: function () {

                _decrementTotal();
                return this.getScore();
            },

            getScore: function () {

                return _getTotal();
            },

            setScore: function (scoreInt) {

                _setTotal(scoreInt)
            },

            resetScore: function () {
                this.setScore(0);
            },

            createScoreRecord: function (userData) {

                var defer = $q.defer(),
                    record = {
                        table_name: 'TriviaScore',
                        id: userData.id,
                        body: {
                            user: userData.id,
                            score: 0
                        }
                    };

                _createRecord(record).then(
                    function (result) {

                        defer.resolve(result);

                    },
                    function (reason) {

                        defer.reject(reason)

                    });

                return defer.promise;

            },

            updateScoreRecord: function (recordData) {

                var defer = $q.defer();

                _updateRecord(recordData).then(
                    function (result) {

                        defer.resolve(result);

                    },
                    function (reason) {

                        defer.reject(reason)

                    });

                return defer.promise;
            },

            getScoreRecord: function (userData) {

                var defer = $q.defer(),
                    recordData = {
                        table_name: 'TriviaScore',
                        id: userData.id,
                        id_field: 'user'
                    }


                _getRecord(recordData).then(
                    function (result) {

                        defer.resolve(result);

                    },
                    function (reason) {

                        defer.reject(reason)

                    });

                return defer.promise;

            },

            setQuestionValue: function (questionValue) {

                _setItemValue(questionValue);
            },

            getQuestionValue: function () {

                return _getItemValue()
            }
        }
    }]);
