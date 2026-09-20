import { common } from '@kit.AbilityKit';
import { notificationManager } from '@kit.NotificationKit';
import { reminderAgentManager } from '@kit.BackgroundTasksKit';
import { ReminderSettings } from '../model/AppModel';

export class ReminderApplyResult {
  success: boolean;
  published: number;
  errorCode: number;

  constructor(success: boolean = true, published: number = 0, errorCode: number = -1) {
    this.success = success;
    this.published = published;
    this.errorCode = errorCode;
  }
}

function errorCode(error: Object): number {
  const message: string = JSON.stringify(error);
  if (message.indexOf('1700001') >= 0) {
    return 1700001;
  }
  if (message.indexOf('1700002') >= 0) {
    return 1700002;
  }
  if (message.indexOf('201') >= 0) {
    return 201;
  }
  return -1;
}

export class ReminderService {
  private static reminderIds: Array<number> = [];

  static async requestPermission(context: common.UIAbilityContext): Promise<boolean> {
    try {
      await notificationManager.requestEnableNotification(context);
      return true;
    } catch (error) {
      console.error(`Notification permission request failed: ${JSON.stringify(error)}`);
      return false;
    }
  }

  static async apply(context: common.UIAbilityContext, settings: ReminderSettings): Promise<ReminderApplyResult> {
    await ReminderService.cancelAll();
    if (!settings.enabled) {
      return new ReminderApplyResult(true, 0);
    }
    const permissionGranted: boolean = await ReminderService.requestPermission(context);
    if (!permissionGranted) {
      return new ReminderApplyResult(false, 0, 1700001);
    }
    let published: number = 0;
    let lastErrorCode: number = -1;
    for (const time of settings.times.slice(0, 3)) {
      const parts: Array<string> = time.split(':');
      const hour: number = Number(parts[0]);
      const minute: number = Number(parts[1]);
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        continue;
      }
      const alarm: reminderAgentManager.ReminderRequestAlarm = {
        reminderType: reminderAgentManager.ReminderType.REMINDER_TYPE_ALARM,
        hour,
        minute,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        title: '凯格尔训练',
        content: '今天的盆底肌训练时间到了',
        expiredContent: '打开凯格尔训练，完成今天的练习',
        notificationId: 1000 + hour * 60 + minute
      };
      try {
        const id: number = await reminderAgentManager.publishReminder(alarm);
        ReminderService.reminderIds.push(id);
        published += 1;
      } catch (error) {
        lastErrorCode = errorCode(error as Object);
        console.error(`Reminder publish failed: ${JSON.stringify(error)}`);
      }
    }
    return new ReminderApplyResult(published > 0 && lastErrorCode < 0, published, lastErrorCode);
  }

  static async cancelAll(): Promise<void> {
    const ids: Array<number> = [...ReminderService.reminderIds];
    ReminderService.reminderIds = [];
    // Reminder IDs survive process restarts. Query the system before
    // cancelling so edited or removed times do not leave stale alarms behind.
    try {
      const active: Array<reminderAgentManager.ReminderInfo> = await reminderAgentManager.getAllValidReminders();
      for (const item of active) {
        if (ids.indexOf(item.reminderId) < 0) {
          ids.push(item.reminderId);
        }
      }
    } catch (error) {
      console.error(`Reminder query failed: ${JSON.stringify(error)}`);
    }
    for (const id of ids) {
      try {
        await reminderAgentManager.cancelReminder(id);
      } catch (error) {
        console.error(`Reminder cancel failed: ${JSON.stringify(error)}`);
      }
    }
  }
}
