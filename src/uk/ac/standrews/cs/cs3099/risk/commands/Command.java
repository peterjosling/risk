package uk.ac.standrews.cs.cs3099.risk.commands;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.util.HashMap;

public abstract class Command {
	private static Gson gson;

	static {
		GsonBuilder builder = new GsonBuilder();
		builder.registerTypeAdapter(Command.class, new CommandSerializer());
		builder.registerTypeAdapter(Command.class, new CommandDeserializer());
		builder.registerTypeAdapter(PlayersJoinedCommand.PlayersNames.class, new PlayersJoinedCommand.PlayersNameSerializer());
		builder.registerTypeAdapter(PlayersJoinedCommand.PlayersNames.class, new PlayersJoinedCommand.PlayersNamesDeserializer());
		builder.registerTypeAdapter(PingCommand.class, new PingCommand.PingCommandSerializer());
		builder.registerTypeAdapter(PingCommand.class, new PingCommand.PingCommandDeserializer());
		gson = builder.serializeNulls().create();
	}

	private int ack_id;
	private int player_id;

	/**
	 * Creates a move instance which requires acknowledgement.
	 *
	 * @param playerId ID of the player making this move.
	 * @param ackId    Unique integer acknowledgement ID.
	 */
	public Command(int playerId, int ackId)
	{
		this.player_id = playerId;
		this.ack_id = ackId;
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
		return player_id;
	}

	public int getAckId()
	{
		return ack_id;
	}

	public abstract CommandType getType();

	public String toJSON()
	{
		return gson.toJson(this, Command.class);
	}

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
		return gson.fromJson(json, Command.class);
	}

	public static class CommandSerializer implements JsonSerializer<Command> {
		@Override
		public JsonElement serialize(Command command, Type type, JsonSerializationContext jsonSerializationContext)
		{
			JsonElement jsonElement = jsonSerializationContext.serialize(command, command.getClass());

			// Strip off ack_id and player_id if unused.
			JsonObject obj = jsonElement.getAsJsonObject();

			if (obj.has("player_id") && !obj.get("player_id").isJsonNull()) {
				int playerId = obj.get("player_id").getAsInt();

				if (playerId == -1) {
					obj.remove("player_id");
				}
			}

			if (obj.has("ack_id")) {
				int ackId = obj.get("ack_id").getAsInt();

				if (ackId == -1) {
					obj.remove("ack_id");
				}
			}

			return jsonElement;
		}
	}

	public static class CommandDeserializer implements JsonDeserializer<Command> {
		@Override
		public Command deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException
		{
			JsonObject obj = jsonElement.getAsJsonObject();
			String command = obj.get("command").getAsString();
			Class commandClass = classMap.get(command);

			if (commandClass == null) {
				return null;
			}

			// Non-existent ack_id/player_id fields are stored as int -1.
			if (!obj.has("ack_id")) {
				obj.add("ack_id", new JsonPrimitive(-1));
			}

			if (!obj.has("player_id")) {
				obj.add("player_id", new JsonPrimitive(-1));
			}

			return jsonDeserializationContext.deserialize(jsonElement, commandClass);
		}
	}
}
