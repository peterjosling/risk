package uk.ac.standrews.cs.cs3099.risk.commands;

import com.google.gson.*;

import java.lang.reflect.Type;

public class ReadyCommand extends Command {
	private String command = "ready";
	private Object payload = null;

	public ReadyCommand(int playerId, int ackId)
	{
		super(playerId, ackId);
	}

	@Override
	public CommandType getType()
	{
		return CommandType.READY;
	}

	public static class ReadyCommandSerializer implements JsonSerializer<ReadyCommand> {
		@Override
		public JsonElement serialize(ReadyCommand command, Type type, JsonSerializationContext jsonSerializationContext)
		{
			JsonObject result = new JsonObject();
			result.add("command", new JsonPrimitive("ready"));

			int playerId = command.getPlayerId();
			int ackId = command.getAckId();

			// Serialise player_id = -1 as null (host).
			if (playerId == -1) {
				result.add("player_id", JsonNull.INSTANCE);
			} else {
				result.add("player_id", new JsonPrimitive(playerId));
			}
			result.add("payload", JsonNull.INSTANCE);
			result.add("ack_id", new JsonPrimitive(ackId));
			return result;
		}
	}

	public static class ReadyCommandDeserializer implements JsonDeserializer<ReadyCommand> {
		@Override
		public ReadyCommand deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
			JsonObject obj = jsonElement.getAsJsonObject();

			// If the player_id field is null, change it to -1 before we deserialize.
			JsonElement playerId = obj.get("player_id");

			if (playerId.isJsonNull()) {
				obj.add("player_id", new JsonPrimitive(-1));
			}

			ReadyCommand ready = new ReadyCommand(obj.get("player_id").getAsInt(), obj.get("ack_id").getAsInt());

			return ready;
		}
	}
}
