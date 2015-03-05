interface Message {
	command : string;
}

interface AcceptJoinGameMessage extends Message {
	payload : {
		player_id : number;
		acknowledgement_timeout : number;
		move_timeout : number;
	}
}

interface RejectJoinGameMessage extends Message {
	payload : string;
}

interface PlayersJoinedMessage extends Message {
	payload : Array<Array<number, string>>;
}

interface PingMessage extends Message {
	player_id : number;
}

interface InitialiseGameMessage extends Message {
	payload : {
		version : number;
		supported_features : Array<string>;
	}
}

interface RollResultMessage extends Message {
	payload : number;
	player_id : number;
}

interface SetupMessage extends Message {
	payload : number;
	player_id : number;
}

interface PlayCardsMessage extends Message {
	payload : {
		cards : Array<Array<number, number, number>>;
		armies : number;
	}
	player_id : number;
}

interface DrawCardMessage extends  Message {
	payload : number;
	player_id : number;
}

interface DeployMessage extends Message {
	payload : Array<Array<number, number>>;
	player_id : number;
}

interface AttackMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

interface DefendMessage extends Message {
	payload : number;
	player_id : number;
}

interface AttackCaptureMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

interface FortifyMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

interface TimeoutMessage extends Message {
	payload : number;
	player_id : number;
}

interface LeaveGameMessage extends Message {
	payload : {
		response : number;
		receive_updates : boolean;
	}
}
