import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { ActiveTraining, AppModel, AppSnapshot, DEFAULT_PLAN, DEFAULT_REMINDERS, DEFAULT_THEME_COLOR, DailyProgress, TrainingPlan, ReminderSettings, clonePlan, cloneProgressList, ThemeColor, TrainingPhase } from '../model/AppModel';
import { WearableSharedPayload, WearableSyncService } from './WearableSyncService';

export class PreferenceStore {
  private static prefs: preferences.Preferences | undefined;

  static async init(context: common.UIAbilityContext): Promise<void> {
    try {
      PreferenceStore.prefs = await preferences.getPreferences(context, 'kaigeer_training');
      const saved: string = await PreferenceStore.prefs.get('snapshot', '') as string;
      if (saved.length > 0) {
        const data: AppSnapshot = JSON.parse(saved) as AppSnapshot;
        const model: AppModel = AppModel.shared();
        model.plan = data.plan ? new TrainingPlan(data.plan.tightenSeconds, data.plan.relaxSeconds, data.plan.repetitions, data.plan.setsPerDay) : new TrainingPlan(DEFAULT_PLAN.tightenSeconds, DEFAULT_PLAN.relaxSeconds, DEFAULT_PLAN.repetitions, DEFAULT_PLAN.setsPerDay);
        // Migrate snapshots created by older builds that stored an unsupported
        // language. Keep existing users on Chinese unless they chose English.
        const storedVoice: string = data.voiceLanguage as string;
        model.voiceLanguage = storedVoice === 'en-US' ? 'en-US' : 'zh-CN';
        model.themeColor = data.themeColor ?? DEFAULT_THEME_COLOR;
        model.darkMode = data.darkMode ?? false;
        model.hapticsEnabled = data.hapticsEnabled ?? false;
        model.reminders = data.reminders ? new ReminderSettings(data.reminders.enabled, data.reminders.times.slice()) : new ReminderSettings(DEFAULT_REMINDERS.enabled, DEFAULT_REMINDERS.times.slice());
        model.progress = data.progress ? cloneProgressList(data.progress) : [];
        model.activeTraining = data.activeTraining ? new ActiveTraining(data.activeTraining.active, data.activeTraining.phase as TrainingPhase, data.activeTraining.remaining, data.activeTraining.repetition, data.activeTraining.trainingSet, data.activeTraining.paused, data.activeTraining.startedAt, data.activeTraining.updatedAt) : undefined;
        model.customPrimary = data.customPrimary && /^#[0-9A-Fa-f]{6}$/.test(data.customPrimary) ? data.customPrimary.toUpperCase() : '#087F73';
      }
      // The phone and wearable share only plan/history through the optional
      // distributed store. Theme, reminders and active session remain local.
      await WearableSyncService.init(context, (payload: WearableSharedPayload): void => {
        const model: AppModel = AppModel.shared();
        model.plan = clonePlan(payload.plan);
        model.progress = cloneProgressList(payload.progress);
        PreferenceStore.saveLocal(model).catch((error: Object) => {
          console.info(`Remote wearable state local save skipped: ${JSON.stringify(error)}`);
        });
      });
    } catch (error) {
      console.error(`PreferenceStore init failed: ${JSON.stringify(error)}`);
    }
  }

  static async save(model: AppModel = AppModel.shared()): Promise<void> {
    await PreferenceStore.saveLocal(model);
    await WearableSyncService.publish(model);
  }

  /** Persist locally without publishing again when a remote snapshot arrives. */
  static async saveLocal(model: AppModel = AppModel.shared()): Promise<void> {
    if (!PreferenceStore.prefs) {
      return;
    }
    try {
      await PreferenceStore.prefs.put('snapshot', JSON.stringify(model.snapshot()));
      await PreferenceStore.prefs.flush();
    } catch (error) {
      console.error(`PreferenceStore save failed: ${JSON.stringify(error)}`);
    }
  }
}
