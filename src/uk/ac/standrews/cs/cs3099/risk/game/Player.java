package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Player Class
 * Abstractions of what every player should have (including local)
 */
public abstract class Player {

	// Unique per-player values
	private int id;
	private String name;

	// Game state properties
	private List<Card> usedCards = new ArrayList<Card>();
	private List<Card> hiddenCards = new ArrayList<Card>();

	private int totalArmies = 0;

	private final String[][] names = {{"Adam", "Alan", "Andrew", "Antony", "Arnald", "Arthur", "Aubrey", "Baldwin", "Barnard", "Bartholomew", "Benedict",
									   "Charles", "Christopher", "David", "Denys", "Edmond", "Edmund", "Edward", "Elias", "Esmour", "Ethelbert", "Eustace",
									   "Francis", "Gauwyn", "Geoffrey", "George", "Gerard", "Gilbert", "Giles", "Godfrey", "Guy", "Harry", "Henry", "Hitler",
									   "Hugh", "Humphrey", "Ivo", "Jakys", "James", "Jocelyn", "John", "Jonathon", "Lawrence", "Leonard", "Lewis", "Luke",
									   "Martin", "Matthew", "Michael", "Morys", "Nathaniel", "Nichol", "Nicholas", "Nicolas", "Nigel", "Oliver", "Osbert",
									   "Peter", "Philip", "Piers", "Raff", "Ralf", "Ralph", "Raulin", "Reginald", "Reynard", "Richard", "Robert", "Roger",
									   "Simon", "Stalin", "Stephen", "Symond", "Thomas", "Tomas", "Valentine", "Walter", "William"},
									  {"Abell", "Adams", "Adamson", "Adolf", "Ailemer", "Alard", "Alington", "Amcottes", "Anderson", "Andrew", "Andrews",
									   "Appleby", "Archer", "Arderne", "Armstrong", "Assheby", "Atlee", "Aylmer", "Bacon", "Bailey", "Baker", "Bardolf",
									   "Barker", "Barnes", "Beauson", "Bell", "Benett", "Berney", "Boteler", "Bowyar", "Boys", "Bradshawe", "Brocas",
									   "Brook", "Browne", "Burton", "Carew", "Carter", "Cary", "Cassy", "Chamberlayn", "Chapman", "Chetwode", "Cheyne",
									   "Clarke", "Clere", "Clerk", "Clyne", "Cobham", "Coffyn", "Coke", "Cole", "Compton", "Coterel", "Cotton", "Courtenay",
									   "Crane", "Curteys", "Dalison", "Danet", "Daye", "Denys", "Dering", "Downer", "Draper", "Drayton", "Dunham", "Dye",
									   "Edgar", "Elynbrigge", "Elyot", "Eveas", "Eyre", "Fenton", "Fetyplace", "Fitzalan", "Fitzherbert", "Fitzwillyam",
									   "Fogg", "Forde", "Fortescue", "Fowler", "Foxe", "Funteyn", "Fysher", "Gage", "Gardyner", "Gascoigne", "Gaynesford",
									   "Gerard", "Gifford", "Glenham", "Godfrey", "Goldwell", "Goode", "Goodyere", "Grey", "Groby", "Gyfford", "Hache",
									   "Halle", "Hamond", "Harte", "Hawtrey", "Heron", "Holland", "Holt", "Howard", "Hyde", "Hyll", "Isley", "Jackmann",
									   "James", "Jendryng", "Jordan", "Kent", "Knighton", "Kyngeston", "Lacey", "Latham", "Lee", "Leventhorp", "London",
									   "Lovell", "Lucy", "Lytton", "Maddeson", "Maison", "Makepiece", "Mallowburne", "Malyns", "Manston", "Mareys",
									   "Marshall", "Martyn", "Mason", "Mauntell", "Mayne", "Merys", "Metcalfe", "Middleton", "Moore", "Morley", "Newdegate",
									   "Northwode", "Obelyn", "Olyver", "Osteler", "Palmer", "Parker", "Parris", "Payne", "Pecok", "Pole", "Porter", "Pratt",
									   "Pygott", "Pyn", "Quatremaine", "Rampston", "Ratclif", "Rede", "Roberts", "Roland", "Roos", "Rowe", "Rudhale",
									   "Ryall", "Sadler", "Salle", "Saunders", "Savage", "Savill", "Saye", "Scott", "Selwyn", "Sentjohn", "Seymour",
									   "Shelley", "Shylton", "Skipwyth", "Smyth", "Sparrow", "Spicer", "Staunton", "Stokys", "Swan", "Symons", "Tabard",
									   "Talbot", "Taylor", "Thornton", "Tyrell", "Underhill", "Vaughan", "Vawdrey", "Verney", "Wadham", "Wake", "Waleys",
									   "Warde", "Weston", "Whyte", "Williams", "Wilson", "Wode", "Wrenne", "Wylde", "Yate", "Yonge", "atte Hole", "atte Wille",
									   "atte Wode", "de Beauchamp", "de Cobham", "de Grenefeld", "de Malyns", "de Monteacute", "de Thorp", "le Strange",
									   "Austyn", "Byrd", "Cordner", "Burgeys", "Wysman", "Trainell", "Thurgod", "Sweeting", "Sutton", "Sorrel", "Purser",
									   "Proudfoot", "Newecome", "Zimmerman"}
									  };


	public Player(int id)
	{
		Random r = new Random();

		this.id = id;
		this.name = genName();
	}

	public Player(int id, String name)
	{
		this.id = id;
		this.name = name;
	}

	public String genName()
	{
		Random r = new Random();

		return names[0][r.nextInt(names[0].length - 1)] + " " + names[1][r.nextInt(names[1].length - 1)];
	}

	public String getName()
	{
		return name;
	}

	public int getId()
	{
		return id;
	}

	public boolean canMoveArmies(Territory src, Territory dst, int amount)
	{
		return src.getArmies() - 1 > amount && src.isLinkedTo(dst) &&
				ownsTerritory(src) && ownsTerritory(dst);
	}

	public void addCard(Card c)
	{
		hiddenCards.add(c);
	}

	public void playCard(Card c)
	{
		hiddenCards.remove(c);
		usedCards.add(c);
	}

	public boolean ownsTerritory(Territory t)
	{
		return t.getOwner() == id;
	}

	public abstract Command getMove(MoveType type);
	public abstract void notifyMove(Command command);
}
