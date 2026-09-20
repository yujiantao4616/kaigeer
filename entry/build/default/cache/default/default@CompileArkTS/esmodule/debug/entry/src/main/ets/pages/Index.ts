if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    model?: AppModel;
    colorPickerDialog?: CustomDialogController | null;
    pickerOriginalColor?: string;
    timerId?: number;
    nextTrainingTickAt?: number;
    breathingTimerId?: number;
    trainStartedAt?: number;
    breathingPhaseStartedAt?: number;
    breathingTick?: number;
    wearableHapticTimerId?: number;
    wearableHapticUnavailableLogged?: boolean;
    hardHapticSupported?: boolean | undefined;
    softHapticSupported?: boolean | undefined;
    trainingHapticApiLogged?: boolean;
    page?: AppPage;
    wearableMode?: boolean;
    wearableTab?: number;
    locale?: string;
    voiceLanguage?: VoiceLanguage;
    themeColor?: ThemeColor;
    darkMode?: boolean;
    hapticsEnabled?: boolean;
    customPrimary?: string;
    pickerHue?: number;
    pickerSaturation?: number;
    pickerValue?: number;
    plan?: TrainingPlan;
    savedPlan?: TrainingPlan;
    progress?: Array<DailyProgress>;
    remindersEnabled?: boolean;
    reminderTimes?: Array<string>;
    phase?: TrainingPhase;
    remaining?: number;
    repetition?: number;
    trainingSet?: number;
    paused?: boolean;
    countdownScale?: number;
    breathingScale?: number;
    breathingOffsetX?: number;
    breathingOffsetY?: number;
    breathingPhase?: TrainingPhase;
    finishedSets?: number;
    selectedDate?: string;
    month?: Date;
    toast?: string;
    reminderError?: string;
    introExpanded?: boolean;
    stopConfirming?: boolean;
    statsClearConfirming?: boolean;
}
interface CustomHuePickerDialog_Params {
    controller?: CustomDialogController;
    // CustomDialogController creates the dialog outside the page's builder
    // scope, so keep the picker interaction state local to the dialog and pass
    // the opening color as plain initial values.
    initialHue?: number;
    initialSaturation?: number;
    initialValue?: number;
    pickerHue?: number;
    pickerSaturation?: number;
    pickerValue?: number;
    primary?: string;
    surface?: string;
    text?: string;
    muted?: string;
    title?: string;
    hint?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    pickerWidth?: number;
    pickerHeight?: number;
    onConfirm?: (color: string) => void;
    onCancel?: () => void;
}
import type common from "@ohos:app.ability.common";
import window from "@ohos:window";
import i18n from "@ohos:i18n";
import display from "@ohos:display";
import vibrator from "@ohos:vibrator";
import { ActiveTraining, AppModel, DailyProgress, clonePlan, formatDateKey, todayKey, TrainingPlan } from "@normalized:N&&&entry/src/main/ets/model/AppModel&";
import type { AppPage, TrainingPhase, ThemeColor, VoiceLanguage } from "@normalized:N&&&entry/src/main/ets/model/AppModel&";
import { PreferenceStore } from "@normalized:N&&&entry/src/main/ets/service/PreferenceStore&";
import { ReminderService } from "@normalized:N&&&entry/src/main/ets/service/ReminderService&";
import type { ReminderApplyResult } from "@normalized:N&&&entry/src/main/ets/service/ReminderService&";
import { VoiceService } from "@normalized:N&&&entry/src/main/ets/service/VoiceService&";
import type { CompactVoiceCue, VoiceCue } from "@normalized:N&&&entry/src/main/ets/service/VoiceService&";
import { SystemTrainingService } from "@normalized:N&&&entry/src/main/ets/service/SystemTrainingService&";
import type { SystemTrainingState } from "@normalized:N&&&entry/src/main/ets/service/SystemTrainingService&";
import { LiveViewCommandBus } from "@normalized:N&&&entry/src/main/ets/service/LiveViewCommandBus&";
import type { LiveViewCommand } from "@normalized:N&&&entry/src/main/ets/service/LiveViewCommandBus&";
import { WearableSyncService } from "@normalized:N&&&entry/src/main/ets/service/WearableSyncService&";
import type { WearableSharedPayload } from "@normalized:N&&&entry/src/main/ets/service/WearableSyncService&";
import { WearableHomeView } from "@normalized:N&&&entry/src/main/ets/pages/wearable/WearableHomeView&";
import { WearableTrainView } from "@normalized:N&&&entry/src/main/ets/pages/wearable/WearableTrainView&";
class CalendarCell {
    day: number;
    dateKey: string;
    constructor(day: number, dateKey: string) { this.day = day; this.dateKey = dateKey; }
}
class StatsDay {
    dateKey: string;
    label: string;
    repetitions: number;
    constructor(dateKey: string, label: string, repetitions: number) {
        this.dateKey = dateKey;
        this.label = label;
        this.repetitions = repetitions;
    }
}
class NavItem {
    page: AppPage;
    label: string;
    constructor(page: AppPage, label: string) { this.page = page; this.label = label; }
}
class VoiceOption {
    label: string;
    value: VoiceLanguage;
    constructor(label: string, value: VoiceLanguage) { this.label = label; this.value = value; }
}
class ThemeOption {
    label: string;
    value: ThemeColor;
    swatch: string;
    constructor(label: string, value: ThemeColor, swatch: string) { this.label = label; this.value = value; this.swatch = swatch; }
}
class ThemePalette {
    primary: string;
    primaryContainer: string;
    accent: string;
    background: string;
    border: string;
    surface: string;
    text: string;
    muted: string;
    onPrimary: string;
    constructor(primary: string, primaryContainer: string, accent: string, background: string, border: string, surface: string, text: string, muted: string, onPrimary: string) {
        this.primary = primary;
        this.primaryContainer = primaryContainer;
        this.accent = accent;
        this.background = background;
        this.border = border;
        this.surface = surface;
        this.text = text;
        this.muted = muted;
        this.onPrimary = onPrimary;
    }
}
const BACKGROUND: string = '#F7F9F8';
const SURFACE: string = '#FFFFFF';
const PRIMARY: string = '#087F73';
const PRIMARY_CONTAINER: string = '#A9F2E5';
const ON_PRIMARY: string = '#FFFFFF';
const TEXT: string = '#17312D';
const MUTED: string = '#617571';
const BORDER: string = '#D7E3E0';
const ACCENT: string = '#E8F6F2';
function validHexColor(value: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
}
function normalizeHexColor(value: string): string {
    return validHexColor(value) ? value.toUpperCase() : PRIMARY;
}
function blendHexColor(foreground: string, background: string, foregroundWeight: number): string {
    const fg: string = normalizeHexColor(foreground).substring(1);
    const bg: string = normalizeHexColor(background).substring(1);
    const mix: number = Math.max(0, Math.min(1, foregroundWeight));
    const channel = (offset: number): number => Math.round(parseInt(fg.substring(offset, offset + 2), 16) * mix + parseInt(bg.substring(offset, offset + 2), 16) * (1 - mix));
    const hex = (value: number): string => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0').toUpperCase();
    return `#${hex(channel(0))}${hex(channel(2))}${hex(channel(4))}`;
}
class HsvColor {
    hue: number;
    saturation: number;
    value: number;
    constructor(hue: number, saturation: number, value: number) {
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
    }
}
function hsvToHex(hue: number, saturation: number, value: number): string {
    const h: number = ((hue % 360) + 360) % 360;
    const s: number = Math.max(0, Math.min(1, saturation));
    const v: number = Math.max(0, Math.min(1, value));
    const chroma: number = v * s;
    const segment: number = h / 60;
    const x: number = chroma * (1 - Math.abs(segment % 2 - 1));
    const match: number = v - chroma;
    let red: number = 0;
    let green: number = 0;
    let blue: number = 0;
    if (segment < 1) {
        red = chroma;
        green = x;
    }
    else if (segment < 2) {
        red = x;
        green = chroma;
    }
    else if (segment < 3) {
        green = chroma;
        blue = x;
    }
    else if (segment < 4) {
        green = x;
        blue = chroma;
    }
    else if (segment < 5) {
        red = x;
        blue = chroma;
    }
    else {
        red = chroma;
        blue = x;
    }
    const channel = (channelValue: number): string => Math.round((channelValue + match) * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${channel(red)}${channel(green)}${channel(blue)}`;
}
function hexToHsv(value: string): HsvColor {
    const hex: string = normalizeHexColor(value).substring(1);
    const red: number = parseInt(hex.substring(0, 2), 16) / 255;
    const green: number = parseInt(hex.substring(2, 4), 16) / 255;
    const blue: number = parseInt(hex.substring(4, 6), 16) / 255;
    const max: number = Math.max(red, green, blue);
    const min: number = Math.min(red, green, blue);
    const delta: number = max - min;
    let hue: number = 0;
    if (delta > 0) {
        if (max === red) {
            hue = 60 * (((green - blue) / delta) % 6);
        }
        else if (max === green) {
            hue = 60 * ((blue - red) / delta + 2);
        }
        else {
            hue = 60 * ((red - green) / delta + 4);
        }
    }
    if (hue < 0) {
        hue += 360;
    }
    const saturation: number = max === 0 ? 0 : delta / max;
    return new HsvColor(hue, saturation, max);
}
function darkPalette(primary: string): ThemePalette {
    const darkPrimary: string = blendHexColor(primary, '#FFFFFF', 0.58);
    const darkPrimaryContainer: string = blendHexColor(primary, '#24322F', 0.46);
    const darkAccent: string = blendHexColor(primary, '#1C2926', 0.18);
    const darkBackground: string = '#101615';
    const darkBorder: string = '#34423F';
    const darkSurface: string = '#1A2422';
    const darkText: string = '#E5F0ED';
    const darkMuted: string = '#A4B6B1';
    const darkOnPrimary: string = '#06221D';
    return new ThemePalette(darkPrimary, darkPrimaryContainer, darkAccent, darkBackground, darkBorder, darkSurface, darkText, darkMuted, darkOnPrimary);
}
function paletteFor(theme: ThemeColor, customPrimary: string = PRIMARY, darkMode: boolean = false): ThemePalette {
    if (darkMode) {
        const selectedPrimary: string = theme === 'custom' ? normalizeHexColor(customPrimary) : theme === 'blue' ? '#45618F' : theme === 'purple' ? '#6750A4' : theme === 'orange' ? '#8A4E00' : theme === 'rose' ? '#984061' : theme === 'green' ? '#4B5F2A' : '#087F73';
        return darkPalette(selectedPrimary);
    }
    if (theme === 'custom') {
        const primary: string = normalizeHexColor(customPrimary);
        return new ThemePalette(primary, blendHexColor(primary, '#FFFFFF', 0.22), blendHexColor(primary, '#FFFFFF', 0.10), blendHexColor(primary, '#FFFFFF', 0.03), blendHexColor(primary, '#FFFFFF', 0.20), '#FFFFFF', '#17312D', '#617571', '#FFFFFF');
    }
    if (theme === 'blue') {
        return new ThemePalette('#45618F', '#D8E2FF', '#EEF2FF', '#F8F9FF', '#DCE2F0', '#FFFFFF', '#172033', '#5F687A', '#FFFFFF');
    }
    if (theme === 'purple') {
        return new ThemePalette('#6750A4', '#EADDFF', '#F7F2FA', '#FFFBFE', '#E7E0EC', '#FFFFFF', '#241B35', '#6F6579', '#FFFFFF');
    }
    if (theme === 'orange') {
        return new ThemePalette('#8A4E00', '#FFDCBE', '#FFF3E9', '#FFFBF8', '#F2DFD0', '#FFFFFF', '#2F2116', '#76695F', '#FFFFFF');
    }
    if (theme === 'rose') {
        return new ThemePalette('#984061', '#FFD9E2', '#FFF0F3', '#FFF8F9', '#F2DCE1', '#FFFFFF', '#321B25', '#79656B', '#FFFFFF');
    }
    if (theme === 'green') {
        return new ThemePalette('#4B5F2A', '#D0E8AA', '#F4F9E7', '#FAFCF4', '#E0E8D1', '#FFFFFF', '#202A16', '#65705A', '#FFFFFF');
    }
    return new ThemePalette('#087F73', '#A9F2E5', '#E8F6F2', '#F7F9F8', '#D7E3E0', '#FFFFFF', '#17312D', '#617571', '#FFFFFF');
}
function ui(key: string, locale: string): string {
    if (key === 'home') {
        return locale === 'en' ? "Today's practice" : '今天的练习';
    }
    if (key === 'greeting') {
        return locale === 'en' ? 'Gentle consistency adds up' : '温和地坚持，身体会记住';
    }
    if (key === 'training') {
        return locale === 'en' ? 'Training' : '训练中';
    }
    if (key === 'trainingSubtitle') {
        return locale === 'en' ? 'Seated pelvic floor practice · breathe naturally' : '坐姿盆底训练 · 跟随节奏自然呼吸';
    }
    if (key === 'currentSet') {
        return locale === 'en' ? 'Current set' : '当前组';
    }
    if (key === 'currentRep') {
        return locale === 'en' ? 'Current repetition' : '当前次数';
    }
    if (key === 'start') {
        return locale === 'en' ? 'Start training' : '开始训练';
    }
    if (key === 'sets') {
        return locale === 'en' ? 'Completed today' : '今日已完成';
    }
    if (key === 'setUnit') {
        return locale === 'en' ? 'sets' : '组';
    }
    if (key === 'target') {
        return locale === 'en' ? 'Goal' : '目标';
    }
    if (key === 'tighten') {
        return locale === 'en' ? 'Tighten' : '收紧';
    }
    if (key === 'relax') {
        return locale === 'en' ? 'Relax' : '放松';
    }
    if (key === 'repetitions') {
        return locale === 'en' ? 'Repetitions' : '次数';
    }
    if (key === 'setCount') {
        return locale === 'en' ? 'Sets per day' : '每天组数';
    }
    if (key === 'plan') {
        return locale === 'en' ? 'Training plan' : '训练计划';
    }
    if (key === 'save') {
        return locale === 'en' ? 'Save plan' : '保存计划';
    }
    if (key === 'recommendationTitle') {
        return locale === 'en' ? 'Suggested rhythm' : '推荐节奏';
    }
    if (key === 'reminderSyncHint') {
        return locale === 'en' ? 'Reminder times follow the saved number of daily sets. Changes take effect after you save the plan.' : '提醒次数会跟随已保存的每天组数；计划点击保存后才正式生效。';
    }
    if (key === 'reminderTrimmed') {
        return locale === 'en' ? 'The latest reminder was removed to match your saved daily sets.' : '已移除最晚提醒，使提醒次数与每天组数一致。';
    }
    if (key === 'calendar') {
        return locale === 'en' ? 'Calendar' : '日历打卡';
    }
    if (key === 'intro') {
        return locale === 'en' ? 'About Kegels' : '训练介绍';
    }
    if (key === 'introSubtitle') {
        return locale === 'en' ? 'A gentle guide to pelvic floor training' : '认识会阴训练，循序渐进地练习';
    }
    if (key === 'introWhat') {
        return locale === 'en' ? 'What is Kegel training?' : '什么是凯格尔训练？';
    }
    if (key === 'introWhatBody') {
        return locale === 'en' ? 'Kegel training gently contracts and releases the pelvic floor muscles. These muscles surround the front passage (urethra) and back passage (anus), supporting bladder and bowel control.' : '凯格尔训练是有节奏地收紧、放松盆底肌。盆底肌同时包围会阴前侧的尿道和后侧的肛门，帮助支持尿控与排便控制。';
    }
    if (key === 'introHow') {
        return locale === 'en' ? 'How to practice' : '怎么练？';
    }
    if (key === 'introHowBody') {
        return locale === 'en' ? 'Start seated near the front of a chair, feet grounded and shoulders relaxed. Gently draw both the front and back passages inward and up for 5 seconds, then fully release for 5 seconds. Complete 10–15 repetitions per set and aim for 3 sets each day.' : '先坐在椅子前半段，双脚踩地，肩膀放松。让会阴前后方一起向内、向上提起 5 秒，再完全放松 5 秒。每组 10–15 次，每天目标 3 组。';
    }
    if (key === 'introTips') {
        return locale === 'en' ? 'Form & breathing' : '动作与呼吸';
    }
    if (key === 'introTipsBody') {
        return locale === 'en' ? 'Use “stop urine” and “stop gas” only as cues to find the front and back muscles. Keep your belly, thighs, and glutes relaxed. Breathe normally—never hold your breath. Do not practice while urinating. Stop if you feel pain or pressure.' : '可以用“忍住尿意”和“忍住排气”来寻找前后方肌肉，但不要把它们当成两个完全独立的动作。腹部、大腿和臀部保持放松，不要憋气，也不要在排尿时练习。如果疼痛或有压迫感，请停止。';
    }
    if (key === 'introProgress') {
        return locale === 'en' ? 'Make it a habit' : '把练习变成习惯';
    }
    if (key === 'introProgressBody') {
        return locale === 'en' ? 'Use reminders and the calendar check-in to keep a comfortable rhythm. Consistency matters more than intensity.' : '用提醒和日历打卡保持规律。比起用力过猛，更重要的是舒适、持续地练习。';
    }
    if (key === 'settings') {
        return locale === 'en' ? 'Settings' : '设置';
    }
    if (key === 'voice') {
        return locale === 'en' ? 'Voice guidance' : '语音提示';
    }
    if (key === 'voiceHint') {
        return locale === 'en' ? 'Full guidance in set 1, short cues afterward' : '第 1 组完整指导，后续组使用简短提示音';
    }
    if (key === 'reminders') {
        return locale === 'en' ? 'Daily reminders' : '每日提醒';
    }
    if (key === 'remindersHint') {
        return locale === 'en' ? 'Remind me about today’s practice' : '在选定时间提醒今天的练习';
    }
    if (key === 'reminderEditHint') {
        return locale === 'en' ? 'Tap a time to edit it' : '点击时间即可编辑';
    }
    if (key === 'reminderDuplicate') {
        return locale === 'en' ? 'That time is already in use' : '这个时间已经设置过了';
    }
    if (key === 'reminderNotificationDisabled') {
        return locale === 'en' ? 'Notifications are disabled. Turn them on in system settings.' : '系统通知未开启，请在系统设置中打开通知权限。';
    }
    if (key === 'reminderApplyFailed') {
        return locale === 'en' ? 'Could not schedule the reminder. Check notification access and try again.' : '提醒设置失败，请检查通知权限后重试。';
    }
    if (key === 'addReminder') {
        return locale === 'en' ? '+ Add time' : '+ 添加时间';
    }
    if (key === 'theme') {
        return locale === 'en' ? 'Theme color' : '主题色';
    }
    if (key === 'themeHint') {
        return locale === 'en' ? 'Choose an accent color for the app' : '选择应用的强调色';
    }
    if (key === 'darkMode') {
        return locale === 'en' ? 'Dark mode' : '暗色模式';
    }
    if (key === 'haptics') {
        return locale === 'en' ? 'Training vibration' : '训练震动';
    }
    if (key === 'hapticsHint') {
        return locale === 'en' ? 'Try the tighten / release rhythm on this phone' : '在手机上体验收紧与放松的震动节奏';
    }
    if (key === 'hapticsOn') {
        return locale === 'en' ? 'ON' : '开启';
    }
    if (key === 'hapticsOff') {
        return locale === 'en' ? 'OFF' : '关闭';
    }
    if (key === 'hapticsTest') {
        return locale === 'en' ? 'Test' : '测试';
    }
    if (key === 'hapticsNeedEnable') {
        return locale === 'en' ? 'Turn on training vibration first' : '请先开启训练震动';
    }
    if (key === 'stats') {
        return locale === 'en' ? 'Local statistics' : '本地训练统计';
    }
    if (key === 'statsHint') {
        return locale === 'en' ? 'One tighten + release = 1 rep · stored only on this device' : '收紧＋放松算 1 次 · 仅保存在本机';
    }
    if (key === 'statsTotal') {
        return locale === 'en' ? 'Total repetitions' : '累计次数';
    }
    if (key === 'statsRecent') {
        return locale === 'en' ? 'Last 7 days' : '最近 7 天';
    }
    if (key === 'statsEmpty') {
        return locale === 'en' ? 'Complete a set to start your local record.' : '完成一组训练后，这里会显示本地记录。';
    }
    if (key === 'statsClear') {
        return locale === 'en' ? 'Clear local statistics' : '清除本地统计';
    }
    if (key === 'statsClearConfirm') {
        return locale === 'en' ? 'Clear all local training statistics?' : '清除全部本地训练统计？';
    }
    if (key === 'statsClearBody') {
        return locale === 'en' ? 'Only repetition statistics will be cleared; check-ins and your plan stay unchanged.' : '只会清除次数统计，日历打卡、训练计划和提醒不会改变。';
    }
    if (key === 'statsCancel') {
        return locale === 'en' ? 'Cancel' : '取消';
    }
    if (key === 'statsCleared') {
        return locale === 'en' ? 'Local statistics cleared' : '本地统计已清除';
    }
    if (key === 'statsUnit') {
        return locale === 'en' ? 'reps' : '次';
    }
    if (key === 'light') {
        return locale === 'en' ? 'Light' : '亮色';
    }
    if (key === 'dark') {
        return locale === 'en' ? 'Dark' : '暗色';
    }
    if (key === 'themeTeal') {
        return locale === 'en' ? 'Teal' : '青绿色';
    }
    if (key === 'themeBlue') {
        return locale === 'en' ? 'Blue' : '蓝色';
    }
    if (key === 'themePurple') {
        return locale === 'en' ? 'Purple' : '紫色';
    }
    if (key === 'themeOrange') {
        return locale === 'en' ? 'Orange' : '橙色';
    }
    if (key === 'themeRose') {
        return locale === 'en' ? 'Rose' : '玫瑰';
    }
    if (key === 'themeGreen') {
        return locale === 'en' ? 'Green' : '绿色';
    }
    if (key === 'safety') {
        return locale === 'en' ? 'Practice cues' : '练习提示';
    }
    if (key === 'safetyBody') {
        return locale === 'en' ? 'Seated basics: gently lift the front and back passages together. Keep your belly, thighs, and glutes relaxed; breathe normally.' : '坐姿基础：让会阴前后方一起轻轻向内、向上提。腹部、大腿和臀部保持放松，保持自然呼吸。';
    }
    if (key === 'ready') {
        return locale === 'en' ? 'Ready' : '准备';
    }
    if (key === 'phaseReady') {
        return locale === 'en' ? 'Get seated' : '坐好准备';
    }
    if (key === 'phaseTighten') {
        return locale === 'en' ? 'Lift' : '向上提起';
    }
    if (key === 'phaseRelax') {
        return locale === 'en' ? 'Release' : '放松释放';
    }
    if (key === 'pause') {
        return locale === 'en' ? 'Pause' : '暂停';
    }
    if (key === 'resume') {
        return locale === 'en' ? 'Resume' : '继续';
    }
    if (key === 'stop') {
        return locale === 'en' ? 'End training' : '结束训练';
    }
    if (key === 'stopConfirmTitle') {
        return locale === 'en' ? 'End this session?' : '要结束本次训练吗？';
    }
    if (key === 'stopConfirmBody') {
        return locale === 'en' ? 'Your current set will not be recorded until it is completed.' : '当前未完成的组不会计入打卡记录。';
    }
    if (key === 'cancel') {
        return locale === 'en' ? 'Keep training' : '继续训练';
    }
    if (key === 'confirmStop') {
        return locale === 'en' ? 'End session' : '结束本次';
    }
    if (key === 'complete') {
        return locale === 'en' ? 'Set complete' : '本组完成';
    }
    if (key === 'setProgress') {
        return locale === 'en' ? 'Set progress' : '组进度';
    }
    if (key === 'repProgress') {
        return locale === 'en' ? 'Rep progress' : '次数进度';
    }
    if (key === 'secondsShort') {
        return locale === 'en' ? 'sec' : '秒';
    }
    if (key === 'seatedBasics') {
        return locale === 'en' ? 'Seated basics · whole pelvic floor' : '坐姿基础 · 全盆底';
    }
    if (key === 'noRecord') {
        return locale === 'en' ? 'No practice recorded for this day' : '这一天还没有训练记录';
    }
    return locale === 'en' ? 'Health note: stop and seek professional advice if you feel pain, dizziness, or discomfort.' : '健康提示：如果疼痛、头晕或不适，请停止并咨询专业人士。';
}
class CustomHuePickerDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = undefined;
        this.initialHue = 174;
        this.initialSaturation = 0.94;
        this.initialValue = 0.50;
        this.__pickerHue = new ObservedPropertySimplePU(174, this, "pickerHue");
        this.__pickerSaturation = new ObservedPropertySimplePU(0.94, this, "pickerSaturation");
        this.__pickerValue = new ObservedPropertySimplePU(0.50, this, "pickerValue");
        this.primary = PRIMARY;
        this.surface = SURFACE;
        this.text = TEXT;
        this.muted = MUTED;
        this.title = '自定义取色器';
        this.hint = '拖动选择色相、饱和度和明度';
        this.cancelLabel = '取消';
        this.confirmLabel = '使用此颜色';
        this.__pickerWidth = new ObservedPropertySimplePU(320, this, "pickerWidth");
        this.__pickerHeight = new ObservedPropertySimplePU(190, this, "pickerHeight");
        this.onConfirm = (_color: string) => { };
        this.onCancel = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CustomHuePickerDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.initialHue !== undefined) {
            this.initialHue = params.initialHue;
        }
        if (params.initialSaturation !== undefined) {
            this.initialSaturation = params.initialSaturation;
        }
        if (params.initialValue !== undefined) {
            this.initialValue = params.initialValue;
        }
        if (params.pickerHue !== undefined) {
            this.pickerHue = params.pickerHue;
        }
        if (params.pickerSaturation !== undefined) {
            this.pickerSaturation = params.pickerSaturation;
        }
        if (params.pickerValue !== undefined) {
            this.pickerValue = params.pickerValue;
        }
        if (params.primary !== undefined) {
            this.primary = params.primary;
        }
        if (params.surface !== undefined) {
            this.surface = params.surface;
        }
        if (params.text !== undefined) {
            this.text = params.text;
        }
        if (params.muted !== undefined) {
            this.muted = params.muted;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.hint !== undefined) {
            this.hint = params.hint;
        }
        if (params.cancelLabel !== undefined) {
            this.cancelLabel = params.cancelLabel;
        }
        if (params.confirmLabel !== undefined) {
            this.confirmLabel = params.confirmLabel;
        }
        if (params.pickerWidth !== undefined) {
            this.pickerWidth = params.pickerWidth;
        }
        if (params.pickerHeight !== undefined) {
            this.pickerHeight = params.pickerHeight;
        }
        if (params.onConfirm !== undefined) {
            this.onConfirm = params.onConfirm;
        }
        if (params.onCancel !== undefined) {
            this.onCancel = params.onCancel;
        }
    }
    updateStateVars(params: CustomHuePickerDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__pickerHue.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerValue.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__pickerHue.aboutToBeDeleted();
        this.__pickerSaturation.aboutToBeDeleted();
        this.__pickerValue.aboutToBeDeleted();
        this.__pickerWidth.aboutToBeDeleted();
        this.__pickerHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    // CustomDialogController creates the dialog outside the page's builder
    // scope, so keep the picker interaction state local to the dialog and pass
    // the opening color as plain initial values.
    private initialHue: number;
    private initialSaturation: number;
    private initialValue: number;
    private __pickerHue: ObservedPropertySimplePU<number>;
    get pickerHue() {
        return this.__pickerHue.get();
    }
    set pickerHue(newValue: number) {
        this.__pickerHue.set(newValue);
    }
    private __pickerSaturation: ObservedPropertySimplePU<number>;
    get pickerSaturation() {
        return this.__pickerSaturation.get();
    }
    set pickerSaturation(newValue: number) {
        this.__pickerSaturation.set(newValue);
    }
    private __pickerValue: ObservedPropertySimplePU<number>;
    get pickerValue() {
        return this.__pickerValue.get();
    }
    set pickerValue(newValue: number) {
        this.__pickerValue.set(newValue);
    }
    private primary: string;
    private surface: string;
    private text: string;
    private muted: string;
    private title: string;
    private hint: string;
    private cancelLabel: string;
    private confirmLabel: string;
    private __pickerWidth: ObservedPropertySimplePU<number>;
    get pickerWidth() {
        return this.__pickerWidth.get();
    }
    set pickerWidth(newValue: number) {
        this.__pickerWidth.set(newValue);
    }
    private __pickerHeight: ObservedPropertySimplePU<number>;
    get pickerHeight() {
        return this.__pickerHeight.get();
    }
    set pickerHeight(newValue: number) {
        this.__pickerHeight.set(newValue);
    }
    aboutToAppear(): void {
        this.pickerHue = this.initialHue;
        this.pickerSaturation = this.initialSaturation;
        this.pickerValue = this.initialValue;
    }
    private currentColor(): string {
        return hsvToHex(this.pickerHue, this.pickerSaturation, this.pickerValue);
    }
    private hueColor(): string {
        return hsvToHex(this.pickerHue, 1, 1);
    }
    private handleSurfaceTouch(event: TouchEvent): void {
        if (!event.touches || event.touches.length === 0) {
            return;
        }
        const point = event.touches[0];
        this.pickerSaturation = Math.max(0, Math.min(1, point.x / Math.max(1, this.pickerWidth)));
        this.pickerValue = 1 - Math.max(0, Math.min(1, point.y / Math.max(1, this.pickerHeight)));
    }
    private handleHueTouch(event: TouchEvent): void {
        if (!event.touches || event.touches.length === 0) {
            return;
        }
        const point = event.touches[0];
        this.pickerHue = 360 * Math.max(0, Math.min(1, point.x / Math.max(1, this.pickerWidth)));
    }
    private surfacePicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height(190);
            Stack.borderRadius(18);
            Stack.clip(true);
            Stack.onAreaChange((_oldValue: Area, newValue: Area) => {
                this.pickerWidth = Math.max(1, newValue.width as number);
                this.pickerHeight = Math.max(1, newValue.height as number);
            });
            Stack.onTouch((event: TouchEvent) => this.handleSurfaceTouch(event));
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Rect.create();
            Rect.width('100%');
            Rect.height(190);
            Rect.fill(this.hueColor());
            Rect.linearGradient({
                direction: GradientDirection.Right,
                colors: [['#FFFFFFFF', 0], ['#00FFFFFF', 1]]
            });
        }, Rect);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Rect.create();
            Rect.width('100%');
            Rect.height(190);
            Rect.fill('#00FFFFFF');
            Rect.linearGradient({
                direction: GradientDirection.Bottom,
                colors: [['#00000000', 0], ['#FF000000', 1]]
            });
        }, Rect);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(22);
            Circle.height(22);
            Circle.fill('#00FFFFFF');
            Circle.border({ width: 3, color: '#FFFFFFFF' });
            Circle.shadow({ radius: 6, color: '#66000000', offsetX: 0, offsetY: 2 });
            Circle.offset({
                x: Math.max(0, Math.min(this.pickerWidth - 22, this.pickerSaturation * this.pickerWidth - 11)),
                y: Math.max(0, Math.min(this.pickerHeight - 22, (1 - this.pickerValue) * this.pickerHeight - 11))
            });
        }, Circle);
        Stack.pop();
    }
    private huePicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height(26);
            Stack.borderRadius(13);
            Stack.clip(true);
            Stack.margin({ top: 12 });
            Stack.onAreaChange((_oldValue: Area, newValue: Area) => {
                this.pickerWidth = Math.max(1, newValue.width as number);
            });
            Stack.onTouch((event: TouchEvent) => this.handleHueTouch(event));
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(26);
            Row.linearGradient({
                direction: GradientDirection.Right,
                colors: [
                    [0xFFFF0000, 0], [0xFFFFFF00, 0.17], [0xFF00FF00, 0.33],
                    [0xFF00FFFF, 0.50], [0xFF0000FF, 0.67], [0xFFFF00FF, 0.83], [0xFFFF0000, 1]
                ]
            });
        }, Row);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(22);
            Circle.height(22);
            Circle.fill('#00FFFFFF');
            Circle.border({ width: 3, color: '#FFFFFFFF' });
            Circle.shadow({ radius: 5, color: '#66000000', offsetX: 0, offsetY: 1 });
            Circle.offset({ x: Math.max(0, Math.min(this.pickerWidth - 22, this.pickerHue / 360 * this.pickerWidth - 11)), y: 2 });
        }, Circle);
        Stack.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(this.surface);
            Column.borderRadius(28);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.text);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.hint);
            Text.fontSize(12);
            Text.fontColor(this.muted);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(38);
            Circle.height(38);
            Circle.fill(this.currentColor());
            Circle.border({ width: 2, color: this.primary });
        }, Circle);
        Row.pop();
        this.surfacePicker.bind(this)();
        this.huePicker.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.localeLabel());
            Text.fontSize(12);
            Text.fontColor(this.muted);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentColor());
            Text.fontSize(13);
            Text.fontColor(this.primary);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.cancelLabel, { type: ButtonType.Capsule });
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(14);
            Button.fontColor(this.primary);
            Button.backgroundColor('#00000000');
            Button.onClick(() => {
                this.onCancel();
                if (this.controller !== undefined) {
                    this.controller.close();
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.confirmLabel, { type: ButtonType.Capsule });
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(14);
            Button.fontColor('#FFFFFFFF');
            Button.backgroundColor(this.primary);
            Button.onClick(() => {
                if (this.controller !== undefined) {
                    this.controller.close();
                }
                this.onConfirm(this.currentColor());
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    private localeLabel(): string {
        return this.title === 'Color picker' ? 'Hue' : '色相';
    }
    private onConfirm: (color: string) => void;
    private onCancel: () => void;
    rerender() {
        this.updateDirtyElements();
    }
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.model = AppModel.shared();
        this.colorPickerDialog = null;
        this.pickerOriginalColor = PRIMARY;
        this.timerId = -1;
        this.nextTrainingTickAt = 0;
        this.breathingTimerId = -1;
        this.trainStartedAt = 0;
        this.breathingPhaseStartedAt = 0;
        this.breathingTick = 0;
        this.wearableHapticTimerId = -1;
        this.wearableHapticUnavailableLogged = false;
        this.hardHapticSupported = undefined;
        this.softHapticSupported = undefined;
        this.trainingHapticApiLogged = false;
        this.__page = new ObservedPropertySimplePU('home', this, "page");
        this.__wearableMode = new ObservedPropertySimplePU(false, this, "wearableMode");
        this.__wearableTab = new ObservedPropertySimplePU(1, this, "wearableTab");
        this.__locale = new ObservedPropertySimplePU('zh', this, "locale");
        this.__voiceLanguage = new ObservedPropertySimplePU('zh-CN', this, "voiceLanguage");
        this.__themeColor = new ObservedPropertySimplePU('teal', this, "themeColor");
        this.__darkMode = new ObservedPropertySimplePU(false, this, "darkMode");
        this.__hapticsEnabled = new ObservedPropertySimplePU(false, this, "hapticsEnabled");
        this.__customPrimary = new ObservedPropertySimplePU('#087F73', this, "customPrimary");
        this.__pickerHue = new ObservedPropertySimplePU(174, this, "pickerHue");
        this.__pickerSaturation = new ObservedPropertySimplePU(0.94, this, "pickerSaturation");
        this.__pickerValue = new ObservedPropertySimplePU(0.50, this, "pickerValue");
        this.__plan = new ObservedPropertyObjectPU(new TrainingPlan(), this, "plan");
        this.__savedPlan = new ObservedPropertyObjectPU(new TrainingPlan(), this, "savedPlan");
        this.__progress = new ObservedPropertyObjectPU([], this, "progress");
        this.__remindersEnabled = new ObservedPropertySimplePU(false, this, "remindersEnabled");
        this.__reminderTimes = new ObservedPropertyObjectPU(['08:00', '18:00', '21:00'], this, "reminderTimes");
        this.__phase = new ObservedPropertySimplePU('ready', this, "phase");
        this.__remaining = new ObservedPropertySimplePU(3, this, "remaining");
        this.__repetition = new ObservedPropertySimplePU(0, this, "repetition");
        this.__trainingSet = new ObservedPropertySimplePU(1, this, "trainingSet");
        this.__paused = new ObservedPropertySimplePU(false, this, "paused");
        this.__countdownScale = new ObservedPropertySimplePU(1, this, "countdownScale");
        this.__breathingScale = new ObservedPropertySimplePU(1, this, "breathingScale");
        this.__breathingOffsetX = new ObservedPropertySimplePU(0, this, "breathingOffsetX");
        this.__breathingOffsetY = new ObservedPropertySimplePU(0, this, "breathingOffsetY");
        this.__breathingPhase = new ObservedPropertySimplePU('ready', this, "breathingPhase");
        this.__finishedSets = new ObservedPropertySimplePU(0, this, "finishedSets");
        this.__selectedDate = new ObservedPropertySimplePU(todayKey(), this, "selectedDate");
        this.__month = new ObservedPropertyObjectPU(new Date(), this, "month");
        this.__toast = new ObservedPropertySimplePU('', this, "toast");
        this.__reminderError = new ObservedPropertySimplePU('', this, "reminderError");
        this.__introExpanded = new ObservedPropertySimplePU(false, this, "introExpanded");
        this.__stopConfirming = new ObservedPropertySimplePU(false, this, "stopConfirming");
        this.__statsClearConfirming = new ObservedPropertySimplePU(false, this, "statsClearConfirming");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.model !== undefined) {
            this.model = params.model;
        }
        if (params.colorPickerDialog !== undefined) {
            this.colorPickerDialog = params.colorPickerDialog;
        }
        if (params.pickerOriginalColor !== undefined) {
            this.pickerOriginalColor = params.pickerOriginalColor;
        }
        if (params.timerId !== undefined) {
            this.timerId = params.timerId;
        }
        if (params.nextTrainingTickAt !== undefined) {
            this.nextTrainingTickAt = params.nextTrainingTickAt;
        }
        if (params.breathingTimerId !== undefined) {
            this.breathingTimerId = params.breathingTimerId;
        }
        if (params.trainStartedAt !== undefined) {
            this.trainStartedAt = params.trainStartedAt;
        }
        if (params.breathingPhaseStartedAt !== undefined) {
            this.breathingPhaseStartedAt = params.breathingPhaseStartedAt;
        }
        if (params.breathingTick !== undefined) {
            this.breathingTick = params.breathingTick;
        }
        if (params.wearableHapticTimerId !== undefined) {
            this.wearableHapticTimerId = params.wearableHapticTimerId;
        }
        if (params.wearableHapticUnavailableLogged !== undefined) {
            this.wearableHapticUnavailableLogged = params.wearableHapticUnavailableLogged;
        }
        if (params.hardHapticSupported !== undefined) {
            this.hardHapticSupported = params.hardHapticSupported;
        }
        if (params.softHapticSupported !== undefined) {
            this.softHapticSupported = params.softHapticSupported;
        }
        if (params.trainingHapticApiLogged !== undefined) {
            this.trainingHapticApiLogged = params.trainingHapticApiLogged;
        }
        if (params.page !== undefined) {
            this.page = params.page;
        }
        if (params.wearableMode !== undefined) {
            this.wearableMode = params.wearableMode;
        }
        if (params.wearableTab !== undefined) {
            this.wearableTab = params.wearableTab;
        }
        if (params.locale !== undefined) {
            this.locale = params.locale;
        }
        if (params.voiceLanguage !== undefined) {
            this.voiceLanguage = params.voiceLanguage;
        }
        if (params.themeColor !== undefined) {
            this.themeColor = params.themeColor;
        }
        if (params.darkMode !== undefined) {
            this.darkMode = params.darkMode;
        }
        if (params.hapticsEnabled !== undefined) {
            this.hapticsEnabled = params.hapticsEnabled;
        }
        if (params.customPrimary !== undefined) {
            this.customPrimary = params.customPrimary;
        }
        if (params.pickerHue !== undefined) {
            this.pickerHue = params.pickerHue;
        }
        if (params.pickerSaturation !== undefined) {
            this.pickerSaturation = params.pickerSaturation;
        }
        if (params.pickerValue !== undefined) {
            this.pickerValue = params.pickerValue;
        }
        if (params.plan !== undefined) {
            this.plan = params.plan;
        }
        if (params.savedPlan !== undefined) {
            this.savedPlan = params.savedPlan;
        }
        if (params.progress !== undefined) {
            this.progress = params.progress;
        }
        if (params.remindersEnabled !== undefined) {
            this.remindersEnabled = params.remindersEnabled;
        }
        if (params.reminderTimes !== undefined) {
            this.reminderTimes = params.reminderTimes;
        }
        if (params.phase !== undefined) {
            this.phase = params.phase;
        }
        if (params.remaining !== undefined) {
            this.remaining = params.remaining;
        }
        if (params.repetition !== undefined) {
            this.repetition = params.repetition;
        }
        if (params.trainingSet !== undefined) {
            this.trainingSet = params.trainingSet;
        }
        if (params.paused !== undefined) {
            this.paused = params.paused;
        }
        if (params.countdownScale !== undefined) {
            this.countdownScale = params.countdownScale;
        }
        if (params.breathingScale !== undefined) {
            this.breathingScale = params.breathingScale;
        }
        if (params.breathingOffsetX !== undefined) {
            this.breathingOffsetX = params.breathingOffsetX;
        }
        if (params.breathingOffsetY !== undefined) {
            this.breathingOffsetY = params.breathingOffsetY;
        }
        if (params.breathingPhase !== undefined) {
            this.breathingPhase = params.breathingPhase;
        }
        if (params.finishedSets !== undefined) {
            this.finishedSets = params.finishedSets;
        }
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.month !== undefined) {
            this.month = params.month;
        }
        if (params.toast !== undefined) {
            this.toast = params.toast;
        }
        if (params.reminderError !== undefined) {
            this.reminderError = params.reminderError;
        }
        if (params.introExpanded !== undefined) {
            this.introExpanded = params.introExpanded;
        }
        if (params.stopConfirming !== undefined) {
            this.stopConfirming = params.stopConfirming;
        }
        if (params.statsClearConfirming !== undefined) {
            this.statsClearConfirming = params.statsClearConfirming;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__page.purgeDependencyOnElmtId(rmElmtId);
        this.__wearableMode.purgeDependencyOnElmtId(rmElmtId);
        this.__wearableTab.purgeDependencyOnElmtId(rmElmtId);
        this.__locale.purgeDependencyOnElmtId(rmElmtId);
        this.__voiceLanguage.purgeDependencyOnElmtId(rmElmtId);
        this.__themeColor.purgeDependencyOnElmtId(rmElmtId);
        this.__darkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__hapticsEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__customPrimary.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerHue.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerSaturation.purgeDependencyOnElmtId(rmElmtId);
        this.__pickerValue.purgeDependencyOnElmtId(rmElmtId);
        this.__plan.purgeDependencyOnElmtId(rmElmtId);
        this.__savedPlan.purgeDependencyOnElmtId(rmElmtId);
        this.__progress.purgeDependencyOnElmtId(rmElmtId);
        this.__remindersEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__reminderTimes.purgeDependencyOnElmtId(rmElmtId);
        this.__phase.purgeDependencyOnElmtId(rmElmtId);
        this.__remaining.purgeDependencyOnElmtId(rmElmtId);
        this.__repetition.purgeDependencyOnElmtId(rmElmtId);
        this.__trainingSet.purgeDependencyOnElmtId(rmElmtId);
        this.__paused.purgeDependencyOnElmtId(rmElmtId);
        this.__countdownScale.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingScale.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingOffsetX.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingOffsetY.purgeDependencyOnElmtId(rmElmtId);
        this.__breathingPhase.purgeDependencyOnElmtId(rmElmtId);
        this.__finishedSets.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__month.purgeDependencyOnElmtId(rmElmtId);
        this.__toast.purgeDependencyOnElmtId(rmElmtId);
        this.__reminderError.purgeDependencyOnElmtId(rmElmtId);
        this.__introExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__stopConfirming.purgeDependencyOnElmtId(rmElmtId);
        this.__statsClearConfirming.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__page.aboutToBeDeleted();
        this.__wearableMode.aboutToBeDeleted();
        this.__wearableTab.aboutToBeDeleted();
        this.__locale.aboutToBeDeleted();
        this.__voiceLanguage.aboutToBeDeleted();
        this.__themeColor.aboutToBeDeleted();
        this.__darkMode.aboutToBeDeleted();
        this.__hapticsEnabled.aboutToBeDeleted();
        this.__customPrimary.aboutToBeDeleted();
        this.__pickerHue.aboutToBeDeleted();
        this.__pickerSaturation.aboutToBeDeleted();
        this.__pickerValue.aboutToBeDeleted();
        this.__plan.aboutToBeDeleted();
        this.__savedPlan.aboutToBeDeleted();
        this.__progress.aboutToBeDeleted();
        this.__remindersEnabled.aboutToBeDeleted();
        this.__reminderTimes.aboutToBeDeleted();
        this.__phase.aboutToBeDeleted();
        this.__remaining.aboutToBeDeleted();
        this.__repetition.aboutToBeDeleted();
        this.__trainingSet.aboutToBeDeleted();
        this.__paused.aboutToBeDeleted();
        this.__countdownScale.aboutToBeDeleted();
        this.__breathingScale.aboutToBeDeleted();
        this.__breathingOffsetX.aboutToBeDeleted();
        this.__breathingOffsetY.aboutToBeDeleted();
        this.__breathingPhase.aboutToBeDeleted();
        this.__finishedSets.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__month.aboutToBeDeleted();
        this.__toast.aboutToBeDeleted();
        this.__reminderError.aboutToBeDeleted();
        this.__introExpanded.aboutToBeDeleted();
        this.__stopConfirming.aboutToBeDeleted();
        this.__statsClearConfirming.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private model: AppModel;
    private colorPickerDialog: CustomDialogController | null;
    private pickerOriginalColor: string;
    private timerId: number;
    private nextTrainingTickAt: number;
    private breathingTimerId: number;
    private trainStartedAt: number;
    private breathingPhaseStartedAt: number;
    private breathingTick: number;
    private wearableHapticTimerId: number;
    private wearableHapticUnavailableLogged: boolean;
    private hardHapticSupported: boolean | undefined;
    private softHapticSupported: boolean | undefined;
    private trainingHapticApiLogged: boolean;
    private __page: ObservedPropertySimplePU<AppPage>;
    get page() {
        return this.__page.get();
    }
    set page(newValue: AppPage) {
        this.__page.set(newValue);
    }
    // Wearable emulators use a compact square display (currently 466x466).
    // Keep the phone layout intact and switch to purpose-built compact views
    // when the app is running on a small wearable screen.
    private __wearableMode: ObservedPropertySimplePU<boolean>;
    get wearableMode() {
        return this.__wearableMode.get();
    }
    set wearableMode(newValue: boolean) {
        this.__wearableMode.set(newValue);
    }
    // Wearable home is a three-page horizontal pager: summary, start, and
    // reminders. The watch is a compact companion, so it keeps only these
    // glanceable surfaces instead of mirroring the phone tabs.
    private __wearableTab: ObservedPropertySimplePU<number>;
    get wearableTab() {
        return this.__wearableTab.get();
    }
    set wearableTab(newValue: number) {
        this.__wearableTab.set(newValue);
    }
    private __locale: ObservedPropertySimplePU<string>;
    get locale() {
        return this.__locale.get();
    }
    set locale(newValue: string) {
        this.__locale.set(newValue);
    }
    private __voiceLanguage: ObservedPropertySimplePU<VoiceLanguage>;
    get voiceLanguage() {
        return this.__voiceLanguage.get();
    }
    set voiceLanguage(newValue: VoiceLanguage) {
        this.__voiceLanguage.set(newValue);
    }
    private __themeColor: ObservedPropertySimplePU<ThemeColor>;
    get themeColor() {
        return this.__themeColor.get();
    }
    set themeColor(newValue: ThemeColor) {
        this.__themeColor.set(newValue);
    }
    private __darkMode: ObservedPropertySimplePU<boolean>;
    get darkMode() {
        return this.__darkMode.get();
    }
    set darkMode(newValue: boolean) {
        this.__darkMode.set(newValue);
    }
    private __hapticsEnabled: ObservedPropertySimplePU<boolean>;
    get hapticsEnabled() {
        return this.__hapticsEnabled.get();
    }
    set hapticsEnabled(newValue: boolean) {
        this.__hapticsEnabled.set(newValue);
    }
    private __customPrimary: ObservedPropertySimplePU<string>;
    get customPrimary() {
        return this.__customPrimary.get();
    }
    set customPrimary(newValue: string) {
        this.__customPrimary.set(newValue);
    }
    private __pickerHue: ObservedPropertySimplePU<number>;
    get pickerHue() {
        return this.__pickerHue.get();
    }
    set pickerHue(newValue: number) {
        this.__pickerHue.set(newValue);
    }
    private __pickerSaturation: ObservedPropertySimplePU<number>;
    get pickerSaturation() {
        return this.__pickerSaturation.get();
    }
    set pickerSaturation(newValue: number) {
        this.__pickerSaturation.set(newValue);
    }
    private __pickerValue: ObservedPropertySimplePU<number>;
    get pickerValue() {
        return this.__pickerValue.get();
    }
    set pickerValue(newValue: number) {
        this.__pickerValue.set(newValue);
    }
    private __plan: ObservedPropertyObjectPU<TrainingPlan>;
    get plan() {
        return this.__plan.get();
    }
    set plan(newValue: TrainingPlan) {
        this.__plan.set(newValue);
    }
    // `plan` is the editable draft shown on the plan page. `savedPlan` is the
    // effective configuration used by training, home and calendar until Save
    // is pressed.
    private __savedPlan: ObservedPropertyObjectPU<TrainingPlan>;
    get savedPlan() {
        return this.__savedPlan.get();
    }
    set savedPlan(newValue: TrainingPlan) {
        this.__savedPlan.set(newValue);
    }
    private __progress: ObservedPropertyObjectPU<Array<DailyProgress>>;
    get progress() {
        return this.__progress.get();
    }
    set progress(newValue: Array<DailyProgress>) {
        this.__progress.set(newValue);
    }
    private __remindersEnabled: ObservedPropertySimplePU<boolean>;
    get remindersEnabled() {
        return this.__remindersEnabled.get();
    }
    set remindersEnabled(newValue: boolean) {
        this.__remindersEnabled.set(newValue);
    }
    private __reminderTimes: ObservedPropertyObjectPU<Array<string>>;
    get reminderTimes() {
        return this.__reminderTimes.get();
    }
    set reminderTimes(newValue: Array<string>) {
        this.__reminderTimes.set(newValue);
    }
    private __phase: ObservedPropertySimplePU<TrainingPhase>;
    get phase() {
        return this.__phase.get();
    }
    set phase(newValue: TrainingPhase) {
        this.__phase.set(newValue);
    }
    private __remaining: ObservedPropertySimplePU<number>;
    get remaining() {
        return this.__remaining.get();
    }
    set remaining(newValue: number) {
        this.__remaining.set(newValue);
    }
    private __repetition: ObservedPropertySimplePU<number>;
    get repetition() {
        return this.__repetition.get();
    }
    set repetition(newValue: number) {
        this.__repetition.set(newValue);
    }
    private __trainingSet: ObservedPropertySimplePU<number>;
    get trainingSet() {
        return this.__trainingSet.get();
    }
    set trainingSet(newValue: number) {
        this.__trainingSet.set(newValue);
    }
    private __paused: ObservedPropertySimplePU<boolean>;
    get paused() {
        return this.__paused.get();
    }
    set paused(newValue: boolean) {
        this.__paused.set(newValue);
    }
    private __countdownScale: ObservedPropertySimplePU<number>;
    get countdownScale() {
        return this.__countdownScale.get();
    }
    set countdownScale(newValue: number) {
        this.__countdownScale.set(newValue);
    }
    private __breathingScale: ObservedPropertySimplePU<number>;
    get breathingScale() {
        return this.__breathingScale.get();
    }
    set breathingScale(newValue: number) {
        this.__breathingScale.set(newValue);
    }
    private __breathingOffsetX: ObservedPropertySimplePU<number>;
    get breathingOffsetX() {
        return this.__breathingOffsetX.get();
    }
    set breathingOffsetX(newValue: number) {
        this.__breathingOffsetX.set(newValue);
    }
    private __breathingOffsetY: ObservedPropertySimplePU<number>;
    get breathingOffsetY() {
        return this.__breathingOffsetY.get();
    }
    set breathingOffsetY(newValue: number) {
        this.__breathingOffsetY.set(newValue);
    }
    private __breathingPhase: ObservedPropertySimplePU<TrainingPhase>;
    get breathingPhase() {
        return this.__breathingPhase.get();
    }
    set breathingPhase(newValue: TrainingPhase) {
        this.__breathingPhase.set(newValue);
    }
    private __finishedSets: ObservedPropertySimplePU<number>;
    get finishedSets() {
        return this.__finishedSets.get();
    }
    set finishedSets(newValue: number) {
        this.__finishedSets.set(newValue);
    }
    private __selectedDate: ObservedPropertySimplePU<string>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: string) {
        this.__selectedDate.set(newValue);
    }
    private __month: ObservedPropertyObjectPU<Date>;
    get month() {
        return this.__month.get();
    }
    set month(newValue: Date) {
        this.__month.set(newValue);
    }
    private __toast: ObservedPropertySimplePU<string>;
    get toast() {
        return this.__toast.get();
    }
    set toast(newValue: string) {
        this.__toast.set(newValue);
    }
    private __reminderError: ObservedPropertySimplePU<string>;
    get reminderError() {
        return this.__reminderError.get();
    }
    set reminderError(newValue: string) {
        this.__reminderError.set(newValue);
    }
    private __introExpanded: ObservedPropertySimplePU<boolean>;
    get introExpanded() {
        return this.__introExpanded.get();
    }
    set introExpanded(newValue: boolean) {
        this.__introExpanded.set(newValue);
    }
    private __stopConfirming: ObservedPropertySimplePU<boolean>;
    get stopConfirming() {
        return this.__stopConfirming.get();
    }
    set stopConfirming(newValue: boolean) {
        this.__stopConfirming.set(newValue);
    }
    private __statsClearConfirming: ObservedPropertySimplePU<boolean>;
    get statsClearConfirming() {
        return this.__statsClearConfirming.get();
    }
    set statsClearConfirming(newValue: boolean) {
        this.__statsClearConfirming.set(newValue);
    }
    aboutToAppear(): void {
        try {
            const displayInfo = display.getDefaultDisplaySync();
            this.wearableMode = displayInfo.width <= 600 && displayInfo.height <= 600;
        }
        catch (error) {
            this.wearableMode = false;
        }
        const systemLanguage: string = i18n.System.getSystemLanguage();
        // The app now ships Chinese and English only. Devices using another
        // Unsupported system languages receive the Chinese UI fallback.
        this.locale = systemLanguage.startsWith('en') ? 'en' : 'zh';
        const persistedVoice: string = this.model.voiceLanguage as string;
        this.voiceLanguage = persistedVoice === 'en-US' ? 'en-US' : 'zh-CN';
        this.model.voiceLanguage = this.voiceLanguage;
        this.themeColor = this.model.themeColor;
        this.darkMode = this.model.darkMode;
        this.hapticsEnabled = this.model.hapticsEnabled;
        this.customPrimary = normalizeHexColor(this.model.customPrimary);
        this.applySystemBarColors();
        // The window can finish attaching just after the page appears. Apply once
        // more after that hand-off so the gesture/navigation area uses the same
        // dynamic Material 3 surface color as the app.
        setTimeout(() => this.applySystemBarColors(), 180);
        const pickerColor: HsvColor = hexToHsv(this.customPrimary);
        this.pickerHue = pickerColor.hue;
        this.pickerSaturation = pickerColor.saturation;
        this.pickerValue = pickerColor.value;
        this.savedPlan = clonePlan(this.model.plan);
        this.plan = clonePlan(this.savedPlan);
        this.progress = this.model.progress.map((item: DailyProgress) => new DailyProgress(item.dateKey, item.completedSets, item.totalSeconds, item.lastCompletedAt, item.completedRepetitions ?? 0));
        WearableSyncService.subscribe((payload: WearableSharedPayload): void => {
            // Keep an in-progress session stable. New plan/history data appears on
            // the next session while today's summary updates immediately.
            if (this.page !== 'train') {
                this.savedPlan = clonePlan(payload.plan);
                if (this.page !== 'plan') {
                    this.plan = clonePlan(payload.plan);
                }
            }
            this.progress = payload.progress.map((item: DailyProgress) => new DailyProgress(item.dateKey, item.completedSets, item.totalSeconds, item.lastCompletedAt, item.completedRepetitions ?? 0));
        });
        this.remindersEnabled = this.model.reminders.enabled;
        this.reminderTimes = this.normalizeReminderTimes(this.model.reminders.times);
        const alignedReminderTimes: Array<string> = this.alignReminderTimesToSetCount(this.reminderTimes, this.savedPlan.setsPerDay);
        if (alignedReminderTimes.length !== this.reminderTimes.length) {
            this.reminderTimes = alignedReminderTimes;
        }
        let reminderTimesChanged: boolean = this.reminderTimes.length !== this.model.reminders.times.length;
        if (!reminderTimesChanged) {
            for (let index: number = 0; index < this.reminderTimes.length; index++) {
                if (this.reminderTimes[index] !== this.model.reminders.times[index]) {
                    reminderTimesChanged = true;
                    break;
                }
            }
        }
        if (reminderTimesChanged) {
            this.model.reminders.times = this.reminderTimes.slice();
            PreferenceStore.save(this.model);
        }
        if (this.remindersEnabled) {
            const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
            ReminderService.apply(context, this.model.reminders).then((result: ReminderApplyResult) => {
                if (!result.success) {
                    this.reminderError = this.reminderErrorText(result.errorCode);
                    this.toast = this.reminderErrorText(result.errorCode);
                    setTimeout(() => this.toast = '', 2600);
                }
                else {
                    this.reminderError = '';
                }
            });
        }
        const active: ActiveTraining | undefined = this.model.activeTraining;
        if (active !== undefined && active.active) {
            this.page = 'train';
            this.restoreSession(active);
            this.trainStartedAt = active.startedAt > 0 ? active.startedAt : Date.now();
            if (this.phase === 'complete') {
                this.completeSet();
            }
            else {
                this.persistSession();
                this.startTimer();
                this.startSystemSession();
            }
        }
        LiveViewCommandBus.attach((command: LiveViewCommand) => this.handleLiveViewCommand(command));
    }
    aboutToDisappear(): void {
        // Keep the workout alive when the ability moves to the background. The
        // audioPlayback long-running task and persisted session own continuation;
        // only an explicit stop/complete action should tear the timer down.
        if (this.model.activeTraining !== undefined && this.model.activeTraining.active) {
            return;
        }
        this.stopTimer();
        VoiceService.stop();
    }
    private text(key: string): string { return ui(key, this.locale); }
    private palette(): ThemePalette { return paletteFor(this.themeColor, this.customPrimary, this.darkMode); }
    private primaryColor(): string { return this.palette().primary; }
    private primaryContainerColor(): string { return this.palette().primaryContainer; }
    private accentColor(): string { return this.palette().accent; }
    private pageBackground(): string { return this.palette().background; }
    private pageBorder(): string { return this.palette().border; }
    private surfaceColor(): string { return this.palette().surface; }
    private textColor(): string { return this.palette().text; }
    private mutedColor(): string { return this.palette().muted; }
    private onPrimaryColor(): string { return this.palette().onPrimary; }
    private applySystemBarColors(): void {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        window.getLastWindow(context).then((windowClass: window.Window) => {
            const properties: window.SystemBarProperties = {
                statusBarColor: this.pageBackground(),
                navigationBarColor: this.pageBackground(),
                statusBarContentColor: this.textColor(),
                navigationBarContentColor: this.textColor()
            };
            windowClass.setWindowSystemBarProperties(properties).catch((error: Object) => {
                console.error(`System bar color update failed: ${JSON.stringify(error)}`);
            });
        }).catch((error: Object) => {
            console.error(`Main window unavailable for system bar colors: ${JSON.stringify(error)}`);
        });
    }
    private secondsLabel(): string { return this.locale === 'en' ? 'seconds' : '秒'; }
    private today(): DailyProgress { return this.model.progressFor(todayKey()); }
    private refresh(): void { this.progress = this.model.progress.map((item: DailyProgress) => new DailyProgress(item.dateKey, item.completedSets, item.totalSeconds, item.lastCompletedAt, item.completedRepetitions ?? 0)); }
    private async save(): Promise<void> {
        this.reminderTimes = this.normalizeReminderTimes(this.reminderTimes);
        this.model.plan = clonePlan(this.savedPlan);
        this.model.voiceLanguage = this.voiceLanguage;
        this.model.themeColor = this.themeColor;
        this.model.darkMode = this.darkMode;
        this.model.hapticsEnabled = this.hapticsEnabled;
        this.model.customPrimary = this.customPrimary;
        this.model.reminders.enabled = this.remindersEnabled;
        this.model.reminders.times = this.reminderTimes.slice();
        await PreferenceStore.save(this.model);
    }
    private start(): void {
        console.info(`[TrainingTrace] start set=${Math.min(this.savedPlan.setsPerDay, this.today().completedSets + 1)}/${this.savedPlan.setsPerDay}, repetitions=${this.savedPlan.repetitions}`);
        if (this.wearableMode) {
            this.wearableTab = 1;
        }
        this.page = 'train';
        this.phase = 'ready';
        this.remaining = 3;
        this.repetition = 0;
        this.trainingSet = Math.min(this.savedPlan.setsPerDay, this.today().completedSets + 1);
        this.finishedSets = this.today().completedSets;
        this.paused = false;
        this.countdownScale = 1;
        this.breathingScale = 1;
        this.breathingOffsetX = 0;
        this.breathingOffsetY = 0;
        this.breathingPhase = 'ready';
        this.trainStartedAt = Date.now();
        this.trainingHapticApiLogged = false;
        this.persistSession();
        this.speakForSet('ready');
        this.startTimer();
        this.startSystemSession();
    }
    private startTimer(): void {
        this.stopTimer();
        this.startBreathing();
        // Keep the workout clock tied to wall time instead of assuming that a
        // JavaScript interval fires exactly once per second. HarmonyOS may pause
        // the UI event loop briefly while the app is backgrounded or while Live
        // View is being updated; missed ticks are caught up on the next callback.
        this.nextTrainingTickAt = Date.now() + 1000;
        this.timerId = setInterval(() => {
            if (this.paused || this.timerId < 0) {
                return;
            }
            const now: number = Date.now();
            let tickCount: number = 0;
            while (!this.paused && this.timerId >= 0 && this.nextTrainingTickAt > 0 && now >= this.nextTrainingTickAt && tickCount < 30) {
                const scheduledTick: number = this.nextTrainingTickAt;
                this.advance();
                if (this.timerId < 0 || this.phase === 'complete') {
                    this.nextTrainingTickAt = 0;
                    break;
                }
                this.nextTrainingTickAt = scheduledTick + 1000;
                tickCount += 1;
            }
        }, 200);
    }
    private stopTimer(): void {
        if (this.timerId >= 0) {
            clearInterval(this.timerId);
            this.timerId = -1;
        }
        this.nextTrainingTickAt = 0;
        if (this.wearableHapticTimerId >= 0) {
            clearTimeout(this.wearableHapticTimerId);
            this.wearableHapticTimerId = -1;
        }
        if (this.wearableMode || this.hapticsEnabled) {
            vibrator.stopVibration(vibrator.VibratorStopMode.VIBRATOR_STOP_MODE_TIME).catch((_error: Object) => { });
        }
        this.stopBreathing();
    }
    private wearablePulse(duration: number, effectId?: string, intensity: number = 100): void {
        if (!this.wearableMode && !this.hapticsEnabled) {
            return;
        }
        // Keep the helper local to the current device.  Passing explicit defaults
        // avoids noisy GetPropertyInt32 logs on watch/phone runtimes that do not
        // populate optional vibrator routing fields automatically; the phone and
        // wearable companion each vibrate their own local motor.
        const hapticAttribute: vibrator.VibrateAttribute = { id: 0, deviceId: 0, usage: 'physicalFeedback' };
        const start = (supported: boolean): void => {
            const actualIntensity: number = Math.max(1, Math.min(100, intensity));
            const vibration: Promise<void> = supported && effectId !== undefined
                ? vibrator.startVibration({ type: 'preset', effectId: effectId, count: 1, intensity: actualIntensity }, hapticAttribute)
                : vibrator.startVibration({ type: 'time', duration: duration }, hapticAttribute);
            vibration.catch((error: Object) => {
                // Some wearable emulators do not expose a motor. Keep the workout usable
                // there while still using the same API on real watches.
                if (!this.wearableHapticUnavailableLogged) {
                    this.wearableHapticUnavailableLogged = true;
                    console.info(`Training haptic unavailable: ${JSON.stringify(error)}`);
                }
            });
        };
        if (effectId === undefined) {
            start(false);
            return;
        }
        const cachedSupport: boolean | undefined = effectId === 'haptic.effect.hard'
            ? this.hardHapticSupported
            : this.softHapticSupported;
        if (cachedSupport !== undefined) {
            start(cachedSupport);
            return;
        }
        vibrator.isSupportEffect(effectId).then((supported: boolean) => {
            if (effectId === 'haptic.effect.hard') {
                this.hardHapticSupported = supported;
            }
            else {
                this.softHapticSupported = supported;
            }
            start(supported);
        }).catch((_error: Object) => start(false));
    }
    /**
     * Diagnostic/maximum phone pulse. Keep this separate from the refined
     * preset rhythm so we can prove the training path reaches the vibrator API
     * on a physical phone. Time effects are intentionally long for this test.
     */
    private trainingPulse(duration: number): void {
        if (!this.wearableMode && !this.hapticsEnabled) {
            return;
        }
        const actualDuration: number = Math.max(400, Math.min(1000, duration));
        if (!this.trainingHapticApiLogged) {
            this.trainingHapticApiLogged = true;
            console.info(`Training haptic API invoked: duration=${actualDuration}, usage=physicalFeedback`);
        }
        vibrator.startVibration({ type: 'time', duration: actualDuration }, { id: 0, deviceId: 0, usage: 'physicalFeedback' as vibrator.Usage }).catch((error: Object) => {
            console.error(`Training haptic API failed: ${JSON.stringify(error)}`);
        });
    }
    private wearablePhaseHaptic(phase: TrainingPhase): void {
        if (!this.wearableMode && !this.hapticsEnabled) {
            return;
        }
        if (this.wearableHapticTimerId >= 0) {
            clearTimeout(this.wearableHapticTimerId);
            this.wearableHapticTimerId = -1;
        }
        if (phase === 'tighten') {
            // A short, firm edge marks the start without masking the voice cue.
            this.wearablePulse(110, 'haptic.effect.hard', 62);
        }
        else if (phase === 'relax') {
            // Two gentle pulses create a clear release boundary.
            this.wearablePulse(75, 'haptic.effect.soft', 42);
            this.wearableHapticTimerId = setTimeout(() => {
                this.wearablePulse(75, 'haptic.effect.soft', 42);
                this.wearableHapticTimerId = -1;
            }, 150);
        }
        else if (phase === 'complete') {
            this.wearablePulse(110, 'haptic.effect.hard', 62);
            this.wearableHapticTimerId = setTimeout(() => {
                this.wearablePulse(110, 'haptic.effect.hard', 62);
                this.wearableHapticTimerId = -1;
            }, 180);
        }
    }
    private wearableTickHaptic(phase: TrainingPhase): void {
        if (!this.wearableMode && !this.hapticsEnabled) {
            return;
        }
        // During the hold, one light tick per second keeps the rhythm clear. The
        // release phase is quieter and slower so it does not become a buzz.
        if (phase === 'tighten') {
            this.wearablePulse(60, 'haptic.effect.hard', 34);
        }
        else if (phase === 'relax' && this.remaining % 2 === 0) {
            this.wearablePulse(55, 'haptic.effect.soft', 28);
        }
    }
    private resetBreathingPhase(): void {
        this.breathingPhase = this.phase;
        this.breathingPhaseStartedAt = Date.now();
        this.breathingTick = 0;
        this.breathingOffsetX = 0;
        this.breathingOffsetY = 0;
        this.breathingScale = this.phase === 'relax' ? 0.9 : 1;
    }
    private startBreathing(): void {
        this.stopBreathing();
        this.resetBreathingPhase();
        // Update often enough for a soft, breathing-like motion while keeping the
        // actual workout clock on its one-second cadence.
        this.breathingTimerId = setInterval(() => {
            if (this.paused || this.phase === 'complete') {
                return;
            }
            if (this.breathingPhase !== this.phase) {
                this.resetBreathingPhase();
            }
            const elapsedSeconds: number = Math.max(0, (Date.now() - this.breathingPhaseStartedAt) / 1000);
            const progress: number = Math.min(1, elapsedSeconds / 2);
            if (this.phase === 'tighten') {
                // The first two seconds are a slow squeeze. Once held, add a
                // fine, higher-frequency tremble with a deliberately small amplitude
                // so the ring feels alive without distracting from the countdown.
                this.breathingScale = 1 - progress * 0.1;
                if (progress >= 1) {
                    this.breathingTick += 1;
                    this.breathingOffsetX = Math.sin(this.breathingTick * 2.7) * 0.65;
                    this.breathingOffsetY = Math.cos(this.breathingTick * 2.3) * 0.45;
                }
                else {
                    this.breathingOffsetX = 0;
                    this.breathingOffsetY = 0;
                }
            }
            else if (this.phase === 'relax') {
                // Relaxing reverses the motion: gently open for two seconds, then
                // settle into a still, neutral ring.
                this.breathingScale = 0.9 + progress * 0.1;
                this.breathingOffsetX = 0;
                this.breathingOffsetY = 0;
            }
            else {
                this.breathingScale = 1;
                this.breathingOffsetX = 0;
                this.breathingOffsetY = 0;
            }
        }, 100);
    }
    private stopBreathing(): void { if (this.breathingTimerId >= 0) {
        clearInterval(this.breathingTimerId);
        this.breathingTimerId = -1;
    } this.breathingScale = 1; this.breathingOffsetX = 0; this.breathingOffsetY = 0; this.breathingPhase = 'ready'; this.breathingPhaseStartedAt = 0; this.breathingTick = 0; }
    private pulseCountdown(): void { this.getUIContext().animateTo({ duration: 160, curve: Curve.EaseOut, onFinish: () => { this.getUIContext().animateTo({ duration: 260, curve: Curve.EaseInOut }, () => { this.countdownScale = 1; }); } }, () => { this.countdownScale = 1.08; }); }
    private advance(): void {
        console.info(`[TrainingTrace] advance phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}/${this.savedPlan.repetitions}, set=${this.trainingSet}/${this.savedPlan.setsPerDay}, paused=${this.paused}`);
        if (this.phase === 'ready') {
            if (this.remaining > 1) {
                this.remaining -= 1;
                this.pulseCountdown();
                this.speakCount(this.remaining);
                return;
            }
            this.phase = 'tighten';
            this.remaining = this.savedPlan.tightenSeconds;
            this.resetBreathingPhase();
            this.wearablePhaseHaptic('tighten');
            this.pulseCountdown();
            this.speakForSet('tighten');
            this.persistSession();
            this.updateSystemSession();
            return;
        }
        if (this.remaining > 1) {
            this.remaining -= 1;
            this.wearableTickHaptic(this.phase);
            this.pulseCountdown();
            return;
        }
        if (this.phase === 'tighten') {
            this.phase = 'relax';
            this.remaining = this.savedPlan.relaxSeconds;
            this.resetBreathingPhase();
            this.wearablePhaseHaptic('relax');
            this.pulseCountdown();
            this.speakForSet('relax');
            this.persistSession();
            this.updateSystemSession();
            return;
        }
        if (this.phase === 'relax') {
            this.repetition += 1;
            if (this.repetition >= this.savedPlan.repetitions) {
                this.phase = 'complete';
                this.remaining = 0;
                this.stopTimer();
                this.wearablePhaseHaptic('complete');
                this.speakForSet('finish');
                this.completeSet();
            }
            else {
                this.phase = 'tighten';
                this.remaining = this.savedPlan.tightenSeconds;
                this.resetBreathingPhase();
                this.wearablePhaseHaptic('tighten');
                this.pulseCountdown();
                this.speakForSet('tighten');
                this.persistSession();
                this.updateSystemSession();
            }
        }
    }
    private completeSet(): void { const seconds: number = Math.round((Date.now() - this.trainStartedAt) / 1000); this.model.recordSet(seconds, todayKey()); this.finishedSets = this.today().completedSets; this.refresh(); this.model.activeTraining = undefined; this.save(); this.finishSystemSession(); }
    private speak(cue: VoiceCue): void { const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext; VoiceService.speakCue(cue, this.voiceLanguage, context).catch((error: Object) => console.error(`Voice cue failed: ${JSON.stringify(error)}`)); }
    private speakCompact(cue: CompactVoiceCue): void { const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext; VoiceService.speakCompactCue(cue, this.voiceLanguage, context).catch((error: Object) => console.error(`Compact voice cue failed: ${JSON.stringify(error)}`)); }
    private speakForSet(cue: VoiceCue): void {
        if (this.trainingSet === 1) {
            this.speak(cue);
            return;
        }
        if (cue === 'breathe') {
            this.speak(cue);
            return;
        }
        this.speakCompact(cue);
    }
    private speakCount(count: number): void { const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext; VoiceService.speakCount(count, this.voiceLanguage, context).catch((error: Object) => console.error(`Voice count failed: ${JSON.stringify(error)}`)); }
    private togglePause(): void {
        console.info(`[TrainingTrace] togglePause requested: before paused=${this.paused}, phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}/${this.savedPlan.repetitions}`);
        this.paused = !this.paused;
        // Do not count time spent explicitly paused. Resume starts a fresh
        // one-second wall-clock window instead of catching up the pause duration.
        this.nextTrainingTickAt = this.paused ? 0 : Date.now() + 1000;
        this.persistSession();
        if (this.paused) {
            // Keep the Live View visible while paused. Its timer is frozen and the
            // service button changes to “继续” so the workout can resume in place.
            VoiceService.stop();
            this.speakForSet('pause');
            console.info(`[TrainingTrace] paused: phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}/${this.savedPlan.repetitions}`);
            this.updateSystemSession();
        }
        else {
            this.updateSystemSession();
            this.speakForSet(this.phase === 'ready' ? 'ready' : this.phase === 'tighten' ? 'tighten' : 'relax');
            console.info(`[TrainingTrace] resumed: phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}/${this.savedPlan.repetitions}`);
        }
    }
    private end(): void { this.stopConfirming = false; this.stopTimer(); VoiceService.stop(); this.model.activeTraining = undefined; this.save(); this.stopSystemSession(); this.phase = 'ready'; this.page = 'home'; if (this.wearableMode) {
        this.wearableTab = 1;
    } }
    private systemState(): SystemTrainingState {
        return { phase: this.phase, remaining: this.remaining, repetition: this.repetition, repetitions: this.savedPlan.repetitions, trainingSet: this.trainingSet, setsPerDay: this.savedPlan.setsPerDay, paused: this.paused, wearable: this.wearableMode };
    }
    private handleLiveViewCommand(command: LiveViewCommand): void {
        console.info(`[TrainingTrace] Live View command received=${command}, page=${this.page}, phase=${this.phase}, active=${this.model.activeTraining !== undefined && this.model.activeTraining.active}, paused=${this.paused}`);
        if (command === 'togglePause') {
            if (this.page === 'train' && this.model.activeTraining !== undefined && this.model.activeTraining.active) {
                this.togglePause();
            }
            else {
                console.info(`[TrainingTrace] togglePause ignored: page=${this.page}, hasActive=${this.model.activeTraining !== undefined && this.model.activeTraining.active}`);
            }
            return;
        }
        // The completion card is ended with a deliberate tap instead of being
        // dismissed silently. Reuse the same actions as the in-app completion
        // button so progress is recorded exactly once.
        if (command === 'completeAction' && this.page === 'train' && this.phase === 'complete') {
            if (this.finishedSets >= this.savedPlan.setsPerDay) {
                this.end();
            }
            else {
                this.start();
            }
        }
        else if (command === 'completeAction') {
            console.info(`[TrainingTrace] completeAction ignored: page=${this.page}, phase=${this.phase}`);
        }
    }
    private startSystemSession(): void {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        console.info(`[TrainingTrace] startSystemSession: phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}, set=${this.trainingSet}`);
        SystemTrainingService.start(context, this.systemState()).catch((error: Object) => console.error(`System training start failed: ${JSON.stringify(error)}`));
    }
    private updateSystemSession(): void {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        console.info(`[TrainingTrace] updateSystemSession: phase=${this.phase}, remaining=${this.remaining}, repetition=${this.repetition}, set=${this.trainingSet}, paused=${this.paused}`);
        SystemTrainingService.update(context, this.systemState()).catch((error: Object) => console.error(`System training update failed: ${JSON.stringify(error)}`));
    }
    private stopSystemSession(): void {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        console.info('[TrainingTrace] stopSystemSession');
        SystemTrainingService.stop(context).catch((error: Object) => console.error(`System training stop failed: ${JSON.stringify(error)}`));
    }
    private finishSystemSession(): void {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        console.info(`[TrainingTrace] finishSystemSession: phase=${this.phase}, repetition=${this.repetition}, set=${this.trainingSet}`);
        SystemTrainingService.finish(context, this.systemState()).catch((error: Object) => console.error(`System training finish failed: ${JSON.stringify(error)}`));
    }
    private persistSession(): void { this.model.activeTraining = new ActiveTraining(true, this.phase, this.remaining, this.repetition, this.trainingSet, this.paused, this.trainStartedAt, Date.now()); this.save(); }
    private restoreSession(active: ActiveTraining): void {
        this.phase = active.phase;
        this.remaining = active.remaining;
        this.repetition = active.repetition;
        this.trainingSet = active.trainingSet;
        this.paused = active.paused;
        if (this.paused || active.updatedAt <= 0 || this.phase === 'complete') {
            return;
        }
        let elapsed: number = Math.max(0, Math.floor((Date.now() - active.updatedAt) / 1000));
        let restoring: boolean = true;
        while (elapsed > 0 && restoring) {
            if (this.remaining > 1) {
                this.remaining -= 1;
            }
            else if (this.phase === 'ready') {
                this.phase = 'tighten';
                this.remaining = this.savedPlan.tightenSeconds;
            }
            else if (this.phase === 'tighten') {
                this.phase = 'relax';
                this.remaining = this.savedPlan.relaxSeconds;
            }
            else {
                this.repetition += 1;
                if (this.repetition >= this.savedPlan.repetitions) {
                    this.phase = 'complete';
                    this.remaining = 0;
                    restoring = false;
                    break;
                }
                this.phase = 'tighten';
                this.remaining = this.savedPlan.tightenSeconds;
            }
            elapsed -= 1;
        }
    }
    private updatePlan(key: string, delta: number): void {
        const next: TrainingPlan = clonePlan(this.plan);
        if (key === 'tighten') {
            next.tightenSeconds = Math.min(30, Math.max(1, next.tightenSeconds + delta));
        }
        else if (key === 'relax') {
            next.relaxSeconds = Math.min(30, Math.max(1, next.relaxSeconds + delta));
        }
        else if (key === 'repetitions') {
            next.repetitions = Math.min(15, Math.max(10, next.repetitions + delta));
        }
        else {
            next.setsPerDay = Math.min(3, Math.max(1, next.setsPerDay + delta));
        }
        this.plan = next;
    }
    private async savePlan(): Promise<void> {
        this.savedPlan = clonePlan(this.plan);
        const beforeCount: number = this.reminderTimes.length;
        this.reminderTimes = this.alignReminderTimesToSetCount(this.reminderTimes, this.savedPlan.setsPerDay);
        await this.save();
        if (this.remindersEnabled && beforeCount > this.reminderTimes.length) {
            const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
            if (!result.success) {
                this.reminderError = this.reminderErrorText(result.errorCode);
            }
        }
        this.toast = beforeCount > this.reminderTimes.length ? this.text('reminderTrimmed') : this.text('save');
        setTimeout(() => this.toast = '', 1800);
    }
    private selectVoice(value: VoiceLanguage): void { this.voiceLanguage = value; this.model.voiceLanguage = value; this.save(); }
    private toggleDarkMode(): void { this.darkMode = !this.darkMode; this.model.darkMode = this.darkMode; this.applySystemBarColors(); this.save(); }
    private toggleHaptics(): void { this.hapticsEnabled = !this.hapticsEnabled; this.model.hapticsEnabled = this.hapticsEnabled; this.save(); if (this.hapticsEnabled) {
        this.wearablePulse(35);
    } }
    private testTrainingHaptic(): void {
        if (!this.hapticsEnabled) {
            this.toast = this.text('hapticsNeedEnable');
            setTimeout(() => this.toast = '', 1800);
            return;
        }
        this.trainingPulse(1000);
        this.toast = this.locale === 'en' ? 'Training haptic API called' : '已调用训练震动 API';
        setTimeout(() => this.toast = '', 1800);
    }
    private selectTheme(value: ThemeColor): void {
        this.themeColor = value;
        this.model.themeColor = value;
        if (value !== 'custom') {
            this.setPickerFromColor(this.presetSwatch(value));
        }
        this.applySystemBarColors();
        this.save();
    }
    private presetSwatch(value: ThemeColor): string {
        if (value === 'blue') {
            return '#45618F';
        }
        if (value === 'purple') {
            return '#6750A4';
        }
        if (value === 'orange') {
            return '#8A4E00';
        }
        if (value === 'rose') {
            return '#984061';
        }
        if (value === 'green') {
            return '#4B5F2A';
        }
        return '#087F73';
    }
    private selectCustomColor(value: string): void {
        if (!validHexColor(value)) {
            return;
        }
        this.customPrimary = value.toUpperCase();
        this.themeColor = 'custom';
        this.model.customPrimary = this.customPrimary;
        this.model.themeColor = 'custom';
        this.setPickerFromColor(this.customPrimary);
        this.applySystemBarColors();
        this.save();
    }
    private openColorPicker(): void {
        this.pickerOriginalColor = this.themeColor === 'custom' ? this.customPrimary : this.presetSwatch(this.themeColor);
        this.setPickerFromColor(this.pickerOriginalColor);
        this.colorPickerDialog = new CustomDialogController({
            builder: () => {
                let jsDialog = new CustomHuePickerDialog(this, {
                    initialHue: this.pickerHue,
                    initialSaturation: this.pickerSaturation,
                    initialValue: this.pickerValue,
                    primary: this.primaryColor(),
                    surface: this.surfaceColor(),
                    text: this.textColor(),
                    muted: this.mutedColor(),
                    title: this.locale === 'en' ? 'Color picker' : '自定义取色器',
                    hint: this.locale === 'en' ? 'Drag to choose hue, saturation and brightness' : '拖动选择色相、饱和度和明度',
                    cancelLabel: this.locale === 'en' ? 'Cancel' : '取消',
                    confirmLabel: this.locale === 'en' ? 'Use this color' : '使用此颜色',
                    onConfirm: (color: string) => this.confirmPickerColor(color),
                    onCancel: () => this.cancelPickerColor()
                }, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 1007, col: 16 });
                jsDialog.setController(this.colorPickerDialog);
                ViewPU.create(jsDialog);
                let paramsLambda = () => {
                    return {
                        initialHue: this.pickerHue,
                        initialSaturation: this.pickerSaturation,
                        initialValue: this.pickerValue,
                        primary: this.primaryColor(),
                        surface: this.surfaceColor(),
                        text: this.textColor(),
                        muted: this.mutedColor(),
                        title: this.locale === 'en' ? 'Color picker' : '自定义取色器',
                        hint: this.locale === 'en' ? 'Drag to choose hue, saturation and brightness' : '拖动选择色相、饱和度和明度',
                        cancelLabel: this.locale === 'en' ? 'Cancel' : '取消',
                        confirmLabel: this.locale === 'en' ? 'Use this color' : '使用此颜色',
                        onConfirm: (color: string) => this.confirmPickerColor(color),
                        onCancel: () => this.cancelPickerColor()
                    };
                };
                jsDialog.paramsGenerator_ = paramsLambda;
            },
            autoCancel: true,
            cancel: () => this.cancelPickerColor(),
            alignment: DialogAlignment.Center,
            gridCount: 4,
            customStyle: false,
            cornerRadius: 28,
            width: '90%',
            backgroundColor: this.surfaceColor(),
            maskColor: '#66000000'
        }, this);
        this.colorPickerDialog.open();
    }
    private confirmPickerColor(color: string): void {
        const normalizedColor: string = normalizeHexColor(color);
        this.customPrimary = normalizedColor;
        this.themeColor = 'custom';
        this.model.customPrimary = normalizedColor;
        this.model.themeColor = 'custom';
        this.applySystemBarColors();
        this.save();
    }
    private cancelPickerColor(): void {
        this.setPickerFromColor(this.pickerOriginalColor);
    }
    private setPickerFromColor(value: string): void {
        const pickerColor: HsvColor = hexToHsv(value);
        this.pickerHue = pickerColor.hue;
        this.pickerSaturation = pickerColor.saturation;
        this.pickerValue = pickerColor.value;
    }
    private themeLabel(): string {
        return this.themeColor === 'custom' ? this.customPrimary : this.text('theme');
    }
    private activeAccentColor(): string {
        return this.themeColor === 'custom' ? this.customPrimary : this.presetSwatch(this.themeColor);
    }
    private normalizeReminderTimes(times: Array<string>): Array<string> {
        const result: Array<string> = [];
        for (let index: number = 0; index < times.length && result.length < 3; index++) {
            const candidate: string = times[index];
            if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(candidate)) {
                continue;
            }
            if (result.indexOf(candidate) < 0) {
                result.push(candidate);
            }
        }
        if (result.length === 0) {
            result.push('08:00');
        }
        result.sort((left: string, right: string) => left < right ? -1 : (left > right ? 1 : 0));
        return result;
    }
    private alignReminderTimesToSetCount(times: Array<string>, setsPerDay: number): Array<string> {
        const result: Array<string> = this.normalizeReminderTimes(times);
        const maxCount: number = Math.max(1, Math.min(3, setsPerDay));
        while (result.length > maxCount) {
            // normalizeReminderTimes sorts ascending, so the last entry is the
            // latest reminder and is the one removed first.
            result.pop();
        }
        return result;
    }
    private maxReminderCount(): number {
        return Math.max(1, Math.min(3, this.savedPlan.setsPerDay));
    }
    private planGuidance(): string {
        return this.locale === 'en'
            ? `Recommended starting point: ${this.plan.repetitions} repetitions per set, ${this.plan.setsPerDay} sets a day. Keep it comfortable and aim for 14 consistent days before adjusting.`
            : `建议起步：每组 ${this.plan.repetitions} 次、每天 ${this.plan.setsPerDay} 组。以舒适为准，先连续坚持 14 天，再按感受调整。`;
    }
    private currentStreak(): number {
        let streak: number = 0;
        const cursor: Date = new Date();
        for (let index: number = 0; index < 365; index++) {
            const progress: DailyProgress = this.model.progressFor(formatDateKey(cursor));
            if (progress.completedSets < this.savedPlan.setsPerDay) {
                break;
            }
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
    }
    private calendarGuidance(): string {
        const streak: number = this.currentStreak();
        return this.locale === 'en'
            ? `Aim for 14 consecutive days. Current streak: ${streak} day${streak === 1 ? '' : 's'}; complete ${this.savedPlan.setsPerDay} sets each day to check in.`
            : `建议连续打卡 14 天。当前连续 ${streak} 天；每天完成 ${this.savedPlan.setsPerDay} 组即可完成当天打卡。`;
    }
    private nextAvailableReminderTime(): string {
        const preferred: Array<string> = ['08:00', '12:00', '18:00', '21:00'];
        for (let index: number = 0; index < preferred.length; index++) {
            if (this.reminderTimes.indexOf(preferred[index]) < 0) {
                return preferred[index];
            }
        }
        for (let hour: number = 0; hour < 24; hour++) {
            const candidate: string = `${String(hour).padStart(2, '0')}:00`;
            if (this.reminderTimes.indexOf(candidate) < 0) {
                return candidate;
            }
        }
        return '23:59';
    }
    private reminderErrorText(code: number): string {
        if (code === 1700002) {
            // The proxy-reminder capability is optional for this app. Keep the
            // failure silent instead of surfacing a platform-application prompt in
            // the daily reminder settings.
            return '';
        }
        if (code === 1700001 || code === 201) {
            return this.text('reminderNotificationDisabled');
        }
        return this.text('reminderApplyFailed');
    }
    private async toggleReminders(): Promise<void> {
        this.reminderTimes = this.normalizeReminderTimes(this.reminderTimes);
        const nextEnabled: boolean = !this.remindersEnabled;
        this.remindersEnabled = nextEnabled;
        this.model.reminders.enabled = nextEnabled;
        this.model.reminders.times = this.reminderTimes.slice();
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
        if (!result.success && nextEnabled) {
            this.remindersEnabled = false;
            this.model.reminders.enabled = false;
            this.reminderError = this.reminderErrorText(result.errorCode);
            this.toast = this.reminderErrorText(result.errorCode);
            setTimeout(() => this.toast = '', 2600);
        }
        else if (!result.success) {
            this.reminderError = this.reminderErrorText(result.errorCode);
            this.toast = this.reminderErrorText(result.errorCode);
            setTimeout(() => this.toast = '', 2600);
        }
        else {
            this.reminderError = '';
        }
        await this.save();
    }
    private formatReminderTime(hour: number, minute: number): string { return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0"); }
    private reminderDate(time: string): Date { const parts: Array<string> = time.split(":"); const result: Date = new Date(); result.setHours(Number(parts[0]), Number(parts[1]), 0, 0); return result; }
    private editReminderTime(index: number): void { if (index < 0 || index >= this.reminderTimes.length) {
        return;
    } const selected: Date = this.reminderDate(this.reminderTimes[index]); this.getUIContext().showTimePickerDialog({ selected, format: TimePickerFormat.HOUR_MINUTE, useMilitaryTime: true, onAccept: (value: TimePickerResult) => { if (value.hour !== undefined && value.minute !== undefined) {
            this.commitReminderTime(index, value.hour, value.minute);
        } } }); }
    private async commitReminderTime(index: number, hour: number, minute: number): Promise<void> {
        if (index < 0 || index >= this.reminderTimes.length) {
            return;
        }
        const nextTime: string = this.formatReminderTime(hour, minute);
        for (let itemIndex: number = 0; itemIndex < this.reminderTimes.length; itemIndex++) {
            if (itemIndex !== index && this.reminderTimes[itemIndex] === nextTime) {
                this.toast = this.text('reminderDuplicate');
                setTimeout(() => this.toast = '', 1600);
                return;
            }
        }
        const next: Array<string> = this.reminderTimes.slice();
        next[index] = nextTime;
        this.reminderTimes = this.normalizeReminderTimes(next);
        await this.save();
        if (this.remindersEnabled) {
            const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
            if (!result.success) {
                this.reminderError = this.reminderErrorText(result.errorCode);
                this.toast = this.reminderErrorText(result.errorCode);
                setTimeout(() => this.toast = '', 2600);
            }
            else {
                this.reminderError = '';
            }
        }
    }
    /**
     * Wearable-only reminder editing. The watch does not open the phone time
     * picker; it sends a normalized HH:mm value from its large +/- controls.
     */
    private async setReminderTimeFromWearable(index: number, value: string): Promise<void> {
        if (index < 0 || index >= this.reminderTimes.length || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
            return;
        }
        for (let itemIndex: number = 0; itemIndex < this.reminderTimes.length; itemIndex++) {
            if (itemIndex !== index && this.reminderTimes[itemIndex] === value) {
                this.toast = this.text('reminderDuplicate');
                setTimeout(() => this.toast = '', 1600);
                return;
            }
        }
        const next: Array<string> = this.reminderTimes.slice();
        next[index] = value;
        this.reminderTimes = this.normalizeReminderTimes(next);
        await this.save();
        if (this.remindersEnabled) {
            const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
            if (!result.success) {
                this.reminderError = this.reminderErrorText(result.errorCode);
                this.toast = this.reminderErrorText(result.errorCode);
                setTimeout(() => this.toast = '', 2600);
            }
            else {
                this.reminderError = '';
            }
        }
    }
    private async removeReminderTime(index: number): Promise<void> { if (this.reminderTimes.length <= 1 || index < 0 || index >= this.reminderTimes.length) {
        return;
    } this.reminderTimes = this.reminderTimes.filter((_item: string, itemIndex: number) => itemIndex !== index); await this.save(); if (this.remindersEnabled) {
        const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
        if (!result.success) {
            this.reminderError = this.reminderErrorText(result.errorCode);
            this.toast = this.reminderErrorText(result.errorCode);
            setTimeout(() => this.toast = '', 2600);
        }
        else {
            this.reminderError = '';
        }
    } }
    private async addReminderTime(): Promise<void> {
        if (this.reminderTimes.length >= this.maxReminderCount()) {
            return;
        }
        const addedTime: string = this.nextAvailableReminderTime();
        this.reminderTimes = this.normalizeReminderTimes(this.reminderTimes.concat([addedTime]));
        await this.save();
        const editIndex: number = this.reminderTimes.indexOf(addedTime);
        if (editIndex >= 0) {
            this.editReminderTime(editIndex);
        }
    }
    private async addReminderTimeForWearable(): Promise<void> {
        if (this.reminderTimes.length >= this.maxReminderCount()) {
            return;
        }
        const addedTime: string = this.nextAvailableReminderTime();
        this.reminderTimes = this.normalizeReminderTimes(this.reminderTimes.concat([addedTime]));
        await this.save();
        if (this.remindersEnabled) {
            const context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const result: ReminderApplyResult = await ReminderService.apply(context, this.model.reminders);
            if (!result.success) {
                this.reminderError = this.reminderErrorText(result.errorCode);
                this.toast = this.reminderErrorText(result.errorCode);
                setTimeout(() => this.toast = '', 2600);
            }
            else {
                this.reminderError = '';
            }
        }
    }
    private cells(): Array<CalendarCell> { const year: number = this.month.getFullYear(); const month: number = this.month.getMonth(); const offset: number = new Date(year, month, 1).getDay(); const count: number = new Date(year, month + 1, 0).getDate(); const result: Array<CalendarCell> = []; for (let i: number = 0; i < offset; i++) {
        result.push(new CalendarCell(0, ''));
    } for (let day: number = 1; day <= count; day++) {
        result.push(new CalendarCell(day, formatDateKey(new Date(year, month, day))));
    } return result; }
    private monthTitle(): string { return `${this.month.getFullYear()} / ${this.month.getMonth() + 1}`; }
    private selectedProgress(): DailyProgress { return this.model.progressFor(this.selectedDate); }
    private statsDays(): Array<StatsDay> {
        const result: Array<StatsDay> = [];
        const today: Date = new Date();
        for (let offset: number = 6; offset >= 0; offset--) {
            const date: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
            const dateKey: string = formatDateKey(date);
            const progress: DailyProgress = this.model.progressFor(dateKey);
            result.push(new StatsDay(dateKey, `${date.getMonth() + 1}/${date.getDate()}`, Math.max(0, progress.completedRepetitions ?? 0)));
        }
        return result;
    }
    private totalRepetitions(): number {
        let total: number = 0;
        for (let index: number = 0; index < this.model.progress.length; index++) {
            total += Math.max(0, this.model.progress[index].completedRepetitions ?? 0);
        }
        return total;
    }
    private statsMax(days: Array<StatsDay>): number {
        let maximum: number = 1;
        for (let index: number = 0; index < days.length; index++) {
            maximum = Math.max(maximum, days[index].repetitions);
        }
        return maximum;
    }
    private statsBarHeight(repetitions: number, maximum: number): number {
        if (repetitions <= 0) {
            return 6;
        }
        return Math.max(12, Math.round(112 * repetitions / Math.max(1, maximum)));
    }
    private clearLocalStats(): void {
        // Keep calendar check-ins intact. Statistics are the repetition volume
        // layered onto each daily progress record, so clearing them only resets
        // that field instead of deleting the whole progress history.
        for (let index: number = 0; index < this.model.progress.length; index++) {
            this.model.progress[index].completedRepetitions = 0;
        }
        this.refresh();
        this.statsClearConfirming = false;
        this.save();
        this.toast = this.text('statsCleared');
        setTimeout(() => this.toast = '', 1800);
    }
    private weekday(index: number): string {
        if (this.locale === 'en') {
            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index];
        }
        return ['日', '一', '二', '三', '四', '五', '六'][index];
    }
    private pageTitle(): string {
        if (this.page === 'train') {
            return this.text('training');
        }
        if (this.page === 'plan') {
            return this.text('plan');
        }
        if (this.page === 'calendar') {
            return this.text('calendar');
        }
        if (this.page === 'intro') {
            return this.text('intro');
        }
        if (this.page === 'settings') {
            return this.text('settings');
        }
        return this.text('home');
    }
    private pageSubtitle(): string {
        if (this.page === 'train') {
            return this.text('trainingSubtitle');
        }
        if (this.page === 'calendar') {
            return this.text('sets');
        }
        if (this.page === 'intro') {
            return this.text('introSubtitle');
        }
        return this.text('greeting');
    }
    private trainingHint(): string {
        if (this.phase === 'tighten') {
            return this.locale === 'en' ? 'Draw the front and back passages inward and up. Keep breathing; your belly, thighs, and glutes stay soft.' : '让会阴前后方一起向内、向上提起。保持呼吸，腹部、大腿和臀部放松。';
        }
        if (this.phase === 'relax') {
            return this.locale === 'en' ? 'Release the front and back completely. Let the pelvic floor return to neutral before the next round.' : '完全放松会阴前后方，感受它回到自然状态，再准备下一次。';
        }
        if (this.phase === 'complete') {
            return this.locale === 'en' ? 'Take a comfortable breath. Your set is done; rest before the next set.' : '慢慢呼吸，本组完成。休息一下，再开始下一组。';
        }
        return this.locale === 'en' ? 'Sit near the front of a chair, feet grounded and shoulders relaxed. Follow the countdown.' : '坐在椅子前半段，双脚踩地，肩膀放松，跟随倒计时开始。';
    }
    private trainingPhaseLabel(): string {
        if (this.phase === 'tighten') {
            return this.text('phaseTighten');
        }
        if (this.phase === 'relax') {
            return this.text('phaseRelax');
        }
        if (this.phase === 'complete') {
            return this.text('complete');
        }
        return this.text('phaseReady');
    }
    private trainingCueShort(): string {
        if (this.phase === 'tighten') {
            return this.locale === 'en' ? 'Front + back · lift' : '前后一起 · 向上提';
        }
        if (this.phase === 'relax') {
            return this.locale === 'en' ? 'Release · keep breathing' : '放松释放 · 保持呼吸';
        }
        if (this.phase === 'complete') {
            return this.locale === 'en' ? 'Rest and reset' : '休息并回到自然状态';
        }
        return this.locale === 'en' ? 'Set posture · breathe' : '坐好姿势 · 自然呼吸';
    }
    private header(title: string, subtitle: string, visible: boolean = false, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (visible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.padding({ left: 20, right: 20, top: 22, bottom: 4 });
                        Row.margin({ bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 4 });
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(title);
                        Text.fontSize(26);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.textColor());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(subtitle);
                        Text.fontSize(13);
                        Text.fontColor(this.mutedColor());
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('●');
                        Text.fontSize(20);
                        Text.fontColor(this.primaryColor());
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    private homeView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 260, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 18 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 24, bottom: 28 });
        }, Column);
        this.header.bind(this)(this.text('home'), this.text('greeting'));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(24);
            Column.shadow({ radius: 16, color: '#17312D12', offsetX: 0, offsetY: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('sets'));
            Text.fontSize(14);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.today().completedSets} / ${this.savedPlan.setsPerDay}`);
            Text.fontSize(34);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('target'));
            Text.fontSize(14);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.savedPlan.repetitions} × ${this.savedPlan.setsPerDay}`);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('setProgress'));
            Text.fontSize(13);
            Text.fontColor(this.mutedColor());
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.today().completedSets} / ${this.savedPlan.setsPerDay}`);
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Progress.create({ value: this.today().completedSets, total: this.savedPlan.setsPerDay, type: ProgressType.Linear });
            Progress.color(this.trainingRingColorForSet(this.upcomingTrainingSet()));
            Progress.backgroundColor(this.pageBorder());
            Progress.height(8);
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.savedPlan.tightenSeconds}s ${this.text('tighten')}  ·  ${this.savedPlan.relaxSeconds}s ${this.text('relax')}`);
            Text.fontSize(14);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.text('start'), { type: ButtonType.Capsule });
            Button.id('start-training');
            Button.width('100%');
            Button.height(56);
            Button.fontSize(17);
            Button.fontWeight(FontWeight.Bold);
            Button.fontColor(this.onPrimaryColor());
            Button.backgroundColor(this.primaryColor());
            Button.stateEffect(true);
            Button.onClick(() => this.start());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.accentColor());
            Column.borderRadius(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✦');
            Text.fontSize(20);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('safety'));
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.textColor());
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('safetyBody'));
            Text.fontSize(14);
            Text.lineHeight(22);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('healthNote'));
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
    }
    private visibleRepetition(): number {
        if (this.phase === 'ready') {
            return 0;
        }
        if (this.phase === 'complete') {
            return this.savedPlan.repetitions;
        }
        return Math.min(this.savedPlan.repetitions, this.repetition + 1);
    }
    private repetitionProgressPercent(): number {
        const total: number = Math.max(1, this.savedPlan.repetitions);
        return Math.min(100, Math.max(0, Math.round(this.visibleRepetition() * 100 / total)));
    }
    /**
     * Keep the ring tied to the active set while still respecting the selected
     * Material theme color. Each daily set gets a distinct tint so a user can
     * tell the first, second, and third set apart without adding text inside the
     * timer.
     */
    private upcomingTrainingSet(): number {
        const targetSets: number = Math.max(1, Math.min(3, this.savedPlan.setsPerDay));
        return Math.min(targetSets, this.today().completedSets + 1);
    }
    private trainingRingColorForSet(setIndex: number): string {
        const normalizedSet: number = Math.max(1, Math.min(3, Math.round(setIndex)));
        // Derive every group tint from the selected theme swatch (including a
        // custom picker color), then vary only value. This keeps the ring visibly
        // tied to the user's theme instead of washing it into a neutral gray.
        const themeHsv: HsvColor = hexToHsv(this.activeAccentColor());
        const saturation: number = Math.max(0.5, themeHsv.saturation);
        let value: number = themeHsv.value;
        if (this.darkMode) {
            const firstSetValue: number = Math.max(0.70, Math.min(0.86, themeHsv.value + 0.22));
            value = normalizedSet === 1 ? firstSetValue : normalizedSet === 2 ? Math.min(0.94, firstSetValue + 0.10) : Math.min(1, firstSetValue + 0.18);
        }
        else {
            const firstSetValue: number = Math.max(0.45, Math.min(0.68, themeHsv.value));
            value = normalizedSet === 1 ? firstSetValue : normalizedSet === 2 ? Math.min(0.9, firstSetValue + 0.16) : Math.max(0.3, firstSetValue - 0.12);
        }
        return hsvToHex(themeHsv.hue, saturation, value);
    }
    private trainingRingColor(): string {
        return this.trainingRingColorForSet(this.trainingSet);
    }
    private trainingRingTrackColor(): string {
        return blendHexColor(this.trainingRingColor(), this.pageBackground(), this.darkMode ? 0.34 : 0.12);
    }
    private trainView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.width('100%');
            Scroll.backgroundColor(this.pageBackground());
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 220, curve: Curve.EaseOut }).combine(TransitionEffect.scale({ x: 0.96, y: 0.96 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.width('100%');
            Column.padding({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 20, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('seatedBasics'));
            Text.fontSize(12);
            Text.fontColor(this.primaryColor());
            Text.backgroundColor(this.accentColor());
            Text.borderRadius(16);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.trainingPhaseLabel());
            Text.id('training-phase');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            globalThis.Context.animation({ duration: 120, curve: Curve.EaseInOut });
            Stack.width(300);
            Stack.height(300);
            Stack.borderRadius(150);
            Stack.clip(true);
            Stack.scale({ x: this.breathingScale, y: this.breathingScale });
            Stack.offset({ x: this.breathingOffsetX, y: this.breathingOffsetY });
            globalThis.Context.animation(null);
            Stack.margin({ top: 10, bottom: 10 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(286);
            Circle.height(286);
            Circle.fillOpacity(0);
            Circle.strokeWidth(2);
            Circle.stroke(this.trainingRingColor());
            Circle.strokeOpacity(0.18);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.create({ value: this.repetitionProgressPercent(), total: 100, type: ProgressType.Ring });
            globalThis.Context.animation({ duration: 240, curve: Curve.EaseInOut });
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.id('training-repetition-ring');
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.width(278);
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.height(278);
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.color(this.trainingRingColor());
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.backgroundColor(this.trainingRingTrackColor());
            // A real Ring progress component keeps the outer shape circular and
            // maps repetition progress to the arc. The track remains visible so
            // a partially completed repetition count is easy to read at a glance.
            Progress.style({ strokeWidth: 10, shadow: true });
            globalThis.Context.animation(null);
        }, Progress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(252);
            Circle.height(252);
            Circle.fill(this.accentColor());
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.phase === 'complete' ? '✓' : `${this.remaining}`);
            Text.id('training-countdown');
            Text.fontSize(64);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor());
            Text.scale({ x: this.countdownScale, y: this.countdownScale });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.phase === 'complete' ? this.text('complete') : this.text('secondsShort'));
            Text.fontSize(14);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.trainingCueShort());
            Text.fontSize(12);
            Text.fontColor(this.primaryColor());
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Column.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.trainingHint());
            Text.fontSize(14);
            Text.lineHeight(22);
            Text.fontColor(this.textColor());
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('safetyBody'));
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor(this.mutedColor());
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.phase === 'complete') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.finishedSets >= this.savedPlan.setsPerDay ? this.text('home') : this.text('start'), { type: ButtonType.Capsule });
                        Button.width('88%');
                        Button.height(54);
                        Button.fontSize(16);
                        Button.fontColor(this.onPrimaryColor());
                        Button.backgroundColor(this.primaryColor());
                        Button.stateEffect(true);
                        Button.onClick(() => this.finishedSets >= this.savedPlan.setsPerDay ? this.end() : this.start());
                    }, Button);
                    Button.pop();
                });
            }
            else if (this.stopConfirming) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Replace the action row while confirming so the card stays in the
                        // same visible area instead of being appended below the scroll
                        // content and covering the guidance text.
                        Column.create({ space: 6 });
                        // Replace the action row while confirming so the card stays in the
                        // same visible area instead of being appended below the scroll
                        // content and covering the guidance text.
                        Column.width('88%');
                        // Replace the action row while confirming so the card stays in the
                        // same visible area instead of being appended below the scroll
                        // content and covering the guidance text.
                        Column.padding({ left: 14, right: 14, top: 10, bottom: 10 });
                        // Replace the action row while confirming so the card stays in the
                        // same visible area instead of being appended below the scroll
                        // content and covering the guidance text.
                        Column.backgroundColor(this.accentColor());
                        // Replace the action row while confirming so the card stays in the
                        // same visible area instead of being appended below the scroll
                        // content and covering the guidance text.
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('stopConfirmTitle'));
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(this.textColor());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('stopConfirmBody'));
                        Text.fontSize(12);
                        Text.fontColor(this.mutedColor());
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('cancel'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(13);
                        Button.fontColor(this.primaryColor());
                        Button.backgroundColor(this.accentColor());
                        Button.onClick(() => this.stopConfirming = false);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('confirmStop'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(13);
                        Button.fontColor(this.onPrimaryColor());
                        Button.backgroundColor(this.primaryColor());
                        Button.onClick(() => this.end());
                    }, Button);
                    Button.pop();
                    Row.pop();
                    // Replace the action row while confirming so the card stays in the
                    // same visible area instead of being appended below the scroll
                    // content and covering the guidance text.
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 12 });
                        Row.width('88%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.paused ? this.text('resume') : this.text('pause'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(52);
                        Button.fontSize(16);
                        Button.fontColor(this.primaryColor());
                        Button.backgroundColor(this.primaryContainerColor());
                        Button.stateEffect(true);
                        Button.onClick(() => this.togglePause());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('stop'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(52);
                        Button.fontSize(16);
                        Button.fontColor(this.textColor());
                        Button.backgroundColor(this.surfaceColor());
                        Button.stateEffect(true);
                        Button.onClick(() => this.stopConfirming = true);
                    }, Button);
                    Button.pop();
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
    }
    private stepper(label: string, key: string, unit: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 14, bottom: 14 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(unit);
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('−', { type: ButtonType.Circle });
            Button.width(38);
            Button.height(38);
            Button.fontSize(20);
            Button.backgroundColor(this.accentColor());
            Button.fontColor(this.primaryColor());
            Button.onClick(() => this.updatePlan(key, -1));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${key === 'tighten' ? this.plan.tightenSeconds : key === 'relax' ? this.plan.relaxSeconds : key === 'repetitions' ? this.plan.repetitions : this.plan.setsPerDay}`);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor());
            Text.width(42);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+', { type: ButtonType.Circle });
            Button.width(38);
            Button.height(38);
            Button.fontSize(20);
            Button.backgroundColor(this.primaryContainerColor());
            Button.fontColor(this.primaryColor());
            Button.onClick(() => this.updatePlan(key, 1));
        }, Button);
        Button.pop();
        Row.pop();
        Row.pop();
    }
    private planView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 260, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 18 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 24, bottom: 28 });
        }, Column);
        this.header.bind(this)(this.text('plan'), this.text('greeting'));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 18, right: 18 });
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.stepper.bind(this)(this.text('tighten'), 'tighten', this.secondsLabel());
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(this.pageBorder());
        }, Divider);
        this.stepper.bind(this)(this.text('relax'), 'relax', this.secondsLabel());
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(this.pageBorder());
        }, Divider);
        this.stepper.bind(this)(this.text('repetitions'), 'repetitions', this.text('sets'));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(this.pageBorder());
        }, Divider);
        this.stepper.bind(this)(this.text('setCount'), 'sets', this.text('setUnit'));
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(this.accentColor());
            Column.borderRadius(18);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('recommendationTitle'));
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.planGuidance());
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('reminderSyncHint'));
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.plan.tightenSeconds}s ${this.text('tighten')} + ${this.plan.relaxSeconds}s ${this.text('relax')} × ${this.plan.repetitions} · ${this.plan.setsPerDay} ${this.text('setUnit')}`);
            Text.fontSize(14);
            Text.fontColor(this.mutedColor());
            Text.width('100%');
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.text('save'), { type: ButtonType.Capsule });
            Button.width('100%');
            Button.height(52);
            Button.fontSize(16);
            Button.fontColor(this.onPrimaryColor());
            Button.backgroundColor(this.primaryColor());
            Button.stateEffect(true);
            Button.onClick(() => this.savePlan());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('healthNote'));
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
    }
    private calendarHeatColor(dateKey: string): string {
        const completedSets: number = this.model.progressFor(dateKey).completedSets;
        if (completedSets <= 0) {
            return this.pageBackground();
        }
        const targetSets: number = Math.max(1, this.savedPlan.setsPerDay);
        const completionRatio: number = Math.min(1, completedSets / targetSets);
        const foregroundWeight: number = 0.18 + completionRatio * 0.68;
        return blendHexColor(this.primaryColor(), this.surfaceColor(), foregroundWeight);
    }
    private calendarCellTextColor(dateKey: string): string {
        const completedSets: number = this.model.progressFor(dateKey).completedSets;
        const targetSets: number = Math.max(1, this.savedPlan.setsPerDay);
        return completedSets >= Math.ceil(targetSets * 0.67) ? this.onPrimaryColor() : this.textColor();
    }
    private calendarView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 260, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 18 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 24, bottom: 28 });
        }, Column);
        this.header.bind(this)(this.text('calendar'), this.text('sets'));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            Button.width(38);
            Button.height(38);
            Button.backgroundColor(this.surfaceColor());
            Button.onClick(() => this.month = new Date(this.month.getFullYear(), this.month.getMonth() - 1, 1));
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['icons/chevron_left.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
            Image.width(22);
            Image.height(22);
            Image.objectFit(ImageFit.Contain);
            Image.colorFilter(this.navColorFilter('calendar'));
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.monthTitle());
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.textColor());
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            Button.width(38);
            Button.height(38);
            Button.backgroundColor(this.surfaceColor());
            Button.onClick(() => this.month = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1));
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['icons/chevron_right.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
            Image.width(22);
            Image.height(22);
            Image.objectFit(ImageFit.Contain);
            Image.colorFilter(this.navColorFilter('calendar'));
        }, Image);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const index = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.weekday(index));
                    Text.fontSize(12);
                    Text.fontColor(this.mutedColor());
                    Text.width('14.28%');
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, [0, 1, 2, 3, 4, 5, 6], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const cell = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    globalThis.Context.animation({ duration: 180, curve: Curve.EaseOut });
                    Column.width('14.28%');
                    Column.height(48);
                    Column.justifyContent(FlexAlign.Center);
                    Column.borderRadius(14);
                    Column.backgroundColor(cell.dateKey === this.selectedDate ? this.primaryColor() : cell.day > 0 ? this.calendarHeatColor(cell.dateKey) : this.pageBackground());
                    Column.scale({ x: cell.dateKey === this.selectedDate ? 1.04 : 1, y: cell.dateKey === this.selectedDate ? 1.04 : 1 });
                    globalThis.Context.animation(null);
                    Column.onClick(() => { if (cell.day > 0) {
                        this.selectedDate = cell.dateKey;
                    } });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (cell.day > 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${cell.day}`);
                                Text.fontSize(14);
                                Text.fontColor(cell.dateKey === this.selectedDate ? this.onPrimaryColor() : this.calendarCellTextColor(cell.dateKey));
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.cells(), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(this.accentColor());
            Column.borderRadius(18);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('recommendationTitle'));
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.calendarGuidance());
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedDate);
            Text.fontSize(15);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.selectedProgress().completedSets} / ${this.savedPlan.setsPerDay} ${this.text('setUnit')}`);
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedProgress().completedSets === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('noRecord'));
                        Text.fontSize(13);
                        Text.fontColor(this.mutedColor());
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.selectedProgress().totalSeconds}s`);
                        Text.fontSize(13);
                        Text.fontColor(this.mutedColor());
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    private introCard(title: string, body: string, icon: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
            Row.padding(18);
            Row.backgroundColor(this.surfaceColor());
            Row.borderRadius(22);
            Row.transition(TransitionEffect.OPACITY.animation({ duration: 340, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 12 })));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.fontSize(24);
            Text.fontColor(this.primaryColor());
            Text.width(32);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(body);
            Text.fontSize(14);
            Text.lineHeight(22);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    private introContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(this.primaryColor());
            Column.borderRadius(24);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['illustrations/breathing_ring.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
            Image.width('100%');
            Image.height(92);
            Image.objectFit(ImageFit.Contain);
            Image.opacity(0.92);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('5s');
            Text.fontSize(30);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.onPrimaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('tighten'));
            Text.fontSize(13);
            Text.fontColor(this.onPrimaryColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('→');
            Text.fontSize(24);
            Text.fontColor(this.onPrimaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('5s');
            Text.fontSize(30);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.onPrimaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('relax'));
            Text.fontSize(13);
            Text.fontColor(this.onPrimaryColor());
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
        this.introCard.bind(this)(this.text('introWhat'), this.text('introWhatBody'), '◉');
        this.introCard.bind(this)(this.text('introHow'), this.text('introHowBody'), '◷');
        this.introCard.bind(this)(this.text('introTips'), this.text('introTipsBody'), '♧');
        this.introCard.bind(this)(this.text('introProgress'), this.text('introProgressBody'), '✦');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('healthNote'));
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
    }
    private introView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 260, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 18 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 24, bottom: 28 });
        }, Column);
        this.header.bind(this)(this.text('intro'), this.text('introSubtitle'));
        this.introContent.bind(this)();
        Column.pop();
        Scroll.pop();
    }
    private navColorFilter(page: AppPage): ColorFilter {
        const hex: string = normalizeHexColor(page === this.page ? this.primaryColor() : this.mutedColor()).substring(1);
        const red: number = parseInt(hex.substring(0, 2), 16) / 255;
        const green: number = parseInt(hex.substring(2, 4), 16) / 255;
        const blue: number = parseInt(hex.substring(4, 6), 16) / 255;
        return new ColorFilter([
            0, 0, 0, 0, red,
            0, 0, 0, 0, green,
            0, 0, 0, 0, blue,
            0, 0, 0, 1, 0
        ]);
    }
    private navIcon(page: AppPage, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (page === 'home') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/nav_home.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.navColorFilter(page));
                    }, Image);
                });
            }
            else if (page === 'plan') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/nav_plan.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.navColorFilter(page));
                    }, Image);
                });
            }
            else if (page === 'calendar') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/nav_calendar.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.navColorFilter(page));
                    }, Image);
                });
            }
            else if (page === 'intro') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/nav_intro.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.navColorFilter(page));
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['icons/nav_settings.svg'], "bundleName": "com.kaigeer.training", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                        Image.colorFilter(this.navColorFilter(page));
                    }, Image);
                });
            }
        }, If);
        If.pop();
    }
    private statsView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('stats'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('statsHint'));
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('statsTotal'));
            Text.fontSize(11);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.totalRepetitions()}`);
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('statsUnit'));
            Text.fontSize(11);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.totalRepetitions() > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('statsRecent'));
                        Text.fontSize(13);
                        Text.fontColor(this.mutedColor());
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 6 });
                        Row.width('100%');
                        Row.height(152);
                        Row.alignItems(VerticalAlign.Bottom);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const day = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 5 });
                                Column.layoutWeight(1);
                                Column.alignItems(HorizontalAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create({ alignContent: Alignment.Bottom });
                                Stack.width(22);
                                Stack.height(116);
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width(22);
                                Column.height(116);
                                Column.backgroundColor(this.pageBorder());
                                Column.borderRadius(11);
                            }, Column);
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                globalThis.Context.animation({ duration: 260, curve: Curve.EaseOut });
                                Column.width(22);
                                Column.height(this.statsBarHeight(day.repetitions, this.statsMax(this.statsDays())));
                                Column.backgroundColor(this.primaryColor());
                                Column.borderRadius(11);
                                globalThis.Context.animation(null);
                            }, Column);
                            Column.pop();
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(day.label);
                                Text.fontSize(10);
                                Text.fontColor(this.mutedColor());
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${day.repetitions}`);
                                Text.fontSize(11);
                                Text.fontColor(this.textColor());
                            }, Text);
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.statsDays(), forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('statsEmpty'));
                        Text.fontSize(13);
                        Text.lineHeight(20);
                        Text.fontColor(this.mutedColor());
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.statsClearConfirming) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('100%');
                        Column.padding(12);
                        Column.backgroundColor(this.accentColor());
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('statsClearConfirm'));
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(this.textColor());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text('statsClearBody'));
                        Text.fontSize(12);
                        Text.fontColor(this.mutedColor());
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('statsCancel'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(13);
                        Button.fontColor(this.primaryColor());
                        Button.backgroundColor(this.accentColor());
                        Button.onClick(() => this.statsClearConfirming = false);
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('statsClear'), { type: ButtonType.Capsule });
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(13);
                        Button.fontColor(this.onPrimaryColor());
                        Button.backgroundColor(this.primaryColor());
                        Button.onClick(() => this.clearLocalStats());
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else if (this.totalRepetitions() > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('statsClear'), { type: ButtonType.Capsule });
                        Button.width('100%');
                        Button.height(40);
                        Button.fontSize(13);
                        Button.fontColor(this.primaryColor());
                        Button.backgroundColor(this.accentColor());
                        Button.onClick(() => this.statsClearConfirming = true);
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private settingsView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.layoutWeight(1);
            Scroll.transition(TransitionEffect.OPACITY.animation({ duration: 260, curve: Curve.EaseOut }).combine(TransitionEffect.translate({ y: 18 })));
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 24, bottom: 28 });
        }, Column);
        this.header.bind(this)(this.text('settings'), this.text('greeting'));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Keep reminder controls near the top so the next training time is
            // visible as soon as the settings page opens.
            Column.create({ space: 12 });
            // Keep reminder controls near the top so the next training time is
            // visible as soon as the settings page opens.
            Column.width('100%');
            // Keep reminder controls near the top so the next training time is
            // visible as soon as the settings page opens.
            Column.padding(18);
            // Keep reminder controls near the top so the next training time is
            // visible as soon as the settings page opens.
            Column.backgroundColor(this.surfaceColor());
            // Keep reminder controls near the top so the next training time is
            // visible as soon as the settings page opens.
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('reminders'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('remindersHint'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.remindersEnabled ? 'ON' : 'OFF', { type: ButtonType.Capsule });
            Button.width(60);
            Button.height(34);
            Button.fontSize(12);
            Button.fontColor(this.remindersEnabled ? this.onPrimaryColor() : this.mutedColor());
            Button.backgroundColor(this.remindersEnabled ? this.primaryColor() : this.pageBorder());
            Button.stateEffect(true);
            Button.onClick(() => this.toggleReminders());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('reminderEditHint'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const time = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding({ top: 6, bottom: 6 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${index + 1}`);
                    Text.fontSize(14);
                    Text.fontColor(this.primaryColor());
                    Text.width(26);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(time, { type: ButtonType.Capsule });
                    Button.layoutWeight(1);
                    Button.height(40);
                    Button.fontSize(16);
                    Button.fontColor(this.textColor());
                    Button.backgroundColor(this.accentColor());
                    Button.stateEffect(true);
                    Button.onClick(() => this.editReminderTime(index));
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('−', { type: ButtonType.Circle });
                    Button.width(38);
                    Button.height(38);
                    Button.fontSize(20);
                    Button.fontColor(this.textColor());
                    Button.backgroundColor(this.accentColor());
                    Button.stateEffect(true);
                    Button.onClick(() => this.removeReminderTime(index));
                }, Button);
                Button.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.reminderTimes, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.reminderTimes.length < this.maxReminderCount()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.text('addReminder'), { type: ButtonType.Capsule });
                        Button.height(38);
                        Button.fontSize(13);
                        Button.fontColor(this.primaryColor());
                        Button.backgroundColor(this.accentColor());
                        Button.stateEffect(true);
                        Button.onClick(() => this.addReminderTime());
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // Keep reminder controls near the top so the next training time is
        // visible as soon as the settings page opens.
        Column.pop();
        this.statsView.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('voice'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('voiceHint'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.voiceLanguage === 'en-US' ? 'English' : '中文');
            Text.fontSize(14);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(item.label, { type: ButtonType.Capsule });
                    Button.layoutWeight(1);
                    Button.height(40);
                    Button.fontSize(13);
                    Button.fontColor(item.value === this.voiceLanguage ? this.onPrimaryColor() : this.primaryColor());
                    Button.backgroundColor(item.value === this.voiceLanguage ? this.primaryColor() : this.accentColor());
                    Button.stateEffect(true);
                    Button.onClick(() => this.selectVoice(item.value));
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, [new VoiceOption('中文', 'zh-CN'), new VoiceOption('English', 'en-US')], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('darkMode'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.darkMode ? this.text('dark') : this.text('light'), { type: ButtonType.Capsule, stateEffect: true });
            Button.width(78);
            Button.height(36);
            Button.fontSize(13);
            Button.fontColor(this.darkMode ? this.onPrimaryColor() : this.primaryColor());
            Button.backgroundColor(this.darkMode ? this.primaryColor() : this.accentColor());
            Button.onClick(() => this.toggleDarkMode());
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('haptics'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('hapticsHint'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.hapticsEnabled ? this.text('hapticsOn') : this.text('hapticsOff'), { type: ButtonType.Capsule, stateEffect: true });
            Button.width(78);
            Button.height(36);
            Button.fontSize(13);
            Button.fontColor(this.hapticsEnabled ? this.onPrimaryColor() : this.primaryColor());
            Button.backgroundColor(this.hapticsEnabled ? this.primaryColor() : this.accentColor());
            Button.onClick(() => this.toggleHaptics());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.text('hapticsTest'), { type: ButtonType.Capsule, stateEffect: true });
            Button.width(64);
            Button.height(36);
            Button.fontSize(13);
            Button.fontColor(this.primaryColor());
            Button.backgroundColor(this.accentColor());
            Button.onClick(() => this.testTrainingHaptic());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'On the phone, the same rhythm is used as on the wearable.' : '开启后，手机训练时也会按收紧与放松节奏震动。');
            Text.fontSize(11);
            Text.lineHeight(16);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.onClick(() => this.introExpanded = !this.introExpanded);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('intro'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('introSubtitle'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.introExpanded ? '⌃' : '›');
            Text.fontSize(24);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.introExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.introContent.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(18);
            Column.backgroundColor(this.surfaceColor());
            Column.borderRadius(22);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('theme'));
            Text.fontSize(16);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text('themeHint'));
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.themeLabel());
            Text.fontSize(14);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 6 });
                    globalThis.Context.animation({ duration: 180, curve: Curve.EaseOut });
                    Column.layoutWeight(1);
                    Column.scale({ x: item.value === this.themeColor ? 1.08 : 1, y: item.value === this.themeColor ? 1.08 : 1 });
                    globalThis.Context.animation(null);
                    Column.onClick(() => this.selectTheme(item.value));
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(28);
                    Circle.height(28);
                    Circle.fill(item.swatch);
                    Circle.border({ width: item.value === this.themeColor ? 3 : 0, color: this.primaryColor() });
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.label);
                    Text.fontSize(11);
                    Text.fontColor(item.value === this.themeColor ? this.primaryColor() : this.mutedColor());
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, [
                new ThemeOption(this.text('themeTeal'), 'teal', '#087F73'),
                new ThemeOption(this.text('themeBlue'), 'blue', '#45618F'),
                new ThemeOption(this.text('themePurple'), 'purple', '#6750A4'),
                new ThemeOption(this.text('themeOrange'), 'orange', '#8A4E00'),
                new ThemeOption(this.text('themeRose'), 'rose', '#984061'),
                new ThemeOption(this.text('themeGreen'), 'green', '#4B5F2A')
            ], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color(this.pageBorder());
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
            Row.onClick(() => this.openColorPicker());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Color picker' : '自定义取色器');
            Text.fontSize(15);
            Text.fontColor(this.textColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locale === 'en' ? 'Tap to open the picker' : '点击打开取色器');
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(34);
            Circle.height(34);
            Circle.fill(this.activeAccentColor());
            Circle.border({ width: this.themeColor === 'custom' ? 3 : 0, color: this.primaryColor() });
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.activeAccentColor());
            Text.fontSize(12);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('›');
            Text.fontSize(24);
            Text.fontColor(this.primaryColor());
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('凯格尔训练 · v1.0.0');
            Text.fontSize(12);
            Text.fontColor(this.mutedColor());
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
    }
    private navView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(70);
            Row.backgroundColor(this.pageBackground());
            Row.border({ width: { top: 1 }, color: this.pageBorder() });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    globalThis.Context.animation({ duration: 180, curve: Curve.EaseOut });
                    Column.layoutWeight(1);
                    Column.height(62);
                    Column.justifyContent(FlexAlign.Center);
                    Column.scale({ x: item.page === this.page ? 1.06 : 1, y: item.page === this.page ? 1.06 : 1 });
                    globalThis.Context.animation(null);
                    Column.onClick(() => this.page = item.page);
                }, Column);
                this.navIcon.bind(this)(item.page);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.label);
                    Text.fontSize(11);
                    Text.fontColor(item.page === this.page ? this.primaryColor() : this.mutedColor());
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, [new NavItem('home', this.text('home')), new NavItem('plan', this.text('plan')), new NavItem('calendar', this.text('calendar')), new NavItem('settings', this.text('settings'))], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.pageBackground());
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.wearableMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.page === 'train') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new WearableTrainView(this, {
                                                phase: this.phase,
                                                remaining: this.remaining,
                                                repetition: this.visibleRepetition(),
                                                repetitions: this.savedPlan.repetitions,
                                                finishedSets: this.finishedSets,
                                                setsPerDay: this.savedPlan.setsPerDay,
                                                paused: this.paused,
                                                countdownScale: this.countdownScale,
                                                breathingScale: this.breathingScale,
                                                breathingOffsetX: this.breathingOffsetX,
                                                breathingOffsetY: this.breathingOffsetY,
                                                progressPercent: this.repetitionProgressPercent(),
                                                phaseLabel: this.trainingPhaseLabel(),
                                                primaryColor: this.trainingRingColor(),
                                                onPrimaryColor: this.onPrimaryColor(),
                                                pageBackground: this.pageBackground(),
                                                accentColor: this.accentColor(),
                                                textColor: this.textColor(),
                                                mutedColor: this.mutedColor(),
                                                ringTrackColor: this.trainingRingTrackColor(),
                                                completeLabel: this.text('complete'),
                                                secondsLabel: this.text('secondsShort'),
                                                confirmStopLabel: this.text('confirmStop'),
                                                homeLabel: this.text('home'),
                                                startLabel: this.text('start'),
                                                locale: this.locale,
                                                onTogglePause: () => this.togglePause(),
                                                onEnd: () => this.end(),
                                                onCompleteAction: () => {
                                                    if (this.finishedSets >= this.savedPlan.setsPerDay) {
                                                        this.end();
                                                    }
                                                    else {
                                                        this.start();
                                                    }
                                                }
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 1950, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    phase: this.phase,
                                                    remaining: this.remaining,
                                                    repetition: this.visibleRepetition(),
                                                    repetitions: this.savedPlan.repetitions,
                                                    finishedSets: this.finishedSets,
                                                    setsPerDay: this.savedPlan.setsPerDay,
                                                    paused: this.paused,
                                                    countdownScale: this.countdownScale,
                                                    breathingScale: this.breathingScale,
                                                    breathingOffsetX: this.breathingOffsetX,
                                                    breathingOffsetY: this.breathingOffsetY,
                                                    progressPercent: this.repetitionProgressPercent(),
                                                    phaseLabel: this.trainingPhaseLabel(),
                                                    primaryColor: this.trainingRingColor(),
                                                    onPrimaryColor: this.onPrimaryColor(),
                                                    pageBackground: this.pageBackground(),
                                                    accentColor: this.accentColor(),
                                                    textColor: this.textColor(),
                                                    mutedColor: this.mutedColor(),
                                                    ringTrackColor: this.trainingRingTrackColor(),
                                                    completeLabel: this.text('complete'),
                                                    secondsLabel: this.text('secondsShort'),
                                                    confirmStopLabel: this.text('confirmStop'),
                                                    homeLabel: this.text('home'),
                                                    startLabel: this.text('start'),
                                                    locale: this.locale,
                                                    onTogglePause: () => this.togglePause(),
                                                    onEnd: () => this.end(),
                                                    onCompleteAction: () => {
                                                        if (this.finishedSets >= this.savedPlan.setsPerDay) {
                                                            this.end();
                                                        }
                                                        else {
                                                            this.start();
                                                        }
                                                    }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                phase: this.phase,
                                                remaining: this.remaining,
                                                repetition: this.visibleRepetition(),
                                                repetitions: this.savedPlan.repetitions,
                                                finishedSets: this.finishedSets,
                                                setsPerDay: this.savedPlan.setsPerDay,
                                                paused: this.paused,
                                                countdownScale: this.countdownScale,
                                                breathingScale: this.breathingScale,
                                                breathingOffsetX: this.breathingOffsetX,
                                                breathingOffsetY: this.breathingOffsetY,
                                                progressPercent: this.repetitionProgressPercent(),
                                                phaseLabel: this.trainingPhaseLabel(),
                                                primaryColor: this.trainingRingColor(),
                                                onPrimaryColor: this.onPrimaryColor(),
                                                pageBackground: this.pageBackground(),
                                                accentColor: this.accentColor(),
                                                textColor: this.textColor(),
                                                mutedColor: this.mutedColor(),
                                                ringTrackColor: this.trainingRingTrackColor(),
                                                completeLabel: this.text('complete'),
                                                secondsLabel: this.text('secondsShort'),
                                                confirmStopLabel: this.text('confirmStop'),
                                                homeLabel: this.text('home'),
                                                startLabel: this.text('start'),
                                                locale: this.locale
                                            });
                                        }
                                    }, { name: "WearableTrainView" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new WearableHomeView(this, {
                                                locale: this.locale,
                                                wearableTab: this.wearableTab,
                                                primaryColor: this.primaryColor(),
                                                onPrimaryColor: this.onPrimaryColor(),
                                                pageBackground: this.pageBackground(),
                                                pageBorder: this.pageBorder(),
                                                accentColor: this.accentColor(),
                                                textColor: this.textColor(),
                                                mutedColor: this.mutedColor(),
                                                completedSets: this.today().completedSets,
                                                targetSets: this.savedPlan.setsPerDay,
                                                completedRepetitions: this.today().completedRepetitions ?? 0,
                                                targetRepetitions: this.savedPlan.repetitions,
                                                remindersEnabled: this.remindersEnabled,
                                                reminderTimes: this.reminderTimes,
                                                maxReminderCount: this.maxReminderCount(),
                                                onStart: () => this.start(),
                                                onChangeTab: (index: number) => this.wearableTab = index,
                                                onToggleReminders: () => this.toggleReminders(),
                                                // The wearable uses its own +/- editor; never open the phone
                                                // time-picker dialog from this compact surface.
                                                onSetReminder: (index: number, value: string) => this.setReminderTimeFromWearable(index, value),
                                                onAddReminder: () => this.addReminderTimeForWearable(),
                                                onRemoveReminder: (index: number) => this.removeReminderTime(index)
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 1988, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    locale: this.locale,
                                                    wearableTab: this.wearableTab,
                                                    primaryColor: this.primaryColor(),
                                                    onPrimaryColor: this.onPrimaryColor(),
                                                    pageBackground: this.pageBackground(),
                                                    pageBorder: this.pageBorder(),
                                                    accentColor: this.accentColor(),
                                                    textColor: this.textColor(),
                                                    mutedColor: this.mutedColor(),
                                                    completedSets: this.today().completedSets,
                                                    targetSets: this.savedPlan.setsPerDay,
                                                    completedRepetitions: this.today().completedRepetitions ?? 0,
                                                    targetRepetitions: this.savedPlan.repetitions,
                                                    remindersEnabled: this.remindersEnabled,
                                                    reminderTimes: this.reminderTimes,
                                                    maxReminderCount: this.maxReminderCount(),
                                                    onStart: () => this.start(),
                                                    onChangeTab: (index: number) => this.wearableTab = index,
                                                    onToggleReminders: () => this.toggleReminders(),
                                                    // The wearable uses its own +/- editor; never open the phone
                                                    // time-picker dialog from this compact surface.
                                                    onSetReminder: (index: number, value: string) => this.setReminderTimeFromWearable(index, value),
                                                    onAddReminder: () => this.addReminderTimeForWearable(),
                                                    onRemoveReminder: (index: number) => this.removeReminderTime(index)
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                locale: this.locale,
                                                wearableTab: this.wearableTab,
                                                primaryColor: this.primaryColor(),
                                                onPrimaryColor: this.onPrimaryColor(),
                                                pageBackground: this.pageBackground(),
                                                pageBorder: this.pageBorder(),
                                                accentColor: this.accentColor(),
                                                textColor: this.textColor(),
                                                mutedColor: this.mutedColor(),
                                                completedSets: this.today().completedSets,
                                                targetSets: this.savedPlan.setsPerDay,
                                                completedRepetitions: this.today().completedRepetitions ?? 0,
                                                targetRepetitions: this.savedPlan.repetitions,
                                                remindersEnabled: this.remindersEnabled,
                                                reminderTimes: this.reminderTimes,
                                                maxReminderCount: this.maxReminderCount()
                                            });
                                        }
                                    }, { name: "WearableHomeView" });
                                }
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.page !== 'train') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.header.bind(this)(this.pageTitle(), this.pageSubtitle(), true);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.page === 'train') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.layoutWeight(1);
                                }, Column);
                                this.trainView.bind(this)();
                                Column.pop();
                            });
                        }
                        else if (this.page === 'home') {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.homeView.bind(this)();
                                this.navView.bind(this)();
                            });
                        }
                        else if (this.page === 'plan') {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.planView.bind(this)();
                                this.navView.bind(this)();
                            });
                        }
                        else if (this.page === 'calendar') {
                            this.ifElseBranchUpdateFunction(3, () => {
                                this.calendarView.bind(this)();
                                this.navView.bind(this)();
                            });
                        }
                        else if (this.page === 'intro') {
                            this.ifElseBranchUpdateFunction(4, () => {
                                this.introView.bind(this)();
                                this.navView.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(5, () => {
                                this.settingsView.bind(this)();
                                this.navView.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.toast.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.toast);
                        Text.width('88%');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.textAlign(TextAlign.Center);
                        Text.lineHeight(20);
                        Text.position({ x: this.wearableMode ? 18 : 24, y: this.wearableMode ? 370 : 690 });
                        Text.padding({ left: 16, right: 16, top: 10, bottom: 10 });
                        Text.fontSize(13);
                        Text.fontColor(this.onPrimaryColor());
                        Text.backgroundColor(this.textColor());
                        Text.borderRadius(18);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.kaigeer.training", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
