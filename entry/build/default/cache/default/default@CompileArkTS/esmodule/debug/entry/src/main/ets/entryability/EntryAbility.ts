import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import { AppModel } from "@normalized:N&&&entry/src/main/ets/model/AppModel&";
import { PreferenceStore } from "@normalized:N&&&entry/src/main/ets/service/PreferenceStore&";
import { LiveViewCommandBus } from "@normalized:N&&&entry/src/main/ets/service/LiveViewCommandBus&";
import { SystemTrainingService } from "@normalized:N&&&entry/src/main/ets/service/SystemTrainingService&";
const DOMAIN = 0x0000;
const TAG = 'EmptyAbilitySmoke';
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(DOMAIN, TAG, 'EntryAbility onCreate. ability=%{public}s reason=%{public}d', want.abilityName ?? '', launchParam.launchReason);
        const action: string | undefined = want.parameters?.['liveViewAction'] as string | undefined;
        hilog.info(DOMAIN, TAG, 'EntryAbility onCreate liveViewAction=%{public}s restore=%{public}s', action ?? 'none', `${want.parameters?.['restoreTraining'] ?? 'false'}`);
        LiveViewCommandBus.dispatch(action);
    }
    onNewWant(want: Want, _launchParam: AbilityConstant.LaunchParam): void {
        const action: string | undefined = want.parameters?.['liveViewAction'] as string | undefined;
        hilog.info(DOMAIN, TAG, 'EntryAbility onNewWant. liveViewAction=%{public}s', action ?? 'none');
        hilog.info(DOMAIN, TAG, 'EntryAbility onNewWant restore=%{public}s', `${want.parameters?.['restoreTraining'] ?? 'false'}`);
        LiveViewCommandBus.dispatch(action);
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        hilog.info(DOMAIN, TAG, 'EntryAbility onWindowStageCreate.');
        PreferenceStore.init(this.context).then(() => {
            windowStage.loadContent('pages/Index', (err) => {
                if (err.code) {
                    hilog.error(DOMAIN, TAG, 'Failed to load pages/Index. code=%{public}d message=%{public}s', err.code, err.message);
                    return;
                }
                hilog.info(DOMAIN, TAG, 'pages/Index loaded.');
            });
        }).catch((error: Object) => {
            hilog.error(DOMAIN, TAG, 'Preference init failed: %{public}s', JSON.stringify(error));
            windowStage.loadContent('pages/Index', () => { });
        });
    }
    onWindowStageDestroy(): void {
        hilog.info(DOMAIN, TAG, 'EntryAbility onWindowStageDestroy.');
    }
    async onDestroy(): Promise<void> {
        const model: AppModel = AppModel.shared();
        const hadActiveTraining: boolean = model.activeTraining !== undefined && model.activeTraining.active;
        hilog.info(DOMAIN, TAG, 'EntryAbility onDestroy. activeTraining=%{public}s', `${hadActiveTraining}`);
        if (!hadActiveTraining) {
            return;
        }
        // Returning to the home screen only triggers onBackground and keeps the
        // workout alive. A real ability destruction is treated as an explicit app
        // close: stop the system card/background task and remove the persisted
        // session so the next launch starts from the home page.
        model.activeTraining = undefined;
        await PreferenceStore.save(model);
        try {
            await SystemTrainingService.stop(this.context);
            hilog.info(DOMAIN, TAG, 'Training session cleared on ability destroy.');
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Training stop on ability destroy failed: %{public}s', JSON.stringify(error));
        }
    }
    onForeground(): void {
        hilog.info(DOMAIN, TAG, 'EntryAbility onForeground.');
    }
    onBackground(): void {
        hilog.info(DOMAIN, TAG, 'EntryAbility onBackground.');
    }
}
