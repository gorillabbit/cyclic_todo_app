import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

export const checkTaskDue = dueString => {
  const today = new Date();
  const due = new Date(dueString);
  const diffTime = due - today;
  return diffTime / (1000 * 60 * 60 * 24);
};

export const checkLastLogCompleted = lastCompleted => {
  const today = new Date();
  const due = new Date(lastCompleted);
  const diffDays = differenceInDays(today, due);
  const diffHours = differenceInHours(today, due) % 24;
  const diffMinutes = differenceInMinutes(today, due) % 60;
  const result = `${diffDays}日${diffHours}時間${diffMinutes}分`;
  return result;
};

export const calculateNext期日 = (task, 更新元date) => {
  const 周期日数 = parseInt(task.周期日数);
  switch (task.周期3) {
    case '日':
      更新元date.setDate(更新元date.getDate() + 周期日数);
      break;
    case '週':
      更新元date.setDate(更新元date.getDate() + 周期日数 * 7);
      break;
    case '月':
      更新元date.setMonth(更新元date.getMonth() + 周期日数);
      break;
    case '年':
      更新元date.setFullYear(更新元date.getFullYear() + 周期日数);
      break;
    default:
      break;
  }
  return format(更新元date, 'yyyy-MM-dd');
};
