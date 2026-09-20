export type AppPage = 'home' | 'train' | 'plan' | 'calendar' | 'intro' | 'settings';
/** Languages currently supported by the app's voice guidance. */
export type VoiceLanguage = 'zh-CN' | 'en-US';
export type ThemeColor = 'teal' | 'blue' | 'purple' | 'orange' | 'rose' | 'green' | 'custom';
export type TrainingPhase = 'ready' | 'tighten' | 'relax' | 'complete';

export class TrainingPlan {
  tightenSeconds: number;
  relaxSeconds: number;
  repetitions: number;
  setsPerDay: number;

  constructor(tightenSeconds: number = 5, relaxSeconds: number = 5, repetitions: number = 10, setsPerDay: number = 3) {
    this.tightenSeconds = tightenSeconds;
    this.relaxSeconds = relaxSeconds;
    this.repetitions = repetitions;
    this.setsPerDay = setsPerDay;
  }
}

export class DailyProgress {
  dateKey: string;
  completedSets: number;
  // A completed tighten + relax pair counts as one repetition. Keep this
  // separate from completedSets so the statistics view can show exact volume
  // without being tied to the number of daily sets.
  completedRepetitions: number;
  totalSeconds: number;
  lastCompletedAt: string;

  constructor(dateKey: string, completedSets: number = 0, totalSeconds: number = 0,
    lastCompletedAt: string = '', completedRepetitions: number = 0) {
    this.dateKey = dateKey;
    this.completedSets = completedSets;
    this.completedRepetitions = completedRepetitions;
    this.totalSeconds = totalSeconds;
    this.lastCompletedAt = lastCompletedAt;
  }
}

export class ReminderSettings {
  enabled: boolean;
  times: Array<string>;

  constructor(enabled: boolean = false, times: Array<string> = ['08:00', '18:00', '21:00']) {
    this.enabled = enabled;
    this.times = times;
  }
}

export class ActiveTraining {
  active: boolean;
  phase: TrainingPhase;
  remaining: number;
  repetition: number;
  trainingSet: number;
  paused: boolean;
  startedAt: number;
  updatedAt: number;

  constructor(active: boolean = false, phase: TrainingPhase = 'ready', remaining: number = 3,
    repetition: number = 0, trainingSet: number = 1, paused: boolean = false,
    startedAt: number = 0, updatedAt: number = 0) {
    this.active = active;
    this.phase = phase;
    this.remaining = remaining;
    this.repetition = repetition;
    this.trainingSet = trainingSet;
    this.paused = paused;
    this.startedAt = startedAt;
    this.updatedAt = updatedAt;
  }
}

export class AppSnapshot {
  plan: TrainingPlan;
  voiceLanguage: VoiceLanguage;
  themeColor: ThemeColor;
  darkMode: boolean;
  reminders: ReminderSettings;
  progress: Array<DailyProgress>;
  activeTraining?: ActiveTraining;
  customPrimary?: string;
  hapticsEnabled: boolean;

  constructor(plan: TrainingPlan, voiceLanguage: VoiceLanguage, themeColor: ThemeColor, reminders: ReminderSettings, progress: Array<DailyProgress>, activeTraining?: ActiveTraining, customPrimary?: string, darkMode: boolean = false) {
    this.plan = plan;
    this.voiceLanguage = voiceLanguage;
    this.themeColor = themeColor;
    this.darkMode = darkMode;
    this.reminders = reminders;
    this.progress = progress;
    this.activeTraining = activeTraining;
    this.customPrimary = customPrimary;
    this.hapticsEnabled = false;
  }
}

export function clonePlan(plan: TrainingPlan): TrainingPlan {
  return new TrainingPlan(plan.tightenSeconds, plan.relaxSeconds, plan.repetitions, plan.setsPerDay);
}

export function cloneProgress(item: DailyProgress): DailyProgress {
  // Older preference snapshots do not have completedRepetitions. Treat those
  // records as zero rather than failing to load the rest of the snapshot.
  return new DailyProgress(item.dateKey, item.completedSets, item.totalSeconds, item.lastCompletedAt,
    item.completedRepetitions ?? 0);
}

export function cloneProgressList(items: Array<DailyProgress>): Array<DailyProgress> {
  return items.map((item: DailyProgress) => cloneProgress(item));
}

export const DEFAULT_PLAN: TrainingPlan = new TrainingPlan();
export const DEFAULT_THEME_COLOR: ThemeColor = 'teal';
export const DEFAULT_REMINDERS: ReminderSettings = new ReminderSettings();

export function todayKey(): string {
  return formatDateKey(new Date());
}

export function formatDateKey(value: Date): string {
  const year: number = value.getFullYear();
  const month: string = String(value.getMonth() + 1).padStart(2, '0');
  const day: string = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class AppModel {
  private static instance: AppModel | undefined;
  plan: TrainingPlan = new TrainingPlan();
  voiceLanguage: VoiceLanguage = 'zh-CN';
  themeColor: ThemeColor = DEFAULT_THEME_COLOR;
  darkMode: boolean = false;
  reminders: ReminderSettings = new ReminderSettings();
  progress: Array<DailyProgress> = [];
  activeTraining: ActiveTraining | undefined;
  customPrimary: string = '#087F73';
  hapticsEnabled: boolean = false;

  static shared(): AppModel {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel();
    }
    return AppModel.instance;
  }

  progressFor(dateKey: string): DailyProgress {
    const existing: DailyProgress | undefined = this.progress.find((item: DailyProgress) => item.dateKey === dateKey);
    return existing ?? new DailyProgress(dateKey);
  }

  recordSet(seconds: number, dateKey: string = todayKey()): void {
    const current: DailyProgress = this.progressFor(dateKey);
    const completedRepetitions: number = Math.max(0, current.completedRepetitions ?? 0);
    const repetitionsInSet: number = Math.max(0, this.plan.repetitions);
    const next: DailyProgress = new DailyProgress(dateKey,
      Math.min(this.plan.setsPerDay, current.completedSets + 1),
      current.totalSeconds + seconds,
      new Date().toLocaleTimeString(),
      completedRepetitions + repetitionsInSet);
    const index: number = this.progress.findIndex((item: DailyProgress) => item.dateKey === dateKey);
    if (index >= 0) {
      this.progress[index] = next;
    } else {
      this.progress.push(next);
    }
  }

  snapshot(): AppSnapshot {
    const session: ActiveTraining | undefined = this.activeTraining === undefined ? undefined : new ActiveTraining(this.activeTraining.active, this.activeTraining.phase, this.activeTraining.remaining, this.activeTraining.repetition, this.activeTraining.trainingSet, this.activeTraining.paused, this.activeTraining.startedAt, this.activeTraining.updatedAt);
    const snapshot: AppSnapshot = new AppSnapshot(clonePlan(this.plan), this.voiceLanguage, this.themeColor, new ReminderSettings(this.reminders.enabled, this.reminders.times.slice()), cloneProgressList(this.progress), session, this.customPrimary, this.darkMode);
    snapshot.hapticsEnabled = this.hapticsEnabled;
    return snapshot;
  }
}
