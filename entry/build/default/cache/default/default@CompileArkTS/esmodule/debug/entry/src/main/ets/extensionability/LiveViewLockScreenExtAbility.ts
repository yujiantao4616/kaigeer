import LiveViewLockScreenExtensionAbility from "@hms:core.liveview.LiveViewLockScreenExtensionAbility";
import type UIExtensionContentSession from "@ohos:app.ability.UIExtensionContentSession";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
const DOMAIN: number = 0x0000;
const TAG: string = 'KaigeerLiveViewLockScreen';
/**
 * Immersive lock-screen surface used by the system Live View service.
 *
 * This is intentionally a small, self-contained extension process. It does
 * not use notification/window/background APIs; the system owns its lifetime
 * and displays it only when the user expands the Live View on the lock screen.
 */
export default class LiveViewLockScreenExtAbility extends LiveViewLockScreenExtensionAbility {
    onCreate(): void {
        hilog.info(DOMAIN, TAG, 'Live View lock-screen extension created.');
    }
    onSessionCreate(want: Want, session: UIExtensionContentSession): void {
        const parameters = want?.parameters;
        const storageParams: Record<string, Object> = { 'session': session };
        const storage: LocalStorage = new LocalStorage(storageParams);
        storage.setOrCreate('phase', parameters?.['phase'] as string ?? '训练进行中');
        storage.setOrCreate('progress', parameters?.['progress'] as string ?? '训练进度');
        storage.setOrCreate('remaining', parameters?.['remaining'] as string ?? '');
        storage.setOrCreate('hint', parameters?.['hint'] as string ?? '保持自然呼吸 · 腹部和臀部放松');
        try {
            session.loadContent('pages/LiveViewLockScreenPage', storage);
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to load lock-screen page: %{public}s', JSON.stringify(error));
        }
    }
    onSessionDestroy(_session: UIExtensionContentSession): void {
        hilog.info(DOMAIN, TAG, 'Live View lock-screen session destroyed.');
    }
}
