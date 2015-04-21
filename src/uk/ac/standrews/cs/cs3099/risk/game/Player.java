package uk.ac.standrews.cs.cs3099.risk.game;

import uk.ac.standrews.cs.cs3099.risk.commands.Command;
import uk.ac.standrews.cs.cs3099.risk.commands.CommandType;

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
	protected String name;
	protected int lastAckid = 0;
	protected boolean isNeutral = true;
	private Die die = new Die();
	private byte[] lastRollNumber;

	// Game state properties
	private List<Card> usedCards = new ArrayList<Card>();
	private List<Card> hiddenCards = new ArrayList<Card>();

	private int totalArmies = 0;

	/**
	 * Random names that can be used for players
	 */
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


	/**
	 * Constructor for a player without a name
	 * @param id - the id of the player
	 */
	public Player(int id)
	{
		Random r = new Random();

		this.id = id;
		this.name = genName();
	}

	/**
	 * Constructor for a player with a name
	 * @param id the id of the player
	 * @param name the name of the player
	 */
	public Player(int id, String name)
	{
		this.id = id;
		this.name = name;
	}

//
//	public void initialiseGameState(ArrayList<Integer> playerInts)
//	{
//		gameState = new GameState(playerInts);
//		gameState.loadDefaultMap();
//	}

	public Die getDie()
	{
		return die;
	}

	public void setLastRollNumber(byte[] num){
		this.lastRollNumber = num;
	}

	public byte[] getLastRollNumber(){
		return lastRollNumber;
	}

	public abstract PlayerType getType();

	/**
	 * Generate a random name
	 * @return  the name
	 */
	public String genName()
	{
		Random r = new Random();

		return names[0][r.nextInt(names[0].length - 1)] + " " + names[1][r.nextInt(names[1].length - 1)];
	}

	/**
	 * @return the players name
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * @return the players id
	 */
	public int getId()
	{
		return id;
	}

	/**
	 * Sets the players id
	 * @param id player id
	 */
	public void setId(int id)
	{
		this.id = id;
	}

	/**
	 * Checks whether the player can move a specified number of armies from one territory to another
	 * @param src - the source territory
	 * @param dst -  the destination territory
	 * @param amount - the number of armies to move
	 * @return true if player can move armies, false if not
	 */
	public boolean canMoveArmies(Territory src, Territory dst, int amount)
	{
		return src.getArmies() - 1 > amount && src.isLinkedTo(dst) &&
				ownsTerritory(src) && ownsTerritory(dst);
	}

	/**
	 * Adds a given card to the players list of hidden cards
	 * @param c - the card
	 */
	public void addCard(Card c)
	{
		hiddenCards.add(c);
	}

	/**
	 * Removes a players card from their hidden cards list to their used cards list
	 * @param c
	 */
	public void playCard(Card c)
	{
		hiddenCards.remove(c);
		usedCards.add(c);
	}

	/**
	 * @return the list of cards the player has not yet played
	 */
	public List<Card> getCards(){
		return hiddenCards;
	}

	/**
	 * Given an id of a card in the hidden cards list return the instance of that card, if it exits
	 * @param id the id of the card
	 * @return the matching card
	 * @throws CardNotFoundException
	 */
	public Card getCardByID(int id) throws CardNotFoundException{
		for(Card card:hiddenCards){
			if(card.getId()==id){
				return card;
			}
		}
		throw new CardNotFoundException("Card Not Found");
	}

	/**
	 * Checks if the player owen a given territory
	 * @param t - the territory
	 * @return true if player owns it, false if not
	 */
	public boolean ownsTerritory(Territory t)
	{
		return t.getOwner() == id;
	}

	/**
	 * Gets a command from the user via appropriate mechanisms for each type of player
	 * @param type the command type to get
	 * @return the created command
	 */
	public abstract Command getCommand(CommandType type);

	/**
	 * Notifies all players about the specified command being actioned so that all players can update their game state
	 * @param command
	 */
	public abstract void notifyCommand(Command command);

	/**
	 * @return whether the player is neural
	 */
	public boolean isNeutral()
	{
		return isNeutral;
	}

	/**
	 * Set the whether the player is neutral
	 * @param neutral
	 */
	public void setNeutral(boolean neutral)
	{
		isNeutral = neutral;
	}

}
