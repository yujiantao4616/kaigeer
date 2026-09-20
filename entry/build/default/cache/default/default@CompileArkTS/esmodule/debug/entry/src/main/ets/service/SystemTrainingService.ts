import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import wantAgent from "@ohos:app.ability.wantAgent";
import type { WantAgent } from "@ohos:app.ability.wantAgent";
import backgroundTaskManager from "@ohos:resourceschedule.backgroundTaskManager";
import liveViewManager from "@hms:core.liveview.liveViewManager";
import notificationManager from "@ohos:notificationManager";
import type { TrainingPhase } from '../model/AppModel';
export interface SystemTrainingState {
    phase: TrainingPhase;
    remaining: number;
    repetition: number;
    repetitions: number;
    trainingSet: number;
    setsPerDay: number;
    paused: boolean;
    // Live View is a phone-oriented surface. Wearables keep the continuous
    // task for background timing but do not publish the phone fallback card on
    // top of the compact training UI.
    wearable?: boolean;
}
const LIVE_VIEW_ID: number = 20880915;
const FALLBACK_NOTIFICATION_ID: number = LIVE_VIEW_ID + 1;
const COMPLETE_KEEP_TIME_SECONDS: number = 300;
const BUNDLE_NAME: string = 'com.kaigeer.training';
export class SystemTrainingService {
    // Live View and continuous-task calls are asynchronous. Queue them so a
    // pause -> resume or stop -> start cannot race and leave the old card
    // visible with the new workout's state.
    private static operation: Promise<void> = Promise.resolve();
    private static sequence: number = 0;
    private static backgroundRunning: boolean = false;
    private static liveViewStarted: boolean = false;
    private static liveViewEnabled: boolean = false;
    private static wantAgent: WantAgent | undefined;
    private static togglePauseAgent: WantAgent | undefined;
    private static completeActionAgent: WantAgent | undefined;
    private static fallbackNotificationId: number = -1;
    private static fallbackNotificationVisible: boolean = false;
    private static notificationPermissionChecked: boolean = false;
    private static stateSummary(state: SystemTrainingState): string {
        return `phase=${state.phase}, remaining=${state.remaining}, rep=${state.repetition}/${state.repetitions}, set=${state.trainingSet}/${state.setsPerDay}, paused=${state.paused}, seq=${SystemTrainingService.sequence}, enabled=${SystemTrainingService.liveViewEnabled}, started=${SystemTrainingService.liveViewStarted}`;
    }
    private static trace(message: string): void {
        console.info(`[LiveViewTrace] ${Date.now()} ${message}`);
    }
    static start(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`enqueue start: ${SystemTrainingService.stateSummary(state)}`);
        return SystemTrainingService.enqueue(() => SystemTrainingService.startInternal(context, state));
    }
    static update(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`enqueue update: ${SystemTrainingService.stateSummary(state)}`);
        return SystemTrainingService.enqueue(() => SystemTrainingService.updateInternal(context, state));
    }
    static stop(context: common.UIAbilityContext): Promise<void> {
        SystemTrainingService.trace(`enqueue stop: seq=${SystemTrainingService.sequence}, started=${SystemTrainingService.liveViewStarted}, enabled=${SystemTrainingService.liveViewEnabled}`);
        return SystemTrainingService.enqueue(() => SystemTrainingService.stopInternal(context));
    }
    static finish(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`enqueue finish: ${SystemTrainingService.stateSummary(state)}`);
        return SystemTrainingService.enqueue(() => SystemTrainingService.finishInternal(context, state));
    }
    private static enqueue(task: () => Promise<void>): Promise<void> {
        const queued: Promise<void> = SystemTrainingService.operation.then(task, task);
        SystemTrainingService.operation = queued.catch(() => { });
        return queued;
    }
    /**
     * Live View calls are system-service IPC. On a few phone builds an update
     * can remain pending when the card is being moved between the capsule and
     * lock screen. Never let that pending promise block the serialized queue;
     * the in-app timer must continue even when the card service is slow.
     */
    private static waitForLiveView(operation: Promise<liveViewManager.LiveViewResult>, timeoutMs: number, label: string): Promise<liveViewManager.LiveViewResult> {
        return new Promise<liveViewManager.LiveViewResult>((resolve: (value: liveViewManager.LiveViewResult | PromiseLike<liveViewManager.LiveViewResult>) => void, reject: (reason?: Object) => void) => {
            let settled: boolean = false;
            const timeoutId: number = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    SystemTrainingService.trace(`${label} timeout after ${timeoutMs}ms`);
                    reject(new Error(`${label} timeout`));
                }
            }, timeoutMs);
            operation.then((result: liveViewManager.LiveViewResult) => {
                if (settled) {
                    return;
                }
                settled = true;
                clearTimeout(timeoutId);
                SystemTrainingService.trace(`${label} settled resultCode=${result.resultCode}, message=${result.message}`);
                resolve(result);
            }).catch((error: Object) => {
                if (settled) {
                    return;
                }
                settled = true;
                clearTimeout(timeoutId);
                SystemTrainingService.trace(`${label} rejected: ${JSON.stringify(error)}`);
                reject(error);
            });
        });
    }
    private static async startInternal(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`startInternal begin: ${SystemTrainingService.stateSummary(state)}`);
        if (!SystemTrainingService.notificationPermissionChecked) {
            try {
                await notificationManager.requestEnableNotification(context);
            }
            catch (error) {
                console.error(`Training notification permission unavailable: ${JSON.stringify(error)}`);
            }
            SystemTrainingService.notificationPermissionChecked = true;
        }
        try {
            const agent: WantAgent = await SystemTrainingService.getWantAgent();
            if (!SystemTrainingService.backgroundRunning) {
                const taskNotification: backgroundTaskManager.ContinuousTaskNotification = await backgroundTaskManager.startBackgroundRunning(context, ['audioPlayback'], agent);
                // Keep the system continuous-task notification separate from the
                // app-owned status card. Reusing the task id can make the fallback
                // update invisible on some HarmonyOS builds.
                console.info(`Training continuous task notification=${taskNotification.notificationId}`);
                SystemTrainingService.fallbackNotificationId = FALLBACK_NOTIFICATION_ID;
                SystemTrainingService.backgroundRunning = true;
                SystemTrainingService.trace(`continuous task started: notificationId=${taskNotification.notificationId}`);
            }
        }
        catch (error) {
            console.error(`Training background task unavailable: ${JSON.stringify(error)}`);
        }
        if (state.wearable === true) {
            SystemTrainingService.liveViewEnabled = false;
            SystemTrainingService.liveViewStarted = false;
            SystemTrainingService.sequence = 0;
            if (SystemTrainingService.fallbackNotificationVisible && SystemTrainingService.fallbackNotificationId >= 0) {
                try {
                    await notificationManager.cancel(SystemTrainingService.fallbackNotificationId);
                }
                catch (error) {
                    console.info(`Wearable fallback notification cleanup skipped: ${JSON.stringify(error)}`);
                }
                SystemTrainingService.fallbackNotificationVisible = false;
                SystemTrainingService.fallbackNotificationId = -1;
            }
            return;
        }
        try {
            SystemTrainingService.liveViewEnabled = await liveViewManager.isLiveViewEnabled();
            SystemTrainingService.trace(`isLiveViewEnabled=${SystemTrainingService.liveViewEnabled}`);
        }
        catch (error) {
            SystemTrainingService.liveViewEnabled = false;
            console.error(`Live View unavailable: ${JSON.stringify(error)}`);
        }
        // Always start from a clean Live View. This also clears a card left by a
        // previous process or by a stop call that was still being delivered.
        if (SystemTrainingService.liveViewEnabled) {
            try {
                const agent: WantAgent = await SystemTrainingService.getWantAgent();
                await SystemTrainingService.clearActiveLiveView(agent);
            }
            catch (error) {
                console.info(`Live View preflight cleanup skipped: ${JSON.stringify(error)}`);
            }
        }
        SystemTrainingService.sequence = 1;
        SystemTrainingService.liveViewStarted = false;
        const liveViewPublished: boolean = await SystemTrainingService.publish(context, state, true);
        SystemTrainingService.trace(`startInternal publish result=${liveViewPublished}, ${SystemTrainingService.stateSummary(state)}`);
        if (!liveViewPublished) {
            await SystemTrainingService.publishFallback(context, state);
        }
    }
    private static async updateInternal(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`updateInternal begin: ${SystemTrainingService.stateSummary(state)}`);
        if (state.wearable === true) {
            return;
        }
        // If an earlier update discovered that the system card disappeared, try
        // to recreate it on the next state boundary before falling back to a
        // normal notification.
        if (SystemTrainingService.liveViewEnabled && !SystemTrainingService.liveViewStarted) {
            const restarted: boolean = await SystemTrainingService.publish(context, state, true);
            SystemTrainingService.trace(`updateInternal recreate result=${restarted}`);
            if (restarted) {
                return;
            }
        }
        if (SystemTrainingService.liveViewEnabled && SystemTrainingService.liveViewStarted) {
            SystemTrainingService.sequence += 1;
            const updated: boolean = await SystemTrainingService.publish(context, state, false);
            SystemTrainingService.trace(`updateInternal update result=${updated}, ${SystemTrainingService.stateSummary(state)}`);
            if (updated) {
                return;
            }
        }
        // If an update timed out or the system rejected its sequence, do not wait
        // for the next phase boundary. Recreate the card immediately so the
        // capsule does not remain frozen for the rest of the repetition.
        if (SystemTrainingService.liveViewEnabled) {
            const restarted: boolean = await SystemTrainingService.publish(context, state, true);
            SystemTrainingService.trace(`updateInternal recovery restart result=${restarted}`);
            if (restarted) {
                return;
            }
        }
        await SystemTrainingService.publishFallback(context, state);
    }
    private static async stopInternal(context: common.UIAbilityContext): Promise<void> {
        SystemTrainingService.trace(`stopInternal begin: seq=${SystemTrainingService.sequence}, started=${SystemTrainingService.liveViewStarted}, enabled=${SystemTrainingService.liveViewEnabled}`);
        if (SystemTrainingService.liveViewStarted || SystemTrainingService.liveViewEnabled) {
            try {
                const agent: WantAgent = await SystemTrainingService.getWantAgent();
                await SystemTrainingService.clearActiveLiveView(agent);
            }
            catch (error) {
                // No active card is a valid result when stopping after a failed start.
                console.info(`Live View stop cleanup skipped: ${JSON.stringify(error)}`);
            }
        }
        SystemTrainingService.liveViewStarted = false;
        SystemTrainingService.sequence = 0;
        SystemTrainingService.trace('stopInternal state reset');
        if (SystemTrainingService.backgroundRunning) {
            try {
                await backgroundTaskManager.stopBackgroundRunning(context);
            }
            catch (error) {
                console.error(`Training background task stop failed: ${JSON.stringify(error)}`);
            }
            SystemTrainingService.backgroundRunning = false;
        }
        if (SystemTrainingService.fallbackNotificationVisible && SystemTrainingService.fallbackNotificationId >= 0) {
            try {
                await notificationManager.cancel(SystemTrainingService.fallbackNotificationId);
            }
            catch (error) {
                console.error(`Training fallback notification stop failed: ${JSON.stringify(error)}`);
            }
            SystemTrainingService.fallbackNotificationVisible = false;
            SystemTrainingService.fallbackNotificationId = -1;
        }
    }
    private static async finishInternal(context: common.UIAbilityContext, state: SystemTrainingState): Promise<void> {
        SystemTrainingService.trace(`finishInternal begin: ${SystemTrainingService.stateSummary(state)}`);
        if (state.wearable === true) {
            SystemTrainingService.liveViewStarted = false;
            SystemTrainingService.liveViewEnabled = false;
            SystemTrainingService.sequence = 0;
            if (SystemTrainingService.backgroundRunning) {
                try {
                    await backgroundTaskManager.stopBackgroundRunning(context);
                }
                catch (error) {
                    console.error(`Training background task stop failed: ${JSON.stringify(error)}`);
                }
                SystemTrainingService.backgroundRunning = false;
            }
            return;
        }
        if (SystemTrainingService.liveViewStarted && SystemTrainingService.liveViewEnabled) {
            try {
                const agent: WantAgent = await SystemTrainingService.getWantAgent();
                const actionAgent: WantAgent = await SystemTrainingService.getActionWantAgent('completeAction');
                SystemTrainingService.sequence += 1;
                await SystemTrainingService.waitForLiveView(liveViewManager.stopLiveView(SystemTrainingService.buildLiveView(state, agent, -1, COMPLETE_KEEP_TIME_SECONDS, actionAgent)), 2000, 'finishLiveView');
                console.info(`Live View ${LIVE_VIEW_ID} completed with an action button`);
                SystemTrainingService.trace(`finishLiveView submitted: seq=${SystemTrainingService.sequence}`);
            }
            catch (error) {
                console.error(`Live View completion interaction failed: ${JSON.stringify(error)}`);
            }
        }
        SystemTrainingService.liveViewStarted = false;
        SystemTrainingService.sequence = 0;
        SystemTrainingService.trace('finishInternal state reset');
        if (SystemTrainingService.backgroundRunning) {
            try {
                await backgroundTaskManager.stopBackgroundRunning(context);
            }
            catch (error) {
                console.error(`Training background task stop failed: ${JSON.stringify(error)}`);
            }
            SystemTrainingService.backgroundRunning = false;
        }
        if (SystemTrainingService.fallbackNotificationVisible && SystemTrainingService.fallbackNotificationId >= 0) {
            try {
                await notificationManager.cancel(SystemTrainingService.fallbackNotificationId);
            }
            catch (error) {
                console.error(`Training fallback notification stop failed: ${JSON.stringify(error)}`);
            }
            SystemTrainingService.fallbackNotificationVisible = false;
            SystemTrainingService.fallbackNotificationId = -1;
        }
    }
    private static async clearActiveLiveView(agent: WantAgent): Promise<void> {
        let active: liveViewManager.LiveView;
        try {
            active = await liveViewManager.getActiveLiveView(LIVE_VIEW_ID);
        }
        catch (error) {
            // getActiveLiveView reports an error when the id does not exist. Treat
            // that as already clean so a new session can start normally.
            console.info(`Live View ${LIVE_VIEW_ID} is already inactive: ${JSON.stringify(error)}`);
            return;
        }
        const activeSequence: number = active.sequence === undefined ? 0 : active.sequence;
        SystemTrainingService.trace(`clearActiveLiveView found active sequence=${activeSequence}`);
        SystemTrainingService.sequence = Math.max(SystemTrainingService.sequence, activeSequence + 1);
        try {
            await SystemTrainingService.waitForLiveView(liveViewManager.stopLiveView(SystemTrainingService.buildLiveView({
                phase: 'complete', remaining: 0, repetition: 0, repetitions: 0,
                trainingSet: 0, setsPerDay: 0, paused: false
            }, agent, -1, 0)), 2000, 'stopLiveView');
        }
        catch (error) {
            console.error(`Live View ${LIVE_VIEW_ID} stop request failed: ${JSON.stringify(error)}`);
            throw error as Error;
        }
        console.info(`Live View ${LIVE_VIEW_ID} stopped before the next session`);
    }
    private static async publish(context: common.UIAbilityContext, state: SystemTrainingState, creating: boolean): Promise<boolean> {
        try {
            SystemTrainingService.trace(`publish begin creating=${creating}: ${SystemTrainingService.stateSummary(state)}`);
            const agent: WantAgent = await SystemTrainingService.getWantAgent();
            const actionName: string = state.phase === 'complete' ? 'completeAction' : 'togglePause';
            const actionAgent: WantAgent = await SystemTrainingService.getActionWantAgent(actionName);
            const view: liveViewManager.LiveView = SystemTrainingService.buildLiveView(state, agent, 1, 3600, actionAgent);
            if (creating) {
                try {
                    const startResult: liveViewManager.LiveViewResult = await SystemTrainingService.waitForLiveView(liveViewManager.startLiveView(view), 2000, 'startLiveView');
                    if (startResult.resultCode !== 0) {
                        throw new Error(`startLiveView resultCode=${startResult.resultCode}, message=${startResult.message}`);
                    }
                    SystemTrainingService.liveViewStarted = true;
                    SystemTrainingService.trace(`startLiveView success: resultCode=${startResult.resultCode}, seq=${SystemTrainingService.sequence}`);
                    return true;
                }
                catch (error) {
                    // Retry once after removing a stale card. Updating the old card here
                    // would carry its sequence/content into a new workout.
                    try {
                        await SystemTrainingService.clearActiveLiveView(agent);
                        SystemTrainingService.sequence = 1;
                        const retryResult: liveViewManager.LiveViewResult = await SystemTrainingService.waitForLiveView(liveViewManager.startLiveView(SystemTrainingService.buildLiveView(state, agent, 1, 3600, actionAgent)), 2000, 'startLiveView retry');
                        if (retryResult.resultCode !== 0) {
                            throw new Error(`startLiveView retry resultCode=${retryResult.resultCode}, message=${retryResult.message}`);
                        }
                        SystemTrainingService.liveViewStarted = true;
                        SystemTrainingService.trace(`startLiveView retry success: resultCode=${retryResult.resultCode}, seq=${SystemTrainingService.sequence}`);
                        return true;
                    }
                    catch (recoveryError) {
                        console.error(`Live View fresh-start retry failed: ${JSON.stringify(recoveryError)}`);
                    }
                    console.error(`Live View start failed: ${JSON.stringify(error)}`);
                    return false;
                }
            }
            const result: liveViewManager.LiveViewResult = await SystemTrainingService.waitForLiveView(liveViewManager.updateLiveView(view), 2000, 'updateLiveView');
            if (result.resultCode !== 0) {
                throw new Error(`updateLiveView resultCode=${result.resultCode}, message=${result.message}`);
            }
            SystemTrainingService.trace(`updateLiveView success: resultCode=${result.resultCode}, seq=${SystemTrainingService.sequence}`);
            return true;
        }
        catch (error) {
            if (!creating) {
                // Re-read the system-owned sequence before giving up. A timed-out
                // IPC request may still have completed after our local timeout, so
                // blindly incrementing the local counter can make every later update
                // fail with 1003500011 (sequence incorrect).
                try {
                    const active: liveViewManager.LiveView = await liveViewManager.getActiveLiveView(LIVE_VIEW_ID);
                    const activeSequence: number = active.sequence === undefined ? 0 : active.sequence;
                    SystemTrainingService.sequence = Math.max(1, activeSequence + 1);
                    const recoveryActionName: string = state.phase === 'complete' ? 'completeAction' : 'togglePause';
                    const recoveryAgent: WantAgent = await SystemTrainingService.getActionWantAgent(recoveryActionName);
                    const recoveryView: liveViewManager.LiveView = SystemTrainingService.buildLiveView(state, await SystemTrainingService.getWantAgent(), 1, 3600, recoveryAgent);
                    const recoveryResult: liveViewManager.LiveViewResult = await SystemTrainingService.waitForLiveView(liveViewManager.updateLiveView(recoveryView), 2000, 'updateLiveView resync');
                    if (recoveryResult.resultCode === 0) {
                        SystemTrainingService.liveViewStarted = true;
                        SystemTrainingService.trace(`updateLiveView resync success: resultCode=${recoveryResult.resultCode}, seq=${SystemTrainingService.sequence}`);
                        return true;
                    }
                    console.error(`Live View resync resultCode=${recoveryResult.resultCode}, message=${recoveryResult.message}`);
                }
                catch (recoveryError) {
                    console.error(`Live View update resync failed: ${JSON.stringify(recoveryError)}`);
                }
                // The active card may have ended or disappeared. Let updateInternal
                // perform one clean stop/start cycle before falling back to a normal
                // ongoing notification.
                SystemTrainingService.liveViewStarted = false;
            }
            SystemTrainingService.trace(`publish failed creating=${creating}, seq=${SystemTrainingService.sequence}, error=${JSON.stringify(error)}`);
            console.error(`Live View publish failed: ${JSON.stringify(error)}`);
            return false;
        }
    }
    private static async publishFallback(context: common.UIAbilityContext, state: SystemTrainingState): Promise<boolean> {
        if (SystemTrainingService.fallbackNotificationId < 0) {
            return false;
        }
        try {
            const agent: WantAgent = await SystemTrainingService.getWantAgent();
            const phaseShort: string = SystemTrainingService.phaseShortLabel(state.phase);
            const timerSeconds: number = Math.max(0, state.remaining);
            const totalSets: number = Math.max(1, state.setsPerDay);
            const totalRepetitions: number = Math.max(1, state.repetitions);
            const currentSet: number = Math.min(totalSets, Math.max(1, state.trainingSet));
            const currentRepetition: number = state.phase === 'ready'
                ? 0
                : Math.min(totalRepetitions, state.repetition + (state.phase === 'relax' ? 1 : 0));
            const setText: string = `第${currentSet}/${totalSets}组`;
            const repetitionText: string = state.phase === 'ready'
                ? '准备开始'
                : `第${currentRepetition}/${totalRepetitions}次`;
            const text: string = state.paused
                ? '已暂停 · 点击通知继续训练'
                : `${phaseShort} · ${setText} · ${repetitionText} · ${timerSeconds}秒`;
            const request: notificationManager.NotificationRequest = {
                id: SystemTrainingService.fallbackNotificationId,
                content: {
                    notificationContentType: notificationManager.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT,
                    normal: {
                        title: '凯格尔训练',
                        text,
                        additionalText: '训练在后台继续，点击可回到训练页'
                    }
                },
                notificationSlotType: notificationManager.SlotType.SERVICE_INFORMATION,
                wantAgent: agent,
                isAlertOnce: true,
                isOngoing: true,
                tapDismissed: false
            };
            await notificationManager.publish(request);
            SystemTrainingService.fallbackNotificationVisible = true;
            return true;
        }
        catch (error) {
            console.error(`Training fallback notification publish failed: ${JSON.stringify(error)}`);
            return false;
        }
    }
    private static async getActionWantAgent(action: string): Promise<WantAgent> {
        if (action === 'togglePause' && SystemTrainingService.togglePauseAgent !== undefined) {
            return SystemTrainingService.togglePauseAgent;
        }
        if (action === 'completeAction' && SystemTrainingService.completeActionAgent !== undefined) {
            return SystemTrainingService.completeActionAgent;
        }
        const actionOffset: number = action === 'completeAction' ? 2 : 1;
        const info: wantAgent.WantAgentInfo = {
            wants: [{
                    bundleName: BUNDLE_NAME,
                    abilityName: 'EntryAbility',
                    parameters: { restoreTraining: 'true', liveViewAction: action }
                } as Want],
            actionType: wantAgent.OperationType.START_ABILITY,
            requestCode: LIVE_VIEW_ID + actionOffset,
            wantAgentFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG]
        };
        let agent: WantAgent;
        try {
            agent = await wantAgent.getWantAgent(info);
        }
        catch (error) {
            console.error(`Training action WantAgent unavailable: ${JSON.stringify(error)}`);
            throw error as Error;
        }
        if (action === 'completeAction') {
            SystemTrainingService.completeActionAgent = agent;
        }
        else {
            SystemTrainingService.togglePauseAgent = agent;
        }
        return agent;
    }
    private static async getWantAgent(): Promise<WantAgent> {
        if (SystemTrainingService.wantAgent !== undefined) {
            return SystemTrainingService.wantAgent;
        }
        const info: wantAgent.WantAgentInfo = {
            wants: [{
                    bundleName: BUNDLE_NAME,
                    abilityName: 'EntryAbility',
                    parameters: { restoreTraining: 'true' }
                } as Want],
            actionType: wantAgent.OperationType.START_ABILITY,
            requestCode: LIVE_VIEW_ID,
            wantAgentFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG]
        };
        try {
            SystemTrainingService.wantAgent = await wantAgent.getWantAgent(info);
            return SystemTrainingService.wantAgent;
        }
        catch (error) {
            console.error(`Training WantAgent unavailable: ${JSON.stringify(error)}`);
            throw error as Error;
        }
    }
    private static phaseLabel(phase: TrainingPhase): string {
        if (phase === 'tighten') {
            return '向上提起';
        }
        if (phase === 'relax') {
            return '放松释放';
        }
        if (phase === 'complete') {
            return '已完成';
        }
        return '准备';
    }
    /**
     * The capsule has very little horizontal space. Keep its phase label short
     * and leave the detailed coaching copy to the expanded card/lock screen.
     */
    private static phaseShortLabel(phase: TrainingPhase): string {
        if (phase === 'tighten') {
            return '收紧';
        }
        if (phase === 'relax') {
            return '放松';
        }
        if (phase === 'complete') {
            return '完成';
        }
        return '准备';
    }
    private static phaseHint(phase: TrainingPhase, paused: boolean): string {
        if (paused) {
            return '已暂停 · 点击继续';
        }
        if (phase === 'tighten') {
            return '自然呼吸 · 腹部和臀部放松';
        }
        if (phase === 'relax') {
            return '完全放松 · 保持呼吸';
        }
        if (phase === 'complete') {
            return '点击按钮继续下一组或完成训练';
        }
        return '准备开始 · 保持自然呼吸';
    }
    private static buildLiveView(state: SystemTrainingState, agent: WantAgent, status: number, keepTime: number = 3600, actionAgent?: WantAgent): liveViewManager.LiveView {
        const phase: string = SystemTrainingService.phaseLabel(state.phase);
        const phaseShort: string = SystemTrainingService.phaseShortLabel(state.phase);
        const timerSeconds: number = Math.max(0, state.remaining);
        const totalSets: number = Math.max(1, state.setsPerDay);
        const totalRepetitions: number = Math.max(1, state.repetitions);
        const currentSet: number = Math.min(totalSets, Math.max(1, state.trainingSet));
        const currentRepetition: number = state.phase === 'ready'
            ? 0
            : Math.min(totalRepetitions, state.repetition + (state.phase === 'relax' ? 1 : 0));
        const compactSetText: string = `${currentSet}/${totalSets}组`;
        // The progress bar is intentionally scoped to the current set.  A single
        // bar that combines every repetition in the day is hard to read at a
        // glance, especially from the capsule/lock screen.  The text carries the
        // second dimension (today's set progress) explicitly.
        const progressText: string = state.phase === 'ready'
            ? `本组 准备开始 · 今日 ${currentSet}/${totalSets}组`
            : `本组 ${currentRepetition}/${totalRepetitions}次 · 今日 ${currentSet}/${totalSets}组`;
        const hintText: string = SystemTrainingService.phaseHint(state.phase, state.paused);
        const progress: number = Math.round(currentRepetition * 100 / totalRepetitions);
        const actionName: string = state.phase === 'complete'
            ? (currentSet < totalSets ? '继续下一组' : '完成训练')
            : (state.paused ? '继续' : '暂停');
        // Some 6.1 progress-template builds accept serviceButtons in the payload
        // but do not render them. Put the same action in the extension area as a
        // capsule-style control so the pause/resume or completion action remains
        // visible and tappable on those devices.
        const extensionActionText: string = state.phase === 'complete'
            ? actionName
            : (state.paused ? '继续训练' : '暂停训练');
        return {
            id: LIVE_VIEW_ID,
            // WORKOUT maps this card to HarmonyOS' exercise/training scene. The
            // app still uses the timer payload so the capsule itself counts down
            // once per second without requiring an update call for every tick.
            event: 'WORKOUT',
            sequence: SystemTrainingService.sequence,
            isMute: true,
            timer: {
                time: timerSeconds * 1000,
                isCountdown: true,
                isPaused: state.paused
            },
            liveViewData: {
                primary: {
                    title: state.paused ? '已暂停' : `${phaseShort} · \${placeholder.timer}`,
                    content: [{ text: progressText }],
                    keepTime,
                    clickAction: agent,
                    extensionData: {
                        text: extensionActionText,
                        type: liveViewManager.ExtensionType.EXTENSION_TYPE_CAPSULE_TEXT,
                        clickAction: actionAgent === undefined ? agent : actionAgent
                    },
                    layoutData: {
                        layoutType: liveViewManager.LayoutType.LAYOUT_TYPE_PROGRESS,
                        progress,
                        color: '#FF087F73',
                        backgroundColor: '#26087F73',
                        indicatorType: liveViewManager.IndicatorType.INDICATOR_TYPE_UNDISPLAYED,
                        lineType: liveViewManager.LineType.LINE_TYPE_THICK_SOLID_LINE,
                        nodeIcons: ['live_view_lock.png', 'live_view_lock.png']
                    },
                    liveViewLockScreenAbilityName: 'LiveViewLockScreenExtAbility',
                    liveViewLockScreenAbilityParameters: {
                        phase,
                        progress: progressText,
                        remaining: `${timerSeconds}`,
                        hint: hintText
                    }
                },
                capsule: {
                    type: liveViewManager.CapsuleType.CAPSULE_TYPE_TIMER,
                    status,
                    icon: 'live_view_lock.png',
                    title: '凯格尔训练',
                    content: state.paused
                        ? '暂停'
                        : state.phase === 'ready'
                            ? `准备 · ${compactSetText}`
                            : `${phaseShort} · ${currentRepetition}/${totalRepetitions}次`,
                    time: timerSeconds * 1000,
                    isCountdown: true,
                    isPaused: state.paused,
                    isContentDisplayed: true,
                    backgroundColor: '#FF087F73'
                }
            }
        };
    }
}
