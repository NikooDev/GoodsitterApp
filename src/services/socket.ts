import io from 'socket.io-client';
import { Api } from '@Config/api';

const wsOptions = {
	url: Api,
	config: {
		path: '/ws',
		autoConnect: false,
		reconnection: true,
		transports: ['websocket', 'polling']
	}
}

const Ws  = io(wsOptions.url, {...wsOptions.config})

export default Ws
