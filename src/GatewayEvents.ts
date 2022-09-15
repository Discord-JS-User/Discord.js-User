import Session from "./Classes/ClientUser/Session";
import WebSocket from "ws";
import ChannelMemberListManager from "./AppElements/MemberList/ChannelMemberListManager";

/** The events for the Client Connection */
type GatewayEvents = {
	open: (openEvent: WebSocket.Event) => void;
	close: (closeEvent: WebSocket.CloseEvent) => void;
	disconnect: () => void;
	error: (error: WebSocket.ErrorEvent) => void;
	message: (data: any) => void;
	ready: (readyData: object) => void;
	guild_member_list_update: (data: ChannelMemberListManager[]) => void;
	sessions_replace: (sessions: Session[]) => void;
};

export default GatewayEvents;
