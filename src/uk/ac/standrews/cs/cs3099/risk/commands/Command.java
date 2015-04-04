package uk.ac.standrews.cs.cs3099.risk.commands;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

public abstract class Command {
	private int ackId;
	private int playerId;

	/**
	 * Creates a move instance which requires acknowledgement.
	 *
	 * @param playerId ID of the player making this move.
	 * @param ackId    Unique integer acknowledgement ID.
	 */
	public Command(int playerId, int ackId)
	{
		this.playerId = playerId;
		this.ackId = ackId;
	}

	/**
	 * Creates a move instance with no acknowledgement ID.
	 *
	 * @param playerId ID of the player making this move.
	 */
	public Command(int playerId)
	{
		this(playerId, -1);
	}

	/**
	 * Create a Command instance which has no player_id or ack_id fields.
	 */
	public Command()
	{
		this(-1, -1);
	}

	public int getPlayerId()
	{
		return playerId;
	}

	public int getAckId()
	{
		return ackId;
	}

	public abstract CommandType getType();

	public abstract String toJSON();

	private static HashMap<String, Class> classMap = new HashMap<String, Class>();

	static {
		classMap.put("server_connect", ServerConnectCommand.class);
		classMap.put("server_start", ServerStartCommand.class);
		classMap.put("attack", AttackCommand.class);
		classMap.put("fortify", FortifyCommand.class);
		classMap.put("deploy", DeployCommand.class);
		classMap.put("draw_card", DrawCardCommand.class);
		classMap.put("assign_army", AssignArmyCommand.class);
		classMap.put("defend", DefendCommand.class);
		classMap.put("join_game", JoinGameCommand.class);
		classMap.put("accept_join_game", AcceptJoinGameCommand.class);
		classMap.put("reject_join_game", RejectJoinGameCommand.class);
		classMap.put("acknowledgement", AcknowledgementCommand.class);
		classMap.put("timeout", TimeoutCommand.class);
		classMap.put("attack_capture", AttackCaptureCommand.class);
		classMap.put("leave_game", LeaveGameCommand.class);
		classMap.put("roll_number", RollNumberCommand.class);
		classMap.put("roll_hash", RollHashCommand.class);
		classMap.put("play_cards", PlayCardsCommand.class);
		classMap.put("ping", PingCommand.class);
		classMap.put("ready", ReadyCommand.class);
		classMap.put("initialise_game", InitialiseGameCommand.class);
		classMap.put("players_joined", PlayersJoinedCommand.class);
	}

	public static Command fromJSON(String json)
	{
		Map message = new Gson().fromJson(json, Map.class);
		String command = (String) message.get("command");
		Class commandClass = classMap.get(command);

		if (commandClass == null) {
			return null;
		}

		return (Command) new Gson().fromJson(json, commandClass);
	}
}
