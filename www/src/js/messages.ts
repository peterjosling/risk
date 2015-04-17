export interface Message {
	command : string;
}

export interface JoinGameMessage extends Message {
	payload : {
		supported_versions : Array<number>;
		supported_features : Array<string>;
		name : string;
	}
}

export interface AcceptJoinGameMessage extends Message {
	payload : {
		player_id : number;
		acknowledgement_timeout : number;
		move_timeout : number;
	}
}

export interface RejectJoinGameMessage extends Message {
	payload : string;
}

export interface PlayersJoinedMessage extends Message {
	payload : Array<Array<number, string>>;
}

export interface PingMessage extends Message {
	player_id : number;
}

export interface InitialiseGameMessage extends Message {
	payload : {
		version : number;
		supported_features : Array<string>;
	}
}

export interface RollResultMessage extends Message {
	payload : number;
	player_id : number;
}

export interface SetupMessage extends Message {
	payload : number;
	player_id : number;
}

export interface PlayCardsMessage extends Message {
	payload : {
		cards : Array<Array<number, number, number>>;
		armies : number;
	}
	player_id : number;
}

export interface DrawCardMessage extends Message {
	payload : number;
	player_id : number;
}

export interface DeployMessage extends Message {
	payload : Array<Array<number, number>>;
	player_id : number;
}

export interface AttackMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

export interface DefendMessage extends Message {
	payload : number;
	player_id : number;
}

export interface AttackCaptureMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

export interface FortifyMessage extends Message {
	payload : Array<number, number, number>;
	player_id : number;
}

export interface TimeoutMessage extends Message {
	payload : number;
	player_id : number;
}

export interface LeaveGameMessage extends Message {
	payload : {
		response : number;
		receive_updates : boolean;
	}
}
