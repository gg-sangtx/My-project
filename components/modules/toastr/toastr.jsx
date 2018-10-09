import { Position, Toaster, Intent } from "@blueprintjs/core";
import { msg } from 'constants/message';

const OurToaster = Toaster.create({
    className: "my-toaster",
    position: Position.TOP_LEFT,
});

let timeShow = 2000;

const Toastr = (message, type) => {
	switch (type) {
		case 'success':
			OurToaster.show({ message: typeof message == 'string' ? message : msg.systemFail, intent: Intent.SUCCESS, timeout: timeShow, iconName: 'tick'});
		break;
		case 'error':
			OurToaster.show({ message: typeof message == 'string' ? message : msg.systemFail, intent: Intent.DANGER, timeout: timeShow, iconName: 'warning-sign'});
		break;
		case 'primary':
			OurToaster.show({ message: typeof message == 'string' ? message : msg.systemFail, intent: Intent.PRIMARY, timeout: timeShow});
		break;
		case 'warning':
			OurToaster.show({ message: typeof message == 'string' ? message : msg.systemFail, intent: Intent.WARNING, timeout: timeShow, iconName: 'warning-sign'});
		break;
		default:
			OurToaster.show({ message: typeof message == 'string' ? message : msg.systemFail, timeout: timeShow});
		break;
	}
}

export default Toastr;