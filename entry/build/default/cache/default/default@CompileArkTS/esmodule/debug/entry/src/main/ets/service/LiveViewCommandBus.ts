export type LiveViewCommand = 'togglePause' | 'completeAction';
type LiveViewCommandListener = (command: LiveViewCommand) => void;
/**
 * Bridges a Live View service-button WantAgent back to the visible training
 * page. A pending command is retained while the ability window is being
 * created, so a tap from the background is not lost during cold start.
 */
export class LiveViewCommandBus {
    private static listener: LiveViewCommandListener | undefined;
    private static pending: LiveViewCommand | undefined;
    static dispatch(command: string | undefined): void {
        if (command !== 'togglePause' && command !== 'completeAction') {
            console.info(`[LiveViewCommand] ignored command=${command ?? 'undefined'}`);
            return;
        }
        const typedCommand: LiveViewCommand = command as LiveViewCommand;
        console.info(`[LiveViewCommand] dispatch command=${typedCommand}, listener=${LiveViewCommandBus.listener !== undefined}`);
        if (LiveViewCommandBus.listener !== undefined) {
            LiveViewCommandBus.listener(typedCommand);
            return;
        }
        LiveViewCommandBus.pending = typedCommand;
        console.info(`[LiveViewCommand] pending command=${typedCommand}`);
    }
    static attach(listener: LiveViewCommandListener): void {
        LiveViewCommandBus.listener = listener;
        console.info(`[LiveViewCommand] listener attached, pending=${LiveViewCommandBus.pending ?? 'none'}`);
        if (LiveViewCommandBus.pending !== undefined) {
            const command: LiveViewCommand = LiveViewCommandBus.pending;
            LiveViewCommandBus.pending = undefined;
            console.info(`[LiveViewCommand] delivering pending command=${command}`);
            listener(command);
        }
    }
}
